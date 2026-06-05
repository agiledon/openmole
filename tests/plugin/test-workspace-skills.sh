#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
for skill in bdr-explore bdr-analyze bdr-plan bdr-apply bdr-archive; do
  f="$ROOT/skills/$skill/SKILL.md"
  [[ -f "$f" ]] || { echo "FAIL: missing $f"; exit 1; }
  grep -q 'bdr/config.yaml' "$f" || { echo "FAIL: $f missing bdr/config.yaml"; exit 1; }
  grep -q 'change_dir' "$f" || { echo "FAIL: $f missing change_dir"; exit 1; }
done
echo "PASS: workspace keywords in skills"
