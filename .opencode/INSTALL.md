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
2. 使用 `skill` 工具列出 skills → 应看到 `using-bdr`、`bdr-explore` 等
3. 输入："Run bdr:explore on this project"

## 故障排查

- **插件未加载：** 确认 `node .opencode/plugins/bdr.js` 无语法错误
- **Skills 缺失：** 确认仓库根目录下存在 `skills/` 目录
