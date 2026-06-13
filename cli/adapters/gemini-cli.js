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
      // source is resolved at call time (packageRoot), so we pass a placeholder
      // that gets replaced in the factory; or simpler: the factory uses the caller's packageRoot
      source: null,
      dest: ['extensions', 'bdr'],
    },
    actionSuffix: ', extension symlink',
  },
});
