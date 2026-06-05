import fs from 'fs';
import path from 'path';
import { resolvePackageRoot } from '../lib/package-root.js';
import { bootstrapWorkspace, updateInstalledIdes, workspacePaths } from '../workspace/bootstrap.js';
import { readConfigFile } from '../lib/config-yaml.js';
import { promptIdeSelection, ALL_IDE_VALUES } from '../prompts/ide-select.js';
import { installCursor } from '../adapters/cursor.js';
import { installOpenCode } from '../adapters/opencode.js';
import { installStub, isPhaseB } from '../adapters/stub.js';

function readPackageVersion(packageRoot) {
  const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  return pkg.version || '0.0.0';
}

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
  return ides.filter((ide) => {
    if (!installed.has(ide)) return true;
    // Re-run Cursor if project .cursor/ is missing (e.g. after adapter fix)
    if (ide === 'cursor') {
      const skillPath = path.join(targetDir, '.cursor', 'skills', 'bdr-explore-to-change', 'SKILL.md');
      return !fs.existsSync(skillPath);
    }
    return false;
  });
}

function printSummary({ targetDir, results, extended, dryRun }) {
  console.log('');
  console.log(dryRun ? 'Dry run — planned actions:' : 'BDR init complete.');
  console.log(`  Workspace: ${path.join(targetDir, 'bdr')}`);
  for (const r of results) {
    if (r.skipped) {
      console.log(`  ⚠ ${r.ide}: skipped`);
    } else if (r.dryRun) {
      console.log(`  → ${r.ide}: ${r.action}`);
    } else {
      console.log(`  ✓ ${r.ide}: ${r.action || 'configured'}`);
    }
  }
  if (extended) {
    console.log('  (extend mode: existing config preserved)');
  }
  console.log('');
  console.log('Next steps:');
  if (results.some((r) => r.ide === 'cursor' && !r.skipped)) {
    console.log('  • Cursor: 检查项目 .cursor/skills/ 与 .cursor/commands/');
    console.log('  • Cursor: Cmd+Q 重启后验证 /bdr-explore');
  }
  if (results.some((r) => r.ide === 'opencode' && !r.skipped)) {
    console.log('  • OpenCode: 重启后运行 /bdr-explore . demo-change');
  }
  console.log('  • 运行 /bdr-explore . <change-name> 开始第一个 change');
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

  const results = [];

  for (const ide of ides) {
    if (isPhaseB(ide)) {
      results.push(installStub(ide));
      continue;
    }

    if (ide === 'cursor') {
      results.push(
        installCursor({
          packageRoot,
          targetDir: opts.targetDir,
          dryRun: opts.dryRun,
          force: opts.force,
        }),
      );
    } else if (ide === 'opencode') {
      results.push(
        installOpenCode({
          packageRoot,
          targetDir: opts.targetDir,
          global: opts.global,
          dryRun: opts.dryRun,
        }),
      );
    } else {
      console.warn(`⚠ Unknown IDE: ${ide}`);
    }
  }

  if (!opts.dryRun) {
    const configured = results.filter((r) => !r.skipped).map((r) => r.ide);
    if (configured.length) {
      updateInstalledIdes(opts.targetDir, configured);
    }
  }

  printSummary({ targetDir: opts.targetDir, results, extended: ws.extended, dryRun: opts.dryRun });
}
