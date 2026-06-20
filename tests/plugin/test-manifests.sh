#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

check_manifest() {
  local file="$1"
  local name="$2"
  [[ -f "$file" ]] || { echo "FAIL: missing $file"; exit 1; }

  node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('$file', 'utf8'));
if (m.name !== '$name') { console.error('FAIL: $file name must be $name'); process.exit(1); }
if (!m.skills) { console.error('FAIL: $file missing skills'); process.exit(1); }
console.log('PASS: $file');
"
}

check_manifest "$ROOT/.cursor-plugin/plugin.json" openmole
check_manifest "$ROOT/.claude-plugin/plugin.json" openmole
check_manifest "$ROOT/gemini-extension.json" openmole

echo "PASS: all plugin manifests ok"
