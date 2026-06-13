## Why

The current OpenMole workflow places analysis (mole-verify) immediately after exploration, which is semantically wrong — the user should plan refactoring tasks before diffing/verifying. The name "analyze" also understates the phase's purpose of verifying that badsmells coverage is complete. Additionally, after each phase there is no structured recommendation for what to do next, leaving users to guess the workflow order.

## What Changes

- **BREAKING**: Rename command `/mole-verify` to `/mole-verify` and protocol `mole:verify` to `mole:verify`
- **BREAKING**: Rename skill `openmole-verify` to `openmole-verify` (skill file, spec, and all references)
- Reorder the OpenMole workflow: `mole-explore` → `mole-plan` → `mole-verify` → `mole-apply` → `mole-archive`
- Update README.md with the new command/skill names and workflow order (both English and Chinese sections)
- Each skill SHALL recommend the next step in the workflow after completion (e.g., `mole-explore` suggests `mole-plan`, etc.)
- Update all manifest files, plugin configs, commands directory, and CLI adapters to reference `mole-verify` instead of `mole-verify`

## Capabilities

### New Capabilities

- `mole-verify`: Replaces `openmole-verify` — diffs badsmells against tasks and records output in `analysis.md`, now positioned after planning in the workflow

### Modified Capabilities

- `openmole-core`: Workflow order changes from `explore → analyze → plan → apply → archive` to `explore → plan → verify → apply → archive`; all references to `openmole-verify` skill and `/mole-verify` command are replaced with `openmole-verify` and `/mole-verify`
- `openmole-explore`: Must recommend next step as `mole-plan` instead of `mole-verify`
- `openmole-plan`: Must recommend next step as `mole-verify` instead of directly applying
- `openmole-apply`: Must recommend next step as `mole-archive` (no change needed, but verify recommendation exists)

## Impact

- Skills directory: rename `skills/openmole-verify/` → `skills/openmole-verify/`, update SKILL.md content
- Commands directory: rename `commands/mole-verify.md` → `commands/mole-verify.md`, update content
- Plugin manifests: `.cursor-plugin/plugin.json`, `gemini-extension.json`, `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json` → update skill/command references
- OpenCode plugin: `.opencode/plugins/openmole.js` → update bootstrap message references
- CLI adapters: `cli/` → update IDE adapter references
- Main spec: `openspec/specs/openmole-core/spec.md` → update workflow order and skill names
- README.md: update command table, workflow, and workspace sections (English + Chinese)
- All phase skills: add "next step" recommendation to each SKILL.md
- Spec rename: `openspec/specs/openmole-verify/` → `openspec/specs/mole-verify/`
