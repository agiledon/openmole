# BDR Change 工作区重构 — 实现计划

> **面向 Agent 执行者：** 必须使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 按任务逐步执行。步骤使用复选框（`- [ ]`）语法跟踪进度。

**Goal：** Big-bang 将 BDR Plugin 从 `docs/prd` 单目录模型迁移至 `bdr/changes/<change-name>/` 工作区，删除冗余文档树与 `using-bdr`，内嵌规约于五 Skill，新增 `bdr:archive`。

**Architecture：** Skill-first；目标项目仅 `bdr/config.yaml` + `bdr/changes/`；规约摘要（F1）复制自 `templates/bdr-rules-snippet.md` 写入五 Skill；explore 负责 change 生命周期（D3）与跨 change 去重；archive 负责完成度门禁与 `changes/archive/` 移动。

**Tech Stack：** Markdown Skill/Command、Bash 测试、Node ESM OpenCode 插件（零 npm 依赖）、YAML 配置模板。

**设计规格：** [`docs/design/2026-06-05-bdr-change-workspace-design.md`](../2026-06-05-bdr-change-workspace-design.md)

---

## 文件职责一览

| 路径 | 变更 | 职责 |
|------|------|------|
| `templates/bdr-rules-snippet.md` | 新建 | 五 Skill 共享规约摘要源（复制用，非 runtime） |
| `templates/bdr-config.yaml.example` | 新建 | `bdr/config.yaml` 示例 |
| `templates/bdr-change.yaml` | 新建 | `.bdr-change.yaml` 示例 |
| `templates/badsmells-header.md` | 修改 | 去掉 constitution 外链；依据改为 change 内自洽 |
| `templates/.bdr.yaml.example` | 删除 | 被 bdr-config 替代 |
| `skills/using-bdr/` | 删除 | 由五 Skill 自给 |
| `skills/bdr-archive-change/` | 新建 | archive 行为 |
| `skills/bdr-{explore,analyze,plan,apply}/` | 重写 | 工作区 + 规约摘要 |
| `commands/bdr-archive.md` | 新建 | archive 入口 |
| `commands/bdr-explore.md` | 修改 | `[path] [change-name]` |
| `.opencode/plugins/bdr.js` | 修改 | 短 bootstrap |
| `docs/prd/` | 删除 | Eywa 历史（git 保留） |
| `docs/reference/bdr/` | 删除 | 不再需要 bundle |
| `scripts/sync-reference-docs.sh` | 删除 | — |
| `.bdr.yaml` | 删除 | — |
| `tests/plugin/test-workspace-skills.sh` | 新建 | Skill 含工作区关键字 |
| `tests/plugin/test-no-legacy-paths.sh` | 新建 | 无 docs_root/using-bdr 残留 |
| `README.md`、`.opencode/INSTALL.md` | 修改 | 新工作区说明 |

---

### 任务 1：工作区模板与规约摘要源

**Files:**
- Create: `templates/bdr-rules-snippet.md`
- Create: `templates/bdr-config.yaml.example`
- Create: `templates/bdr-change.yaml`
- Modify: `templates/badsmells-header.md`
- Delete: `templates/.bdr.yaml.example`

- [ ] **步骤 1：创建 `templates/bdr-rules-snippet.md`**

```markdown
## BDR 规约摘要（内嵌于各 Skill，非独立文件）

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

每次 `bdr:apply` 仅处理一个未完成任务。

### specification §4 — badsmells 条目

七字段 + §2.0 状态：**未清除** / **已消除** / **部分残余**。

### specification §7 — 修订历史

升版时 **提交版本** = `git rev-parse HEAD`，未提交填 `—`。
```

- [ ] **步骤 2：创建 `templates/bdr-config.yaml.example`**

```yaml
# 复制到目标项目 bdr/config.yaml
current_change: null   # 活跃 change 名；explore 新建时更新；archive 后清空
```

- [ ] **步骤 3：创建 `templates/bdr-change.yaml`**

```yaml
name: refactor-example
created: 2026-06-05
scan_scope: src/example/
status: active   # active | archived
```

- [ ] **步骤 4：更新 `templates/badsmells-header.md`**

将依据行改为：

```markdown
**依据**：BDR 规约摘要（见 Skill 内嵌）；change 内 [tasks.md](./tasks.md)
```

删除 `[constitution.md](./constitution.md)` 链接。

- [ ] **步骤 5：删除 `templates/.bdr.yaml.example`**

```bash
rm templates/.bdr.yaml.example
```

---

### 任务 2：测试先行 — 工作区与 legacy 清理门禁

