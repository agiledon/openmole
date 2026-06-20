# Codex 安装

## 推荐

```bash
npm link   # 在 openmole 仓库根目录
cd /path/to/your-project
openmole init --ides codex
```

`openmole init` 在项目 `.codex/skills/` 写入 OpenMole skill 文件。

> **注意**：Codex 仅支持 skill（通过 `$` 符号引用），没有独立的 slash 命令机制。

## 验证

1. 重启 Codex
2. 通过 `$` 查看可用 skill，应包含 `openmole-explore` 等
3. skills 自动从 `.codex/skills/` 发现，无需额外配置

## 故障排除

```bash
openmole init --ides codex --force
```
