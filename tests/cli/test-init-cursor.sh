#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
trap 'rm -rf "$TMP" "$HOME_TMP"' EXIT
export BDR_HOME="$ROOT"
export HOME="$HOME_TMP"

node "$ROOT/bin/bdr.js" init "$TMP" --ides cursor

test -L "$HOME_TMP/.cursor/plugins/local/bdr"
grep -q 'cursor' "$TMP/bdr/config.yaml"

echo "PASS: cursor adapter"
