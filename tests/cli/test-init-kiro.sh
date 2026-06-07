#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"

node "$ROOT/bin/bdr.js" init "$TMP" --ides kiro

test -f "$TMP/.kiro/skills/bdr-explore-to-change/SKILL.md"
test -f "$TMP/.kiro/commands/bdr-explore.md"
grep -q 'kiro' "$TMP/bdr/config.yaml"

echo "PASS: kiro adapter (project .kiro/)"
