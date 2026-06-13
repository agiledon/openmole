## ADDED Requirements

### Requirement: openmole-plan creates tasks from uncleared bad smells

The `openmole-plan` skill and `mole:plan` command SHALL read `{docs_root}/badsmells.md`, select entries with status **未清除** or **部分残余**, and produce or update `{docs_root}/tasks.md` with refactoring tasks traceable to BS-IDs. Tasks SHALL NOT be invented without a corresponding badsmells entry.

#### Scenario: Plan from uncleared backlog

- **WHEN** `badsmells.md` contains BS-CLARITY-001 with status **未清除**
- **THEN** `tasks.md` SHALL include at least one task referencing `BS-CLARITY-001`
- **AND** the task SHALL include dependency order, involved paths, DoD, and SDD linkage flag

#### Scenario: Skip cleared smells

- **WHEN** all entries in `badsmells.md` are **已消除**
- **THEN** plan SHALL report no new tasks are required
- **AND** SHALL NOT add refactoring tasks unrelated to badsmells entries

### Requirement: Each task includes constitution standard steps with execution status

Each task in `tasks.md` SHALL map to constitution §4 steps: confirm smell, assess/add test coverage, run tests green, refactor, regression green, user confirmation. Each step and task SHALL use checkbox or explicit status (**已执行** / **未执行**) trackable by `mole:apply`.

#### Scenario: Task without test coverage

- **WHEN** plan identifies uncovered code for BS-REUSE-002
- **THEN** the task steps SHALL include writing unit tests first using language-appropriate mock frameworks (e.g., pytest/unittest.mock for Python, JUnit/Mockito for Java) without changing production behavior
- **AND** SHALL include running the full relevant test suite until green before refactoring steps

#### Scenario: Optional coverage measurement

- **WHEN** the project supports coverage tooling
- **THEN** plan MAY include a step to compute coverage (e.g., `pytest --cov`, JaCoCo) and record baseline in the task notes

### Requirement: plan enforces analyze gate after badsmells changes

When `badsmells.md` version or substantive content has changed since the last `tasks.md` sync, `mole:plan` SHALL require running `mole:verify` first (or embed equivalent diff logic) to update `analysis.md` and reconcile `tasks.md` before adding new tasks.

#### Scenario: Stale tasks after badsmells update

- **WHEN** `badsmells.md` version is newer than the version referenced in `tasks.md` header
- **THEN** plan SHALL NOT proceed with new task creation until analyze diff is completed
- **AND** outdated tasks SHALL be marked or revised per analysis output

### Requirement: plan updates tasks revision history

When `tasks.md` version is bumped or revision history gains a row, plan SHALL follow specification §7 **提交版本** rules identical to badsmells.

#### Scenario: Tasks document version bump

- **WHEN** plan materially updates `tasks.md`
- **THEN** revision history SHALL gain a row with 提交版本 per specification §7
