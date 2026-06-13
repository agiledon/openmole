## ADDED Requirements

### Requirement: openmole-archive completes and archives a change

The `openmole-archive` skill and `mole:archive` command SHALL verify the current change under `openmole/changes/<change-name>/` for completion (all badsmells **已消除** or intentionally waived, all tasks marked complete) and SHALL move completed changes to `openmole/changes/archive/YYYY-MM-DD-<change-name>/`.

#### Scenario: Archive fully completed change

- **WHEN** all badsmells in the current change are **已消除** and all tasks are checked complete
- **THEN** archive SHALL move the change directory to `openmole/changes/archive/YYYY-MM-DD-<change-name>/`
- **AND** SHALL update `.openmole-change.yaml` status to `archived`
- **AND** SHALL clear `current_change` in `openmole/config.yaml`

#### Scenario: Archive with incomplete items requires confirmation

- **WHEN** the current change has **未清除** badsmells or unchecked tasks
- **THEN** archive SHALL list incomplete BS-IDs and tasks
- **AND** SHALL NOT archive until the user explicitly confirms proceeding despite incomplete work

#### Scenario: Archive preserves artifact history

- **WHEN** a change is archived
- **THEN** `badsmells.md`, `tasks.md`, and `analysis.md` SHALL remain intact inside the archive directory for audit

### Requirement: archive command is registered in plugin manifests

Cursor and OpenCode plugin registration SHALL include `openmole-archive` skill and `mole:archive` command alongside existing OpenMole commands.

#### Scenario: Cursor exposes archive command

- **WHEN** OpenMole plugin is installed in Cursor
- **THEN** `mole:archive` SHALL appear in available commands
- **AND** SHALL load the `openmole-archive` skill when invoked
