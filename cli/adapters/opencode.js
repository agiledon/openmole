import fs from 'fs';
import path from 'path';

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonWithBackup(filePath, data, dryRun) {
  const content = JSON.stringify(data, null, 2) + '\n';
  if (dryRun) return { written: false, backup: null };

  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, `${filePath}.bak`);
  } else {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return { written: true, backup: fs.existsSync(`${filePath}.bak`) ? `${filePath}.bak` : null };
}

export function installOpenCode({ packageRoot, targetDir, global, dryRun }) {
  const pluginPath = path.join(packageRoot, '.opencode', 'plugins', 'bdr.js');
  const configPath = global
    ? path.join(process.env.HOME || '', '.config', 'opencode', 'opencode.json')
    : path.join(targetDir, 'opencode.json');

  if (!global && !targetDir) {
    throw new Error('targetDir required for project-level OpenCode config');
  }

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
