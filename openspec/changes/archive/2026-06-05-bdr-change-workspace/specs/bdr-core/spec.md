## MODIFIED Requirements

### Requirement: Plugin manifest declares BDR skills and commands

The BDR plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json` and OpenCode install instructions) that register the `skills/` and `commands/` directories. After this change, manifests SHALL expose skills `bdr-explore`, `bdr-analyze`, `bdr-plan`, `bdr-apply`, and `bdr-archive` (and SHALL NOT register `using-bdr`).

#### Scenario: Cursor installation

- **WHEN** a user installs the BDR plugin in Cursor via local path
- **THEN** the agent SHALL expose skills `bdr-explore`, `bdr-analyze`, `bdr-plan`, `bdr-apply`, and `bdr-archive`
- **AND** commands `bdr:explore`, `bdr:analyze`, `bdr:plan`, `bdr:apply`, and `bdr:archive` SHALL be available

### Requirement: BDR workspace and change directory model

The framework SHALL use `{project-root}/bdr/` as the BDR workspace. Per-change artifacts (`badsmells.md`, `tasks.md`, `analysis.md`) SHALL live under `bdr/changes/<change-name>/`. Active change name SHALL be tracked in `bdr/config.yaml` as `current_change`.

#### Scenario: Explore creates a new change

- **WHEN** the user runs `bdr:explore` without an existing current change or explicitly starts a new change
- **THEN** the agent SHALL create `bdr/changes/<change-name>/` with `.bdr-change.yaml`
- **AND** SHALL set `bdr/config.yaml` `current_change` to `<change-name>`

#### Scenario: Phase commands use current change

- **WHEN** the user runs `bdr:analyze`, `bdr:plan`, or `bdr:apply` without specifying a change
- **THEN** the agent SHALL read and write artifacts under `bdr/changes/{current_change}/`

### Requirement: BDR rules embedded in phase skills

The framework SHALL embed constitution and specification summaries directly in each phase skill (`bdr-explore`, `bdr-analyze`, `bdr-plan`, `bdr-apply`, `bdr-archive`). No standalone `constitution.md` or `specification.md` files are required in the plugin package or target project.

#### Scenario: Fresh project without BDR docs

- **WHEN** the target project has no `bdr/` directory
- **THEN** BDR skills SHALL still execute using embedded rule summaries
- **AND** SHALL NOT prompt the user to copy reference files during plugin installation

#### Scenario: Explore creates workspace on first run

- **WHEN** the user runs `bdr:explore` on a project without `bdr/config.yaml`
- **THEN** the agent SHALL instruct creating `bdr/config.yaml` from `templates/bdr-config.yaml.example`
- **AND** SHALL proceed without external constitution files

## REMOVED Requirements

### Requirement: using-bdr meta skill routes agents to correct BDR workflow

**Reason:** Routing and workspace rules are embedded in each phase skill; commands delegate directly. Separate meta skill adds maintenance cost without required behavior.

**Migration:** Remove `skills/using-bdr/`; update OpenCode bootstrap to a short fixed summary; distribute RED FLAGS to phase skills.

### Requirement: BDR docs root is discoverable

**Reason:** Replaced by `bdr/` workspace + plugin bundle resolution (see MODIFIED: BDR workspace and change directory model).

**Migration:** Remove `docs_root`, `BDR_DOCS_ROOT`, `docs/bdr/`, and `docs/prd/` fallback from skills and `.bdr.yaml`.

## MODIFIED Requirements

### Requirement: Zero-dependency plugin tech stack

The BDR plugin SHALL use a zero-dependency technology stack: Markdown skills/commands with YAML frontmatter, JSON plugin manifests, Bash scripts, minimal ESM `package.json` with no runtime dependencies, OpenCode plugin in `.opencode/plugins/bdr.js` using only Node built-in modules, and Shell-based tests under `tests/`.

#### Scenario: OpenCode bootstrap without using-bdr file read

- **WHEN** OpenCode loads the BDR plugin
- **THEN** `bdr.js` SHALL inject a short fixed bootstrap message
- **AND** SHALL NOT read or inject the full body of a removed `using-bdr` skill file
