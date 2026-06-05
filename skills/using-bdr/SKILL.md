---
name: using-bdr
description: 在任何 BDR 工作流之前使用 — 路由 explore/analyze/plan/apply 并解析 docs root
---

# Using BDR

## 何时使用

当用户提及 BDR、坏味道、重构工作流或任何 `bdr:*` 命令时，必须先加载本 Skill。

## Docs Root 解析顺序

1. 项目 `.bdr.yaml` → `docs_root`
2. 环境变量 `BDR_DOCS_ROOT`
3. `{project}/docs/bdr/constitution.md`
4. `{project}/docs/prd/constitution.md`（开发回退）
5. 若均不存在：提示从插件 `docs/reference/bdr/` 复制初始化

## 工作流路由

| 用户意图 | 应加载 Skill |
|----------|-------------|
| 扫描 / 识别坏味道 | `bdr-explore` |
| badsmells 变更，同步 tasks | `bdr-analyze` |
| 创建/更新任务 | `bdr-plan` |
| 执行重构 | `bdr-apply` |
| 模糊的「重构一下」 | 检查工件状态：无 badsmells → explore；tasks 过期 → analyze；有开放任务 → apply |

## 标准顺序

explore →（用户审阅）→ analyze（badsmells 变更时）→ plan →（用户审阅）→ apply →（每任务用户确认）

## RED FLAGS — 立即停止

- 跳过测绿直接重构（constitution §4）
- 未经用户确认将 tasks 标记为 `[x]`
- badsmells 版本高于 tasks 依据版本时仍 plan/apply（须先 analyze）
- tasks 无法追溯到 badsmells.md 中的 BS-ID
- `[SDD]` 标记项未获 SDD 批准即改生产代码
- 无代码证据凭空编造坏味道

## 权威链

constitution.md > specification.md > badsmells.md > tasks.md / analysis.md
