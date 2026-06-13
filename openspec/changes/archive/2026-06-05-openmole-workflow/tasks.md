> **进度说明（2026-06-05）**：Phase 1 MVP（Cursor + OpenCode）已实现并通过 `bash scripts/validate-plugin.sh`。标注 **v1.1** 的项已移至 `openmole-change-workspace` Phase 2。

## 1. 技术栈骨架

- [x] 1.1 创建根目录：`skills/`、`commands/`、`agents/`、`hooks/`、`scripts/`、`tests/`、`templates/`、`.cursor-plugin/`、`.claude-plugin/`、`.codex-plugin/`、`.opencode/plugins/`（MVP 子集：skills、commands、scripts、tests、templates、.cursor-plugin、.opencode/plugins）
- [x] 1.2 编写最小 `package.json`（`name: openmole`、`type: module`、`main: .opencode/plugins/openmole.js`，**无 dependencies**）
- [ ] 1.3 编写 `.version-bump.json` 与 `scripts/bump-version.sh` **（v1.1）**
- [x] 1.4 编写 `.cursor-plugin/plugin.json`（MVP：skills、commands；agents/hooks 见 v1.1）
- [ ] 1.5 编写 `.claude-plugin/plugin.json` 与 `.claude-plugin/marketplace.json` **（v1.1）**
- [ ] 1.6 编写 `.codex-plugin/plugin.json` 与 `docs/README.codex.md` **（v1.1）**
- [x] 1.7 编写 `.opencode/INSTALL.md` 与 `.opencode/plugins/openmole.js`（ESM，仅 Node 内置模块）
- [ ] 1.8 编写 `gemini-extension.json` 与 `GEMINI.md` **（v1.1）**
- [ ] 1.9 编写 `hooks/hooks-cursor.json`、`hooks/hooks.json`、Bash `hooks/session-start`（注入 using-openmole）**（v1.1）**
- [x] 1.10 编写根级 `README.md`（含设计参考说明）；`AGENTS.md`、`CLAUDE.md` **（v1.1）**

## 2. Plugin 内容与 Agents

- [ ] 2.1 编写 `agents/code-reviewer.md`（apply 后审查）**（v1.1）**
- [ ] 2.2 确认 `.cursor-plugin/plugin.json` 注册 agents 与 hooks **（v1.1）**

## 3. 共享模板与配置

- [x] 3.1 创建 `templates/badsmells-header.md`（元信息表 + §1 说明 + §2.0 索引表头）
- [x] 3.2 创建 `templates/badsmells-entry.md`（specification §4 字段表格模板）
- [x] 3.3 创建 `templates/tasks-header.md`（执行约定 + 任务模板 + backlog 区）
- [x] 3.4 创建 `templates/analysis-header.md`（差分记录区 + 三角校验清单）
- [x] 3.5 创建 `templates/.openmole.yaml.example`（docs_root 配置示例）
- [x] 3.6 在 `using-openmole` skill 中记录 docs root 发现顺序（`.openmole.yaml` → `OPENMOLE_DOCS_ROOT` → `docs/openmole/` → `docs/prd/`）

## 4. 核心 Skill — using-openmole

- [x] 4.1 编写 `skills/using-openmole/SKILL.md`：OpenMole 工作流总览、四命令映射、强制加载规则
- [x] 4.2 在 skill 中嵌入 constitution §3～§5 与 specification §4～§7 摘要引用
- [x] 4.3 定义 RED FLAGS（跳过测绿、无 BS-ID 任务、未确认继续等）

## 5. Skill — openmole-explore

- [x] 5.1 编写 `skills/openmole-explore/SKILL.md`：扫描流程、语言检测、Fowler 坏味道对照表
- [x] 5.2 添加 Python 最佳实践附录（pytest、类型注解、模块边界）
- [x] 5.3 添加 Java 最佳实践附录（JUnit、Mockito、包结构）
- [x] 5.4 添加 TypeScript/JavaScript 最佳实践附录（可选）
- [x] 5.5 定义输出校验清单（§4 必填字段、§2.0 状态枚举、修订历史提交版本）
- [x] 5.6 编写 `commands/mole-explore.md`（frontmatter + 委托 openmole-explore skill，支持 `[path]` 参数）

## 6. Skill — openmole-plan

- [x] 6.1 编写 `skills/openmole-plan/SKILL.md`：读取 badsmells 未清除/部分残余条目、生成 tasks
- [x] 6.2 嵌入 constitution §4 步骤到任务模板（确认→补测→测绿→重构→回归→用户确认）
- [x] 6.3 实现 badsmells 版本门禁：过期 tasks 时提示先运行 analyze
- [x] 6.4 定义覆盖率可选步骤（pytest --cov / jacoco 等）写入指南
- [x] 6.5 编写 `commands/mole-plan.md`

## 7. Skill — openmole-apply

- [x] 7.1 编写 `skills/openmole-apply/SKILL.md`：选取下一未执行任务、逐步执行、测绿验证
- [x] 7.2 强制单任务/确认门：完成后暂停等待用户确认
- [x] 7.3 定义 SDD 联动检查（`[SDD]` 标记任务阻塞逻辑）
- [x] 7.4 定义完成后回写 badsmells §2.0 状态与 tasks checkbox 规则
- [x] 7.5 步骤 ① 补测可软引用用户环境中已有的 TDD 类 skill（不硬依赖）
- [x] 7.6 编写 `commands/mole-apply.md`

## 8. Skill — openmole-verify

- [x] 8.1 编写 `skills/openmole-verify/SKILL.md`：badsmells ↔ tasks 差分、obsolete/gap 检测
- [x] 8.2 定义 analysis.md 输出结构（最近一次差分、冲突项、建议 tasks 修订）
- [x] 8.3 编写 `commands/mole-verify.md`

## 9. 文档路径与仓库集成

- [x] 9.1 建立 `docs/reference/openmole/`：从 `docs/prd/` 同步 constitution、specification、badsmells、tasks、analysis
- [x] 9.2 编写 `scripts/sync-reference-docs.sh` 保持 reference 与 prd 一致
- [x] 9.3 创建 `.openmole.yaml`（`docs_root: docs/prd`）供本仓库开发验证
- [x] 9.4 更新 README 增加 Plugin 命令快速入口（`docs/openmole/` 迁移见 Phase 2）

## 10. 测试与验证

- [x] 10.1 编写 `tests/plugin/test-manifests.sh`（MVP：校验 Cursor plugin.json；多 platform 见 v1.1）
- [x] 10.2 编写 `tests/plugin/test-skills-frontmatter.sh`（SKILL.md name/description 必填）
- [x] 10.3 编写 `tests/opencode/test-plugin-loading.sh`（OpenCode openmole.js 可加载）
- [x] 10.4 编写 `tests/run-tests.sh` 聚合入口
- [x] 10.5 编写 `scripts/validate-plugin.sh`（manifest + skill + command 链接）
- [ ] 10.6 Cursor path-install 手动验证 — **跳过**（OpenCode ✓；完整验收见 openmole-change-workspace 8.4）
- [x] 10.7 添加 LICENSE（MIT）与 CHANGELOG 初版
