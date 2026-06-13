import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runInit } from './commands/init.js';
import { runUpdate } from './commands/update.js';
import { isInteractiveWelcome, showWelcome } from './prompts/welcome.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  return pkg.version;
}

function printHelp() {
  console.log(`openmole — AI-driven Refactoring CLI (${readVersion()})

Usage:
  openmole [path] [options]         Welcome + initialize (interactive TTY)
  openmole init [path] [options]    Initialize OpenMole workspace and configure AI IDEs
  openmole update [path] [options]  Re-install IDE configs from installed_ides
  openmole --help                     Show this help
  openmole --version                  Show version

Init options:
  --ides <list>       Comma-separated: cursor,opencode,gemini,claude,codex,kiro,qoder
  --all               Configure all IDEs
  --none              Workspace only, skip IDE configuration
  --force             Overwrite existing config
  --global            Write OpenCode config to user-level (~/.config/opencode/)
  --dry-run           Print planned actions without writing files
  --skip-gitignore    Do not merge templates/openmole-gitignore.snippet

Update options:
  --global            Pass --global to OpenCode adapter when re-installing
  --dry-run           Print planned actions without writing files
  --skip-gitignore    Do not refresh .gitignore OpenMole snippet

Examples:
  openmole init
  openmole init . --ides cursor,opencode
  openmole init /path/to/project --none
  openmole update
  openmole update . --dry-run
`);
}

export async function main(argv) {
  const args = argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  if (args.length === 0) {
    if (isInteractiveWelcome()) {
      await showWelcome();
      await runInit([], { skipWelcome: true });
    } else {
      printHelp();
    }
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(readVersion());
    return;
  }

  const cmd = args[0];
  const rest = args.slice(1);

  if (cmd === 'init') {
    await runInit(rest);
    return;
  }

  if (cmd === 'update') {
    await runUpdate(rest);
    return;
  }

  throw new Error(`Unknown command: ${cmd}. Run openmole --help.`);
}
