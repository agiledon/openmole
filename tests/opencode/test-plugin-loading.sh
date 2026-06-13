#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node -e "
import('$ROOT/.opencode/plugins/openmole.js').then(m => {
  if (typeof m.BdrPlugin !== 'function') throw new Error('BdrPlugin export missing');
  console.log('PASS: openmole.js loads');
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
