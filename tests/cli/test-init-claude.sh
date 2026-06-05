#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
trap 'rm -rf "$TMP" "$HOME_TMP"' EXIT
export BDR_HOME="$ROOT"
export HOME="$HOME_TMP"

node "$ROOT/bin/bdr.js" init "$TMP" --ides claude

test -L "$HOME_TMP/.claude/plugins/local/bdr"
test -f "$ROOT/.claude-plugin/plugin.json"
grep -q 'claude' "$TMP/bdr/config.yaml"

echo "PASS: claude-code adapter (global symlink)"
