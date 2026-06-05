# BDR — Bad smell Driven Refactoring

BDR（坏味道驱动重构）是一套面向编码 Agent 的软件重构方法论与 Plugin 框架。它以坏味道识别为驱动力，在测试保护下小步改进代码内部质量，流程与规约定义见 [`docs/prd/`](docs/prd/)。

## 命令

| 命令 | 阶段 | 产出 |
|------|------|------|
| `bdr:explore` | 识别坏味道 | `badsmells.md` |
| `bdr:analyze` | 差分分析 | `analysis.md`、同步 `tasks.md` |
| `bdr:plan` | 任务分解 | `tasks.md` |
| `bdr:apply` | 重构执行 | 代码变更 + 状态回写 |

## 工作流

```
bdr:explore → 审阅 badsmells.md → bdr:analyze（badsmells 变更时）→ bdr:plan → 审阅 tasks.md → bdr:apply → 用户确认 → 重复
```

## 技术栈

- **Skill / Command**：Markdown + YAML frontmatter
- **Plugin 清单**：JSON（Cursor、Claude、Codex、OpenCode、Gemini）
- **Hooks / 脚本 / 测试**：Bash
- **OpenCode 插件**：Node.js ESM（仅内置模块，零 npm 依赖）
- **许可证**：MIT

## 设计参考

本框架的 **Plugin 架构、Skill-first 分层与零依赖技术栈选型** 参考了 [Superpowers](https://github.com/agiledon/superpowers) 的 Agent Skill 框架实践；BDR 的领域流程、规约与工件格式则独立定义于 [`docs/prd/constitution.md`](docs/prd/constitution.md) 与 [`docs/prd/specification.md`](docs/prd/specification.md)。

## 安装

### Cursor（本地 path install）

1. Clone 本仓库
2. 在 Cursor Agent 对话中：从本地路径安装插件（指向仓库根目录）
3. 验证 Skills：`using-bdr`、`bdr-explore`、`bdr-analyze`、`bdr-plan`、`bdr-apply`
4. 验证 Commands：`bdr:explore`、`bdr:analyze`、`bdr:plan`、`bdr:apply`

### OpenCode

见 [.opencode/INSTALL.md](.opencode/INSTALL.md)。

## 开发验证

```bash
bash scripts/validate-plugin.sh
```

手动验收清单：

- [ ] `bdr:explore .` 更新 badsmells 格式正确
- [ ] badsmells 升版后 `bdr:analyze` 同步 tasks
- [ ] `bdr:plan` 从 §2.0 开放条目生成 B-Txx
- [ ] `bdr:apply` 执行单任务并等待用户确认

## 文档

- [BDR 规约（docs/prd/）](docs/prd/README.md)
- [OpenSpec 变更：bdr-workflow](openspec/changes/bdr-workflow/proposal.md)
