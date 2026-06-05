#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
for t in tests/plugin/*.sh tests/opencode/*.sh; do
  [[ -f "$t" ]] || continue
  echo "==> $t"
  bash "$t"
done
echo "ALL TESTS PASSED"
