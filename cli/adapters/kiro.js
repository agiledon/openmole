import path from 'path';
import { installProjectCommands, installProjectSkills } from '../lib/project-skills.js';

/** Project-level Kiro: .kiro/skills + .kiro/commands (Agent Skills standard). */
export function installKiro({ packageRoot, targetDir, dryRun, force }) {
  const kiroDir = path.join(targetDir, '.kiro');
  const skillsDir = path.join(kiroDir, 'skills');
  const commandsDir = path.join(kiroDir, 'commands');

  const skillActions = installProjectSkills({ packageRoot, skillsDir, dryRun, force });
  const commandActions = installProjectCommands({ packageRoot, commandsDir, dryRun, force });

  return {
    ide: 'kiro',
    scope: 'project',
    kiroDir,
    action: 'project .kiro/ (skills, commands)',
    actions: [...skillActions, ...commandActions],
  };
}
