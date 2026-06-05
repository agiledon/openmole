## Context

BDR Plugin MVP（`bdr-workflow`）已实现 Cursor + OpenCode；brainstorming（2026-06-05）确认：**优先 `bdr-change-workspace` Big-bang 实现**，归档 `bdr-workflow` MVP，v1.1 迁入 Phase 2。

完整整合设计见 [`docs/design/2026-06-05-bdr-change-workspace-design.md`](../../../docs/design/2026-06-05-bdr-change-workspace-design.md)。

## Goals / Non-Goals

**Goals:**

- `{project}/bdr/changes/<change-name>/` 工件隔离；`bdr/config.yaml` 唯一配置
- 安装零复制；规约 **F1** 内嵌于五份 Skill
- explore **D3** 交互；跨 change 去重；`bdr:archive`
- 删除 `docs/prd/`、`docs/reference/bdr/`、`.bdr.yaml`、`using-bdr`

**Non-Goals:**

- Phase 1 不做 v1.1 多 harness / hooks / code-reviewer
- 不保留 `{docs_root}` / docs/prd 运行时回退
- 不实现 `bdr/constitution.md` 本地覆盖

## Decisions

### D1：安装不复制；删除 docs 树

无目标项目文件即可运行；constitution/spec 在 Skill 内。**删除** `docs/prd/`、`docs/reference/bdr/`。

### D2：工作区布局

见整合设计 §2。

### D3：仅 `bdr/config.yaml`（C1）

移除 `.bdr.yaml`。

### D4：explore D3 交互

有 active change 时询问继续/新建；同 change 内允许多次 explore 升版。

### D5：F1 规约内嵌

五 Skill 各含相同「BDR 规约摘要」节。

### D6：移除 using-bdr

bootstrap 短文本；RED FLAGS 在各 Skill。

### D7：跨 change 去重 + archive

见整合设计 §4.2、§4.3。

## Risks / Trade-offs

见整合设计 §8。

## Migration Plan

1. Big-bang 实现本 change tasks
2. 归档 `bdr-workflow`（跳过 10.6）
3. sync delta specs → `openspec/specs/`
4. 验收 7.5（Cursor + OpenCode 新模型）

## Phase 2 backlog（原 v1.1）

Claude/Codex/Gemini 清单、hooks、code-reviewer、version-bump、AGENTS/CLAUDE/GEMINI.md。
