## Why

The current BDR workflow places analysis (bdr-analyze) immediately after exploration, which is semantically wrong — the user should plan refactoring tasks before diffing/verifying. The name "analyze" also understates the phase's purpose of verifying that badsmells coverage is complete. Additionally, after each phase there is no structured recommendation for what to do next, leaving users to guess the workflow order.

## What Changes

- **BREAKING**: Rename command `/bdr-analyze` to `/bdr-verify` and protocol `bdr:analyze` to `bdr:verify`
- **BREAKING**: Rename skill `bdr-analyze-change` to `bdr-verify-change` (skill file, spec, and all references)
- Reorder the BDR workflow: `bdr-explore` → `bdr-plan` → `bdr-verify` → `bdr-apply` → `bdr-archive`
- Update README.md with the new command/skill names and workflow order (both English and Chinese sections)
- Each skill SHALL recommend the next step in the workflow after completion (e.g., `bdr-explore` suggests `bdr-plan`, etc.)
- Update all manifest files, plugin configs, commands directory, and CLI adapters to reference `bdr-verify` instead of `bdr-analyze`

## Capabilities

### New Capabilities

- `bdr-verify`: Replaces `bdr-analyze-change` — diffs badsmells against tasks and records output in `analysis.md`, now positioned after planning in the workflow

### Modified Capabilities

- `bdr-core`: Workflow order changes from `explore → analyze → plan → apply → archive` to `explore → plan → verify → apply → archive`; all references to `bdr-analyze-change` skill and `/bdr-analyze` command are replaced with `bdr-verify-change` and `/bdr-verify`
- `bdr-explore-to-change`: Must recommend next step as `bdr-plan` instead of `bdr-analyze`
- `bdr-plan-change`: Must recommend next step as `bdr-verify` instead of directly applying
- `bdr-apply-change`: Must recommend next step as `bdr-archive` (no change needed, but verify recommendation exists)

## Impact

- Skills directory: rename `skills/bdr-analyze-change/` → `skills/bdr-verify-change/`, update SKILL.md content
- Commands directory: rename `commands/bdr-analyze.md` → `commands/bdr-verify.md`, update content
- Plugin manifests: `.cursor-plugin/plugin.json`, `gemini-extension.json`, `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json` → update skill/command references
- OpenCode plugin: `.opencode/plugins/bdr.js` → update bootstrap message references
- CLI adapters: `cli/` → update IDE adapter references
- Main spec: `openspec/specs/bdr-core/spec.md` → update workflow order and skill names
- README.md: update command table, workflow, and workspace sections (English + Chinese)
- All phase skills: add "next step" recommendation to each SKILL.md
- Spec rename: `openspec/specs/bdr-analyze-change/` → `openspec/specs/bdr-verify/`
