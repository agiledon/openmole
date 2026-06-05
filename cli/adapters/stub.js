const STUB_LABELS = {
  gemini: 'Gemini CLI',
  claude: 'Claude Code',
  codex: 'Codex',
};

export function installStub(ide) {
  const label = STUB_LABELS[ide] || ide;
  const message = `${label} adapter 尚未就绪（Phase B），已跳过。`;
  console.warn(`⚠ ${message}`);
  return { ide, skipped: true, message };
}

export function isPhaseB(ide) {
  return ide === 'gemini' || ide === 'claude' || ide === 'codex';
}
