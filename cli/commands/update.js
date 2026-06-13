import fs from 'fs';
import path from 'path';
import { resolvePackageRoot } from '../lib/package-root.js';
import { workspacePaths, refreshInitMetadata } from '../workspace/bootstrap.js';
import { readConfigFile } from '../lib/config-yaml.js';
import { readPackageVersion, installIdes } from '../lib/ide-install.js';
import { printInstallSummary } from '../lib/summary.js';
import { mergeGitignoreSnippet } from '../workspace/gitignore.js';

export function parseUpdateArgv(argv) {
  const opts = {
    targetDir: process.cwd(),
    global: false,
    dryRun: false,
    skipGitignore: false,
  };

  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--global') {
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

export async function runUpdate(argv) {
  const opts = parseUpdateArgv(argv);
  const packageRoot = resolvePackageRoot(import.meta.url);
  const version = readPackageVersion(packageRoot);
  const { configPath } = workspacePaths(opts.targetDir);

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `OpenMole workspace not found at ${configPath}. Run \`openmole init\` in this project first.`,
    );
  }

  const config = readConfigFile(configPath);
  const ides = config?.installed_ides || [];
  if (!ides.length) {
    throw new Error(
      'No installed_ides in openmole/config.yaml. Run `openmole init --ides <list>` to configure IDEs first.',
    );
  }

  const results = installIdes(ides, {
    packageRoot,
    targetDir: opts.targetDir,
    dryRun: opts.dryRun,
    force: true,
    global: opts.global,
  });

  let gitignoreChanged = false;
  if (!opts.skipGitignore) {
    const git = mergeGitignoreSnippet({
      packageRoot,
      targetDir: opts.targetDir,
      dryRun: opts.dryRun,
    });
    gitignoreChanged = git.changed;
  }

  if (!opts.dryRun) {
    refreshInitMetadata(opts.targetDir, version);
  }

  const extraLines = [`init_version → ${version}`];
  if (!opts.skipGitignore) {
    extraLines.unshift(
      gitignoreChanged ? '(gitignore updated)' : '(gitignore already up to date)',
    );
  }

  printInstallSummary({
    title: 'OpenMole update',
    targetDir: opts.targetDir,
    results,
    extraLines,
    dryRun: opts.dryRun,
  });
}
