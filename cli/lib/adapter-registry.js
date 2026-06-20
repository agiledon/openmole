import fs from 'fs';
import path from 'path';
import { installCursor } from '../adapters/cursor.js';
import { installOpenCode } from '../adapters/opencode.js';
import { installClaudeCode } from '../adapters/claude-code.js';
import { installCodex } from '../adapters/codex.js';
import { installGeminiCli } from '../adapters/gemini-cli.js';
import { installKiro } from '../adapters/kiro.js';
import { installQoder } from '../adapters/qoder.js';

export const ADAPTERS = {
  cursor: { install: installCursor, checkPath: ['.cursor', 'skills', 'openmole-explore', 'SKILL.md'] },
  opencode: { install: installOpenCode },
  claude: { install: installClaudeCode, checkPath: ['.claude', 'skills', 'openmole-explore', 'SKILL.md'] },
  codex: { install: installCodex, checkPath: ['.codex', 'skills', 'openmole-explore', 'SKILL.md'] },
  gemini: { install: installGeminiCli, checkPath: ['.gemini', 'skills', 'openmole-explore', 'SKILL.md'] },
  kiro: { install: installKiro, checkPath: ['.kiro', 'skills', 'openmole-explore', 'SKILL.md'] },
  qoder: { install: installQoder, checkPath: ['.qoder', 'skills', 'openmole-explore', 'SKILL.md'] },
};

export function resolveAdapter(ide) {
  const adapter = ADAPTERS[ide];
  if (!adapter) {
    throw new Error(`Unknown IDE: ${ide}`);
  }
  return adapter;
}

export function isAdapterInstalled(targetDir, adapter) {
  if (!adapter.checkPath) return true;
  const checkFile = path.join(targetDir, ...adapter.checkPath);
  return fs.existsSync(checkFile);
}
