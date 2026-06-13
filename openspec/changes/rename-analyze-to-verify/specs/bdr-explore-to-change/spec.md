## MODIFIED Requirements

### Requirement: bdr-explore-to-change scans source and produces badsmells.md

The `bdr-explore-to-change` skill and `bdr:explore` command SHALL scan a user-specified directory, identify bad smells aligned with constitution §3 and specification §4, and write output to `bdr/changes/<change-name>/badsmells.md`. After completion, the skill SHALL recommend the user continue with `bdr:plan`.

#### Scenario: Full project scan with explicit change name

- **WHEN** the user runs `bdr:explore . refactor-utils`
- **THEN** the agent SHALL create `bdr/changes/refactor-utils/`
- **AND** SHALL write `badsmells.md` under that directory

#### Scenario: Active change continuation prompt

- **WHEN** `bdr/config.yaml` has an active `current_change` and the user runs `bdr:explore` without a new change name
- **THEN** the agent SHALL ask whether to continue the current change or create a new one

#### Scenario: Scoped directory scan

- **WHEN** the user runs `bdr:explore src/foo my-change`
- **THEN** the agent SHALL limit analysis to `src/foo`
- **AND** SHALL write findings to `bdr/changes/my-change/badsmells.md`

#### Scenario: Post-explore recommendation

- **WHEN** `bdr:explore` completes successfully
- **THEN** the agent SHALL display: "Exploration complete. Run `/bdr-plan` or `bdr:plan` to plan refactoring tasks."
