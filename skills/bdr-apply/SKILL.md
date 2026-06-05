---
name: bdr-apply
description: bdr:apply — 执行下一个未完成的 B-Txx 重构任务
---

# BDR Apply — 执行重构

## 何时使用

用户运行 `bdr:apply`，且 tasks.md 中有未完成任务。

## 选取任务

1. 读取 `{docs_root}/tasks.md` §3 backlog
2. 找下一个 `[ ]` 的 **B-Txx**，且 **依赖** 均已 `[x]`
3. **每次 invocation 仅处理一个任务**（constitution §5）

## 执行步骤（constitution §4）

| 步骤 | 动作 |
|------|------|
| ① | 确认：核对 BS-ID 与 badsmells 条目一致（explore 已完成则跳过） |
| ② | 补测：无覆盖则先写测试（pytest/mock、JUnit/Mockito），不改生产行为 |
| ③ | 测绿：运行测试套件，展示输出 |
| ④ | 重构：最小 diff，对准 BS-ID |
| ⑤ | 回归测绿：全量相关测试 |
| ⑥ | **用户确认**：未确认不得 `[x]` |

## SDD 门禁

若任务 **SDD 联动：是** 或 badsmells 条目含 `[SDD]`：
- 步骤 ④ 重构前须确认 SDD 规约/设计已修订

## 完成后

- 将 tasks 中该任务标记 `[x]`
- 若 DoD 满足，更新 badsmells §2.0 为 **已消除** 或 **部分残余**

## RED FLAGS

- 测试未绿仍标记完成
- 跳过用户确认
- 一次 apply 处理多个任务
- 发现新坏味道仍静默重构 → 停止，回流 explore → analyze → plan

## 软引用

步骤 ① 可引用用户环境中已有的 TDD 类 Skill（不硬依赖）。
