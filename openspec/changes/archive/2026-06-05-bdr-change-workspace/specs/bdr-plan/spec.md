## MODIFIED Requirements

### Requirement: bdr-plan-change creates tasks from uncleared bad smells

The `bdr-plan-change` skill and `bdr:plan` command SHALL read `bdr/changes/<current-change>/badsmells.md`, select entries with status **未清除** or **部分残余**, and produce or update `bdr/changes/<current-change>/tasks.md`.

#### Scenario: Plan from current change backlog

- **WHEN** `bdr/changes/refactor-utils/badsmells.md` contains BS-CLARITY-001 with status **未清除**
- **THEN** `bdr/changes/refactor-utils/tasks.md` SHALL include at least one task referencing `BS-CLARITY-001`

### Requirement: plan enforces analyze gate after badsmells changes

When the current change `badsmells.md` version or substantive content has changed since the last `tasks.md` sync, `bdr:plan` SHALL require running `bdr:analyze` first before adding new tasks within that change directory.

#### Scenario: Stale tasks after badsmells update in same change

- **WHEN** the current change `badsmells.md` version is newer than referenced in the same change `tasks.md` header
- **THEN** plan SHALL NOT proceed until analyze diff is completed for that change
