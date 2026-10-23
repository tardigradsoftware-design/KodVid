#!/usr/bin/env node
// Truthfulness gate for capture directories: rebuilds props.json from the raw
// capture artifacts with the same deterministic builders used at capture time
// and fails if the committed props.json differs — i.e. if anyone hand-edited
// a number, path, or output line the video will show.
//
// Usage:  node scripts/verify-props.mjs captures/<name> [captures/<name2> ...]

import {readFile, access} from 'node:fs/promises';
import path from 'node:path';
import {buildProps, buildXapiDarkProps, buildXapiProps} from './lib/build-props.mjs';
import {buildReplayProps} from './lib/replay-build.mjs';

const args = process.argv.slice(2);
// Sample captures fail verification by default — they must never ship.
// --allow-sample downgrades that to a warning for pipeline testing only.
const ALLOW_SAMPLE = args.includes('--allow-sample');
const dirs = args.filter((a) => !a.startsWith('--'));
if (dirs.length === 0) {
  console.error(
    'Usage: node scripts/verify-props.mjs captures/<name> [...] [--allow-sample]',
  );
  process.exit(1);
}

const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));
const exists = (p) => access(p).then(() => true, () => false);

// Reports the first differing path between two JSON values, or null.
const firstDiff = (a, b, at = '$') => {
  if (a === b) return null;
  if (typeof a !== typeof b || a === null || b === null) return at;
  if (typeof a !== 'object') return at;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const d = firstDiff(a[k], b[k], `${at}.${k}`);
    if (d) return d;
  }
  return null;
};

let failed = false;

for (const dir of dirs) {
  const committed = await readJson(path.join(dir, 'props.json'));
  let rebuilt;
  let kind;

  if (await exists(path.join(dir, 'raw-profile.json'))) {
    kind = 'xapi-cli';
    const [rawProfile, rawTweets, meta, rawInstall] = await Promise.all([
      readJson(path.join(dir, 'raw-profile.json')),
      readJson(path.join(dir, 'raw-tweets.json')),
      readJson(path.join(dir, 'raw-meta.json')),
      readFile(path.join(dir, 'raw-install.txt'), 'utf8'),
    ]);
    rebuilt = buildXapiProps({rawProfile, rawTweets, rawInstall, meta});
    if (meta.sample) {
      if (ALLOW_SAMPLE) {
        console.warn(`⚠ ${dir}: SAMPLE capture allowed by --allow-sample — never publish this.`);
      } else {
        console.error(`✗ ${dir}: capture is marked SAMPLE — replace it with a real run (or pass --allow-sample for pipeline testing).`);
        failed = true;
      }
    }
    // Dark-variant props, when present, must be reproducible too.
    if (await exists(path.join(dir, 'props-dark.json'))) {
      const committedDark = await readJson(path.join(dir, 'props-dark.json'));
      const diffDark = firstDiff(buildXapiDarkProps({rawProfile, rawTweets, meta}), committedDark);
      if (diffDark) {
        console.error(`✗ ${dir} (xapi-cli dark): props-dark.json does not match a rebuild. First difference at ${diffDark}`);
        failed = true;
      } else {
        console.log(`✓ ${dir} (xapi-cli dark): props-dark.json reproducible from raw captures.`);
      }
    }
  } else if (await exists(path.join(dir, 'raw-user.json'))) {
    kind = 'x-api';
    const [rawUser, rawTweets, meta] = await Promise.all([
      readJson(path.join(dir, 'raw-user.json')),
      readJson(path.join(dir, 'raw-tweets.json')),
      readJson(path.join(dir, 'raw-meta.json')),
    ]);
    rebuilt = buildProps({rawUser, rawTweets, meta});
    if (meta.sample) {
      if (ALLOW_SAMPLE) {
        console.warn(`⚠ ${dir}: SAMPLE capture allowed by --allow-sample — never publish this.`);
      } else {
        console.error(`✗ ${dir}: capture is marked SAMPLE — replace it with a real run (or pass --allow-sample for pipeline testing).`);
        failed = true;
      }
    }
  } else if (await exists(path.join(dir, 'raw-events.json'))) {
    kind = 'replay';
    const raw = await readJson(path.join(dir, 'raw-events.json'));
    rebuilt = buildReplayProps({
      promptText: raw.prompt,
      events: raw.events,
      lastText: raw.lastText,
      options: raw.options,
    });
  } else {
    console.error(`✗ ${dir}: no raw capture artifacts found (raw-user.json or raw-events.json).`);
    failed = true;
    continue;
  }

  const diff = firstDiff(rebuilt, committed);
  if (diff) {
    console.error(`✗ ${dir} (${kind}): props.json does not match a rebuild from raw captures.`);
    console.error(`  First difference at ${diff}`);
    console.error('  Re-run the capture script instead of editing props.json by hand.');
    failed = true;
  } else {
    console.log(`✓ ${dir} (${kind}): props.json reproducible from raw captures.`);
  }
}

process.exit(failed ? 1 : 0);
