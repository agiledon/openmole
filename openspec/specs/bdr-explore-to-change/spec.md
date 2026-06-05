# bdr-explore-to-change

Scan source and produce badsmells.md within a BDR change directory.

## Requirements

### Requirement: bdr-explore-to-change scans source and produces badsmells.md

The `bdr-explore-to-change` skill and `bdr:explore` command SHALL scan a user-specified directory, identify bad smells aligned with constitution §3 and specification §4, and write output to `bdr/changes/<change-name>/badsmells.md`.

#### Scenario: Full project scan with explicit change name

- **WHEN** the user runs `bdr:explore . refactor-utils`
- **THEN** the agent SHALL create `bdr/changes/refactor-utils/`
- **AND** SHALL write `badsmells.md` under that directory

#### Scenario: Active change continuation prompt

- **WHEN** `bdr/config.yaml` has an active `current_change` and the user runs `bdr:explore` without a new change name
- **THEN** the agent SHALL ask whether to continue the current change or create a new one

#### Scenario: Scoped directory scan

- **WHEN** the user runs `bdr:explore src/foo my-change`
- **THEN** the agent SHALL limit analysis to `src/foo`
- **AND** SHALL write findings to `bdr/changes/my-change/badsmells.md`

### Requirement: explore deduplicates against prior changes

Before adding entries, explore SHALL load fingerprints from `bdr/changes/` and `bdr/changes/archive/` and SHALL NOT duplicate smells already tracked.

#### Scenario: Smell already cleared in archived change

- **WHEN** explore detects a smell already **已消除** in an archived change
- **THEN** explore SHALL skip creating a new entry for that fingerprint

### Requirement: explore updates revision history with commit SHA

When revision history gains a row, explore SHALL fill **提交版本** per specification §7 using `git rev-parse HEAD` or `—`.
