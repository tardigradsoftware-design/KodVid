# 从叙事意图找音乐片段

用于选曲、编排与替换配乐。先确定这一段让观众怎样变化，例如从怀疑到好奇、从观察到行动、从紧张到释然。给声音职责、需要的时长、旁白密度、视觉落点与希望避开的质感，再检索。整曲贯穿、同曲不同段、跨曲组合和静默都可以成立，不强制三首或三幕。

## 音乐图册与 Agent 查询

读取 `catalog/music.json` 的 taxonomy 或执行查询，按需查询已添加的曲目。`assets/music/index.html` 是自包含图册，支持按八类场景、情绪、叙事职责搜索，波形、变化点与候选片段定位。图册不含原始歌曲；导入本机 registry 后才可尝试原文件试听。浏览器/宿主不能播本地文件时保留未验证状态，不绕过其安全限制。

```text
python3 SKILL_ROOT/scripts/music_library.py search --scenario product-demo --emotion curious --role establish --narration --avoid-bright --limit 5
python3 SKILL_ROOT/scripts/music_library.py search --scenario brand-film --role payoff --energy high --limit 5
python3 SKILL_ROOT/scripts/music_library.py get your-track-id --registry /project/music-registry.local.json
python3 SKILL_ROOT/scripts/music_library.py health --registry /project/music-registry.local.json
python3 SKILL_ROOT/scripts/music_library.py validate-sheet /project/music-cue-sheet.json --registry /project/music-registry.local.json
```

查询返回片段，不只返回歌曲；情绪、用途是导演建议，排序分数不是审美质量。查无匹配时放宽一个条件、试听同曲其他段或找获准的新音乐，不强配。曲内 relative_energy 与整曲 arousal 分开；前者是相对信号强弱，后者是待试听的情绪唤醒建议。低频谱占比不等于声音一定舒服，无人声初筛不等于无旁白遮蔽。

公开版保留概念知识科普初始默认曲的元信息及场景、情绪与叙事职责分类，不附带音源或会员曲库数据。使用者可关联获准的同一音源，或添加自己的曲目、真实哈希、实际时长与候选片段。

分析、导演推断与实际试听分别记录；没有测量或听审的数据保持未验证。

## 概念知识科普的默认音乐与候选池


“概念知识科普”的初始默认引用为 `user-knowledge-sharing-theme`（知识分享背景音乐神曲），支持增加候选和更换默认。目录保留实测约119.083秒的时长和源哈希，不附带音源。首次使用需自行准备获准的同一音源并建立本机registry；指定自己的音乐可直接用 `select --source-file`，不必先加入音乐池。

- 音乐库记录曲目事实和素材，配方`music_policy`记录候选与默认引用；用户指定优先于项目已选，再到配方默认。使用本配方且均未指定时直接采用当前默认，不重复询问；无配乐和原声要求优先。其他配方各自配置，不把本曲设为全部科普或教程的全局默认。
- 单次指定、项目选择、加入候选和设为默认分别处理。用户明确加入候选时登记核实的曲目ID、来源、哈希、实际时长和用途，再加入配方池；设为默认必须是池内曲目。一次选择不改变池和默认，新候选不自动接任默认。可通过`select --source-file`直接用于本项目，不强制先改全局库。
- 本配方按所选音乐反推段落：先核曲目和音乐地图，再分配问题、条件、机制、揭示与收束，最后排字幕和动作。换曲后不继承旧曲的BPM、时刻、调性、续接或听审结论。`select`检查所选本地源，缺失或变化时返回blocked，不静默换曲；不替代授权核查、分析音乐或听审。
- 用户选用后，视频较短就裁剪原曲；超过原曲时长就从曲首接第二遍，只保留补足片长所需部分，裁掉第二遍后面的多余音频。仍不够时依此续接，不因为片长增加而自动换曲或变速。
- 120秒视频的直接续接示例：第一次播放原曲 `[0, 119.083)`，第二次播放原曲开头约 `[0, 0.917)`，成片落点分别为 `[0, 119.083)` 和 `[119.083, 120)`。示例时间为四舍五入值，实际使用精确时长计算；交叉淡化、尾部静音或切点调整后重新计算补齐量。片长指整片实际长度。
- cue sheet 对每次播放使用不同放置ID、同一 track_id 与源哈希，分别记录 source_in/out 与 timeline_start/end；保留“同曲续接补长”的理由。循环不代表无缝：按实际旁白试听接缝、首击与尾音，必要时调整切点、短淡化及结尾淡出，保持成片长度准确。
- 本曲用途与初始默认来自用户指令；基本信号分析不证明情绪、无人声、旁白适配或循环听感。当前听审、测拍与调性保持未验证，音源不公开分发。上述同曲从头续接仅属于本曲，其他候选独立安排时长适配。

