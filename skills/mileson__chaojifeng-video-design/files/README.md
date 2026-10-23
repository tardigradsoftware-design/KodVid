# 超级峰的视频设计方法论

一个帮助 AI Agent 设计和制作视频的 Skill。从观众需要理解什么开始，组织主线、镜头、素材、旁白、音乐与节奏，再完成预览、审片和成片交付。

适合产品介绍、知识讲解、资讯呈现、图片成片、故事视频、功能动效、品牌短片和音乐视觉表演。也可以只做方案、分镜或局部修改。

## 它能帮你做什么

- **把需求变成可修改的计划。** 明确每个镜头要传达的信息、重点、时间和下一镜如何衔接。
- **让声音和画面共同表达。** 先取得真实旁白并测量时长，再安排字幕、资料、配乐片段和音效落点。
- **把抽象知识逐层讲清楚。** 先核对事实与术语，再选择载体、关系图和逐步揭示的方式。
- **按范围修改已有作品。** 定位镜头、对象或时间段，检查变动影响的声音、字幕与接缝。
- **检查交付是否完整。** 校验计划、素材引用、时间、文件哈希与实际媒体信息，分别记录已完成和未验证的项目。

内含 8 类场景、7 种风格、12 项底层动效、64 项表达指导和 17 类组合配方。目录中的条目提供设计与实现指导，具体效果由实际工程完成。

## 同一套方法，按场景走不同链路

![八类视频场景的组织链路与观众所得](assets/diagrams/scenario-routes.png)

先确定观众要得到什么，再选表达方式。同一组文字、图像、镜头和声音，可以组织成产品证据、概念解释、故事推进或音乐视觉。

| 组成 | 解决什么问题 | 例子 |
| --- | --- | --- |
| 元素 | 用什么表达 | 文字、图像、镜头、声音，以及可复用的揭示、对照、强调 |
| 规则 | 怎样保证表达成立 | 事实有依据、文字可读、主体连续、声画时间对应 |
| 配方 | 怎样组织一类任务 | 产品任务证明、概念知识科普、产品音乐叙事 |
| 流程 | 怎样完成和交付 | 计划、制作、审片、返修、导出；按要求直接完成或分阶段审阅 |

| 场景 | 典型链路 | 观众所得 |
| --- | --- | --- |
| 产品演示 | 真实任务 → 关键操作 → 结果证据 | 看懂产品能做什么 |
| 知识讲解 | 核对事实 → 建立关系 → 逐层解释 | 理解概念、关系或过程 |
| 资讯呈现 | 核对来源 → 梳理变化 → 说明未知 | 知道发生了什么 |
| 图片成片 | 素材排序 → 焦点移动 → 转场接力 | 图片连成一段表达 |
| 故事视频 | 人物目标 → 事件推进 → 转折收束 | 跟随一个故事 |
| 功能动效 | 初始状态 → 操作触发 → 变化反馈 | 看懂交互如何发生 |
| 品牌短片 | 品牌主张 → 视觉母题 → 记忆落点 | 记住品牌的感受 |
| 音乐视觉 | 乐段结构 → 动机变奏 → 高潮释放 | 体验声音与画面的共振 |

图中的“概念知识科普”是知识讲解场景下的一种配方。需要音乐推进时，先选曲、分析实际乐段，再安排知识分层、字幕和揭示落点；事实和阅读时间优先。一般知识讲解仍可由旁白、过程或关系领拍。

配方可以继续扩展，也可以组合局部表达或自由设计。链路提供创作起点，最终仍按当前任务检查内容、画面、声音与导出结果。

## 成片案例

### 小圆角

https://github.com/user-attachments/assets/d87f8264-0a95-40d6-adbb-4e7e0afa32d3

22 秒竖屏片段，将圆角滑动、九张批量处理与小卡环形展示串成一段。点击播放器观看，可通过音量按钮开启声音。

### AI 闯关记

https://github.com/user-attachments/assets/bced29b5-a55a-4f92-85a5-865c6730752a

约 18.6 秒横屏高亮，将开机倒数与“升级闯关”副歌串联。点击播放器观看，可通过音量按钮开启声音。

两部作品均在 Cursor 中协作制作。选段、方法对应和创作来源见 [案例说明](examples/showcase/README.md)。

## 安装

将仓库克隆到你的 Agent 能加载的 Skill 目录。以 Codex 为例，目标目录不存在时执行下面的命令。

```sh
git clone https://github.com/mileson/chaojifeng-video-design.git ~/.codex/skills/chaojifeng-video-design
```

已有同名 Skill 时，先检查自己的改动与私人素材，避免覆盖。其他支持 `SKILL.md` 的 Agent 可将完整目录放到对应的 Skill 路径，保留相对目录结构。

## 开始使用

在 Agent 中调用 `$chaojifeng-video-design` 并描述目标，例如下面几种任务。

最短可以这样写：

> 用 $chaojifeng-video-design 做一期关于【主题】的概念知识科普视频，一次性完成。

也可以指定音乐：

> 用 $chaojifeng-video-design，以我提供的【音乐文件】制作【主题】的概念知识科普视频，按这首曲子的结构编排，直接完成成片。

