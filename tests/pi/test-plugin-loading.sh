#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node --input-type=module -e "
import('$ROOT/.pi/extensions/openmole.ts').then(m => {
  if (typeof m.default !== 'function') throw new Error('default export missing');
  console.log('PASS: openmole.ts loads');
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