**Files:**
- Create: `tests/plugin/test-workspace-skills.sh`
- Create: `tests/plugin/test-no-legacy-paths.sh`

- [ ] **步骤 1：编写 `tests/plugin/test-workspace-skills.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
for skill in bdr-explore-to-change bdr-analyze-change bdr-plan-change bdr-apply-change bdr-archive-change; do
  f="$ROOT/skills/$skill/SKILL.md"
  [[ -f "$f" ]] || { echo "FAIL: missing $f"; exit 1; }
  grep -q 'bdr/config.yaml' "$f" || { echo "FAIL: $f missing bdr/config.yaml"; exit 1; }
  grep -q 'change_dir' "$f" || { echo "FAIL: $f missing change_dir"; exit 1; }
done
echo "PASS: workspace keywords in skills"
```

- [ ] **步骤 2：编写 `tests/plugin/test-no-legacy-paths.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
[[ ! -d "$ROOT/skills/using-bdr" ]] || { echo "FAIL: using-bdr still exists"; exit 1; }
[[ ! -f "$ROOT/.bdr.yaml" ]] || { echo "FAIL: .bdr.yaml still exists"; exit 1; }
for f in "$ROOT"/skills/*/SKILL.md; do
  grep -q 'docs_root' "$f" && { echo "FAIL: docs_root in $f"; exit 1; }
  grep -q 'docs/prd' "$f" && { echo "FAIL: docs/prd in $f"; exit 1; }
  grep -q 'using-bdr' "$f" && { echo "FAIL: using-bdr ref in $f"; exit 1; }
done
echo "PASS: no legacy paths"
```

- [ ] **步骤 3：运行测试（预期失败）**

```bash
chmod +x tests/plugin/test-workspace-skills.sh tests/plugin/test-no-legacy-paths.sh
bash tests/run-tests.sh
```

预期：`FAIL: missing skills/bdr-archive-change/SKILL.md` 等。

---

### 任务 3：移除 using-bdr 并更新 OpenCode bootstrap

**Files:**
- Delete: `skills/using-bdr/SKILL.md`
- Modify: `.opencode/plugins/bdr.js`
- Modify: `.opencode/INSTALL.md`

- [ ] **步骤 1：删除 using-bdr**

```bash
rm -rf skills/using-bdr
```

- [ ] **步骤 2：重写 `.opencode/plugins/bdr.js`**

```javascript
/**
 * BDR plugin for OpenCode.ai — registers skills path, short bootstrap.
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOTSTRAP = `<BDR-BOOTSTRAP>
BDR (Bad smell Driven Refactoring) is installed.
Workspace: \`bdr/config.yaml\` + \`bdr/changes/<change-name>/\`.
Commands: bdr:explore, bdr:analyze, bdr:plan, bdr:apply, bdr:archive.
Load the matching bdr-* skill for each command.
</BDR-BOOTSTRAP>`;

export const BdrPlugin = async () => {
  const bdrSkillsDir = path.resolve(__dirname, '../../skills');
  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(bdrSkillsDir)) {
        config.skills.paths.push(bdrSkillsDir);
      }
    },
    'experimental.chat.messages.transform': async (_input, output) => {
      if (!output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser?.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('BDR-BOOTSTRAP'))) return;
      firstUser.parts.unshift({ ...firstUser.parts[0], type: 'text', text: BOOTSTRAP });
    }
  };
};
```

- [ ] **步骤 3：验证 OpenCode 加载**

```bash
bash tests/opencode/test-plugin-loading.sh
```

预期：`PASS: bdr.js loads`

- [ ] **步骤 4：更新 `.opencode/INSTALL.md` 技能列表**

将 `using-bdr` 替换为五 Skill：`bdr-explore-to-change`、`bdr-analyze-change`、`bdr-plan-change`、`bdr-apply-change`、`bdr-archive-change`。

---

### 任务 4：重写 bdr-explore（change 创建、D3、去重）

**Files:**
- Modify: `skills/bdr-explore-to-change/SKILL.md`
- Modify: `commands/bdr-explore.md`

- [ ] **步骤 1：重写 `skills/bdr-explore-to-change/SKILL.md`**

frontmatter:

```yaml
---
name: bdr-explore-to-change
description: bdr:explore — 创建/继续 change，扫描源码产出 badsmells.md
---
```

正文结构（须完整写入）：

1. **工作区解析**
   - 读 `bdr/config.yaml` → `current_change`
   - `{change_dir}` = `bdr/changes/{change_name}/`
   - 无 config 则提示创建 `bdr/config.yaml`（可复制 `templates/bdr-config.yaml.example`）

2. **D3 生命周期**
   - 有 `current_change` 且未传 `[change-name]` → 询问：继续当前 / 新建
   - 继续 → 在 `{change_dir}` 升版 badsmells
   - 新建 → 提议 kebab-case 名 + 用户确认 → 建目录、`.bdr-change.yaml`、更新 config

3. **跨 change 去重（步骤 0）**
   - 扫描 `bdr/changes/*/badsmells.md` 与 `bdr/changes/archive/*/badsmells.md` §2.0
   - 已消除同指纹 → 跳过；未清除跨 change → 警告

4. **扫描与写入** `{change_dir}/badsmells.md`（用 `templates/badsmells-header.md` + entry）

5. **粘贴** `templates/bdr-rules-snippet.md` 全文为「BDR 规约摘要」节

6. **RED FLAGS**（精简 5 条）

- [ ] **步骤 2：更新 `commands/bdr-explore.md`**

```markdown
---
description: 创建或继续 BDR change，扫描坏味道写入 bdr/changes/<name>/badsmells.md
---