> 为这个产品制作一条 30 秒竖版介绍视频。使用项目中已有的截图和素材，先确认要证明的任务，再完成镜头、声音、成片和必要编辑源。

> 把这组图片组织成一条 20 秒视频，保留主体，安排画面重点与转场。音乐使用我提供的获准音轨。

> 只修改第 3 个镜头，让操作结果更容易看清，并复验相关字幕和声音落点。

> 我只需要分镜方案。请先核实 TCP 三次握手的事实，再用逐层递进的画面解释。

Agent 会根据已有项目和工具选择实现方式。此仓库包含创作方法、合同、示例和检查脚本；生成、渲染、配音与导出需要宿主提供相应能力。它不附带通用视频渲染器，也不要求固定模型或引擎。

明确要求“一次性完成、直接成片、无需试片”时，Agent 连续完成制作、内部检查和必要返修；要求分阶段审阅时，才在约定节点等待。只要方案、分镜或局部修改，也可以直接说明范围。

## 浏览和检查

在仓库根目录执行。查询与合同检查脚本使用 Python 3.10 或更新版本及标准库；媒体探测和部分测试还需要现有的 FFmpeg、ffprobe。无需安装 Python 第三方包。

```sh
python3 scripts/catalog.py --kind scenario list
python3 scripts/catalog.py --kind recipe get product-task-proof
python3 scripts/catalog.py --kind expression get visual.target-callout
python3 scripts/validate_plan.py examples/product-demo.plan.json
python3 -m unittest discover -s scripts -p 'test_*.py'
```

用浏览器打开 [表达图册](assets/gallery/index.html) 查看设计示意，也可以直接阅读 [Skill 入口](SKILL.md)、[计划合同](references/plan-contract.md) 和 [执行与交付](references/runtime-and-delivery.md)。图册与计划示例用于理解和检查结构，实际作品仍需渲染、观看与试听。

## 音乐和声音

“概念知识科普”配方支持**一个音乐池、多首候选、一首默认**。选择顺序为：用户明确指定 → 项目已选 → 配方当前默认。新增候选与更换默认分别处理；单次指定只影响当前作品。换曲后重新分析实际乐段、拍点和映射，不沿用旧曲的节奏结论。

当前 [音乐目录](catalog/music.json) 保留“知识分享背景音乐神曲”的元信息，作为该配方的初始默认引用；仓库不附带音源。使用默认曲目前，需将获准的同一文件关联到本机位置表，脚本会核对哈希和实际时长。也可以直接指定自己的音乐文件，无需先修改音乐池：

```sh
python3 scripts/music_library.py search --recipe knowledge-music-explainer --limit 5
python3 scripts/music_library.py select --recipe knowledge-music-explainer --source-file /project/music/chosen.wav
```

其他配方按各自配置与任务选曲。按 [音乐导演说明](references/music-direction.md) 添加自己获准使用的曲目与片段，记录实际文件哈希、时长、来源和使用范围。音源位置通过项目内的 `*.local.json` 或 `CJF_VIDEO_MUSIC_REGISTRY` 关联，不提交到仓库。

```sh
python3 scripts/music_library.py validate-catalog
python3 scripts/music_library.py search --scenario product-demo --emotion curious --role establish --limit 5
python3 scripts/build_music_atlas.py
```

添加曲目后重新生成图册；仅导入音源位置表不会新增曲目。默认音源缺失或哈希变化时，选择工具返回具体缺口，不静默换曲。

[概念知识科普编排](references/knowledge-music-direction.md) 说明音乐地图、字幕与旁白分支、阅读窗和声音提示；可选的 [声画任务表](templates/knowledge-music-score.json) 通过 `explainer_timing_audit.py` 检查已声明的阅读窗与时间映射。结构检查不代替测拍、连续观看或听审。

旁白参考由使用者自行提供，按 [讲解与声音参考](references/explainer-narration.md) 检查授权、降噪派生、准确读稿和实际听感。仓库不附带私人声音、付费歌曲、模型权重或第三方成片素材。

## 目录

| 位置 | 内容 |
| --- | --- |
| `SKILL.md` | Agent 入口与执行方法 |
| `references/` | 导演、知识表达、镜头、声音与验收方法 |
| `catalog/` | 场景、风格、动效、表达与配方目录 |
| `templates/` | 计划、交付记录、声音事件表与其他模板 |
| `examples/` | 计划、知识包结构示例与成片案例 |
| `scripts/` | 查询、校验、探测、图册构建和离线测试 |
| `assets/` | 本地可打开的表达与音乐图册 |
| `evals/` | 尚未执行的创作评测题目 |

检查通过只说明对应结构或测量条件成立。画面、听感、事实与观众理解需要分别验收，未做的检查保留未验证状态。

## 许可与来源

本仓库原创代码、文档、模板和图册采用 [MIT License](LICENSE)。案例视频的使用范围见 [案例说明](examples/showcase/README.md#使用范围)。方法参考及其边界见 [来源说明](references/sources.md)。外部链接指向的代码、商标、字体、音乐与视频按各自许可使用。
