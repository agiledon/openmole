#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Non-TTY bare bdr shows help (no welcome hang)
node "$ROOT/bin/bdr.js" 2>&1 | grep -q 'Usage:'

# Non-TTY init with --ides skips welcome
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export BDR_HOME="$ROOT"
node "$ROOT/bin/bdr.js" init "$TMP" --ides cursor
test -f "$TMP/.cursor/skills/bdr-explore-to-change/SKILL.md"

# Module exports
node --input-type=module -e "
import { isInteractiveWelcome } from '$ROOT/cli/prompts/welcome.js';
if (typeof isInteractiveWelcome !== 'function') process.exit(1);
"

echo "PASS: welcome (non-TTY paths)"
