import fs from 'fs';
import path from 'path';
import { BDR_PHASES } from './bdr-phases.js';
import { copyRecursive, ensureDir } from './fs-helpers.js';

/** Copy BDR skills from package into a target skills directory. */
export function installProjectSkills({ packageRoot, skillsDir, dryRun, force }) {
  const actions = [];

  for (const { skill } of BDR_PHASES) {
    const src = path.join(packageRoot, 'skills', skill);
    const dest = path.join(skillsDir, skill);
    actions.push(`copy ${src} -> ${dest}`);

    if (dryRun) continue;
    if (fs.existsSync(dest) && !force) continue;
    ensureDir(path.dirname(dest), dryRun);
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    copyRecursive(src, dest, dryRun);
  }

  return actions;
}

/** Copy BDR command markdown files into a target commands directory. */
export function installProjectCommands({ packageRoot, commandsDir, dryRun, force, transform }) {
  const actions = [];

  for (const { command } of BDR_PHASES) {
    const src = path.join(packageRoot, 'commands', `${command}.md`);
    const dest = path.join(commandsDir, `${command}.md`);
    actions.push(`write ${dest}`);

    if (dryRun) continue;
    if (fs.existsSync(dest) && !force) continue;
    ensureDir(commandsDir, dryRun);
    let content = fs.readFileSync(src, 'utf8');
    if (transform) content = transform(content, command);
    fs.writeFileSync(dest, content, 'utf8');
  }

  return actions;
}
