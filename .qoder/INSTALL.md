# Qoder 安装

## 推荐

```bash
npm install -g agile-bdr   # 或 npm link（在 bdr 仓库根目录）
cd /path/to/your-project
bdr init --ides qoder
```

`bdr init` 会在项目内创建：

- `.qoder/skills/bdr-*-change/SKILL.md`
- `.qoder/commands/bdr-*.md`

路径与 Qoder skills CLI（`-a qoder`）一致，详见 [Qoder 文档](https://docs.qoder.com)。

## 验证

1. 重启 Qoder
2. 应可发现 `bdr-explore-to-change` 等 skill
3. 使用 `/bdr-explore` … `/bdr-archive` 开始 BDR 工作流

## 故障排除

```bash
bdr init --ides qoder --force
```

## Git

`.qoder/skills/` 与 `.qoder/commands/` 为项目配置，建议提交到版本库。
