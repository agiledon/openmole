# 在 Cursor 上安装 BDR

## 推荐

```bash
npm link   # 在 bdr 仓库根目录
cd /path/to/your-project
bdr init --ides cursor
# Cmd+Q 重启 Cursor
```

## 手动 symlink

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn /absolute/path/to/bdr ~/.cursor/plugins/local/bdr
```

## 验证

1. **Settings → Rules → Agent Decides** — 5 个 `bdr-*` skill
2. Agent 输入 `/` — `/bdr-explore` … `/bdr-archive`
3. `/bdr-explore . demo-change`

## 故障排查

| 现象 | 处理 |
|------|------|
| 无 skill/command | Cmd+Q 完全重启 |
| 企业版 | Admin 开启 **Allow Local Plugin Imports** |

## 卸载

```bash
rm ~/.cursor/plugins/local/bdr
```
