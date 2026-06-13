import path from 'path';
import { symlinkDir } from '../lib/fs-helpers.js';
import { mergeMarketplacePlugin, readJson, writeJsonWithBackup } from '../lib/json-config.js';

const PLUGIN_LINK = './plugins/openmole';

/** Project-level Codex: plugins/openmole symlink + .agents/plugins/marketplace.json entry. */
export function installCodex({ packageRoot, targetDir, dryRun, force = true }) {
  const pluginLink = path.join(targetDir, 'plugins', 'openmole');
  const marketplacePath = path.join(targetDir, '.agents', 'plugins', 'marketplace.json');

  const link = symlinkDir({ source: packageRoot, target: pluginLink, dryRun, force });
  const action = `symlink ${packageRoot} -> ${pluginLink}; merge ${marketplacePath}`;

  if (dryRun) {
    return { ide: 'codex', action, pluginLink, marketplacePath, dryRun: true };
  }

  const merged = mergeMarketplacePlugin(readJson(marketplacePath), {
    name: 'openmole',
    pluginPath: PLUGIN_LINK,
  });
  const { written, backup } = writeJsonWithBackup(marketplacePath, merged, dryRun);

  return {
    ide: 'codex',
    action,
    pluginLink: link.target || pluginLink,
    marketplacePath,
    written,
    backup,
  };
}
