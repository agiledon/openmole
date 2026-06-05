#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
HOME_TMP=$(mktemp -d)
trap 'rm -rf "$TMP" "$HOME_TMP"' EXIT
export BDR_HOME="$ROOT"
export HOME="$HOME_TMP"

node "$ROOT/bin/bdr.js" init "$TMP" --ides cursor,gemini

# Simulate package upgrade
node -e "
const fs=require('fs');
const p='$ROOT/package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.version='9.9.9-test';
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
"

node "$ROOT/bin/bdr.js" update "$TMP"

grep -q '9.9.9-test' "$TMP/bdr/config.yaml"
test -f "$TMP/.cursor/skills/bdr-explore-to-change/SKILL.md"
test -f "$TMP/.gemini/skills/bdr-explore-to-change/SKILL.md"

# Restore version
node -e "
const fs=require('fs');
const p='$ROOT/package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.version='0.4.0';
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
"

echo "PASS: bdr update refreshes IDE configs and init_version"
