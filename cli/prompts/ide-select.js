import fs from 'fs';
import path from 'path';

export const IDE_DEFINITIONS = [
  { value: 'cursor', label: 'Cursor', phase: 'a' },
  { value: 'opencode', label: 'OpenCode', phase: 'a' },
  { value: 'gemini', label: 'Gemini CLI', phase: 'b' },
  { value: 'claude', label: 'Claude Code', phase: 'b' },
  { value: 'codex', label: 'Codex', phase: 'b' },
  { value: 'kiro', label: 'Kiro', phase: 'b' },
  { value: 'qoder', label: 'Qoder', phase: 'b' },
];

export const ALL_IDE_VALUES = IDE_DEFINITIONS.map((d) => d.value);

export async function promptIdeSelection() {
  const { multiselect, isCancel, cancel } = await import('@clack/prompts');

  const selected = await multiselect({
    message: '选择要配置 OpenMole 的 AI IDE（空格选择，Enter 确认）',
    options: IDE_DEFINITIONS.map((d) => ({
      value: d.value,
      label: d.label,
    })),
    required: false,
  });

  if (isCancel(selected)) {
    cancel('已取消');
    process.exit(0);
  }

  return selected ?? [];
}
