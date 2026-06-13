## MODIFIED Requirements

### Requirement: Plugin manifest declares BDR skills and commands

The BDR plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, OpenCode install via `bdr.js`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `gemini-extension.json`) that register the `skills/` and `commands/` directories. Manifests SHALL expose skills `bdr-explore-to-change`, `bdr-plan-change`, `bdr-verify-change`, `bdr-apply-change`, and `bdr-archive-change` (and SHALL NOT register `using-bdr`). The `bdr init` CLI SHALL configure these manifests or equivalent paths for Cursor, OpenCode, Gemini CLI, Claude Code, Codex, Kiro, and Qoder.

#### Scenario: Cursor installation

- **WHEN** a user installs BDR in Cursor via `bdr init --ides cursor` or local path
- **THEN** the agent SHALL expose skills `bdr-explore-to-change`, `bdr-plan-change`, `bdr-verify-change`, `bdr-apply-change`, and `bdr-archive-change`
- **AND** commands `/bdr-explore`, `/bdr-plan`, `/bdr-verify`, `/bdr-apply`, and `/bdr-archive` SHALL be available

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

### Requirement: BDR workspace and change directory model

The framework SHALL use `{project-root}/bdr/` as the BDR workspace. Per-change artifacts SHALL live under `bdr/changes/<change-name>/`. Active change name SHALL be tracked in `bdr/config.yaml` as `current_change`.

#### Scenario: Explore creates a new change

- **WHEN** the user runs `bdr:explore` without an existing current change or explicitly starts a new change
- **THEN** the agent SHALL create `bdr/changes/<change-name>/` with `.bdr-change.yaml`
- **AND** SHALL set `bdr/config.yaml` `current_change` to `<change-name>`

#### Scenario: Phase commands use current change

- **WHEN** the user runs `bdr:plan`, `bdr:verify`, or `bdr:apply` without specifying a change
- **THEN** the agent SHALL read and write artifacts under `bdr/changes/{current_change}/`

### Requirement: BDR workflow follows explore → plan → verify → apply → archive

The BDR framework SHALL define the phase order as: `bdr:explore` → `bdr:plan` → `bdr:verify` → `bdr:apply` → `bdr:archive`. Each phase skill SHALL recommend the next step upon completion.

#### Scenario: Explore recommends plan

- **WHEN** `bdr:explore` completes successfully
- **THEN** the agent SHALL recommend running `bdr:plan` next

#### Scenario: Plan recommends verify

- **WHEN** `bdr:plan` completes successfully
- **THEN** the agent SHALL recommend running `bdr:verify` next

#### Scenario: Verify recommends apply

- **WHEN** `bdr:verify` completes successfully
- **THEN** the agent SHALL recommend running `bdr:apply` next

#### Scenario: Apply recommends archive

- **WHEN** `bdr:apply` completes all tasks in the change
- **THEN** the agent SHALL recommend running `bdr:archive` next
