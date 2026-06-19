# Gemini CLI 安装

## 推荐

```bash
npm link   # 在 openmole 仓库根目录
cd /path/to/your-project
openmole init --ides gemini
```

`openmole init` 会在项目内创建：

- `.gemini/skills/openmole-*/SKILL.md`
- `.gemini/commands/mole-*.md`
- `.gemini/extensions/openmole` → OpenMole 包根目录 symlink

扩展清单（包内）：`gemini-extension.json`。

## 验证

1. 重启 Gemini CLI
2. 运行 `/skills` — 应看到 `openmole-explore` 等
3. 描述触发或显式调用 skill 开始 OpenMole change

## 故障排除

```bash
openmole init --ides gemini --force
```
