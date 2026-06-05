#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
trap 'rm -rf "$TMP" "$HOME_TMP"' EXIT
export BDR_HOME="$ROOT"
export HOME="$HOME_TMP"

node "$ROOT/bin/bdr.js" init "$TMP" --ides cursor

test -f "$TMP/.cursor/skills/bdr-explore-to-change/SKILL.md"
test -f "$TMP/.cursor/commands/bdr-explore.md"
grep -q '^name: /bdr-explore' "$TMP/.cursor/commands/bdr-explore.md"
grep -q 'bdr-explore-to-change' "$TMP/.cursor/commands/bdr-explore.md"
test -L "$HOME_TMP/.cursor/plugins/local/bdr"
grep -q 'cursor' "$TMP/bdr/config.yaml"

echo "PASS: cursor adapter (project .cursor + global symlink)"
