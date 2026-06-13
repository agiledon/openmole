# Changelog

## 0.3.0 — 2026-06-05

- 新增 `openmole init` CLI：交互式 IDE 多选、workspace bootstrap
- Phase A adapter：Cursor（用户级 symlink）、OpenCode（项目级 `opencode.json`）
- Claude/Codex/Gemini CLI：warn-and-skip（Phase B）
- `openmole/config.yaml` 增加 `installed_ides`、`init_version`、`init_at`

## 0.2.0 — 2026-06-05

- **BREAKING**：工作区迁移至 `openmole/changes/<change-name>/`；仅 `openmole/config.yaml`
- 删除 `using-openmole`；规约内嵌五 Skill；新增 `mole:archive`
- 删除 `docs/prd/`、`docs/reference/openmole/`、`.openmole.yaml`

## 0.1.0 — 2026-06-05

- 初版 MVP：Cursor + OpenCode 插件，5 个 Skill，4 个 Command。
