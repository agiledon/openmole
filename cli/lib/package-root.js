import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const MARKERS = ['skills', '.cursor-plugin/plugin.json'];

function hasMarkers(dir) {
  return MARKERS.every((m) => fs.existsSync(path.join(dir, m)));
}

/**
 * Resolve BDR plugin package root.
 * Priority: BDR_HOME → walk up from cli module → null
 */
export function resolvePackageRoot(fromModuleUrl = import.meta.url) {
  if (process.env.BDR_HOME) {
    const home = path.resolve(process.env.BDR_HOME);
    if (!hasMarkers(home)) {
      throw new Error(`BDR_HOME is not a valid BDR package root: ${home}`);
    }
    return home;
  }

  let dir = path.dirname(fileURLToPath(fromModuleUrl));
  for (let i = 0; i < 6; i++) {
    if (hasMarkers(dir)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error('Could not resolve BDR package root. Set BDR_HOME or run from a linked bdr install.');
}
