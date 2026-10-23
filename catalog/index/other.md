# other

Belirli bir motora baglanamayan skill ler (yontem, senaryo, kurgu bilgisi).

Toplam 133 skill. Once SKILL.md dosyasini oku, sonra sadece onun gosterdigi dosyalari.

- **whisper.cpp** (guide, MIT): Port of OpenAI's Whisper model in C/C++
  `skills/ggml-org__whisper.cpp/files`
- **fix** (skill, MIT): Take a GitHub issue, an open PR, or a plan file from plans/ and drive it to a merge-ready PR — reproduce with a failing test first, implement the fix (bugs) or 
  `skills/motiondivision__motion/files/.agents/skills/fix`
- **improve** (skill, MIT): Survey any codebase as a senior advisor and produce prioritized, self-contained implementation plans for OTHER models/agents to execute. Strictly read-only on s
  `skills/motiondivision__motion/files/.agents/skills/improve`
- **agentskills** (guide, Apache-2.0): Specification and documentation for Agent Skills
  `skills/agentskills__agentskills/files`
- **skill-inspector** (skill, Apache-2.0): Review AI agent skills before installation using NVIDIA SkillSpector and source-aware semantic review. Use when asked whether a skill or downloaded skill folder
  `skills/NVIDIA__SkillSpector/files/skills/skill-inspector`
- **house-style** (skill, MIT): The editorial and finishing preferences this project's work is judged against — cut rhythm, shot selection, delivery conventions, and the corrections that have 
  `skills/samuelgursky__davinci-resolve-mcp/files/.agents/skills/house-style`
- **release-check** (skill, MIT): Walk through a version bump and release for the DaVinci Resolve MCP server — version selection, every file that needs updating, required validation, tag, and Gi
  `skills/samuelgursky__davinci-resolve-mcp/files/.agents/skills/release-check`
- **resolve-edit** (skill, MIT): Editing, cutting, trimming, pacing, and timeline restructuring in the DaVinci Resolve MCP. Apply when duplicating/moving clips, copying ranges, building variant
  `skills/samuelgursky__davinci-resolve-mcp/files/.agents/skills/resolve-edit`
- **resolve-fusion** (skill, MIT): Fusion composition work in the DaVinci Resolve MCP. Apply when building or editing Fusion comps — titles, motion graphics, VFX, merges, masks, trackers — on a t
  `skills/samuelgursky__davinci-resolve-mcp/files/.agents/skills/resolve-fusion`
- **resolve-mcp** (skill, MIT): Orientation and index for DaVinci Resolve MCP work — grading, editing, conforming, delivery, media analysis, and .drp/.drt/.drx file work, live in a running Res
  `skills/samuelgursky__davinci-resolve-mcp/files/.agents/skills/resolve-mcp`
- **resolve-rough-cut** (skill, MIT): Assembling a short-form social rough cut from raw behind-the-scenes or vlog footage in the DaVinci Resolve MCP. Apply when asked for a rough cut, first cut, ass
  `skills/samuelgursky__davinci-resolve-mcp/files/.agents/skills/resolve-rough-cut`
- **resolve-session** (skill, MIT): Start a Resolve working session — connect, confirm the bridge and edition, open the project, and report timeline and media-pool state before any editing begins.
  `skills/samuelgursky__davinci-resolve-mcp/files/.agents/skills/resolve-session`
- **ai_transition_editing_skill** (skill, Apache-2.0): 【WORKFLOW SKILL】使用 AI 生成的转场将用户素材串联起来。
  `skills/FireRedTeam__FireRed-OpenStoryline/files/.storyline/skills/ai_transition_editing_skill`
- **create_profile_style_skill** (skill, Apache-2.0): 【META SKILL】分析当前剪辑逻辑与风格，总结并生成一个新的可复用 Skill 文件，存入剪辑技能库。Analyze the current editing logic and style, summarize and generate a new reusable Skill file, and store i
  `skills/FireRedTeam__FireRed-OpenStoryline/files/.storyline/skills/create_profile_style_skill`
- **default_editing_workflow_skill** (skill, Apache-2.0): 【WORKFLOW SKILL】通用剪辑流程。可用于剪辑日常/旅行 vlog，或是任何用户需求不明确的场景。A universal editing workflow. It can be used to edit daily/travel vlogs, or any scenario where user needs 
  `skills/FireRedTeam__FireRed-OpenStoryline/files/.storyline/skills/default_editing_workflow_skill`
- **subtitle_imitation_skill** (skill, Apache-2.0): 【CAPABILITY SKILL】基于用户提供的参考文案样本，对视频素材内容进行深度文风仿写，生成风格化脚本。Based on user-provided reference text samples, the video material is deeply rewritten in terms of writin
  `skills/FireRedTeam__FireRed-OpenStoryline/files/.storyline/skills/subtitle_imitation_skill`
