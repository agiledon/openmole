#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
shopt -s nullglob
files=("$ROOT"/commands/bdr-*.md)
[[ ${#files[@]} -eq 5 ]] || { echo "FAIL: expected 5 BDR commands, got ${#files[@]}"; exit 1; }
for f in "${files[@]}"; do
  grep -q '^name:' "$f" || { echo "FAIL: missing name in $f"; exit 1; }
  grep -q '^description:' "$f" || { echo "FAIL: missing description in $f"; exit 1; }
  base=$(basename "$f" .md)
  grep -q "^name: ${base}$" "$f" || { echo "FAIL: name must match filename in $f"; exit 1; }
done
echo "PASS: command frontmatter ok (${#files[@]} commands)"
