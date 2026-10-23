# 工程：节拍表、state(f)、可拷贝原语

片子住在产品仓库的 `video/`（或用户指定目录），**自己一份 `package.json` 和 `node_modules`**，不跟应用共用（Remotion 会拖进 Chromium）。

本文件管「时间轴怎么写、工程怎么搭」。运镜细节见 `camera-table.md`，产品界面见 `product-machine.md`。

`$SKILL` 指本 skill 目录。`assets/film/` 来自 [promo-film-skill](https://github.com/whyubel1eve/promo-film-skill)，许可见 `assets/film/NOTICE.md`。

## 画幅与帧率

| 路径 | 默认 |
| --- | --- |
| Ink Press / 镜头卡切镜 | 1920×1080 @ **30fps**（卡与模板均按 30fps 调校，不要擅自改） |
| 一台摄影机 | 1920×1080 @ **60fps** 更顺；若必须跟切镜片同一工程，用 30fps 并把 `makeCamera` 的 `speedScale` 改成 ~28 |

`remotion` 与 `@remotion/*` 必须**同一个精确版本**（不加 `^`）。装之前 `npm view remotion version` 看一眼，别照抄旧数字。

## 拷贝

```text
video/
├─ package.json
├─ remotion.config.ts       ← 从 $SKILL/assets/film 拷
├─ tsconfig.json            ← 从 $SKILL/assets/film 拷
├─ README.md                「想改什么去改哪个文件」
├─ public/
├─ scripts/
│  ├─ frames.mjs            ← 拷
│  ├─ jitter-check.mjs      ← 拷
│  ├─ make-music.mjs        ○ 只在要配乐时
│  └─ lib/synth.mjs         ○ 只在要配乐时
└─ src/
   ├─ index.ts
   ├─ Root.tsx
   ├─ Film.tsx              背景 + 窗口层 + 文案层（+ 可选配乐层）
   ├─ design.ts             颜色 / 字体 / 阴影，全部抄自产品
   ├─ story.ts              节拍表 + 镜头表 + state(f)
   ├─ content.ts            片子里出现的文章、对话、文件名
   ├─ lib/                  anim.ts / camera.ts / scene.tsx ← 拷
   ├─ components/           Backdrop · Shell · Icons · Text
   └─ scenes/S1…S7.tsx      一台摄影机路径：只画文案，不画产品
```

```bash
mkdir -p video/src/lib video/src/components video/src/scenes video/scripts video/public
cp -R "$SKILL/assets/film/src/lib/." video/src/lib/
cp "$SKILL/assets/film/scripts/frames.mjs" video/scripts/
cp "$SKILL/assets/film/scripts/jitter-check.mjs" video/scripts/
cp "$SKILL/assets/film/remotion.config.ts" "$SKILL/assets/film/tsconfig.json" video/
```

Windows PowerShell 把 `cp -R` 换成 `Copy-Item -Recurse`。镜头卡切镜再按需 copy `$SKILL/assets/lib/` 的 PageCam 等组件。走 Ink Press 则从 `$SKILL/template/` 起步，不要重新搭这份骨架。

**只有用户说要配乐**才多拷 synth；说不要就跳过，工程里不留用不到的文件。

拷过去的 `remotion.config.ts` 里 `setDelayRenderTimeoutInMilliseconds(120_000)` **不要删**：并行渲染时装字体，默认 30 秒会在出片时踩线，`remotion still` 碰不到。

## 四层结构

`Film.tsx` 从下到上永远是这几层，**顺序不要改**（`Music` 只在配乐时才有）：

```tsx
export const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.canvas }}>
    <Backdrop />   {/* 全片唯一背景，从不切 */}
    <Stage />      {/* 那台机器 + 摄影机变换 */}
    <Captions />   {/* 每个节拍一个 Sequence，只画字 */}
    {/* <Music />  可选 */}
  </AbsoluteFill>
);
```

一台摄影机路径下，`Captions` 里每一场都要比自己的节拍多跑 `OVERLAP` 帧，让退场压在下一场入场底下。`layout="none"` 不能省——默认 `Sequence` 会套一层 `AbsoluteFill`，把绝对定位坐标系换掉。

镜头卡切镜路径没有「全片一个 Stage」：每个 Sequence 是一个镜头，但仍应有全片共享的 `design.ts` 和节拍表 `B`，禁止每个镜头各写一套颜色。

## 时间轴：一个纯函数

`src/story.ts` 是全片唯一的时间轴。窗口里发生的一切都是**全局帧号的纯函数**：

```ts
export const B = {              // 节拍边界（帧）
  open: 0, files: 90, cli: 270, theme: 500,
  push: 700, cross: 925, cta: 1075, end: 1210,
} as const;

export const TOTAL = B.end;
export const OVERLAP = 11;      // 30fps 约 0.37s；60fps 用 22

export const state = (f: number): State => { /* 只读 f */ };
```

**想重排节奏，只改 `B` 里那几个数字。** 下游全部用相对量（`B.cli + 50`）。某一场加长两秒，里面的动作跟着一起挪。

小工具在 `lib/anim.ts`：`t(f, [a, b])` 是缓动过的 0→1，`typed` 是打字机，`track` 是带保持的关键帧。一个节拍内部的时序都从这个节拍的起点算。该算出来的时刻不要写死：文案改一个字，发送时刻和后面所有动作应自动跟着挪。

几条经验：

- **上一个节拍的痕迹要留着。** 清空上一场对话读作切镜。
- **因果按真实顺序演。** 指针按下之后对话框才开。
- **该逐帧插值的别用淡入淡出。** 主题切换的中间每一帧都应是一套真实存在的配色。
- 一台摄影机路径：场景组件（`scenes/S*.tsx`）只画文案，**一行产品 UI 都不画**。
- 禁 `Date.now()` / `Math.random()` / 无参 `new Date()`。伪随机用固定种子（`assets/lib/helpers/rand.ts` 的 mulberry32）。

## 文案

- 一场只讲一件事。讲不清就拆场，或根本不该进片子。
- 标题是**结论**，不是功能名：「草稿就在你自己的硬盘上」，不是「本地文件系统支持」。
- 副行补一句「所以呢」，20～50 字，别超过三行。中文按每秒 5～6 字估阅读时间。
- 画面上能演出来的，字里不要再说一遍。
- 片子里的数字（体积、版本、域名、价格）必须跟真实产品对得上。

文案格式全片只有一种。别在某一场心血来潮换版式。有效字高见 aesthetic-rules Q11。

## 每场多长

判据是「**最后一件事做完之后还剩多久**」：留 0.7～1.3 秒收口，不留第二秒。挂着两秒静止尾巴读作卡住。场内节拍跟着场长缩放，否则最后一个动作会被自己的退场切掉。

品牌字标落定 hold ≥1s；批量动效收尾静止 0.5s；开场主体动作 ≥3s。

## 竖版与方版

**画幅不是缩放，是重新排版。** 便宜中间态：1:1 可以把 16:9 的内容层缩到 0.62，**只缩内容层，背景保持满幅**。9:16 必须改成上下堆叠，镜头表的 `cx/cy` 另写一份——当作第二支片子估工作量。

## README 是交付物

下一个改这支片子的大概率是另一个 agent，它只会读 README。至少写：

- 节拍表（讲什么 / 起始帧 / 时间）
- 常见改动去改哪个文件
- 这支片子**已经讲过什么**（下一支据此做减法）
- 踩过的坑（原样保留）
