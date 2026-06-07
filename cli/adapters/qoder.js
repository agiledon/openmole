import path from 'path';
import { installProjectCommands, installProjectSkills } from '../lib/project-skills.js';

/** Project-level Qoder: .qoder/skills + .qoder/commands. */
export function installQoder({ packageRoot, targetDir, dryRun, force }) {
  const qoderDir = path.join(targetDir, '.qoder');
  const skillsDir = path.join(qoderDir, 'skills');
  const commandsDir = path.join(qoderDir, 'commands');

  const skillActions = installProjectSkills({ packageRoot, skillsDir, dryRun, force });
  const commandActions = installProjectCommands({ packageRoot, commandsDir, dryRun, force });

  return {
    ide: 'qoder',
    scope: 'project',
    qoderDir,
    action: 'project .qoder/ (skills, commands)',
    actions: [...skillActions, ...commandActions],
  };
}
