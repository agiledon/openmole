#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides qoder

test -f "$TMP/.qoder/skills/mole-explore-to-change/SKILL.md"
test -f "$TMP/.qoder/commands/mole-explore.md"
grep -q 'qoder' "$TMP/openmole/config.yaml"

echo "PASS: qoder adapter (project .qoder/)"
