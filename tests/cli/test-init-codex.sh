#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides codex

test -L "$TMP/plugins/openmole"
test -f "$TMP/.agents/plugins/marketplace.json"
grep -q '"name": "openmole"' "$TMP/.agents/plugins/marketplace.json"
grep -q '"path": "./plugins/openmole"' "$TMP/.agents/plugins/marketplace.json"
grep -q 'codex' "$TMP/openmole/config.yaml"

echo "PASS: codex adapter (plugin symlink + marketplace)"
