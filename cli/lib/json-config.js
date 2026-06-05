import fs from 'fs';
import path from 'path';

export function readJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJsonWithBackup(filePath, data, dryRun) {
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

/** Merge or replace a plugin entry in a Codex-style marketplace.json. */
export function mergeMarketplacePlugin(existing, { name, pluginPath }) {
  const marketplace = { ...existing };
  if (!marketplace.name) marketplace.name = 'bdr-local';
  if (!marketplace.interface) marketplace.interface = { displayName: 'BDR Local' };
  if (!Array.isArray(marketplace.plugins)) marketplace.plugins = [];

  const entry = {
    name,
    source: { source: 'local', path: pluginPath },
    policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
    category: 'Productivity',
  };

  const idx = marketplace.plugins.findIndex((p) => p.name === name);
  if (idx >= 0) marketplace.plugins[idx] = entry;
  else marketplace.plugins.push(entry);

  return marketplace;
}
