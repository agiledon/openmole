#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
trap 'rm -rf "$TMP" "$HOME_TMP"' EXIT
export OpenMole_HOME="$ROOT"
export HOME="$HOME_TMP"

node "$ROOT/bin/openmole.js" init "$TMP" --ides cursor,gemini

# Simulate package upgrade
node -e "
const fs=require('fs');
const p='$ROOT/package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.version='9.9.9-test';
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
"

node "$ROOT/bin/openmole.js" update "$TMP"

grep -q '9.9.9-test' "$TMP/openmole/config.yaml"
test -f "$TMP/.cursor/skills/mole-explore-to-change/SKILL.md"
test -f "$TMP/.gemini/skills/mole-explore-to-change/SKILL.md"

# Restore version
node -e "
const fs=require('fs');
const p='$ROOT/package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.version='0.5.0';
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
"

echo "PASS: openmole update refreshes IDE configs and init_version"