Load and follow the **bdr-explore-to-change** skill.

参数：`[path]` 扫描范围（默认 `.`）；`[change-name]` kebab-case 变更名（可选）。

示例：`bdr:explore src/auth refactor-auth-module`
```

---

### 任务 5：重写 bdr-analyze / bdr-plan / bdr-apply

**Files:**
- Modify: `skills/bdr-analyze-change/SKILL.md`
- Modify: `skills/bdr-plan-change/SKILL.md`
- Modify: `skills/bdr-apply-change/SKILL.md`

每个 Skill 须含：
- **工作区解析**（同 explore，读 config → `{change_dir}`；无 current_change → 停止并提示先 explore）
- **阶段行为**（保留 A～F 差分 / plan 门禁 / apply 六步，路径改为 `{change_dir}/`）
- **BDR 规约摘要**（粘贴 snippet）
- **RED FLAGS**

- [ ] **步骤 1：重写 `skills/bdr-analyze-change/SKILL.md`**
- [ ] **步骤 2：重写 `skills/bdr-plan-change/SKILL.md`** — analyze 门禁比较 **同 change** 内 badsmells vs tasks 版本
- [ ] **步骤 3：重写 `skills/bdr-apply-change/SKILL.md`** — 读写 `{change_dir}/tasks.md`；回写 `{change_dir}/badsmells.md` §2.0

---

### 任务 6：新增 bdr-archive

**Files:**
- Create: `skills/bdr-archive-change/SKILL.md`
- Create: `commands/bdr-archive.md`

- [ ] **步骤 1：创建 `skills/bdr-archive-change/SKILL.md`**

```markdown
---
name: bdr-archive-change
description: bdr:archive — 检查 change 完成度并归档至 bdr/changes/archive/
---

# BDR Archive

## 工作区解析

（同 explore：config → current_change → change_dir）

## 完成度检查

1. 读 `{change_dir}/badsmells.md` §2.0 — 不得有 **未清除** / **部分残余**（除非用户确认豁免）
2. 读 `{change_dir}/tasks.md` §3 — 不得有 `[ ]` 未完成任务

## 用户确认门

若有未完成项 → 列出 BS-ID / B-Txx → **必须** 询问用户是否仍归档。

## 归档动作

```bash
mv bdr/changes/<name> bdr/changes/archive/$(date +%Y-%m-%d)-<name>/
```

更新 `.bdr-change.yaml` status: archived；`bdr/config.yaml` 清空 current_change。

（粘贴 bdr-rules-snippet + RED FLAGS）
```

- [ ] **步骤 2：创建 `commands/bdr-archive.md`**

```markdown
---
description: 归档当前 BDR change 至 bdr/changes/archive/
---

