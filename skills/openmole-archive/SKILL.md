---
name: openmole-archive
description: mole-archive — 检查 change 完成度并归档至 openmole/changes/archive/
---

# OpenMole Archive — 归档 change

> **路径解析说明**：
> - `{cwd}` = 用户运行 mole 命令时的当前工作目录（目标项目根目录）
> - `{config_dir}` = OpenMole 用户级配置目录（`~/.config/openmole/`）
> - 项目级文件（`config.yaml`、`changes/`）位于 `{cwd}/openmole/`
> - 共享资源（`templates/`）位于 `{config_dir}/`

## 何时使用

用户运行 `mole-archive`，当前 change 重构周期结束或需封存。

## 工作区解析

1. 读取 `{cwd}/openmole/config.yaml` → `current_change`
2. `{change_dir}` = `{cwd}/openmole/changes/{change_name}/`
3. 无 `current_change` → **停止**，无活跃 change 可归档

## 级别感知完成度检查

自动发现 `{change_dir}/` 下的级别子目录（arch/、design/、impl/），逐一执行完成度检查。

| 检查项 | 要求 |
|--------|------|
| badsmells.md §2.0 | 不得有 **未清除** / **部分残余**（除非用户确认豁免）|
| tasks.md §3 | 不得有 `[ ]` 未完成任务 |
| 写操作确认 | 所有 task 的写操作确认记录完整 |

若有子目录不满足 → 列出未完成的级别、BS-ID、B-Txx → **必须** 询问用户是否仍归档。

## 归档动作

```bash
mv {cwd}/openmole/changes/<name> {cwd}/openmole/changes/archive/$(date +%Y-%m-%d)-<name>/
```

- 更新 `{change_dir}/.openmole-change.yaml` → `status: archived`
- `{cwd}/openmole/config.yaml` 清空 `current_change`

## OpenMole 规约摘要（内嵌于各 Skill，非独立文件）

### constitution §2 — 三级坏味道

| 级别 | ID前缀 | 范围 |
|------|--------|------|
| 架构级 | ARCH | 模块化、耦合、内聚、层次、边界、演进 |
| 设计级 | DESIGN | 封装、继承、模块化、冗余 |
| 实现级 | IMPL | 函数、命名、参数、注释、语言惯用法 |

### constitution §3 — 八项第一性原则

清晰性、一致性、可读性、复用性、可扩展性、健壮性、安全性、简洁性。

### constitution §3a — 安全原则（写操作门禁）

> 所有写操作（文档/代码的新建、修改、删除）必须由 AI 生成操作范围与变更 diff，展示给用户并获得明确确认后方可执行。**该门禁不可豁免。**

### constitution §4 — 标准重构步骤（级别特定）

**IMPL（6 步）**：① 确认坏味道 / ② 补测 / ③ 测绿 / ④ 应用重构手法（语言感知）/ ⑤ 回归测绿 / ⑥ **用户确认**（写操作门禁）

**DESIGN（7 步）**：① 确认坏味道 / ② 识别接缝（Feathers）/ ③ 测试安全网 / ④ 解依赖 / ⑤ 应用重构 / ⑥ 回归测绿 / ⑦ **用户确认**（写操作门禁）

**ARCH（8 步）**：① 确认坏味道 / ② 影响分析 / ③ 测试安全网 / ④ 选择架构模式 / ⑤ 迁移计划（可豁免）/ ⑥ 增量执行 / ⑦ 回归测绿 / ⑧ **用户确认**（写操作门禁）

### constitution §5 — 执行粒度

每次 `mole-apply` 仅处理一个未完成任务。

### specification §4 — badsmells 条目

**级别** + 六字段 + §2.0 状态：**未清除** / **已消除** / **部分残余**。

### specification §7 — 修订历史

升版时 **提交版本** = `git rev-parse HEAD`，未提交填 `—`。

## RED FLAGS

- 未完成仍归档且未经用户确认
- 归档后仍保留 stale 的 current_change
- 有未归档级别子目录被遗漏
