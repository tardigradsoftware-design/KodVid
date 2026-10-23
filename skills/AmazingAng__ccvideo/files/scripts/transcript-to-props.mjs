#!/usr/bin/env node
// Convert a real Claude Code session transcript (JSONL) into a grounded
// captures/<name>/props.json for the xvideo pipeline. The video then replays
// what actually happened: the real prompt, real Write/Edit/Bash tool calls,
// real command output, and the assistant's real summary bullets.
//
// Usage:
//   node scripts/transcript-to-props.mjs <session.jsonl> \
//     --prompt-match <substring>          # pick the turn by prompt content
//     --out captures/<name>               # output dir (default captures/replay)
//     --title "..." --subtitle "..."      # intro card (presentational)
//     --outro-title "..." --outro-subtitle "..."

import {mkdir, readFile, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// --- Redaction -------------------------------------------------------------
// Captures are meant to be committed; never persist secrets or absolute
// personal paths. Applied to everything stored in raw-events.json.

const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{8,}/g,
  /sk_(?:live|test)_[A-Za-z0-9]{10,}/g,
  /AIza[0-9A-Za-z_-]{30,}/g,
  /(Bearer\s+)[A-Za-z0-9._~+/=-]{10,}/g,
  /gh[pousr]_[A-Za-z0-9]{20,}/g,
  /xox[baprs]-[A-Za-z0-9-]{10,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  // URL userinfo credentials: scheme://user:pass@host
  /(\b[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\/\s:@'"]+:)[^\/\s@'"]+(?=@)/g,
  // env-style assignments, any case
  /\b([A-Za-z_]*(?:TOKEN|KEY|SECRET|PASSWORD|PASSWD|CREDENTIAL)[A-Za-z_]*\s*=\s*)['"]?[^\s'"]+/gi,
  // JSON-style fields
  /("(?:password|passwd|secret|token|api_?key|access_?key)"\s*:\s*")[^"]+/gi,
];

// The home dir also appears flattened into path slugs (e.g. Claude project
// dirs: /-Users-name-…). Scrub both spellings.
const HOME = os.homedir();
const HOME_SLUG = HOME.replace(/\//g, '-');

let redactions = 0;
const scrub = (text) => {
  if (typeof text !== 'string') return text;
  let out = text;
  for (const re of SECRET_PATTERNS) {
    out = out.replace(re, (m, keep) => {
      redactions++;
      return keep ? `${keep}[REDACTED]` : '[REDACTED]';
    });
  }
  return out.split(HOME).join('~').split(HOME_SLUG).join('~');
};

const args = process.argv.slice(2);
const jsonlPath = args.find((a) => !a.startsWith('--'));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

if (!jsonlPath) {
  console.error('Usage: node scripts/transcript-to-props.mjs <session.jsonl> [--prompt-match str] [--out dir]');
  process.exit(1);
}

const OUT_DIR = flag('out', 'captures/replay');
const PROMPT_MATCH = flag('prompt-match', null);
const MAX_CODE_LINES = 3;
const MAX_OUTPUT_LINES = 2;
const MAX_BULLETS = 2;
const MAX_BEATS = 5;

// --- Parse the transcript ---------------------------------------------------

const entries = (await readFile(jsonlPath, 'utf8'))
  .split('\n')
  .filter(Boolean)
  .map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const isUserPrompt = (e) =>
  e.type === 'user' &&
  !e.isSidechain &&
  typeof e.message?.content === 'string' &&
  e.message.content.trim().length > 0;

const prompts = entries.filter(isUserPrompt);
if (prompts.length === 0) {
  console.error('No user prompts found in transcript.');
  process.exit(1);
}

const promptEntry = PROMPT_MATCH
  ? prompts.find((e) => e.message.content.includes(PROMPT_MATCH))
  : prompts[0];
if (!promptEntry) {
  console.error(`No prompt matching "${PROMPT_MATCH}". Available prompts:`);
  for (const p of prompts) console.error(`  - ${p.message.content.slice(0, 70)}`);
  process.exit(1);
}

const startIdx = entries.indexOf(promptEntry);
let endIdx = entries.length;
for (let i = startIdx + 1; i < entries.length; i++) {
  if (isUserPrompt(entries[i])) {
    endIdx = i;
    break;
  }
}
const turn = entries.slice(startIdx + 1, endIdx).filter((e) => !e.isSidechain);

// --- Collect events ---------------------------------------------------------

const toolUses = new Map(); // tool_use id -> {name, input}
const events = []; // {type: 'write'|'edit'|'bash', ...}
let lastText = null;

for (const e of turn) {
  const content = e.message?.content;
  if (!Array.isArray(content)) continue;
  if (e.type === 'assistant') {
    for (const block of content) {
      if (block.type === 'text' && block.text?.trim()) {
        lastText = block.text;
      } else if (block.type === 'tool_use') {
        toolUses.set(block.id, {name: block.name, input: block.input ?? {}});
        const {name, input} = {name: block.name, input: block.input ?? {}};
        if (name === 'Write' && input.file_path && input.content) {
          const allLines = input.content.split('\n');
          const lineCount =
            allLines.length - (input.content.endsWith('\n') ? 1 : 0);
          events.push({
            type: 'write',
            path: scrub(input.file_path),
            lineCount,
            shownLines: allLines.slice(0, MAX_CODE_LINES).map(scrub),
          });
        } else if (name === 'Edit' && input.file_path) {
          events.push({type: 'edit', path: scrub(input.file_path)});
        } else if (name === 'Bash' && input.command) {
          events.push({type: 'bash', command: scrub(input.command), toolUseId: block.id, output: null});
        }
      }
    }
  } else if (e.type === 'user') {
    for (const block of content) {
      if (block.type === 'tool_result') {
        const ev = events.find((x) => x.type === 'bash' && x.toolUseId === block.tool_use_id);
        if (ev) {
          const raw = typeof block.content === 'string'
            ? block.content
            : Array.isArray(block.content)
              ? block.content.filter((c) => c.type === 'text').map((c) => c.text).join('\n')
              : '';
          ev.output = scrub(raw.split('\n').slice(0, 12).join('\n'));
        }
      }
    }
  }
}

// --- Build props via the shared deterministic builder ------------------------

import {buildBeatsDetailed, buildReplayProps} from './lib/replay-build.mjs';

// Everything is scrubbed BEFORE props are built, so props.json, the video,
// and the archived raw inputs all see identical, redacted content.
lastText = scrub(lastText);
const promptText = scrub(promptEntry.message.content.trim().replace(/\s+/g, ' '));
const options = {
  title: flag('title', 'A real session, replayed.'),
  subtitle: flag('subtitle', 'Recorded with Claude Code'),
  outroTitle: flag('outro-title', 'Claude Code'),
  outroSubtitle: flag('outro-subtitle', 'From prompt to production'),
};

const props = buildReplayProps({promptText, events, lastText, options});

if (props.session.beats.length === 0) {
  console.error('No usable events found in this turn.');
  process.exit(1);
}

// Persist only the inputs the video actually uses: the selected events
// (sans internal ids) and the summary bullet lines — nothing else from the
// session leaves the machine.
const {usedEvents, usedBulletLines} = buildBeatsDetailed(events, lastText);
const storedEvents = usedEvents.map(({toolUseId, ...rest}) => rest);
const storedLastText = usedBulletLines.join('\n') || null;

const meta = {
  capturedAt: new Date().toISOString(),
  source: path.basename(jsonlPath),
  promptTimestamp: promptEntry.timestamp ?? null,
  eventCount: storedEvents.length,
  redactions,
  sample: false,
};

await mkdir(OUT_DIR, {recursive: true});
await writeFile(path.join(OUT_DIR, 'props.json'), JSON.stringify(props, null, 2));
await writeFile(
  path.join(OUT_DIR, 'raw-events.json'),
  JSON.stringify(
    {prompt: promptText, events: storedEvents, lastText: storedLastText, options, meta},
    null,
    2,
  ),
);
if (redactions > 0) {
  console.warn(`⚠ Redacted ${redactions} secret-like value(s) from the capture.`);
}
console.log(`Turn: "${props.session.prompt}"`);
console.log(`Beats: ${props.session.beats.map((b) => b.kind).join(' → ')}`);
console.log(`Wrote ${OUT_DIR}/{props,raw-events}.json`);
