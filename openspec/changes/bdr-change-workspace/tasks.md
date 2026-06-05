## 1. 参考 bundle 净化（无需安装复制）

- [ ] 1.1 **确认结论**：安装时 **不** 提供复制 prompt（design D1）；更新 README / INSTALL 说明
- [ ] 1.2 重写 `docs/reference/bdr/constitution.md`：版本 **0.1.0**，路径改为 `bdr/changes/<change>/`，去除 Eywa/SDD 仓库内链
- [ ] 1.3 重写 `docs/reference/bdr/specification.md`：版本 **0.1.0**，对齐 change 工作区
- [ ] 1.4 重写 `docs/reference/bdr/badsmells.md`：2 条通用示例（虚构 `src/example/`），版本 **0.1.0**
- [ ] 1.5 重写 `docs/reference/bdr/tasks.md`、`analysis.md`：各 1 条与示例对应内容，版本 **0.1.0**
- [ ] 1.6 更新 `docs/reference/bdr/README.md`：说明 bundle 为 Plugin 内置只读规约，非安装复制目标
- [ ] 1.7 修改 `scripts/sync-reference-docs.sh`：**停止** 从 `docs/prd/` 同步；改为校验 reference 完整性或移除脚本
- [ ] 1.8 在各 Skill 中实现 bundle fallback 路径解析（`{plugin}/docs/reference/bdr/`）

## 2. bdr/ 工作区与 change 模型

- [ ] 2.1 定义 `bdr/config.yaml` schema（`current_change`、可选 metadata）
- [ ] 2.2 定义 `bdr/changes/<name>/.bdr-change.yaml` schema（name, created, scan_scope, status）
- [ ] 2.3 新增 `templates/bdr-change.yaml`、更新 `templates/.bdr.yaml.example` → `templates/bdr-config.yaml.example`
- [ ] 2.4 更新 `.bdr.yaml` 或迁移说明（本仓库 dogfood 用 `bdr/` 布局）
- [ ] 2.5 在各阶段 Skill 统一「工作区解析」节：current change、`{change_dir}` 变量

## 3. 移除 using-bdr

- [ ] 3.1 删除 `skills/using-bdr/SKILL.md` 及目录
- [ ] 3.2 更新 `bdr-explore/analyze/plan/apply`：移除「加载 using-bdr」；内联工作区解析 + RED FLAGS
- [ ] 3.3 更新 `.opencode/plugins/bdr.js`：短 bootstrap，不读取 using-bdr 文件
- [ ] 3.4 更新 `tests/plugin/test-skills-frontmatter.sh` 期望 **5 skills**（无 using-bdr，含 archive）
- [ ] 3.5 更新 README、INSTALL 技能列表

## 4. bdr-explore — change 创建与去重

- [ ] 4.1 更新 `skills/bdr-explore/SKILL.md`：explore = 新 change；`[path] [change-name]` 参数
- [ ] 4.2 实现自动命名 + 用户确认流程
- [ ] 4.3 实现跨 change 去重步骤（扫描 changes/ + archive/ §2.0）
- [ ] 4.4 输出路径改为 `{change_dir}/badsmells.md`
- [ ] 4.5 更新 `commands/bdr-explore.md` 参数说明

## 5. bdr-analyze / plan / apply — change 作用域

- [ ] 5.1 更新 `skills/bdr-analyze/SKILL.md`：读写 `{change_dir}/`
- [ ] 5.2 更新 `skills/bdr-plan/SKILL.md`：读写 `{change_dir}/`；analyze 门禁限定同 change
- [ ] 5.3 更新 `skills/bdr-apply/SKILL.md`：读写 `{change_dir}/`
- [ ] 5.4 确认三 command 文件无需参数变更（默认 current change）

## 6. bdr-archive（新增）

- [ ] 6.1 编写 `skills/bdr-archive/SKILL.md`：完成度检查、用户确认门、归档移动
- [ ] 6.2 编写 `commands/bdr-archive.md`
- [ ] 6.3 归档命名 `bdr/changes/archive/YYYY-MM-DD-<change-name>/`
- [ ] 6.4 归档后更新 `config.yaml` 与 `.bdr-change.yaml`

## 7. 测试与文档

- [ ] 7.1 更新 `tests/plugin/test-skills-frontmatter.sh`（5 skills）
- [ ] 7.2 更新 `scripts/validate-plugin.sh`（含 bdr-archive command 链接）
- [ ] 7.3 新增 `tests/plugin/test-reference-bundle.sh`：无 Eywa 字眼、版本 0.1.0
- [ ] 7.4 更新 README：工作区布局、`bdr/changes/` 流程、五命令 + archive
- [ ] 7.5 手动验收：空项目 path-install → explore 创建 change → plan → apply → archive

## 8. OpenSpec 与规约对齐

- [ ] 8.1 本变更实现完成后 sync delta specs 至 `openspec/specs/`
- [ ] 8.2 更新 `openspec/config.yaml` context（`bdr/` 工作区、非 docs/prd 运行时路径）
