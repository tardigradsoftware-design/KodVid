#!/usr/bin/env node
// Capture ground truth for the XApiElon video: fetch @elonmusk from the
// X API v2 — profile + latest posts. Writes raw responses and the derived
// props.json into captures/xapi-elon/. Requires X_BEARER_TOKEN in the
// environment (user lookup needs the Basic tier or above).
//
// Usage:  X_BEARER_TOKEN=... node scripts/capture-x-user.mjs

import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {
  API_BASE,
  USERNAME,
  buildOutputLines,
  buildProps,
} from './lib/build-props.mjs';

// Resolve against the project the user runs from, never the script's own
// location (the skill bundles a copy of this script).
const OUT_DIR = path.join(process.cwd(), 'captures', 'xapi-elon');

// --sample writes a placeholder capture (X API v2 response shape, invented
// values, raw-meta.json marked sample:true) so the pipeline can be built and
// tested without a token. Replace it by running the real capture.
const SAMPLE = process.argv.includes('--sample');

const token = process.env.X_BEARER_TOKEN;
if (!token && !SAMPLE) {
  console.error(
    'X_BEARER_TOKEN is not set.\n' +
      'Run:  X_BEARER_TOKEN=<your token> node scripts/capture-x-user.mjs\n' +
      'Or:   node scripts/capture-x-user.mjs --sample   (placeholder data, marked sample)',
  );
  process.exit(1);
}

const auth = {Authorization: `Bearer ${token}`};

const get = async (url, attempt = 0) => {
  const res = await fetch(url, {headers: auth});
  if (res.status === 429 && attempt < 2) {
    const wait = Number(res.headers.get('retry-after') ?? 15);
    console.error(`429 rate limited — retrying in ${wait}s…`);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return get(url, attempt + 1);
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error(
      `${res.status} from X API — check the token, and note that user lookup requires the Basic tier or above.`,
    );
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json();
};

let rawUser;
let rawTweets;
if (SAMPLE) {
  console.warn('⚠ Writing SAMPLE capture — replace with a real run before publishing.');
  rawUser = {
    data: {
      id: '44196397',
      name: 'Elon Musk',
      username: USERNAME,
      verified: true,
      created_at: '2009-06-02T20:12:29.000Z',
      public_metrics: {
        followers_count: 224400000,
        following_count: 1092,
        tweet_count: 67381,
        listed_count: 163000,
      },
    },
  };
  rawTweets = {
    data: [
      {
        id: '1949999999999999999',
        created_at: '2026-07-29T18:04:00.000Z',
        text: '(sample placeholder — not a real post)',
        public_metrics: {
          retweet_count: 21000,
          reply_count: 18000,
          like_count: 380000,
          quote_count: 4100,
          impression_count: 41200000,
        },
      },
    ],
    meta: {result_count: 1},
  };
} else {
  rawUser = await get(
    `${API_BASE}/users/by/username/${USERNAME}?user.fields=public_metrics,verified,created_at`,
  );
  if (!rawUser.data) {
    throw new Error(`No user data returned: ${JSON.stringify(rawUser)}`);
  }

  rawTweets = await get(
    `${API_BASE}/users/${rawUser.data.id}/tweets?max_results=5&tweet.fields=public_metrics,created_at`,
  );
}

const scriptSource = await readFile(fileURLToPath(import.meta.url), 'utf8');
const meta = {
  capturedAt: new Date().toISOString(),
  username: USERNAME,
  endpoints: [
    `GET /2/users/by/username/${USERNAME}`,
    `GET /2/users/:id/tweets`,
  ],
  scriptLineCount:
    scriptSource.split('\n').length - (scriptSource.endsWith('\n') ? 1 : 0),
  sample: SAMPLE,
};

await mkdir(OUT_DIR, {recursive: true});
await writeFile(path.join(OUT_DIR, 'raw-user.json'), JSON.stringify(rawUser, null, 2));
await writeFile(path.join(OUT_DIR, 'raw-tweets.json'), JSON.stringify(rawTweets, null, 2));
await writeFile(path.join(OUT_DIR, 'raw-meta.json'), JSON.stringify(meta, null, 2));
await writeFile(
  path.join(OUT_DIR, 'props.json'),
  JSON.stringify(buildProps({rawUser, rawTweets, meta}), null, 2),
);

// Print the same summary lines the video shows — the "run output" beat is a
// replay of this real output.
for (const line of buildOutputLines(rawUser, rawTweets)) {
  console.log(line.map((seg) => seg.s).join(''));
}
console.log(`\nWrote ${OUT_DIR}/{raw-user,raw-tweets,raw-meta,props}.json`);
