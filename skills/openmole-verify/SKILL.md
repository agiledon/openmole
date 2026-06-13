---
name: openmole-verify
description: mole:verify — 当前 change 内 badsmells 与 tasks 差分验证
---

# OpenMole Verify — 差分验证

## 何时使用

- 当前 change 的 `badsmells.md` 变更后 **必须** 运行
- `mole:plan` 执行后 / `mole:apply` 前验证 tasks 与 badsmells 一致性

## 工作区解析

1. 读取 `openmole/config.yaml` → `current_change`
2. `{change_dir}` = `openmole/changes/{change_name}/`
3. 无 `current_change` → **停止**，提示先 `mole:explore`

## 强制差分步骤

| 步骤 | 动作 |
|------|------|
| A | 列出 `{change_dir}/badsmells.md` 全部 BS-ID |
| B | 列出 `{change_dir}/tasks.md` 各任务 BS-ID |
| C | 新增 BS-ID → 增补 B-Txx |
| D | 删除/合并 BS-ID → 处理孤儿任务 |
| E | 验收标准变更 → 同步 DoD |
| F | 摘要写入 `{change_dir}/analysis.md` §2.1 + 修订历史 |

## 输出

更新 `{change_dir}/analysis.md` 与 `{change_dir}/tasks.md`（必要时）。模板：`templates/analysis-header.md`

## 完成后建议

验证完成后，建议继续执行 `mole:apply` 开始执行重构任务。

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

## RED FLAGS

- 差分验证未完成即 apply
- 发现冲突先改代码而非文档
