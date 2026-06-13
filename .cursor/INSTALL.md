# 在 Cursor 上安装 OpenMole

## 推荐

在**目标项目**目录运行（会在项目内创建 `.cursor/skills/` 与 `.cursor/commands/`）：

```bash
npm link   # 在 openmole 仓库根目录
cd /path/to/your-project
openmole init --ides cursor
# Cmd+Q 重启 Cursor
```

验证：

1. 项目内存在 `.cursor/skills/openmole-explore-to-change/SKILL.md`
2. 项目内存在 `.cursor/commands/openmole-explore.md`（`name: /openmole-explore`）
3. Agent 输入 `/` → `/openmole-explore` … `/openmole-archive`（command 名不变；对应 skill 为 `openmole-*-change`）

若之前只装过用户级 symlink 而无 `.cursor/`，请重跑：

```bash
openmole init --ides cursor --force
```

## 故障排查

| 现象 | 处理 |
|------|------|
| 无 skill/command | Cmd+Q 完全重启 |
| 企业版 | Admin 开启 **Allow Local Plugin Imports** |

## 卸载

```bash
rm ~/.cursor/plugins/local/openmole
```
