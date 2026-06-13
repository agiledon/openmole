# openmole-plan

Create tasks from uncleared bad smells in the current change.

## Requirements

### Requirement: openmole-plan creates tasks from uncleared bad smells

The `openmole-plan` skill SHALL read `openmole/changes/<current-change>/badsmells.md` and produce or update `tasks.md` with tasks traceable to BS-IDs.

#### Scenario: Plan from current change backlog

- **WHEN** `openmole/changes/refactor-utils/badsmells.md` contains BS-CLARITY-001 with status **未清除**
- **THEN** `openmole/changes/refactor-utils/tasks.md` SHALL include at least one task referencing `BS-CLARITY-001`

### Requirement: Each task includes constitution standard steps with execution status

Each task SHALL map to constitution §4 six steps with checkbox status trackable by `mole:apply`.

### Requirement: plan enforces verify gate after badsmells changes

When badsmells version is newer than tasks header reference within the same change, plan SHALL require `mole:verify` first.

### Requirement: plan updates tasks revision history

When `tasks.md` revision history gains a row, plan SHALL follow specification §7 **提交版本** rules.
