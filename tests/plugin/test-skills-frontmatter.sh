#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
shopt -s nullglob
files=("$ROOT"/skills/*/SKILL.md)
[[ ${#files[@]} -gt 0 ]] || { echo "FAIL: no SKILL.md files"; exit 1; }
for f in "${files[@]}"; do
  grep -q '^name:' "$f" || { echo "FAIL: missing name in $f"; exit 1; }
  grep -q '^description:' "$f" || { echo "FAIL: missing description in $f"; exit 1; }
done
echo "PASS: frontmatter ok (${#files[@]} skills)"
