---
name: bdr-explore
description: bdr:explore — 扫描源码并按 specification §4 产出 badsmells.md
---

# BDR Explore — 识别坏味道

## 何时使用

用户运行 `bdr:explore` 或需要识别/更新坏味道清单时。

## 前置步骤

1. 加载 `using-bdr`，解析 `{docs_root}`
2. 读取 `{docs_root}/constitution.md` §3（八项第一性原则）
3. 读取 `{docs_root}/specification.md` §3 优先级、§4 条目格式

## 扫描流程

1. **确定范围**：目标路径（默认 `.`），列出主要源文件
2. **检测语言**：Python / Java / TypeScript 等，加载对应最佳实践
3. **识别坏味道**：对照 Fowler 标签 + constitution §3 + SOLID + 迪米特法则
4. **分配 BS-ID**：`BS-<CATEGORY>-<NNN>`（CLARITY、CONSIST、REUSE、ROBUST、SEC、SIMPLE）
5. **写入** `{docs_root}/badsmells.md`

## 输出格式

- 文首元信息（版本、状态、依据、日期）
- **§2.0 索引**：BS-ID | 状态（未清除/部分残余/已消除）| 说明
- 每条目七字段表格（specification §4）：ID、标题、位置、描述、对齐原则、消除标准、风险与约束
- 行为变更风险须标注 `[SDD]`
- 升版时更新修订历史，填写「提交版本」（specification §7）：运行 `git rev-parse HEAD` 获取 SHA；工作区未提交则填 `—`

## 自检清单（写入前）

- [ ] 每条有稳定 BS-ID 与 Fowler 标签
- [ ] §2.0 索引与正文条目一致
- [ ] 七项必填字段齐全
- [ ] 新条目状态为 **未清除**
- [ ] 已消除条目保留审计时可不改正文

## 语言附录

**Python**：pytest、unittest.mock；关注模块体量、循环依赖、重复逻辑  
**Java**：JUnit、Mockito；关注 Large Class、Long Method、包边界  
**TypeScript**：jest/vitest；关注 any 滥用、上帝模块

## 模板

新建时使用 `templates/badsmells-header.md` + `badsmells-entry.md`；无文件时从 `docs/reference/bdr/badsmells.md` 参考结构。
