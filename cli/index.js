import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runInit } from './commands/init.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  return pkg.version;
}

function printHelp() {
  console.log(`bdr — Bad smell Driven Refactoring CLI (${readVersion()})

Usage:
  bdr init [path] [options]   Initialize BDR workspace and configure AI IDEs
  bdr --help                  Show this help
  bdr --version               Show version

Init options:
  --ides <list>    Comma-separated: cursor,opencode,gemini,claude,codex
  --all            Configure all IDEs
  --none           Workspace only, skip IDE configuration
  --force          Overwrite existing config
  --global         Write OpenCode config to user-level (~/.config/opencode/)
  --dry-run        Print planned actions without writing files

Examples:
  bdr init
  bdr init . --ides cursor,opencode
  bdr init /path/to/project --none
`);
}

export async function main(argv) {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
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

  throw new Error(`Unknown command: ${cmd}. Run bdr --help.`);
}
