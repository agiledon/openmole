#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node -e "
import('$ROOT/.opencode/plugins/bdr.js').then(m => {
  if (typeof m.BdrPlugin !== 'function') throw new Error('BdrPlugin export missing');
  console.log('PASS: bdr.js loads');
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
