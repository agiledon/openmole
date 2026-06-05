#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export BDR_HOME="$ROOT"
node -e "
import { resolvePackageRoot } from '$ROOT/cli/lib/package-root.js';
const root = resolvePackageRoot();
import fs from 'fs';
import path from 'path';
for (const m of ['skills', '.cursor-plugin/plugin.json']) {
  if (!fs.existsSync(path.join(root, m))) throw new Error('missing ' + m);
}
console.log('PASS: package root', root);
"
