# 坏味道驱动重构任务（OpenMole Tasks）

**版本**：0.1.0
**状态**：草案
**依据**：[constitution.md](./constitution.md)、[badsmells.md](./badsmells.md)、[specification.md](./specification.md)

---

## 1. 执行约定

- **任务来源**：本文件中的任务 **必须** 根据 **[`badsmells.md`](./badsmells.md) 的当前内容** 规划与拆分（见 [constitution.md §2.3](./constitution.md#23-任务tasks环节)）。
- **标准步骤**：每个任务执行须符合 [constitution.md §4](./constitution.md#4-重构的标准步骤)。步骤模板因**级别**而异：
  - **IMPL**：① 确认坏味道 / ② 补测 / ③ 测绿 / ④ 应用重构手法（语言感知）/ ⑤ 回归测绿 / ⑥ **用户确认**（写操作门禁）
  - **DESIGN**：① 确认坏味道 / ② 识别接缝 / ③ 测试安全网 / ④ 解依赖 / ⑤ 应用重构 / ⑥ 回归测绿 / ⑦ **用户确认**（写操作门禁）
  - **ARCH**：① 确认坏味道 / ② 影响分析 / ③ 测试安全网 / ④ 选择架构模式 / ⑤ 迁移计划 / ⑥ 增量执行 / ⑦ 回归测绿 / ⑧ **用户确认**（写操作门禁）
- **TDD**：行为由测试锁定；**新测先行** 于无覆盖代码的重构前。
- **范围**：单任务 diff 应对准 **`badsmells.md` 中的条目 / BS-ID**；若发现新坏味道，**先更新 `badsmells.md`**，再经 **analysis** 更新本文件。
- **确认门**：**每任务完成后** 由 **用户（维护者）** 确认后，方可勾选完成并进入下一任务。
- **ID 规则**：任务 ID 建议 **`B-T序号`**；依赖关系在条目中显式写出。
- **提交版本**：**分解任务** 环节每次 **升版** 本文件或 **在修订历史中新增一行** 时，须按 [specification.md §7](./specification.md#7-修订历史表与提交版本门禁) 填写 **提交版本**（`git rev-parse HEAD`）。

### 1.1 `badsmells.md` 迭代后的同步

当 **`badsmells.md` 版本或实质性内容变化** 时，**不得** 直接假设本文件仍有效 —— 须先完成 [analysis.md](./analysis.md) 中的 **差分与修订**，**更新本文件** 后再实施重构（见 [constitution.md §2.4](./constitution.md#24-分析analyze环节与文档迭代)）。

---

## 2. 任务模板（复制使用）

```markdown
- [ ] **B-Txx.** 标题（消除 BS-xxx：简述）
  - **依赖**：B-Tyy 或 无。
  - **级别**：ARCH / DESIGN / IMPL
  - **坏味道**：`badsmells.md` §2 / `BS-...`。
  - **涉及路径**：`path/to/module.py` …
  - **步骤**：参照 §1 中对应级别标准步骤（IMPL 6 / DESIGN 7 / ARCH 8）。
  - **完成定义（DoD）**：……（可观测、可测试）
  - **SDD 联动**：是 / 否；若 **是**，列出须改的 SDD 文件与章节。
```

---

## 3. 任务 backlog

（由 mole-plan 生成）
