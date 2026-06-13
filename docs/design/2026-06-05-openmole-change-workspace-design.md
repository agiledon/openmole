# OpenMole Change 工作区重构 — 整合设计

**日期**：2026-06-05  
**状态**：已批准（brainstorming 整合）  
**依据**：`openspec/changes/openmole-change-workspace/`、`openspec/changes/openmole-workflow/`（待归档）  
**执行策略**：方案 1 Big-bang

---

## 1. 变更编排

| OpenSpec change | 处置 |
|-----------------|------|
| `openmole-workflow` | **归档**；MVP 44/52 视为完成；**10.6 跳过**（OpenCode 验收已完成）；7 项 v1.1 **不实现** |
| `openmole-change-workspace` | **主实现线**；Big-bang 一次性交付；v1.1 意图写入 **Phase 2** |

---

## 2. 目标项目布局

```
{project-root}/openmole/
├── config.yaml                    # 唯一 OpenMole 配置（current_change 等）
└── changes/
    ├── <change-name>/
    │   ├── .openmole-change.yaml       # name, created, scan_scope, status: active|archived
    │   ├── badsmells.md
    │   ├── tasks.md
    │   └── analysis.md
    └── archive/
        └── YYYY-MM-DD-<change-name>/
```

### 2.1 config.yaml

```yaml
current_change: refactor-auth-module   # 活跃 change；归档后清空或删除字段
```

### 2.2 .openmole-change.yaml

```yaml
name: refactor-auth-module
created: 2026-06-05
scan_scope: src/auth/
status: active   # active | archived
```

### 移除项

- 根目录 `.openmole.yaml`
- 运行时路径 `docs/openmole/`、`docs/prd/`、`OPENMOLE_DOCS_ROOT`
- 插件仓库 `docs/prd/`、`docs/reference/openmole/`、`scripts/sync-reference-docs.sh`
- Skill `using-openmole/`

---

## 3. 规约来源（F1：Skill 内嵌）

constitution / specification **不以独立文件** 存在于 Plugin 或目标项目。

五份 Skill（explore / analyze / plan / apply / archive）各含 **相同「OpenMole 规约摘要」节**：

- constitution §3 八项原则
- constitution §4 六步标准流程
- constitution §5 单任务粒度
- specification §4 badsmells 七字段 + §2.0 状态枚举
- specification §7 修订历史与 `git rev-parse HEAD`

**不实现** 目标项目 `openmole/constitution.md` 本地覆盖（YAGNI；Phase 2 可按需加）。

---

## 4. 命令与数据流

```
mole:explore [path] [change-name]
    → （D3）有 active change 时询问：继续当前 / 新建
    → 创建或更新 openmole/changes/<name>/
    → 步骤 0：跨 change 去重
    → 写入 badsmells.md

mole:verify  → 读写 openmole/changes/{current}/analysis.md + tasks.md
mole:plan     → 读写 openmole/changes/{current}/badsmells.md + tasks.md
mole:apply    → 读写 openmole/changes/{current}/tasks.md；回写 badsmells §2.0
mole:archive  → 完成度检查 → 用户确认门 → mv 至 archive/
```

### 4.1 explore 生命周期（D3）

| 条件 | 行为 |
|------|------|
| 无 `current_change` | 新建 change；名称由参数指定或 Agent 提议 + **用户确认** |
| 有 active change | **询问**：继续当前（升版 badsmells）/ 新建 change |
| 显式 `[change-name]` | 若目录不存在则创建；存在则在该 change 内升版 |

同一 change 内多次 explore：**允许升版** badsmells，不强制新建 change。

### 4.2 跨 change 去重

explore 创建条目前：

1. 扫描 `openmole/changes/*/badsmells.md` 与 `openmole/changes/archive/*/badsmells.md` 的 §2.0
2. 构建集合：BS-ID、指纹 `(规范化路径, Fowler 标签)`
3. 指纹匹配且状态 **已消除** → 跳过，注明原 change
4. 指纹匹配且 **未清除/部分残余** 于其他 change → **警告**，不得静默重复

首版 **不** 引入 `openmole/registry.yaml`；纯 markdown 扫描。

### 4.3 archive 门禁

1. 读取 current change 的 badsmells §2.0 + tasks §3
2. 存在 **未清除/部分残余** 或未完成任务 → 列出清单 → **用户确认** 仍归档 / 取消
3. 归档：`mv openmole/changes/<name> openmole/changes/archive/YYYY-MM-DD-<name>/`
4. 更新 `.openmole-change.yaml` status → `archived`；清空 `config.yaml` 的 `current_change`

---

## 5. Plugin 变更摘要

| 组件 | 变更 |
|------|------|
| Skills | 删 using-openmole；增 mole-archive；五 Skill 内嵌规约摘要 + 工作区解析节 |
| Commands | 增 mole-archive.md；更新 mole-explore 参数说明 |
| OpenCode openmole.js | 短固定 bootstrap（3～5 行），不读 using-openmole 文件 |
| tests | 5 skills frontmatter；删 reference/Eywa 测试；增 workspace 路径 smoke |
| README / INSTALL | openmole/ 布局、五命令 + archive、无安装复制 |

---

## 6. Phase 2 backlog（原 openmole-workflow v1.1）

自 `openmole-workflow` 迁入，**workspace 完成后再评估**：

- Claude / Codex / Gemini 插件清单
- hooks/session-start（须基于新 bootstrap，非 using-openmole 文件注入）
- agents/code-reviewer.md
- `.version-bump.json` + `scripts/bump-version.sh`
- 多 platform manifest 测试
- AGENTS.md / CLAUDE.md / GEMINI.md

---

## 7. 迁移与验收

### 7.1 插件仓库

1. Big-bang 实现 `openmole-change-workspace` tasks
2. 删除 `docs/prd/`、`docs/reference/openmole/`、`.openmole.yaml`、`skills/using-openmole/`
3. 本仓库可选用 `openmole/changes/` dogfood 布局自测

### 7.2 验收（替代 openmole-workflow 10.6）

- OpenCode：已完成（旧模型）→ workspace 后重验 7.5
- Cursor path-install 全链路：explore → analyze → plan → apply → archive（tasks 7.5）

### 7.3 openmole-workflow 归档

- sync specs 已完成部分保留于 `openspec/specs/`
- 移动 `openspec/changes/openmole-workflow/` → `archive/2026-06-05-openmole-workflow/`
- tasks 注明 10.6 跳过、v1.1 → Phase 2

---

## 8. 风险

| 风险 | 缓解 |
|------|------|
| 规约摘要五份重复 | 内容控制在 ~40 行；Phase 2 可抽 shared snippet |
| Big-bang diff 大 | 原子提交；validate-plugin.sh 门禁 |
| 去重误跳过 | 指纹含路径+标签；警告未清除重复 |
| 删 docs/prd 丢失 Eywa 历史 | git 历史保留；归档前确认无外部引用 |
