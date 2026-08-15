---
name: mole-explore
description: 创建或继续 OpenMole change，按用户选择的级别（ARCH/DESIGN/IMPL，可多选）扫描坏味道写入对应子目录
---

Load and follow the **openmole-explore** skill.

参数：
- `[levels]` 级别（可单选/多选/全选）：`arch` / `design` / `impl` / `all`，逗号分隔（如 `arch,design`）；省略时交互式选择
- `[path]` 扫描范围（默认 `.`）
- `[change-name]` kebab-case 变更名（可选）

示例：
- `mole-explore`（交互式选择级别）
- `mole-explore all`（全选三级）
- `mole-explore arch,design src/auth`（架构级 + 设计级，扫描 src/auth）
- `mole-explore impl refactor-auth-module`（实现级 + 指定 change 名）
