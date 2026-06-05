#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"

node "$ROOT/bin/bdr.js" init "$TMP" --none

test -f "$TMP/bdr/config.yaml"
test -d "$TMP/bdr/changes/archive"
grep -q 'installed_ides: \[\]' "$TMP/bdr/config.yaml"
grep -q 'init_version:' "$TMP/bdr/config.yaml"
grep -q 'init_at:' "$TMP/bdr/config.yaml"

echo "PASS: workspace bootstrap"
