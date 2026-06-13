#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides opencode 2>&1 | grep -q 'opencode'
test -f "$TMP/opencode.json"
test -f "$TMP/openmole/config.yaml"
grep -q 'opencode' "$TMP/openmole/config.yaml"

echo "PASS: opencode adapter"
