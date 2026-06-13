## MODIFIED Requirements

### Requirement: openmole-explore scans source and produces badsmells.md

The `openmole-explore` skill and `mole:explore` command SHALL scan a user-specified directory, identify bad smells aligned with constitution §3 and specification §4, and write output to `openmole/changes/<change-name>/badsmells.md`. After completion, the skill SHALL recommend the user continue with `mole:plan`.

#### Scenario: Full project scan with explicit change name

- **WHEN** the user runs `mole:explore . refactor-utils`
- **THEN** the agent SHALL create `openmole/changes/refactor-utils/`
- **AND** SHALL write `badsmells.md` under that directory

#### Scenario: Active change continuation prompt

- **WHEN** `openmole/config.yaml` has an active `current_change` and the user runs `mole:explore` without a new change name
- **THEN** the agent SHALL ask whether to continue the current change or create a new one

#### Scenario: Scoped directory scan

- **WHEN** the user runs `mole:explore src/foo my-change`
- **THEN** the agent SHALL limit analysis to `src/foo`
- **AND** SHALL write findings to `openmole/changes/my-change/badsmells.md`

#### Scenario: Post-explore recommendation

- **WHEN** `mole:explore` completes successfully
- **THEN** the agent SHALL display: "Exploration complete. Run `/mole-plan` or `mole:plan` to plan refactoring tasks."
