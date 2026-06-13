# 坏味道驱动重构分析（OpenMole Analysis）

**版本**：0.1.0
**状态**：草案
**依据**：[constitution.md](./constitution.md)、[specification.md](./specification.md)

---

## 1. 目的

在 **重构编码之前**，校验 **OpenMole 文档链** 一致性：

- **宪法**（[constitution.md](./constitution.md)）— 最高规范是否被遵守；
- **元规约**（[specification.md](./specification.md)）— 条目格式与门禁；
- **坏味道规约**（[badsmells.md](./badsmells.md)）— 具体条目是否可验收、是否与 SDD 冲突；
- **任务**（[tasks.md](./tasks.md)）— 是否 **完全源自 `badsmells.md`**、依赖是否无环、DoD 是否仍有效。

**冲突解决**：**先改文档**（宪法 / 元规约 / badsmells.md / tasks.md / 本文件），**再改代码**。

---

## 2. `badsmells.md` 变更后的强制差分（核心）

当 **`badsmells.md` 的版本号或实质性内容** 发生变化时，**必须** 执行本节检查并 **更新 [tasks.md](./tasks.md)**：

| 步骤 | 动作 |
|------|------|
| A | 列出 **`badsmells.md` 当前** 全部条目 ID |
| B | 列出 **tasks.md 当前** 各任务引用的 BS-ID |
| C | **新增条目** → 在 **tasks.md** 增补任务 |
| D | **删除或合并条目** → 删除或改写孤儿/过时任务 |
| E | **条目验收标准变更** → 同步对应任务的 **DoD** |
| F | 将结论摘要写入 **§2.1**；修订历史填写 **提交版本** |

**未完成差分并更新任务前**，不得将 badsmells 的新增要求直接当作已批准任务实施。

### 2.1 最近一次差分记录

（由 mole:verify 填写）

---

## 3. 三角 / 多角检查清单

| 检查项 | 说明 |
|--------|------|
| 宪法 ↔ 元规约 | specification 是否与 constitution §3 对齐 |
| 元规约 ↔ badsmells | §4 必填字段齐全；`[SDD]` 是否标注 |
| badsmells ↔ 任务 | 每个 B-Txx 是否引用 BS-ID；无遗漏、无孤儿任务 |
| 任务 ↔ 宪法 | DoD 含测试绿 + 用户确认 |
| OpenMole ↔ SDD | 对外行为变更是否已在 SDD 立项 |
