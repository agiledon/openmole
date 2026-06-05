#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

node -e "
import { toCursorProjectCommand } from '$ROOT/cli/adapters/cursor.js';
const src = \`---
name: bdr-explore
description: test desc
---

Load skill.\`;
const out = toCursorProjectCommand(src, 'bdr-explore');
if (!out.includes('name: /bdr-explore')) throw new Error('missing slash name');
if (!out.includes('id: bdr-explore')) throw new Error('missing id');
console.log('PASS: cursor command transform');
"
