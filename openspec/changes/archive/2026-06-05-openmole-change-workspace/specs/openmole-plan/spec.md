## MODIFIED Requirements

### Requirement: openmole-plan creates tasks from uncleared bad smells

The `openmole-plan` skill and `mole:plan` command SHALL read `openmole/changes/<current-change>/badsmells.md`, select entries with status **未清除** or **部分残余**, and produce or update `openmole/changes/<current-change>/tasks.md`.

#### Scenario: Plan from current change backlog

- **WHEN** `openmole/changes/refactor-utils/badsmells.md` contains BS-CLARITY-001 with status **未清除**
- **THEN** `openmole/changes/refactor-utils/tasks.md` SHALL include at least one task referencing `BS-CLARITY-001`

### Requirement: plan enforces analyze gate after badsmells changes

When the current change `badsmells.md` version or substantive content has changed since the last `tasks.md` sync, `mole:plan` SHALL require running `mole:verify` first before adding new tasks within that change directory.

#### Scenario: Stale tasks after badsmells update in same change

- **WHEN** the current change `badsmells.md` version is newer than referenced in the same change `tasks.md` header
- **THEN** plan SHALL NOT proceed until analyze diff is completed for that change
