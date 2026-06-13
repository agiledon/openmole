## ADDED Requirements

### Requirement: bdr-verify diffs badsmells against tasks in the current change

The `bdr-verify-change` skill and `bdr:verify` command SHALL compare `bdr/changes/<current-change>/badsmells.md` against `tasks.md` and record output in `analysis.md`, positioned after planning in the workflow.

#### Scenario: Verify within current change

- **WHEN** the user runs `bdr:verify` with `current_change: refactor-utils`
- **THEN** the agent SHALL read and update files only under `bdr/changes/refactor-utils/`

#### Scenario: New bad smell without task

- **WHEN** verify finds an uncleared BS-ID with no matching task
- **THEN** verify SHALL report a coverage gap and recommend updating `tasks.md`

### Requirement: verify triggers tasks.md update before apply

When inconsistency is detected, the agent SHALL update documentation before further refactoring implementation.

#### Scenario: Coverage gap detected

- **WHEN** verify finds badsmells not covered by tasks
- **THEN** the agent SHALL recommend running `bdr:plan` to regenerate `tasks.md`

### Requirement: verify maintains revision history commit SHA

When `analysis.md` revision history gains a row, verify SHALL follow specification §7 **提交版本** rules.

#### Scenario: Revision history tracking

- **WHEN** verify produces a new analysis result
- **THEN** `analysis.md` revision history SHALL include the current git commit SHA

### Requirement: verify recommends next workflow step

After completing verification, the `bdr-verify-change` skill SHALL recommend the user run `bdr:apply` to start implementing refactoring tasks.

#### Scenario: Post-verify recommendation

- **WHEN** verify completes successfully with full coverage
- **THEN** the agent SHALL display: "Verification complete. Run `/bdr-apply` or `bdr:apply` to start executing tasks."
