import { createSkillCommandAdapter } from '../lib/project-skills.js';

/**
 * Project-level Gemini CLI: .gemini/skills + .gemini/commands + extension symlink.
 * Workspace skills are the most reliable discovery path in Gemini CLI.
 */
export const installGeminiCli = createSkillCommandAdapter({
  ide: 'gemini',
  ideDir: '.gemini',
  extras: {
    symlink: {
      source: null,
      dest: ['extensions', 'openmole'],
    },
    actionSuffix: ', extension symlink',
  },
});
