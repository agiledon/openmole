#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node -e "
import('$ROOT/.opencode/plugins/openmole.js').then(async (m) => {
  if (typeof m.OpenMolePlugin !== 'function') throw new Error('OpenMolePlugin export missing');
  const plugin = await m.OpenMolePlugin();
  if (typeof plugin.config !== 'function') throw new Error('config hook missing');
  const config = { skills: { paths: [] }, command: {} };
  await plugin.config(config);
  const expected = ['mole-explore', 'mole-plan', 'mole-verify', 'mole-apply', 'mole-archive'];
  for (const name of expected) {
    if (!config.command[name]?.template) throw new Error('missing command: ' + name);
    if (!config.command[name]?.description) throw new Error('missing description: ' + name);
  }
  console.log('PASS: openmole.js registers 5 commands');
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
