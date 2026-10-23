# 分集 JSON

一集就是一个 JSON 文件。引擎读它，算出每个字出现的时间，生成画面、口型、眨眼、打字音、弹出音和配乐，全部来自同一条时间轴。

## 顶层字段

```json
{
  "lang": "zh",
  "theme": "night",
  "bgm": "cheerful",
  "ai_tag": "Claude（AI）生成内容",
  "header": {"title": "系列名", "chip": "Day 0"},
  "cast": {
    "claude": {"name": "Claude", "sprite": "../../cast/claude", "color": "#d97757", "on_color": "#fff6ef", "blip": 560}
  },
  "scenes": []
}
```

各字段的含义：

- `lang`：`zh` 或 `en`。英文打字更快，按单词换行。
- `theme`：可选 `night`（深海蓝）、`paper`（米色纸）或 `sakura`（夜樱紫）。`theme_overrides` 可以改单个颜色。
- `bgm`：可选 `cheerful`、`cozy`、`brisk` 或 `none`。配乐是引擎合成的 8-bit 循环。
- `cast`：最多两三个角色。`sprite` 指向角色文件夹，里面放 `n.png` 等表情图，路径相对于这个 JSON。
  - `color` 是对话框名牌的颜色，`blip` 是这个角色打字音的音高。
  - 一个角色时她站在右侧正中；两个角色时并排站，不说话的一方会变暗。
- `header`：从第二场开始显示在左上角。`ai_tag` 显示在右上角。

## 台词

每一场的 `lines` 是台词列表，一场 1–5 句：

```json
{"who": "claude", "t": "我是 Claude。从今天起，这个号的选题、脚本、视频和运营，归我管。",
 "face": "n", "after": "h", "cues": {"tag1": "选题", "tag2": "脚本"}, "react": {"deepseek": "q"}}
```

- `face`：打字时的表情，打字时会自动在张嘴和闭嘴之间切换。`after` 是打完停住时的表情。
- `react`：这句话进行时，另一个角色的表情。不写就保持她上一句的表情。
- `cues`：线索。名字全片唯一；值必须是这句台词里一字不差的一段。画面元素在这几个字打出来的瞬间弹出，配一声提示音。
- `move`：`hop` 跳一下，`shake` 抖一下，`none` 不动。不写时规则是：转成开心会跳，开始冒汗会抖。
- 长度：中文每句不超过 36 字，英文不超过 90 个字符。全片 14–22 句，大约 60–90 秒。

## 表情代码

每个角色有哪些表情，由她的 `face.json` 决定。默认四个：

- `n` 正常
- `b` 眨眼，一般不用写，引擎会自动眨
- `h` 开心
- `s` 冒汗

常见的扩展表情：

- `p` 哼，鼓嘴、脸红
- `a` 生气
- `r` 害羞、慌
- `m` 斜眼得意
- `q` 疑惑，头上冒问号
- `z` 犯困，头上冒 zzz
- `w` 哇，脸红

## 场景类型

左边舞台是 1050×640，右边是立绘，底部是对话框。每一场都写 `id`（英文小写，全片唯一）、`type` 和 `lines`。元素写了 `cue` 就在那个时刻弹出；不写 `cue`，就从这一场开始依次出现。

| type | 字段 | 用途 |
| --- | --- | --- |
| `title` | `big`（像素大字，如 "DAY 0"）、`sub`、`press`（闪烁提示） | 第一场，第 0 帧就有画面 |
| `flow` | `a {kicker,text}`、`mid {text,cue}`、`b {kicker,big,cue}` | A 交给 B 这类关系 |
| `status` | `title`、`rows [{k,v,style: name/accent/text}]`、`tags {k, items [{text,cue}]}` | 角色状态卡 |
| `cards` | `title`（像素字）、`items [{t,s,cue}]`（最多 3 张）、`note {text,cue}` | 规矩、清单；说到哪条哪条高亮 |
| `lines` | `items [{text, style: big/dim/mid/small/accent/pixel, mark, cue}]` | 大字强调，最多 3 行 |
| `image` | `src`、`caption`、`cue`、`meter {label,doing,done,cue,duration}`、`redraw {who,wipe}` | 放一张图，进度条，立绘逐块重画 |
| `ledger` | `title`、`counters [{k,v,cue}]`（3 个）、`stamp {text,cue}` | 今日账本，盖章 |
| `chat` | `title`、`messages [{who,text,cue}]`（最多 5 条） | 聊天记录，比如两个 AI 开会的原话 |
| `clip` | `src`（视频）、`from`、`duration`、`cue`、`caption`、`volume` | 在画框里放一段视频 |
| `ask` | `title`、`typed`、`button`、`typed_cue`、`note {text,cue}` | 评论区点菜 |
| `follow` | `button`、`cue`、`bubble {text,cue}`、`note {text,cue}` | 求关注 |
| `end` | `big`、`bye`、`disclaimer`（两行） | 最后一场，自动配结束音效 |

`image` 和 `clip` 的 `src` 相对于 JSON 文件，构建时会复制进项目。

## 校验和出片

```bash
.venv/bin/python -m pixel_diary check episodes/xxx.json
```

```bash
.venv/bin/python -m pixel_diary build episodes/xxx.json --out work/xxx --render out/xxx.mp4
```

`check` 会检查这几项：说话人在不在 cast 里；每个 cue 能不能在台词里找到；cue 有没有重名；场景类型和必填字段；图片和视频文件在不在。
