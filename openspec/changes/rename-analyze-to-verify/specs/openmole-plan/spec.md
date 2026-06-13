## MODIFIED Requirements

### Requirement: openmole-plan creates tasks from uncleared bad smells

The `openmole-plan` skill SHALL read `openmole/changes/<current-change>/badsmells.md` and produce or update `tasks.md` with tasks traceable to BS-IDs. After completion, the skill SHALL recommend the user continue with `mole:verify`.

#### Scenario: Plan from current change backlog

- **WHEN** `openmole/changes/refactor-utils/badsmells.md` contains BS-CLARITY-001 with status **未清除**
- **THEN** `openmole/changes/refactor-utils/tasks.md` SHALL include at least one task referencing `BS-CLARITY-001`

#### Scenario: Post-plan recommendation

- **WHEN** `mole:plan` completes successfully
- **THEN** the agent SHALL display: "Planning complete. Run `/mole-verify` or `mole:verify` to verify badsmells coverage before applying."

### Requirement: plan enforces verify gate after badsmells changes

When badsmells version is newer than tasks header reference within the same change, plan SHALL require `mole:verify` first.

#### Scenario: Stale tasks require verification

- **WHEN** `badsmells.md` has been updated since the last `tasks.md` regeneration
- **THEN** plan SHALL recommend running `mole:verify` to check coverage before regenerating tasks
