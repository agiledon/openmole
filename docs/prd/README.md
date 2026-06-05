# Bad-smell Driven Refactoring（BDR）

本目录存放 **坏味道驱动重构（BDR）** 工件，与 **[Specification-Driven Development（SDD）](../sdd/README.md)** **同级**，均位于 `docs/` 下。BDR 用于在 **不先臆测新功能** 的前提下，以 **可验证、可门禁、可确认** 的方式系统性消除技术债。

**最高规范**：[constitution.md](./constitution.md) 为 BDR **最高指导规范**；其余工件不得与之冲突。

**与 SDD 的关系**：SDD 驱动 **能力与需求的增量交付**；BDR 驱动 **内部质量改进**。二者共享 **「冲突先改文档」** 与 **维护者确认** 的文化；若重构触及对外行为，须 **先回到 SDD**（修订 `specification.md` / `design.md` 等）再动代码。

---

## 工件顺序与门禁

| 顺序 | 文件 | 说明 |
|------|------|------|
| 1 | **[constitution.md](./constitution.md)** | **宪法**（最高规范）：第一性原则、标准步骤、`badsmells.md` 命名与任务/分析闭环 |
| 2 | **[specification.md](./specification.md)** | **元规约**：坏味道条目的字段、编号、SDD 联动等 **格式与门禁** |
| 3 | **[badsmells.md](./badsmells.md)** | **坏味道规约文档**（坏味道环节 **唯一** 正式文件名）：**具体条目** 与统计；**持续迭代**（当前 **v0.6.0**） |
| 4 | **[tasks.md](./tasks.md)** | **任务**：**必须** 根据 **`badsmells.md`** 规划与拆分（当前 **v0.7.0**） |
| 5 | **[analysis.md](./analysis.md)** | **分析**：三角一致；**`badsmells.md` 变更后** 比对任务并 **先更新 `tasks.md`**（当前 **v0.4.0**） |
| 6 | **重构（实现）** | 按任务执行；**每任务完成后须用户（维护者）确认** |

**坏味道规约**：**[badsmells.md](./badsmells.md)** 为坏味道环节的 **唯一** 正式文档（路径与命名见 [constitution.md](./constitution.md) **§2**）；**BDR 执行与任务追溯** 仅以本文件为准。仓库其它位置的叙述材料若存在，**不得**替代 **`badsmells.md`** 承担门禁与任务映射。

---

## BDR 流程（简记）

1. **宪法**：全流程遵循 [constitution.md](./constitution.md)。  
2. **元规约**：[specification.md](./specification.md) 约束条目怎么写。  
3. **坏味道**：维护或迭代 **[badsmells.md](./badsmells.md)**（唯一正式规约文档名与位置）；升版或新增修订历史行时填写 **提交版本**（`git rev-parse HEAD`，见 [specification.md §7](./specification.md#7-修订历史表与提交版本门禁)）。  
4. **任务**：据 **`badsmells.md`** 编写 [tasks.md](./tasks.md)；同上填写 **提交版本**。  
5. **分析**：校验一致；**`badsmells.md` 版本/内容变化** → 差分并 **更新 tasks.md**（见 [analysis.md](./analysis.md)）；同上填写 **提交版本**。  
6. **重构**：按宪法 **标准步骤** 执行；**用户确认** 后继续。

---

## 修订与版本

各文件页眉维护 **版本号、状态、日期、依据**；重大变更写入根目录 `CHANGELOG.md`（若适用）。
