# bdr-explore

源码扫描与坏味道识别 Skill + `bdr:explore` 命令。

## Requirements

### Requirement: bdr-explore scans source and produces badsmells.md

The `bdr-explore` skill and `bdr:explore` command SHALL scan a user-specified directory or project root, identify code bad smells aligned with constitution §3 first principles (clarity, consistency, readability, reuse, extensibility, robustness, security, simplicity), SOLID, Law of Demeter, Martin Fowler refactoring smells, and language-specific best practices. The output SHALL be written to `{docs_root}/badsmells.md`.

#### Scenario: Full project scan

- **WHEN** the user runs `bdr:explore` with target path `.` or omits path defaulting to project root
- **THEN** the agent SHALL read `{docs_root}/constitution.md` and `{docs_root}/specification.md`
- **AND** analyze source files under the target path
- **AND** produce or update `badsmells.md` with entries conforming to specification §4

#### Scenario: Scoped directory scan

- **WHEN** the user runs `bdr:explore src/foo`
- **THEN** the agent SHALL limit analysis to `src/foo` and dependencies directly referenced
- **AND** SHALL merge findings into the project-wide `badsmells.md` without removing unrelated existing entries unless explicitly superseded

### Requirement: Each bad smell entry includes mandatory fields and status

Every bad smell entry in `badsmells.md` SHALL include: stable ID (`BS-<CATEGORY>-<NNN>`), title, location (files/symbols), description (with Fowler smell label when applicable), aligned principle (constitution §3), acceptance criteria for elimination, and risk/constraints including `[SDD]` when behavior may change. Each entry SHALL have a status of **未清除**, **已消除**, or **部分残余** recorded in the §2.0 index table.

#### Scenario: Newly identified smell

- **WHEN** explore finds a Long Method in `module.py`
- **THEN** a new entry SHALL be appended with status **未清除**
- **AND** the §2.0 index SHALL list the BS-ID with status **未清除**

#### Scenario: Previously eliminated smell unchanged

- **WHEN** explore confirms an entry marked **已消除** still meets its acceptance criteria
- **THEN** the entry status SHALL remain **已消除**
- **AND** the entry body MAY be retained for audit baseline per existing badsmells conventions

### Requirement: explore updates revision history with commit SHA

When `badsmells.md` version is bumped or a new revision history row is added, the explore skill SHALL instruct filling the **提交版本** column per specification §7 using `git rev-parse HEAD` at commit time, or `—` if uncommitted.

#### Scenario: Document version bump after explore

- **WHEN** explore materially changes badsmells content and increments the document version
- **THEN** a new row SHALL be added to the revision history table with columns 版本, 日期, 提交版本, 摘要
- **AND** 提交版本 SHALL be populated according to specification §7 rules
