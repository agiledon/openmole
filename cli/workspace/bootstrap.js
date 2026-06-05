import fs from 'fs';
import path from 'path';
import { readConfigFile, writeConfigFile, DEFAULT_CONFIG, mergeInstalledIdes } from '../lib/config-yaml.js';

export function workspacePaths(targetDir) {
  const bdrDir = path.join(targetDir, 'bdr');
  return {
    bdrDir,
    configPath: path.join(bdrDir, 'config.yaml'),
    changesDir: path.join(bdrDir, 'changes'),
    archiveDir: path.join(bdrDir, 'changes', 'archive'),
  };
}

/**
 * Bootstrap bdr/ workspace. Returns { config, created, extended }.
 */
export function bootstrapWorkspace({ targetDir, packageVersion, force, dryRun }) {
  const { bdrDir, configPath, changesDir, archiveDir } = workspacePaths(targetDir);
  const existing = readConfigFile(configPath);
  const extended = Boolean(existing) && !force;

  let config;
  if (existing && !force) {
    config = { ...existing };
  } else if (existing && force) {
    config = {
      ...DEFAULT_CONFIG,
      current_change: existing.current_change ?? null,
      init_version: packageVersion,
      init_at: new Date().toISOString(),
      installed_ides: force ? [] : [...(existing.installed_ides || [])],
    };
  } else {
    config = {
      ...DEFAULT_CONFIG,
      init_version: packageVersion,
      init_at: new Date().toISOString(),
      installed_ides: [],
    };
  }

  const actions = [
    `mkdir ${changesDir}`,
    `mkdir ${archiveDir}`,
    extended ? `keep ${configPath}` : `write ${configPath}`,
  ];

  if (dryRun) {
    return { config, existing, extended, created: !existing, actions };
  }

  fs.mkdirSync(changesDir, { recursive: true });
  fs.mkdirSync(archiveDir, { recursive: true });

  if (!extended || force) {
    fs.mkdirSync(bdrDir, { recursive: true });
    writeConfigFile(configPath, config);
  }

  return { config, existing, extended, created: !existing, actions };
}

export function updateInstalledIdes(targetDir, newIdes) {
  const { configPath } = workspacePaths(targetDir);
  const config = readConfigFile(configPath) || { ...DEFAULT_CONFIG };
  config.installed_ides = mergeInstalledIdes(config.installed_ides, newIdes);
  writeConfigFile(configPath, config);
  return config;
}
