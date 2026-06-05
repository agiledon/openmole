import fs from 'fs';
import path from 'path';

export function ensureDir(dir, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(dir, { recursive: true });
}

export function copyRecursive(src, dest, dryRun) {
  if (dryRun) return;
  fs.cpSync(src, dest, { recursive: true });
}

export function symlinkDir({ source, target, dryRun, force = true }) {
  const action = `symlink ${source} -> ${target}`;
  if (dryRun) return { action, dryRun: true };

  ensureDir(path.dirname(target), dryRun);
  if (fs.existsSync(target)) {
    if (!force) return { action, skipped: true, target };
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.symlinkSync(source, target, 'dir');
  return { action, target };
}
