# BDR CLI `bdr init` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `bdr init` CLI that bootstraps `bdr/` workspace and configures Cursor + OpenCode (Phase A) via interactive IDE multiselect.

**Architecture:** Single-package `cli/` + `bin/bdr.js`; `@clack/prompts` for TUI; per-IDE adapters with hybrid scope (Cursor user-level, OpenCode project-level); state in `bdr/config.yaml` (`installed_ides`, `init_version`, `init_at`).

**Tech Stack:** Node.js ESM, `@clack/prompts`, zero-dep plugin (`bdr.js`/skills unchanged)

**Design:** [2026-06-05-bdr-cli-init-design.md](../2026-06-05-bdr-cli-init-design.md)

---

## File Map

| File | Responsibility |
|------|----------------|
| `bin/bdr.js` | Shebang entry |
| `cli/index.js` | Command routing |
| `cli/commands/init.js` | Init orchestration |
| `cli/prompts/ide-select.js` | Multiselect TUI |
| `cli/workspace/bootstrap.js` | Directory + config creation |
| `cli/lib/package-root.js` | Resolve BDR package root |
| `cli/lib/config-yaml.js` | Parse/write config.yaml |
| `cli/adapters/cursor.js` | User-level symlink |
| `cli/adapters/opencode.js` | Project opencode.json merge |
| `cli/adapters/stub.js` | warn-and-skip for Phase B IDEs |
| `tests/cli/*.sh` | Integration tests |

---

### Task 1: CLI entry and package.json bin

**Files:**
- Create: `bin/bdr.js`, `cli/index.js`
- Modify: `package.json`

- [ ] **Step 1:** Add to `package.json`:

```json
{
  "bin": { "bdr": "./bin/bdr.js" },
  "dependencies": {
    "@clack/prompts": "^0.7.0"
  }
}
```

- [ ] **Step 2:** Create `bin/bdr.js`:

```javascript
#!/usr/bin/env node
import { main } from '../cli/index.js';
main(process.argv).catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
```

- [ ] **Step 3:** Create `cli/index.js` with `init` subcommand stub and `--help`

- [ ] **Step 4:** Run `chmod +x bin/bdr.js && npm link && bdr --help`

Expected: prints usage

- [ ] **Step 5:** Commit: `feat(cli): add bdr bin entry and command router`

---

### Task 2: Package root resolution

**Files:**
- Create: `cli/lib/package-root.js`
- Test: `tests/cli/test-package-root.sh`

- [ ] **Step 1:** Implement `resolvePackageRoot()` using `BDR_HOME` → `import.meta.url` dirname walk → optional global fallback

- [ ] **Step 2:** Test asserts path contains `skills/` and `.cursor-plugin/plugin.json`

- [ ] **Step 3:** Commit: `feat(cli): add BDR package root resolver`

---

### Task 3: Workspace bootstrap + config.yaml

**Files:**
- Create: `cli/lib/config-yaml.js`, `cli/workspace/bootstrap.js`
- Modify: `templates/bdr-config.yaml.example` (done in design)
- Test: `tests/cli/test-init-workspace.sh`

- [ ] **Step 1:** Write test: temp dir, run `bdr init --ides none`, assert dirs + yaml fields

- [ ] **Step 2:** Implement bootstrap (minimal YAML writer without extra deps — template string or line-based)

- [ ] **Step 3:** Run test → PASS

- [ ] **Step 4:** Commit: `feat(cli): bootstrap bdr workspace and config metadata`

---

### Task 4: IDE multiselect prompt

**Files:**
- Create: `cli/prompts/ide-select.js`

- [ ] **Step 1:** `@clack/prompts` multiselect with 5 options

- [ ] **Step 2:** Wire `--ides cursor,opencode` bypass in `init.js`

- [ ] **Step 3:** Commit: `feat(cli): add interactive IDE multiselect`

---

### Task 5: Cursor adapter

**Files:**
- Create: `cli/adapters/cursor.js`
- Test: `tests/cli/test-init-cursor.sh` (dry-run + real symlink in temp HOME)

- [ ] **Step 1:** Implement `installCursor({ packageRoot, dryRun, homeDir })` → symlink

- [ ] **Step 2:** Update `installed_ides` on success

- [ ] **Step 3:** Commit: `feat(cli): add Cursor user-level adapter`

---

### Task 6: OpenCode adapter

**Files:**
- Create: `cli/adapters/opencode.js`
- Test: `tests/cli/test-init-opencode.sh`

- [ ] **Step 1:** Read/merge `opencode.json` `plugin` array with abs path to `bdr.js`

- [ ] **Step 2:** Support `--global` for `~/.config/opencode/opencode.json`

- [ ] **Step 3:** Backup `.bak` on write

- [ ] **Step 4:** Commit: `feat(cli): add OpenCode project-level adapter`

---

### Task 7: Stub adapters + init orchestration

**Files:**
- Create: `cli/adapters/stub.js`
- Modify: `cli/commands/init.js`

- [ ] **Step 1:** stub warns for gemini/claude/codex, returns `{ skipped: true }`

- [ ] **Step 2:** Full init flow: bootstrap → select → adapters → summary

- [ ] **Step 3:** `--dry-run` prints plan only

- [ ] **Step 4:** extend mode skips configured IDEs in `installed_ides`

- [ ] **Step 5:** Commit: `feat(cli): wire bdr init orchestration with extend and dry-run`

---

### Task 8: Tests and validation

**Files:**
- Create: `tests/cli/test-init-dry-run.sh`, `tests/cli/test-init-extend.sh`
- Create: `scripts/validate-cli.sh`

- [ ] **Step 1:** Add tests to `tests/run-tests.sh` or validate-cli aggregator

- [ ] **Step 2:** Run `bash scripts/validate-cli.sh` → PASS

- [ ] **Step 3:** Commit: `test(cli): add init integration tests`

---

### Task 9: Documentation

**Files:**
- Modify: `README.md`, `.cursor/INSTALL.md`, `.opencode/INSTALL.md`, `scripts/install-cursor-plugin.sh`

- [ ] **Step 1:** README primary install: `npm link` (dev) / `npm install -g bdr` (target)

- [ ] **Step 2:** `install-cursor-plugin.sh` → `bdr init --ides cursor`

- [ ] **Step 3:** Commit: `docs: document bdr init as primary install path`

---

## Spec Coverage Checklist

| Requirement | Task |
|-------------|------|
| `bdr init` command | 1, 7 |
| Interactive multiselect | 4 |
| Workspace bootstrap | 3 |
| config metadata | 3 |
| Cursor adapter | 5 |
| OpenCode adapter | 6 |
| warn-and-skip | 7 |
| dry-run / force / extend | 3, 7 |
| post-install hints | 7 |

## Execution Handoff

Plan saved. Run `/opsx:apply` or subagent-driven development to implement Phase A tasks 1–9.
