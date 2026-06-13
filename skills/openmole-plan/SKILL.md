---
name: openmole-plan
description: mole:plan — 从未清除/部分残余坏味道生成 tasks.md
---

# OpenMole Plan — 任务分解

## 何时使用

用户运行 `mole:plan`，或在 analyze 完成后生成/更新任务。

## 工作区解析

1. 读取 `openmole/config.yaml` → `current_change`
2. `{change_dir}` = `openmole/changes/{change_name}/`
3. 无 `current_change` → **停止**，提示先 `mole:explore`

## 门禁

若 `{change_dir}/badsmells.md` 版本 **高于** 同目录 `tasks.md` 页眉依据版本 → **停止**，先 `mole:verify`

## 任务生成

1. 读取 `{change_dir}/badsmells.md` §2.0
2. 选取 **未清除** / **部分残余** 条目
3. ID：`B-T序号`；模板：`templates/tasks-entry.md`、`tasks-header.md`
4. 每任务六步：确认 → 补测 → 测绿 → 重构 → 回归 → 用户确认
5. 写入 `{change_dir}/tasks.md` §3

## OpenMole 规约摘要（内嵌于各 Skill，非独立文件）

### constitution §3 — 八项第一性原则

清晰性、一致性、可读性、复用性、可扩展性、健壮性、安全性、简洁性。

### constitution §4 — 标准重构步骤

1. 确认坏味道条目
2. 确定测试覆盖；无覆盖则先写测试
3. 运行测试 → 全绿
4. 执行重构（最小 diff，对准 BS-ID）
5. 回归测试 → 全绿
6. **用户确认**（未确认不得标记完成）

### constitution §5 — 执行粒度

每次 `mole:apply` 仅处理一个未完成任务。

### specification §4 — badsmells 条目

七字段 + §2.0 状态：**未清除** / **已消除** / **部分残余**。

### specification §7 — 修订历史

升版时 **提交版本** = `git rev-parse HEAD`，未提交填 `—`。

## 完成后建议

规划完成后，建议继续执行 `mole:verify` 验证 badsmells 与 tasks 覆盖一致性。

## RED FLAGS

- 跳过 verify 门禁
- 任务无法追溯到 BS-ID
