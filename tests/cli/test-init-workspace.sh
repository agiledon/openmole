#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --none

test -f "$TMP/openmole/config.yaml"
test -d "$TMP/openmole/changes/archive"
grep -q 'installed_ides: \[\]' "$TMP/openmole/config.yaml"
grep -q 'init_version:' "$TMP/openmole/config.yaml"
grep -q 'init_at:' "$TMP/openmole/config.yaml"

echo "PASS: workspace bootstrap"
