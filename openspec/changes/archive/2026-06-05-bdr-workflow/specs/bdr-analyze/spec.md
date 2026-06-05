## ADDED Requirements

### Requirement: bdr-analyze-change diffs badsmells against tasks

The `bdr-analyze-change` skill and `bdr:analyze` command SHALL compare `{docs_root}/badsmells.md` entries and versions against `{docs_root}/tasks.md` to find coverage gaps, obsolete tasks, dependency conflicts, and DoD mismatches. Output SHALL be recorded in `{docs_root}/analysis.md`.

#### Scenario: New bad smell without task

- **WHEN** analyze finds BS-SEC-003 in badsmells with status **未清除** and no task references BS-SEC-003
- **THEN** analysis SHALL report a coverage gap
- **AND** SHALL recommend updating `tasks.md` before apply

#### Scenario: Obsolete task after smell cleared

- **WHEN** a task references BS-REUSE-001 but badsmells index shows **已消除**
- **THEN** analysis SHALL flag the task as obsolete or complete
- **AND** SHALL recommend reconciling `tasks.md`

### Requirement: analyze triggers tasks.md update before refactor

When analysis detects inconsistency between badsmells, specification, constitution, or tasks, the agent SHALL update documentation first per constitution §2.4 **before** any further refactor implementation.

#### Scenario: Constitution conflict detected

- **WHEN** analysis finds a proposed task would violate constitution §3
- **THEN** analysis SHALL document the conflict in `analysis.md`
- **AND** SHALL block plan/apply until badsmells or specification is revised

### Requirement: analyze maintains revision history commit SHA

When `analysis.md` version is bumped or revision history gains a row, analyze SHALL follow specification §7 **提交版本** rules.

#### Scenario: Analysis after badsmells version bump

- **WHEN** analyze completes a diff following badsmells v0.8.0 upgrade
- **THEN** `analysis.md` revision history SHALL include a new row with 提交版本 per specification §7
