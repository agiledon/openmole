# openmole-archive

Archive completed OpenMole changes.

## Requirements

### Requirement: openmole-archive completes and archives a change

The `openmole-archive` skill SHALL verify the current change for completion and move it to `openmole/changes/archive/YYYY-MM-DD-<change-name>/`.

#### Scenario: Archive fully completed change

- **WHEN** all badsmells are **已消除** and all tasks are complete
- **THEN** archive SHALL move the change to archive and clear `current_change`

#### Scenario: Archive with incomplete items requires confirmation

- **WHEN** uncleared badsmells or unchecked tasks remain
- **THEN** archive SHALL list them and SHALL NOT archive until the user confirms

### Requirement: archive command is registered in plugin manifests

Cursor and OpenCode SHALL include `openmole-archive` skill and `mole:archive` command.

#### Scenario: Cursor exposes archive command

- **WHEN** OpenMole plugin is installed in Cursor
- **THEN** `mole:archive` SHALL be available
