# Gemini CLI 安装

## 推荐

```bash
npm link   # 在 bdr 仓库根目录
cd /path/to/your-project
bdr init --ides gemini
```

`bdr init` 会在项目内创建：

- `.gemini/skills/bdr-*-change/SKILL.md`
- `.gemini/commands/bdr-*.md`
- `.gemini/extensions/bdr` → BDR 包根目录 symlink

扩展清单（包内）：`gemini-extension.json`。

## 验证

1. 重启 Gemini CLI
2. 运行 `/skills` — 应看到 `bdr-explore-to-change` 等
3. 描述触发或显式调用 skill 开始 BDR change

## 故障排除

```bash
bdr init --ides gemini --force
```
