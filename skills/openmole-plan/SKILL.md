---
name: openmole-plan
description: mole-plan — 从未清除/部分残余坏味道生成 tasks.md
---

# OpenMole Plan — 任务分解

> **路径解析说明**：
> - `{cwd}` = 用户运行 mole 命令时的当前工作目录（目标项目根目录）
> - `{config_dir}` = OpenMole 用户级配置目录（`~/.config/openmole/`）
> - 项目级文件（`config.yaml`、`changes/`）位于 `{cwd}/openmole/`
> - 共享资源（`templates/`）位于 `{config_dir}/`

## 何时使用

用户运行 `mole-plan`，或在 analyze 完成后生成/更新任务。

## 工作区解析

1. 读取 `{cwd}/openmole/config.yaml` → `current_change`
2. `{change_dir}` = `{cwd}/openmole/changes/{change_name}/`
3. 无 `current_change` → **停止**，提示先 `mole-explore`

## 门禁

若 `{change_dir}/badsmells.md` 版本 **高于** 同目录 `tasks.md` 页眉依据版本 → **停止**，先 `mole-verify`

## 级别感知

| 条件 | 行为 |
|------|------|
| 显式指定级别（`mole-plan arch`） | 锁定为 ARCH |
| 隐式 | 从前次 explore 输出的子目录推断 |
| 跨级别 | 分别检查 arch/、design/、impl/ 下 badsmells.md |

## 任务生成

1. 读取 `{change_dir}/{level}/badsmells.md` §2.0
2. 选取 **未清除** / **部分残余** 条目
3. ID：`B-T序号`；模板：`{config_dir}/templates/tasks-entry.md`、`{config_dir}/templates/tasks-header.md`（模板解析见 `skills/openmole-explore/SKILL.md` §模板解析）
4. 每任务按级别填写步骤：
   - IMPL 6 步
   - DESIGN 7 步
   - ARCH 8 步
5. 写入 `{change_dir}/{level}/tasks.md` §3

## OpenMole 规约摘要（内嵌于各 Skill，非独立文件）

### constitution §2 — 三级坏味道

| 级别 | ID前缀 | 范围 |
|------|--------|------|
| 架构级 | ARCH | 模块化、耦合、内聚、层次、边界、演进 |
| 设计级 | DESIGN | 封装、继承、模块化、冗余 |
| 实现级 | IMPL | 函数、命名、参数、注释、语言惯用法 |

### constitution §3 — 八项第一性原则

清晰性、一致性、可读性、复用性、可扩展性、健壮性、安全性、简洁性。

### constitution §3a — 安全原则（写操作门禁）

> 所有写操作（文档/代码的新建、修改、删除）必须由 AI 生成操作范围与变更 diff，展示给用户并获得明确确认后方可执行。**该门禁不可豁免。**

### constitution §4 — 标准重构步骤（级别特定）

**IMPL（6 步）**：① 确认坏味道 / ② 补测 / ③ 测绿 / ④ 应用重构手法（语言感知）/ ⑤ 回归测绿 / ⑥ **用户确认**（写操作门禁）

**DESIGN（7 步）**：① 确认坏味道 / ② 识别接缝（Feathers）/ ③ 测试安全网 / ④ 解依赖 / ⑤ 应用重构 / ⑥ 回归测绿 / ⑦ **用户确认**（写操作门禁）

**ARCH（8 步）**：① 确认坏味道 / ② 影响分析 / ③ 测试安全网 / ④ 选择架构模式 / ⑤ 迁移计划（可豁免）/ ⑥ 增量执行 / ⑦ 回归测绿 / ⑧ **用户确认**（写操作门禁）

### constitution §5 — 执行粒度

每次 `mole-apply` 仅处理一个未完成任务。

### specification §4 — badsmells 条目

**级别** + 六字段 + §2.0 状态：**未清除** / **已消除** / **部分残余**。

### specification §7 — 修订历史

升版时 **提交版本** = `git rev-parse HEAD`，未提交填 `—`。

## 完成后建议

规划完成后，建议继续执行 `mole-verify` 验证 badsmells 与 tasks 覆盖一致性。

## RED FLAGS

- 跳过 verify 门禁
- 任务无法追溯到 BS-ID
- 步骤模板与任务级别不匹配
