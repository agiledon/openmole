## Why

当前 BDR Plugin 将工件写入 `docs/bdr/` 或 `docs/prd/` 单目录，且 `docs/reference/bdr/` 仍含 Eywa 框架真实重构内容；一次 explore 覆盖全项目 badsmells，无法像 OpenSpec 那样按变更隔离、归档与追溯。目标项目安装插件后也不应依赖复制 Eywa 专用文档才能正确执行 BDR。需要将工作区改为 **`bdr/` 根目录 + `changes/` 变更模型**，并明确初始化策略、跨 change 去重与归档能力。

## What Changes

- **结论：安装时复制参考目录非必须。** constitution / specification 由 **Plugin 内置 bundle**（`docs/reference/bdr/`，将净化为 v0.1 通用版）在运行时只读提供；目标项目 **无需** 复制即可执行 explore → analyze → plan → apply。**不提供** OpenCode/Cursor 安装后「是否复制初始化文件」的交互。
- **净化 Plugin 参考 bundle**：保留 constitution / specification / 模板结构；版本统一 **0.1.0**；移除 Eywa 专有内容与字眼；badsmells / tasks / analysis 各保留 **1～2 条通用示例**（虚构模块名）。
- **BREAKING**：工件输出路径从 `{docs_root}/`（`docs/bdr/`、`docs/prd/`）改为 **`{project}/bdr/changes/<change-name>/`**；constitution / specification 从 **`bdr/` 根或 Plugin bundle** 读取，不再写入 per-change 目录。
- **`bdr:explore [path] [change-name]`** 每次启动 **新 change**；未指定名称时由 Agent 根据扫描范围/重构主题提炼 kebab-case 名；写入 `bdr/changes/<change-name>/`。
- **跨 change 去重**：explore 前读取历史 change（含 archive 索引）已有 BS-ID 与位置指纹，避免重复识别同一坏味道。
- **新增 `bdr:archive`**：Skill + Command；检查当前 change 坏味道/tasks 是否全部消除；未完成时提示并由用户决定是否仍归档；完成项移至 `bdr/changes/archive/YYYY-MM-DD-<change-name>/`。
- **移除 `using-bdr` Skill**：路由、工作区解析、RED FLAGS 并入各阶段 Skill 与 Plugin 极简 bootstrap（OpenCode `bdr.js` 不再注入完整 using-bdr 正文）。

## Capabilities

### New Capabilities

- `bdr-archive`: `bdr:archive` 命令与 Skill；change 完成度检查、用户确认门、归档至 `bdr/changes/archive/`。

### Modified Capabilities

- `bdr-core`: 工作区路径模型（`bdr/changes/`）、Plugin bundle 规约解析、移除 using-bdr、移除安装复制流程、current change 配置。
- `bdr-explore`: 创建 change 目录、命名规则、跨 change 坏味道去重、输出至 change  scope。
- `bdr-analyze`: 读取/写入 `{change_dir}/analysis.md` 与 tasks 同步。
- `bdr-plan`: 读取 `{change_dir}/badsmells.md`，写入 `{change_dir}/tasks.md`。
- `bdr-apply`: 读取 `{change_dir}/tasks.md`，回写 change 内工件。

## Impact

- **Plugin 参考内容**：`docs/reference/bdr/` 全面重写（非 Eywa）；`docs/prd/` 保留为 BDR 插件仓库开发用真源，与目标项目 bundle 分离。
- **Skills / Commands**：删除 `using-bdr`；新增 `bdr-archive`；更新 explore/analyze/plan/apply 路径与去重逻辑；更新 5 个 command 参数说明。
- **OpenCode / Cursor**：`bdr.js` bootstrap 缩短；无安装复制 prompt；manifest 技能列表变更。
- **配置**：`.bdr.yaml` / `bdr/config.yaml` 语义调整（`current_change`、可选本地 constitution 覆盖）。
- **测试**：frontmatter 计数、validate-plugin command→skill 链接、manifest 技能名更新。
- **Breaking**：现有依赖 `docs/prd` 或 `docs/bdr` 单目录工作流的 Skill 行为全部迁移至 change 模型。