- **chengfeng-subtitle** (skill, Apache-2.0): 给剪好的口播做字幕：直接用已有的逐词稿加账本算出剪后时间（不必导出、不必重新转录）、用词典和作者文稿改写听错的专名、按句子分屏、在 Studio 里逐屏复核。用户说做字幕、加字幕、改字幕、重新分屏、字幕不对时使用。不要用于删词剪辑、物理剪切、分镜动画或成片渲染。
  `skills/Agentchengfeng__chengfeng-videocut-skills/files/plugins/chengfeng-videocut/skills/chengfeng-subtitle`
- **chengfeng-videocut-workbench** (skill, Apache-2.0): 操作 chengfeng-videocut 剪辑工作台的已有工程，通过 Runtime CLI 查工程与词句位置、添加或替换画面覆盖层、移除画面、删除明确指定的词句或片段、拆分裁剪移动已有片段、调整画布比例并回读核验。用户说插入片段、删掉这句、移除动画、换个画面、调整顺序或管理时间线时使用；先区分画面覆盖与主轨顺延插入
  `skills/Agentchengfeng__chengfeng-videocut-skills/files/plugins/chengfeng-videocut/skills/chengfeng-videocut-workbench`
- **chengfeng-visual** (skill, Apache-2.0): 给剪好的口播配画面：在录屏上盖 HTML 层（圈重点标注 / 小黑整屏动画 / 推近），层绑字幕屏、由播放器逐帧驱动、直接在预览里看。用户说做分镜、配画面、加动画、圈重点、B-roll、做 storyboard 时使用。不要用于删词剪辑、字幕、物理剪切或成片渲染。
  `skills/Agentchengfeng__chengfeng-videocut-skills/files/plugins/chengfeng-videocut/skills/chengfeng-visual`
- **frontend-design** (skill, MIT): Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applicat
  `skills/digitalsamba__claude-code-video-toolkit/files/.claude/skills/frontend-design`
