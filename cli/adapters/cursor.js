import fs from 'fs';
import path from 'path';

export function installCursor({ packageRoot, dryRun, homeDir = process.env.HOME }) {
  if (!homeDir) throw new Error('HOME is not set');

  const target = path.join(homeDir, '.cursor', 'plugins', 'local', 'bdr');
  const action = `symlink ${packageRoot} -> ${target}`;

  if (dryRun) {
    return { ide: 'cursor', action, dryRun: true };
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.symlinkSync(packageRoot, target, 'dir');

  return { ide: 'cursor', action, target };
}
