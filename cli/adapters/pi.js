import os from 'os';
import path from 'path';
import { readJson, writeJsonWithBackup } from '../lib/json-config.js';

export function installPi({ packageRoot, targetDir, global, dryRun }) {
  if (!global && !targetDir) {
    throw new Error('targetDir required for project-level Pi config');
  }

  const extensionPath = path.join(packageRoot, '.pi', 'extensions', 'openmole.ts');
  const configPath = global
    ? path.join(os.homedir(), '.pi', 'agent', 'settings.json')
    : path.join(targetDir, '.pi', 'settings.json');

  const existing = readJson(configPath);
  const extensions = Array.isArray(existing.extensions) ? [...existing.extensions] : [];
  if (!extensions.includes(extensionPath)) {
    extensions.push(extensionPath);
  }
  const merged = { ...existing, extensions };
  const action = `merge extension into ${configPath}`;

  if (dryRun) {
    return { ide: 'pi', action, extensionPath, dryRun: true };
  }

  const { written, backup } = writeJsonWithBackup(configPath, merged, dryRun);
  return { ide: 'pi', action, extensionPath, configPath, written, backup };
}
