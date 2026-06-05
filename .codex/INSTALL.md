# Codex 安装

## 推荐

```bash
npm link   # 在 bdr 仓库根目录
cd /path/to/your-project
bdr init --ides codex
```

`bdr init` 会：

1. 创建 `plugins/bdr` → BDR 包根目录 symlink
2. 合并 `.agents/plugins/marketplace.json` 注册本地 plugin

插件清单：`.codex-plugin/plugin.json`。

## 验证

1. 运行 `codex /plugins` 或在 Codex 中打开插件列表
2. 确认 **bdr** 可用并已启用
3. 使用 `@bdr` 或插件内 skills 触发 BDR 工作流

## 故障排除

```bash
bdr init --ides codex --force
```
