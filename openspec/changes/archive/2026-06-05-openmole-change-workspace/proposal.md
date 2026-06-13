## Why

MVP 使用单目录 `docs/prd` 与 Eywa 真实工件，无法按 change 隔离 OpenMole 迭代；`using-openmole` 与 docs 树增加维护成本。Brainstorming 确认 Big-bang 迁移至 `openmole/changes/` 模型，删除冗余文档树，规约内嵌 Skill，并归档 `openmole-workflow`。

## What Changes

- **BREAKING**：工件路径 → `openmole/changes/<change-name>/`；配置 → **`openmole/config.yaml` only**
- **删除**：`.openmole.yaml`、`docs/prd/`、`docs/reference/openmole/`、`using-openmole`、sync-reference-docs.sh
- **F1**：constitution/specification 内嵌五份 Skill，无独立规约文件
- **D3**：explore 有 active change 时询问继续/新建
- **新增** `mole:archive`；跨 change 去重
- **归档** `openmole-workflow`（跳过 10.6；v1.1 → Phase 2）

## Capabilities

### New Capabilities

- `openmole-archive`: 完成度检查、用户确认、归档至 `openmole/changes/archive/`

### Modified Capabilities

- `openmole-core`: `openmole/config.yaml`、移除 docs_root/using-openmole/docs 树
- `openmole-explore`: change 模型、D3、去重
- `openmole-verify` / `openmole-plan` / `openmole-apply`: change 作用域
- `openmole-core` spec: 移除 bundle fallback requirement → Skill-embedded rules

## Impact

见 [`docs/design/2026-06-05-openmole-change-workspace-design.md`](../../../docs/design/2026-06-05-openmole-change-workspace-design.md)

## Delivery

**方案 1 Big-bang** — 单次实现全部 tasks，不做双轨兼容。
