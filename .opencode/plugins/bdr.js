/**
 * BDR plugin for OpenCode.ai
 * Registers skills path and injects using-bdr bootstrap on first user message.
 */
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const extractBody = (content) => {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
};

export const BdrPlugin = async () => {
  const bdrSkillsDir = path.resolve(__dirname, '../../skills');

  const getBootstrap = () => {
    const skillPath = path.join(bdrSkillsDir, 'using-bdr', 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;
    const body = extractBody(fs.readFileSync(skillPath, 'utf8'));
    return `<BDR-BOOTSTRAP>
You have BDR (Bad smell Driven Refactoring) installed.

${body}

**OpenCode tool mapping:** Skill tool → native \`skill\` tool; Read/Write/Edit/Bash → native equivalents.
</BDR-BOOTSTRAP>`;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(bdrSkillsDir)) {
        config.skills.paths.push(bdrSkillsDir);
      }
    },
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrap();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser?.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('BDR-BOOTSTRAP'))) return;
      firstUser.parts.unshift({ ...firstUser.parts[0], type: 'text', text: bootstrap });
    }
  };
};
