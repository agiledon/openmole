export function notify(msg) {
  console.log(msg);
}

export function printInstallSummary({ title, targetDir, results, extraLines = [], dryRun }) {
  console.log('');
  console.log(dryRun ? `Dry run — planned actions (${title}):` : `${title} complete.`);
  console.log(`  Workspace: ${targetDir}/openmole`);
  for (const r of results) {
    if (r.skipped) {
      console.log(`  ⚠ ${r.ide}: skipped`);
    } else if (r.dryRun) {
      console.log(`  → ${r.ide}: ${r.action}`);
    } else {
      console.log(`  ✓ ${r.ide}: ${r.action || 'configured'}`);
    }
  }
  for (const line of extraLines) {
    console.log(`  ${line}`);
  }
  console.log('');
  console.log('Next steps:');
  if (results.some((r) => r.ide === 'cursor' && !r.skipped)) {
    console.log('  • Cursor: Cmd+Q 重启后验证 /mole-explore');
  }
  if (results.some((r) => r.ide === 'opencode' && !r.skipped)) {
    console.log('  • OpenCode: 重启后运行 /mole-explore . demo-change');
  }
  if (results.some((r) => r.ide === 'claude' && !r.skipped)) {
    console.log('  • Claude Code: 重启后运行 /plugin 确认 openmole 已加载');
  }
  if (results.some((r) => r.ide === 'codex' && !r.skipped)) {
    console.log('  • Codex: 运行 /plugins 确认 openmole 可用');
  }
  if (results.some((r) => r.ide === 'gemini' && !r.skipped)) {
    console.log('  • Gemini CLI: 重启后运行 /skills 确认 openmole-* skills');
  }
  console.log('  • 运行 /mole-explore . <change-name> 开始第一个 change');
}
