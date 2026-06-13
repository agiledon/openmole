## ADDED Requirements

### Requirement: Plugin manifest declares OpenMole skills and commands

The OpenMole plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and OpenCode install instructions) that register the `skills/` and `commands/` directories so harnesses can discover OpenMole capabilities after installation.

#### Scenario: Cursor installation

- **WHEN** a user installs the OpenMole plugin in Cursor via marketplace or local path
- **THEN** the agent SHALL expose skills `using-openmole`, `openmole-explore`, `openmole-plan`, `openmole-apply`, and `openmole-verify`
- **AND** commands `mole:explore`, `mole:plan`, `mole:apply`, and `mole:verify` SHALL be available

#### Scenario: Multi-harness skill path consistency

- **WHEN** the same plugin package is installed on Claude Code, Codex CLI, or OpenCode
- **THEN** all harnesses SHALL load skills from the shared `./skills/` directory without duplicated skill content

### Requirement: using-openmole meta skill routes agents to correct OpenMole workflow

The `using-openmole` skill SHALL be invoked before any OpenMole phase skill when the user's intent involves bad smell identification, refactoring planning, or refactoring execution. It SHALL document artifact paths, constitution references, and the ordered workflow explore → (analyze) → plan → apply.

#### Scenario: Agent receives ambiguous refactor request

- **WHEN** a user asks to "refactor this module" without specifying a OpenMole phase
- **THEN** the agent SHALL load `using-openmole` first
- **AND** determine whether to run explore, plan, or apply based on existing `badsmells.md` and `tasks.md` state

### Requirement: OpenMole docs root is discoverable

The framework SHALL resolve the OpenMole documentation root by checking, in order: project `.openmole.yaml` `docs_root`, environment variable `OPENMOLE_DOCS_ROOT`, `docs/openmole/`, then `docs/prd/` as a development fallback.

#### Scenario: Standard docs layout

- **WHEN** `docs/openmole/constitution.md` exists in the target project
- **THEN** all OpenMole skills SHALL read constitution, specification, badsmells, tasks, and analysis from `docs/openmole/`

#### Scenario: Development fallback layout

- **WHEN** `docs/openmole/constitution.md` does not exist but `docs/prd/constitution.md` does
- **THEN** the framework SHALL use `docs/prd/` as the docs root and SHALL NOT fail discovery

### Requirement: Shared templates for OpenMole artifacts

The plugin SHALL provide reusable templates under `templates/` for badsmells entry tables, tasks checklist structure, and revision history tables including the **提交版本** column required by specification §7.

#### Scenario: New project first explore

- **WHEN** `badsmells.md` does not exist and the user runs `mole:explore`
- **THEN** the explore skill SHALL initialize `badsmells.md` using the template with required metadata header and §2.0 index table

### Requirement: Zero-dependency plugin tech stack

The OpenMole plugin SHALL use a zero-dependency technology stack: Markdown skills/commands with YAML frontmatter, JSON multi-harness plugin manifests, Bash hooks and scripts, minimal ESM `package.json` with no runtime dependencies, OpenCode plugin in `.opencode/plugins/openmole.js` using only Node built-in modules, and Shell-based tests under `tests/`.

#### Scenario: Plugin has no npm runtime dependencies

- **WHEN** the OpenMole `package.json` is inspected
- **THEN** it SHALL declare `"type": "module"` and SHALL NOT list runtime `dependencies`
- **AND** OpenCode plugin JS SHALL NOT import third-party npm packages

#### Scenario: Multi-harness manifest parity

- **WHEN** OpenMole is installed on Cursor, Claude Code, Codex, OpenCode, or Gemini CLI
- **THEN** each platform manifest SHALL register the shared `./skills/` and `./commands/` directories
- **AND** Cursor manifest SHALL additionally register `./agents/` and `./hooks/hooks-cursor.json`

#### Scenario: Hooks use Bash session bootstrap

- **WHEN** a Cursor session starts with OpenMole hooks enabled
- **THEN** `hooks/session-start` SHALL execute as Bash with `set -euo pipefail`
- **AND** SHALL inject `using-openmole` skill context into the session

