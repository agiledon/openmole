## ADDED Requirements

### Requirement: bdr CLI provides init command

The BDR package SHALL ship a `bdr` executable with an `init` subcommand that initializes BDR in a target directory.

#### Scenario: Init in current directory

- **WHEN** the user runs `bdr init` with no path argument
- **THEN** the CLI SHALL initialize BDR in the current working directory

#### Scenario: Init in specified path

- **WHEN** the user runs `bdr init /path/to/project`
- **THEN** the CLI SHALL initialize BDR under `/path/to/project/bdr/`

### Requirement: init presents interactive IDE multi-select

When run interactively without `--ides`, `bdr init` SHALL present a multi-select list of supported AI IDEs: Cursor, OpenCode, Gemini CLI, Claude Code, and Codex. The user SHALL navigate with arrow keys and toggle selections with the space key.

#### Scenario: Interactive IDE selection

- **WHEN** the user runs `bdr init` in a TTY without `--ides`
- **THEN** the CLI SHALL display all five IDE options
- **AND** SHALL allow multiple selections before confirmation

#### Scenario: Non-interactive IDE selection

- **WHEN** the user runs `bdr init --ides cursor,opencode`
- **THEN** the CLI SHALL skip the interactive prompt
- **AND** SHALL configure only the listed IDEs

### Requirement: init bootstraps BDR workspace directory

`bdr init` SHALL create the default BDR workspace structure in the target project: `bdr/config.yaml`, `bdr/changes/`, and `bdr/changes/archive/`.

#### Scenario: Fresh project workspace bootstrap

- **WHEN** `bdr/config.yaml` does not exist in the target directory
- **THEN** init SHALL create `bdr/config.yaml` from the plugin template with `current_change: null`
- **AND** SHALL create empty `bdr/changes/` and `bdr/changes/archive/` directories

#### Scenario: Existing workspace extend mode

- **WHEN** `bdr/config.yaml` already exists and `--force` is not set
- **THEN** init SHALL NOT overwrite `bdr/config.yaml`
- **AND** SHALL only append IDE configurations not yet present

### Requirement: init configures selected IDEs for BDR skills and commands

For each IDE selected, `bdr init` SHALL run an IDE-specific adapter that registers BDR skills and commands according to that platform's installation model.

#### Scenario: Cursor adapter

- **WHEN** Cursor is selected
- **THEN** init SHALL install BDR so Cursor exposes skills `bdr-explore`, `bdr-analyze`, `bdr-plan`, `bdr-apply`, and `bdr-archive`
- **AND** slash commands `/bdr-explore` through `/bdr-archive` become available after Cursor restart

#### Scenario: OpenCode adapter

- **WHEN** OpenCode is selected
- **THEN** init SHALL register the BDR OpenCode plugin path in `opencode.json`
- **AND** OpenCode SHALL load BDR skills and `/bdr-*` commands after restart

#### Scenario: Unsupported IDE manifest not ready

- **WHEN** the user selects Claude Code, Codex, or Gemini CLI before their adapter manifests are fully implemented
- **THEN** init SHALL warn that the IDE adapter is not yet available
- **AND** SHALL continue configuring other selected IDEs and the workspace without failing the entire init

### Requirement: init supports dry-run and force flags

The CLI SHALL support `--dry-run` to print planned actions without writing files, and `--force` to overwrite existing BDR or IDE configuration.

#### Scenario: Dry run

- **WHEN** the user runs `bdr init --dry-run`
- **THEN** the CLI SHALL print planned workspace and IDE actions
- **AND** SHALL NOT modify the filesystem

#### Scenario: Force overwrite

- **WHEN** the user runs `bdr init --force` and `bdr/config.yaml` exists
- **THEN** init SHALL recreate or overwrite `bdr/config.yaml` from template

### Requirement: init prints post-install verification hints

After successful init, the CLI SHALL print IDE-specific verification steps (e.g., restart IDE, run `/bdr-explore`).

#### Scenario: Success summary

- **WHEN** init completes for at least one IDE or workspace bootstrap
- **THEN** the CLI SHALL summarize what was configured and list next verification steps
