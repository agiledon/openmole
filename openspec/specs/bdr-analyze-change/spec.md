# bdr-analyze-change

Diff badsmells against tasks within the current change.

## Requirements

### Requirement: bdr-analyze-change diffs badsmells against tasks

The `bdr-analyze-change` skill SHALL compare `bdr/changes/<current-change>/badsmells.md` against `tasks.md` and record output in `analysis.md`.

#### Scenario: Analyze within current change

- **WHEN** the user runs `bdr:analyze` with `current_change: refactor-utils`
- **THEN** the agent SHALL read and update files only under `bdr/changes/refactor-utils/`

#### Scenario: New bad smell without task

- **WHEN** analyze finds an uncleared BS-ID with no matching task
- **THEN** analysis SHALL report a coverage gap and recommend updating `tasks.md`

### Requirement: analyze triggers tasks.md update before refactor

When inconsistency is detected, the agent SHALL update documentation before further refactor implementation.

### Requirement: analyze maintains revision history commit SHA

When `analysis.md` revision history gains a row, analyze SHALL follow specification §7 **提交版本** rules.
