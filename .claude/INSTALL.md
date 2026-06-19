# Claude Code 安装

## 推荐

```bash
npm link   # 在 openmole 仓库根目录
cd /path/to/your-project
openmole init --ides claude
```

`openmole init` 会创建用户级 symlink：

```
~/.claude/plugins/local/openmole → /path/to/openmole
```

插件清单：`.claude-plugin/plugin.json`（skills + commands）。

## 验证

1. 重启 Claude Code
2. 运行 `/plugin` 确认 **openmole** 已加载
3. Skills 应包含 `openmole-explore` 等

## 故障排除

若 symlink 已存在但 skills 未更新：

```bash
openmole init --ides claude --force
```
