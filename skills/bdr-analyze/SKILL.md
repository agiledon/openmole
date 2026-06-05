---
name: bdr-analyze
description: bdr:analyze — badsmells 与 tasks 差分（A～F）并同步 analysis.md
---

# BDR Analyze — 差分分析

## 何时使用

- `badsmells.md` 版本或实质性内容变更后 **必须** 运行
- `bdr:plan` 或 `bdr:apply` 前发现 tasks 与 badsmells 不一致

## 前置步骤

1. 加载 `using-bdr`，解析 `{docs_root}`
2. 读取 `{docs_root}/badsmells.md`、`tasks.md`、`analysis.md`

## 强制差分步骤（analysis.md §2）

| 步骤 | 动作 |
|------|------|
| A | 列出 badsmells 当前全部 BS-ID |
| B | 列出 tasks 各任务引用的 BS-ID |
| C | 新增 BS-ID → tasks 增补 B-Txx |
| D | 删除/合并 BS-ID → 删除或改写孤儿任务 |
| E | 验收标准变更 → 同步 DoD |
| F | 摘要写入 analysis.md §2.1 + 修订历史（提交版本） |

## 三角检查（analysis.md §3）

- 宪法 ↔ 元规约
- 元规约 ↔ badsmells（§4 字段、`[SDD]`）
- badsmells ↔ 任务（无遗漏、无孤儿）
- 任务 ↔ 宪法（DoD 含测绿 + 用户确认）
- BDR ↔ SDD

## RED FLAGS

- 差分未完成即进入 plan/apply
- 发现冲突先改代码而非文档

## 输出

更新 `{docs_root}/analysis.md` §2.1 与 `{docs_root}/tasks.md`（必要时）。

模板：`templates/analysis-header.md`
