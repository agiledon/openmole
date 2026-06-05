# 在 OpenCode 上安装 BDR

## 前置条件

- 已安装 [OpenCode.ai](https://opencode.ai)
- Node.js 18+

## 本地 path 安装（开发）

在 `opencode.json` 中添加：

```json
{
  "plugin": ["/absolute/path/to/bdr/.opencode/plugins/bdr.js"]
}
```

将路径替换为本仓库的绝对路径。

## 验证

1. 重启 OpenCode
2. 使用 `skill` 工具列出 skills → 应看到 `bdr-explore`、`bdr-analyze`、`bdr-plan`、`bdr-apply`、`bdr-archive`
3. 输入 `/` 查看命令 → 应看到 `/bdr-explore`、`/bdr-analyze`、`/bdr-plan`、`/bdr-apply`、`/bdr-archive`
4. 运行：`/bdr-explore . demo-change`

> **说明**：OpenCode 通过 `bdr.js` 的 `config` hook 注册 commands（非 skills 自动发现）。命令名为 `/bdr-<phase>`，不是 `bdr:explore`。

## 工作区

目标项目使用 `bdr/config.yaml` + `bdr/changes/<change-name>/`。无需复制任何初始化文档。

## 故障排查

- **插件未加载：** 确认 `node .opencode/plugins/bdr.js` 无语法错误
- **Skills 缺失：** 确认仓库根目录下存在 `skills/` 目录
