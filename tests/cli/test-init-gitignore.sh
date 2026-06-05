#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"

node "$ROOT/bin/bdr.js" init "$TMP" --ides codex

grep -q '# >>> bdr' "$TMP/.gitignore"
grep -q '/plugins/bdr' "$TMP/.gitignore"

node "$ROOT/bin/bdr.js" update "$TMP"
count=$(grep -c '# >>> bdr' "$TMP/.gitignore" || true)
[[ "$count" -eq 1 ]] || { echo "FAIL: expected one bdr gitignore block, got $count"; exit 1; }

echo "PASS: gitignore snippet merged on init and idempotent on update"
