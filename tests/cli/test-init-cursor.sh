#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
trap 'rm -rf "$TMP" "$HOME_TMP"' EXIT
export OpenMole_HOME="$ROOT"
export HOME="$HOME_TMP"

node "$ROOT/bin/openmole.js" init "$TMP" --ides cursor

test -f "$TMP/.cursor/skills/openmole-explore/SKILL.md"
test -f "$TMP/.cursor/commands/mole-explore.md"
grep -q '^name: /mole-explore' "$TMP/.cursor/commands/mole-explore.md"
grep -q 'openmole-explore' "$TMP/.cursor/commands/mole-explore.md"
test -L "$HOME_TMP/.cursor/plugins/local/openmole"
grep -q 'cursor' "$TMP/openmole/config.yaml"

echo "PASS: cursor adapter (project .cursor + global symlink)"
