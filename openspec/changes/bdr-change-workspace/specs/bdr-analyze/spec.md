## MODIFIED Requirements

### Requirement: bdr-analyze diffs badsmells against tasks

The `bdr-analyze` skill and `bdr:analyze` command SHALL compare `bdr/changes/<current-change>/badsmells.md` against `bdr/changes/<current-change>/tasks.md` and record output in `bdr/changes/<current-change>/analysis.md`.

#### Scenario: Analyze within current change

- **WHEN** the user runs `bdr:analyze` with `current_change: refactor-utils` in `bdr/config.yaml`
- **THEN** the agent SHALL read and update files only under `bdr/changes/refactor-utils/`

#### Scenario: New bad smell without task

- **WHEN** analyze finds BS-SEC-003 in the current change badsmells with status **未清除** and no task references BS-SEC-003
- **THEN** analysis SHALL report a coverage gap in the current change `analysis.md`
- **AND** SHALL recommend updating the current change `tasks.md` before apply
