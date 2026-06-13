# 在 OpenCode 上安装 OpenMole

## 推荐

```bash
npm link   # 在 openmole 仓库根目录
cd /path/to/your-project
openmole init --ides opencode
# 重启 OpenCode
```

`openmole init` 会在项目根目录创建或更新 `opencode.json`：

```json
{
  "plugin": ["/absolute/path/to/openmole/.opencode/plugins/openmole.js"]
}
```

用户级配置：`openmole init --ides opencode --global`

## 手动安装

在 `opencode.json` 中添加 `plugin` 路径（见上）。

## 验证

1. `skill` 工具 — 5 个 openmole-* skill
2. `/` — `/openmole-explore` … `/openmole-archive`
3. `/openmole-explore . demo-change`

## 工作区

`openmole/config.yaml` + `openmole/changes/<change-name>/`（由 `openmole init` 创建）
