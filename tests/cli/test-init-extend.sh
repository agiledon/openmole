#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"

node "$ROOT/bin/bdr.js" init "$TMP" --ides cursor
node "$ROOT/bin/bdr.js" init "$TMP" --ides opencode

grep -q 'cursor' "$TMP/bdr/config.yaml"
grep -q 'opencode' "$TMP/bdr/config.yaml"

echo "PASS: extend mode preserves ides"
