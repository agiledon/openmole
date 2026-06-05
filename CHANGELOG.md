# Changelog

## 0.3.0 — 2026-06-05

- 新增 `bdr init` CLI：交互式 IDE 多选、workspace bootstrap
- Phase A adapter：Cursor（用户级 symlink）、OpenCode（项目级 `opencode.json`）
- Claude/Codex/Gemini CLI：warn-and-skip（Phase B）
- `bdr/config.yaml` 增加 `installed_ides`、`init_version`、`init_at`

## 0.2.0 — 2026-06-05

- **BREAKING**：工作区迁移至 `bdr/changes/<change-name>/`；仅 `bdr/config.yaml`
- 删除 `using-bdr`；规约内嵌五 Skill；新增 `bdr:archive`
- 删除 `docs/prd/`、`docs/reference/bdr/`、`.bdr.yaml`

## 0.1.0 — 2026-06-05

- 初版 MVP：Cursor + OpenCode 插件，5 个 Skill，4 个 Command。
