#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides pi 2>&1 | grep -q 'pi'
test -f "$TMP/.pi/settings.json"
test -f "$TMP/openmole/config.yaml"
grep -q 'pi' "$TMP/openmole/config.yaml"
grep -q 'extensions' "$TMP/.pi/settings.json"
grep -q 'openmole.ts' "$TMP/.pi/settings.json"

echo "PASS: pi adapter"
