<div align="center">

<img alt="ai-product-video" src="./assets/brand/logo-mark.svg" width="112" height="112">

<h1>ai-product-video</h1>

[![GitHub stars](https://img.shields.io/github/stars/dlazy-ai/ai-product-video)](https://github.com/dlazy-ai/ai-product-video/stargazers)


**映画のような製品動画を制作するためのエージェントスキル：152 種類のショットレシピカード · 209 種類のスタイル · 調整済みの Remotion 実装 · 検証済みのショット構成**

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md)

</div>

**ai-product-video** は、Claude Code や Codex をモーションデザインスタジオに
変える AI エージェントスキルです。製品を指定するだけで、ストーリーボード、アニメーション、
サウンドデザインを行い、[Remotion](https://www.remotion.dev/) を使って映画のようなプロモーション、
マーケティング、ローンチ、デモ動画を制作します。実際のページキャプチャ、2.5D カメラワーク、

🖼️ **ライブラリを見る** —— [`references/shots/`](references/shots/) のカードを直接読みます。
10 個の機能カテゴリごとにディレクトリ分けされています。

## ✨ 最新情報

> [!IMPORTANT]
> ### 🆕 2026-08 · ショットレシピカード 48 枚を新規追加
> ライブラリは 104 枚から **152 カード / 209 スタイル**に拡充。209 候補
> から参照映像とのフレーム単位比較レビューを 8 ラウンド重ねて厳選し、
> 既存カテゴリに統合：完全なレシピカード + ネイティブ Remotion コンポーネント
> （`demos/<カテゴリ>/<カード名>/<Component>.tsx`、正規化された進行度 t で
> 駆動する決定論的レンダリング）。すべてテンプレート化済み
> （ニュートラルなプレースホルダー文言 + 差し替え可能な `ACCENT` カラー変数）。

- **2026-07 · 音声ライブラリ再構成**——`sfx/<カテゴリ>/` 構成、
  149 個の効果音を 16 カテゴリに分類、md5 重複排除とライセンス URL 復元。

## 🎬 ショーケース

以下の 38 秒間のライブラリ紹介動画も、このスキルで制作されました。
ストーリーボード、ショットの実装、サウンドデザインのすべてを、エージェントが
ツールキットの手法に沿って行っています。

https://github.com/user-attachments/assets/cba2df8a-4b2e-4247-bace-d0b1dea9c2bd

▶️ [YouTube で HD 版を見る](https://youtu.be/gcVvRM_P3SM)

## 🚀 クイックスタート

**最も簡単な方法は、リポジトリのリンクをエージェントに渡すことです。**
Claude Code、Codex、または同様のエージェントで、次のように伝えます。

```text
Install this skill for me: https://github.com/dlazy-ai/ai-product-video
```

エージェントがリポジトリをクローンし、スキルディレクトリにリンクします。または、
[skills](https://skills.sh/) CLI を使うか、手動でインストールします。

```bash
npx skills add dlazy-ai/ai-product-video
```

```bash
git clone https://github.com/dlazy-ai/ai-product-video.git
cd ai-product-video
ln -s "$(pwd)" ~/.claude/skills/ai-product-video   # Claude Code
# or
ln -s "$(pwd)" ~/.codex/skills/ai-product-video    # Codex
```

### dlazy CLI のセットアップ

映像は Remotion が生成しますが、**BGM・追加 SFX・ナレーション・字幕・B-roll は
[dlazy](https://dlazy.com) CLI 経由**で取得します。各社 API を個別に繋ぐ必要は
ありません。

```bash
npm install -g @dlazy/cli@1.2.3
dlazy login   # device-code flow, works over SSH
dlazy -h      # list every tool available to your account
```

`dlazy login` はデバイスコード方式で、キーは `~/.dlazy/config.json` に保存
されます。グローバルインストールを避けたい場合は
`npx @dlazy/cli@1.2.3 <command>`、既にキーがある場合は
`dlazy auth set <key>`（[ダッシュボード](https://dlazy.com/dashboard/organization/api-key)で取得）。

同梱の 149 個の SFX にアカウントは不要です。BGM・ナレーション・字幕、または
スクリーンショットでは表現できない動きのカットが必要になったときだけ CLI を
使います。

インストール後は、次のように依頼できます。

```text
Use ai-product-video to create a promo for my desktop product.
Use the deck-deal-flyin and row-embed shot cards to present this feature.
Design a product close-up inspired by spotlight-hero-card.
```

ショットカードを指定しない場合、スキルは最初に内蔵の動画テンプレートを
紹介し、それを使うか確認します。作業を始める前に
[`references/shots/`](references/shots/) でショットを選ぶこともできます。

## 📼 動画テンプレート：Ink Press

スキルには、検証済みの完全なプロモーションテンプレート **Ink Press** が付属します。
長さ 36.2 秒、1920×1080、30fps、紙・インク・アンバー調の 10 ショットで構成され、2.5D の
実ページカメラワーク、タイトルカード、トランジション、細部まで調整された映画品質の
SFX が含まれます。

https://github.com/user-attachments/assets/4cf5af51-98f3-4af2-8ab2-7267f470513d

▶️ [YouTube で HD 版を見る](https://youtu.be/iShab28B_ak)

使用するには、エージェントに次のように伝えるだけです。

```text
Use ai-product-video to make a promo for my product with the Ink Press template.
```

エージェントが製品のスクリーンショット、コピー、ブランド要素に差し替えて
同じ品質を再現します。完成した動画を得るための、最も速く確実な方法です。

> 今後、さらに多くのテンプレートが追加される予定です。

### Headless / CI に関する注意事項

ヘッドレスの Linux サーバー（検証環境：2 コア、Node 22）でレンダリングする際、
次の 3 つの問題に遭遇します。いずれもフラグ 1 つで解決できます。

1. **並列数の上限** — 低コアのマシンでは `remotion still/render` が
   "Maximum for --concurrency is 2" というエラーで失敗します。対処:
   `--concurrency=1` を指定します。
2. **旧 Headless モードの廃止** — 最近の Chrome/Chromium は旧 headless モードを
   廃止したため、Remotion にシステムの chromium を指定すると起動に失敗します。
   対処: フル版 Chrome ではなく chrome-headless-shell バイナリを使用します。
3. **CDN への接続遮断** — remotion.media に到達できない環境では、
   headless-shell の自動ダウンロードが失敗します。対処:
   `--browser-executable=<ローカルの chrome-headless-shell のパス>` を指定します。

この 3 つのフラグを設定すれば、自分で取得した素材を配置したうえでレンダリングが動作します。

## 📦 収録内容

| 内容 | 説明 |
| --- | --- |
| 152 種類のショットレシピカード | 目的、エネルギー、推奨時間、パラメータ、実装上の注意点、既知の落とし穴 |
| 209 種類のスタイルバリエーション | 152 枚のカードが 209 種類のスタイルを網羅し、各スタイルが個別の Remotion デモに対応 |
| Remotion 実装 | 各カードの実際のイージングとタイミングパラメータを含む、調整済みの TSX デモ |
| Ink Press のショット構成 | 検証済みの 36.2 秒 / 1920×1080 / 30fps / 10 ショット構成——シーンのソースは同梱、元のスクリーンショットは非同梱（自分で取得）|
| dlazy CLI 連携 | BGM、追加 SFX、ナレーション、単語単位の字幕、B-roll 生成を 1 つの CLI で |
| 制作手法 | キャプチャ、ビジュアルディレクション、ストーリーボード、サウンドデザイン、ビート同期、最終 QA |

このツールキットは主に Web およびデスクトップ製品のプロモーションを対象としていますが、
各ショットカードは機能デモ、ブランド映像、ローンチ動画、
その他のモーション制作にも利用できます。

## 🗂 リポジトリ構成

```text
ai-product-video/
├── SKILL.md                 # Agent entry point and core production rules
├── references/
│   ├── pipeline.md          # End-to-end production workflow
│   ├── shots/               # 152 shot recipe cards
│   ├── sequences/           # Reusable full-video structures and sequence patterns
│   ├── aesthetic-rules.md   # Visual QA criteria
│   ├── music-beat-sync.md   # BGM analysis and beat-sync methodology
│   └── sound-design.md      # Sound-design guidance and examples
├── demos/                   # Remotion reference implementations for shot cards
├── template/                # Reference film: shot structure + scene source (assets not bundled)
└── assets/
    ├── lib/                 # Reusable Remotion components
    ├── scripts/             # Page-asset capture scripts
    └── audio/               # 音声アセット
        └── sfx/<カテゴリ>/  # 効果音 149 個、シーン別 16 カテゴリ
```

完全なワークフローと実装要件については、[SKILL.md](SKILL.md)、
[制作パイプライン](references/pipeline.md)、および
[ビジュアル QA 基準](references/aesthetic-rules.md)を参照してください。

## 🔊 音声とアセットに関する注意事項

`assets/audio/` にある音声ファイルは、それぞれのライセンス条件に従って使用できます。
出典とライセンスの詳細については、[ATTRIBUTION.md](assets/audio/ATTRIBUTION.md)を参照してください。

効果音はシーン／素材ごとに 16 カテゴリへ分類されています（`transition` `impact`
`riser` `camera` `ui` `text` `paper` `film` `light` `data` `scifi` `mech` `glass`
`fluid` `crowd` `counter`）。**まずカテゴリを決め、次に音色を選ぶ**のが基本です。
カテゴリ索引とファイルごとの用途は
[sound-design.md](references/sound-design.md) を参照してください。

`assets/audio/` に含まれるのは **SFX のみ**です。BGM は `dlazy search_audio` で
都度取得するため、音楽ファイルは同梱していません。取得した楽曲は曲名・出典・
ライセンスをその場で記録してください。

参考作品のスクリーンショットも**同梱していません**。`template/` が提供するのは
ショット構成とシーンのソースコードで、素材は
[TEMPLATE.md](template/TEMPLATE.md) に従って対象製品のものを取得します。公開前に、
撮影した内容に含まれる製品・顧客・個人データの匿名化が必要か確認してください。

## 🙏 謝辞

**ai-product-video は [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)**（作者：Wei Yihao、Apache-2.0）
をベースにしています。ショットカード集、デモ実装、制作パイプライン、Ink Press の
参考作品はいずれも上流の成果です。本バージョンでは BGM・ナレーション・字幕・B-roll を
[dlazy](https://dlazy.com) CLI 経由に変更し、再配布に適さない素材を削除しています。
変更点の全一覧は [NOTICE.md](NOTICE.md) を参照してください。

このライブラリの多くのショットレシピは、優れた公式製品動画のモーション表現を
研究してまとめたものです。対象には **ClickUp、Perplexity、Slack、Notion、
Figma、Framer、Bear、Raycast、Pitch、Miro、Superhuman、Loom** のプロモーションが
含まれます。カードには、ゼロから再実装したモーション技法
（タイミング、イージング、振り付け）を記載しています。これらの動画の映像、アートワーク、
ブランドアセットはリポジトリに含まれません。すべての商標は各所有者に帰属し、
各社は本プロジェクトと提携しておらず、また本プロジェクトを推奨していません。
2026-08 に追加した 48 枚のカードのバッチ別ソース情報は
[references/shots/ATTRIBUTION.md](references/shots/ATTRIBUTION.md) を参照してください。

特に以下のプロジェクトとコミュニティに感謝します。

- **[Remotion](https://www.remotion.dev/)** — すべてのデモとテンプレートを支える
  React ベースの動画フレームワークです。Remotion には独自の
  [ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
  がある点に注意してください（個人と小規模チームは無料、企業は有料ライセンスが必要な場合があります）。
- **[Mixkit](https://mixkit.co/)** — 同梱の 149 個の SFX の出典（無料の商用ライセンス）
  SFX と音楽アセットの提供元です。
- 複数のカードに影響を与えた、ゲームフィールとアニメーションのコミュニティが公開する原則
  （Vlambeer のスクリーンシェイクに関する講演、古典的なアニメーションのタイミングなど）。
- **Claude Code** — このライブラリ自体も、スキルが教えるものと同じワークフローを使い、
  AI コーディングエージェントによって構築、反復改善、QA されました。
