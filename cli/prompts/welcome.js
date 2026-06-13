import readline from 'readline';

const TEAL = '\x1b[38;2;38;166;154m';
const TEAL_DIM = '\x1b[38;2;20;100;92m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const WHITE = '\x1b[97m';
const GRAY = '\x1b[90m';
const YELLOW = '\x1b[33m';

const R_LOGO = [
  '██████╗ ',
  '██╔══██╗',
  '██████╔╝',
  '██╔██╗ ',
  '██║ ╚██╗',
  '╚═╝  ╚═╝',
];

const QUICK_START = [
  { cmd: '/bdr-explore', desc: 'Create/continue change, identify bad smells' },
  { cmd: '/bdr-verify', desc: 'Verify coverage' },
  { cmd: '/bdr-plan', desc: 'Task breakdown' },
  { cmd: '/bdr-apply', desc: 'Execute refactoring' },
  { cmd: '/bdr-archive', desc: 'Archive change' },
];

export function isInteractiveWelcome() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

function buildTextLines() {
  const lines = [
    `${BOLD}${WHITE}Welcome to BDR${RESET}`,
    `${GRAY}Bad smell Driven Refactoring${RESET}`,
    '',
    `${WHITE}This setup will configure:${RESET}`,
    `${GRAY}  • Agent Skills for AI tools${RESET}`,
    `${GRAY}  • /bdr-* slash commands${RESET}`,
    `${GRAY}  • bdr/ workspace${RESET}`,
    `${GRAY}  • 7 AI IDE harnesses${RESET}`,
    '',
    `${WHITE}Quick start after setup:${RESET}`,
  ];

  for (const { cmd, desc } of QUICK_START) {
    lines.push(`${YELLOW}${cmd}${RESET} ${GRAY}— ${desc}${RESET}`);
  }

  return lines;
}

function composeFrame(logoColor) {
  const textLines = buildTextLines();
  const height = Math.max(R_LOGO.length, textLines.length);
  const rows = [];

  for (let i = 0; i < height; i++) {
    const logo = R_LOGO[i] ? `${logoColor}${R_LOGO[i]}${RESET}` : '         ';
    const text = textLines[i] ?? '';
    rows.push(`${logo}  ${text}`);
  }

  return rows;
}

function renderFrame(logoColor) {
  const rows = composeFrame(logoColor);
  process.stdout.write('\x1b[2J\x1b[H');
  process.stdout.write('\n');
  for (const row of rows) {
    process.stdout.write(`  ${row}\n`);
  }
  process.stdout.write(`\n  ${TEAL}Press Enter to select tools…${RESET}\n`);
}

function waitForEnter() {
  return new Promise((resolve) => {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    const onKeypress = (_str, key) => {
      if (key.name === 'return' || key.name === 'enter') {
        cleanup();
        resolve();
      }
      if (key.name === 'c' && key.ctrl) {
        cleanup();
        process.exit(130);
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdout.write('\x1b[?25h');
    };

    process.stdout.write('\x1b[?25l');
    process.stdin.on('keypress', onKeypress);
  });
}

/** OpenSpec-style welcome: blinking R logo, BDR copy, Enter to continue. */
export async function showWelcome() {
  if (!isInteractiveWelcome()) return;

  let bright = true;
  renderFrame(bright ? TEAL : TEAL_DIM);

  const timer = setInterval(() => {
    bright = !bright;
    renderFrame(bright ? TEAL : TEAL_DIM);
  }, 500);

  try {
    await waitForEnter();
  } finally {
    clearInterval(timer);
    process.stdout.write('\x1b[?25h');
    process.stdout.write('\n');
  }
}
