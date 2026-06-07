## Context

- Phase A/B/2 已完成：`bdr init` / `bdr update`、5 IDE adapter、GitHub-first 安装（`bdr` npm 名被占用）
- OpenSpec CLI welcome 参考：左侧像素/ASCII logo + 青色 accent + 右侧说明 + Enter 继续 → IDE/tool 选择
- npm 检查：`agile-bdr` → **404 Not Found**（2026-06-07），可用
- Kiro：项目 `.kiro/skills/`、`.kiro/commands/`；Agent Skills 标准，slash 调用
- Qoder：项目 `.qoder/skills/`、`.qoder/commands/`；与 skills CLI `-a qoder` 路径一致

## Goals / Non-Goals

**Goals:**

- OpenSpec 级 welcome UX（闪烁 R logo、BDR 文案、Enter → IDE multiselect）
- npm 发布为 **`agile-bdr`**，bin 仍为 **`bdr`**
- Kiro、Qoder 项目级 adapter，与 Cursor/Gemini 复制模式一致
- 命令 `/bdr-*` 与 skill `bdr-*-change` **不变**

**Non-Goals:**

- 不重命名 command/skill 文件
- 不实现 Kiro Powers / Qoder JetBrains 插件（仅 Agent Skills + commands 路径）
- 不改 `bdr/` workspace 语义

## Decisions

### D1：Welcome 实现 — `@clack/prompts` intro + 自定义 ANSI

- **选择**：`cli/prompts/welcome.js` 清屏后渲染 ASCII **R**（块状字符），`setInterval` 切换亮/暗青色（`#26a69a` / dim）；`@clack/prompts` `intro` + `note` 展示文案；`confirm` 或 readline「Press Enter」继续
- **备选**：纯 readline 无动画 — 拒绝，不符合截图体验
- **触发**：`bdr` 无参数 → welcome → 自动进入 `init` 流程（IDE 选择）；`bdr init` 在 TTY 下先 welcome 再 multiselect；`--ides` / 非 TTY 跳过 welcome

### D2：Quick start 文案（来自 README）

```
/bdr-explore  — 创建/继续 change，识别坏味道
/bdr-analyze  — 差分分析
/bdr-plan     — 任务分解
/bdr-apply    — 执行重构
/bdr-archive  — 归档 change
```

配置摘要：Agent Skills + `/bdr-*` slash commands · `bdr/` workspace · 7 IDE harnesses

### D3：npm 包名 `agile-bdr`

- **选择**：`package.json` `"name": "agile-bdr"`；`"bin": { "bdr": "./bin/bdr.js" }` 不变
- **发布**：`npm publish --access public`（需 maintainer login）
- **GitHub 安装**：`npm install -g github:agiledon/bdr` 仍可用；registry 为 `npm install -g agile-bdr`

### D4：Kiro / Qoder adapter — 项目级 copy（同 Cursor/Gemini）

| IDE | 路径 | 方式 |
|-----|------|------|
| Kiro | `.kiro/skills/`、`.kiro/commands/` | copy skills + commands |
| Qoder | `.qoder/skills/`、`.qoder/commands/` | copy skills + commands |

- `IDE_DEFINITIONS` 增加 `{ value: 'kiro', label: 'Kiro' }`、`{ value: 'qoder', label: 'Qoder' }`
- `config.yaml` `installed_ides` 注释更新为 7 IDE

### D5：Logo 颜色

- 主色 ANSI：`38;2;38;166;154`（RGB 38,166,154 ≈ Teal 400）
- 闪烁：每 500ms 切换 full brightness / dim (`2` off)

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 非 TTY 环境闪烁乱码 | 检测 `process.stdout.isTTY`，非 TTY 跳过动画 |
| npm 发布需认证 | 文档说明 `npm login`；CI 可选 |
| Kiro/Qoder 路径随上游变更 | adapter 注释 + INSTALL.md 链官方文档 |
| `agile-bdr` 与 repo 名 `bdr` 不一致 | README 说明；repository 仍指向 agiledon/bdr |

## Migration Plan

1. 实现 welcome + Kiro/Qoder adapters + 测试
2. 重命名 package.json → `agile-bdr`，bump minor
3. 更新 README / INSTALL
4. `npm publish` + 验证 `npm install -g agile-bdr`
5. 现有 `npm link` 用户：`npm link` 不受影响

## Open Questions

- Kiro 是否需要 user-level `~/.kiro/skills/` symlink（Phase 1 仅项目级）
- Welcome 是否在 `bdr update` 显示（默认 **否**）
