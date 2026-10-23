// Deterministic props builder shared by capture-x-user.mjs (produce) and
// verify-props.mjs (reproduce & compare). All numbers shown in the video are
// formatted here, from raw capture data — nowhere else.

export const API_BASE = 'https://api.x.com/2';
export const USERNAME = 'elonmusk';

export const fmtCompact = (n) => {
  const one = (v) => (v.toFixed(1)).replace(/\.0$/, '');
  if (n >= 1e9) return `${one(n / 1e9)}B`;
  if (n >= 1e6) return `${one(n / 1e6)}M`;
  if (n >= 1e3) return `${one(n / 1e3)}K`;
  return String(n);
};

export const fmtThousands = (n) => n.toLocaleString('en-US');

const plain = (s) => ({t: 'plain', s});
const code = (s) => ({t: 'code', s});
const kw = (s) => ({t: 'kw', s});
const comment = (s) => ({t: 'comment', s});
const bold = (s) => ({t: 'bold', s});

// Builds the profile summary lines shown in the video's "run output" —
// capture-x-user.mjs prints exactly these lines to stdout, so the video
// replays a real, reproducible program output.
export const buildOutputLines = (rawUser, rawTweets) => {
  const u = rawUser.data;
  const m = u.public_metrics;
  const line1 = [
    bold(`@${u.username}`),
    plain(` — ${u.name}${u.verified ? ' ✓' : ''} · `),
    code(fmtCompact(m.followers_count)),
    plain(' followers · '),
    code(fmtThousands(m.tweet_count)),
    plain(' posts'),
  ];

  const latest = rawTweets.data?.[0];
  const line2 = latest
    ? [
        plain('Latest post '),
        code(latest.created_at.slice(0, 10)),
        ...(latest.public_metrics?.impression_count
          ? [
              plain(' · '),
              code(fmtCompact(latest.public_metrics.impression_count)),
              plain(' views'),
            ]
          : []),
        plain(' · '),
        code(fmtCompact(latest.public_metrics?.like_count ?? 0)),
        plain(' likes'),
      ]
    : [plain('No recent posts returned')];

  return [line1, line2];
};

// ---------------------------------------------------------------------------
// xapi CLI flavor (twitter.* capabilities via xapi.to)
// ---------------------------------------------------------------------------

// Deterministic pick: latest original post (metrics on retweets belong to the
// original author), falling back to the newest item.
export const pickLatestOriginal = (rawTweets) => {
  const tweets = rawTweets.data?.tweets ?? [];
  return tweets.find((t) => !t.is_retweet) ?? tweets[0] ?? null;
};