Load and follow the **bdr-archive-change** skill.
```

---

### 任务 7：删除旧文档与配置

**Files:**
- Delete: `docs/prd/`（整个目录）
- Delete: `docs/reference/bdr/`
- Delete: `scripts/sync-reference-docs.sh`
- Delete: `.bdr.yaml`

- [ ] **步骤 1：删除目录与文件**

```bash
rm -rf docs/prd docs/reference
rm -f scripts/sync-reference-docs.sh .bdr.yaml
```

- [ ] **步骤 2：全局 grep 确认无断裂引用**

```bash
rg 'docs/prd|docs/reference/bdr|sync-reference-docs|\.bdr\.yaml|using-bdr' --glob '!docs/design/**' --glob '!openspec/changes/**'
```

预期：仅 README/CHANGELOG 等待更新项；修复所有 runtime 引用。

---

### 任务 8：更新 README 与测试

**Files:**
- Modify: `README.md`
- Modify: `tests/plugin/test-skills-frontmatter.sh`（期望 5 skills）
- Modify: `scripts/validate-plugin.sh`
- Modify: `CHANGELOG.md`

- [ ] **步骤 1：更新 `README.md`**

- 工作区：`bdr/config.yaml` + `bdr/changes/<name>/`
- 五命令 + archive 流程图
- 删除 docs/prd 链接；说明规约内嵌 Skill
- 删除「设计参考」以外的 docs/prd 引用

- [ ] **步骤 2：运行全量测试**

```bash
bash scripts/validate-plugin.sh
```

预期：

```
PASS: frontmatter ok (5 skills)
PASS: workspace keywords in skills
PASS: no legacy paths
ALL TESTS PASSED
VALIDATION PASSED
```

- [ ] **步骤 3：更新 `CHANGELOG.md` 添加 0.2.0 BREAKING 条目**

---

### 任务 9：更新 OpenSpec delta specs 并 sync

**Files:**
- Modify: `openspec/changes/bdr-change-workspace/specs/*/spec.md`
- Modify: `openspec/config.yaml`
- Sync: `openspec/specs/`

- [ ] **步骤 1：更新 delta specs** — 移除 bundle fallback、using-bdr；加入 F1、C1、D3
- [ ] **步骤 2：运行 `/opsx-sync-specs bdr-change-workspace`** 或手动 merge 至 `openspec/specs/`
- [ ] **步骤 3：更新 `openspec/config.yaml` context**

```yaml
context: |
  ...
  - BDR workspace: bdr/config.yaml + bdr/changes/<change-name>/
  - Rules embedded in skills (no docs/prd runtime path)
```

---

### 任务 10：归档 bdr-workflow

**Files:**
- Modify: `openspec/changes/bdr-workflow/tasks.md`

- [ ] **步骤 1：标记 10.6 跳过**

```markdown
- [x] 10.6 Cursor path-install 手动验证 — **跳过**（OpenCode ✓；完整验收见 bdr-change-workspace 8.4）
```

- [ ] **步骤 2：执行 `/opsx-archive bdr-workflow`**

---

### 任务 11：手动验收（8.4）

- [ ] **步骤 1：Cursor path-install**
- [ ] **步骤 2：`bdr:explore . demo-change`** → 确认 `bdr/changes/demo-change/badsmells.md`
- [ ] **步骤 3：`bdr:analyze` → `bdr:plan` → `bdr:apply`**（可 dry-run 或 mock）
- [ ] **步骤 4：`bdr:archive`** → 确认 `bdr/changes/archive/YYYY-MM-DD-demo-change/`
- [ ] **步骤 5：OpenCode 重复上述流程**

---

### 任务 12：归档 bdr-change-workspace

- [ ] **步骤 1：勾选 `openspec/changes/bdr-change-workspace/tasks.md` 全部完成项**
- [ ] **步骤 2：执行 `/opsx-archive bdr-change-workspace`**

---

## 规格覆盖自检

| 设计决策 | 任务 |
|----------|------|
| Big-bang | 全计划 |
| 仅 bdr/config.yaml | 1, 4, 5, 6 |
| F1 规约内嵌 | 1, 4, 5, 6 |
| D3 explore 交互 | 4 |
| 跨 change 去重 | 4 |
| bdr:archive | 6 |
| 删 docs/prd + reference | 7 |
| 删 using-bdr | 3 |
| 归档 bdr-workflow | 10 |
| Phase 2 v1.1 | **不在范围** |

---

## 建议提交顺序（原子 commit）

1. `feat(templates): add bdr workspace templates and rules snippet`
2. `test: add workspace and legacy path skill tests`
3. `refactor(opencode): remove using-bdr bootstrap`
4. `feat(skills): rewrite explore/analyze/plan/apply for change workspace`
5. `feat(skills): add bdr-archive command and skill`
6. `chore: remove docs/prd, reference bundle, and .bdr.yaml`
7. `docs: update README and CHANGELOG for bdr/ workspace`
8. `docs(openspec): sync specs and archive workflow changes`

---

## 执行方式

计划已保存。可选：

1. **Subagent-Driven（推荐）** — 每任务独立 subagent，任务间审查
2. **Inline Execution** — 本会话用 executing-plans 批量执行，设检查点

你选哪种？
