#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
bash tests/run-tests.sh
node bin/bdr.js --help >/dev/null
echo "VALIDATION PASSED"
