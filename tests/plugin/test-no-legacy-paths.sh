#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
[[ ! -d "$ROOT/skills/using-bdr" ]] || { echo "FAIL: using-bdr still exists"; exit 1; }
[[ ! -f "$ROOT/.bdr.yaml" ]] || { echo "FAIL: .bdr.yaml still exists"; exit 1; }
for f in "$ROOT"/skills/*/SKILL.md; do
  grep -q 'docs_root' "$f" && { echo "FAIL: docs_root in $f"; exit 1; }
  grep -q 'docs/prd' "$f" && { echo "FAIL: docs/prd in $f"; exit 1; }
  grep -q 'using-bdr' "$f" && { echo "FAIL: using-bdr ref in $f"; exit 1; }
done
echo "PASS: no legacy paths"
