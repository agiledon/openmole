## Context

BDR 0.2.0 已完成 change workspace 模型与 Cursor/OpenCode 手动安装路径。用户需在目标项目获得：

1. `bdr/config.yaml` + `bdr/changes/` 目录树
2. 所选 AI IDE 可发现 5 个 skill 与 5 个 command

OpenSpec `@fission-ai/openspec` 的 `openspec init` 提供可复用模式：Clack 多选 TUI、`--tools` 非交互、按 IDE 分发配置文件的 Tool Configurator、已初始化项目的 extend 模式。

**约束**：

- Plugin 本体（`skills/`、`bdr.js`）保持零 npm 运行时依赖
- CLI 可引入最小交互依赖（`@clack/prompts`、`picocolors`），仅 `bin/bdr` 使用
- 不复制 constitution/specification 到目标项目（F1 内嵌规约不变）

## Goals / Non-Goals

**Goals:**

- `bdr init` 在指定目录（默认 `.`）初始化 BDR 工作区
- 交互式列出 5 个 IDE，空格多选，Enter 确认
- 按所选 IDE 执行对应安装操作，使 BDR skill/command 可用
- 支持 `--ides cursor,opencode` 非交互；`--force` 覆盖已有配置；已初始化时 extend 模式（追加 IDE，不破坏已有）
- 安装后输出验证清单与下一步提示

**Non-Goals:**

- 不实现 `bdr explore/analyze/...` 等运行时子命令（仍由 IDE Agent 执行）
- 不在 init 中执行坏味道扫描或重构
- 不自动安装 Cursor/OpenCode 本体
- 不发布 npm registry（首版支持 `npm link` / 全局 path；registry 另议）

## Decisions

### D1：CLI 包结构与入口

**选择**：

```
cli/
├── index.js           # 命令路由
├── commands/init.js   # bdr init 实现
├── prompts/ide-select.js
├── adapters/          # 每 IDE 一个 adapter
│   ├── cursor.js
│   ├── opencode.js
│   ├── claude-code.js
│   ├── codex.js
│   └── gemini-cli.js
└── workspace/init.js  # bdr/ 目录 bootstrap
bin/bdr.js             # #!/usr/bin/env node shebang → cli/index.js
```

`package.json` 增加 `"bin": { "bdr": "./bin/bdr.js" }`。

**理由**：与 OpenSpec 分层一致；adapter 可独立测试。

### D2：交互 UI — 对标 OpenSpec init

**选择**：`@clack/prompts` 的 `multiselect`：

```
? 选择要配置 BDR 的 AI IDE（空格选择，Enter 确认）
  ◯ Cursor
  ◯ OpenCode
  ◯ Gemini CLI
  ◯ Claude Code
  ◯ Codex
```

**理由**：OpenSpec 已验证；比自研 readline 多选更稳。

**备选**：零依赖 readline — 拒绝，维护成本高。

### D3：BDR 包路径解析

**选择**：CLI 运行时解析 BDR plugin 根目录：

1. `import.meta.url` → `cli/` 的上级 = package root
2. 全局安装：`npm root -g` + `/bdr` fallback
3. 环境变量 `BDR_HOME` 覆盖（开发/debug）

所有 adapter 使用该 root 下的 `skills/`、`.cursor-plugin/`、`.opencode/plugins/bdr.js` 等。

### D4：工作区 bootstrap

**选择**：在 `{target}/bdr/` 创建：

| 路径 | 行为 |
|------|------|
| `bdr/config.yaml` | 自 `templates/bdr-config.yaml.example` 复制；已存在则 skip（除非 `--force`） |
| `bdr/changes/` | `mkdir -p` |
| `bdr/changes/archive/` | `mkdir -p` |

不在 init 中创建 change 目录（由 `bdr:explore` 首次运行时创建）。

### D5：各 IDE 安装动作

| IDE | Init 动作 | 配置目标 |
|-----|-----------|----------|
| **Cursor** | symlink package root → `~/.cursor/plugins/local/bdr` | 用户级 plugin |
| **OpenCode** | merge `plugin: ["<abs>/bdr.js"]` 到项目 `opencode.json`；无则创建 | 项目级优先，可选 `--global` 写 `~/.config/opencode/opencode.json` |
| **Claude Code** | symlink 或 copy plugin 引用至 `~/.claude/plugins/` 或项目 `.claude-plugin/`（依 Claude 文档） | 待 manifest 就绪 |
| **Codex** | 写入/更新 `.codex-plugin/plugin.json` 指向共享 skills/commands；或用户级 codex 配置 | 待 manifest 就绪 |
| **Gemini CLI** | 写入/链接 `gemini-extension.json` + 项目 `GEMINI.md` 摘要 | 待 manifest 就绪 |

**Phase A（MVP）**：Cursor + OpenCode adapter 完整实现；Claude/Codex/Gemini adapter 返回明确「manifest 未就绪」或 scaffold 占位 + 文档链接（若用户选中则 warn 并 skip，不 fail 整个 init）。

**Phase B**：补全三 IDE manifest 与 adapter。

### D6：Extend 模式

**选择**：若 `{target}/bdr/config.yaml` 已存在：

- 跳过 workspace bootstrap（除非 `--force`）
- 仅对**新选且未配置**的 IDE 运行 adapter
- 打印「BDR 已初始化，正在追加 IDE 配置」

对标 `openspec init` 在已初始化项目的行为。

### D7：非交互 flags

```
bdr init [path] [options]

Options:
  --ides <list>    逗号分隔：cursor,opencode,gemini,claude,codex
  --all            等价 --ides 全部
  --none           仅 workspace，不配置 IDE
  --force          覆盖已有 config / IDE 配置
  --global         OpenCode 等写用户级配置
  --dry-run        打印将执行的操作，不写入
```

### D8：CLI 依赖与 plugin 零依赖分离

**选择**：

- `dependencies`：`@clack/prompts`（CLI only）
- `devDependencies`：测试工具
- `bdr.js` / `skills/` **不** import CLI 依赖

**理由**：满足历史零依赖 plugin 约束，同时 CLI 体验达标。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| Claude/Codex/Gemini manifest 未实现 | Phase A 仅 fully support 2 IDE；其余 warn + 文档 |
| Cursor 企业版禁用 local plugin | init 输出 troubleshooting 链接 |
| OpenCode `opencode.json` merge 冲突 | JSON 深合并 + 备份 `.bak` |
| 全局 vs 项目级配置歧义 | 默认项目级；`--global` 显式开关 |
| npm 全局路径因版本管理器而异 | `BDR_HOME` + 文档说明 `npm link` 开发流 |

## Migration Plan

1. 实现 CLI + Cursor/OpenCode adapter
2. README 改为 `npm install -g bdr && bdr init` 首选路径
3. 保留 `scripts/install-cursor-plugin.sh` 委托 `bdr init --ides cursor`
4. Phase B 补 manifest 后扩展 adapter，无需用户重跑 workspace init

## Open Questions

- npm 包名：`bdr` vs `@agiledon/bdr`（实现前确认 scope）
- Claude Code 官方 plugin 路径以 2026 文档为准（adapter 实现时核对）
- init 是否默认 gitignore `bdr/changes/*/badsmells.md` 等（建议否，由用户决定）
