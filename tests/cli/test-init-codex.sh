#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"

node "$ROOT/bin/bdr.js" init "$TMP" --ides codex

test -L "$TMP/plugins/bdr"
test -f "$TMP/.agents/plugins/marketplace.json"
grep -q '"name": "bdr"' "$TMP/.agents/plugins/marketplace.json"
grep -q '"path": "./plugins/bdr"' "$TMP/.agents/plugins/marketplace.json"
grep -q 'codex' "$TMP/bdr/config.yaml"

echo "PASS: codex adapter (plugin symlink + marketplace)"
