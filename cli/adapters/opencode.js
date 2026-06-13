import path from 'path';
import { readJson, writeJsonWithBackup } from '../lib/json-config.js';

export function installOpenCode({ packageRoot, targetDir, global, dryRun }) {
  if (!global && !targetDir) {
    throw new Error('targetDir required for project-level OpenCode config');
  }

  const pluginPath = path.join(packageRoot, '.opencode', 'plugins', 'openmole.js');
  const configPath = global
    ? path.join(process.env.HOME || '', '.config', 'opencode', 'opencode.json')
    : path.join(targetDir, 'opencode.json');

  const existing = readJson(configPath);
  const plugins = Array.isArray(existing.plugin) ? [...existing.plugin] : [];
  if (!plugins.includes(pluginPath)) {
    plugins.push(pluginPath);
  }
  const merged = { ...existing, plugin: plugins };
  const action = `merge plugin into ${configPath}`;

  if (dryRun) {
    return { ide: 'opencode', action, pluginPath, dryRun: true };
  }

  const { written, backup } = writeJsonWithBackup(configPath, merged, dryRun);
  return { ide: 'opencode', action, pluginPath, configPath, written, backup };
}
