import fs from 'fs';
import path from 'path';
import { resolvePackageRoot } from '../lib/package-root.js';
import { bootstrapWorkspace, updateInstalledIdes, workspacePaths } from '../workspace/bootstrap.js';
import { readConfigFile } from '../lib/config-yaml.js';
import { promptIdeSelection, ALL_IDE_VALUES } from '../prompts/ide-select.js';
import {
  readPackageVersion,
  needsReinstall,
  installIdes,
} from '../lib/ide-install.js';
import { printInstallSummary } from '../lib/summary.js';
import { mergeGitignoreSnippet } from '../workspace/gitignore.js';

function parseIdesFlag(value) {
  if (!value) return [];
  return value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function parseInitArgv(argv) {
  const opts = {
    targetDir: process.cwd(),
    ides: null,
    all: false,
    none: false,
    force: false,
    global: false,
    dryRun: false,
    skipGitignore: false,
  };

  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--ides') {
      opts.ides = parseIdesFlag(argv[++i]);
    } else if (arg === '--all') {
      opts.all = true;
    } else if (arg === '--none') {
      opts.none = true;
    } else if (arg === '--force') {
      opts.force = true;
    } else if (arg === '--global') {
      opts.global = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--skip-gitignore') {
      opts.skipGitignore = true;
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  if (positional[0]) {
    opts.targetDir = path.resolve(positional[0]);
  }

  return opts;
}

async function resolveSelectedIdes(opts) {
  if (opts.none) return [];
  if (opts.all) return [...ALL_IDE_VALUES];
  if (opts.ides !== null) {
    if (opts.ides.length === 1 && opts.ides[0] === 'none') return [];
    return opts.ides;
  }

  if (!process.stdin.isTTY) {
    return [];
  }

  return promptIdeSelection();
}

function filterExtendMode(targetDir, ides, force) {
  if (force) return ides;
  const config = readConfigFile(workspacePaths(targetDir).configPath);
  if (!config?.installed_ides?.length) return ides;
  const installed = new Set(config.installed_ides);
  return ides.filter((ide) => !installed.has(ide) || needsReinstall(targetDir, ide, force));
}

export async function runInit(argv) {
  const opts = parseInitArgv(argv);
  const packageRoot = resolvePackageRoot(import.meta.url);
  const version = readPackageVersion(packageRoot);

  const ws = bootstrapWorkspace({
    targetDir: opts.targetDir,
    packageVersion: version,
    force: opts.force,
    dryRun: opts.dryRun,
  });

  if (ws.extended) {
    console.log('BDR 已初始化，正在追加 IDE 配置…');
  }

  let ides = await resolveSelectedIdes(opts);
  ides = filterExtendMode(opts.targetDir, ides, opts.force);

  const installOpts = {
    packageRoot,
    targetDir: opts.targetDir,
    dryRun: opts.dryRun,
    force: opts.force,
    global: opts.global,
  };

  const results = installIdes(ides, installOpts);

  if (!opts.skipGitignore && ides.length > 0) {
    mergeGitignoreSnippet({
      packageRoot,
      targetDir: opts.targetDir,
      dryRun: opts.dryRun,
    });
  }

  if (!opts.dryRun) {
    const configured = results.filter((r) => r.ide && !r.skipped).map((r) => r.ide);
    if (configured.length) {
      updateInstalledIdes(opts.targetDir, configured);
    }
  }

  const extraLines = ws.extended ? ['(extend mode: existing config preserved)'] : [];

  printInstallSummary({
    title: 'BDR init',
    targetDir: opts.targetDir,
    results,
    extraLines,
    dryRun: opts.dryRun,
  });
}