- **chekhov-dramaturgy** (skill, MIT): Writing plays and screenplays in the Chekhovian mode (契诃夫戏剧法) — distilled from the complete plays (没有父亲的人/普拉东诺夫, 伊凡诺夫, 林妖→万尼亚舅舅, 海鸥, 三姊妹, 樱桃园, nine one-acts) pl
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/chekhov-dramaturgy`
- **ozu-screenplay-style** (skill, MIT): Writing screenplays in the style of Ozu Yasujiro and Noda Kogo (小津安二郎・野田高梧) — distilled from six complete screenplays (晚春 Late Spring, 麦秋 Early Summer, 东京物语 Tok
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/ozu-screenplay-style`
- **succession-series-writing** (skill, MIT): Writing a Succession-style ensemble series (继承之战群像剧写法) — distilled from Jesse Armstrong's complete shooting scripts for all four seasons, 39 episodes (Faber 202
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/succession-series-writing`
- **sw-american-case-studies** (skill, MIT): Case studies of American screenwriting (美国电影剧作案例) — Mei Feng's readings of the Hollywood Western (value pairs, four oppositions), screwball comedy (strong heroi
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-american-case-studies`
- **sw-character-conflict** (skill, MIT): Character creation, protagonist/antagonist design and dramatic conflict for scripts (人物/对手/冲突) — merged from Lajos Egri (three-dimensional character, orchestrat
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-character-conflict`
- **sw-chinese-opera-banqiang** (skill, MIT): Playwriting for banqiang-system Chinese opera (板腔体：京剧、豫剧、越剧、秦腔、评剧、沪剧、淮剧、川剧弹戏), where sung passages are paired seven- or ten-character lines varied by metre (板式)
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-chinese-opera-banqiang`
- **sw-chinese-opera-banqiang-cases** (skill, MIT): Worked full-length scripts of banqiang-system Chinese opera with their creation records (板腔体全本语料库). Primary texts; 翁偶虹《锁麟囊》 (the revised score edition, 65 arias
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-chinese-opera-banqiang-cases`
- **sw-chinese-opera-qupai** (skill, MIT): Chinese opera playwriting for the qupai (曲牌体) system — 元杂剧, 明清传奇, 昆曲, 川剧高腔, where sung text is filled into fixed tune patterns (填词) rather than built from paire
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-chinese-opera-qupai`
- **sw-chinese-opera-qupai-cases** (skill, MIT): Worked qupai-system (曲牌体) opera scripts, act by act. Guan Hanqing's three surviving zaju (窦娥冤／救风尘／金线池 — twelve acts, 126 tunes, one mode and one rhyme per act, 
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-chinese-opera-qupai-cases`
- **sw-chinese-series-practice** (skill, MIT): Mainland-Chinese TV-series craft, documents and production chain (国产剧创作体系与制片链) — the China layer parallel to the Japanese and Korean/French skills. Distilled fr
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-chinese-series-practice`
- **sw-dialogue** (skill, MIT): Dialogue writing and revision for screen and stage (对白/台词/潜台词) — merged from Robert McKee's Dialogue (dialogue as action, said/unsaid/unsayable, exposition as a
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-dialogue`
- **sw-format-adaptation** (skill, MIT): Screenplay format, page craft, the writing process and adaptation (剧本格式/写作流程/改编) — merged from Wendy Henson (spec format rules), Richard Walter (page craft, rev
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-format-adaptation`
- **sw-genre-anatomy** (skill, MIT): Genre anatomy from John Truby's The Anatomy of Genres (类型解剖 / 类型节拍 / 混合类型 / 超越类型) — genres as beat systems with a life philosophy underneath; three rules (hit e
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-genre-anatomy`
- **sw-industry-business** (skill, MIT): The screenwriting business and career (编剧行业与生意经) — merged from Diamond & Weissman's Bulletproof (buyer's-eye workflow, three Cs, one-page nine-step, set pieces,
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-industry-business`
- **sw-japanese-screenwriting** (skill, MIT): Japanese (and other non-Hollywood) screenwriting methods (日本编剧方法/原创剧本实战) — distilled from ten Japanese directors and writers in ゼロからの脚本術; Kosawa Ryota (three ac
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-japanese-screenwriting`
- **sw-korean-french-screenwriting** (skill, MIT): Korean and French screenwriting practice (韩国/法国编剧方法) — from the international masterclass; Oh Seung-uk (Christmas in August, The Shameless; field research in di
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-korean-french-screenwriting`
- **sw-premise-theme** (skill, MIT): Premise, theme, controlling idea, subject selection and logline for scripts (前提/主题/立意/选材/戏核) — merged from Lajos Egri's premise-as-tyrant and dialectic, Robert 
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-premise-theme`
- **sw-scene-craft** (skill, MIT): Scene and sequence craft (场景/段落/细节/道具/悬念/情趣) — merged from Robert McKee's scene design and five-step scene analysis (value turn, beats, text/subtext, turning po
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-scene-craft`
- **sw-series-case-studies** (skill, MIT): Case studies of television series writing (剧集案例库) from primary texts; Sorkin's six West Wing teleplays (act-page tables, eight act-out types); Chase's five Sopr
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-series-case-studies`
- **sw-series-engine-bible** (skill, MIT): From an idea to a sellable series design; series engine / franchise, story pattern, character webs that keep generating conflict, pilot types, and the documents
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-series-engine-bible`
- **sw-series-structure** (skill, MIT): Episode and season structure for TV series (剧集单集与季的结构) — teasers and cold opens, broadcast four/five/six-act grids with page anchors, three tests for finding th
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-series-structure`
- **sw-sitcom-comedy** (skill, MIT): Half-hour television comedy craft (半小时情景喜剧/笑点力学/困境机器/多机位单机位格式) — merged from Evan S. Smith's Writing Television Sitcoms (premise-driven comedy in three levels, 
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-sitcom-comedy`
- **sw-story-structure** (skill, MIT): Story structure for screenplays and stage plays (故事结构) — merged from Syd Field's paradigm and plot points, Blake Snyder's Save the Cat beat sheet and board, Rob
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-story-structure`
- **sw-truby-anatomy** (skill, MIT): Organic story anatomy from John Truby's The Anatomy of Story (有机结构/设计原则/22步骤/道德议题/四角对立/幽灵/场景编排) — the designing principle (story process plus original execution
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-truby-anatomy`
- **sw-workflow** (skill, MIT): Project orchestrator for the screenwriting skill set (剧本项目主线调度 / 状态存档 / story bible) — a meta-skill that adds no new craft knowledge but routes a screenplay or 
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-workflow`
- **sw-writers-room** (skill, MIT): How episodic television actually gets made by a group (编剧室与制作现实) — merged from Goldberg & Rabkin (pitch as audition, leave-behind, cracking the story, beat shee
  `skills/jtydhr88__screenwriting-skills/files/plugins/screenwriting/skills/sw-writers-room`
- **cartcut-editing** (skill, MIT): Edit video in the running Cartcut app: cut editing driven by a transcript, subtitles, trimming and rearranging clips, animated titles and typography. Use whenev
  `skills/cartesiancs__cartcut/files/plugins/cartcut-editing/skills/cartcut-editing`
- **edit-premiere-project** (skill, MIT): Inspect, edit, verify, and export an open Adobe Premiere Pro project through the local Premiere MCP Bridge.
  `skills/hetpatel-11__Adobe_Premiere_Pro_MCP/files/claude-plugins/premiere-pro-mcp/skills/edit-premiere-project`
- **edit-premiere-project** (skill, MIT): Install, verify, inspect, edit, and export local Adobe Premiere Pro projects through the Premiere MCP Bridge. Use for project discovery, timeline edits, media i
  `skills/hetpatel-11__Adobe_Premiere_Pro_MCP/files/plugins/premiere-pro-mcp/skills/edit-premiere-project`
- **premiere-pro-mcp** (skill, MIT): Install, verify, troubleshoot, and operate the Adobe Premiere Pro MCP server. Use when a user wants an agent to set up Premiere MCP, connect Claude Code/Codex/C
  `skills/hetpatel-11__Adobe_Premiere_Pro_MCP/files/skills/premiere-pro-mcp`
- **develop-premiere-pro-mcp** (skill, MIT): Develop, debug, test, review, document, and release the premiere-pro-mcp repository. Use when changing MCP tools, schemas, server registration, CEP or UXP bridg
  `skills/leancoderkavy__premiere-pro-mcp/files/claude-plugins/premiere-pro/skills/develop-premiere-pro-mcp`
- **edit-premiere-project** (skill, MIT): Inspect, edit, verify, save, and export an open Adobe Premiere Pro project through the premiere-pro MCP server. Use for rough cuts, timeline assembly or cleanup
  `skills/leancoderkavy__premiere-pro-mcp/files/claude-plugins/premiere-pro/skills/edit-premiere-project`
- **animated-chart** (skill, MIT): Make a looping animated chart for LinkedIn or a newsletter in code with Claude Code. Bars that become a line, a number that counts up, a before and after. Every
  `skills/charlie947__motion-graphics-skills/files/skills/animated-chart`
- **brand-intake** (skill, MIT): The setup step every other skill in this pack reads. A short interview plus 3 to 5 reference frames becomes two files in your project, brand.md (who you are, wh
  `skills/charlie947__motion-graphics-skills/files/skills/brand-intake`
- **motion-brief-writer** (skill, MIT): Turns a rough idea for an animated graphic into a precise build brief for Claude Code, in your own brand. Asks for anything essential first (exact numbers, size
  `skills/charlie947__motion-graphics-skills/files/skills/motion-brief-writer`
- **motion-prompt-writer** (skill, MIT): Write a complete 8-part Claude Motion prompt (The bar, Format, The one rule, Look, Motion, Never, Before you finish, The scene) for one short looping motion gra
  `skills/charlie947__motion-graphics-skills/files/skills/motion-prompt-writer`
- **newsletter-promo** (skill, MIT): Turn a newsletter edition into a 12-20 second promo clip for LinkedIn, Instagram or X that drives people to read and subscribe. Hook question, three proof frame
  `skills/charlie947__motion-graphics-skills/files/skills/newsletter-promo`
- **reference-to-motion** (skill, MIT): Turn references you admire into a scene-by-scene Claude Motion prompt for your own topic and brand. Takes a video for the moves (screenshots, frames or a contac
  `skills/charlie947__motion-graphics-skills/files/skills/reference-to-motion`
- **stage-consistency** (skill, MIT): Multi-shot narrative & character consistency — a character bible with a locked front-portrait anchor, view-matched reference selection, recent-frame carry-forwa
  `skills/Orkas-AI__Orkas-VideoStudio/files/packages/skills/stage-consistency`
- **stage-decide** (skill, MIT): The decision layer for real footage — understand → select → produce an EVIDENCE-bearing rough cut. Trigger when the EDIT task is "find / select / reduce / clean
  `skills/Orkas-AI__Orkas-VideoStudio/files/packages/skills/stage-decide`
- **action-fight-prompt** (skill, MIT): 动作打戏 AI 视频提示词设计技能。当用户需要设计具备电影级运镜、节奏感、打击感的武打/战斗片段提示词时使用——覆盖双角色对打、女主 vs 怪兽、近身格斗、载具追逐战、群战、一镜到底、巨型生物/机甲大场面等场景。核心方法论：时序拆段（15 秒拆成 2-3 秒阶段）、动作因果链、环境反馈、视觉资产锁定与参考图映射、音效层
  `skills/kangarooking__director-skills/files/action-fight-prompt`
- **cinematic-asset-prompts** (skill, MIT): 影视概念美术专家 & 视觉导演技能——从剧本/故事/世界观文字中提取并设计 AI 视频所需的标准化视觉资产提示词。当用户要求"从剧本提取角色/场景/道具/载具提示词"、"生成角色定妆照 prompt"、"生成场景空镜 prompt"、"生成道具/载具/机械资产设定图 prompt"、"为 AI 视频做视觉资产设计"、"
  `skills/kangarooking__director-skills/files/cinematic-asset-prompts`
- **emotion-performance-director** (skill, MIT): Use when the user wants to design, rewrite, refine, or vary emotional acting prompts for live-action AI video characters. Translate abstract emotions, dialogue,
  `skills/kangarooking__director-skills/files/emotion-performance-director`
- **travel-photo-to-video** (skill, MIT): 根据用户提供的 1–10 张真实旅拍照片和旅游地点，设计文旅宣传片的推荐分镜顺序、统一视觉母版与逐镜头首帧图生视频提示词。适用于让旅拍照片自然动起来、设计克制运镜和后期剪辑连续性的请求；输出可独立复制的提示词，不直接提交视频生成任务。
  `skills/kangarooking__director-skills/files/travel-photo-to-video`
- **qisi-video-remix** (skill, MIT): 根据参考视频创意改编新故事，直接展示可读剧本、人物造型、分镜表和可独立使用的分段视频提示词。适用于参考视频改编、同款叙事创作和 AI 视频制作前的策划。
  `skills/wyuzhi__qisi-video-remix/files`
- **easyedit** (skill, MIT): Make a movie fan edit with easyedit - the film's best speech with animated word-by-word captions, then a beat-cut montage and a black-and-white title shot. Use 
  `skills/blixvip__easyedit/files/skills/easyedit`
- **premiere-batch-delivery** (skill, MIT): Validate, export, and inspect multiple Adobe Premiere Pro deliverables with explicit pending and unverified states. Use for YouTube, social, web, mobile, archiv
  `skills/ayushozha__AdobePremiereProMCP/files/skills/premiere-batch-delivery`
- **premiere-captions** (skill, MIT): Import, verify, structurally validate, and export timed captions or subtitles in Adobe Premiere Pro. Use for SRT workflows, supplied timed transcripts, caption 
  `skills/ayushozha__AdobePremiereProMCP/files/skills/premiere-captions`
- **premiere-dialogue-cut** (skill, MIT): Tighten interviews, podcasts, tutorials, and talking-head edits in Adobe Premiere Pro by detecting silence, preserving natural speech margins, keeping an untouc
  `skills/ayushozha__AdobePremiereProMCP/files/skills/premiere-dialogue-cut`
- **premiere-look-effects** (skill, MIT): Build consistent, reversible visual effect recipes in Adobe Premiere Pro from effects confirmed as installed. Use for clip effects, parameterized looks, motion 
  `skills/ayushozha__AdobePremiereProMCP/files/skills/premiere-look-effects`
- **premiere-proxy-conform** (skill, MIT): Speed Adobe Premiere Pro editing with proxy creation, attachment, media matching, and original-media readiness checks. Use for high-resolution or remote-media p
  `skills/ayushozha__AdobePremiereProMCP/files/skills/premiere-proxy-conform`
- **premiere-social-reframe** (skill, MIT): Produce vertical, square, and platform-specific versions of an Adobe Premiere Pro sequence while preserving the master edit. Use for 9:16, 1:1, and social cutdo
  `skills/ayushozha__AdobePremiereProMCP/files/skills/premiere-social-reframe`
- **premiere-transition-pack** (skill, MIT): Select and apply restrained, installed video or audio transitions in Adobe Premiere Pro. Use for transition cleanup, dissolves, dips, audio crossfades, transiti
  `skills/ayushozha__AdobePremiereProMCP/files/skills/premiere-transition-pack`
- **example-chartjs** (skill, Apache-2.0): Chart.js integration patterns for Helios. Use when creating animated data visualizations with Chart.js.
  `skills/BintzGavin__helios/files/skills/examples/chartjs`
- **example-framer-motion** (skill, Apache-2.0): Patterns for using Helios with Framer Motion. Use when you want to use Framer Motion's physics and transitions but need frame-perfect synchronization with Helio
  `skills/BintzGavin__helios/files/skills/examples/framer-motion`
- **example-signals-animation** (skill, Apache-2.0): Learn how to use Helios Signals for high-performance, fine-grained reactivity. Use for complex dependency graphs or when optimizing performance.
  `skills/BintzGavin__helios/files/skills/examples/signals`
- **example-tailwind-animation** (skill, Apache-2.0): Learn how to use Tailwind CSS with Helios. Use for styling compositions and animating with utility classes.
  `skills/BintzGavin__helios/files/skills/examples/tailwind`
- **helios-studio** (skill, Apache-2.0): Studio tool for developing and previewing Helios compositions. Use when you want to launch the interactive development environment or manage assets.
  `skills/BintzGavin__helios/files/skills/studio`
- **frontend-design** (skill, MIT): Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making ch
  `skills/edenfunf__reelmimic/files/.claude/skills/frontend-design`
- **after-effects-mcp** (guide, MIT): AI-powered Adobe After Effects automation via MCP. Chat in a CEP panel or connect external agents, with 16 tools for editing, previews, recovery, reusable scrip
  `skills/JUNKDOGE-JOE__after-effects-mcp/files`
- **cursorcam** (skill, Apache-2.0): Records a polished click demo video (MP4) of a web app or website. The agent explores the app, writes the steps, records them in a hidden browser and renders a 
  `skills/Avijit07x__cursorcam/files/agent-plugin/skills/cursorcam`
- **cursorcam** (skill, Apache-2.0): Records a polished click demo video (MP4) of a web app or website. The agent explores the app, writes the steps, records them in a hidden browser and renders a 
  `skills/Avijit07x__cursorcam/files/plugin/skills/cursorcam`
- **account-ideas** (skill, MIT): 给选题雷达里的一个精选主题，按指定账号的人设和系列各出几条短视频选题，写进工作台的「账号选题」等人挑选。工作台点「给账号出题」时调用，参数里带精选 id、账号代号和每个账号的数量。
  `skills/ymybxx__SoloMCN/files/defaults/skills/account-ideas`
- **curate-topics** (skill, MIT): 选题雷达的精选。读工作台各渠道定时抓到的素材（抖音、微博、B站、知乎、百度、头条、推特、YouTube、Hacker News 等），按各账号的选题范围挑出值得做成短视频的主题，写进工作台选题雷达的「精选」，等人决定给哪些账号出题。工作台点「让 Claude 精选」时调用，用户说“精选一下素材”“跑一下精选”时也用。
  `skills/ymybxx__SoloMCN/files/defaults/skills/curate-topics`
- **daily-topics** (skill, MIT): 每日选题。抓取全网热榜，结合各账号人设，把当天值得借势的热点按各账号的选题范围直接转成短视频选题，写进工作台的「账号选题」（一步到位，不经过选题雷达的精选）。用户说“跑一下今天的选题”“出选题”“看看今天有什么热点能做”，或定时任务触发时使用。
  `skills/ymybxx__SoloMCN/files/defaults/skills/daily-topics`
- **make-video** (skill, MIT): 把流水线里一条内容的脚本做成成片 MP4，登记回工作台的内容卡片。工作台点「生成视频」时在后台调用，参数里带内容 id。具体怎么做看这条内容用的做法技能。全程无人值守，不能向任何人提问。
  `skills/ymybxx__SoloMCN/files/defaults/skills/make-video`
- **precheck-content** (skill, MIT): 对流水线里一条内容的脚本做发布前预审（合规和质量），结果存回工作台的内容卡片。工作台在「设置」里把 AI 预审选成后台 Agent 时，点「AI 预审」调用，参数里带内容 id。
  `skills/ymybxx__SoloMCN/files/defaults/skills/precheck-content`
- **review-data** (skill, MIT): 根据已发布内容的数据做复盘，找出什么在赢、给出各账号建议和下周选题方向，存到工作台的「数据复盘」。工作台在「设置」里把 AI 复盘选成后台 Agent 时，点「开始复盘」调用。
  `skills/ymybxx__SoloMCN/files/defaults/skills/review-data`
- **revise-video** (skill, MIT): 按人的修改意见改一条已经生成好的视频，只改提到的地方，输出新版本并登记回工作台的内容卡片。工作台在内容详情里点「让 Claude 修改」时在后台调用，参数里带内容 id 和修改意见。具体怎么改看这条内容用的做法技能。全程无人值守，不能向任何人提问。
  `skills/ymybxx__SoloMCN/files/defaults/skills/revise-video`
- **stage-montage** (skill, MIT): 做法：原片剪辑（一键换装、舞台混剪）。画面全是同一首歌多个场次的真实直拍，声音是歌曲原声，按拍子换场、贴合换装。系列或内容用这种做法时，调研、写脚本、生成视频、修改视频各环节读这里对应的文件。
  `skills/ymybxx__SoloMCN/files/defaults/skills/stage-montage`
- **teardown-video** (skill, MIT): 拆解一条 YouTube 视频：读字幕、简介和热门评论，弄清它为什么火、怎么讲的、观众在意什么，写成拆解报告存到这条视频上，给出题、调研、写脚本参考。工作台素材页点「拆解」时调用，参数里带视频 id；精选和出题时遇到还没拆过的 YouTube 素材，也按这里的格式拆。
  `skills/ymybxx__SoloMCN/files/defaults/skills/teardown-video`
- **write-script** (skill, MIT): 给流水线里的一条内容写可以直接开工的分镜脚本，存回工作台的内容卡片。工作台在「设置」里把写脚本选成后台 Agent 时，点「AI 写脚本」调用，参数里带内容 id。
  `skills/ymybxx__SoloMCN/files/defaults/skills/write-script`
- **files** (skill, MIT): 
  `skills/adityaarsharma__youtube-marketing-skills/files`
- **youtube** (skill, MIT): YouTube Marketing MCP — 21-command suite for YouTube creators. Covers SEO, scripts, hooks, thumbnails, analytics, content calendar, Shorts, batch updates, WordP
  `skills/adityaarsharma__youtube-marketing-skills/files/skills/youtube-marketing`
- **reacut** (skill, MIT): 在 Codex 右侧打开 ReaCut 本地视频编辑器，导入用户选定的素材、编辑时间线、文字和效果，并保存或导出。用于 ReaCut 项目操作，不用于其他视频应用或未授权素材搜集。
  `skills/Xiangyu-CAS__rea-capcut/files/plugin/skills/reacut`
- **find-ideas** (skill, Apache-2.0): Find what to make next: proven reels to adapt, outliers in a niche, saved inspiration and the creator's own results. Use before scripting, when asked what to po
  `skills/alisadiq-ai__favstash-ai-video-editing-skills/files/skills/1-research/find-ideas`
- **write-script** (skill, Apache-2.0): Write or critique hooks and scripts for Reels, TikToks and YouTube Shorts from an idea, saved reel or reference. Adapt proven openings, write one opening or sev
  `skills/alisadiq-ai__favstash-ai-video-editing-skills/files/skills/2-scripting/write-script`
- **create-video** (skill, Apache-2.0): Create a new Descript video project from media files or URLs and optionally edit it with Underlord, Descript's AI co-editor.
  `skills/descriptinc__descript-mcp/files/skills/create-video`
- **edit-project** (skill, Apache-2.0): Edit an existing Descript project with Underlord, Descript's AI co-editor, using natural language instructions.
  `skills/descriptinc__descript-mcp/files/skills/edit-project`
- **export-timeline** (skill, Apache-2.0): Export a Descript project's timeline for another editor like Premiere Pro, DaVinci Resolve, Final Cut Pro, or Pro Tools.
  `skills/descriptinc__descript-mcp/files/skills/export-timeline`
- **export-transcript** (skill, Apache-2.0): Export a Descript project's transcript as text in txt, markdown, html, rtf, or srt.
  `skills/descriptinc__descript-mcp/files/skills/export-transcript`
- **publish-project** (skill, Apache-2.0): Publish a Descript project composition to create a shareable link and exported video or audio file.
  `skills/descriptinc__descript-mcp/files/skills/publish-project`
- **ll-video-decomposer** (skill, MIT): 专业分析一个或多个视频，从本地视频或音频、视频链接、逐字稿生成有证据的五层拆解报告。完整视频同时检查内容、开头、结构、画面镜头、字幕包装、人声、BGM和创作策略；多视频执行横向对比。用户要求拆解视频、分析爆款视频、比较多个视频、还原钩子与结构、分析视听语言、提炼可复用方法与不可复制因素时使用。
  `skills/liuliu-66-create__ll-video-decomposer/files/codex/ll-video-decomposer`
- **chengfeng-video-styles-installer** (skill, Apache-2.0): 安装包说明。真正的 Skill 在 skills/chengfeng-video-styles/，用 `npx -y github:Agentchengfeng/chengfeng-video-styles install` 安装到 Claude Code 与 Codex。
  `skills/Agentchengfeng__chengfeng-video-styles/files`
- **cut-as-code** (skill, MIT): Use when any cut-as-code request involves understanding, cutting, color grading, adding B-roll, motion graphics, content cards, captions, creating shorts, compa
  `skills/WhiteTowerAI__cut-as-code/files/skills/cut-as-code`
- **ii-content-engine** (guide, MIT): AI-powered content generation and auto-posting engine built for Claude Code and Codex. Generate viral videos, carousels, and reels for TikTok, Instagram, and X 
  `skills/intelligent-iterations__ii-content-engine/files`
- **launch-brand** (skill, MIT): Build the brand kit a launch film uses from a website. Runs tools/brand-from-url.mjs on the reader's site to extract branding (colours, fonts, logo, name, tagli
  `skills/timscheuerai__launch-video-kit/files/skills/launch-brand`
- **launch-score** (skill, MIT): Tool manual under launch-film (music fitted to the edit with Higgsfield Sonilo, ACE-Step locally, or the free scratch bed). Score a launch film with music whose
  `skills/timscheuerai__launch-video-kit/files/skills/launch-score`
- **videocut:剪口播** (skill, MIT): 口播视频转录和口误识别。生成审查稿和删除任务清单。触发词：剪口播、处理视频、识别口误
  `skills/cocolayuan__videoclip-AI-skill/files/剪口播`
- **videocut:自更新** (skill, MIT): 自更新 skills。记录用户反馈，更新方法论和规则。触发词：更新规则、记录反馈、改进skill
  `skills/cocolayuan__videoclip-AI-skill/files/自更新`
- **creator-video-remix** (skill, MIT): Turn a supplied reference video, format or creative premise into an original finished short with Magic Hour. Use for creator remixes, social video concepts, vis
  `skills/magichourhq__skills/files/skills/creator-video-remix`
- **magic-hour-body-swap** (skill, MIT): Place a supplied person into a scene image with Magic Hour Body Swap, preserving the intended identity and checking pose, scale and scene contact. Use for full-
  `skills/magichourhq__skills/files/skills/magic-hour-body-swap`
- **magic-hour-brand-kit** (skill, MIT): Create, extend or apply a reusable brand kit with Magic Hour imagery, exact logos and colors, editable layouts and a practical brand guide. Use for visual ident
  `skills/magichourhq__skills/files/skills/magic-hour-brand-kit`
- **magic-hour-character-consistency** (skill, MIT): Keep a recurring character recognizable across Magic Hour images, storyboards, and video shots. Use for a mascot, fictional character, or authorized person appe
  `skills/magichourhq__skills/files/skills/magic-hour-character-consistency`
- **magic-hour-character-replace** (skill, MIT): Replace a subject in an existing video or transfer its performance onto a reference character with Magic Hour. Use for whole-character recasting and motion tran
  `skills/magichourhq__skills/files/skills/magic-hour-character-replace`
- **magic-hour-marketplace-images** (skill, MIT): Build a product listing image set with Magic Hour, including a clean main image, detail and lifestyle images, and accurate feature layouts. Use for marketplace 
  `skills/magichourhq__skills/files/skills/magic-hour-marketplace-images`
- **magic-hour-media** (skill, MIT): Create, edit or retrieve media when Magic Hour is requested or configured and suitable. Animate an approved image directly, use a portrait plus audio for Talkin
  `skills/magichourhq__skills/files/skills/magic-hour-media`
- **magic-hour-product-visuals** (skill, MIT): Create or edit a Magic Hour product image with controlled composition, geometry, branding and copy space. Use for product shots, hero images, packaging and ecom
  `skills/magichourhq__skills/files/skills/magic-hour-product-visuals`
- **magic-hour-text-to-video** (skill, MIT): Turn an idea into a short Magic Hour video when no exact identity or starting frame is required. Use for original surreal scenes, visual jokes, atmosphere or co
  `skills/magichourhq__skills/files/skills/magic-hour-text-to-video`
- **magic-hour-thumbnails** (skill, MIT): Create readable, truthful video thumbnails and covers with Magic Hour, preserving supplied faces and products and testing composition at small display size. Use
  `skills/magichourhq__skills/files/skills/magic-hour-thumbnails`
- **laoxu-video-script** (skill, MIT): 自媒体起号方法论（老徐教学版）——把「老徐」验证过的内容打法提炼成可迁移的方法，帮零基础学员定位账号、找选题、写出站得住的口播稿/内容、并自检迭代。当用户（尤其是学员/小白）要起号、做自媒体、找账号定位、想选题、写视频稿/口播稿/逐字稿、或要诊断改稿（钩子/逻辑/AI味/传播力）时使用。核心是「按观众问题顺序走」的三种
  `skills/chenmisss__laoxu-video-script/files`
- **approve** (skill, MIT): Approve or reject an episode script that is waiting for review in a shadowcast channel. Use when the user says approve, looks good, ship it, or gives script fee
  `skills/generalizingai__shadowcast/files/skills/approve`
- **autopilot** (skill, MIT): One unattended autopilot tick for a shadowcast channel. It does the single most useful next step (continue an episode, auto-approve after the review window, sta
  `skills/generalizingai__shadowcast/files/skills/autopilot`
- **channel-audit** (skill, MIT): Audit a reference YouTube channel and write the style bible (STYLE.md) for our own original channel in the same format. Use when given a channel link to learn f
  `skills/generalizingai__shadowcast/files/skills/channel-audit`
- **publish** (skill, MIT): Schedule a packaged shadowcast episode on YouTube (long video plus 2 Shorts, with thumbnail), and optionally on Facebook and Instagram through SocialBunny, usin
  `skills/generalizingai__shadowcast/files/skills/publish`
- **asset-generator** (skill, MIT): Generate image assets for web and mobile apps using Google Gemini 3 Pro Image (Nano Banana Pro). Supports style presets (icon, illustration, logo, mascot, hero,
  `skills/puntorigen__avatar-skills/files/asset-generator`
- **avatar-frames** (skill, MIT): Extract ready avatar reference frames from talking-head videos — single face, face-region sharpness, no burned-in subtitles. Optionally saves inpaint candidates
  `skills/puntorigen__avatar-skills/files/avatar-frames`
- **avatar-location** (skill, MIT): Create a new LOCATION (a look) for an existing avatar — keep its IDENTITY (face, gestures, cloned voice, talking_profile) but vary the LOOK: wardrobe + environm
  `skills/puntorigen__avatar-skills/files/avatar-location`
- **brand-content-strategy** (skill, MIT): Turn a website or personal brand into a research-backed content + channel strategy. Profiles the site's positioning/credentials, discovers what reels rank in it
  `skills/puntorigen__avatar-skills/files/brand-content-strategy`
- **instagram-videos** (skill, MIT): Download all public videos/reels from an Instagram profile to a local folder, named with upload date-time (YYYY-MM-DD_HH-MM-SS.mp4). Uses Picnob via browser aut
  `skills/puntorigen__avatar-skills/files/instagram-videos`
- **luxury-hnwi-sales** (skill, MIT): Behavioral psychology playbook for selling to high-net-worth individuals (HNWIs) and luxury/premium clients, distilled from 29 Luxury Academy videos by consumer
  `skills/puntorigen__avatar-skills/files/luxury-hnwi-sales`
- **pdf-remix** (skill, MIT): Analyze the design + narrative MOLD of a reference PDF (marketing lead-magnet, brochure, editorial piece) — palette, typographic roles, emphasis/highlight rules
  `skills/puntorigen__avatar-skills/files/pdf-remix`
- **search-console** (skill, MIT): Compte rendu SEO d'un site à partir de Google Search Console. Récupère les données par l'API, calcule ce qui est du signal et ce qui est du bruit (seuils calcul
  `skills/vincentventalon__my-claude-skills/files/search-console/skills/search-console`
