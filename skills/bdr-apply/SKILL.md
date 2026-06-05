---
name: bdr-apply
description: bdr:apply — 执行当前 change 下一个未完成的 B-Txx
---

# BDR Apply — 执行重构

## 何时使用

用户运行 `bdr:apply`，且当前 change 有未完成任务。

## 工作区解析

1. 读取 `bdr/config.yaml` → `current_change`
2. `{change_dir}` = `bdr/changes/{change_name}/`
3. 无 `current_change` → **停止**，提示先 `bdr:explore`

## 选取任务

1. 读取 `{change_dir}/tasks.md` §3
2. 下一 `[ ]` 的 **B-Txx**，依赖均已 `[x]`
3. **每次 invocation 仅一个任务**

## 执行步骤

| 步骤 | 动作 |
|------|------|
| ① | 确认 BS-ID 与 badsmells 一致 |
| ② | 补测（pytest/JUnit 等） |
| ③ | 测绿 |
| ④ | 重构（`[SDD]` 须先确认 SDD 已修订） |
| ⑤ | 回归测绿 |
| ⑥ | **用户确认** |

## 完成后

- `{change_dir}/tasks.md` 标记 `[x]`
- 满足 DoD 时更新 `{change_dir}/badsmells.md` §2.0

## BDR 规约摘要（内嵌于各 Skill，非独立文件）

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

每次 `bdr:apply` 仅处理一个未完成任务。

### specification §4 — badsmells 条目

七字段 + §2.0 状态：**未清除** / **已消除** / **部分残余**。

### specification §7 — 修订历史

升版时 **提交版本** = `git rev-parse HEAD`，未提交填 `—`。

## RED FLAGS

- 测试未绿仍标记完成
- 跳过用户确认
- 一次 apply 多个任务
