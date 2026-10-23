<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/logo-mark-reverse.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/brand/logo-mark.svg">
  <img alt="video-shotcraft logo" src="./assets/brand/logo-mark.svg" width="112" height="112">
</picture>

<h1>video-shotcraft</h1>

[![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-native-4f46e5)](docs/deepseek-harness.md)
[![Checks](https://github.com/kingselyjoe/video-shotcraft-dsh/actions/workflows/checks.yml/badge.svg)](https://github.com/kingselyjoe/video-shotcraft-dsh/actions/workflows/checks.yml)
[![License: Apache--2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/kingselyjoe/video-shotcraft-dsh)](https://github.com/kingselyjoe/video-shotcraft-dsh/stargazers)


**An agent skill for crafting cinematic product videos: 152 shot recipe cards · 209 styles · reusable Remotion demos · a production-ready template**

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md)

</div>

**video-shotcraft** is a DeepSeek Harness agent skill that turns your workspace into a
motion-design studio: point it at your product and it storyboards, animates, and
sound-designs a cinematic promo, marketing, launch, or demo video with
[Remotion](https://www.remotion.dev/) — real page captures, 2.5D camera moves,
beat-synced cuts, and film-grade SFX included.

🖼️ [**Browse all 152 cards and 209 styles in the local Gallery index »**](gallery/library.html)

## ✨ What's new

> [!IMPORTANT]
> ### 🆕 2026-08 · 48 new shot recipe cards
> The library grows from 104 to **152 cards / 209 styles**. Distilled from
> 209 candidate motions through eight rounds of frame-by-frame review against
> reference footage, then folded into the regular Gallery categories with full
> recipe cards, native Remotion components
> (`demos/<category>/<name>/<Component>.tsx`, deterministic and driven by the
> normalized progress `t` — see demos/README.md for the wiring snippet), and
> implementation recipes. All de-branded: neutral placeholder copy and a single
> swappable `ACCENT` color variable.

- **2026-08 · JianYing (CapCut CN) project export** — after final delivery the
  film can be exported as an editable JianYing draft: the plate is cut per
  shot (retime/reorder/grade), captions are rebuilt as native text tracks
  (content/size/color editable), SFX/BGM land on separate audio tracks.
  Verified on JianYing Pro 11.2 for macOS; see
  [references/jianying-export.md](references/jianying-export.md).
- **2026-07 · Audio library restructure** — `bgm/` + `sfx/<category>/` with 149
  SFX across 16 scene/material categories, md5-deduplicated with license URLs
  restored.
- **2026-07 · Gallery upgrades** — multi-category card tags and a flat,
  alphabetized local index for searching and copying recipe names.

## 🎬 Showcase

The 38-second Gallery intro below was itself produced with this skill —
storyboard, shot implementation, and sound design were all done by an agent
following the toolkit's methodology:

https://github.com/user-attachments/assets/cba2df8a-4b2e-4247-bace-d0b1dea9c2bd

▶️ [Watch in HD on YouTube](https://youtu.be/gcVvRM_P3SM)

> Browse every shot card in the local **[Gallery index](gallery/library.html)**
> — search, filter, switch between variants, and copy selected shot-card names.

## 🚀 Quick start

### DeepSeek Harness

Windows PowerShell:

```powershell
git clone https://github.com/kingselyjoe/video-shotcraft-dsh.git
cd video-shotcraft-dsh
.\\install-dsh.ps1
```

macOS / Linux:

```bash
git clone https://github.com/kingselyjoe/video-shotcraft-dsh.git
cd video-shotcraft-dsh
bash install-dsh.sh
```

Run `python scripts/dsh_manager.py doctor` after installation. See the
[DeepSeek Harness guide](docs/deepseek-harness.md) for safety, update, and uninstall details.

### Other Agent Skills environments

**The most direct way: hand the repo link to your agent.**
In DeepSeek Harness / Claude Code / Codex or a similar agent, just say:

```text
Install this skill for me: https://github.com/kingselyjoe/video-shotcraft-dsh
```

The agent will clone the repo and link it into your skills directory. Or install
with the [skills](https://skills.sh/) CLI / manually:

```bash
npx skills add kingselyjoe/video-shotcraft-dsh
```

```bash
git clone https://github.com/kingselyjoe/video-shotcraft-dsh.git
cd video-shotcraft-dsh
ln -s "$(pwd)" ~/.claude/skills/video-shotcraft   # Claude Code
# or
ln -s "$(pwd)" ~/.codex/skills/video-shotcraft    # Codex
```

Then make requests like:

```text
Use video-shotcraft to create a promo for my desktop product.
Use the deck-deal-flyin and row-embed shot cards to present this feature.
Design a product close-up inspired by spotlight-hero-card.
```

If no shot card is specified, the skill introduces the built-in video template
first and asks whether to use it; you can also pick shots in the
[Gallery](gallery/library.html) before starting.

## 📼 Video template: Ink Press

The skill ships with **Ink Press** — a validated, complete promo template:
36.2 seconds, 1920×1080, 30fps, 10 shots in a paper-ink-amber style, with 2.5D
real-page camera moves, title cards, transitions, and a fully pinned cinematic
SFX pass:

https://github.com/user-attachments/assets/4cf5af51-98f3-4af2-8ab2-7267f470513d

▶️ [Watch in HD on YouTube](https://youtu.be/iShab28B_ak)

To use it, just tell your agent:

```text
Use video-shotcraft to make a promo for my product with the Ink Press template.
```

The agent swaps in your product's screenshots, copy, and branding to reproduce
the same quality — the fastest, most reliable path to a finished film.

> More templates are on the way.

### Headless / CI notes

Rendering on a headless Linux box (tested: 2 cores, Node 22) hits three walls
worth knowing:

1. **Concurrency cap** — `remotion still/render` fails with "Maximum for
   --concurrency is 2" on low-core machines. Fix: pass `--concurrency=1`.
2. **Old Headless removal** — recent Chrome/Chromium dropped old headless mode;
   pointing Remotion at system chromium fails to launch. Fix: use a
   chrome-headless-shell binary instead of full Chrome.
3. **Blocked CDN** — if remotion.media is unreachable, the automatic
   headless-shell download is rejected. Fix:
   `--browser-executable=<path-to-local chrome-headless-shell>`.

With these three flags, frame renders from the bundled template work.

## 📦 What's included

| Content | Description |
| --- | --- |
| 152 shot recipe cards | Purpose, energy, suggested duration, parameters, implementation notes, and known pitfalls |
| 209 indexed styles | Searchable and filterable in the local Gallery; each maps to a recipe and demo source |
| Remotion implementations | Tuned TSX demos containing the actual easing and timing parameters for each card |
| Complete video template | A validated 36.2-second, 1920×1080, 30fps product promo with 10 shots |
| Components and assets | 2.5D page camera, captions, flash cuts, digit rolls, SFX, and capture scripts |
| Production methodology | Capture, visual direction, storyboarding, sound design, beat sync, and final QA |
| JianYing project export | Load the film into JianYing (CapCut CN) for further editing — per-shot speed, captions, and audio all editable (verified on macOS 11.2) |

The toolkit primarily targets web and desktop product promos, while individual
shot cards can also be used in feature demos, brand films, launch videos, and
other motion projects.

## 🗂 Repository structure

```text
video-shotcraft/
├── SKILL.md                 # Agent entry point and core production rules
├── references/
│   ├── pipeline.md          # End-to-end production workflow
│   ├── shots/               # 152 shot recipe cards in 10 functional categories
│   ├── sequences/           # Reusable full-video structures and sequence patterns
│   ├── aesthetic-rules.md   # Visual QA criteria
│   ├── music-beat-sync.md   # BGM analysis and beat-sync methodology
│   ├── sound-design.md      # Sound-design guidance and examples
│   └── jianying-export.md   # JianYing (CapCut CN) project-export guide
├── demos/                   # Remotion reference implementations (same categories)
├── gallery/                 # Static motion-preview Gallery
├── template/                # Runnable complete video template
├── jianying-export/         # JianYing draft installers (mac tested / win untested)
└── assets/
    ├── lib/                 # Reusable Remotion components
    ├── scripts/             # Page-asset capture scripts
    └── audio/               # Audio assets
        ├── bgm/             # 5 BGM options
        └── sfx/<category>/  # 149 SFX across 16 scene categories
```

For the complete workflow and implementation requirements, see [SKILL.md](SKILL.md),
the [production pipeline](references/pipeline.md), and the
[visual QA criteria](references/aesthetic-rules.md).

## 🔊 Audio and asset notes

Audio files under `assets/audio/` may be used according to their respective license terms.
See [ATTRIBUTION.md](assets/audio/ATTRIBUTION.md) for sources and license details.

SFX are organized into 16 scene/material categories (`transition` `impact` `riser`
`camera` `ui` `text` `paper` `film` `light` `data` `scifi` `mech` `glass` `fluid`
`crowd` `counter`) — **pick the category first, then the timbre**. See
[sound-design.md](references/sound-design.md) for the category index and per-file usage.

Product screenshots bundled with the template are demonstration assets. Replace them with
screenshots from the target product before publishing, and verify whether any product,
customer, or personal data needs to be anonymized.

## 🙏 Acknowledgements

Many shot recipes in this library were distilled by studying the motion language
of outstanding official product films — including promos from **ClickUp,
Perplexity, Slack, Notion, Figma, Framer, Bear, Raycast, Pitch, Miro, Superhuman,
and Loom**. The cards document motion techniques (timing, easing, choreography)
re-implemented from scratch; no footage, artwork, or brand assets from these
films are included in this repository. All trademarks belong to their respective
owners, and none of these companies are affiliated with or endorse this project.
Per-batch sourcing notes for the 48 cards added in 2026-08 live in
[references/shots/ATTRIBUTION.md](references/shots/ATTRIBUTION.md).

Special thanks to:

- **[Remotion](https://www.remotion.dev/)** — the React-based video framework
  that powers every demo and template here. Note that Remotion has its own
  [license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
  (free for individuals and small teams; companies may need a paid license).
- **[Mixkit](https://mixkit.co/)** — source of the SFX and music assets bundled
  under their free commercial license.
- The game-feel and animation communities whose published principles (e.g.
  Vlambeer's screenshake talks, classic animation timing) inform several cards.
