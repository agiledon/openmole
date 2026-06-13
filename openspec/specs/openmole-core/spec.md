# openmole-core

OpenMole workspace model, plugin manifests, embedded rules in skills, zero-dependency stack.

## Requirements

### Requirement: CLI is the recommended OpenMole installation path

The OpenMole framework SHALL document and support `openmole init` as the primary way to install OpenMole skills, commands, and workspace structure in a target project.

#### Scenario: README installation guidance

- **WHEN** a user reads OpenMole installation documentation
- **THEN** `openmole init` SHALL be listed before manual symlink or hand-edited config steps

### Requirement: Plugin manifest declares OpenMole skills and commands

The OpenMole plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, OpenCode install via `openmole.js`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `gemini-extension.json`) that register the `skills/` and `commands/` directories. Manifests SHALL expose skills `openmole-explore`, `openmole-plan`, `openmole-verify`, `openmole-apply`, and `openmole-archive` (and SHALL NOT register `using-openmole`). The `openmole init` CLI SHALL configure these manifests or equivalent paths for Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder.

#### Scenario: Cursor installation

- **WHEN** a user installs OpenMole in Cursor via `openmole init --ides cursor` or local path
- **THEN** the agent SHALL expose skills `openmole-explore`, `openmole-plan`, `openmole-verify`, `openmole-apply`, and `openmole-archive`
- **AND** commands `/mole-explore`, `/mole-plan`, `/mole-verify`, `/mole-apply`, and `/mole-archive` SHALL be available

#### Scenario: OpenCode installation via init

- **WHEN** a user runs `openmole init --ides opencode`
- **THEN** OpenCode SHALL load OpenMole via the registered plugin path
- **AND** skills and `/mole-*` commands SHALL be available without manual JSON editing

#### Scenario: Multi-IDE installation

- **WHEN** a user runs `openmole init` and selects Cursor and OpenCode
- **THEN** both platforms SHALL be configured from the same OpenMole package root without copying skill files into the target project where symlink/copy model allows

#### Scenario: Kiro installation via init

- **WHEN** a user runs `openmole init --ides kiro`
- **THEN** Kiro SHALL load OpenMole skills from `.kiro/skills/`

#### Scenario: Qoder installation via init

- **WHEN** a user runs `openmole init --ides qoder`
- **THEN** Qoder SHALL load OpenMole skills from `.qoder/skills/`

### Requirement: npm package identity is openmole

The OpenMole plugin npm package SHALL be named `openmole`. Documentation SHALL refer to registry install as `npm install -g openmole` while preserving the `openmole` CLI command and existing skill/command artifact names.

#### Scenario: README install instructions

- **WHEN** a user reads installation documentation
- **THEN** npm registry install SHALL document `npm install -g openmole`

### Requirement: Plugin supports Kiro harness

The OpenMole plugin SHALL support Kiro IDE via project-level `.kiro/skills/` and `.kiro/commands/` installation through `openmole init --ides kiro`.

#### Scenario: Kiro skills discoverable

- **WHEN** OpenMole is installed for Kiro in a project
- **THEN** Kiro SHALL discover `mole-*-change` skills under `.kiro/skills/`

### Requirement: Plugin supports Qoder harness

The OpenMole plugin SHALL support Qoder via project-level `.qoder/skills/` and `.qoder/commands/` installation through `openmole init --ides qoder`.

#### Scenario: Qoder skills discoverable

- **WHEN** OpenMole is installed for Qoder in a project
- **THEN** Qoder SHALL discover `mole-*-change` skills under `.qoder/skills/`

### Requirement: OpenMole workspace and change directory model

The framework SHALL use `{project-root}/openmole/` as the OpenMole workspace. Per-change artifacts SHALL live under `openmole/changes/<change-name>/`. Active change name SHALL be tracked in `openmole/config.yaml` as `current_change`.

#### Scenario: Explore creates a new change

- **WHEN** the user runs `mole:explore` without an existing current change or explicitly starts a new change
- **THEN** the agent SHALL create `openmole/changes/<change-name>/` with `.openmole-change.yaml`
- **AND** SHALL set `openmole/config.yaml` `current_change` to `<change-name>`

#### Scenario: Phase commands use current change

- **WHEN** the user runs `mole:plan`, `mole:verify`, or `mole:apply` without specifying a change
- **THEN** the agent SHALL read and write artifacts under `openmole/changes/{current_change}/`

### Requirement: OpenMole rules embedded in phase skills

The framework SHALL embed constitution and specification summaries directly in each phase skill. No standalone constitution or specification files are required in the plugin or target project.

#### Scenario: Fresh project without OpenMole docs

- **WHEN** the target project has no `openmole/` directory
- **THEN** OpenMole skills SHALL execute using embedded rule summaries
- **AND** SHALL NOT prompt the user to copy reference files during plugin installation

### Requirement: Zero-dependency plugin tech stack

The OpenMole plugin SHALL use a zero-dependency technology stack: Markdown skills/commands, JSON manifests, Bash scripts, minimal ESM `package.json`, OpenCode `openmole.js` with Node built-ins only, Shell tests.

#### Scenario: OpenCode bootstrap without using-openmole file read

- **WHEN** OpenCode loads the OpenMole plugin
- **THEN** `openmole.js` SHALL inject a short fixed bootstrap message
- **AND** SHALL NOT read or inject the full body of a removed `using-openmole` skill file
