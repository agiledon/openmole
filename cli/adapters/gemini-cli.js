import path from 'path';
import { installProjectCommands, installProjectSkills } from '../lib/project-skills.js';
import { symlinkDir } from '../lib/fs-helpers.js';

/**
 * Project-level Gemini CLI: .gemini/skills + .gemini/commands + extension symlink.
 * Workspace skills are the most reliable discovery path in Gemini CLI.
 */
export function installGeminiCli({ packageRoot, targetDir, dryRun, force }) {
  const geminiDir = path.join(targetDir, '.gemini');
  const skillsDir = path.join(geminiDir, 'skills');
  const commandsDir = path.join(geminiDir, 'commands');
  const extensionLink = path.join(geminiDir, 'extensions', 'bdr');

  const skillActions = installProjectSkills({ packageRoot, skillsDir, dryRun, force });
  const commandActions = installProjectCommands({ packageRoot, commandsDir, dryRun, force });
  const link = symlinkDir({ source: packageRoot, target: extensionLink, dryRun, force });

  return {
    ide: 'gemini',
    scope: 'project',
    geminiDir,
    extensionLink: link.target || extensionLink,
    action: `project .gemini/ (skills, commands, extension symlink)`,
    actions: [...skillActions, ...commandActions, link.action],
  };
}
