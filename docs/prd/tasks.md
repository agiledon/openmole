# 坏味道驱动重构任务（BDR Tasks）

**版本**：0.8.0  
**状态**：草案 — 待维护者确认  
**依据**：[constitution.md](./constitution.md) **v1.5**、[badsmells.md](./badsmells.md) **v0.6.0**、[specification.md](./specification.md) **v0.2.7**、[analysis.md](./analysis.md) **v0.4.0**

---

## 1. 执行约定

- **任务来源**：本文件中的任务 **必须** 根据 **[`badsmells.md`](./badsmells.md) 的当前内容** 规划与拆分（见 [constitution.md §2.3](./constitution.md#23-任务tasks环节)）。  
- **标准步骤**：每个任务执行须符合 [constitution.md §4](./constitution.md#4-重构的标准步骤)（识别 → 测覆 → 测绿 → 重构 → 回归 → **用户确认**）。  
- **TDD**：行为由测试锁定；**新测先行** 于无覆盖代码的重构前。  
- **范围**：单任务 diff 应对准 **`badsmells.md` 中的条目 / BS-ID**；若发现新坏味道，**先更新 `badsmells.md`**，再经 **analysis** 更新本文件。  
- **确认门**：**每任务完成后** 由 **用户（维护者）** 确认后，方可勾选完成并进入下一任务。  
- **ID 规则**：任务 ID 建议 **`B-T序号`**；依赖关系在条目中显式写出。  
- **提交版本**：**分解任务** 环节每次 **升版** 本文件或 **在 §4 修订历史中新增一行** 时，须按 [specification.md §7](./specification.md#7-修订历史表与提交版本门禁) 填写 **提交版本**（`git rev-parse HEAD`）。

### 1.1 `badsmells.md` 迭代后的同步

当 **`badsmells.md` 版本或实质性内容变化** 时，**不得** 直接假设本文件仍有效 —— 须先完成 [analysis.md](./analysis.md) 中的 **差分与修订**，**更新本文件** 后再实施重构（见 [constitution.md §2.4](./constitution.md#24-分析analyze环节与文档迭代)）。

---

## 2. 任务模板（复制使用）

```markdown
- [ ] **B-Txx.** 标题（消除 BS-xxx：简述）
  - **依赖**：B-Tyy 或 无。
  - **坏味道**：`badsmells.md` §… / `BS-...`。
  - **涉及路径**：`path/to/module.py` …
  - **步骤**：① 补测 / ② 测绿 / ③ 重构 / ④ 测绿 / ⑤ 用户确认。
  - **完成定义（DoD）**：……（可观测、可测试）
  - **SDD 联动**：是 / 否；若 **是**，列出须改的 SDD 文件与章节。
```

---

## 3. 任务 backlog

对应 [`badsmells.md`](./badsmells.md) **v0.6.0**；差分见 [analysis.md §2.1](./analysis.md#21-最近一次差分记录)。

- [x] **B-T01.** 消除 **BS-REUSE-001**：合并 `bootstrap` 双路径重复逻辑  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-REUSE-001**。  
  - **涉及路径**：`src/eywa/kernel/core/bootstrap.py`  
  - **步骤**：① 补测（若需锁定五元组与 kindle 行为）/ ② 测绿 / ③ 提取共用函数 / ④ 测绿 / ⑤ 用户确认。  
  - **完成定义（DoD）**：`bootstrap_from_env` 与 `bootstrap_from_openai_compat_serial_env` 共享同一套装配逻辑；`tests/test_m17_kindle_batteries.py` 及相关测例全绿。  
  - **SDD 联动**：否。

- [x] **B-T02.** 消除 **BS-SIMPLE-001**：`Spirit` 模块内 `yaml` 导入策略统一  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-SIMPLE-001**。  
  - **涉及路径**：`src/eywa/kernel/core/spirit.py`  
  - **步骤**：① 测绿 / ② 顶导入或单一延迟加载 + 必要时 docstring 说明 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：无函数体内重复 `import yaml`（或 docstring 记载保留延迟加载原因）；测试全绿。  
  - **SDD 联动**：否。

- [x] **B-T03.** 消除 **BS-REUSE-002**：统一流水线 spec 的 mapping 加载入口  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-REUSE-002**。  
  - **涉及路径**：`src/eywa/kernel/core/spirit.py`（及必要时同包内新模块）  
  - **步骤**：① 测绿 / ② 引入单一加载函数并收敛调用 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：文件与 dict 两路经同一入口；异常类型与消息与测例或文档一致；`carry_out` / `enter_seer_roles` 相关测例绿。  
  - **SDD 联动**：若变更对外可见异常类型 → **是**（须 SDD / 版本说明）。

- [x] **B-T04.** 消除 **BS-CLARITY-002**：拆分 `Spirit.carry_out` 控制流  
  - **依赖**：**B-T03**（建议先统一 spec 加载，再拆 `carry_out`，降低冲突）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-002**。  
  - **涉及路径**：`src/eywa/kernel/core/spirit.py`  
  - **步骤**：① 测绿 / ② 提取私有方法或小型分派函数 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：`carry_out` 主流程可读性提升（分支主体缩短或圈复杂度下降）；`test_m16_*`、`test_m17_*` 中 `carry_out` 相关用例全绿。  
  - **SDD 联动**：否。

- [x] **B-T05.** 消除 **BS-CLARITY-001**：从 `Spirit` 提取至少一类独立关切  
  - **依赖**：**B-T04**。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-001**。  
  - **涉及路径**：`src/eywa/kernel/core/spirit.py` 及 `src/eywa/kernel/core/` 下新模块  
  - **步骤**：① 测绿 / ② 提取协作对象并委托 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：公开 API 与可观察行为与现行测试一致；`Spirit` 以委托为主、单类体量下降；全量测试绿。  
  - **SDD 联动**：若公开 API 变化 → **是**。

- [x] **B-T06.** 消除 **BS-ROBUST-001**：工具失败与流式 SSE 解析的可观测性  
  - **依赖**：无（与 **B-T01～B-T03** 可并行；若日志含 HTTP 片段，建议在 **B-T07** 前完成 **脱敏** 策略对齐）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-ROBUST-001**。  
  - **涉及路径**：`src/eywa/kernel/action/tooling.py`、`src/eywa/foundation/llm/client.py`  
  - **步骤**：① 补测（工具失败、损坏 SSE）/ ② 测绿 / ③ 增加分级日志与流式解析策略 / ④ 测绿 / ⑤ 用户确认。  
  - **完成定义（DoD）**：符合 `badsmells.md` **BS-ROBUST-001** 消除标准；`ToolResult` 契约不变；流式正常路径输出与现测一致。  
  - **SDD 联动**：否（除非变更对外异常类型或 API）。

- [x] **B-T07.** 消除 **BS-SEC-001**：`redact_secrets` 接入与 `base_url` 注册校验  
  - **依赖**：无（可与 **B-T06** 并行；日志脱敏与 **B-T06** 衔接时在代码评审中一并验收）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-SEC-001**。  
  - **涉及路径**：`src/eywa/kernel/intelligence/sanitize.py`（复用）、`src/eywa/foundation/llm/env_bootstrap.py`、`src/eywa/foundation/llm/openai_compat_serial_env.py`、`src/eywa/foundation/llm/client.py` 等  
  - **步骤**：① 补测（脱敏、非法 URL）/ ② 测绿 / ③ 接入脱敏与 URL 策略 / ④ 测绿 / ⑤ 用户确认。  
  - **完成定义（DoD）**：符合 `badsmells.md` **BS-SEC-001** 消除标准；合法开发与 CI 配置不受影响或有明确开关。  
  - **SDD 联动**：若注册失败条件或对外错误语义变化 → **是**。

- [x] **B-T08.** 消除 **BS-ROBUST-002**：`complete_with_network_retry` 异常路径可观测与脱敏  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-ROBUST-002**。  
  - **涉及路径**：`src/eywa/kernel/intelligence/llm_retry.py`（及必要时与 `client` 日志策略对齐的共用辅助）  
  - **步骤**：① 补测（非 httpx 异常 / caplog）/ ② 测绿 / ③ 增加日志与 `redact_secrets` / ④ 测绿 / ⑤ 用户确认。  
  - **完成定义（DoD）**：符合 `badsmells.md` **BS-ROBUST-002** 消除标准；重试与 `IntelligenceError` 契约不变或与测例/SDD 一致；全量 pytest 绿。  
  - **SDD 联动**：若对外错误语义变化 → **是**。

- [x] **B-T09.** 消除 **BS-SEC-002**：`OpenAICompatibleClient` 与 `base_url` 校验策略闭环  
  - **依赖**：无（与 **B-T08** 可并行）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-SEC-002**。  
  - **涉及路径**：`src/eywa/foundation/llm/client.py`、`src/eywa/foundation/llm/base_url.py`、SDD/安全说明（若选文档路径）  
  - **步骤**：① 选定消除标准 (a)/(b)/(c) / ② 补测 / ③ 实现或文档 / ④ 测绿 / ⑤ 用户确认。  
  - **完成定义（DoD）**：符合 `badsmells.md` **BS-SEC-002** 消除标准；合法直连与 CI 不受影响或有明确约定；全量 pytest 绿。  
  - **SDD 联动**：若选 (a) 且失败阶段或类型变化 → **是**。

- [x] **B-T10.** 消除 **BS-CLARITY-003**：拆分 `serial_multi_agent` 模块职责  
  - **依赖**：无（与 **B-T08～B-T09** 可并行）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-003**。  
  - **涉及路径**：`src/eywa/kernel/intelligence/serial_multi_agent.py` 及同包内新模块  
  - **步骤**：① 测绿 / ② 按消除标准拆分模块或 re-export / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：符合 `badsmells.md` **BS-CLARITY-003** 消除标准；对外可观察契约不变或经 SDD；全量 pytest 绿。  
  - **SDD 联动**：若公开导入路径变化 → **是**。

- [x] **B-T11.** 消除 **BS-SIMPLE-002**：YAML 延迟导入与加载入口收敛  
  - **依赖**：无（可与 **B-T10** 并行；若动 `serial_multi_agent` 与 **B-T10** 冲突则 **B-T10** 优先或合并评审）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-SIMPLE-002**。  
  - **涉及路径**：`src/eywa/kernel/intelligence/serial_multi_agent.py`、`src/eywa/kernel/core/spirit.py`（及必要时 `spirit_seer_catalog`）  
  - **步骤**：① 测绿 / ② 顶导入或单一延迟入口 + 复用 **`load_yaml_root_mapping`** 策略 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：符合 `badsmells.md` **BS-SIMPLE-002** 消除标准；全量 pytest 绿。  
  - **SDD 联动**：若异常类型变化 → **是**。

- [x] **B-T12.** 消除 **BS-CLARITY-004**：收敛 **`Eywa.kindle`** 分支与参数面  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-004**。  
  - **涉及路径**：`src/eywa/kernel/core/eywa.py`  
  - **步骤**：① 测绿（含 **`tests/test_m17_kindle_batteries.py`**）/ ② 提取构建函数或配置对象、主入口委托 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：符合 `badsmells.md` **BS-CLARITY-004** 消除标准；**`kindle`** 默认可观察行为不变；全量 pytest 绿。  
  - **SDD 联动**：若公开签名或默认语义变化 → **是**。

- [x] **B-T13.** 消除 **BS-CLARITY-005**：拆分 **`perception.py`** 职责  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-005**。  
  - **涉及路径**：`src/eywa/kernel/semantics/perception.py` 及同包子模块  
  - **步骤**：① 测绿 / ② 按消除标准拆分（格式化 / 检索编排 / 视图等）/ ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：**`PerceptionService.build_view`** 对外契约不变；符合 **BS-CLARITY-005**；全量 pytest 绿。  
  - **SDD 联动**：若 **SemanticView** 或可观察 JSON 变化 → **是**。

- [x] **B-T14.** 消除 **BS-CLARITY-006**：拆分 **`planner.py`** 中 Schema / 抽取 / 纠错  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-006**。  
  - **涉及路径**：`src/eywa/kernel/intelligence/planner.py` 及同包子模块  
  - **步骤**：① 测绿 / ② 拆出 schema 常量、JSON 提取、纠错构造 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：**`Planner.plan`** 与 **`Plan`** 契约不变；符合 **BS-CLARITY-006**；全量 pytest 绿。  
  - **SDD 联动**：若计划 JSON 对外格式变化 → **是**。

- [x] **B-T15.** 消除 **BS-CLARITY-007**：**`WorkflowEngine`** 步骤分派可扩展化  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-007**。  
  - **涉及路径**：`src/eywa/kernel/intelligence/workflow/engine.py`、`workflow/spec.py`  
  - **步骤**：① 测绿（含 **`tests/kernel/test_workflow_session.py`**）/ ② 表驱动或策略类拆分 **`_run_step`** / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：**`execute`** 可观察契约不变；符合 **BS-CLARITY-007**；相关测例全绿。  
  - **SDD 联动**：若工作流语义变化 → **是**。

- [x] **B-T16.** 消除 **BS-CLARITY-008**：**foundation→kernel** 与内置技能双轨  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-008**。  
  - **涉及路径**：`src/eywa/foundation/crewai_integration/eywa_tool_bridge.py`、`src/eywa/open/skills/builtin/`、`src/eywa/open/skills/builtin_packages/`（及 SDD 边界说明）  
  - **步骤**：① 对照 SDD 选定依赖方向或书面例外 / ② 目录合并或单一权威入口 + 测绿 / ③ 用户确认。  
  - **完成定义（DoD）**：符合 **BS-CLARITY-008**（依赖与双轨其一按消除标准闭环）；全量 pytest 绿。  
  - **SDD 联动**：**是**（边界与公开路径）。

- [x] **B-T17.** 消除 **BS-CONSIST-001**：收窄 **`type: ignore`** 与包级再导出  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CONSIST-001**。  
  - **涉及路径**：`src/eywa/kernel/intelligence/plan.py`、`src/eywa/kernel/semantics/memory.py`、`src/eywa/kernel/semantics/__init__.py`、`src/eywa/open/skills/__init__.py` 等  
  - **步骤**：① 类型检查与测绿基线 / ② 以 **TypedDict** / narrowing 等替代忽略，或收束忽略规则并文档化 / ③ 收窄 **`__all__`** 或文档化稳定子集 / ④ 测绿与类型检查 / ⑤ 用户确认。  
  - **完成定义（DoD）**：符合 **BS-CONSIST-001**；测试与（若 CI 启用）类型检查绿。  
  - **SDD 联动**：若稳定导入面变化 → **是** 或 **DeprecationWarning** 周期。

- [x] **B-T18.** 消除 **BS-ROBUST-003**：**PDF** 与 **HTTP** 辅助路径可观测、去静默  
  - **依赖**：无（与 **BS-SEC-001** 日志策略衔接时在评审中验收脱敏）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-ROBUST-003**。  
  - **涉及路径**：`src/eywa/open/knowledge/pdf_text.py`、`src/eywa/foundation/llm/client.py`（**`_log_openai_compat_http_error`**）  
  - **步骤**：① 补测或 caplog / ② PDF 失败路径分级日志（无敏感原文）；HTTP **`read()`** 失败 WARNING 或等价可观测 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：符合 **BS-ROBUST-003**；**`KnowledgeLoadError`** 契约不变；全量 pytest 绿。  
  - **SDD 联动**：若对外异常类型变化 → **是**。

- [x] **B-T19.** 消除 **BS-CLARITY-009**：收敛 **`Eywa` 母体静态方法面** 或 **实例化母体上下文**  
  - **依赖**：无（与 **SDD §3.13** 叙事一致时优先）。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-009**。  
  - **涉及路径**：`src/eywa/kernel/core/eywa.py`、`eywa_mother.py`  
  - **步骤**：① 测绿 / ② 按消除标准收敛门面 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：符合 **BS-CLARITY-009**；**公开 API** 不变或经 **SDD**；全量 pytest 绿。  
  - **SDD 联动**：**是**（若动用户向 API）。

- [x] **B-T20.** 消除 **BS-REUSE-003**：**`bootstrap` + `.env.yaml` 合并** 单一路径  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-REUSE-003**。  
  - **涉及路径**：`src/eywa/kernel/core/bootstrap.py`、`foundation/llm/env_yaml.py`  
  - **步骤**：① 测绿（**kindle** / **env yaml**）/ ② 提取共用装配 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：符合 **BS-REUSE-003**；**六元组** 与 **`KindleBootstrap`** 语义不变；全量 pytest 绿。  
  - **SDD 联动**：若 **FR-F-07** 双源语义变化 → **是**。

- [x] **B-T21.** 消除 **BS-CLARITY-010**：拆分 **`env_yaml._profile_from_yaml_item`**  
  - **依赖**：无。  
  - **坏味道**：[`badsmells.md`](./badsmells.md) §2 **BS-CLARITY-010**。  
  - **涉及路径**：`src/eywa/foundation/llm/env_yaml.py`  
  - **步骤**：① 测绿 / ② 拆分新建与合并分支或表驱动 / ③ 测绿 / ④ 用户确认。  
  - **完成定义（DoD）**：符合 **BS-CLARITY-010**；**`test_env_yaml_m5_02.py`** 绿；全量 pytest 绿。  
  - **SDD 联动**：若 **`.env.yaml`** 可观察注册语义变化 → **是**。

---

## 4. 修订历史

| 版本 | 日期 | 提交版本 | 摘要 |
|------|------|----------|------|
| 0.1.0 | 2026-03-29 | — | 初版。 |
| 0.2.0 | 2026-03-29 | — | 任务 **必须** 源自 **`badsmells.md`**；`badsmells.md` 变更后先 analysis 再改任务；B-T00 对齐迁移。 |
| 0.2.1 | 2026-03-31 | — | B-T00 改为 **仅在 `badsmells.md` 内** 补齐条目；不再依赖外置草稿。 |
| 0.3.0 | 2026-03-31 | — | 对齐 **`badsmells.md` v0.2.0**：**B-T01～B-T05**；移除 **B-T00**；建议顺序 REUSE/SIMPLE → YAML 统一 → `carry_out` → `Spirit` 瘦身。 |
| 0.3.1 | 2026-03-31 | `b4431e8e003cd9a3fcc3702e02a91a4030486c56` | 修订历史增列 **提交版本**；依据与 `badsmells` / `analysis` 版本对齐；分解任务环节须填 `git rev-parse HEAD`（见 [specification.md §7](./specification.md#7-修订历史表与提交版本门禁)）。 |
| 0.3.2 | 2026-03-31 | `10886f5f316b91f93a725f794cca2880ac7d1dcd` | 依据对齐宪法 **v1.3**、**`badsmells` v0.2.2**、元规约 **v0.2.3**、**`analysis` v0.3.2**。 |
| 0.4.0 | 2026-03-31 | `10886f5f316b91f93a725f794cca2880ac7d1dcd` | **`badsmells` v0.3.0** 再识别：新增 **B-T06**（BS-ROBUST-001）、**B-T07**（BS-SEC-001）；analysis **v0.3.3**。 |
| 0.4.1 | 2026-03-31 | `345d98508491022988bd25d6edbc11cffdffb8b0` | **B-T01** 完成：`_bootstrap_from_filled_registry` 合并 `bootstrap_from_env` / `bootstrap_from_openai_compat_serial_env` 装配路径；全量 pytest 绿。 |
| 0.4.2 | 2026-03-31 | `a1050e6afbc818f0cffaf8eab4a73b44b35f26f0` | **B-T02** 完成：`spirit.py` 顶导入 `yaml`，移除 `_carry_out_load_serial_spec` / `enter_seer_roles` 内重复 `import yaml`；全量 pytest 绿。 |
| 0.4.3 | 2026-03-31 | `b4e990c6d272436dc6fe7290873b5c09bf2ca0ee` | **B-T03** 完成：`_load_yaml_root_mapping` 统一 dict/文件加载；`carry_out` 仍 `ValueError`、`enter_seer_roles` 仍 `SerialMultiAgentSpecError`；全量 pytest 绿。 |
| 0.4.4 | 2026-03-31 | `fc8f854c3b4eaef186dc92d9a6c74af28bce85ee` | **B-T04** 完成：`carry_out` 拆为 `_carry_out_serial_branch` / `_carry_out_crew_slot_branch` / `_carry_out_planner_turn_branch` 等；`test_m16_*` / `test_m17_*` 与全量 pytest 绿。 |
| 0.4.5 | 2026-03-31 | `539b30e00a5cfbb901ab52471df690989f9af15c` | **B-T05** 完成：新增 **`spirit_seer_catalog.SpiritSeerCatalog`**（洞悉角色 + YAML ``agents``/顺序）；`load_yaml_root_mapping` 迁入同模块；`Spirit` 委托；全量 pytest 绿。 |
| 0.4.6 | 2026-03-31 | `9f8fc8144f5766011015cf659313c30635ffdd87` | **B-T06** 完成：**`ToolInvoker`** 超时/异常路径 **WARNING** 日志 + **`redact_secrets`**（经 **`foundation.string_redact`**，避免与 `intelligence` 包循环导入）；**`OpenAICompatibleClient`** 流式 SSE **JSON** 损坏行 **DEBUG** 预览 + 结束 **WARNING** 汇总，**`stream_json_decode_error_limit`** 可配置超限 **`ValueError`**；全量 pytest 绿。 |
| 0.4.7 | 2026-03-31 | `8fe1c9e753a236e8e7ed0ba24525b523d3c1fd38` | **B-T07** 完成：**`LlmProfileRegistry.register`** 调用 **`validate_llm_base_url`**（仅 **http/https**、须含主机；**`EYWA_LLM_BLOCK_PRIVATE_BASE_URL`** 可选收紧 loopback/私网/链路本地等）；**`OpenAICompatibleClient`** 在阻塞/流式 **`HTTPStatusError`** 路径 **WARNING** 日志 + **`redact_secrets`**（URL 与响应体预览）；`env_bootstrap` / `openai_compat_serial_env` docstring 对齐；全量 pytest 绿。 |
| 0.5.0 | 2026-03-31 | `2b18d6e8603d3cf51bbbe92aec2db4e422ca9706` | **`badsmells` v0.4.0** 再识别后增补 **B-T08**（**BS-ROBUST-002**）、**B-T09**（**BS-SEC-002**）、**B-T10**（**BS-CLARITY-003**）；**analysis v0.3.5** 已更新 **§2.1**。 |
| 0.5.1 | 2026-03-31 | `413820745e1829aa462a947562a8f1192def0132` | **B-T08** 完成：**`llm_retry.complete_with_network_retry`** 非 **httpx** 预期异常与重试用尽路径 **WARNING** + **`redact_secrets`**；`tests/kernel/test_llm_retry.py` 增 **caplog**；**`badsmells` v0.4.1**；全量 pytest 绿。 |
| 0.5.2 | 2026-03-31 | `d5c858d1b3850c8b6a4930f3d2a6545188af126b` | **B-T09** 完成：**`OpenAICompatibleClient.__init__`** 调用 **`validate_llm_base_url`**（与 **Registry** 一致，含 **`EYWA_LLM_BLOCK_PRIVATE_BASE_URL`**）；`tests/foundation/test_llm_base_url.py` 增直连 Client 测例；**`badsmells` v0.4.2**；全量 pytest 绿。 |
| 0.6.0 | 2026-04-10 | — | **`badsmells` v0.5.0** 再识别后增补 **B-T11～B-T18**；依据 **specification v0.2.6**、**analysis v0.3.8**；**§3** 对齐 **`badsmells` v0.5.0**。提交后须填 `git rev-parse HEAD`。 |
| 0.7.0 | 2026-04-15 | `b5302052c5793c26b507bbc090971a356953b45e` | **`badsmells` v0.6.0**：索引与 **B-T10～B-T18** 闭环；新增 **B-T19～B-T21**（**BS-CLARITY-009**、**BS-REUSE-003**、**BS-CLARITY-010**）；依据 **specification v0.2.7**、**analysis v0.4.0**。 |
| 0.8.0 | 2026-04-15 | `ac7e3487124b6ac048cbf40c720a23ae5e079263` | **B-T19～B-T21** 已完成并通过全量测试；`Eywa` 母体门面收敛到 `MotherOrchestration` 委托、`bootstrap` 与 `.env.yaml` 合并路径收敛、`env_yaml._profile_from_yaml_item` 拆分完成。 |
