#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
trap 'rm -rf "$TMP" "$HOME_TMP"' EXIT
export OpenMole_HOME="$ROOT"
export HOME="$HOME_TMP"

node "$ROOT/bin/openmole.js" init "$TMP" --ides claude

test -L "$HOME_TMP/.claude/plugins/local/openmole"
test -f "$ROOT/.claude-plugin/plugin.json"
grep -q 'claude' "$TMP/openmole/config.yaml"

echo "PASS: claude-code adapter (global symlink)"
