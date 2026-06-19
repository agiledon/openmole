#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node -e "
import('$ROOT/.opencode/plugins/openmole.js').then(m => {
  if (typeof m.OpenMolePlugin !== 'function') throw new Error('OpenMolePlugin export missing');
  console.log('PASS: openmole.js loads');
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
