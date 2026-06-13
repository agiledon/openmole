# bdr-verify-change

Diff badsmells against tasks within the current change, positioned after planning in the workflow.

## Requirements

### Requirement: bdr-verify-change diffs badsmells against tasks

The `bdr-verify-change` skill and `bdr:verify` command SHALL compare `bdr/changes/<current-change>/badsmells.md` against `tasks.md` and record output in `analysis.md`.

#### Scenario: Verify within current change

- **WHEN** the user runs `bdr:verify` with `current_change: refactor-utils`
- **THEN** the agent SHALL read and update files only under `bdr/changes/refactor-utils/`

#### Scenario: New bad smell without task

- **WHEN** verify finds an uncleared BS-ID with no matching task
- **THEN** verification SHALL report a coverage gap and recommend updating `tasks.md`

### Requirement: verify triggers tasks.md update before refactor

When inconsistency is detected, the agent SHALL update documentation before further refactor implementation.

### Requirement: verify maintains revision history commit SHA

When `analysis.md` revision history gains a row, verify SHALL follow specification §7 **提交版本** rules.
