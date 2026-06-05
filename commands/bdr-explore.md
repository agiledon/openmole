---
name: bdr-explore
description: 创建或继续 BDR change，扫描坏味道写入 bdr/changes/<name>/badsmells.md
---

Load and follow the **bdr-explore-to-change** skill.

参数：`[path]` 扫描范围（默认 `.`）；`[change-name]` kebab-case 变更名（可选）。

示例：`bdr:explore src/auth refactor-auth-module`
