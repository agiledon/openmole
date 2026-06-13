# openmole-cli

OpenMole command-line interface: `openmole init`, `openmole update`, workspace bootstrap, and IDE adapters.

## Requirements

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
- **THEN** init SHALL install OpenMole so Cursor exposes skills `openmole-explore`, `openmole-plan`, `openmole-verify`, `openmole-apply`, and `openmole-archive`
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

### Requirement: npm package publishes as openmole

The OpenMole framework SHALL publish to the npm registry under the package name `openmole`. The CLI executable name SHALL remain `openmole`. Existing command files and skill directory names SHALL NOT be renamed.

#### Scenario: npm install global CLI

- **WHEN** a user runs `npm install -g openmole`
- **THEN** the `openmole` command SHALL be available on PATH
- **AND** `openmole --version` SHALL report the openmole package version

#### Scenario: Package name availability verified

- **WHEN** maintainers prepare release
- **THEN** `openmole` SHALL NOT conflict with an existing npm package (verified 404 before rename)

### Requirement: init supports dry-run and force flags

The CLI SHALL support `--dry-run` to print planned actions without writing files, and `--force` to overwrite existing OpenMole or IDE configuration.

#### Scenario: Dry run

- **WHEN** the user runs `openmole init --dry-run`
- **THEN** the CLI SHALL print planned workspace and IDE actions
- **AND** SHALL NOT modify the filesystem

#### Scenario: Force overwrite

- **WHEN** the user runs `openmole init --force` and `openmole/config.yaml` exists
- **THEN** init SHALL recreate or overwrite `openmole/config.yaml` from template

### Requirement: init merges gitignore snippet

When configuring at least one IDE, `openmole init` SHALL merge `templates/openmole-gitignore.snippet` into the target project `.gitignore` using managed markers, unless `--skip-gitignore` is set.

#### Scenario: Gitignore on first init

- **WHEN** init configures an IDE and `.gitignore` does not contain the OpenMole managed block
- **THEN** init SHALL append the snippet ignoring machine-local plugin symlinks

### Requirement: init prints post-install verification hints

After successful init, the CLI SHALL print IDE-specific verification steps (e.g., restart IDE, run `/mole-explore`).

#### Scenario: Success summary

- **WHEN** init completes for at least one IDE or workspace bootstrap
- **THEN** the CLI SHALL summarize what was configured and list next verification steps

### Requirement: openmole CLI provides update command

The OpenMole package SHALL ship an `update` subcommand that re-installs IDE configurations listed in `openmole/config.yaml` `installed_ides` and refreshes `init_version` / `init_at`.

#### Scenario: Update after package upgrade

- **WHEN** the user runs `openmole update` in a project with `installed_ides: [cursor, opencode]`
- **THEN** the CLI SHALL re-run each IDE adapter with force semantics
- **AND** SHALL set `init_version` to the current OpenMole package version

#### Scenario: Update without workspace

- **WHEN** the user runs `openmole update` and `openmole/config.yaml` does not exist
- **THEN** the CLI SHALL fail with a message to run `openmole init` first

### Requirement: npm package is publish-ready

The OpenMole npm package SHALL declare `files`, `repository`, `engines`, and `bin` so `npm pack` / `npm publish` include CLI, skills, commands, templates, and harness manifests without plugin runtime npm dependencies beyond CLI-only `@clack/prompts`.

#### Scenario: Pack tarball contents

- **WHEN** a maintainer runs `npm pack`
- **THEN** the tarball SHALL include `bin/`, `cli/`, `skills/`, `commands/`, `templates/`, and harness manifest directories
