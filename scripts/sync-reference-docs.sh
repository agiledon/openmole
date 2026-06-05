#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/docs/prd"
DEST="$ROOT/docs/reference/bdr"
mkdir -p "$DEST"
for f in constitution.md specification.md badsmells.md tasks.md analysis.md README.md; do
  cp "$SRC/$f" "$DEST/$f"
done
echo "Synced docs/prd → docs/reference/bdr"
