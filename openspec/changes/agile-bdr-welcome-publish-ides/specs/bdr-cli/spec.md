## ADDED Requirements

### Requirement: npm package publishes as agile-bdr

The BDR framework SHALL publish to the npm registry under the package name `agile-bdr`. The CLI executable name SHALL remain `bdr`. Existing command files and skill directory names SHALL NOT be renamed.

#### Scenario: npm install global CLI

- **WHEN** a user runs `npm install -g agile-bdr`
- **THEN** the `bdr` command SHALL be available on PATH
- **AND** `bdr --version` SHALL report the agile-bdr package version

#### Scenario: Package name availability verified

- **WHEN** maintainers prepare release
- **THEN** `agile-bdr` SHALL NOT conflict with an existing npm package (verified 404 before rename)

### Requirement: init supports Kiro and Qoder IDE adapters

`bdr init` and `bdr update` SHALL support IDE identifiers `kiro` and `qoder` in addition to existing five IDEs. Adapters SHALL install BDR skills and commands to project-level harness paths.

#### Scenario: Kiro project install

- **WHEN** the user runs `bdr init --ides kiro`
- **THEN** the CLI SHALL copy skills to `.kiro/skills/bdr-*-change/`
- **AND** SHALL copy commands to `.kiro/commands/bdr-*.md`

#### Scenario: Qoder project install

- **WHEN** the user runs `bdr init --ides qoder`
- **THEN** the CLI SHALL copy skills to `.qoder/skills/bdr-*-change/`
- **AND** SHALL copy commands to `.qoder/commands/bdr-*.md`

#### Scenario: IDE multiselect lists seven IDEs

- **WHEN** the user runs interactive `bdr init` after welcome
- **THEN** the multiselect SHALL offer Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder

## MODIFIED Requirements

### Requirement: bdr CLI provides init command

The BDR package SHALL ship a `bdr` executable with an `init` subcommand that initializes BDR in a target directory. When invoked via bare `bdr` in a TTY, the CLI SHALL show the welcome screen then enter the init flow.

#### Scenario: Init in current directory

- **WHEN** the user runs `bdr init` with no path argument
- **THEN** the CLI SHALL initialize BDR in the current working directory

#### Scenario: Init in specified path

- **WHEN** the user runs `bdr init /path/to/project`
- **THEN** the CLI SHALL initialize BDR under `/path/to/project/bdr/`

### Requirement: init presents interactive IDE multi-select

When run interactively without `--ides`, `bdr init` SHALL present a multi-select list of supported AI IDEs: Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder. The user SHALL navigate with arrow keys and toggle selections with the space key.

#### Scenario: Interactive IDE selection

- **WHEN** the user runs `bdr init` in a TTY without `--ides`
- **THEN** the CLI SHALL display all seven IDE options
- **AND** SHALL allow multiple selections before confirmation

#### Scenario: Non-interactive IDE selection

- **WHEN** the user runs `bdr init --ides cursor,opencode`
- **THEN** the CLI SHALL skip the interactive prompt
- **AND** SHALL configure only the listed IDEs

### Requirement: init configures selected IDEs for BDR skills and commands

For each IDE selected, `bdr init` SHALL run an IDE-specific adapter that registers BDR skills and commands according to that platform's installation model.

#### Scenario: Cursor adapter

- **WHEN** Cursor is selected
- **THEN** init SHALL install BDR so Cursor exposes skills `bdr-explore-to-change`, `bdr-analyze-change`, `bdr-plan-change`, `bdr-apply-change`, and `bdr-archive-change`
- **AND** slash commands `/bdr-explore` through `/bdr-archive` become available after Cursor restart

#### Scenario: OpenCode adapter

- **WHEN** OpenCode is selected
- **THEN** init SHALL register the BDR OpenCode plugin path in `opencode.json`
- **AND** OpenCode SHALL load BDR skills and `/bdr-*` commands after restart

#### Scenario: Claude Code adapter

- **WHEN** Claude Code is selected
- **THEN** init SHALL symlink the BDR package to the user-level Claude plugins path
- **AND** Claude Code SHALL load skills and commands from `.claude-plugin/plugin.json`

#### Scenario: Codex adapter

- **WHEN** Codex is selected
- **THEN** init SHALL symlink the BDR package under `plugins/bdr` and register it in `.agents/plugins/marketplace.json`

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

**Migration**: All seven IDEs install via `bdr init --ides <list>`.
