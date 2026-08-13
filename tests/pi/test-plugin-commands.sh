#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node --input-type=module -e "
import('$ROOT/.pi/extensions/openmole.ts').then(async (m) => {
  if (typeof m.default !== 'function') throw new Error('default export missing');

  const commands = {};
  const handlers = {};
  const pi = {
    on(event, handler) { handlers[event] = handler; },
    registerCommand(name, opts) { commands[name] = opts; },
    sendUserMessage() {},
  };
  m.default(pi);

  const expected = ['mole-explore', 'mole-plan', 'mole-verify', 'mole-apply', 'mole-archive'];
  for (const name of expected) {
    if (!commands[name]) throw new Error('missing command: ' + name);
    if (!commands[name].description) throw new Error('missing description: ' + name);
    if (typeof commands[name].handler !== 'function') throw new Error('missing handler: ' + name);
  }

  if (typeof handlers['resources_discover'] !== 'function') throw new Error('resources_discover hook missing');
  const res = handlers['resources_discover']();
  if (!Array.isArray(res.skillPaths) || res.skillPaths.length !== 1) throw new Error('skillPaths missing');
  if (!res.skillPaths[0].endsWith('/skills')) throw new Error('skillPaths should point to skills dir: ' + res.skillPaths[0]);

  if (typeof handlers['before_agent_start'] !== 'function') throw new Error('before_agent_start hook missing');
  const injected = await handlers['before_agent_start']({}, { sessionManager: { getEntries: () => [] } });
  if (!injected?.message?.customType) throw new Error('bootstrap message not injected');

  console.log('PASS: openmole.ts registers 5 commands + skills path + bootstrap');
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
