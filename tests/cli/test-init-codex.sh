#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OPENMOLE_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides codex

# project-level: .codex/skills/
test -f "$TMP/.codex/skills/openmole-explore/SKILL.md"
grep -q 'codex' "$TMP/openmole/config.yaml"

echo "PASS: codex adapter (project .codex/skills/)"
