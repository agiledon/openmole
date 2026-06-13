#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Non-TTY bare openmole shows help (no welcome hang)
node "$ROOT/bin/openmole.js" 2>&1 | grep -q 'Usage:'

# Non-TTY init with --ides skips welcome
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
export OpenMole_HOME="$ROOT"
node "$ROOT/bin/openmole.js" init "$TMP" --ides cursor
test -f "$TMP/.cursor/skills/mole-explore-to-change/SKILL.md"

# Module exports
node --input-type=module -e "
import { isInteractiveWelcome } from '$ROOT/cli/prompts/welcome.js';
if (typeof isInteractiveWelcome !== 'function') process.exit(1);
"

echo "PASS: welcome (non-TTY paths)"
