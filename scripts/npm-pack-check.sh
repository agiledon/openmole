#!/usr/bin/env bash
# Verify npm pack includes CLI + plugin artifacts (pre-publish check).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARBALL=$(npm pack --silent)
trap 'rm -f "$TARBALL"' EXIT

echo "==> packed $TARBALL"
tar -tzf "$TARBALL" | grep -q 'package/bin/bdr.js'
tar -tzf "$TARBALL" | grep -q 'package/cli/index.js'
tar -tzf "$TARBALL" | grep -q 'package/skills/bdr-explore-to-change/SKILL.md'
tar -tzf "$TARBALL" | grep -q 'package/.codex-plugin/plugin.json'
tar -tzf "$TARBALL" | grep -q 'package/gemini-extension.json'

echo "PASS: npm pack contains expected paths"
