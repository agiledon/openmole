## MODIFIED Requirements

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

### Requirement: OpenMole workspace and change directory model

The framework SHALL use `{project-root}/openmole/` as the OpenMole workspace. Per-change artifacts SHALL live under `openmole/changes/<change-name>/`. Active change name SHALL be tracked in `openmole/config.yaml` as `current_change`.

#### Scenario: Explore creates a new change

- **WHEN** the user runs `mole:explore` without an existing current change or explicitly starts a new change
- **THEN** the agent SHALL create `openmole/changes/<change-name>/` with `.openmole-change.yaml`
- **AND** SHALL set `openmole/config.yaml` `current_change` to `<change-name>`

#### Scenario: Phase commands use current change

- **WHEN** the user runs `mole:plan`, `mole:verify`, or `mole:apply` without specifying a change
- **THEN** the agent SHALL read and write artifacts under `openmole/changes/{current_change}/`

### Requirement: OpenMole workflow follows explore → plan → verify → apply → archive

The OpenMole framework SHALL define the phase order as: `mole:explore` → `mole:plan` → `mole:verify` → `mole:apply` → `mole:archive`. Each phase skill SHALL recommend the next step upon completion.

#### Scenario: Explore recommends plan

- **WHEN** `mole:explore` completes successfully
- **THEN** the agent SHALL recommend running `mole:plan` next

#### Scenario: Plan recommends verify

- **WHEN** `mole:plan` completes successfully
- **THEN** the agent SHALL recommend running `mole:verify` next

#### Scenario: Verify recommends apply

- **WHEN** `mole:verify` completes successfully
- **THEN** the agent SHALL recommend running `mole:apply` next

#### Scenario: Apply recommends archive

- **WHEN** `mole:apply` completes all tasks in the change
- **THEN** the agent SHALL recommend running `mole:archive` next
