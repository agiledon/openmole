#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
bash tests/run-tests.sh
node bin/openmole.js --help >/dev/null
bash scripts/npm-pack-check.sh
echo "VALIDATION PASSED"
