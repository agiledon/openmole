# Kiro 安装

## 推荐

```bash
npm install -g agile-bdr   # 或 npm link（在 bdr 仓库根目录）
cd /path/to/your-project
bdr init --ides kiro
```

`bdr init` 会在项目内创建：

- `.kiro/skills/bdr-*-change/SKILL.md`
- `.kiro/commands/bdr-*.md`

Kiro 使用 [Agent Skills](https://agentskills.io) 标准；项目级 skills 由 Kiro 自动发现。

## 验证

1. 重启 Kiro
2. 在 Agent 对话中应可发现 `bdr-explore-to-change` 等 skill
3. 使用 `/bdr-explore` 等 slash 命令开始 BDR change

## 故障排除

```bash
bdr init --ides kiro --force
```

## Git

`.kiro/skills/` 与 `.kiro/commands/` 为项目配置，建议提交到版本库（与 `.cursor/` 同类）。
