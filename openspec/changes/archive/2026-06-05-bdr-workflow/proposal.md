## Why

BDR（Bad smell Driven Refactoring，坏味道驱动重构）已在 `docs/prd/` 中定义了完整的宪法、元规约与工件格式，但缺少可安装、可命令驱动的 Agent 框架。开发者目前无法通过 `bdr:explore`、`bdr:plan`、`bdr:apply` 等统一入口，让编码 Agent 自动遵循 BDR 流程扫描坏味道、制订重构计划并执行重构。将 BDR 封装为以 Skill 为核心的 Plugin，可让 Claude Code、Codex CLI、Cursor、OpenCode 等 harness 共享同一套重构方法论。

## What Changes

- 新增 **BDR Plugin** 包结构，分阶段交付：
  - **Phase 1 MVP（已实现）**：`.cursor-plugin`、`.opencode`、共享 `skills/` / `commands/`
  - **v1.1**：`.claude-plugin`、`.codex-plugin`、Gemini 扩展、hooks
- 新增 **核心 Skill 库**：
  - `using-bdr` — 元 Skill，引导 Agent 在 BDR 任务前加载正确 Skill 与工件路径。
  - `bdr-explore-to-change` — 对应 `bdr:explore`：扫描指定目录/项目源码，依据 constitution §3 第一性原则、SOLID、迪米特法则、Fowler 重构坏味道及语言最佳实践，输出/更新 `docs/bdr/badsmells.md`（条目含已清除/未清除状态）。
  - `bdr-plan-change` — 对应 `bdr:plan`：针对未清除坏味道制订重构计划，输出/更新 `docs/bdr/tasks.md`（任务与步骤含已执行/未执行状态；含补测、覆盖率、mock 测绿、重构等步骤）。
  - `bdr-apply-change` — 对应 `bdr:apply`：按 `tasks.md` 执行未完成任务，严格遵循 constitution §4 标准步骤（补测→测绿→重构→回归→用户确认）。
- 新增 **Commands** 薄层：`bdr:explore`、`bdr:plan`、`bdr:apply`（及 `bdr:analyze` 用于 badsmells 变更后的 tasks 差分同步），各命令委托对应 Skill。
- 内置 **规约引用**：Skill 运行时读取项目内 `docs/bdr/constitution.md`、`docs/bdr/specification.md`（或 `docs/prd/` 等价路径，可配置）作为约束，不硬编码业务坏味道清单。
- 新增 **工件模板与校验辅助**：badsmells 条目格式、tasks 任务模板、修订历史「提交版本」列提醒（对齐 specification §7）。
- 新增 **README 与安装说明**：Phase 1 覆盖 Cursor path-install 与 OpenCode（见 `.opencode/INSTALL.md`）；其余 harness 安装见 v1.1。

## Delivery Phases

| 阶段 | 交付物 | 状态 |
|------|--------|------|
| Phase 1 MVP | Cursor + OpenCode 插件，5 Skill，4 Command，templates，reference 同步，Shell 测试 | 已实现 |
| Phase 2 | `docs/bdr/` 路径迁移 | 待做 |
| Phase 3 | Cursor 全链路手动验收 | 待做 |
| v1.1 | Claude/Codex/Gemini、hooks、code-reviewer、版本 bump | 延后 |

## Capabilities

### New Capabilities

- `bdr-core`: BDR 元 Skill（`using-bdr`）、共享常量（工件路径、状态枚举、门禁摘要）、多 harness 插件清单（Phase 1：Cursor + OpenCode；v1.1：其余平台 + hooks）。
- `bdr-explore-to-change`: 源码扫描与坏味道识别 Skill + `bdr:explore` 命令；输出符合 specification §4 的 `badsmells.md`。
- `bdr-plan-change`: 重构任务分解 Skill + `bdr:plan` 命令；基于未清除坏味道生成符合 constitution §4 的 `tasks.md`。
- `bdr-apply-change`: 重构执行 Skill + `bdr:apply` 命令；逐步执行 tasks 并更新状态，强制测绿与用户确认门。
- `bdr-analyze-change`: badsmells 变更后的差分分析 Skill，同步 `analysis.md` 与 `tasks.md`（对齐 constitution §2.4）。

### Modified Capabilities

（无 — `openspec/specs/` 当前为空，全部为新增能力。）

## Tech Stack

零第三方运行时依赖的分层技术栈：

| 层级 | 技术 | 用途 |
|------|------|------|
| **Skill / Command** | Markdown + YAML frontmatter（`SKILL.md`、`commands/*.md`） | BDR 行为与命令入口 |
| **Agent 提示词** | Markdown（`agents/*.md`） | 可选 subagent（如 code-reviewer） |
| **Plugin 清单** | JSON（`.cursor-plugin/`、`.claude-plugin/`、`.codex-plugin/`、`gemini-extension.json`） | 多 harness 注册 |
| **Hooks** | Bash + JSON（`hooks/hooks-cursor.json`、`hooks/session-start`） | sessionStart 注入 `using-bdr` |
| **OpenCode 插件** | Node.js ESM（`.opencode/plugins/bdr.js`，仅用 Node 内置模块） | OpenCode 引导与 skills 注册 |
| **脚本 / 测试** | Bash（`scripts/`、`tests/`） | 校验、同步、版本 bump、插件加载测试 |
| **包管理** | 最小 `package.json`（`"type": "module"`，无 runtime dependencies） | OpenCode 入口与版本元数据 |
| **Harness 说明** | `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` | 各平台 Agent 引导 |
| **规约 / 模板** | Markdown（`docs/reference/bdr/`、`templates/`） | BDR 工件与参考规约 |
| **许可证** | MIT | 开源分发 |

**支持 harness**：

- **Phase 1 MVP**：Cursor、OpenCode
- **v1.1 目标**：Claude Code、Codex CLI / Codex App、Gemini CLI、GitHub Copilot CLI

**刻意不包含**：Python/Java 运行时库、npm 第三方包、独立 CLI 二进制；对用户目标项目的语言扫描由 Agent 调用项目既有工具链（pytest、JUnit 等）完成。

## Impact

- **新增目录（Phase 1 MVP）**：`skills/`、`commands/`、`scripts/`、`tests/`、`templates/`、`.cursor-plugin/`、`.opencode/plugins/`、`package.json`、`README.md`、`LICENSE`、`CHANGELOG.md`、`docs/reference/bdr/`。
- **v1.1 新增**：`agents/`、`hooks/`、`.claude-plugin/`、`.codex-plugin/`、`.version-bump.json`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md`。
- **与现有文档关系**：`docs/prd/` 中的 constitution、specification、badsmells、tasks、analysis 作为 **权威规约** 被 Skill 引用；框架本身不修改这些文档的业务内容，仅提供自动化执行路径。目标运行时工件路径遵循 constitution §2.1：`docs/bdr/`（可将 `docs/prd/` 作为本仓库开发期别名或迁移目标）。
- **依赖**：零第三方运行时依赖；Markdown-first Plugin 模型。
- **用户工作流**：安装 Plugin → `bdr:explore [path]` → 审阅 `badsmells.md` → `bdr:plan` → 审阅 `tasks.md` → `bdr:apply` → 逐任务确认直至坏味道清除。
