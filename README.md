# BDR — Bad smell Driven Refactoring

BDR（坏味道驱动重构）是一套面向编码 Agent 的软件重构方法论与 Plugin 框架。规约内嵌于各 Skill；目标项目工件位于 `bdr/changes/<change-name>/`。

## 命令

| 命令 | 阶段 | 产出 |
|------|------|------|
| `bdr:explore` | 创建/继续 change，识别坏味道 | `bdr/changes/<name>/badsmells.md` |
| `bdr:analyze` | 差分分析 | `analysis.md`、同步 `tasks.md` |
| `bdr:plan` | 任务分解 | `tasks.md` |
| `bdr:apply` | 重构执行 | 代码变更 + 状态回写 |
| `bdr:archive` | 归档 change | `bdr/changes/archive/YYYY-MM-DD-<name>/` |

## 工作区

```
bdr/
├── config.yaml              # current_change
└── changes/
    ├── <change-name>/
    │   ├── badsmells.md
    │   ├── tasks.md
    │   └── analysis.md
    └── archive/
```

## 工作流

```
bdr:explore → 审阅 badsmells → bdr:analyze → bdr:plan → 审阅 tasks → bdr:apply → 用户确认 → bdr:archive
```

## 技术栈

- **Skill / Command**：Markdown + YAML frontmatter
- **Plugin**：Cursor + OpenCode（MVP）
- **OpenCode**：Node.js ESM（零 npm 依赖）
- **许可证**：MIT

## 设计参考

Plugin 架构参考 [Superpowers](https://github.com/agiledon/superpowers)；BDR 流程与规约内嵌于 Skill 正文。

## 安装

### Cursor（本地 path install）

1. Clone 本仓库并 path-install
2. 验证 Skills：`bdr-explore`、`bdr-analyze`、`bdr-plan`、`bdr-apply`、`bdr-archive`
3. 验证 Commands：`bdr:explore` … `bdr:archive`

### OpenCode

见 [.opencode/INSTALL.md](.opencode/INSTALL.md)。

## 开发验证

```bash
bash scripts/validate-plugin.sh
```

## 文档

- [整合设计](docs/design/2026-06-05-bdr-change-workspace-design.md)
- [OpenSpec：bdr-change-workspace](openspec/changes/bdr-change-workspace/proposal.md)
