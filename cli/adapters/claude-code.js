import path from 'path';
import { symlinkDir } from '../lib/fs-helpers.js';
import { installProjectSkills, installProjectCommands } from '../lib/project-skills.js';

/** Copy OpenMole skills + commands into target project .claude/. */
export function installClaudeProject({ packageRoot, targetDir, dryRun, force }) {
  const claudeDir = path.join(targetDir, '.claude');
  const skillsDir = path.join(claudeDir, 'skills');
  const commandsDir = path.join(claudeDir, 'commands');

  const skillActions = installProjectSkills({ packageRoot, skillsDir, dryRun, force });
  const commandActions = installProjectCommands({ packageRoot, commandsDir, dryRun, force });

  return {
    scope: 'project',
    claudeDir,
    actions: [...skillActions, ...commandActions],
  };
}

/** User-level Claude Code plugin symlink (~/.claude/plugins/local/openmole). */
export function installClaudeGlobal({ packageRoot, dryRun, homeDir = process.env.HOME, force = true }) {
  if (!homeDir) throw new Error('HOME is not set');

  const target = path.join(homeDir, '.claude', 'plugins', 'local', 'openmole');
  const link = symlinkDir({ source: packageRoot, target, dryRun, force });

  return {
    scope: 'global',
    action: link.action || `symlink ${packageRoot} -> ${target}`,
    target,
    dryRun: !!link.dryRun,
  };
}

export function installClaudeCode({ packageRoot, targetDir, dryRun, force, homeDir }) {
  const project = installClaudeProject({ packageRoot, targetDir, dryRun, force });
  const global = installClaudeGlobal({ packageRoot, dryRun, homeDir, force });

  return {
    ide: 'claude',
    project,
    global,
    action: `project .claude/ + global plugin symlink`,
  };
}
