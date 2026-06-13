## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Plugin manifest declares OpenMole skills and commands

The OpenMole plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, OpenCode install via `openmole.js`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `gemini-extension.json`) that register the `skills/` and `commands/` directories. Manifests SHALL expose skills `openmole-explore`, `openmole-verify`, `openmole-plan`, `openmole-apply`, and `openmole-archive` (and SHALL NOT register `using-openmole`). The `openmole init` CLI SHALL configure these manifests or equivalent paths for Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder.

#### Scenario: Cursor installation

- **WHEN** a user installs OpenMole in Cursor via `openmole init --ides cursor` or local path
- **THEN** the agent SHALL expose skills `openmole-explore`, `openmole-verify`, `openmole-plan`, `openmole-apply`, and `openmole-archive`
- **AND** commands `/mole-explore`, `/mole-verify`, `/mole-plan`, `/mole-apply`, and `/mole-archive` SHALL be available

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
