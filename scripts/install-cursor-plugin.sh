#!/usr/bin/env bash
# Symlink BDR plugin into Cursor local plugins directory for path-install testing.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${HOME}/.cursor/plugins/local/bdr"
mkdir -p "${HOME}/.cursor/plugins/local"
ln -sfn "$ROOT" "$TARGET"
echo "Linked: $TARGET -> $ROOT"
echo "Restart Cursor (Cmd+Q) and verify /bdr-explore in Agent chat."
