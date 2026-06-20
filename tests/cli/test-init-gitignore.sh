#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"

node "$ROOT/bin/openmole.js" init "$TMP" --ides gemini

grep -q '# >>> openmole' "$TMP/.gitignore"
grep -q '/.gemini/extensions/openmole' "$TMP/.gitignore"

node "$ROOT/bin/openmole.js" update "$TMP"
count=$(grep -c '# >>> openmole' "$TMP/.gitignore" || true)
[[ "$count" -eq 1 ]] || { echo "FAIL: expected one openmole gitignore block, got $count"; exit 1; }

echo "PASS: gitignore snippet merged on init and idempotent on update"
