## MODIFIED Requirements

### Requirement: bdr-apply executes uncleared tasks per constitution

The `bdr-apply` skill and `bdr:apply` command SHALL read `bdr/changes/<current-change>/tasks.md`, select the next task marked **未执行**, and execute it following constitution §4 and §5.

#### Scenario: Apply within current change

- **WHEN** the user runs `bdr:apply` and `bdr/config.yaml` specifies `current_change: refactor-utils`
- **THEN** apply SHALL read tasks from `bdr/changes/refactor-utils/tasks.md`
- **AND** SHALL update badsmells and tasks only within that change directory

### Requirement: apply updates artifact state after verified work

After confirmed task completion, apply SHALL update the current change `tasks.md` checkboxes and, when DoD is met, update the corresponding entry in the current change `badsmells.md` §2.0 index.
