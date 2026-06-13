## MODIFIED Requirements

### Requirement: openmole-verify diffs badsmells against tasks

The `openmole-verify` skill and `mole:verify` command SHALL compare `openmole/changes/<current-change>/badsmells.md` against `openmole/changes/<current-change>/tasks.md` and record output in `openmole/changes/<current-change>/analysis.md`.

#### Scenario: Analyze within current change

- **WHEN** the user runs `mole:verify` with `current_change: refactor-utils` in `openmole/config.yaml`
- **THEN** the agent SHALL read and update files only under `openmole/changes/refactor-utils/`

#### Scenario: New bad smell without task

- **WHEN** analyze finds BS-SEC-003 in the current change badsmells with status **未清除** and no task references BS-SEC-003
- **THEN** analysis SHALL report a coverage gap in the current change `analysis.md`
- **AND** SHALL recommend updating the current change `tasks.md` before apply
