## ADDED Requirements

### Requirement: npm package identity is agile-bdr

The BDR plugin npm package SHALL be named `agile-bdr`. Documentation SHALL refer to registry install as `npm install -g agile-bdr` while preserving the `bdr` CLI command and existing skill/command artifact names.

#### Scenario: README install instructions

- **WHEN** a user reads installation documentation
- **THEN** npm registry install SHALL document `npm install -g agile-bdr`

### Requirement: Plugin supports Kiro harness

The BDR plugin SHALL support Kiro IDE via project-level `.kiro/skills/` and `.kiro/commands/` installation through `bdr init --ides kiro`.

#### Scenario: Kiro skills discoverable

- **WHEN** BDR is installed for Kiro in a project
- **THEN** Kiro SHALL discover `bdr-*-change` skills under `.kiro/skills/`

### Requirement: Plugin supports Qoder harness

The BDR plugin SHALL support Qoder via project-level `.qoder/skills/` and `.qoder/commands/` installation through `bdr init --ides qoder`.

#### Scenario: Qoder skills discoverable

- **WHEN** BDR is installed for Qoder in a project
- **THEN** Qoder SHALL discover `bdr-*-change` skills under `.qoder/skills/`

## MODIFIED Requirements

### Requirement: Plugin manifest declares BDR skills and commands

The BDR plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, OpenCode install via `bdr.js`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `gemini-extension.json`) that register the `skills/` and `commands/` directories. Manifests SHALL expose skills `bdr-explore-to-change`, `bdr-analyze-change`, `bdr-plan-change`, `bdr-apply-change`, and `bdr-archive-change` (and SHALL NOT register `using-bdr`). The `bdr init` CLI SHALL configure these manifests or equivalent paths for Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder.

#### Scenario: Cursor installation

- **WHEN** a user installs BDR in Cursor via `bdr init --ides cursor` or local path
- **THEN** the agent SHALL expose skills `bdr-explore-to-change`, `bdr-analyze-change`, `bdr-plan-change`, `bdr-apply-change`, and `bdr-archive-change`
- **AND** commands `/bdr-explore`, `/bdr-analyze`, `/bdr-plan`, `/bdr-apply`, and `/bdr-archive` SHALL be available

#### Scenario: OpenCode installation via init

- **WHEN** a user runs `bdr init --ides opencode`
- **THEN** OpenCode SHALL load BDR via the registered plugin path
- **AND** skills and `/bdr-*` commands SHALL be available without manual JSON editing

#### Scenario: Multi-IDE installation

- **WHEN** a user runs `bdr init` and selects Cursor and OpenCode
- **THEN** both platforms SHALL be configured from the same BDR package root without copying skill files into the target project where symlink/copy model allows

#### Scenario: Kiro installation via init

- **WHEN** a user runs `bdr init --ides kiro`
- **THEN** Kiro SHALL load BDR skills from `.kiro/skills/`

#### Scenario: Qoder installation via init

- **WHEN** a user runs `bdr init --ides qoder`
- **THEN** Qoder SHALL load BDR skills from `.qoder/skills/`
