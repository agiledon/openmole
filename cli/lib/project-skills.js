import fs from 'fs';
import path from 'path';
import { BDR_PHASES } from './bdr-phases.js';
import { copyRecursive, ensureDir, symlinkDir } from './fs-helpers.js';

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

/**
 * Factory: create a project-level IDE adapter that installs skills + commands.
 *
 * @param {Object} opts
 * @param {string} opts.ide     - IDE identifier (e.g. 'kiro', 'qoder', 'gemini')
 * @param {string} opts.ideDir  - project directory name (e.g. '.kiro', '.qoder', '.gemini')
 * @param {Object} [opts.extras] - optional extra configuration
 * @param {{ source: string, dest: string[] }} [opts.extras.symlink] - extra symlink to create under baseDir
 * @param {string} [opts.extras.actionSuffix] - append to the action description string
 * @returns {Function} install({ packageRoot, targetDir, dryRun, force })
 */
export function createSkillCommandAdapter({ ide, ideDir, extras } = {}) {
  return ({ packageRoot, targetDir, dryRun, force }) => {
    const baseDir = path.join(targetDir, ideDir);
    const skillsDir = path.join(baseDir, 'skills');
    const commandsDir = path.join(baseDir, 'commands');

    const skillActions = installProjectSkills({ packageRoot, skillsDir, dryRun, force });
    const commandActions = installProjectCommands({ packageRoot, commandsDir, dryRun, force });

    const allActions = [...skillActions, ...commandActions];
    let actionDesc = `project ${ideDir}/ (skills, commands`;
    const result = {
      ide,
      scope: 'project',
      action: '',
      actions: allActions,
    };

    if (extras?.symlink) {
      const linkTarget = path.join(baseDir, ...extras.symlink.dest);
      const linkSource = extras.symlink.source || packageRoot;
      const link = symlinkDir({ source: linkSource, target: linkTarget, dryRun, force });
      allActions.push(link.action);
      actionDesc += extras.actionSuffix || ', extension symlink';
      result.extensionLink = link.target || linkTarget;
    }

    actionDesc += ')';
    result.action = actionDesc;

    return result;
  };
}
