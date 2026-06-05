## ADDED Requirements

### Requirement: CLI is the recommended BDR installation path

The BDR framework SHALL document and support `bdr init` as the primary way to install BDR skills, commands, and workspace structure in a target project.

#### Scenario: README installation guidance

- **WHEN** a user reads BDR installation documentation
- **THEN** `bdr init` SHALL be listed before manual symlink or hand-edited config steps

## MODIFIED Requirements

### Requirement: Plugin manifest declares BDR skills and commands

The BDR plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, OpenCode install via `bdr.js`, and planned `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`) that register the `skills/` and `commands/` directories. Manifests SHALL expose skills `bdr-explore`, `bdr-analyze`, `bdr-plan`, `bdr-apply`, and `bdr-archive` (and SHALL NOT register `using-bdr`). The `bdr init` CLI SHALL configure these manifests or equivalent paths for Cursor, OpenCode, Gemini CLI, Claude Code, and Codex.

#### Scenario: Cursor installation

- **WHEN** a user installs BDR in Cursor via `bdr init --ides cursor` or local path
- **THEN** the agent SHALL expose skills `bdr-explore`, `bdr-analyze`, `bdr-plan`, `bdr-apply`, and `bdr-archive`
- **AND** commands `/bdr-explore`, `/bdr-analyze`, `/bdr-plan`, `/bdr-apply`, and `/bdr-archive` SHALL be available

#### Scenario: OpenCode installation via init

- **WHEN** a user runs `bdr init --ides opencode`
- **THEN** OpenCode SHALL load BDR via the registered plugin path
- **AND** skills and `/bdr-*` commands SHALL be available without manual JSON editing

#### Scenario: Multi-IDE installation

- **WHEN** a user runs `bdr init` and selects Cursor and OpenCode
- **THEN** both platforms SHALL be configured from the same BDR package root without copying skill files into the target project
