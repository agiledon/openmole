# 在 Cursor 上安装 BDR

## 前置条件

- Cursor 2.4+（支持 Plugin / Skills）
- 本仓库已 clone 到本地

## 本地 path-install（开发）

```bash
bash scripts/install-cursor-plugin.sh
```

该脚本会在 `~/.cursor/plugins/local/bdr` 创建指向本仓库的 symlink。

或手动执行：

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn /absolute/path/to/bdr ~/.cursor/plugins/local/bdr
```

## 重启

**必须 Cmd+Q 完全退出 Cursor 后重新打开**（Reload Window 不足以加载 commands）。

## 验证

1. **Settings → Rules → Agent Decides** 中应看到 5 个 skill：
   `bdr-explore`、`bdr-analyze`、`bdr-plan`、`bdr-apply`、`bdr-archive`
2. Agent 对话中输入 `/`，应出现：
   `/bdr-explore`、`/bdr-analyze`、`/bdr-plan`、`/bdr-apply`、`/bdr-archive`
3. 在测试项目中运行：`/bdr-explore . demo-change`

> **说明**：Cursor 命令名为 `/bdr-<phase>`（frontmatter `name: bdr-explore`）。文档中的 `bdr:explore` 为逻辑命名，TUI 入口为 slash command。

## 故障排查

| 现象 | 处理 |
|------|------|
| Settings 无 skill | 检查 symlink 与 `.cursor-plugin/plugin.json` 是否存在 |
| 有 skill 无 command | Cmd+Q 完全重启；确认 `commands/bdr-*.md` 含 `name:` frontmatter |
| 企业版无本地插件 | Admin 开启 **Allow Local Plugin Imports** |
| Agent 不遵循流程 | 使用 `/bdr-explore` 等命令，勿仅用自然语言 |

## 卸载

```bash
rm ~/.cursor/plugins/local/bdr
```

然后 Cmd+Q 重启 Cursor。
