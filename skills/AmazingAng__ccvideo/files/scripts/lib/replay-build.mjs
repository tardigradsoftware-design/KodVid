// Deterministic replay props builder, shared by transcript-to-props.mjs
// (produce) and verify-props.mjs (reproduce & compare). Given the extracted
// raw events of a session turn, this rebuilds the exact props.json.

const MAX_CODE_LINES = 3;
const MAX_OUTPUT_LINES = 2;
const MAX_BULLETS = 2;
const MAX_BEATS = 5;

const KEYWORDS =
  /^(const|let|var|function|return|import|export|from|if|else|for|while|await|async|new|class|type|interface)$/;

export const tokenizeLine = (line) => {
  if (/^\s*(\/\/|#)/.test(line)) return [{t: 'comment', s: line}];
  const segs = [];
  let rest = line;
  while (rest.length > 0) {
    const str = rest.match(/^(['"`])(?:\\.|(?!\1).)*\1/);
    if (str) {
      segs.push({t: 'code', s: str[0]});
      rest = rest.slice(str[0].length);
      continue;
    }
    const word = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
    if (word) {
      segs.push({t: KEYWORDS.test(word[0]) ? 'kw' : 'plain', s: word[0]});
      rest = rest.slice(word[0].length);
      continue;
    }
    segs.push({t: 'plain', s: rest[0]});
    rest = rest.slice(1);
  }
  return segs.reduce((acc, s) => {
    const last = acc[acc.length - 1];
    if (last && last.t === 'plain' && s.t === 'plain') last.s += s.s;
    else acc.push(s);
    return acc;
  }, []);
};

const plain = (s) => ({t: 'plain', s});
const code = (s) => ({t: 'code', s});
const basename = (p) => p.split('/').pop();

// Prefer variety over chronology-complete: one code block, at most two
// Created/Updated lines, one run with real output — the classic arc.
// Returns the beats plus exactly which inputs were used, so captures can
// persist only what the video will show.
export const buildBeatsDetailed = (events, lastText) => {
  const beats = [];
  const usedEvents = [];
  let haveCode = false;
  let toolCount = 0;
  let haveRun = false;

  // Reserve one slot for the summary if the assistant text has bullets.
  const hasBullets = Boolean(
    lastText && lastText.split('\n').some((l) => /^[-*]\s+/.test(l.trim())),
  );
  const cap = hasBullets ? MAX_BEATS - 1 : MAX_BEATS;

  for (const ev of events) {
    if (ev.type === 'write' && !haveCode) {
      if (beats.length + 2 > cap) continue;
      const shown = (ev.shownLines ?? []).slice(0, MAX_CODE_LINES);
      beats.push({
        kind: 'code',
        lines: shown.map(tokenizeLine),
        expandNote: `+${ev.lineCount - shown.length} lines (ctrl+o to expand)`,
      });
      beats.push({
        kind: 'tool',
        line: [plain('Created '), code(basename(ev.path))],
      });
      usedEvents.push(ev);
      haveCode = true;
      toolCount++;
    } else if ((ev.type === 'write' || ev.type === 'edit') && toolCount < 2) {
      if (beats.length + 1 > cap) continue;
      usedEvents.push(ev);
      beats.push({
        kind: 'tool',
        line: [
          plain(ev.type === 'write' ? 'Created ' : 'Updated '),
          code(basename(ev.path)),
        ],
      });
      toolCount++;
    } else if (ev.type === 'bash' && ev.output && !haveRun) {
      if (beats.length + 1 > cap) continue;
      const outLines = ev.output
        .split('\n')
        .filter((l) => l.trim())
        .slice(0, MAX_OUTPUT_LINES);
      // output already redacted & truncated at capture time
      if (outLines.length === 0) continue;
      const bare = ev.command.replace(
        /^cd\s+(?:"[^"]*"|'[^']*'|\S+)\s+&&\s+/,
        '',
      );
      const cmd = bare.length > 60 ? `${bare.slice(0, 57)}…` : bare;
      usedEvents.push(ev);
      beats.push({
        kind: 'run',
        command: [plain('Ran '), code(cmd)],
        output: outLines.map((l) => [
          plain(l.length > 80 ? `${l.slice(0, 77)}…` : l),
        ]),
      });
      haveRun = true;
    }
  }

  let usedBulletLines = [];
  if (lastText) {
    usedBulletLines = lastText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /^[-*]\s+/.test(l))
      .slice(0, MAX_BULLETS);
    const bullets = usedBulletLines
      .map((l) => l.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').replace(/`/g, ''));
    if (bullets.length > 0) {
      beats.push({
        kind: 'summary',
        heading: 'What it does',
        bullets: bullets.map((b) => [
          plain(b.length > 90 ? `${b.slice(0, 87)}…` : b),
        ]),
      });
    }
  }

  return {beats, usedEvents, usedBulletLines};
};

export const buildBeats = (events, lastText) =>
  buildBeatsDetailed(events, lastText).beats;

export const buildReplayProps = ({promptText, events, lastText, options}) => {
  const shortPrompt =
    promptText.length > 80 ? `${promptText.slice(0, 77)}…` : promptText;

  return {
    intro: {
      title: options.title,
      subtitle: options.subtitle,
    },
    session: {
      windowTitle: `dev — · ${shortPrompt.slice(0, 40)}${shortPrompt.length > 40 ? '…' : ''} — claude — 106×31`,
      prompt: shortPrompt,
      thinkingWord: 'Thinking',
      beats: buildBeats(events, lastText),
    },
    outro: {
      title: options.outroTitle,
      subtitle: options.outroSubtitle,
    },
  };
};
