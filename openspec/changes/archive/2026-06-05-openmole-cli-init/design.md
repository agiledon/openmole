## Context

OpenMole 0.2.0 手动安装门槛高。Brainstorming（2026-06-05）锁定方案 1（单包 `cli/`）、混合 IDE 作用域、warn-and-skip 未就绪 IDE、`config.yaml` 记录 `installed_ides` + `init_version` + `init_at`。

完整设计见 [`docs/design/2026-06-05-openmole-cli-init-design.md`](../../../docs/design/2026-06-05-openmole-cli-init-design.md)。

## Goals / Non-Goals

**Goals:**

- `openmole init` 交互式 5 IDE multiselect + 非交互 `--ides`
- workspace bootstrap + extend 模式
- Phase A：Cursor（用户级 symlink）+ OpenCode（项目级 `opencode.json`）
- Phase B：Claude/Codex/Gemini adapter + manifest

**Non-Goals:**

- CLI 运行时子命令（explore/analyze/…）
- npm registry 发布（Phase 2）
- 复制规约文件到目标项目

## Decisions

### D1：方案 1 — 单包 cli/

同 repo `bin/openmole.js` + `cli/`；`@clack/prompts` 仅 CLI 依赖。

### D2：混合 IDE 作用域

见设计 doc §5 adapter 表。

### D3：config.yaml 扩展

```yaml
current_change: null
installed_ides: []
init_version: "0.3.0"
init_at: "2026-06-05T12:00:00Z"
```

### D4：未就绪 IDE — warn-and-skip

Claude/Codex/Gemini Phase A 选中后警告并跳过。

### D5：分发

Phase A：`npm link`；文档目标 `npm install -g openmole`；registry Phase 2。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 三 IDE manifest 缺失 | warn-skip |
| Cursor/OpenCode 作用域不一致 | 文档说明；各 adapter 注释 |

## Open Questions

- Claude Code 2026 官方 plugin 路径（Phase B 实现时核对）
