## Context

本仓库已在 `docs/prd/`（目标运行时路径为 `docs/bdr/`）定义 BDR 宪法、元规约与示例工件（badsmells、tasks、analysis）。这些文档描述了 **做什么** 与 **门禁**，但缺少 **如何让编码 Agent 自动执行** 的实现载体。

BDR 框架采用 **Skill-first + Plugin 多 harness 分发** 分层：以 **Skill（SKILL.md）** 为行为单元，以 **Plugin 元数据** 注册到 Cursor / Claude Code / Codex / OpenCode，以 **Commands** 作为用户入口委托 Skill。将 explore / plan / apply 三阶段映射为独立 Skill + Command，并增加 `using-bdr` 元 Skill 与 `bdr-analyze` 闭环。

**约束**：
- 宪法 §4 标准步骤不可跳过（补测 → 测绿 → 重构 → 回归 → 用户确认）。
- 工件路径以 constitution §2.1 为准：`docs/bdr/badsmells.md`、`docs/bdr/tasks.md` 等。
- 框架 **不嵌入** 具体业务坏味道；运行时读取项目内 constitution / specification。

## Tech Stack

BDR Plugin 采用 **零第三方运行时依赖、Markdown-first、多 harness JSON 清单** 原则（Shell + Markdown 为主，JavaScript 仅用于 OpenCode 引导）。

### 分层一览

| 层级 | 技术 | 用途 |
|------|------|------|
| 行为单元 | `skills/*/SKILL.md` | `using-bdr`、`bdr-explore`、`bdr-analyze`、`bdr-plan`、`bdr-apply` |
| 命令入口 | `commands/*.md`（frontmatter + 委托 skill） | `commands/bdr-*.md` |
| Subagent | `agents/code-reviewer.md` | apply 阶段可选审查 |
| Cursor 插件 | `.cursor-plugin/plugin.json` | 注册 skills / commands / agents / hooks |
| Claude 插件 | `.claude-plugin/plugin.json` + `marketplace.json` | Claude Code 安装 |
| Codex 插件 | `.codex-plugin/` + `docs/README.codex.md` | Codex CLI 安装 |
| OpenCode | `.opencode/INSTALL.md` + `.opencode/plugins/bdr.js`（ESM，仅 Node 内置模块） | OpenCode 引导 |
| Gemini | `gemini-extension.json` + `GEMINI.md` | Gemini CLI 扩展 |
| Hooks | `hooks/hooks-cursor.json` + Bash `session-start` | 注入 `using-bdr` 摘要 |
| 脚本 | `scripts/*.sh` | 同步、校验、版本 bump |
| 测试 | `tests/opencode/`、`tests/plugin/` | Shell 集成测试 |
| 包元数据 | `package.json`（`type: module`，无 dependencies） | OpenCode 入口 |
| 版本 | `.version-bump.json` | 版本管理 |
| Harness 引导 | `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` | 各平台 Agent 说明 |

### 语言与格式约定

- **Skill / Command / Agent**：Markdown，Skill 须含 YAML frontmatter（`name`、`description`）。
- **Plugin 清单**：JSON，字段含 `name`、`displayName`、`version`、`skills`、`commands`、`agents`、`hooks`（Cursor）。
- **Hooks**：Bash（`#!/usr/bin/env bash`，`set -euo pipefail`），输出 JSON 供 harness 注入上下文。
- **OpenCode 插件**：JavaScript ESM（`import` / `export`），禁止引入 npm 第三方包；frontmatter 解析等逻辑内联。
- **脚本与测试**：Bash；测试优先 Shell 集成测（插件加载、manifest 校验、命令可达性）。

### 零依赖原则

**Plugin 本体不添加可选或必需的第三方运行时依赖**。对用户仓库中 Python/Java/TypeScript 等语言的扫描与测试，由 Agent 调用 **目标项目已有** 的工具（`pytest`、`mvn test` 等），不在 BDR Plugin 内嵌语言运行时或分析器库。

### 支持 Harness

Cursor、Claude Code、Codex CLI、Codex App、OpenCode、Gemini CLI、GitHub Copilot CLI。

## Goals / Non-Goals

**Goals:**

