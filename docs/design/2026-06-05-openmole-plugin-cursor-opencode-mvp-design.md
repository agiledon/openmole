# OpenMole Plugin MVP 设计（Cursor + OpenCode）

**日期**：2026-06-05  
**状态**：草案 — 待维护者确认  
**依据**：[`openspec/changes/openmole-workflow/`](../../openspec/changes/openmole-workflow/proposal.md)、[`docs/prd/`](../../docs/prd/README.md)  
**范围**：方案 A — 双 harness 完整 Plugin（Cursor + OpenCode），不含 Claude/Codex/Gemini hooks

---

## 1. 背景与目标

OpenMole 规约已在 `docs/prd/` 定义完整文档链，但缺少可安装的 Agent Plugin。本设计将 OpenSpec `openmole-workflow` 变更收敛为 **可交付的 MVP**：在 Cursor 与 OpenCode 上安装 Plugin 后，用户可通过 `mole:explore`、`mole:verify`、`mole:plan`、`mole:apply` 驱动 Agent 遵循 OpenMole 流程。

**MVP 成功标准**：

1. Cursor path-install 后四命令可用，Skill 自动发现。
2. OpenCode 按 `INSTALL.md` 安装后行为与 Cursor 一致（同一 `skills/`）。
3. 在本仓库用 `.openmole.yaml`（`docs_root: docs/prd`）跑通 explore → analyze → plan → apply 全链路。
4. `tests/run-tests.sh` 通过 manifest 与 frontmatter 校验。

**MVP 明确不做**：Claude/Codex/Gemini 清单、sessionStart hooks、code-reviewer agent、Web UI、静态分析 CLI。

---

## 2. 架构与组件边界

```
┌─────────────────────────────────────────────────────────┐
│  Harness 层                                              │
│  Cursor (.cursor-plugin)    OpenCode (openmole.js + INSTALL) │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────────────────────────────────────┐
│  入口层：commands/openmole-{explore,analyze,plan,apply}.md    │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│  行为层：openmole-explore, openmole-verify,     │
│         openmole-plan, openmole-apply                             │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│  规约层：{docs_root}/ constitution → specification →     │
│         badsmells → tasks → analysis                    │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│  目标项目源码                                             │
└──────────────────────────────────────────────────────────┘
```

| 组件 | 职责 | 依赖 |
|------|------|------|
| `using-openmole` | 阶段路由、docs root 解析、RED FLAGS | constitution |
| `openmole-explore` | 扫描源码 → `badsmells.md` | specification §4 |
| `openmole-verify` | badsmells 变更差分 A～F → 同步 tasks | analysis §2 |
| `openmole-plan` | 未清除/部分残余 → `B-Txx` 任务 | tasks §2 模板 |
| `openmole-apply` | 单任务执行 + 用户确认门 | constitution §4 |
| `templates/` | 工件骨架 | — |
| `docs/reference/openmole/` | 绿field 初始化副本 | 同步自 `docs/prd/` |

---

## 3. 数据流与命令协作

### 3.1 标准时序

1. `mole:explore [path]` → 写/更新 `badsmells.md`（§2.0 索引 + 条目）
2. 用户审阅 badsmells
3. `mole:verify`（badsmells 版本或内容变更时 **必须**）→ 更新 `analysis.md` §2.1 + `tasks.md`
4. `mole:plan` → 为未清除/部分残余条目生成或更新 `B-Txx`
5. 用户审阅 tasks
6. `mole:apply` → 执行下一未完成任务（①补测→②测绿→③重构→④测绿→⑤用户确认）
7. 重复 6 直至 backlog 清空

### 3.2 读写边界

| 命令 | 读取 | 写入 | 前置条件 |
|------|------|------|----------|
| explore | constitution, specification, 源码 | badsmells.md | docs root 可解析 |
| analyze | badsmells, tasks | analysis.md, tasks.md | badsmells 有实质变更或 tasks 依据过期 |
| plan | badsmells §2.0, tasks | tasks.md | analyze 已完成 |
| apply | tasks, badsmells, 源码 | 源码, tasks, badsmells §2.0 | 依赖满足、测绿 |

### 3.3 docs root 解析顺序

1. `.openmole.yaml` → `docs_root`
2. 环境变量 `OPENMOLE_DOCS_ROOT`
3. `docs/openmole/constitution.md`
4. `docs/prd/constitution.md`（开发回退）
5. 提示从 `docs/reference/openmole/` 初始化

### 3.4 Cursor vs OpenCode

|  Concern | Cursor | OpenCode |
|----------|--------|----------|
| 注册 | `.cursor-plugin/plugin.json` | `.opencode/plugins/openmole.js` + `INSTALL.md` |
| Skill 来源 | 共享 `./skills/` | 共享 `./skills/` |
| 命令 | `commands/*.md` | 同左 |

