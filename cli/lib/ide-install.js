import fs from 'fs';
import path from 'path';
import { resolveAdapter, isAdapterInstalled } from './adapter-registry.js';

export function readPackageVersion(packageRoot) {
  const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  return pkg.version || '0.0.0';
}

export function needsReinstall(targetDir, ide, force) {
  if (force) return true;
  const adapter = resolveAdapter(ide);
  return !isAdapterInstalled(targetDir, adapter);
}

export function installIde(ide, opts) {
  const adapter = resolveAdapter(ide);
  return adapter.install(opts);
}

export function installIdes(ides, opts) {
  const results = [];
  for (const ide of ides) {
    results.push(installIde(ide, opts));
  }
  return results;
}
