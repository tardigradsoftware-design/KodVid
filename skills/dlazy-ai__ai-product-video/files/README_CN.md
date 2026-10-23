<div align="center">

<img alt="ai-product-video" src="./assets/brand/logo-mark.svg" width="112" height="112">

<h1>ai-product-video</h1>

[![GitHub stars](https://img.shields.io/github/stars/dlazy-ai/ai-product-video)](https://github.com/dlazy-ai/ai-product-video/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dlazy-ai/ai-product-video)](https://github.com/dlazy-ai/ai-product-video/network/members)


**让 agent 帮你制作电影感产品视频的 skill：152 张镜头配方卡 · 209 个样式 · 调校过的 Remotion 实现 · 已验收的镜头结构**

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md)

</div>

**ai-product-video** 是一个把 Claude Code / Codex 变成动效工作室的 AI agent skill：
把你的产品交给它，它会用 [Remotion](https://www.remotion.dev/) 完成分镜、动画
和声音设计，产出一支电影感的宣传片 / 营销视频 / 发布视频 / 功能演示——
真实页面截图、2.5D 运镜、节奏卡点和电影级 SFX 全部包含。

🖼️ **浏览镜头库** —— 直接读 [`references/shots/`](references/shots/) 里的卡片，
按 10 个功能类别分目录。

## ✨ 最近更新

> [!IMPORTANT]
> ### 🆕 2026-08 · 新增 48 张镜头配方卡
> 卡库从 104 张扩充到 **152 卡 / 209 个样式**。由 209 个候选动效经八轮
> 与参考片逐帧比对评审收敛而来，按既有类别并入卡库：完整配方卡 +
> 原生 Remotion 组件（`demos/<类别>/<卡名>/<组件>.tsx`，归一化进度 t
> 驱动、逐帧确定性）。全部模板化：中性占位文案 + 单一可替换
> `ACCENT` 强调色变量。

- **2026-07 · 音频库重构**——`sfx/<类别>/` 结构，149 个音效
  按场景/材质分 16 类，md5 去重并补回授权 URL。

## 🎬 效果预览

下面这支 38 秒的镜头库介绍片，本身就是用这个 skill 制作的——
从分镜、镜头实现到声音设计，全部由 agent 按库内方法论完成：

https://github.com/user-attachments/assets/cba2df8a-4b2e-4247-bace-d0b1dea9c2bd

▶️ [在 YouTube 观看高清版](https://youtu.be/gcVvRM_P3SM)


## 🚀 快速开始

**最直接的方式：把仓库链接丢给你的 agent。**
在 Claude Code / Codex 等 agent 里说：

```text
帮我安装这个 skill：https://github.com/dlazy-ai/ai-product-video
```

agent 会克隆仓库并链接到 skills 目录。也可以用 [skills](https://skills.sh/) CLI
或手动安装：

```bash
npx skills add dlazy-ai/ai-product-video
```

```bash
git clone https://github.com/dlazy-ai/ai-product-video.git
cd ai-product-video
ln -s "$(pwd)" ~/.claude/skills/ai-product-video   # Claude Code
# 或
ln -s "$(pwd)" ~/.codex/skills/ai-product-video    # Codex
```

### 配置 dlazy CLI

画面由 Remotion 生成，**音乐、补充音效、旁白、字幕和 B-roll 走
[dlazy](https://dlazy.com) CLI** —— 一条命令覆盖多家模型，不用自己对接各家 API：

```bash
npm install -g @dlazy/cli@1.2.3
dlazy login   # device-code flow, works over SSH
dlazy -h      # list every tool available to your account
```

`dlazy login` 走设备码流程（远程终端也能用），key 自动写入
`~/.dlazy/config.json`。不想全局安装就用 `npx @dlazy/cli@1.2.3 <command>`；
已有 API key 用 `dlazy auth set <key>`（在
[控制台](https://dlazy.com/dashboard/organization/api-key) 获取）。

自带的 149 个音效不需要账号。只有当片子要配乐、旁白、字幕，或需要截图给不了
的运动镜头时，才会用到 CLI。

装好后直接提需求：

```text
用 ai-product-video 给我的桌面产品做一支宣传片。
用 deck-deal-flyin 和 row-embed 两张镜头卡展示这个功能。
参考 spotlight-hero-card，为这个页面设计一个产品特写镜头。
```

如果没有指定镜头卡，skill 会先介绍现成成片模板并询问是否采用；
也可以先从 [`references/shots/`](references/shots/) 里挑好镜头再开始。

## 📼 成片模板：Ink Press（墨压）

skill 内置 **Ink Press（墨压）** 模板——一支已验收的完整宣传片：
36.2 秒、1920×1080、30fps、10 个镜头的纸墨琥珀风，含 2.5D 真实页面运镜、
字卡、转场和配好的电影感 SFX：

https://github.com/user-attachments/assets/4cf5af51-98f3-4af2-8ab2-7267f470513d

▶️ [在 YouTube 观看高清版](https://youtu.be/iShab28B_ak)

使用方式：直接告诉你的 agent——

```text
用 ai-product-video 的 Ink Press 模板给我的产品做一支宣传片。
```

agent 会替换成目标产品的截图、文案和品牌信息，复现同等质感——
这是最快、质量最有保障的出片路径。

> 后续会持续更新更多模板。

### Headless / CI 注意事项

在无显示器的 Linux 服务器上渲染（实测环境：2 核、Node 22）会遇到三个坑，
都可以一个参数解决：

1. **并发上限** —— 低核机器上 `remotion still/render` 会报
   "Maximum for --concurrency is 2"。解决：加 `--concurrency=1`。
2. **旧版 Headless 被移除** —— 新版 Chrome/Chromium 已删除旧 headless 模式，
   让 Remotion 指向系统 chromium 会启动失败。解决：改用
   chrome-headless-shell 二进制，而不是完整版 Chrome。
3. **CDN 被墙** —— 如果 remotion.media 无法访问，headless-shell 的自动下载
   会失败。解决：用 `--browser-executable=<本地 chrome-headless-shell 路径>`
   指定本地二进制。

加上这三个参数后，采集好自己的素材即可正常渲染。

## 📦 项目包含什么

| 内容 | 说明 |
| --- | --- |
| 152 张镜头配方卡 | 记录用途、能量、建议时长、参数、实现要点与已知坑 |
| 209 个样式变体 | 152 张卡共覆盖 209 个样式变体，每个变体都对应一份 Remotion demo |
| Remotion 参考实现 | 每张卡对应经过调校的 TSX demo，包含实际缓动和时序参数 |
| Ink Press 镜头结构 | 已验收的 36.2 秒 / 1920×1080 / 30fps / 10 镜头宣传片——场景源码随附，原片截图不随附，素材换成你自己的 |
| 组件与素材 | 2.5D 页面相机、字幕、闪切、数字滚动、音效和素材采集脚本 |
| 制作方法论 | 从素材采集、风格定调和分镜，到声音设计、节奏卡点与最终验收 |
| dlazy CLI 集成 | 配乐、补充音效、旁白、逐词字幕、B-roll 生成，全部走一个 CLI |

当前主要面向 Web 与桌面产品宣传片，但镜头卡也可以单独用于功能演示、
品牌短片、发布视频或其他动态设计项目。

## 🗂 项目结构

```text
ai-product-video/
├── SKILL.md                 # Agent 使用入口与核心制作规则
├── references/
│   ├── pipeline.md          # 完整制作流水线
│   ├── shots/               # 152 张镜头配方卡
│   ├── sequences/           # 可复用的全片结构与桥段模板
│   ├── aesthetic-rules.md   # 视觉验收准则
│   ├── music-beat-sync.md   # BGM 节奏分析与卡点方法
│   └── sound-design.md      # 声音设计方法与判例
├── demos/                   # 镜头卡的 Remotion 参考实现（同类别目录）
├── template/                # 参考片的镜头结构与场景源码（原片素材未随附）
└── assets/
    ├── lib/                 # 可复制使用的 Remotion 组件
    ├── scripts/             # 页面素材采集脚本
    └── audio/               # 只含 SFX —— BGM 走 `dlazy search_audio`
        └── sfx/<类别>/      # 149 个音效，按场景分 16 类
```

完整工作流和实现要求见 [SKILL.md](SKILL.md)、
[制作流水线](references/pipeline.md) 与
[视觉验收准则](references/aesthetic-rules.md)。

## 🔊 音频与素材说明

`assets/audio/` 中的音效可按各自授权条件使用，来源与许可信息见
[ATTRIBUTION.md](assets/audio/ATTRIBUTION.md)。

音效按场景/材质分 16 类（`transition` `impact` `riser` `camera` `ui` `text`
`paper` `film` `light` `data` `scifi` `mech` `glass` `fluid` `crowd` `counter`），
**找音先定类别再挑音色**；类别索引与逐文件用途见
[sound-design.md](references/sound-design.md)。

`assets/audio/` **只含 SFX** —— BGM 用 `dlazy search_audio` 按需取，不随库分发；
取回的曲子请当场记录曲名、来源与授权。

参考片的截图素材同样**未随附**：`template/` 提供的是它的镜头结构与场景源码，
素材按 [TEMPLATE.md](template/TEMPLATE.md) 采集目标产品自己的。对外发布成片前，
请确认截图中的数据、客户信息和个人信息是否需要脱敏。

## 🙏 致谢

**ai-product-video 基于 [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)**（作者 Wei Yihao，Apache-2.0）
改造 —— 镜头卡库、demo 实现、制作流水线与 Ink Press 参考片均出自上游。本版本把
配乐、旁白、字幕与 B-roll 接到 [dlazy](https://dlazy.com) CLI，并移除了不便由我们
再分发的内容；完整修改清单见 [NOTICE.md](NOTICE.md)。

本库中许多镜头配方源自对优秀官方产品宣传片动效语言的研究学习——包括
**ClickUp、Perplexity、Slack、Notion、Figma、Framer、Bear、Raycast、
Pitch、Miro、Superhuman、Loom** 等产品的宣传片。镜头卡记录的是从零重新
实现的动效技法（时序、缓动、编排）；仓库中不包含上述影片的任何素材、
画面或品牌资产。所有商标归各自所有者所有，上述公司与本项目无关联、
亦未对本项目背书。2026-08 新增 48 张卡的逐批次来源说明见
[references/shots/ATTRIBUTION.md](references/shots/ATTRIBUTION.md)。

特别感谢：

- **[Remotion](https://www.remotion.dev/)** —— 驱动本库全部 demo 与模板的
  React 视频框架。请注意 Remotion 有自己的
  [许可协议](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
  （个人与小团队免费，公司可能需要付费许可）。
- **[Mixkit](https://mixkit.co/)** —— 库内 149 个 SFX 的来源
  （免费商用授权）。
- 游戏手感与动画社区的公开方法论（如 Vlambeer 的 screenshake 演讲、
  经典动画时序原则），多张镜头卡受其启发。
- **Claude Code** —— 本库自身的构建、迭代与验收全程由 AI coding agent
  完成，用的正是这个 skill 所传授的工作流。
