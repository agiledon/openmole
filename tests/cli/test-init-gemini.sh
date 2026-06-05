#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"

node "$ROOT/bin/bdr.js" init "$TMP" --ides gemini

test -f "$TMP/.gemini/skills/bdr-explore-to-change/SKILL.md"
test -f "$TMP/.gemini/commands/bdr-explore.md"
test -L "$TMP/.gemini/extensions/bdr"
grep -q 'gemini' "$TMP/bdr/config.yaml"

echo "PASS: gemini-cli adapter (project .gemini/)"
