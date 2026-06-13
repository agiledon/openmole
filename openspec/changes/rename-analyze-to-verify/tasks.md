## 1. Spec & Skill Rename

- [x] 1.1 Rename `openspec/specs/bdr-analyze-change/` to `openspec/specs/bdr-verify/` and update spec content with new skill/command names and workflow position
- [x] 1.2 Rename `skills/bdr-analyze-change/` directory to `skills/bdr-verify-change/`, update `SKILL.md` frontmatter (`name: bdr-verify-change`) and all references from `bdr-analyze` to `bdr-verify`
- [x] 1.3 Rename `commands/bdr-analyze.md` to `commands/bdr-verify.md`, update frontmatter and skill reference from `bdr-analyze-change` to `bdr-verify-change`

## 2. Update Workflow Order in Core Specs & Config

- [x] 2.1 Update `openspec/specs/bdr-core/spec.md`: replace all `bdr-analyze-change` → `bdr-verify-change`, `/bdr-analyze` → `/bdr-verify`, `bdr:analyze` → `bdr:verify`, update workflow order
- [x] 2.2 Update `openspec/specs/bdr-plan-change/spec.md`: replace `bdr:analyze` with `bdr:verify`, update analyze gate to verify gate
- [x] 2.3 Update `openspec/specs/bdr-cli/spec.md`: replace `bdr-analyze-change` with `bdr-verify-change`
- [x] 2.4 Update `openspec/specs/bdr-cli-welcome/spec.md`: replace `/bdr-analyze` with `/bdr-verify`
- [x] 2.5 Update `cli/lib/bdr-phases.js`: rename command and skill entries
- [x] 2.6 Update `cli/prompts/welcome.js`: rename `/bdr-analyze` to `/bdr-verify` with updated description

## 3. Add Next-Step Recommendations to Phase Skills

- [x] 3.1 Update `skills/bdr-explore-to-change/SKILL.md`: add recommendation to run `bdr:plan` after completion
- [x] 3.2 Update `skills/bdr-plan-change/SKILL.md`: replace `bdr:analyze` gate reference with `bdr:verify`, add recommendation to run `bdr:verify` after completion
- [x] 3.3 Update `skills/bdr-apply-change/SKILL.md`: add recommendation to run `bdr:archive` when all tasks done, or `bdr:apply` again if more tasks remain
- [x] 3.4 Update `skills/bdr-archive-change/SKILL.md`: add recommendation to start a new change with `bdr:explore` after archiving

## 4. Update Plugin Manifests

- [x] 4.1 Update `.cursor-plugin/plugin.json`: replace `bdr-analyze-change` → `bdr-verify-change`, `/bdr-analyze` → `/bdr-verify`
- [x] 4.2 Update `.claude-plugin/plugin.json`: same replacements
- [x] 4.3 Update `.codex-plugin/plugin.json`: same replacements
- [x] 4.4 Update `gemini-extension.json`: same replacements
- [x] 4.5 Update `.opencode/plugins/bdr.js`: replace `/bdr-analyze` with `/bdr-verify` in bootstrap message

## 5. Update README & Documentation

- [x] 5.1 Update `README.md` English section: commands table, workflow order, workspace file listing, main outputs
- [x] 5.2 Update `README.md` Chinese section: commands table, workflow order, workspace file listing, main outputs
- [x] 5.3 Update `templates/analysis-header.md`: replace `bdr:analyze` with `bdr:verify`
- [x] 5.4 Update `docs/design/2026-06-05-bdr-change-workspace-design.md`: replace `bdr:analyze` with `bdr:verify`

## 6. Update Tests

- [x] 6.1 Update `tests/opencode/test-plugin-commands.sh`: replace `bdr-analyze` with `bdr-verify` in expected array
- [x] 6.2 Update `tests/plugin/test-workspace-skills.sh`: replace `bdr-analyze-change` with `bdr-verify-change`

## 7. Verification

- [x] 7.1 Run `rg bdr-analyze` to verify no stale references remain in source files (excluding archive/ and design/proposal docs that are historical)
- [x] 7.2 Run `bash scripts/validate-plugin.sh` to verify plugin integrity
- [x] 7.3 Run `bash scripts/validate-cli.sh` to verify full CLI + plugin tests
