## Context

BDR Plugin MVP 已实现 Cursor + OpenCode 双 harness、5 Skill（含 `using-bdr`）、4 Command，工件通过 `{docs_root}` 解析至 `docs/prd/` 或 `docs/bdr/`。`docs/reference/bdr/` 自 `docs/prd/` 同步，含 Eywa 框架真实 badsmells/tasks 条目。

用户要求借鉴 OpenSpec：**每次 `bdr:explore` = 新 change**，工件隔离在 `bdr/changes/<name>/`；安装时不应强制复制 Eywa 内容；需跨 change 去重与 `bdr:archive`；评估 `using-bdr` 是否保留。

## Goals / Non-Goals

**Goals:**

- 目标项目根目录 **`bdr/`** 为 BDR 工作区；per-change 工件在 **`bdr/changes/<change-name>/`**。
- 无本地 constitution 时，从 **Plugin bundle** 只读加载规约，**安装零复制** 即可执行 BDR。
- 净化 bundle：结构不变、版本 **0.1.0**、无 Eywa 字眼、1～2 条通用示例。
- explore 创建 change、支持命名与自动命名；archive 完成 change 生命周期。
- explore 去重：对照历史 change 已有 BS-ID / 位置指纹。

**Non-Goals:**

- 不实现 OpenSpec CLI 级 change 管理 UI。
- 不迁移用户已有 `docs/prd/` Eywa 文档（插件仓库内保留作开发参考）。
- 不在本变更实现 Claude/Codex/Gemini 多 harness（延续 MVP 范围）。

## Decisions

### D1：安装时 **不** 提供复制参考目录功能

**分析：**

| 文档 | 执行 BDR 是否必须在目标项目存在 | 来源 |
|------|--------------------------------|------|
| constitution.md | 是（门禁原则） | Plugin bundle 只读 fallback |
| specification.md | 是（条目格式） | Plugin bundle 只读 fallback |
| badsmells.md | 否（explore 创建） | `{change_dir}/` 新建 |
| tasks.md / analysis.md | 否 | `{change_dir}/` 新建 |

**结论：** Agent 只需 **读取** constitution/specification；Plugin 已打包 `docs/reference/bdr/`。**无需** 安装后复制到目标项目即可正确执行。

**选择：** OpenCode / Cursor **均不提供**「是否复制初始化文件」prompt。

**备选：** 可选复制 constitution+spec 到 `bdr/` 供用户定制 — 拒绝为默认流程；用户可手动复制，Skill 优先读 `bdr/constitution.md` 若存在。

### D2：工作区目录布局

```
{project-root}/bdr/
├── config.yaml                 # current_change、created_at（可选）
├── constitution.md             # 可选本地覆盖；缺省读 Plugin bundle
├── specification.md            # 可选本地覆盖
├── changes/
│   ├── <change-name>/          # 活跃 change
│   │   ├── .bdr-change.yaml    # name, created, scan_scope, status: active|archived
│   │   ├── badsmells.md
│   │   ├── tasks.md
│   │   └── analysis.md
│   └── archive/
│       └── YYYY-MM-DD-<change-name>/   # 归档副本（含 .bdr-change.yaml status: archived）
```

**change 名规则：** kebab-case；用户 `bdr:explore [path] [change-name]` 指定；未指定时 Agent 根据扫描路径与主题生成（如 `refactor-auth-module`），**须用户确认**后创建目录。

**current change：** `bdr/config.yaml` 的 `current_change` 字段；explore 新建时更新；analyze/plan/apply/archive 默认操作 current change。

### D3：规约解析顺序（替代原 docs_root）

1. `{project}/bdr/constitution.md`（本地覆盖）
2. `{plugin}/docs/reference/bdr/constitution.md`（bundle fallback）
3. 同上逻辑适用于 specification.md

**移除：** `BDR_DOCS_ROOT`、`docs/prd/`、`docs/bdr/` 作为运行时工件路径。

**插件仓库开发：** 本仓库 `.bdr.yaml` 改为指向 `bdr/` 或保留 dev 别名文档说明。

