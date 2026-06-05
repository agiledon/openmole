/**
 * BDR plugin for OpenCode.ai — registers skills path, short bootstrap.
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOTSTRAP = `<BDR-BOOTSTRAP>
BDR (Bad smell Driven Refactoring) is installed.
Workspace: \`bdr/config.yaml\` + \`bdr/changes/<change-name>/\`.
Commands: bdr:explore, bdr:analyze, bdr:plan, bdr:apply, bdr:archive.
Load the matching bdr-* skill for each command.
</BDR-BOOTSTRAP>`;

export const BdrPlugin = async () => {
  const bdrSkillsDir = path.resolve(__dirname, '../../skills');
  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(bdrSkillsDir)) {
        config.skills.paths.push(bdrSkillsDir);
      }
    },
    'experimental.chat.messages.transform': async (_input, output) => {
      if (!output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser?.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('BDR-BOOTSTRAP'))) return;
      firstUser.parts.unshift({ ...firstUser.parts[0], type: 'text', text: BOOTSTRAP });
    }
  };
};
