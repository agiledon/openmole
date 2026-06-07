import fs from 'fs';
import path from 'path';
import { installCursor } from '../adapters/cursor.js';
import { installOpenCode } from '../adapters/opencode.js';
import { installClaudeCode } from '../adapters/claude-code.js';
import { installCodex } from '../adapters/codex.js';
import { installGeminiCli } from '../adapters/gemini-cli.js';
import { installKiro } from '../adapters/kiro.js';
import { installQoder } from '../adapters/qoder.js';

export function readPackageVersion(packageRoot) {
  const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  return pkg.version || '0.0.0';
}

export function needsReinstall(targetDir, ide, force) {
  if (force) return true;
  switch (ide) {
    case 'cursor':
      return !fs.existsSync(
        path.join(targetDir, '.cursor', 'skills', 'bdr-explore-to-change', 'SKILL.md'),
      );
    case 'gemini':
      return !fs.existsSync(
        path.join(targetDir, '.gemini', 'skills', 'bdr-explore-to-change', 'SKILL.md'),
      );
    case 'codex':
      return !fs.existsSync(path.join(targetDir, 'plugins', 'bdr', '.codex-plugin', 'plugin.json'));
    case 'kiro':
      return !fs.existsSync(
        path.join(targetDir, '.kiro', 'skills', 'bdr-explore-to-change', 'SKILL.md'),
      );
    case 'qoder':
      return !fs.existsSync(
        path.join(targetDir, '.qoder', 'skills', 'bdr-explore-to-change', 'SKILL.md'),
      );
    default:
      return false;
  }
}

export function installIde(ide, { packageRoot, targetDir, dryRun, force, global }) {
  switch (ide) {
    case 'cursor':
      return installCursor({ packageRoot, targetDir, dryRun, force });
    case 'opencode':
      return installOpenCode({ packageRoot, targetDir, global, dryRun });
    case 'claude':
      return installClaudeCode({ packageRoot, dryRun, force });
    case 'codex':
      return installCodex({ packageRoot, targetDir, dryRun, force });
    case 'gemini':
      return installGeminiCli({ packageRoot, targetDir, dryRun, force });
    case 'kiro':
      return installKiro({ packageRoot, targetDir, dryRun, force });
    case 'qoder':
      return installQoder({ packageRoot, targetDir, dryRun, force });
    default:
      console.warn(`⚠ Unknown IDE: ${ide}`);
      return { ide, skipped: true, message: `unknown IDE: ${ide}` };
  }
}

export function installIdes(ides, opts) {
  const results = [];
  for (const ide of ides) {
    results.push(installIde(ide, opts));
  }
  return results;
}