### D4：跨 change 坏味道去重

explore **步骤 0**（创建条目前）：

1. 扫描 `bdr/changes/*/badsmells.md`（排除 `archive/`）及 `bdr/changes/archive/*/badsmells.md` 的 §2.0 索引。
2. 构建 **已占用集合**：BS-ID、`(文件路径, Fowler 标签)` 指纹。
3. 新识别条目若指纹匹配已存在且状态非 **未清除** → **跳过**并注明「已在 change X 处理」。
4. 若匹配 **未清除** 且属不同 change → **警告**重复，建议合并或引用原 BS-ID，不得静默新建同位置条目。

### D5：bdr:archive 行为

1. 读取 `current_change` 目录下 badsmells §2.0 + tasks §3。
2. 若存在 **未清除/部分残余** 或 tasks `[ ]`：
   - 列出未完成项；
   - **AskUserQuestion 等价门**：用户确认仍归档 / 取消继续 apply。
3. 归档：`mv bdr/changes/<name> bdr/changes/archive/YYYY-MM-DD-<name>/`；更新 `.bdr-change.yaml` status；清空或移除 `config.yaml` 的 `current_change`。

### D6：移除 using-bdr

**结论：非必须，应移除。**

| 原职责 | 新归属 |
|--------|--------|
| 工作区 / change 解析 | 各阶段 Skill 统一「前置：解析 bdr 工作区」节 |
| 四命令路由 | Command 薄包装已委托对应 Skill；无歧义请求不需要 meta skill |
| RED FLAGS | 各 Skill 保留精简 RED FLAGS；Plugin bootstrap 仅 3～5 行摘要 |
| constitution 摘要 | 保留在各 Skill「须读取 bundle 或 bdr/ 下 constitution」 |

**OpenCode `bdr.js`：** bootstrap 改为固定短文本（BDR 已安装、`bdr/` 工作区、current change 概念），**不再** `readFileSync(using-bdr/SKILL.md)`。

### D7：净化 docs/reference/bdr/

- constitution / specification：通用化，版本 **0.1.0**，路径描述改为 `bdr/changes/<change>/`。
- badsmells.md：§2.0 含 **2 条** 示例（如 `BS-CLARITY-001` Long Method、`BS-REUSE-001` Duplicate Code），虚构 `src/example/` 路径。
- tasks.md / analysis.md：各 **1 条** 与示例 badsmell 对应的任务/差分记录。
- **禁止** 出现 Eywa、Spirit、kindle 等字眼；`docs/prd/` **不** 再作为 sync 源（改由 hand-authored generic templates 维护 reference）。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| Breaking 现有 `.bdr.yaml` docs_root 用户 | Migration 文档；本仓库 `.bdr.yaml` 更新 |
| 自动 change 名不符合预期 | 创建前用户确认；支持显式命名 |
| 去重误跳过合法新 smell | 指纹含文件+标签；同文件不同 concern 可新 BS-ID |
| 移除 using-bdr 后 bootstrap 信息不足 | 各 Skill 自给前置节 + 短 bootstrap |
| archive 误归档未完成 change | 强制未完成清单 + 用户确认门 |

## Migration Plan

1. 重写 `docs/reference/bdr/` 通用 v0.1 内容。
2. 新增 `bdr-archive` Skill/Command；删除 `using-bdr`。
3. 更新 explore/analyze/plan/apply 路径与去重/archive 逻辑。
4. 更新 `bdr.js`、tests、README、`.bdr.yaml`。
5. 本仓库建立 `bdr/changes/` 示例 change 用于 dogfood（可选）。
6. Rollback：恢复 skills 与 docs_root 解析（git revert）。

## Open Questions

1. `bdr/config.yaml` 是否合并 `.bdr.yaml` 为单一配置文件？
2. archive 后是否保留 BS-ID 全局注册表（`bdr/registry.yaml`）以加速去重 — 首版用扫描 markdown 即可。
3. 同一 change 内 explore 多次是 **升版** badsmells 还是禁止 — 首版允许升版，不新建 change。
