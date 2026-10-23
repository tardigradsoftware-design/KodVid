<!-- Modified from Vincentwei1021/video-shotcraft on 2026-09-04: renamed distribution and installation metadata. -->

<div align="center">

<h1>cinematic-product-promo-skill</h1>

[![GitHub stars](https://img.shields.io/github/stars/kiki-lgtm-dot/cinematic-product-promo-skill)](https://github.com/kiki-lgtm-dot/cinematic-product-promo-skill/stargazers)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Upstream Gallery](https://img.shields.io/badge/Upstream%20Gallery-live%20previews-d3923c)](https://vincentwei1021.github.io/video-shotcraft/)

**An agent skill for crafting cinematic product videos: 157 shot recipe cards · 214 styles · 214 motion previews · a production-ready template**

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md)

</div>

> [!NOTE]
> This is a renamed distribution of
> [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft),
> originally created by Wei Yihao. The Apache-2.0 license and attribution are
> preserved. This distribution is based on upstream commit `6c116cb` and changes
> the project/skill name and installation metadata; see [NOTICE](NOTICE).

**cinematic-product-promo-skill** is an AI agent skill that turns Claude Code or Codex into a
motion-design studio: point it at your product and it storyboards, animates, and
sound-designs a cinematic promo, marketing, launch, or demo video with
[Remotion](https://www.remotion.dev/) — real page captures, 2.5D camera moves,
beat-synced cuts, and film-grade SFX included.

🖼️ [**Browse all 214 motion previews in the live Gallery »**](https://vincentwei1021.github.io/video-shotcraft/)

## ✨ What's new

> [!IMPORTANT]
> ### 🔥 2026-08 · New in the series: **video-talkcraft**, for narration videos
> [**video-talkcraft**](https://github.com/Vincentwei1021/video-talkcraft) is the
> narration-video installment of this series. Hand it a script plus a finished
> voiceover and every motion beat locks to the voice: word-level timestamps
> aligned locally (median 20–40 ms per character), **78 motion recipe cards**, a
> 7-layer anti-slideshow shot system (continuous camera curves, parallax planes,
> idle/yield lifecycle, breathing environment), plain-cut subtitles, and
> triple-gate QA. Same recipe-card + Remotion workflow as here, retuned for
> talking content.
>
> 🎙️ [**Project page »**](https://github.com/Vincentwei1021/video-talkcraft) ·
> 🖼️ [**Browse all 78 narration motion previews »**](https://vincentwei1021.github.io/video-talkcraft/)

- 🌟 **2026-08 · 48 new shot recipe cards** — the library grows from 104 to
  **152 cards / 209 previews**. Distilled from 209 candidate motions through
  eight rounds of frame-by-frame review against reference footage, then folded
  into the regular Gallery categories with full recipe cards, native Remotion
  components (`demos/<category>/<name>/<Component>.tsx`, deterministic and
  driven by the normalized progress `t` — see demos/README.md for the wiring
  snippet), and motion previews. All de-branded: neutral placeholder copy and a
  single swappable `ACCENT` color variable.
- 🎞️ **2026-08 · JianYing (CapCut CN) project export** — after final delivery
  the film can be exported as an editable JianYing draft: the plate is cut per
  shot (retime/reorder/grade), captions are rebuilt as native text tracks
  (content/size/color editable), SFX/BGM land on separate audio tracks.
  Verified on JianYing Pro 11.2 for macOS; see
  [references/jianying-export.md](references/jianying-export.md).

## 🎬 Showcase

The 38-second Gallery intro below was itself produced with this skill —
storyboard, shot implementation, and sound design were all done by an agent
following the toolkit's methodology:

https://github.com/user-attachments/assets/cba2df8a-4b2e-4247-bace-d0b1dea9c2bd

▶️ [Watch in HD on YouTube](https://youtu.be/gcVvRM_P3SM)

> Browse every shot card and motion preview online: **[Gallery](https://vincentwei1021.github.io/video-shotcraft/)**
> — search, filter, switch between variants, and copy selected shot-card names.

## 🚀 Quick start

**The most direct way: hand the repo link to your agent.**
In Claude Code / Codex or a similar agent, just say:

```text
Install this skill for me: https://github.com/kiki-lgtm-dot/cinematic-product-promo-skill
```

The agent will clone the repo and link it into your skills directory. Or install
with the [skills](https://skills.sh/) CLI / manually:

```bash
npx skills add kiki-lgtm-dot/cinematic-product-promo-skill
```

```bash
git clone https://github.com/kiki-lgtm-dot/cinematic-product-promo-skill.git
cd cinematic-product-promo-skill
ln -s "$(pwd)" ~/.claude/skills/cinematic-product-promo-skill   # Claude Code
# or
ln -s "$(pwd)" ~/.codex/skills/cinematic-product-promo-skill    # Codex
```

Then make requests like:

```text
Use cinematic-product-promo-skill to create a promo for my desktop product.
Use the deck-deal-flyin and row-embed shot cards to present this feature.
Design a product close-up inspired by spotlight-hero-card.
```

If no shot card is specified, the skill introduces the built-in video template
first and asks whether to use it; you can also pick shots in the
[Gallery](https://vincentwei1021.github.io/video-shotcraft/) before starting.

## 📼 Video template: Ink Press

The skill ships with **Ink Press** — a validated, complete promo template:
36.2 seconds, 1920×1080, 30fps, 10 shots in a paper-ink-amber style, with 2.5D
real-page camera moves, title cards, transitions, and a fully pinned cinematic
SFX pass:

https://github.com/user-attachments/assets/4cf5af51-98f3-4af2-8ab2-7267f470513d

▶️ [Watch in HD on YouTube](https://youtu.be/iShab28B_ak)

To use it, just tell your agent:

```text
Use cinematic-product-promo-skill to make a promo for my product with the Ink Press template.
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
| 157 shot recipe cards | Purpose, energy, suggested duration, parameters, implementation notes, and known pitfalls |
| 214 motion previews | Covering 214 styles; searchable and filterable in the online Gallery |
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
cinematic-product-promo-skill/
├── SKILL.md                 # Agent entry point and core production rules
├── references/
│   ├── pipeline.md          # End-to-end production workflow
│   ├── shots/               # 157 shot recipe cards in 10 functional categories
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
- **Claude Code** — this library itself was built, iterated, and QA'd with an
  AI coding agent, using the same workflow the skill teaches.

## Original author

<p>
  <a href="https://x.com/VincentWei93"><img alt="Follow Vincent on X" src="https://img.shields.io/badge/X-Follow_Me-000000?style=for-the-badge&logo=x&logoColor=white"></a>
  <a href="https://www.douyin.com/user/MS4wLjABAAAAK1pkjBxilk2Oi_9h_vFyD-lTAu9CTlvhmOtkosDvvxg"><img alt="Follow Vincent on Douyin" src="https://img.shields.io/badge/Douyin-Follow_Me-000000?style=for-the-badge&logo=tiktok&logoColor=white"></a>
  <a href="https://xhslink.cn/m/At9iP2d5C1V"><img alt="Follow Vincent on Red Note" src="https://img.shields.io/badge/Red_Note-Follow_Me-FF2442?style=for-the-badge&logo=xiaohongshu&logoColor=white"></a>
</p>

## Origin and license

Core implementation and content are from
[video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft), copyright
2026 Wei Yihao, and redistributed under Apache-2.0. See [LICENSE](LICENSE),
[NOTICE](NOTICE), and the asset-specific [audio attribution](assets/audio/ATTRIBUTION.md).
