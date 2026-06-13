## MODIFIED Requirements

### Requirement: bdr-plan-change creates tasks from uncleared bad smells

The `bdr-plan-change` skill SHALL read `bdr/changes/<current-change>/badsmells.md` and produce or update `tasks.md` with tasks traceable to BS-IDs. After completion, the skill SHALL recommend the user continue with `bdr:verify`.

#### Scenario: Plan from current change backlog

- **WHEN** `bdr/changes/refactor-utils/badsmells.md` contains BS-CLARITY-001 with status **未清除**
- **THEN** `bdr/changes/refactor-utils/tasks.md` SHALL include at least one task referencing `BS-CLARITY-001`

#### Scenario: Post-plan recommendation

- **WHEN** `bdr:plan` completes successfully
- **THEN** the agent SHALL display: "Planning complete. Run `/bdr-verify` or `bdr:verify` to verify badsmells coverage before applying."

### Requirement: plan enforces verify gate after badsmells changes

When badsmells version is newer than tasks header reference within the same change, plan SHALL require `bdr:verify` first.

#### Scenario: Stale tasks require verification

- **WHEN** `badsmells.md` has been updated since the last `tasks.md` regeneration
- **THEN** plan SHALL recommend running `bdr:verify` to check coverage before regenerating tasks
