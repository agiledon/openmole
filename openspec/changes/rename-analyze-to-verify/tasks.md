## 1. Spec & Skill Rename

- [x] 1.1 Rename `openspec/specs/openmole-verify/` to `openspec/specs/mole-verify/` and update spec content with new skill/command names and workflow position
- [x] 1.2 Rename `skills/openmole-verify/` directory to `skills/openmole-verify/`, update `SKILL.md` frontmatter (`name: openmole-verify`) and all references from `mole-verify` to `mole-verify`
- [x] 1.3 Rename `commands/mole-verify.md` to `commands/mole-verify.md`, update frontmatter and skill reference from `openmole-verify` to `openmole-verify`

## 2. Update Workflow Order in Core Specs & Config

- [x] 2.1 Update `openspec/specs/openmole-core/spec.md`: replace all `openmole-verify` → `openmole-verify`, `/mole-verify` → `/mole-verify`, `mole:verify` → `mole:verify`, update workflow order
- [x] 2.2 Update `openspec/specs/openmole-plan/spec.md`: replace `mole:verify` with `mole:verify`, update analyze gate to verify gate
- [x] 2.3 Update `openspec/specs/openmole-cli/spec.md`: replace `openmole-verify` with `openmole-verify`
- [x] 2.4 Update `openspec/specs/openmole-cli-welcome/spec.md`: replace `/mole-verify` with `/mole-verify`
- [x] 2.5 Update `cli/lib/openmole-phases.js`: rename command and skill entries
- [x] 2.6 Update `cli/prompts/welcome.js`: rename `/mole-verify` to `/mole-verify` with updated description

## 3. Add Next-Step Recommendations to Phase Skills

- [x] 3.1 Update `skills/openmole-explore/SKILL.md`: add recommendation to run `mole:plan` after completion
- [x] 3.2 Update `skills/openmole-plan/SKILL.md`: replace `mole:verify` gate reference with `mole:verify`, add recommendation to run `mole:verify` after completion
- [x] 3.3 Update `skills/openmole-apply/SKILL.md`: add recommendation to run `mole:archive` when all tasks done, or `mole:apply` again if more tasks remain
- [x] 3.4 Update `skills/openmole-archive/SKILL.md`: add recommendation to start a new change with `mole:explore` after archiving

## 4. Update Plugin Manifests

- [x] 4.1 Update `.cursor-plugin/plugin.json`: replace `openmole-verify` → `openmole-verify`, `/mole-verify` → `/mole-verify`
- [x] 4.2 Update `.claude-plugin/plugin.json`: same replacements
- [x] 4.3 Update `.codex-plugin/plugin.json`: same replacements
- [x] 4.4 Update `gemini-extension.json`: same replacements
- [x] 4.5 Update `.opencode/plugins/openmole.js`: replace `/mole-verify` with `/mole-verify` in bootstrap message

## 5. Update README & Documentation

- [x] 5.1 Update `README.md` English section: commands table, workflow order, workspace file listing, main outputs
- [x] 5.2 Update `README.md` Chinese section: commands table, workflow order, workspace file listing, main outputs
- [x] 5.3 Update `templates/analysis-header.md`: replace `mole:verify` with `mole:verify`
- [x] 5.4 Update `docs/design/2026-06-05-openmole-change-workspace-design.md`: replace `mole:verify` with `mole:verify`

## 6. Update Tests

- [x] 6.1 Update `tests/opencode/test-plugin-commands.sh`: replace `mole-verify` with `mole-verify` in expected array
- [x] 6.2 Update `tests/plugin/test-workspace-skills.sh`: replace `openmole-verify` with `openmole-verify`

## 7. Verification

- [x] 7.1 Run `rg mole-verify` to verify no stale references remain in source files (excluding archive/ and design/proposal docs that are historical)
- [x] 7.2 Run `bash scripts/validate-plugin.sh` to verify plugin integrity
- [x] 7.3 Run `bash scripts/validate-cli.sh` to verify full CLI + plugin tests
