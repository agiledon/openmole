#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$ROOT/package.json', 'utf8'));
const required = ['files', 'repository', 'engines', 'bin'];
for (const k of required) {
  if (!pkg[k]) { console.error('FAIL: package.json missing', k); process.exit(1); }
}
if (!Array.isArray(pkg.files) || !pkg.files.includes('cli/')) {
  console.error('FAIL: files must include cli/'); process.exit(1);
}
console.log('PASS: package.json publish fields');
"
