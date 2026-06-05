# bdr-archive-change

Archive completed BDR changes.

## Requirements

### Requirement: bdr-archive-change completes and archives a change

The `bdr-archive-change` skill SHALL verify the current change for completion and move it to `bdr/changes/archive/YYYY-MM-DD-<change-name>/`.

#### Scenario: Archive fully completed change

- **WHEN** all badsmells are **已消除** and all tasks are complete
- **THEN** archive SHALL move the change to archive and clear `current_change`

#### Scenario: Archive with incomplete items requires confirmation

- **WHEN** uncleared badsmells or unchecked tasks remain
- **THEN** archive SHALL list them and SHALL NOT archive until the user confirms

### Requirement: archive command is registered in plugin manifests

Cursor and OpenCode SHALL include `bdr-archive-change` skill and `bdr:archive` command.

#### Scenario: Cursor exposes archive command

- **WHEN** BDR plugin is installed in Cursor
- **THEN** `bdr:archive` SHALL be available
