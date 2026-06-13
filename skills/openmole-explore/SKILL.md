---
name: openmole-explore
description: mole:explore — 创建/继续 change，扫描源码产出 badsmells.md
---

# OpenMole Explore — 识别坏味道

## 何时使用

用户运行 `mole:explore` 或需要识别/更新坏味道清单时。

## 工作区解析

1. 读取 `openmole/config.yaml` → `current_change`
2. `{change_dir}` = `openmole/changes/{change_name}/`
3. 无 `openmole/config.yaml` → 提示从 `templates/openmole-config.yaml.example` 创建

## D3 生命周期

| 条件 | 行为 |
|------|------|
| 无 `current_change` | 新建 change；名称由 `[change-name]` 指定或 Agent 提议 + **用户确认** |
| 有 active change 且未传 `[change-name]` | **询问**：继续当前（升版 badsmells）/ 新建 change |
| 显式 `[change-name]` | 目录不存在则创建；存在则在该 change 内升版 |

新建 change 时：

1. 创建 `openmole/changes/<name>/`、`.openmole-change.yaml`（见 `templates/openmole-change.yaml`）
2. 更新 `openmole/config.yaml` 的 `current_change`

## 跨 change 去重（步骤 0）

1. 扫描 `openmole/changes/*/badsmells.md` 与 `openmole/changes/archive/*/badsmells.md` §2.0
2. 构建 BS-ID 与指纹 `(规范化路径, Fowler 标签)`
3. 已消除同指纹 → **跳过**，注明原 change
4. 未清除/部分残余于其他 change → **警告**，不得静默重复

## 扫描流程

1. **确定范围**：`[path]` 默认 `.`
2. **检测语言**：Python / Java / TypeScript 等
3. **识别坏味道**：Fowler + §3 原则 + SOLID
4. **分配 BS-ID**：`BS-<CATEGORY>-<NNN>`
5. **写入** `{change_dir}/badsmells.md`

## 输出格式

- 使用 `templates/badsmells-header.md` + `badsmells-entry.md`
- §2.0 索引；七字段表格；升版时 `git rev-parse HEAD` 填提交版本

## 语言附录

**Python**：pytest、unittest.mock  
**Java**：JUnit、Mockito  
**TypeScript**：jest/vitest

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

## 完成后建议

探索完成后，建议继续执行 `mole:plan` 进行任务分解。

## RED FLAGS

- 跳过测绿直接重构
- 无代码证据编造坏味道
- 跨 change 静默重复同一坏味道
- `[SDD]` 标记项未获批准即改生产代码
