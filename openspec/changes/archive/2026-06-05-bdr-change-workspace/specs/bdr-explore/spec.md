## MODIFIED Requirements

### Requirement: bdr-explore-to-change scans source and produces badsmells.md

The `bdr-explore-to-change` skill and `bdr:explore` command SHALL scan a user-specified directory or project root, identify code bad smells aligned with constitution §3 and specification §4, and write output to `bdr/changes/<change-name>/badsmells.md`. Each `bdr:explore` invocation that starts a new BDR cycle SHALL create or designate a **new change** unless the user explicitly continues the current change.

#### Scenario: Full project scan with explicit change name

- **WHEN** the user runs `bdr:explore . refactor-utils`
- **THEN** the agent SHALL create `bdr/changes/refactor-utils/`
- **AND** SHALL write `badsmells.md` under that directory

#### Scenario: Auto-derived change name

- **WHEN** the user runs `bdr:explore src/auth` without a change name
- **THEN** the agent SHALL propose a kebab-case change name derived from scan scope and intent
- **AND** SHALL create the change directory only after user confirmation of the name

#### Scenario: Scoped directory scan

- **WHEN** the user runs `bdr:explore src/foo my-change`
- **THEN** the agent SHALL limit analysis to `src/foo` and dependencies directly referenced
- **AND** SHALL write findings to `bdr/changes/my-change/badsmells.md`

### Requirement: explore deduplicates against prior changes

Before adding new bad smell entries, explore SHALL load BS-ID and location fingerprints from all prior changes under `bdr/changes/` (including `archive/`) and SHALL NOT create duplicate entries for the same file location and smell class already tracked in another change.

#### Scenario: Smell already cleared in archived change

- **WHEN** explore detects a Long Method at `src/foo/bar.py` already marked **已消除** in an archived change
- **THEN** explore SHALL skip creating a new entry for that fingerprint
- **AND** SHALL note the prior change reference in explore output

#### Scenario: Smell still open in another active change

- **WHEN** explore detects a smell matching an **未清除** entry in another change
- **THEN** explore SHALL warn about duplication
- **AND** SHALL NOT silently create a conflicting BS-ID for the same location

## MODIFIED Requirements

### Requirement: explore updates revision history with commit SHA

When `badsmells.md` version is bumped or a new revision history row is added, the explore skill SHALL instruct filling the **提交版本** column per specification §7 using `git rev-parse HEAD` at commit time, or `—` if uncommitted.
