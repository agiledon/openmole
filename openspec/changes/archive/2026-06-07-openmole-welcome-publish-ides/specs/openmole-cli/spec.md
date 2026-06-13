## ADDED Requirements

### Requirement: npm package publishes as openmole

The OpenMole framework SHALL publish to the npm registry under the package name `openmole`. The CLI executable name SHALL remain `openmole`. Existing command files and skill directory names SHALL NOT be renamed.

#### Scenario: npm install global CLI

- **WHEN** a user runs `npm install -g openmole`
- **THEN** the `openmole` command SHALL be available on PATH
- **AND** `openmole --version` SHALL report the openmole package version

#### Scenario: Package name availability verified

- **WHEN** maintainers prepare release
- **THEN** `openmole` SHALL NOT conflict with an existing npm package (verified 404 before rename)

### Requirement: init supports Kiro and Qoder IDE adapters

`openmole init` and `openmole update` SHALL support IDE identifiers `kiro` and `qoder` in addition to existing five IDEs. Adapters SHALL install OpenMole skills and commands to project-level harness paths.

#### Scenario: Kiro project install

- **WHEN** the user runs `openmole init --ides kiro`
- **THEN** the CLI SHALL copy skills to `.kiro/skills/mole-*-change/`
- **AND** SHALL copy commands to `.kiro/commands/mole-*.md`

#### Scenario: Qoder project install

- **WHEN** the user runs `openmole init --ides qoder`
- **THEN** the CLI SHALL copy skills to `.qoder/skills/mole-*-change/`
- **AND** SHALL copy commands to `.qoder/commands/mole-*.md`

#### Scenario: IDE multiselect lists seven IDEs

- **WHEN** the user runs interactive `openmole init` after welcome
- **THEN** the multiselect SHALL offer Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder

## MODIFIED Requirements

### Requirement: openmole CLI provides init command

The OpenMole package SHALL ship a `openmole` executable with an `init` subcommand that initializes OpenMole in a target directory. When invoked via bare `openmole` in a TTY, the CLI SHALL show the welcome screen then enter the init flow.

#### Scenario: Init in current directory

- **WHEN** the user runs `openmole init` with no path argument
- **THEN** the CLI SHALL initialize OpenMole in the current working directory

#### Scenario: Init in specified path

- **WHEN** the user runs `openmole init /path/to/project`
- **THEN** the CLI SHALL initialize OpenMole under `/path/to/project/openmole/`

### Requirement: init presents interactive IDE multi-select

When run interactively without `--ides`, `openmole init` SHALL present a multi-select list of supported AI IDEs: Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder. The user SHALL navigate with arrow keys and toggle selections with the space key.

#### Scenario: Interactive IDE selection

- **WHEN** the user runs `openmole init` in a TTY without `--ides`
- **THEN** the CLI SHALL display all seven IDE options
- **AND** SHALL allow multiple selections before confirmation

#### Scenario: Non-interactive IDE selection

- **WHEN** the user runs `openmole init --ides cursor,opencode`
- **THEN** the CLI SHALL skip the interactive prompt
- **AND** SHALL configure only the listed IDEs

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

#### Scenario: Claude Code adapter

- **WHEN** Claude Code is selected
- **THEN** init SHALL symlink the OpenMole package to the user-level Claude plugins path
- **AND** Claude Code SHALL load skills and commands from `.claude-plugin/plugin.json`

#### Scenario: Codex adapter

- **WHEN** Codex is selected
- **THEN** init SHALL symlink the OpenMole package under `plugins/openmole` and register it in `.agents/plugins/marketplace.json`

#### Scenario: Gemini CLI adapter

- **WHEN** Gemini CLI is selected
- **THEN** init SHALL install skills and commands under project `.gemini/` and symlink the extension manifest

#### Scenario: Kiro adapter

- **WHEN** Kiro is selected
- **THEN** init SHALL install skills and commands under project `.kiro/`

#### Scenario: Qoder adapter

- **WHEN** Qoder is selected
- **THEN** init SHALL install skills and commands under project `.qoder/`

## REMOVED Requirements

### Requirement: Unsupported IDE manifest not ready

**Reason**: Phase B and Kiro/Qoder adapters implemented; warn-and-skip removed for Claude, Codex, Gemini, Kiro, Qoder.

**Migration**: All seven IDEs install via `openmole init --ides <list>`.
