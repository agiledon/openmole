#!/usr/bin/env bash
# Deprecated: use `openmole init --ides cursor` after npm link.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export OPENMOLE_HOME="$ROOT"
exec node "$ROOT/bin/openmole.js" init "${1:-.}" --ides cursor
