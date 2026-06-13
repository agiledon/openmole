## Context

BDR currently has a 5-phase workflow: explore, analyze, plan, apply, archive. The "analyze" phase is misplaced — it should come after planning, not before, because it verifies that tasks cover all badsmells. The name "analyze" is also inaccurate; the phase is about verification/diffing of coverage.

Each phase skill currently lacks guidance on what to do next, leaving users unsure of the workflow order.

This is a pure rename + reorder change with no new code logic. The affected files are skills (SKILL.md), commands (.md with YAML frontmatter), plugin manifests (JSON), the OpenCode plugin bootstrap (JS), CLI adapters, specs, and README.

## Goals / Non-Goals

**Goals:**
- Rename command `/bdr-analyze` → `/bdr-verify` and protocol `bdr:analyze` → `bdr:verify`
- Rename skill `bdr-analyze-change` → `bdr-verify-change` in all files
- Reorder workflow: `bdr-explore` → `bdr-plan` → `bdr-verify` → `bdr-apply` → `bdr-archive`
- Add "next step" recommendations to each phase skill
- Update README.md (English + Chinese) with new names and order
- Update all plugin manifests and configs
- Rename the spec directory from `bdr-analyze-change` to `bdr-verify`

**Non-Goals:**
- No changes to the constitution §3-§5 rules
- No changes to the analysis.md output format
- No changes to the .bdr-change.yaml schema
- No changes to CLI behavior or bdr init/update
- No changes to the archive workflow

## Decisions

**Decision 1: Physical file rename vs new file + delete**

For the skill directory `skills/bdr-analyze-change/` → `skills/bdr-verify-change/`, we will rename the directory and update SKILL.md in place. Same for the command file `commands/bdr-analyze.md` → `commands/bdr-verify.md`. Git will track this as a rename naturally.

For the spec directory `openspec/specs/bdr-analyze-change/` → `openspec/specs/bdr-verify/`, we rename and update the content to reflect the new name.

**Decision 2: Recommendations embedded in skill body**

Each phase skill's SKILL.md will include a final instruction to recommend the next step. This ensures the recommendation is always shown regardless of which IDE platform runs the skill.

**Decision 3: Keep analysis.md filename unchanged**

The artifact output file remains `analysis.md` (not renamed to `verification.md`) to maintain backward compatibility with existing changes in `bdr/changes/`. Only the skill/command names change.

**Decision 4: Sequential file updates**

Since this is a mechanical rename/reorder change with many cross-references, we will process files in dependency order: specs first, then skills, then commands, then manifests, then README.

## Risks / Trade-offs

- **Risk**: Users with active changes using `/bdr-analyze` will see the command disappear → **Mitigation**: The rename is breaking by design; users must adopt `/bdr-verify`. Release notes will document the change.
- **Risk**: Search-and-replace may miss references in non-obvious files → **Mitigation**: Use `rg` (ripgrep) to find all references before and after the change to verify completeness.
- **Risk**: IDE-specific manifest formats may have different reference patterns → **Mitigation**: Each manifest type will be updated individually and verified.
