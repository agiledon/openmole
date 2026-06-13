#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "Running plugin tests..."
bash tests/run-tests.sh
echo "Checking commands reference existing skills..."
for cmd in commands/mole-*.md; do
  [[ -f "$cmd" ]] || continue
  skill=$(basename "$cmd" .md)
  grep -q "$skill" "$cmd" || { echo "FAIL: $cmd missing skill ref"; exit 1; }
done
echo "VALIDATION PASSED"