- 提供可安装的 **BDR Plugin**，用户执行 `bdr:explore`、`bdr:plan`、`bdr:apply`（及 `bdr:analyze`）即可驱动 Agent。
- **Skill 为核心**：每个阶段的行为、门禁、输出格式均在 SKILL.md 中完整定义；Commands 仅做路由与参数说明。
- **多 harness 一致**：同一 `skills/` 目录被 Cursor、Claude、Codex、OpenCode 插件清单引用。
- **规约对齐**：Skill 显式引用 constitution §3～§5、specification §4～§7；输出工件满足 badsmells / tasks 条目格式与状态字段。
- **状态可追踪**：badsmells 条目状态（已清除 / 未清除 / 部分残余）；tasks 任务与步骤状态（已执行 / 未执行）。

**Non-Goals:**

- 不实现独立 CLI 二进制或语言特定的静态分析器（扫描由 Agent + 现有工具链完成，如 grep、pytest、coverage）。
- 不在本阶段实现 Web UI 或 badsmells 可视化仪表板。
- 不修改用户项目业务代码（框架只提供流程与模板；apply 阶段由 Agent 在用户仓库执行）。
- 不替代 SDD；对外行为变更仍须走 SDD 流程（Skill 中强制 `[SDD]` 标注检查）。

## Decisions

### D1：Skill-first，Command 为薄包装

**选择**：核心逻辑全部写入 `skills/<name>/SKILL.md`；`commands/bdr-explore.md` 等仅含 frontmatter +「请加载 bdr-explore skill 并执行」。

**理由**：Skill 可跨 harness 复用；Command 在不同平台的格式略有差异，薄包装降低维护成本。

**备选**：Command 内联完整流程 — 拒绝，会导致四处复制、易与宪法漂移。

### D2：Plugin 目录布局

```
bdr/
├── .cursor-plugin/plugin.json      # skills, commands, agents, hooks
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── .codex-plugin/plugin.json
├── .opencode/
│   ├── INSTALL.md
│   └── plugins/bdr.js              # ESM，零 npm 依赖
├── gemini-extension.json
├── package.json                    # type: module，无 dependencies
├── .version-bump.json
├── skills/
│   ├── using-bdr/SKILL.md
│   ├── bdr-explore/SKILL.md
│   ├── bdr-analyze/SKILL.md
│   ├── bdr-plan/SKILL.md
│   └── bdr-apply/SKILL.md
├── commands/
│   ├── bdr-explore.md
│   ├── bdr-analyze.md
│   ├── bdr-plan.md
│   └── bdr-apply.md
├── agents/
│   └── code-reviewer.md            # 可选，apply 后审查
├── hooks/
│   ├── hooks-cursor.json
│   ├── hooks.json
│   └── session-start               # Bash
├── scripts/
│   ├── sync-reference-docs.sh
│   ├── validate-plugin.sh
│   └── bump-version.sh
├── tests/
│   ├── opencode/                   # Shell 插件加载测试
│   └── plugin/                     # manifest / skill 校验
├── templates/                      # badsmells/tasks 骨架片段
├── docs/reference/bdr/             # 自 docs/prd/ 同步
├── README.md
├── AGENTS.md
├── CLAUDE.md
└── GEMINI.md
```

### D10：零依赖 Plugin 技术选型

**选择**：Markdown Skill、JSON Plugin 清单、Bash hooks/scripts/tests、最小 ESM `package.json`、OpenCode 内联 JS 插件 — **不** 引入 Python 包、npm 依赖或独立编译步骤。

**理由**：降低维护与安装成本；Plugin 本体保持轻量、可移植。

**备选**：Python CLI 或 Node 分析库 — 拒绝，违反零依赖原则。

### D3：工件路径可配置，默认 `docs/bdr/`

**选择**：Skill 首步检测 `docs/bdr/constitution.md`；若不存在则回退 `docs/prd/`（本仓库开发期）。通过 `BDR_DOCS_ROOT` 环境变量或项目根 `.bdr.yaml` 覆盖。

**理由**：constitution 规定正式路径为 `docs/bdr/`；本仓库当前工件在 `docs/prd/`，需兼容。

### D4：explore 输出状态枚举

| 状态 | 含义 |
|------|------|
| **未清除** | 坏味道仍存在，需 plan/apply |
| **已消除** | 验收标准已满足 |
| **部分残余** | 任务已做但未完全达标（与现有 badsmells.md 索引一致） |

