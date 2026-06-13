import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const MARKERS = ['skills', '.cursor-plugin/plugin.json'];

function hasMarkers(dir) {
  return MARKERS.every((m) => fs.existsSync(path.join(dir, m)));
}

/**
 * Resolve OpenMole plugin package root.
 * Priority: OPENMOLE_HOME → walk up from cli module → null
 */
export function resolvePackageRoot(fromModuleUrl = import.meta.url) {
  if (process.env.OPENMOLE_HOME) {
    const home = path.resolve(process.env.OPENMOLE_HOME);
    if (!hasMarkers(home)) {
      throw new Error(`OPENMOLE_HOME is not a valid OpenMole package root: ${home}`);
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

  throw new Error('Could not resolve OpenMole package root. Set OPENMOLE_HOME or run from a linked openmole install.');
}
