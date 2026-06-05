#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="$ROOT/.cursor-plugin/plugin.json"

[[ -f "$MANIFEST" ]] || { echo "FAIL: missing $MANIFEST"; exit 1; }

node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('$MANIFEST', 'utf8'));
const required = ['name', 'displayName', 'skills', 'commands'];
for (const k of required) {
  if (!m[k]) { console.error('FAIL: missing field', k); process.exit(1); }
}
if (m.name !== 'bdr') { console.error('FAIL: name must be bdr'); process.exit(1); }
console.log('PASS: manifest fields ok');
"
