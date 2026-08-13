# 在 Pi 上安装 OpenMole

## 推荐

```bash
npm link   # 在 openmole 仓库根目录
cd /path/to/your-project
openmole init --ides pi
# 重启 Pi
```

`openmole init` 会在项目根目录创建或更新 `.pi/settings.json`：

```json
{
  "extensions": ["/absolute/path/to/openmole/.pi/extensions/openmole.ts"]
}
```

用户级配置：`openmole init --ides pi --global`（写入 `~/.pi/agent/settings.json`）。

## 手动安装

在 `.pi/settings.json` 中添加 `extensions` 路径（见上）。

## 验证

1. `skills` — 5 个 openmole-* skill
2. `/` — `/mole-explore` … `/mole-archive`
3. `/mole-explore . demo-change`

## 工作区

`openmole/config.yaml` + `openmole/changes/<change-name>/`（由 `openmole init` 创建）
