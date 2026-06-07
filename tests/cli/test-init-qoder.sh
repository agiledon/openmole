#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"

node "$ROOT/bin/bdr.js" init "$TMP" --ides qoder

test -f "$TMP/.qoder/skills/bdr-explore-to-change/SKILL.md"
test -f "$TMP/.qoder/commands/bdr-explore.md"
grep -q 'qoder' "$TMP/bdr/config.yaml"

echo "PASS: qoder adapter (project .qoder/)"
