#!/usr/bin/env bash
# Deprecated: use `bdr init --ides cursor` after npm link.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export BDR_HOME="$ROOT"
exec node "$ROOT/bin/bdr.js" init "${1:-.}" --ides cursor
