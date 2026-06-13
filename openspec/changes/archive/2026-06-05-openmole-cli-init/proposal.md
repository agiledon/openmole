## Why

OpenMole 插件目前依赖手工安装（Cursor symlink、OpenCode 手改 `opencode.json`），门槛高且易错。OpenSpec 的 `openspec init` 已验证「交互式多选 IDE + 自动配置 harness + 初始化项目结构」的模式。用户应在任意目标目录运行 `openmole init` 即可完成 OpenMole 工作区初始化与各 AI IDE 的 skill/command 接入。

## What Changes

- **新增** `openmole` CLI（npm 可执行入口），首要子命令 `openmole init [path]`
- **新增** 交互式 IDE 多选 UI（上下移动、空格切换）：Cursor、OpenCode、Gemini CLI、Claude Code、Codex
- **新增** 各 IDE 安装适配器（Tool Configurator 模式），按选择写入/更新对应配置
- **新增** 目标目录 `openmole/` 工作区初始化：`config.yaml`、`changes/`、`changes/archive/`
- **新增** 非交互模式：`openmole init --ides cursor,opencode`（对标 `openspec init --tools`）
- **保留** 现有手动安装文档作为 fallback；README 推荐 `openmole init`

## Capabilities

### New Capabilities

- `openmole-cli`: CLI 入口、`init` 命令、交互式 IDE 选择、工作区 bootstrap、非交互 flags

### Modified Capabilities

- `openmole-core`: 增加 CLI 作为官方安装路径；五 IDE 安装要求从「仅 manifest 存在」扩展为「init 可配置」

## Impact

- `package.json`：增加 `bin`、CLI 依赖（如 `@clack/prompts`，仅限 CLI，不影响 plugin 零依赖运行时）
- 新增 `cli/` 目录：`init`、IDE adapters、workspace bootstrap
- 新增/补全 harness 清单：`.claude-plugin/`、`.codex-plugin/`、`gemini-extension.json`（供 init 引用；可与 Phase 2 分步交付）
- `scripts/install-cursor-plugin.sh` 逻辑迁入 CLI adapter，脚本可保留为薄 wrapper
- `README.md`、各 `INSTALL.md` 更新为 `openmole init` 优先
- `tests/cli/`：Shell 或 Node 集成测试

## Delivery

参考 OpenSpec `init` UX；**方案 1** 单包 `cli/`。**Phase A** Cursor + OpenCode + workspace + config 元数据；**Phase B** 三 IDE manifest；registry **Phase 2**。

Brainstorming 决策见 [`docs/design/2026-06-05-openmole-cli-init-design.md`](../../../docs/design/2026-06-05-openmole-cli-init-design.md)。
