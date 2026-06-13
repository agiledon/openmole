/**
 * BDR plugin for OpenCode.ai — registers skills + commands, short bootstrap.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = path.resolve(__dirname, '../..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');
const COMMANDS_DIR = path.join(PLUGIN_ROOT, 'commands');

const BOOTSTRAP = `<BDR-BOOTSTRAP>
BDR (Bad smell Driven Refactoring) is installed.
Workspace: \`bdr/config.yaml\` + \`bdr/changes/<change-name>/\`.
Commands: /bdr-explore, /bdr-plan, /bdr-verify, /bdr-apply, /bdr-archive
Load the matching bdr-*-change skill for each command.
</BDR-BOOTSTRAP>`;

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content.trim() };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

function loadBdrCommands() {
  const commands = {};
  if (!fs.existsSync(COMMANDS_DIR)) return commands;

  for (const file of fs.readdirSync(COMMANDS_DIR).filter((f) => f.startsWith('bdr-') && f.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(COMMANDS_DIR, file), 'utf8');
    const { meta, body } = parseFrontmatter(content);
    const phase = file.replace(/^bdr-/, '').replace(/\.md$/, '');
    const slashName = `bdr-${phase}`;
    commands[slashName] = {
      description: meta.description || `BDR ${phase} phase`,
      template: body,
    };
  }
  return commands;
}

export const BdrPlugin = async () => {
  const bdrCommands = loadBdrCommands();
  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(SKILLS_DIR)) {
        config.skills.paths.push(SKILLS_DIR);
      }

      config.command = config.command || {};
      for (const [name, cmd] of Object.entries(bdrCommands)) {
        if (!config.command[name]) {
          config.command[name] = cmd;
        }
      }
    },
    'experimental.chat.messages.transform': async (_input, output) => {
      if (!output.messages.length) return;
      const firstUser = output.messages.find((m) => m.info.role === 'user');
      if (!firstUser?.parts.length) return;
      if (firstUser.parts.some((p) => p.type === 'text' && p.text.includes('BDR-BOOTSTRAP'))) return;
      firstUser.parts.unshift({ ...firstUser.parts[0], type: 'text', text: BOOTSTRAP });
    },
  };
};