// Presentational cleanup of verbatim tweet text: collapse whitespace, drop
// trailing t.co links, truncate. The full text stays in raw-tweets.json.
const tweetExcerpt = (text, max = 58) => {
  const t = text
    .replace(/\s+/g, ' ')
    .replace(/\s*https:\/\/t\.co\/\S+\s*$/g, '')
    .trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

export const buildXapiOutputLines = (rawProfile, rawTweets) => {
  const u = rawProfile.data;
  const verified = u.verified || u.is_blue_verified;
  const lines = [
    [
      bold(`@${u.screen_name}`),
      plain(` — ${u.name}${verified ? ' ✓' : ''} · `),
      code(fmtCompact(u.followers_count)),
      plain(' followers · '),
      code(fmtThousands(u.statuses_count)),
      plain(' posts'),
    ],
  ];

  const originals = (rawTweets.data?.tweets ?? [])
    .filter((t) => !t.is_retweet && tweetExcerpt(t.full_text).length > 0)
    .slice(0, 2);

  if (originals.length === 0) {
    const latest = pickLatestOriginal(rawTweets);
    lines.push(
      latest
        ? [
            plain('Latest post '),
            code(new Date(latest.created_at).toISOString().slice(0, 10)),
            plain(' · '),
            code(fmtCompact(latest.favorite_count ?? 0)),
            plain(' likes'),
          ]
        : [plain('No recent posts returned')],
    );
    return lines;
  }

  for (const t of originals) {
    lines.push([
      plain(`"${tweetExcerpt(t.full_text)}"`),
      plain(' — '),
      ...(t.views_count
        ? [code(fmtCompact(t.views_count)), plain(' views')]
        : [code(fmtCompact(t.favorite_count ?? 0)), plain(' likes')]),
    ]);
  }

  return lines;
};

// Deterministically extract the install step's display lines from the real
// `npx skills add` output archived in raw-install.txt.
export const buildInstallLines = (rawInstall) => {
  const lines = rawInstall.split('\n');
  const installed = lines.find((l) => /Installed \d+ skill/.test(l));
  const skillPath = lines.find((l) => l.includes('.agents/skills/xapi'));
  if (!installed || !skillPath) {
    throw new Error(
      'raw install output is missing the "Installed N skill" or skill-path line — refusing to fabricate the install step. Re-run the capture.',
    );
  }
  const count = installed.match(/Installed (\d+) skill/)[1];
  const out = [
    [plain(`Installed ${count} skill — `), code('.agents/skills/xapi')],
  ];
  if (lines.some((l) => l.includes('symlinked: Claude Code'))) {
    out.push([plain('symlinked: Claude Code')]);
  }
  return out;
};

export const buildXapiProps = ({rawProfile, rawTweets, rawInstall, meta}) => {
  const tweetCount = rawTweets.data?.tweets?.length ?? 0;

  return {
    intro: {
      title: 'One prompt for X data.',
      subtitle: 'xAPI — Universal API Platform for Agents',
    },
    session: {
      windowTitle: `dev — · Fetch @${USERNAME} via xAPI — claude — 106×31`,
      windowTitleIdle: 'dev — · Claude Code — claude — 106×31',
      // Header facts come from the capture (real `claude --version` output and
      // the real working directory); omitted entirely if not captured.
      ...(meta.claudeVersion
        ? {
            header: {
              version: `v${meta.claudeVersion.match(/\d+\.\d+\.\S+/)?.[0] ?? meta.claudeVersion}`,
              modelLine: meta.cwd,
            },
          }
        : {}),
      setup: {
        command: [
          plain('Ran '),
          code('npx skills add xapi-labs/xapi-cli'),
        ],
        output: buildInstallLines(rawInstall),
      },
      prompt: "Fetch Elon Musk's profile and latest tweets with /xapi",
      thinkingWord: 'Researching',
      beats: [
        {
          kind: 'run',
          command: [
            plain('Ran '),
            code(
              `npx xapi-to call twitter.user_by_screen_name \\\n      --input '{"screen_name":"${USERNAME}"}'`,
            ),
          ],
          output: [buildXapiOutputLines(rawProfile, rawTweets)[0]],
        },
        {
          kind: 'run',
          command: [
            plain('Ran '),
            code(
              `npx xapi-to call twitter.user_tweets \\\n      --input '{"user_id":"${rawProfile.data.rest_id}","count":5}'`,
            ),
          ],
          output: buildXapiOutputLines(rawProfile, rawTweets).slice(1),
        },
      ],
    },
    outro: {
      title: 'xAPI',
      subtitle: 'Pay once, call any API. — xapi.to',
    },
  };
};

// Dark chaptered variant (ant-demo grammar): wordmark → [card → shell beat]
// per chapter → outro. Commands are exactly what capture-xapi-cli.mjs runs.
export const buildXapiDarkProps = ({rawProfile, rawTweets, meta}) => {
  const outputLines = buildXapiOutputLines(rawProfile, rawTweets);
  const restId = rawProfile.data.rest_id;
  // The prompt's cwd is the real directory the capture ran from (basename,
  // as a \W-style shell prompt would show it) — never an invented path.
  const dir = meta.cwd.split('/').pop() || meta.cwd;

  return {
    wordmark: {
      name: 'xAPI',
      tagline: 'Universal API Platform for Agents.',
    },
    windowTitle: 'xapi',
    dir,
    chapters: [
      {
        kicker: 'xAPI · twitter',
        claim: 'Any profile. One call.',
        command: `npx xapi-to call twitter.user_by_screen_name \\\n      --input '{"screen_name":"${USERNAME}"}'`,
        output: [outputLines[0]],
      },
      {
        kicker: 'xAPI · twitter',
        claim: 'Pipe live timelines into your shell.',
        command: `npx xapi-to call twitter.user_tweets \\\n      --input '{"user_id":"${restId}","count":5}'`,
        output: outputLines.slice(1),
      },
    ],
    outro: {
      name: 'xAPI',
      tagline: 'Pay once, call any API. — xapi.to',
    },
  };
};

// ---------------------------------------------------------------------------
// Official X API v2 flavor (api.x.com, X_BEARER_TOKEN)
// ---------------------------------------------------------------------------

export const buildProps = ({rawUser, rawTweets, meta}) => {
  const tweetCount = rawTweets.data?.length ?? 0;

  return {
    intro: {
      title: 'One prompt to the X API.',
      subtitle: `Fetching @${USERNAME} with Claude Code`,
    },
    session: {
      windowTitle: `dev — · Fetch @${USERNAME} via X API — claude — 106×31`,
      prompt: "Fetch Elon Musk's profile and latest tweets using the X API",
      thinkingWord: 'Researching',
      beats: [
        {
          kind: 'code',
          lines: [
            [
              comment(
                `// Fetch @${USERNAME} from the X API v2 — profile + latest posts.`,
              ),
            ],
            [kw('const'), plain(' API_BASE = '), code(`'${API_BASE}'`), plain(';')],
            [
              kw('const'),
              plain(' auth = { Authorization: '),
              code('`Bearer ${process.env.X_BEARER_TOKEN}`'),
              plain(' };'),
            ],
          ],
          expandNote: `+${meta.scriptLineCount - 3} lines (ctrl+o to expand)`,
        },
        {
          kind: 'tool',
          line: [
            plain('Created '),
            code('scripts/capture-x-user.mjs'),
            plain(' — X API v2 client with 429 retries.'),
          ],
        },
        {
          kind: 'run',
          command: [
            plain('Ran '),
            code('node scripts/capture-x-user.mjs'),
          ],
          output: buildOutputLines(rawUser, rawTweets),
        },
        {
          kind: 'summary',
          heading: 'What it does',
          bullets: [
            [
              plain('Resolves the user id via '),
              code(`GET /2/users/by/username/${USERNAME}`),
              plain('.'),
            ],
            [
              plain(
                tweetCount === 1
                  ? 'Fetches public metrics and the latest post in one request.'
                  : `Fetches public metrics and the ${tweetCount} latest posts in one request.`,
              ),
            ],
          ],
        },
      ],
    },
    outro: {
      title: 'Claude Code',
      subtitle: 'Any API. One prompt.',
    },
  };
};
