#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
for skill in openmole-explore openmole-plan openmole-verify openmole-apply openmole-archive; do
  f="$ROOT/skills/$skill/SKILL.md"
  [[ -f "$f" ]] || { echo "FAIL: missing $f"; exit 1; }
  grep -q 'openmole/config.yaml' "$f" || { echo "FAIL: $f missing openmole/config.yaml"; exit 1; }
  grep -q 'change_dir' "$f" || { echo "FAIL: $f missing change_dir"; exit 1; }
done
echo "PASS: workspace keywords in skills"
