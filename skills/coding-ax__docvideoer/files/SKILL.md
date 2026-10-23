---
name: docvideoer
description: 文档转视频技能。用于把文档 URL、网页文章、Markdown 或粘贴文本转换成带中文旁白的 Remotion 讲解视频，包含正文提取、分镜生成、免费 TTS、视频项目搭建和 MP4 渲染。
---

# docvideoer

Use this skill when the user asks to turn a document, article, URL, Markdown
file, or pasted text into a narrated explainer video. Trigger phrases include
`/docvideo`, "把这个文档转成视频", "根据这篇文章生成视频", and similar requests.

## External Skill Dependency

This skill depends on Remotion's official `remotion-best-practices` skill for
Remotion-specific implementation guidance. When creating, debugging, or changing
the Remotion project, scene components, timeline, animation, audio sync,
captions, assets, or rendering flow:

- Use the installed `$remotion-best-practices` skill if it is available.
- If it is not available, tell the user to install it with:
  `npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices`.

## Output Layout

Create each generated project under:

```text
docvideo-output/<project-name>/
```

Expected files:

```text
source.md
storyboard.json
tts-batch.json
audio/
video/
output.mp4
output-with-subtitles.mp4
```

Use a short, filesystem-safe project name derived from the document title or
topic.

## Workflow

1. Get document content.
   - For URLs, run `node scripts/fetch-doc.mjs <url> --out docvideo-output/<project-name>/source.md`.
   - For pasted text, write it to `source.md`.
2. Generate `storyboard.json`.
   - Extract the document's core points.
   - Use concise scenes, each focused on one idea.
   - Estimate Chinese narration at about 4 characters per second.
   - Use scene types: `title`, `content`, `bullet`, `image`, `end`.
3. Synthesize TTS.
   - Prefer `npm run docvideoer -- tts --storyboard docvideo-output/<project-name>/storyboard.json --audio-dir docvideo-output/<project-name>/audio`.
   - Default backend is Edge TTS; on macOS, `say` can be used as fallback.
4. Set up the Remotion project.
   - Run `npm run docvideoer -- setup --storyboard docvideo-output/<project-name>/storyboard.json --audio-dir docvideo-output/<project-name>/audio --video-dir docvideo-output/<project-name>/video`.
5. Render the video.
   - Run `npm run docvideoer -- render --video-dir docvideo-output/<project-name>/video --out docvideo-output/<project-name>/output.mp4 --install`.
6. Report the result.
   - Provide the final MP4 path.
   - Provide `storyboard.description`.
   - Mention any optional step that failed, such as subtitle generation.

## Storyboard Contract

Scene IDs must match audio filenames. For example, `scene-1` expects
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

## Defaults

- Resolution: 1920x1080
- Aspect ratio: 16:9
- FPS: 30
- Codec: H.264
- Remotion composition ID: `DocVideo`
- Default Edge TTS voice: `zh-CN-XiaoxiaoNeural`

## Requirements

- Node.js 18 or newer
- Project dependencies installed with `npm install`
- Edge TTS recommended: `pip3 install edge-tts`
- macOS `say` can be used as a fallback TTS backend
