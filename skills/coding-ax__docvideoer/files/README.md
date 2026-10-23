# docvideoer

`docvideoer` is an Agent Skill and local CLI for turning a document or prepared
storyboard into a narrated Remotion video. It includes document fetching, free
TTS, Remotion project generation, and rendering.

Install it globally as a skill when you want Codex, Claude Code, or another
skill-aware coding agent to run the document-to-video workflow for you. Use the
CLI directly when you already have a `storyboard.json` and just need audio,
Remotion setup, or MP4 rendering.

The AI part is intentionally open: the agent creates `storyboard.json`; this
project synthesizes audio and renders the final video.

## Install as an Agent Skill

After this repository is published to GitHub, users can install the skill with
the `skills` CLI:

```bash
npx skills add coding-ax/docvideoer --skill docvideoer -g -a codex -y
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices -g -a codex -y
```

`docvideoer` depends on Remotion's official `remotion-best-practices` skill for
composition, scene component, timeline, animation, audio, captions, and render
guidance. Install both skills unless `remotion-best-practices` is already
available globally.

Install them for multiple agents:

```bash
npx skills add coding-ax/docvideoer --skill docvideoer -g -a codex -a claude-code -y
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices -g -a codex -a claude-code -y
```

Preview what the repository exposes before installing:

```bash
npx skills add coding-ax/docvideoer --list
npx skills add https://github.com/remotion-dev/skills --list
```

Test the current checkout locally:

```bash
npx skills add . --skill docvideoer -g -a codex --copy -y
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices -g -a codex -y
```

Flags used above:

| Flag | Purpose |
|------|---------|
| `--skill docvideoer` | Selects this skill from the repository |
| `--skill remotion-best-practices` | Installs Remotion's official skill used by the video pipeline |
| `-g, --global` | Installs to the user's global agent skills directory |
| `-a codex` | Targets Codex (`~/.codex/skills/`) |
| `-a claude-code` | Also targets Claude Code (`~/.claude/skills/`) |
| `--copy` | Copies local files instead of symlinking them |
| `-y` | Skips interactive confirmation prompts |

Restart the target agent after installation so it can discover the new skill.

Once installed, ask the agent:

```text
/docvideo https://example.com/article
```

or paste source text directly:

```text
/docvideo 这是一段关于 AI 技术的介绍……
```

## Requirements

- Node.js 18 or newer
- npm
- Edge TTS, recommended for Chinese narration:

```bash
pip3 install edge-tts
```

On macOS, the TTS script can fall back to the system `say` command.

## Install for Local CLI Development

```bash
git clone https://github.com/coding-ax/docvideoer.git
cd docvideoer
npm install
```

Optional local CLI link:

```bash
npm link
docvideoer --help
```

Without `npm link`, run the same CLI through npm:

```bash
npm run docvideoer -- --help
```

## Quick Start

Render the included sample storyboard:

```bash
npm run docvideoer -- build \
  --storyboard examples/storyboard.example.json \
  --project-dir docvideo-output/example \
  --install
```

The final video will be written to:

```text
docvideo-output/example/output.mp4
```

`--install` runs `npm install` in the generated Remotion project before
rendering. Omit it if that project already has dependencies installed.

## Agent Workflow

Skill-aware agents discover [SKILL.md](./SKILL.md). Codex Agent also reads
[AGENTS.md](./AGENTS.md) when working inside this repository. Claude Code reads
[CLAUDE.md](./CLAUDE.md) and the `.claude/` commands/skills.

Install Remotion's official `remotion-best-practices` skill alongside this one.
Agents should use it whenever they need to inspect or modify the generated
Remotion project or reusable template.

In either agent, ask for:

```text
/docvideo https://example.com/article
```

or paste text directly:

```text
/docvideo 这是一段关于 AI 技术的介绍……
```

The agent should create:

```text
docvideo-output/<project-name>/source.md
docvideo-output/<project-name>/storyboard.json
```

Then it can call the CLI to synthesize audio, generate the Remotion project, and
render the video.

## CLI

```bash
docvideoer fetch <url> --out <source.md>
docvideoer tts --storyboard <storyboard.json> --audio-dir <audio-dir>
docvideoer setup --storyboard <storyboard.json> --audio-dir <audio-dir> --video-dir <video-dir>
docvideoer render --video-dir <video-dir> --out <output.mp4> [--install]
docvideoer build --storyboard <storyboard.json> --project-dir <project-dir> [--install]
```

Using npm scripts:

```bash
npm run docvideoer -- fetch https://example.com/article --out docvideo-output/demo/source.md
npm run docvideoer -- tts --storyboard docvideo-output/demo/storyboard.json --audio-dir docvideo-output/demo/audio
npm run docvideoer -- setup --storyboard docvideo-output/demo/storyboard.json --audio-dir docvideo-output/demo/audio --video-dir docvideo-output/demo/video
npm run docvideoer -- render --video-dir docvideo-output/demo/video --out docvideo-output/demo/output.mp4 --install
```

## TTS Configuration

Copy the example environment file if you want to change defaults:

```bash
cp .env.example .env
```

Supported values:

```text
TTS_BACKEND=edge
TTS_VOICE=zh-CN-XiaoxiaoNeural
TTS_RATE=+0%
EDGE_TTS_PATH=/path/to/edge-tts
```

Common Edge TTS voices:

| Voice | Description |
|------|-------------|
| `zh-CN-XiaoxiaoNeural` | Warm female voice, default |
| `zh-CN-YunyangNeural` | Professional male voice |
| `zh-CN-YunxiNeural` | Lively male voice |
| `zh-CN-XiaoyiNeural` | Lively female voice |

## Storyboard Format

Scene IDs must match audio filenames. For example, `scene-1` maps to
`audio/scene-1.mp3`.

```json
{
  "title": "视频标题",
  "description": "视频简介",
  "totalDuration": 120,
  "scenes": [
    {
      "id": "scene-1",
      "type": "title",
      "title": "场景标题",
      "narration": "讲解文案",
      "duration": 8,
      "visuals": {
        "type": "title",
        "title": "大标题",
        "subtitle": "副标题"
      }
    }
  ]
}
```

Supported scene types:

| Type | Component | Use |
|------|-----------|-----|
| `title` | `TitleScene` | Opening title |
| `content` | `ContentScene` | Title plus body text and optional image |
| `bullet` | `BulletListScene` | Animated bullet list |
| `image` | `ImageScene` | Full-screen image and caption |
| `end` | `EndScene` | Summary ending |

## Project Layout

```text
docvideoer/
├── SKILL.md
├── AGENTS.md
├── CLAUDE.md
├── .claude/
├── examples/
│   └── storyboard.example.json
├── scripts/
│   ├── docvideoer.mjs
│   ├── fetch-doc.mjs
│   ├── setup-remotion.mjs
│   └── tts.mjs
├── templates/
│   └── doc-video/
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

Generated projects belong in `docvideo-output/`, which is ignored by git.

## Development

```bash
npm install
npm run check
```

## Publish to GitHub

```bash
git init
git add .
git commit -m "Initial release"
git branch -M main
git remote add origin https://github.com/coding-ax/docvideoer.git
git push -u origin main
```

Before pushing to GitHub, keep these out of commits:

- `node_modules/`
- `.env`
- `docvideo-output/`
- generated audio and video files

## License

MIT
