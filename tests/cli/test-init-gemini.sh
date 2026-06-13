#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides gemini

test -f "$TMP/.gemini/skills/mole-explore-to-change/SKILL.md"
test -f "$TMP/.gemini/commands/mole-explore.md"
test -L "$TMP/.gemini/extensions/openmole"
grep -q 'gemini' "$TMP/openmole/config.yaml"

echo "PASS: gemini-cli adapter (project .gemini/)"
