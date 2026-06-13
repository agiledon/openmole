## Why

OpenMole CLI 当前以纯文本 `--help` 作为默认入口，缺少 OpenSpec 风格的 onboarding 体验；npm 包名 `openmole` 已被占用，无法发布 registry；且 Kiro、Qoder 尚未纳入 `openmole init` 支持的 IDE 清单。需要在不改变现有 command/skill 名称的前提下，提升首次使用体验、完成 `openmole` 品牌化发布，并扩展 harness 覆盖。

## What Changes

- **Welcome 画面**：运行 `openmole`（无子命令）或 `openmole init` 交互前，展示 OpenSpec 风格的欢迎屏——左侧闪烁 **R** logo（青色 `#26a69a` 系），右侧 OpenMole 框架说明、Quick start（`/mole-explore` … `/mole-archive`）、配置摘要；用户按 Enter 后进入 AI IDE 多选清单
- **npm 包重命名与发布**：验证 `openmole` 在 npm registry **未被占用**（已确认 404）；将 npm `package.json` `name` 改为 `openmole` 并发布；**保留** CLI 二进制名 `openmole`、现有 `commands/` 与 `skills/` 名称不变
- **Kiro + Qoder 适配器**：项目级安装至 `.kiro/skills/`、`.kiro/commands/` 与 `.qoder/skills/`、`.qoder/commands/`；`installed_ides` 扩展 `kiro` | `qoder`；welcome 与 multiselect 增至 7 个 IDE
- **文档**：README 英文/中文同步更新安装命令为 `npm install -g openmole`

## Capabilities

### New Capabilities

- `openmole-cli-welcome`: 欢迎屏 UI、闪烁 R logo、Enter 继续、Quick start 文案

### Modified Capabilities

- `openmole-cli`: 默认 `openmole` 行为改为 welcome + init 引导；IDE 清单含 Kiro/Qoder；`openmole` 发布相关 CLI 文案
- `openmole-core`: 七 IDE harness 支持；npm 包标识 `openmole`；Kiro/Qoder 安装模型

## Impact

- `cli/index.js`、`cli/prompts/welcome.js`（新）、`cli/prompts/ide-select.js`
- `cli/adapters/kiro.js`、`cli/adapters/qoder.js`（新）
- `package.json`（`name: openmole`）、README、各 INSTALL.md
- `templates/openmole-config.yaml.example`（`installed_ides` 注释）
- `tests/cli/` 新增 welcome、kiro、qoder 测试
- **无 BREAKING** 对 skill/command 名称；**BREAKING（npm）**：包名从 `openmole` → `openmole`（GitHub 安装 URL 变更）
