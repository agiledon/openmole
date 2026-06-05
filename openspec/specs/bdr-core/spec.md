# bdr-core

BDR 元 Skill、插件清单、docs root 解析、共享模板与零依赖技术栈。

## Requirements

### Requirement: Plugin manifest declares BDR skills and commands

The BDR plugin SHALL ship platform-specific manifest files (`.cursor-plugin/plugin.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and OpenCode install instructions) that register the `skills/` and `commands/` directories so harnesses can discover BDR capabilities after installation.

#### Scenario: Cursor installation

- **WHEN** a user installs the BDR plugin in Cursor via marketplace or local path
- **THEN** the agent SHALL expose skills `using-bdr`, `bdr-explore`, `bdr-plan`, `bdr-apply`, and `bdr-analyze`
- **AND** commands `bdr:explore`, `bdr:plan`, `bdr:apply`, and `bdr:analyze` SHALL be available

#### Scenario: Multi-harness skill path consistency

- **WHEN** the same plugin package is installed on Claude Code, Codex CLI, or OpenCode
- **THEN** all harnesses SHALL load skills from the shared `./skills/` directory without duplicated skill content

### Requirement: using-bdr meta skill routes agents to correct BDR workflow

The `using-bdr` skill SHALL be invoked before any BDR phase skill when the user's intent involves bad smell identification, refactoring planning, or refactoring execution. It SHALL document artifact paths, constitution references, and the ordered workflow explore → (analyze) → plan → apply.

#### Scenario: Agent receives ambiguous refactor request

- **WHEN** a user asks to "refactor this module" without specifying a BDR phase
- **THEN** the agent SHALL load `using-bdr` first
- **AND** determine whether to run explore, plan, or apply based on existing `badsmells.md` and `tasks.md` state

### Requirement: BDR docs root is discoverable

The framework SHALL resolve the BDR documentation root by checking, in order: project `.bdr.yaml` `docs_root`, environment variable `BDR_DOCS_ROOT`, `docs/bdr/`, then `docs/prd/` as a development fallback.

#### Scenario: Standard docs layout

- **WHEN** `docs/bdr/constitution.md` exists in the target project
- **THEN** all BDR skills SHALL read constitution, specification, badsmells, tasks, and analysis from `docs/bdr/`

#### Scenario: Development fallback layout

- **WHEN** `docs/bdr/constitution.md` does not exist but `docs/prd/constitution.md` does
- **THEN** the framework SHALL use `docs/prd/` as the docs root and SHALL NOT fail discovery

### Requirement: Shared templates for BDR artifacts

The plugin SHALL provide reusable templates under `templates/` for badsmells entry tables, tasks checklist structure, and revision history tables including the **提交版本** column required by specification §7.

#### Scenario: New project first explore

- **WHEN** `badsmells.md` does not exist and the user runs `bdr:explore`
- **THEN** the explore skill SHALL initialize `badsmells.md` using the template with required metadata header and §2.0 index table

### Requirement: Zero-dependency plugin tech stack

The BDR plugin SHALL use a zero-dependency technology stack: Markdown skills/commands with YAML frontmatter, JSON multi-harness plugin manifests, Bash hooks and scripts, minimal ESM `package.json` with no runtime dependencies, OpenCode plugin in `.opencode/plugins/bdr.js` using only Node built-in modules, and Shell-based tests under `tests/`.

#### Scenario: Plugin has no npm runtime dependencies

- **WHEN** the BDR `package.json` is inspected
- **THEN** it SHALL declare `"type": "module"` and SHALL NOT list runtime `dependencies`
- **AND** OpenCode plugin JS SHALL NOT import third-party npm packages

#### Scenario: Multi-harness manifest parity

- **WHEN** BDR is installed on Cursor, Claude Code, Codex, OpenCode, or Gemini CLI
- **THEN** each platform manifest SHALL register the shared `./skills/` and `./commands/` directories
- **AND** Cursor manifest SHALL additionally register `./agents/` and `./hooks/hooks-cursor.json`

#### Scenario: Hooks use Bash session bootstrap

- **WHEN** a Cursor session starts with BDR hooks enabled
- **THEN** `hooks/session-start` SHALL execute as Bash with `set -euo pipefail`
- **AND** SHALL inject `using-bdr` skill context into the session
