# ccvideo

**Claude-style product promo videos, generated from ground truth.**

A [Claude Code](https://claude.com/claude-code) skill that turns a real
API run or a real coding session into a polished 20–45 s launch video —
the warm terracotta terminal aesthetic of Anthropic's Claude demos,
rebuilt frame-perfect in [Remotion](https://remotion.dev), with every
number, path, and output line traceable to something that actually ran.

![terracotta demo](assets/XApiElon.gif)

*Terracotta theme — an install-then-prompt Claude Code session, every number
fetched live at capture time. ([mp4](assets/XApiElon.mp4))*

![dark demo](assets/XApiDark.gif)

*Dark theme — the same capture rendered as a chaptered CLI demo.
([mp4](assets/XApiDark.mp4))*

## Install

```bash
npx skills add AmazingAng/ccvideo
```

Or copy this repository into your project's skill directory manually
(`.claude/skills/ccvideo/`). Then, in Claude Code, just ask:

> make a promo video for my CLI

## What makes it different

**Ground truth, enforced.** Video content is never hand-written into scene
components. A capture script runs the real thing (an API call, a CLI
install, a whole Claude Code session), archives the raw output, and builds
the video's script (`props.json`) from it deterministically.
`verify-props.mjs` rebuilds props from the raw artifacts and **fails on any
hand-edited number**. Placeholder captures fail verification by default.

**Zero text drift.** Terminal text only fades in place; transient rows live
in fixed-height slots; the only camera motion is a brief eased push between
locked framings. These rules were distilled from pixel-diffing renders
(settled frames are byte-identical) and are baked into the components.

**Two grammars, one capture:**

- **Terracotta** — a replayed Claude Code session: pixel-logo welcome
  header (real `claude --version`), typed prompt, live spinner, tool
  bullets with real output, cut-zoom into the payoff.
- **Dark** — an `ant`-style chaptered CLI demo: pixel wordmark, serif
  interstitial claims, shell beats typing real commands.

**Session replay.** `scripts/transcript-to-props.mjs` converts any real
Claude Code session turn (JSONL transcript) into a video — with built-in
secret scrubbing, path redaction, and minimal storage so captures are safe
to commit (review them anyway).

## Quickstart

1. Have (or scaffold) a Remotion project; install
   `@remotion/google-fonts`, `@remotion/transitions`, `zod`.
2. Copy `templates/` → `src/ccvideo/` and `scripts/` → `scripts/`.
3. Capture: adapt `scripts/capture-xapi-cli.mjs` to your data source
   (fetch reality → save raw → build props), or replay a session with
   `scripts/transcript-to-props.mjs`.
4. Register a `<Composition>` with `GroundedVideo` (or `DarkVideo`) and
   `defaultProps` from your `captures/<name>/props.json`.
5. `node scripts/verify-props.mjs captures/<name>` →
   `npx remotion render <CompId> out/<CompId>.mp4` (`--scale=2` for 4K).

Full workflow, style rules, component API, and timing recipes: see
[SKILL.md](SKILL.md) — that file *is* the skill; Claude Code reads it and
does the above for you.

## Requirements

- Node.js 18+, a Remotion project (the skill can scaffold one)
- For the bundled X-data example: an [xapi.to](https://xapi.to) key or an
  official X API bearer token — or write a capture script for your own
  data source (the pattern is ~60 lines)

## Disclaimer

Not affiliated with or endorsed by Anthropic. "Claude" and "Claude Code"
are trademarks of Anthropic, PBC. This skill recreates a visual style for
product demo purposes; the videos it produces replay real captured runs
and are only as honest as the captures you feed them — keep them honest.

## License

[MIT](LICENSE)
