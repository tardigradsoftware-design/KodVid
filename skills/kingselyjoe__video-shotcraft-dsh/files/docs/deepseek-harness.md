# DeepSeek Harness 使用指南

video-shotcraft 以 DSH 原生 filesystem skill 方式运行。安装器会将完整镜头卡、Remotion
组件、模板和音频资产复制到 `$DSH_HOME/skills/video-shotcraft`，默认是
`~/.dsh/skills/video-shotcraft`。

## 安装

Windows PowerShell：

```powershell
git clone https://github.com/kingselyjoe/video-shotcraft-dsh.git
cd video-shotcraft-dsh
.\install-dsh.ps1
```

macOS / Linux：

```bash
git clone https://github.com/kingselyjoe/video-shotcraft-dsh.git
cd video-shotcraft-dsh
bash install-dsh.sh
```

需要 Python 3.10+ 运行安装管理器，并需要 Node.js、npm、npx 执行 Remotion 工作流。

## 诊断

```bash
python scripts/dsh_manager.py doctor
python scripts/dsh_manager.py --json doctor
```

诊断会检查 SKILL.md、manifest、安装副本、所有权标记和 Node 工具链。

## 使用

```text
使用 video-shotcraft 检查这个前端项目，推荐适合的宣传片制作模式。
使用 video-shotcraft 的 Ink Press 模板，为当前产品制作一支 30 秒宣传片。
使用 video-shotcraft 的 spotlight-hero-card 做一个独立产品特写镜头。
```

完整视频工作流会创建或修改 Remotion 项目并可能执行浏览器截图、npm 安装和渲染。Skill
应先确认目标项目目录、输出目录和制作模式；不得读取或拍摄登录凭据、客户数据或未授权页面。

## 本地 Gallery

仓库包含完整镜头索引和静态 Gallery。动态 MP4 不随 Git 仓库分发时，仍可通过镜头卡、
demo TSX 和本地模板完成选择与实现：

```bash
cd gallery
python -m http.server 4178
```

打开 `http://localhost:4178/library.html`。没有本地 MP4 的卡片以文字说明和源码为准。

## 更新与卸载

```bash
git pull
python scripts/dsh_manager.py install
python scripts/dsh_manager.py doctor
python scripts/dsh_manager.py uninstall
```

非本工具管理的同名目录默认不会覆盖。`install --force` 会先生成带 UTC 时间的备份；卸载
只删除带 `.dsh-package.json` 所有权标记的目录。
