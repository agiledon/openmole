# bdr-apply

重构执行 Skill + `bdr:apply` 命令。

## Requirements

### Requirement: bdr-apply executes uncleared tasks per constitution

The `bdr-apply` skill and `bdr:apply` command SHALL read `{docs_root}/tasks.md`, select the next task or step marked **未执行**, and execute it following constitution §4 and §5 without skipping test-green-refactor-verify loop.

#### Scenario: Execute next pending task

- **WHEN** `tasks.md` has task B-T05 with status unchecked and prior dependencies completed
- **THEN** apply SHALL execute B-T05 steps in order
- **AND** SHALL run the project's test command and show results before marking refactor steps complete

#### Scenario: Block on failing tests

- **WHEN** tests fail before or after refactor
- **THEN** apply SHALL NOT mark refactor steps as **已执行**
- **AND** SHALL fix tests or code until green per constitution §4 step 3

### Requirement: apply processes one task per invocation by default

Each `bdr:apply` invocation SHALL complete at most one task (or one logical step group within a task) and SHALL pause for user confirmation before suggesting the next apply, aligning with constitution §4 step 5 and tasks.md confirmation gate.

#### Scenario: Task completion requires user confirmation

- **WHEN** all automated steps of a task pass including regression tests
- **THEN** apply SHALL prompt the maintainer for confirmation
- **AND** SHALL NOT check the task complete or proceed to the next task until confirmation is received

#### Scenario: User rejects completion

- **WHEN** the user declines confirmation after a task
- **THEN** the task SHALL remain **未执行** or partially executed per user direction
- **AND** apply SHALL stop without starting subsequent tasks

### Requirement: apply updates artifact state after verified work

After confirmed task completion, apply SHALL update `tasks.md` checkboxes to **已执行**, and when DoD for a bad smell is met, SHALL update the corresponding entry in `badsmells.md` §2.0 index to **已消除** or **部分残余** as appropriate.

#### Scenario: Smell fully eliminated

- **WHEN** task B-T04 DoD is met and user confirms
- **THEN** `tasks.md` SHALL mark B-T04 complete
- **AND** `badsmells.md` index SHALL update BS-CLARITY-002 to **已消除**

### Requirement: apply respects SDD linkage

When a task or badsmells entry is marked SDD-linked, apply SHALL NOT change production code until SDD specification/design updates are confirmed complete.

#### Scenario: SDD-linked task blocked

- **WHEN** task first sub-step requires SDD revision per badsmells `[SDD]` marker
- **THEN** apply SHALL verify SDD artifacts are updated before executing refactor steps
- **AND** SHALL halt with explicit message if SDD work is incomplete
