#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides cursor --dry-run

test ! -f "$TMP/openmole/config.yaml"
echo "PASS: dry-run writes nothing"
