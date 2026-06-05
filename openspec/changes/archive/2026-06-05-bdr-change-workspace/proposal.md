## Why

MVP 使用单目录 `docs/prd` 与 Eywa 真实工件，无法按 change 隔离 BDR 迭代；`using-bdr` 与 docs 树增加维护成本。Brainstorming 确认 Big-bang 迁移至 `bdr/changes/` 模型，删除冗余文档树，规约内嵌 Skill，并归档 `bdr-workflow`。

## What Changes

- **BREAKING**：工件路径 → `bdr/changes/<change-name>/`；配置 → **`bdr/config.yaml` only**
- **删除**：`.bdr.yaml`、`docs/prd/`、`docs/reference/bdr/`、`using-bdr`、sync-reference-docs.sh
- **F1**：constitution/specification 内嵌五份 Skill，无独立规约文件
- **D3**：explore 有 active change 时询问继续/新建
- **新增** `bdr:archive`；跨 change 去重
- **归档** `bdr-workflow`（跳过 10.6；v1.1 → Phase 2）

## Capabilities

### New Capabilities

- `bdr-archive-change`: 完成度检查、用户确认、归档至 `bdr/changes/archive/`

### Modified Capabilities

- `bdr-core`: `bdr/config.yaml`、移除 docs_root/using-bdr/docs 树
- `bdr-explore-to-change`: change 模型、D3、去重
- `bdr-analyze-change` / `bdr-plan-change` / `bdr-apply-change`: change 作用域
- `bdr-core` spec: 移除 bundle fallback requirement → Skill-embedded rules

## Impact

见 [`docs/design/2026-06-05-bdr-change-workspace-design.md`](../../../docs/design/2026-06-05-bdr-change-workspace-design.md)

## Delivery

**方案 1 Big-bang** — 单次实现全部 tasks，不做双轨兼容。
