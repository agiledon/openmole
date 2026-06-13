## MODIFIED Requirements

### Requirement: Plugin manifest declares OpenMole skills and commands

The OpenMole plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json` and OpenCode install instructions) that register the `skills/` and `commands/` directories. After this change, manifests SHALL expose skills `openmole-explore`, `openmole-verify`, `openmole-plan`, `openmole-apply`, and `openmole-archive` (and SHALL NOT register `using-openmole`).

#### Scenario: Cursor installation

- **WHEN** a user installs the OpenMole plugin in Cursor via local path
- **THEN** the agent SHALL expose skills `openmole-explore`, `openmole-verify`, `openmole-plan`, `openmole-apply`, and `openmole-archive`
- **AND** commands `mole:explore`, `mole:verify`, `mole:plan`, `mole:apply`, and `mole:archive` SHALL be available

### Requirement: OpenMole workspace and change directory model

The framework SHALL use `{project-root}/openmole/` as the OpenMole workspace. Per-change artifacts (`badsmells.md`, `tasks.md`, `analysis.md`) SHALL live under `openmole/changes/<change-name>/`. Active change name SHALL be tracked in `openmole/config.yaml` as `current_change`.

#### Scenario: Explore creates a new change

- **WHEN** the user runs `mole:explore` without an existing current change or explicitly starts a new change
- **THEN** the agent SHALL create `openmole/changes/<change-name>/` with `.openmole-change.yaml`
- **AND** SHALL set `openmole/config.yaml` `current_change` to `<change-name>`

#### Scenario: Phase commands use current change

- **WHEN** the user runs `mole:verify`, `mole:plan`, or `mole:apply` without specifying a change
- **THEN** the agent SHALL read and write artifacts under `openmole/changes/{current_change}/`

### Requirement: OpenMole rules embedded in phase skills

The framework SHALL embed constitution and specification summaries directly in each phase skill (`openmole-explore`, `openmole-verify`, `openmole-plan`, `openmole-apply`, `openmole-archive`). No standalone `constitution.md` or `specification.md` files are required in the plugin package or target project.

#### Scenario: Fresh project without OpenMole docs

- **WHEN** the target project has no `openmole/` directory
- **THEN** OpenMole skills SHALL still execute using embedded rule summaries
- **AND** SHALL NOT prompt the user to copy reference files during plugin installation

#### Scenario: Explore creates workspace on first run

- **WHEN** the user runs `mole:explore` on a project without `openmole/config.yaml`
- **THEN** the agent SHALL instruct creating `openmole/config.yaml` from `templates/openmole-config.yaml.example`
- **AND** SHALL proceed without external constitution files

## REMOVED Requirements

### Requirement: using-openmole meta skill routes agents to correct OpenMole workflow

**Reason:** Routing and workspace rules are embedded in each phase skill; commands delegate directly. Separate meta skill adds maintenance cost without required behavior.

**Migration:** Remove `skills/using-openmole/`; update OpenCode bootstrap to a short fixed summary; distribute RED FLAGS to phase skills.

### Requirement: OpenMole docs root is discoverable

**Reason:** Replaced by `openmole/` workspace + plugin bundle resolution (see MODIFIED: OpenMole workspace and change directory model).

**Migration:** Remove `docs_root`, `OPENMOLE_DOCS_ROOT`, `docs/openmole/`, and `docs/prd/` fallback from skills and `.openmole.yaml`.

## MODIFIED Requirements

### Requirement: Zero-dependency plugin tech stack

The OpenMole plugin SHALL use a zero-dependency technology stack: Markdown skills/commands with YAML frontmatter, JSON plugin manifests, Bash scripts, minimal ESM `package.json` with no runtime dependencies, OpenCode plugin in `.opencode/plugins/openmole.js` using only Node built-in modules, and Shell-based tests under `tests/`.

#### Scenario: OpenCode bootstrap without using-openmole file read

- **WHEN** OpenCode loads the OpenMole plugin
- **THEN** `openmole.js` SHALL inject a short fixed bootstrap message
- **AND** SHALL NOT read or inject the full body of a removed `using-openmole` skill file