---

## 4. 错误处理

### 4.1 Agent 行为门禁（RED FLAGS）

| 场景 | 行为 |
|------|------|
| docs root 不存在 | 停止；提示从 `docs/reference/openmole/` 复制或配置 `.openmole.yaml` |
| plan 时 tasks 依据版本 < badsmells 版本 | 停止；要求先 `mole:verify` |
| apply 时测试失败 | 停止重构步骤；修测试或代码直至绿 |
| apply 时用户未确认 | 不得 `[x]` 任务；不得启动下一任务 |
| apply 中发现未登记坏味道 | 停止；回流 explore → analyze → plan |
| 条目/任务标记 `[SDD]` | 未确认 SDD 修订前不得改生产代码 |
| 跳过 constitution §4 任一步骤 | RED FLAG；Skill 正文 MUST 禁止 |

### 4.2 工件格式错误

- explore/plan 写入前：对照 `templates/` 与 specification §4 自检清单。
- 修订历史升版时：提醒填写「提交版本」（specification §7）；未提交时填 `—`。
- 无自动 JSON Schema 校验（MVP）；依赖 Skill 自检 + Shell 测试覆盖 manifest/frontmatter。

### 4.3 OpenCode 插件错误

- `openmole.js` 加载失败：INSTALL.md 提供排查步骤（Node 版本、路径、权限）。
- frontmatter 解析失败：跳过该 Skill 并 stderr 警告，不 crash 整个插件。

---

## 5. 测试策略

### 5.1 自动化（Shell）

| 测试 | 路径 | 断言 |
|------|------|------|
| Manifest 字段 | `tests/plugin/test-manifests.sh` | `.cursor-plugin/plugin.json` 含 skills/commands 路径 |
| Skill frontmatter | `tests/plugin/test-skills-frontmatter.sh` | 每个 SKILL.md 有 name、description |
| OpenCode 加载 | `tests/opencode/test-plugin-loading.sh` | `openmole.js` 可被 Node import |
| 聚合入口 | `tests/run-tests.sh` | 上述全部 exit 0 |
| 校验脚本 | `scripts/validate-plugin.sh` | command 文件引用的 skill 名存在 |

### 5.2 手动验收（本仓库）

1. Cursor path-install Plugin
2. `.openmole.yaml` 指向 `docs/prd`
3. `mole:explore .` → 检查 badsmells 格式
4. badsmells 升版 → `mole:verify` → 检查 analysis §2.1 与 tasks 同步
5. `mole:plan` → 检查 B-Txx 模板字段
6. `mole:apply` → 单任务测绿 + 确认门
7. OpenCode 重复 3～6

### 5.3 不在 MVP 测试范围

- 多语言项目端到端重构正确性（依赖 Agent 质量）
- Claude/Codex/Gemini 安装路径
- hooks sessionStart 注入

---

## 6. MVP 交付清单

### Phase 1 — 骨架（≈1 天）

- [ ] 目录布局（design D2 子集：无 agents/hooks/claude/codex/gemini）
- [ ] `package.json`、`.cursor-plugin/plugin.json`
- [ ] `.opencode/INSTALL.md`、`.opencode/plugins/openmole.js`
- [ ] `templates/` 全套
- [ ] `docs/reference/openmole/` + `scripts/sync-reference-docs.sh`
- [ ] `.openmole.yaml`（`docs_root: docs/prd`）

### Phase 2 — Skill + Command（≈2 天）

- [ ] `using-openmole`、`openmole-explore`、`openmole-verify`、`openmole-plan`、`openmole-apply`
- [ ] 四个 `commands/mole-*.md`
- [ ] 更新根 `README.md` 安装说明

### Phase 3 — 测试与验收（≈0.5 天）

- [ ] `tests/` + `scripts/validate-plugin.sh`
- [ ] Cursor + OpenCode 手动全链路
- [ ] LICENSE（MIT）、CHANGELOG 初版

---

## 7. v1.1 延后项

- `hooks/session-start`（未清除坏味道提示）
- `agents/code-reviewer.md`
- Claude / Codex / Gemini 插件清单
- `mole:explore --incremental`（git diff 范围扫描）

---

## 8. 与 OpenSpec 变更的关系

本设计为 `openspec/changes/openmole-workflow` 的 **MVP 子集**，不替代原 change 的全量 spec。实现完成后应：

1. 在 `openspec/changes/openmole-workflow/tasks.md` 勾选已完成项；
2. 将 v1.1 延后项保留为 open tasks；
3. 全量 harness 支持作为后续 change 或同 change 的 Phase 4。

---

## 9. 修订历史

| 版本 | 日期 | 摘要 |
|------|------|------|
| 0.1.0 | 2026-06-05 | 初版：方案 A（Cursor + OpenCode MVP）架构、数据流、错误处理、测试与交付清单 |
