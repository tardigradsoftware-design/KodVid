# CLAUDE.md — docvideoer

`docvideoer` 是一个 AI 驱动的文档转视频工具，将文档内容（URL 或文本）自动转换为讲解视频。它编排了文档抓取、内容分析、分镜生成、TTS 语音合成、Remotion 视频渲染的完整流水线。

## 触发方式

当用户使用 `/docvideo` 命令或在对话中说「把这个文档转成视频」「根据这篇文章生成视频」等意图时激活本 skill。

## 外部 Skill 依赖

Remotion 相关实现依赖官方 `remotion-best-practices` skill。处理 Remotion 项目、组件、时间线、动画、音频同步、字幕或渲染问题时，优先使用该 skill；如果未安装，提示用户运行：

```bash
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices
```

## 工作目录

所有视频项目在用户当前工作目录的 `docvideo-output/` 下创建。每个视频项目有独立的子目录，包含脚本、素材、音频和最终的 Remotion 项目。

## 核心流水线（6 步）

### 第 1 步：获取文档内容
- 如果用户提供 URL，使用 `scripts/fetch-doc.mjs` 抓取网页内容（自动提取正文、翻译处理）
- 如果用户直接粘贴文本，直接使用
- 将内容保存到 `docvideo-output/<project-name>/source.md`

### 第 2 步：内容分析与分镜生成
- 分析文档核心内容，提取关键要点
- 生成结构化的分镜脚本（storyboard），包含：
  - 场景编号、场景类型（title/content/bullet/image/end）
  - 每段的讲解文案（narration script）
  - 建议的视觉呈现方式（标题、列表、图示等）
  - 预估时长（按中文 ~4 字/秒 计算）
- 将分镜保存为 `docvideo-output/<project-name>/storyboard.json`

分镜 JSON 结构：
```json
{
  "title": "视频标题",
  "description": "视频简介（用于社交媒体）",
  "totalDuration": 120,
  "scenes": [
    {
      "id": "scene-1",
      "type": "title",
      "title": "场景标题",
      "narration": "讲解文案……",
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

### 第 3 步：TTS 语音合成
- 使用 `scripts/tts.mjs` 合成语音（**免费方案，无需 API 凭证**）
- 也可以使用统一 CLI：`npm run docvideoer -- tts --storyboard <storyboard.json> --audio-dir <audio-dir>`
- 默认使用 **Edge TTS**（微软在线 TTS，音质好，自动生成字幕）
  - 需要安装：`pip3 install edge-tts`
- 备用 **macOS say**（系统自带，离线可用）
- 为每个场景分别合成语音（支持并行）
- 获取每段音频的实际时长，更新分镜时间线
- 音频保存到 `docvideo-output/<project-name>/audio/`

### 第 4 步：Remotion 视频项目搭建
- 在 `docvideo-output/<project-name>/video/` 下创建 Remotion 项目
- 使用 `templates/doc-video/` 作为基础模板
- 可使用：`npm run docvideoer -- setup --storyboard <storyboard.json> --audio-dir <audio-dir> --video-dir <video-dir>`
- 根据分镜信息生成对应的场景组件
- 实现音频和视觉的精确同步

### 第 5 步：渲染视频
- 使用 `npm run docvideoer -- render --video-dir <video-dir> --out <output.mp4> --install` 或 `npx remotion render` 命令渲染最终 MP4
- 输出到 `docvideo-output/<project-name>/output.mp4`

### 第 6 步：输出结果
- 展示视频文件路径
- 输出视频描述文本（便于发社交媒体）
- 提供渲染统计信息

## 关键约定

### 视频参数
- 分辨率：1920×1080（横屏 16:9）
- 帧率：30fps
- 编码：h264
- 默认使用 Remotion 的无服务器渲染（`@remotion/renderer`）

### 场景类型与组件映射

| 场景类型 | Remotion 组件 | 说明 |
|---------|---------------|------|
| `title` | `<TitleScene>` | 视频标题封面，带动画效果 |
| `content` | `<ContentScene>` | 内容讲解，支持标题+正文+配图 |
| `bullet` | `<BulletListScene>` | 要点列表，逐条动画出现 |
| `image` | `<ImageScene>` | 全屏图片+旁白 |
| `end` | `<EndScene>` | 结尾总结页 |

### TTS 参数
- 默认后端：Edge TTS（`edge-tts`）
- 默认音色：`zh-CN-XiaoxiaoNeural`（温暖女声）
- 编码：mp3
- 语速：+0%（可调，如 "+10%" 或 "-10%"）
- 支持字幕生成（VTT 格式）
- 备用后端：macOS `say`（Tingting 普通话女声）

### 可用音色（Edge TTS）
| 音色 | 描述 |
|------|------|
| `zh-CN-XiaoxiaoNeural` | 温暖女声（默认） |
| `zh-CN-YunyangNeural` | 专业男声 |
| `zh-CN-YunxiNeural` | 活泼男声 |
| `zh-CN-XiaoyiNeural` | 活泼女声 |

## 用户配置

无需 API 凭证！TTS 使用免费方案：

```bash
# 安装 Edge TTS（推荐，音质好）
pip3 install edge-tts

# 或使用 macOS 系统自带（无需安装）
```

可选环境变量（`.env`）：
```
TTS_BACKEND=edge          # 强制指定: edge | mac
TTS_VOICE=zh-CN-XiaoxiaoNeural
TTS_RATE=+0%
```

## 依赖

- Node.js >= 18
- Edge TTS（`pip3 install edge-tts`）或 macOS 系统自带 TTS
- Remotion（`@remotion/bundler`、`@remotion/renderer`）
- FFmpeg（Remotion v6 内置）
