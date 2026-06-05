# bdr-core

BDR workspace model, plugin manifests, embedded rules in skills, zero-dependency stack.

## Requirements

### Requirement: CLI is the recommended BDR installation path

The BDR framework SHALL document and support `bdr init` as the primary way to install BDR skills, commands, and workspace structure in a target project.

#### Scenario: README installation guidance

- **WHEN** a user reads BDR installation documentation
- **THEN** `bdr init` SHALL be listed before manual symlink or hand-edited config steps

### Requirement: Plugin manifest declares BDR skills and commands

The BDR plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, OpenCode install via `bdr.js`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `gemini-extension.json`) that register the `skills/` and `commands/` directories. Manifests SHALL expose skills `bdr-explore-to-change`, `bdr-analyze-change`, `bdr-plan-change`, `bdr-apply-change`, and `bdr-archive-change` (and SHALL NOT register `using-bdr`). The `bdr init` CLI SHALL configure these manifests or equivalent paths for Cursor, OpenCode, Gemini CLI, Claude Code, and Codex.

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
- **THEN** both platforms SHALL be configured from the same BDR package root without copying skill files into the target project

### Requirement: BDR workspace and change directory model

The framework SHALL use `{project-root}/bdr/` as the BDR workspace. Per-change artifacts SHALL live under `bdr/changes/<change-name>/`. Active change name SHALL be tracked in `bdr/config.yaml` as `current_change`.

#### Scenario: Explore creates a new change

- **WHEN** the user runs `bdr:explore` without an existing current change or explicitly starts a new change
- **THEN** the agent SHALL create `bdr/changes/<change-name>/` with `.bdr-change.yaml`
- **AND** SHALL set `bdr/config.yaml` `current_change` to `<change-name>`

#### Scenario: Phase commands use current change

- **WHEN** the user runs `bdr:analyze`, `bdr:plan`, or `bdr:apply` without specifying a change
- **THEN** the agent SHALL read and write artifacts under `bdr/changes/{current_change}/`

### Requirement: BDR rules embedded in phase skills

The framework SHALL embed constitution and specification summaries directly in each phase skill. No standalone constitution or specification files are required in the plugin or target project.

#### Scenario: Fresh project without BDR docs

- **WHEN** the target project has no `bdr/` directory
- **THEN** BDR skills SHALL execute using embedded rule summaries
- **AND** SHALL NOT prompt the user to copy reference files during plugin installation

### Requirement: Zero-dependency plugin tech stack

The BDR plugin SHALL use a zero-dependency technology stack: Markdown skills/commands, JSON manifests, Bash scripts, minimal ESM `package.json`, OpenCode `bdr.js` with Node built-ins only, Shell tests.

#### Scenario: OpenCode bootstrap without using-bdr file read

- **WHEN** OpenCode loads the BDR plugin
- **THEN** `bdr.js` SHALL inject a short fixed bootstrap message
- **AND** SHALL NOT read or inject the full body of a removed `using-bdr` skill file