索引表写入 `badsmells.md` §2.0；正文条目保留审计历史。

### D5：plan 任务步骤模板

每个任务 **必须** 包含 constitution §4 映射步骤，checkbox 表示执行状态：

1. 识别 / 确认坏味道条目（explore 已完成则勾选）
2. 确定测试覆盖；无覆盖则 **先写测试**（mock 框架按语言：Python pytest+unittest.mock，Java JUnit+Mockito 等）
3. 运行测试 → 全绿（失败则先修测试）
4. 执行重构（最小 diff，对准 BS-ID）
5. 回归测试 → 全绿
6. **用户确认**（未确认不得标记任务完成）

可选步骤：计算覆盖率（`pytest --cov` / `jacoco` 等），写入 tasks 备注。

### D6：apply 执行粒度

**选择**：每次 `bdr:apply` 默认处理 **一个** 未完成任务（或该任务中下一组未执行步骤）；完成后暂停等待用户确认，再提示继续。

**理由**：对齐 constitution §5 与 tasks.md §1 确认门；避免 Agent 批量重构失控。

**备选**：一次 apply 跑完全部 backlog — 拒绝，违反用户确认门禁。

### D7：bdr-analyze 作为 plan 前置门禁

当 `badsmells.md` 版本或实质性内容变化后，`bdr:plan` **应** 先提示运行 `bdr:analyze`（或 plan skill 内嵌差分逻辑），更新 `analysis.md` 并同步 `tasks.md`，再允许新建任务。

### D8：多 harness 插件清单

各平台 `plugin.json` 统一声明：

```json
{
  "name": "bdr",
  "displayName": "BDR — Bad smell Driven Refactoring",
  "skills": "./skills/",
  "commands": "./commands/"
}
```

Cursor：`/add-plugin bdr` 或 marketplace；Claude：`/plugin install bdr@...`；Codex：`/plugins` 搜索；OpenCode：遵循 `.opencode/INSTALL.md`。

### D9：与其他 Agent Skill 插件共存

BDR **不** 覆盖用户已安装的其他 workflow skill；`bdr-apply` 步骤 ① 补测可 **软引用** 用户环境中的 TDD 类 skill（若存在），但 **不硬依赖** 任何外部插件。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| Agent 跳过测绿直接重构 | Skill 中用 MUST/RED FLAG 清单；apply 前强制运行测试命令并展示输出 |
| 坏味道识别主观、漏报/误报 | 要求每条引用 Fowler 标签 + constitution §3 对齐原则 + 具体文件/符号；用户审阅 explore 产出 |
| 工件路径不一致（prd vs bdr） | D3 检测与 `.bdr.yaml`；README 说明迁移 |
| 多语言项目扫描质量参差 | explore skill 按检测到的语言加载最佳实践附录（Python/Java/TS 分节） |
| Command 命名空间冲突 | 统一 `bdr:` 前缀；plugin name 为 `bdr` |
| 无独立校验器，格式漂移 | 可选后续：JSON Schema 或 openspec verify；首版靠 Skill 自检清单 |

## Migration Plan

1. **Phase 1**：在本仓库实现 Plugin 骨架 + 5 个 Skill + 4 个 Command + README。
2. **Phase 2**：将 `docs/prd/` 复制或 symlink 至 `docs/bdr/`（或更新 constitution 引用），使运行时路径与规范一致。
3. **Phase 3**：在 Cursor 本地 `/add-plugin` 或 path install 验证 explore → plan → apply 全链路。
4. **Phase 4**：补充 Claude/Codex/OpenCode 插件清单与 CI（可选：Skill 链接检查脚本）。
5. **Rollback**：卸载 Plugin 即可；用户仓库内 `docs/bdr/*.md` 保留，无破坏性。

## Open Questions

1. 是否发布独立 GitHub repo（如 `agiledon/bdr`）还是作为本 monorepo 根目录即为 Plugin 包？
2. `bdr:explore` 是否支持增量扫描（仅 diff 变更文件）还是每次全量？
3. 是否在 hooks/sessionStart 自动提示「检测到 docs/bdr/badsmells.md 有未清除条目」？
