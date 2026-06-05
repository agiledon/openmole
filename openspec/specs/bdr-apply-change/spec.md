# bdr-apply-change

Execute uncleared tasks in the current change per constitution.

## Requirements

### Requirement: bdr-apply-change executes uncleared tasks per constitution

The `bdr-apply-change` skill SHALL read `bdr/changes/<current-change>/tasks.md` and execute the next unchecked task following constitution §4 and §5.

#### Scenario: Apply within current change

- **WHEN** the user runs `bdr:apply` with `current_change: refactor-utils`
- **THEN** apply SHALL read tasks from `bdr/changes/refactor-utils/tasks.md`

### Requirement: apply processes one task per invocation by default

Each invocation SHALL complete at most one task and pause for user confirmation.

### Requirement: apply updates artifact state after verified work

After confirmed completion, apply SHALL update `tasks.md` and `badsmells.md` §2.0 in the current change directory.

### Requirement: apply respects SDD linkage

When a task or entry is SDD-linked, apply SHALL NOT change production code until SDD artifacts are confirmed complete.
