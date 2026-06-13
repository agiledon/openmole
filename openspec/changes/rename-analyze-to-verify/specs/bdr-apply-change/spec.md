## MODIFIED Requirements

### Requirement: bdr-apply-change executes uncleared tasks per constitution

The `bdr-apply-change` skill SHALL read `bdr/changes/<current-change>/tasks.md` and execute the next unchecked task following constitution §4 and §5. After completing a task or finishing all tasks in a change, the skill SHALL recommend the next workflow step.

#### Scenario: Apply within current change

- **WHEN** the user runs `bdr:apply` with `current_change: refactor-utils`
- **THEN** apply SHALL read tasks from `bdr/changes/refactor-utils/tasks.md`

#### Scenario: Post-apply recommendation when tasks remain

- **WHEN** `bdr:apply` completes a task but more unchecked tasks remain
- **THEN** the agent SHALL recommend running `bdr:apply` again for the next task

#### Scenario: Post-apply recommendation when all tasks done

- **WHEN** `bdr:apply` completes the last unchecked task in the change
- **THEN** the agent SHALL display: "All tasks complete. Run `/bdr-archive` or `bdr:archive` to archive this change."
