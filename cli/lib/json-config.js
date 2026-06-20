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
