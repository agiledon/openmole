# 在 OpenCode 上安装 BDR

## 推荐

```bash
npm link   # 在 bdr 仓库根目录
cd /path/to/your-project
bdr init --ides opencode
# 重启 OpenCode
```

`bdr init` 会在项目根目录创建或更新 `opencode.json`：

```json
{
  "plugin": ["/absolute/path/to/bdr/.opencode/plugins/bdr.js"]
}
```

用户级配置：`bdr init --ides opencode --global`

## 手动安装

在 `opencode.json` 中添加 `plugin` 路径（见上）。

## 验证

1. `skill` 工具 — 5 个 bdr-* skill
2. `/` — `/bdr-explore` … `/bdr-archive`
3. `/bdr-explore . demo-change`

## 工作区

`bdr/config.yaml` + `bdr/changes/<change-name>/`（由 `bdr init` 创建）
