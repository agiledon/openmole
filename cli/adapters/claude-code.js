import path from 'path';
import { symlinkDir } from '../lib/fs-helpers.js';

/** User-level Claude Code plugin symlink (~/.claude/plugins/local/bdr). */
export function installClaudeCode({ packageRoot, dryRun, homeDir = process.env.HOME, force = true }) {
  if (!homeDir) throw new Error('HOME is not set');

  const target = path.join(homeDir, '.claude', 'plugins', 'local', 'bdr');
  const link = symlinkDir({ source: packageRoot, target, dryRun, force });

  return {
    ide: 'claude',
    scope: 'global',
    action: link.action || `symlink ${packageRoot} -> ${target}`,
    target,
    dryRun: !!link.dryRun,
  };
}
