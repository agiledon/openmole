---
name: bdr-plan
description: bdr:plan — 从未清除/部分残余坏味道生成 tasks.md
---

# BDR Plan — 任务分解

## 何时使用

用户运行 `bdr:plan`，或在 analyze 完成后需要生成/更新重构任务。

## 门禁

若 `badsmells.md` 版本 **高于** `tasks.md` 页眉「依据」中的 badsmells 版本：
- **停止**
- 提示先运行 `bdr:analyze`

## 前置步骤

1. 加载 `using-bdr`
2. 读取 `{docs_root}/badsmells.md` §2.0 索引
3. 选取状态为 **未清除** 或 **部分残余** 的条目

## 任务生成

- ID 格式：`B-T序号`
- 使用 `templates/tasks-entry.md` 字段
- 保留 `templates/tasks-header.md` 中的 §1 执行约定
- 每任务步骤：① 补测 / ② 测绿 / ③ 重构 / ④ 测绿 / ⑤ 用户确认
- **不得** 编造无 badsmells 条目支撑的任务

## 可选

- 备注覆盖率基线（`pytest --cov`、`jacoco`）

## 输出

写入/更新 `{docs_root}/tasks.md` §3 backlog；升版时填写修订历史「提交版本」。

## RED FLAGS

- 跳过 analyze 门禁
- 任务无法追溯到 BS-ID
