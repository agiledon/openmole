# Claude Code 安装

## 推荐

```bash
npm link   # 在 bdr 仓库根目录
cd /path/to/your-project
bdr init --ides claude
```

`bdr init` 会创建用户级 symlink：

```
~/.claude/plugins/local/bdr → /path/to/bdr
```

插件清单：`.claude-plugin/plugin.json`（skills + commands）。

## 验证

1. 重启 Claude Code
2. 运行 `/plugin` 确认 **bdr** 已加载
3. Skills 应包含 `bdr-explore-to-change` 等（namespace 为 `/bdr:…`）

## 故障排除

若 symlink 已存在但 skills 未更新：

```bash
bdr init --ides claude --force
```
