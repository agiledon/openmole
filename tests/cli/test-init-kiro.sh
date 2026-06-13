#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides kiro

test -f "$TMP/.kiro/skills/mole-explore-to-change/SKILL.md"
test -f "$TMP/.kiro/commands/mole-explore.md"
grep -q 'kiro' "$TMP/openmole/config.yaml"

echo "PASS: kiro adapter (project .kiro/)"
