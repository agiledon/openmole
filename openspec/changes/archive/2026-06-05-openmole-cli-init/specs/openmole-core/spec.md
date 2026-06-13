## ADDED Requirements

### Requirement: CLI is the recommended OpenMole installation path

The OpenMole framework SHALL document and support `openmole init` as the primary way to install OpenMole skills, commands, and workspace structure in a target project.

#### Scenario: README installation guidance

- **WHEN** a user reads OpenMole installation documentation
- **THEN** `openmole init` SHALL be listed before manual symlink or hand-edited config steps

## MODIFIED Requirements

### Requirement: Plugin manifest declares OpenMole skills and commands

The OpenMole plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, OpenCode install via `openmole.js`, and planned `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`) that register the `skills/` and `commands/` directories. Manifests SHALL expose skills `openmole-explore`, `openmole-verify`, `openmole-plan`, `openmole-apply`, and `openmole-archive` (and SHALL NOT register `using-openmole`). The `openmole init` CLI SHALL configure these manifests or equivalent paths for Cursor, OpenCode, Gemini CLI, Claude Code, and Codex.

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
- **THEN** both platforms SHALL be configured from the same OpenMole package root without copying skill files into the target project
