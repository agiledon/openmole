#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
export OpenMole_HOME="$ROOT"
export HOME="$HOME_TMP"

ORIG_VERSION=$(node -p "require('$ROOT/package.json').version")

restore_version() {
  node -e "
const fs = require('fs');
const p = '$ROOT/package.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.version = '$ORIG_VERSION';
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
"
}
trap 'restore_version; rm -rf "$TMP" "$HOME_TMP"' EXIT

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
test -f "$TMP/.cursor/skills/openmole-explore/SKILL.md"
test -f "$TMP/.gemini/skills/openmole-explore/SKILL.md"

echo "PASS: openmole update refreshes IDE configs and init_version"
