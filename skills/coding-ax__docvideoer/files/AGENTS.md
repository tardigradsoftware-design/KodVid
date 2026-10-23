# AGENTS.md — docvideoer

This project supports Codex agent workflows for turning documents into narrated
Remotion videos.

## Project Overview

`docvideoer` converts a document URL or pasted text into an explainer video. The
agent coordinates document extraction, storyboard generation, TTS synthesis,
Remotion project setup, rendering, and final output reporting.

## External Skill Dependency

Remotion-specific implementation depends on Remotion's official
`remotion-best-practices` skill. When creating, debugging, or changing the
Remotion project, scene components, timeline, animation, audio sync, captions,
assets, or rendering flow, use `$remotion-best-practices` if it is installed. If
it is missing, tell the user to install it with:

```bash
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices
```

## Trigger Intent

When the user says `/docvideo`, "把这个文档转成视频", "根据这篇文章生成视频",
or otherwise asks to create a video from a URL/text document, run the document
to video workflow below.

## Output Layout

Create each video project under:

```text
docvideo-output/<project-name>/
```

Expected files:

```text
source.md                 # fetched or pasted source content
storyboard.json           # structured storyboard
tts-batch.json            # optional batch input for TTS
audio/                    # scene audio and optional VTT subtitles
video/                    # generated Remotion project
output.mp4                # rendered video
output-with-subtitles.mp4 # optional subtitle-burned video
```

Use a short, filesystem-safe project name derived from the document title or
topic.

## Workflow

1. Get document content.
   - For URLs, run:
     ```bash
     node scripts/fetch-doc.mjs <url> --out docvideo-output/<project-name>/source.md
     ```
   - For pasted text, write it to `source.md`.

2. Generate `storyboard.json`.
   - Extract the document's core points.
   - Use concise scenes, each focused on one idea.
   - Estimate Chinese narration at about 4 characters per second.
   - Use these scene types: `title`, `content`, `bullet`, `image`, `end`.

3. Synthesize TTS.
   - Use the CLI wrapper or the free TTS script in `scripts/tts.mjs`.
   - Default backend is Edge TTS, with macOS `say` as fallback.
   - Batch input format:
     ```json
     [
       { "id": "scene-1", "text": "讲解文案", "output": "docvideo-output/<project-name>/audio/scene-1.mp3" }
     ]
     ```
   - Run:
     ```bash
     npm run docvideoer -- tts --storyboard docvideo-output/<project-name>/storyboard.json --audio-dir docvideo-output/<project-name>/audio
     ```

4. Set up the Remotion project.
   ```bash
   npm run docvideoer -- setup --storyboard docvideo-output/<project-name>/storyboard.json --audio-dir docvideo-output/<project-name>/audio --video-dir docvideo-output/<project-name>/video
   ```

5. Render the video from the generated Remotion project.
   ```bash
   npm run docvideoer -- render --video-dir docvideo-output/<project-name>/video --out docvideo-output/<project-name>/output.mp4 --install
   ```

6. Report the result.
   - Provide the final MP4 path.
   - Provide the generated description from `storyboard.description`.
   - Mention any failed optional step, such as missing subtitles.

## Storyboard Contract

Use this JSON shape:

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

Scene IDs must match audio filenames. For example, `scene-1` expects
`audio/scene-1.mp3`.

## Video Defaults

- Resolution: 1920x1080
- Aspect ratio: 16:9
- FPS: 30
- Codec: H.264
- Remotion composition ID: `DocVideo`
- Default Edge TTS voice: `zh-CN-XiaoxiaoNeural`

## Local Commands

```bash
npm install
npm run check
npm run docvideoer -- --help
npm run fetch -- <url> --out <path>
npm run tts -- --file <tts-batch.json>
npm run setup-video -- <output-dir> --storyboard <storyboard.json> --audio-dir <audio-dir>
npm run docvideoer -- build --storyboard examples/storyboard.example.json --project-dir docvideo-output/example --install
```

## Environment

Optional `.env` values:

```text
TTS_BACKEND=edge
TTS_VOICE=zh-CN-XiaoxiaoNeural
TTS_RATE=+0%
EDGE_TTS_PATH=/path/to/edge-tts
```

Edge TTS requires:

```bash
pip3 install edge-tts
```

If Edge TTS is unavailable on macOS, the script can fall back to the system
`say` command.

## Editing Guidance

- Keep generated projects inside `docvideo-output/`.
- Keep reusable Remotion template changes in `templates/doc-video/`.
- Keep orchestration script changes in `scripts/`.
- Do not commit or rely on generated MP4/audio artifacts unless the user asks.
- Prefer the behavior implemented in `scripts/tts.mjs` and `.env.example`.
