---
name: bdr-archive-change
description: bdr:archive — 检查 change 完成度并归档至 bdr/changes/archive/
---

# BDR Archive — 归档 change

## 何时使用

用户运行 `bdr:archive`，当前 change 重构周期结束或需封存。

## 工作区解析

1. 读取 `bdr/config.yaml` → `current_change`
2. `{change_dir}` = `bdr/changes/{change_name}/`
3. 无 `current_change` → **停止**，无活跃 change 可归档

## 完成度检查

1. `{change_dir}/badsmells.md` §2.0 — 不得有 **未清除** / **部分残余**（除非用户确认豁免）
2. `{change_dir}/tasks.md` §3 — 不得有 `[ ]` 未完成任务

## 用户确认门

若有未完成项 → 列出 BS-ID / B-Txx → **必须** 询问用户是否仍归档。

## 归档动作

```bash
mv bdr/changes/<name> bdr/changes/archive/$(date +%Y-%m-%d)-<name>/
```

- 更新 `.bdr-change.yaml` → `status: archived`
- `bdr/config.yaml` 清空 `current_change`

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

## 完成后建议

归档完成后，建议执行 `bdr:explore` 开始新的重构周期。

## RED FLAGS

- 未完成仍归档且未经用户确认
- 归档后仍保留 stale 的 current_change