```text
python3 SKILL_ROOT/scripts/music_library.py get user-knowledge-sharing-theme
python3 SKILL_ROOT/scripts/music_library.py search --scenario knowledge-explainer --query user-knowledge-sharing-theme --limit 1
```

## 选段与编辑判断

知识科普可按 [概念知识科普编排](knowledge-music-direction.md) 为所选音源建立哈希绑定的拍点、乐句与段落地图；重要事件选择落点，阅读不足时跨拍或延长。换曲重核，不继承其他作品的速度或听审结论。明确直接完成时，不增加试片确认门禁。

先用少量候选试配故事，不边浏览边盲目增加曲目。库中 source_in/source_out 是真实原文件秒数，片段可能是较疏的陪衬、较强的推进、能量建立或回落候选；并非宣称已找到副歌或“最佳片段”。入点附近的低能量/低变化点仅便于粗剪，最后要检查旋律是否被截断、第一击是否突兀、尾音是否被切掉。留前后handles，在必要时重找完整乐句。

按内容决定是否连续使用同曲。换曲需要有叙事理由，例如从问题转向系统能力，再落到人的收益。保持共同的节奏动机、音色或空间感，也可以用动作声、环境接桥或有意静默隔开。没有测拍、测调时不声称同调同拍，不直接做长时间旋律叠加；简单淡化也要试听重叠区。需要变速、循环或重编曲时单独记录实现与听审，不默认把任何段落拉成任意长度。

科技感可来自节奏秩序、分层空间、低中频的尺度与精确反馈。出现声音尖锐或配乐单调时，同时检查音色、段落对比和叙事发展；不要靠把所有轨道变亮、变响来制造科技感，也不要只靠随机音符或同一循环铺满全片。

## Cue sheet 和两套时钟

使用 `templates/music-cue-sheet.json`，项目内保存一份实际数据。每次放置有唯一id、track_id、cue_id、source_sha256、source_in/out、timeline_start/end、叙事职责、淡入淡出与衔接理由。原曲时间与整片时间明确分开，区间为左闭右开。默认不变速，两段长度应相等；交叉淡化造成的重叠要计入成片时钟。完整曲可不填cue_id，source范围覆盖实际使用段。

不改变原plan合同：最终生成的裁剪/混音文件作为plan.assets，scenes.audio_cues按整片绝对时间引用实际文件；cue sheet作为可编辑源记录原曲溯源与剪辑。`validate-sheet`核来源、时钟、hash与重叠理由，不证明声音已渲染、同调、舒服或音画落点正确。权限、缺失素材与未听分别列出。

## 素材位置、来源与扩展

Skill存索引、标签与方法，不分发付费音乐。本机文件在registry的assets内以track_id关联path/sha256/duration_seconds；优先使用 `--registry`、其次 `CJF_VIDEO_MUSIC_REGISTRY`，否则查当前用户数据目录 `$XDG_DATA_HOME/chaojifeng-video-design/music-registries/<library_id>.json`（未设变量时为 `~/.local/share` 下同一位置）。新宿主没有登记时明确缺失，不猜音源路径。缓存随时可能清理，使用前health检查；不把路径存在当永久保管或授权证明。迁移后以内容hash核对，不凭同名文件静默替换。

添加曲目前核对来源与项目用途许可，并留证。会员身份不自动代表外部剪辑、商用或再分发许可。

扩展任意合法本地音乐时沿用schema与taxonomy，可增加必要标签并写定义；保留来源、许可、hash和分段依据。先做实际音轨分析，再给用途解释，不能按曲名批量宣称逐首听审。运行 `validate-catalog`，再针对本片试听和渲染。空目录是有效初始状态，不把作者的私人曲库当作运行依赖。

方法依据：[AudioLabs 音乐结构分析](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C4/C4S4_NoveltySegmentation.html)解释局部变化与段落候选；本库使用更轻的前后特征差启发式，未实现其完整SSM流程。[FFmpeg滤镜](https://ffmpeg.org/ffmpeg-filters.html#atrim)提供裁剪和接桥实现参考，实际参数先核当前工具支持。涉及剪映素材时参考[剪映素材协议](https://sf1-cdn-tos.douyinstatic.com/obj/ies-hotsoon-draft/vco/f72e9cd9-cc19-4db7-ba74-0794833ce854.html)来源，不替代逐项使用范围核查。
