## ADDED Requirements

### Requirement: openmole CLI provides init command

The OpenMole package SHALL ship a `openmole` executable with an `init` subcommand that initializes OpenMole in a target directory.

#### Scenario: Init in current directory

- **WHEN** the user runs `openmole init` with no path argument
- **THEN** the CLI SHALL initialize OpenMole in the current working directory

#### Scenario: Init in specified path

- **WHEN** the user runs `openmole init /path/to/project`
- **THEN** the CLI SHALL initialize OpenMole under `/path/to/project/openmole/`

### Requirement: init presents interactive IDE multi-select

When run interactively without `--ides`, `openmole init` SHALL present a multi-select list of supported AI IDEs: Cursor, OpenCode, Gemini CLI, Claude Code, and Codex. The user SHALL navigate with arrow keys and toggle selections with the space key.

#### Scenario: Interactive IDE selection

- **WHEN** the user runs `openmole init` in a TTY without `--ides`
- **THEN** the CLI SHALL display all five IDE options
- **AND** SHALL allow multiple selections before confirmation

#### Scenario: Non-interactive IDE selection

- **WHEN** the user runs `openmole init --ides cursor,opencode`
- **THEN** the CLI SHALL skip the interactive prompt
- **AND** SHALL configure only the listed IDEs

### Requirement: init bootstraps OpenMole workspace directory

`openmole init` SHALL create the default OpenMole workspace structure in the target project: `openmole/config.yaml`, `openmole/changes/`, and `openmole/changes/archive/`.

#### Scenario: Fresh project workspace bootstrap

- **WHEN** `openmole/config.yaml` does not exist in the target directory
- **THEN** init SHALL create `openmole/config.yaml` from the plugin template with `current_change: null`
- **AND** SHALL create empty `openmole/changes/` and `openmole/changes/archive/` directories

#### Scenario: Existing workspace extend mode

- **WHEN** `openmole/config.yaml` already exists and `--force` is not set
- **THEN** init SHALL NOT overwrite `openmole/config.yaml`
- **AND** SHALL only append IDE configurations for IDEs not listed in `installed_ides`

### Requirement: init records metadata in config.yaml

`openmole init` SHALL write `installed_ides`, `init_version`, and `init_at` into `openmole/config.yaml` alongside `current_change`.

#### Scenario: Fresh init metadata

- **WHEN** init creates a new `openmole/config.yaml`
- **THEN** the file SHALL include `installed_ides` as a list of configured IDE identifiers
- **AND** SHALL include `init_version` matching the OpenMole CLI package version
- **AND** SHALL include `init_at` as an ISO-8601 timestamp

#### Scenario: Extend updates installed_ides

- **WHEN** init runs in extend mode and successfully configures a new IDE
- **THEN** init SHALL append that IDE to `installed_ides` without removing existing entries

### Requirement: init configures selected IDEs for OpenMole skills and commands

For each IDE selected, `openmole init` SHALL run an IDE-specific adapter that registers OpenMole skills and commands according to that platform's installation model.

#### Scenario: Cursor adapter

- **WHEN** Cursor is selected
- **THEN** init SHALL install OpenMole so Cursor exposes skills `openmole-explore`, `openmole-verify`, `openmole-plan`, `openmole-apply`, and `openmole-archive`
- **AND** slash commands `/mole-explore` through `/mole-archive` become available after Cursor restart

#### Scenario: OpenCode adapter

- **WHEN** OpenCode is selected
- **THEN** init SHALL register the OpenMole OpenCode plugin path in `opencode.json`
- **AND** OpenCode SHALL load OpenMole skills and `/mole-*` commands after restart

#### Scenario: Unsupported IDE manifest not ready

- **WHEN** the user selects Claude Code, Codex, or Gemini CLI before their adapter manifests are fully implemented
- **THEN** init SHALL warn that the IDE adapter is not yet available
- **AND** SHALL continue configuring other selected IDEs and the workspace without failing the entire init

### Requirement: init supports dry-run and force flags

The CLI SHALL support `--dry-run` to print planned actions without writing files, and `--force` to overwrite existing OpenMole or IDE configuration.

#### Scenario: Dry run

- **WHEN** the user runs `openmole init --dry-run`
- **THEN** the CLI SHALL print planned workspace and IDE actions
- **AND** SHALL NOT modify the filesystem

#### Scenario: Force overwrite

- **WHEN** the user runs `openmole init --force` and `openmole/config.yaml` exists
- **THEN** init SHALL recreate or overwrite `openmole/config.yaml` from template

### Requirement: init prints post-install verification hints

After successful init, the CLI SHALL print IDE-specific verification steps (e.g., restart IDE, run `/mole-explore`).

#### Scenario: Success summary

- **WHEN** init completes for at least one IDE or workspace bootstrap
- **THEN** the CLI SHALL summarize what was configured and list next verification steps
