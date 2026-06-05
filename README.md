# BDR — Bad smell Driven Refactoring

BDR（坏味道驱动重构）是一套面向编码 Agent 的软件重构方法论与 Plugin 框架。规约内嵌于各 Skill；目标项目工件位于 `bdr/changes/<change-name>/`。

## 命令与 Skill

| 命令 | Skill | 阶段 |
|------|-------|------|
| `bdr:explore` / `/bdr-explore` | `bdr-explore-to-change` | 创建/继续 change，识别坏味道 |
| `bdr:analyze` / `/bdr-analyze` | `bdr-analyze-change` | 差分分析 |
| `bdr:plan` / `/bdr-plan` | `bdr-plan-change` | 任务分解 |
| `bdr:apply` / `/bdr-apply` | `bdr-apply-change` | 重构执行 |
| `bdr:archive` / `/bdr-archive` | `bdr-archive-change` | 归档至 `bdr/changes/archive/` |

各阶段主要产出：`badsmells.md`、`analysis.md`、`tasks.md`、代码变更。

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

### 推荐：`bdr init`

```bash
# 开发期（本仓库）
cd /path/to/bdr && npm install && npm link

# 在目标项目目录
cd /path/to/your-project
bdr init                    # 交互式选择 IDE
bdr init --ides cursor,opencode   # 非交互
bdr init --none             # 仅初始化 bdr/ 工作区
```

`bdr init` 会：

1. 创建 `bdr/config.yaml`、`bdr/changes/`、`bdr/changes/archive/`
2. 按所选 IDE 配置 skill/command（Cursor 用户级；OpenCode 项目级 `opencode.json`）

### 手动安装（fallback）

**Cursor** — [.cursor/INSTALL.md](.cursor/INSTALL.md)  
**OpenCode** — [.opencode/INSTALL.md](.opencode/INSTALL.md)

## 开发验证

```bash
bash scripts/validate-cli.sh      # CLI + plugin
bash scripts/validate-plugin.sh   # plugin only
```

## 文档

- [整合设计](docs/design/2026-06-05-bdr-change-workspace-design.md)
- [OpenSpec：bdr-change-workspace（已归档）](openspec/changes/archive/2026-06-05-bdr-change-workspace/proposal.md)
