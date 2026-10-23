#!/usr/bin/env node
// Capture ground truth for the XApiElon video via the xapi CLI (xapi.to):
// profile + latest posts for @elonmusk. Writes raw responses and the derived
// props.json into captures/xapi-elon/. Requires a configured xapi key
// (~/.xapi/config.json — run `npx xapi-to register` once).
//
// Usage:  node scripts/capture-xapi-cli.mjs

import {execSync} from 'node:child_process';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import path from 'node:path';
import {
  USERNAME,
  buildXapiDarkProps,
  buildXapiOutputLines,
  buildXapiProps,
} from './lib/build-props.mjs';

// Resolve against the project the user runs from, never the script's own
// location (the skill bundles a copy of this script).
const OUT_DIR = path.join(process.cwd(), 'captures', 'xapi-elon');

const xapi = (id, input, attempt = 0) => {
  try {
    return JSON.parse(
      execSync(`npx xapi-to call ${id} --input '${JSON.stringify(input)}'`, {
        encoding: 'utf8',
        maxBuffer: 32 * 1024 * 1024,
      }),
    );
  } catch (err) {
    if (attempt < 2) {
      console.error(`${id} failed (attempt ${attempt + 1}), retrying…`);
      execSync('sleep 4');
      return xapi(id, input, attempt + 1);
    }
    throw err;
  }
};

// Really (re-)install the xapi skill so the video's install step replays a
// genuine command run. Idempotent; raw output is archived for verification.
const stripAnsi = (s) => s.replace(/\[[0-9;?]*[A-Za-z]/g, '');
const installOutput = stripAnsi(
  execSync('npx skills add xapi-labs/xapi-cli', {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  }),
);

const profile = xapi('twitter.user_by_screen_name', {screen_name: USERNAME});
const tweets = xapi('twitter.user_tweets', {user_id: profile.data.rest_id, count: 5});

if (!profile.success || !tweets.success) {
  throw new Error(
    `xapi call failed: ${JSON.stringify({profile: profile.success, tweets: tweets.success})}`,
  );
}

const scriptSource = await readFile(fileURLToPath(import.meta.url), 'utf8');

// Capture the real Claude Code version and working directory for the session
// header — never invented. If the CLI is unavailable, the header is omitted.
let claudeVersion = null;
try {
  claudeVersion = execSync('claude --version', {encoding: 'utf8'}).trim();
} catch {
  console.warn('claude CLI not found — session header will be omitted.');
}

const meta = {
  via: 'xapi-cli',
  capturedAt: new Date().toISOString(),
  claudeVersion,
  cwd: process.cwd().replace(os.homedir(), '~'),
  username: USERNAME,
  capabilities: ['twitter.user_by_screen_name', 'twitter.user_tweets'],
  scriptLineCount:
    scriptSource.split('\n').length - (scriptSource.endsWith('\n') ? 1 : 0),
  sample: false,
};

await mkdir(OUT_DIR, {recursive: true});
// Remove artifacts of the official-API capture flavor so verify-props detects
// the right builder.
await rm(path.join(OUT_DIR, 'raw-user.json'), {force: true});
await writeFile(path.join(OUT_DIR, 'raw-install.txt'), installOutput);
await writeFile(path.join(OUT_DIR, 'raw-profile.json'), JSON.stringify(profile, null, 2));
await writeFile(path.join(OUT_DIR, 'raw-tweets.json'), JSON.stringify(tweets, null, 2));
await writeFile(path.join(OUT_DIR, 'raw-meta.json'), JSON.stringify(meta, null, 2));
await writeFile(
  path.join(OUT_DIR, 'props.json'),
  JSON.stringify(
    buildXapiProps({rawProfile: profile, rawTweets: tweets, rawInstall: installOutput, meta}),
    null,
    2,
  ),
);
await writeFile(
  path.join(OUT_DIR, 'props-dark.json'),
  JSON.stringify(buildXapiDarkProps({rawProfile: profile, rawTweets: tweets, meta}), null, 2),
);

// Print the same summary lines the video shows — the "run output" beat is a
// replay of this real output.
for (const line of buildXapiOutputLines(profile, tweets)) {
  console.log(line.map((seg) => seg.s).join(''));
}
console.log(`\nWrote ${OUT_DIR}/{raw-profile,raw-tweets,raw-meta,props}.json`);
