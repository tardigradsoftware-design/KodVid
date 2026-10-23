# 角色：草稿 → 像素 → 表情差分

## 1. 画草稿

用任何图像模型都行。一组角色要画在同一张图里，画风和比例才统一。下面这段提示词按顺序写了画风、每个角色的设计、背景和留白这些关键约束：

```
Character design illustration of two original chibi anime sisters standing side by side, full body, both facing the viewer,
symmetrical idle poses, plain flat pure white background, no shadow, no text. Same art style for both: flat cel-shaded colors
(two tones per material), thick clean dark outlines, no gradients, no texture, chibi proportions about 4 heads tall,
big expressive eyes with one white highlight each.
LEFT, ...（发色、发型、眼睛、表情、姿势、服装、标志性小物件）
RIGHT, ...（同上，写清身高差）
Both full figures fit the frame height from hair top to shoes, with clear empty space between them.
```

几条经验：

- 写 `flat cel-shaded`、`thick clean dark outlines`。平涂加粗线压成像素最干净，带渐变和纹理的会出杂点。
- 要纯白背景，两个角色之间留出空隙，方便分别裁切。
- 用 3:2 的画幅画两个人，单人用 2:3。
- 一次出两张挑一张，花不了几毛钱。

## 2. 压成像素

```bash
.venv/bin/python -m pixel_diary.sprite cast/draft.png cast/claude/base.png --cell 12 --colors 20 --dark 0.30 --thicken 3 --crop 0,0,1240,1680
```

```bash
.venv/bin/python -m pixel_diary.sprite cast/draft.png cast/deepseek/base.png --cell 12 --colors 20 --dark 0.30 --thicken 3 --crop 1240,0,2512,1680
```

参数说明：

- `--cell`：草稿里多少个像素压成一格。同一组角色必须用同一个值，站在一起比例才对。12 左右适合约 130 格高的角色，单人可以用 `--width 54`。
- `--thicken 3`：先把线条加粗，细线草稿不加就会丢轮廓。
- `--dark`：一格里有多少比例是深色时，保留成轮廓线。线太少就调低，杂点太多就调高。
- `--smooth x0,y0,x1,y1`：把孤立的单个像素抹平，括号里的框（脸部）不处理，避免把眼睛高光抹掉。

每次都会同时输出一张带坐标网格的预览图 `*_grid.png`，用它找眼睛和嘴的位置。

## 3. 写 face.json

字段说明：

```json
{
  "skin": [246, 222, 207],
  "keep": [[216, 132, 95]],
  "eyes": [{"box": [30, 25, 35, 33], "line_y": 30}, {"box": [45, 25, 51, 34], "line_y": 30}],
  "mouth": [40, 38],
  "blush": [[32, 35], [33, 35], [46, 36], [47, 36]],
  "mark": [53, 13],
  "mark_ink": [255, 236, 120],
  "faces": {
    "p": {"eyes": "half", "mouth": "frown", "extras": ["blush"]},
    "a": {"eyes": "half", "mouth": "shout", "extras": ["anger"]}
  }
}
```

- `skin`：脸的肤色，擦掉眼睛时用它填。
- `keep`：眼睛框里要保留的颜色，一般是盖在眼睛上的刘海。和瞳孔同色的不要放进来，否则闭眼时会残留。
- `eyes`：两只眼睛的框（左上、右下，含边界），`line_y` 是闭眼那条线所在的行。
- `mouth`：两像素宽的嘴的左边那一格。
- `blush`：脸红画在哪几格。
- `mark`：头顶标记（汗滴、怒气、zzz、问号）的左上角。`mark_ink` 是 zzz 和问号的颜色，选一个和头发、帽子撞不上的颜色。

可组合的部件：

- 眼睛：`open`、`closed`、`happy`（^ ^）、`half`（半睁）
- 嘴：`smile`、`open`、`grin`、`flat`、`frown`、`wavy`（慌）、`o`、`shout`
- 附加：`blush`、`sweat`、`anger`、`zzz`、`q`

默认表情是 `n`、`b`、`h`、`s`，`faces` 里写的会追加进去。

```bash
.venv/bin/python -m pixel_diary.faces cast/claude /tmp/claude-faces.png
```

每个表情 X 都会同时生成一张说话帧 Xt。打开预览图逐个检查，重点看这几处：闭眼有没有残留的瞳孔，嘴的位置对不对，标记有没有和头发撞色。

## 4. 换装和改道具

压出来的道具看不清时，直接用几行 Python（Pillow + numpy）在像素上重画。示例角色手里的笔记本电脑就是这么改的：

1. 先把旧道具那一片的颜色改成衣服的颜色。
2. 画一个带轮廓、高光和厚度的矩形。
3. 中间放一个品牌色的小标记。

像素图画错了改起来很便宜，比重新生成草稿可控得多。
