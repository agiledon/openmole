import fs from 'fs';
import os from 'os';
import path from 'path';
import { OPENMOLE_PHASES } from '../lib/openmole-phases.js';

function ensureDir(dir, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest, dryRun) {
  if (dryRun) return;
  fs.cpSync(src, dest, { recursive: true });
}

/** Transform plugin command frontmatter for project .cursor/commands/ (slash names). */
export function toCursorProjectCommand(content, commandBase) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return content;

  const body = match[2];
  let description = '';
  for (const line of match[1].split('\n')) {
    if (line.startsWith('description:')) {
      description = line.slice('description:'.length).trim();
    }
  }

  const slashName = `/${commandBase}`;
  const frontmatter = [
    '---',
    `name: ${slashName}`,
    `id: ${commandBase}`,
    'category: OpenMole',
    `description: ${description || `OpenMole ${commandBase}`}`,
    '---',
    '',
  ].join('\n');

  return frontmatter + body.trimStart();
}

/**
 * Install OpenMole into target project .cursor/ (OpenSpec-style).
 * Cursor loads project skills/commands reliably from here.
 */
export function installCursorProject({ packageRoot, targetDir, dryRun, force }) {
  const actions = [];
  const cursorDir = path.join(targetDir, '.cursor');
  const skillsDir = path.join(cursorDir, 'skills');
  const commandsDir = path.join(cursorDir, 'commands');

  for (const { command, skill } of OPENMOLE_PHASES) {
    const src = path.join(packageRoot, 'skills', skill);
    const dest = path.join(skillsDir, skill);
    actions.push(`copy ${src} -> ${dest}`);

    if (!dryRun) {
      if (fs.existsSync(dest) && !force) continue;
      ensureDir(path.dirname(dest), dryRun);
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
      copyRecursive(src, dest, dryRun);
    }
  }

  for (const { command, skill } of OPENMOLE_PHASES) {
    const src = path.join(packageRoot, 'commands', `${command}.md`);
    const dest = path.join(commandsDir, `${command}.md`);
    actions.push(`write ${dest}`);

    if (!dryRun) {
      if (fs.existsSync(dest) && !force) continue;
      ensureDir(commandsDir, dryRun);
      const content = fs.readFileSync(src, 'utf8');
      fs.writeFileSync(dest, toCursorProjectCommand(content, command), 'utf8');
    }
  }

  return { scope: 'project', cursorDir, actions };
}

/** Optional user-level plugin symlink (~/.cursor/plugins/local/openmole). */
export function installCursorGlobal({ packageRoot, dryRun, homeDir = os.homedir() }) {
  if (!homeDir) throw new Error('HOME is not set');

  const target = path.join(homeDir, '.cursor', 'plugins', 'local', 'openmole');
  const action = `symlink ${packageRoot} -> ${target}`;

  if (dryRun) {
    return { scope: 'global', action, dryRun: true };
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.symlinkSync(packageRoot, target, 'dir');

  return { scope: 'global', action, target };
}

export function installCursor({ packageRoot, targetDir, dryRun, force, homeDir }) {
  const project = installCursorProject({ packageRoot, targetDir, dryRun, force });
  const global = installCursorGlobal({ packageRoot, dryRun, homeDir });

  return {
    ide: 'cursor',
    project,
    global,
    action: `project .cursor/ + global plugin symlink`,
  };
}
