# OpenMole Plugin（Cursor + OpenCode）实现计划

> **面向 Agent 执行者：** 必须配合子技能：推荐使用 superpowers:subagent-driven-development，或使用 superpowers:executing-plans 按任务逐步执行。步骤使用复选框（`- [ ]`）语法跟踪进度。

**目标：** 交付可在 Cursor 与 OpenCode 上安装的 OpenMole Plugin，包含 5 个 Skill 与 4 个 Command，驱动 `docs/prd/` 中定义的坏味道驱动重构（OpenMole）工作流。

**架构：** Skill-first 布局——行为逻辑全部位于 `skills/*/SKILL.md`，Command 为薄包装；Cursor 通过 `.cursor-plugin/plugin.json`、OpenCode 通过 `.opencode/plugins/openmole.js` 注册；共享 `templates/` 与 `docs/reference/openmole/` 提供工件格式；运行时按 `.openmole.yaml` 解析顺序读取 `{docs_root}/`。

**技术栈：** Markdown + YAML frontmatter、JSON 插件清单、Bash 脚本/测试、Node.js ESM（仅内置模块）、零 npm 运行时依赖、MIT 许可证。

**设计规格：** [`docs/design/2026-06-05-openmole-plugin-cursor-opencode-mvp-design.md`](../2026-06-05-openmole-plugin-cursor-opencode-mvp-design.md)

---

## 文件职责一览

| 路径 | 职责 |
|------|------|
| `package.json` | OpenCode 入口（`main`）、版本元数据 |
| `.cursor-plugin/plugin.json` | Cursor Skill/Command 发现 |
| `.opencode/plugins/openmole.js` | OpenCode skills 路径注册 + 引导注入 |
| `.opencode/INSTALL.md` | OpenCode 安装说明 |
| `.openmole.yaml` | 开发期 docs root → `docs/prd` |
| `templates/*.md` | OpenMole 工件骨架模板 |
| `docs/reference/openmole/*` | 从 prd 同步的规约副本，供新项目初始化 |
| `scripts/sync-reference-docs.sh` | 保持 reference 与 prd 同步 |
| `scripts/validate-plugin.sh` | 校验 command → skill 引用一致性 |
| `skills/using-openmole/SKILL.md` | 元 Skill：路由、RED FLAGS |
| `skills/openmole-explore/SKILL.md` | 扫描 → badsmells.md |
| `skills/openmole-verify/SKILL.md` | 差分 A～F → analysis + tasks |
| `skills/openmole-plan/SKILL.md` | 未清除坏味道 → tasks.md |
| `skills/openmole-apply/SKILL.md` | 执行单个 B-Txx 任务 |
| `commands/mole-*.md` | 薄 Command → 委托 Skill |
| `tests/plugin/test-manifests.sh` | 断言 plugin.json 必填字段 |
| `tests/plugin/test-skills-frontmatter.sh` | 断言 SKILL.md frontmatter |
| `tests/opencode/test-plugin-loading.sh` | 断言 openmole.js 可 import |
| `tests/run-tests.sh` | 测试聚合入口 |

---

### 任务 1：项目脚手架

**涉及文件：**
- 新建：`package.json`
- 新建：`.openmole.yaml`
- 新建：`LICENSE`
- 新建：`CHANGELOG.md`

- [ ] **步骤 1：创建 `package.json`**

```json
{
  "name": "openmole",
  "version": "0.1.0",
  "description": "Bad smell Driven Refactoring — Agent skill plugin",
  "type": "module",
  "main": ".opencode/plugins/openmole.js",
  "license": "MIT",
  "keywords": ["openmole", "refactoring", "skills", "agent"]
}
```

- [ ] **步骤 2：创建 `.openmole.yaml`**

```yaml
# 本仓库 OpenMole 文档根目录（开发期）。
# 生产项目应使用 docs/openmole/（见 constitution §2.1）。
docs_root: docs/prd
```

- [ ] **步骤 3：创建 `LICENSE`（MIT）**

使用标准 MIT 许可证全文，版权年份 2026，项目名 "OpenMole"。

- [ ] **步骤 4：创建 `CHANGELOG.md`**

```markdown
# Changelog

## 0.1.0 — 2026-06-05

- 初版 MVP：Cursor + OpenCode 插件，5 个 Skill，4 个 Command。
```

- [ ] **步骤 5：验证 JSON 可解析**

运行：`node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('ok')"`
预期输出：`ok`

---

### 任务 2：测试基础设施 — manifest 测试（TDD）

**涉及文件：**
- 新建：`tests/plugin/test-manifests.sh`
- 新建：`tests/run-tests.sh`
- 新建：`.cursor-plugin/plugin.json`（最小 stub，用于通过测试）

- [ ] **步骤 1：编写失败的 manifest 测试**

创建 `tests/plugin/test-manifests.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="$ROOT/.cursor-plugin/plugin.json"

[[ -f "$MANIFEST" ]] || { echo "FAIL: missing $MANIFEST"; exit 1; }

node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('$MANIFEST', 'utf8'));
const required = ['name', 'displayName', 'skills', 'commands'];
for (const k of required) {
  if (!m[k]) { console.error('FAIL: missing field', k); process.exit(1); }
}
if (m.name !== 'openmole') { console.error('FAIL: name must be openmole'); process.exit(1); }
console.log('PASS: manifest fields ok');
"
```

运行：`chmod +x tests/plugin/test-manifests.sh && bash tests/plugin/test-manifests.sh`
预期：**失败** — manifest 文件不存在

- [ ] **步骤 2：创建最小 `.cursor-plugin/plugin.json`**

```json
{
  "name": "openmole",
  "displayName": "OpenMole — Bad smell Driven Refactoring",
  "description": "Bad smell Driven Refactoring workflow for coding agents",
  "version": "0.1.0",
  "license": "MIT",
  "keywords": ["openmole", "refactoring", "bad-smells"],
  "skills": "./skills/",
  "commands": "./commands/"
}
```

- [ ] **步骤 3：重新运行 manifest 测试**

运行：`bash tests/plugin/test-manifests.sh`
预期输出：`PASS: manifest fields ok`

- [ ] **步骤 4：创建测试聚合脚本**

创建 `tests/run-tests.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
for t in tests/plugin/*.sh tests/opencode/*.sh; do
  [[ -f "$t" ]] || continue
  echo "==> $t"
  bash "$t"
done
echo "ALL TESTS PASSED"
```

运行：`chmod +x tests/run-tests.sh && bash tests/run-tests.sh`
预期输出：`ALL TESTS PASSED`

---

### 任务 3：工件模板

**涉及文件：**
- 新建：`templates/badsmells-header.md`
- 新建：`templates/badsmells-entry.md`
- 新建：`templates/tasks-header.md`
- 新建：`templates/tasks-entry.md`
- 新建：`templates/analysis-header.md`
- 新建：`templates/revision-history.md`
- 新建：`templates/.openmole.yaml.example`

- [ ] **步骤 1：创建 `templates/badsmells-header.md`**

```markdown
# 坏味道规约文档（OpenMole Bad Smells）

**版本**：0.1.0
**状态**：草案
**依据**：[constitution.md](./constitution.md)、[specification.md](./specification.md)
**修订日期**：{{DATE}}

| 项目 | 说明 |
|------|------|
| **文档定位** | OpenMole 坏味道环节正式规约载体 |
| **统计范围** | {{SCAN_SCOPE}} |
| **关联任务** | 见 [tasks.md](./tasks.md) |

---

## 1. 说明

- 条目格式见 [specification.md](./specification.md) §4。
- 升版时填写修订历史「提交版本」（specification §7）。

---

## 2. 坏味道条目

### 2.0 索引与消除状态

| BS-ID | 状态 | 说明 |
|-------|------|------|
```

- [ ] **步骤 2：创建 `templates/badsmells-entry.md`**

```markdown
### {{BS-ID}} — {{TITLE}}

| 字段 | 内容 |
|------|------|
| **位置** | {{LOCATION}} |
| **描述** | {{DESCRIPTION}}（Fowler: {{FOWLER_LABEL}}） |
| **对齐原则** | 宪法 §3 — {{PRINCIPLE}} |
| **消除标准（验收）** | {{ACCEPTANCE}} |
| **风险与约束** | {{RISKS}} |
```

- [ ] **步骤 3：创建 `templates/tasks-header.md`**

从 `docs/prd/tasks.md` 第 9～35 行 **逐字复制** §1 执行约定与 §2 任务模板，将 backlog 区替换为：

```markdown
---

## 3. 任务 backlog

（由 mole:plan 生成）
```

- [ ] **步骤 4：创建 `templates/tasks-entry.md`**

```markdown
- [ ] **B-T{{NN}}.** {{TITLE}}（消除 {{BS-ID}}：{{SUMMARY}}）
  - **依赖**：{{DEPS}}。
  - **坏味道**：`badsmells.md` §2 / `{{BS-ID}}`。
  - **涉及路径**：`{{PATHS}}`
  - **步骤**：① 补测 / ② 测绿 / ③ 重构 / ④ 测绿 / ⑤ 用户确认。
  - **完成定义（DoD）**：{{DOD}}
  - **SDD 联动**：{{SDD}}
```

- [ ] **步骤 5：创建 `templates/analysis-header.md`**

从 `docs/prd/analysis.md` 第 9～36 行复制 §1 目的与 §2 差分步骤 A～F 表格，并追加空 §2.1：

```markdown
### 2.1 最近一次差分记录

（由 mole:verify 填写）
```

- [ ] **步骤 6：创建 `templates/revision-history.md`**

```markdown
## 修订历史

| 版本 | 日期 | 提交版本 | 摘要 |
|------|------|----------|------|
| 0.1.0 | {{DATE}} | — | 初版。 |
```

- [ ] **步骤 7：创建 `templates/.openmole.yaml.example`**

```yaml
# 复制到项目根目录并重命名为 .openmole.yaml
docs_root: docs/openmole
```

---

### 任务 4：参考规约同步

**涉及文件：**
- 新建：`scripts/sync-reference-docs.sh`
- 新建：`docs/reference/openmole/`（通过同步脚本生成）

- [ ] **步骤 1：编写同步脚本**

创建 `scripts/sync-reference-docs.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/docs/prd"
DEST="$ROOT/docs/reference/openmole"
mkdir -p "$DEST"
for f in constitution.md specification.md badsmells.md tasks.md analysis.md README.md; do
  cp "$SRC/$f" "$DEST/$f"
done
echo "Synced docs/prd → docs/reference/openmole"
```

运行：`chmod +x scripts/sync-reference-docs.sh && bash scripts/sync-reference-docs.sh`
预期输出：`Synced docs/prd → docs/reference/openmole`，且 `docs/reference/openmole/` 下有 6 个文件

- [ ] **步骤 2：验证 reference 文件存在**

运行：`ls docs/reference/openmole/constitution.md docs/reference/openmole/specification.md`
预期：两个文件均列出

---

### 任务 5：OpenCode 插件

**涉及文件：**
- 新建：`.opencode/plugins/openmole.js`
- 新建：`.opencode/INSTALL.md`
- 新建：`tests/opencode/test-plugin-loading.sh`

- [ ] **步骤 1：编写失败的 OpenCode 加载测试**

创建 `tests/opencode/test-plugin-loading.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node -e "
import('$ROOT/.opencode/plugins/openmole.js').then(m => {
  if (typeof m.OpenMolePlugin !== 'function') throw new Error('OpenMolePlugin export missing');
  console.log('PASS: openmole.js loads');
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
```

运行：`chmod +x tests/opencode/test-plugin-loading.sh && bash tests/opencode/test-plugin-loading.sh`
预期：**失败** — 模块不存在

- [ ] **步骤 2：实现 `.opencode/plugins/openmole.js`**

```javascript
/**
 * OpenMole plugin for OpenCode.ai
 * Registers skills path and injects using-openmole bootstrap on first user message.
 */
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const extractBody = (content) => {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
};

export const OpenMolePlugin = async () => {
  const openMoleSkillsDir = path.resolve(__dirname, '../../skills');

  const getBootstrap = () => {
    const skillPath = path.join(openMoleSkillsDir, 'using-openmole', 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;
    const body = extractBody(fs.readFileSync(skillPath, 'utf8'));
    return `<OPENMOLE-BOOTSTRAP>
You have OpenMole (Bad smell Driven Refactoring) installed.

${body}

**OpenCode tool mapping:** Skill tool → native \`skill\` tool; Read/Write/Edit/Bash → native equivalents.
</OPENMOLE-BOOTSTRAP>`;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(openMoleSkillsDir)) {
        config.skills.paths.push(openMoleSkillsDir);
      }
    },
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrap();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser?.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('OPENMOLE-BOOTSTRAP'))) return;
      firstUser.parts.unshift({ ...firstUser.parts[0], type: 'text', text: bootstrap });
    }
  };
};
```

- [ ] **步骤 3：重新运行 OpenCode 加载测试**

运行：`bash tests/opencode/test-plugin-loading.sh`
预期：**失败**（`using-openmole/SKILL.md` 尚不存在）或 **通过**（若 Task 6 已完成）

说明：测试仅检查 `OpenMolePlugin` 导出；若仍失败，先在任务 6 创建 stub skill。

- [ ] **步骤 4：创建 `.opencode/INSTALL.md`**

```markdown
# 在 OpenCode 上安装 OpenMole

## 前置条件

- 已安装 [OpenCode.ai](https://opencode.ai)
- Node.js 18+

## 本地 path 安装（开发）

在 `opencode.json` 中添加：

```json
{
  "plugin": ["/absolute/path/to/openmole/.opencode/plugins/openmole.js"]
}
```

或 clone 本仓库并引用其绝对路径。

## 验证

1. 重启 OpenCode
2. 使用 `skill` 工具列出 skills → 应看到 `using-openmole`、`openmole-explore` 等
3. 输入："Run mole:explore on this project"

## 故障排查

- **插件未加载：** 运行 `node .opencode/plugins/openmole.js`，应正常退出（exit 0）
- **Skills 缺失：** 确认插件根目录下存在 `skills/` 目录
```

---

### 任务 6：元 Skill — `using-openmole`

**涉及文件：**
- 新建：`skills/using-openmole/SKILL.md`

- [ ] **步骤 1：创建 skill 目录**

运行：`mkdir -p skills/using-openmole`

- [ ] **步骤 2：编写 `skills/using-openmole/SKILL.md`**

```markdown
---
name: using-openmole
description: Use before any OpenMole workflow — routes explore/analyze/plan/apply and resolves docs root
---

# Using OpenMole

## When to Use

Invoke this skill when the user mentions OpenMole, bad smells, refactoring workflow, or any `openmole:*` command.

## Docs Root Resolution (in order)

1. Project `.openmole.yaml` → `docs_root`
2. Environment `OPENMOLE_DOCS_ROOT`
3. `docs/openmole/constitution.md`
4. `docs/prd/constitution.md` (development fallback)
5. If none: instruct copying from plugin `docs/reference/openmole/`

## Workflow Routing

| User intent | Skill to load |
|-------------|---------------|
| Scan / identify smells | `openmole-explore` |
| badsmells changed, sync tasks | `openmole-verify` |
| Create/update tasks | `openmole-plan` |
| Execute refactoring | `openmole-apply` |
| Ambiguous "refactor" | Check artifact state: no badsmells → explore; stale tasks → analyze; open tasks → apply |

## Standard Sequence

explore → (user review) → analyze (if badsmells changed) → plan → (user review) → apply → (user confirm per task)

## RED FLAGS — STOP immediately

- Skipping tests before refactor (constitution §4)
- Marking tasks `[x]` without user confirmation
- plan/apply when badsmells version > tasks 依据 version without analyze
- Tasks not traceable to a BS-ID in badsmells.md
- Changing production code on `[SDD]` items without SDD approval
- Inventing bad smells not backed by code evidence

## Authority Chain

constitution.md > specification.md > badsmells.md > tasks.md / analysis.md
```

- [ ] **步骤 3：重新运行 OpenCode 加载测试**

运行：`bash tests/opencode/test-plugin-loading.sh`
预期输出：`PASS: openmole.js loads`

---

### 任务 7：Skill frontmatter 测试（TDD）

**涉及文件：**
- 新建：`tests/plugin/test-skills-frontmatter.sh`
- 修改：所有已创建的 `skills/*/SKILL.md`

- [ ] **步骤 1：编写 frontmatter 测试**

创建 `tests/plugin/test-skills-frontmatter.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
shopt -s nullglob
files=("$ROOT"/skills/*/SKILL.md)
[[ ${#files[@]} -gt 0 ]] || { echo "FAIL: no SKILL.md files"; exit 1; }
for f in "${files[@]}"; do
  grep -q '^name:' "$f" || { echo "FAIL: missing name in $f"; exit 1; }
  grep -q '^description:' "$f" || { echo "FAIL: missing description in $f"; exit 1; }
done
echo "PASS: frontmatter ok (${#files[@]} skills)"
```

运行：`chmod +x tests/plugin/test-skills-frontmatter.sh && bash tests/plugin/test-skills-frontmatter.sh`
预期：**通过**（1 个 skill）或 **失败**（仅 using-openmole 存在时）—— 任务 8～11 完成后应通过

---

### 任务 8：`openmole-explore` Skill + Command

**涉及文件：**
- 新建：`skills/openmole-explore/SKILL.md`
- 新建：`commands/mole-explore.md`

- [ ] **步骤 1：创建 `skills/openmole-explore/SKILL.md`**

Frontmatter：
```yaml
---
name: openmole-explore
description: Use for mole:explore — scan source code and produce badsmells.md per specification §4
---
```

正文须包含：
1. 读取 `{docs_root}/constitution.md` §3 与 `{docs_root}/specification.md` §3～§4
2. 扫描目标路径（默认 `.`）；检测语言；应用 Fowler 坏味道标签
3. BS-ID 格式：`BS-<CATEGORY>-<NNN>`（CLARITY、CONSIST、REUSE、ROBUST、SEC、SIMPLE）
4. 写入/更新 `{docs_root}/badsmells.md`：元信息、§2.0 索引（未清除/部分残余/已消除）、条目表格
5. 自检清单：§4 七项必填字段、§7 修订历史「提交版本」
6. 语言附录：Python（pytest/mock）、Java（JUnit/Mockito）—— 仅扫描指引，不引入插件依赖

- [ ] **步骤 2：创建 `commands/mole-explore.md`**

```markdown
---
description: Scan source for bad smells and update badsmells.md (OpenMole explore phase)
---

Load and follow the **openmole-explore** skill.

Optional argument: target path (default project root).

Example: `mole:explore src/`
```

---

### 任务 9：`openmole-verify` Skill + Command

**涉及文件：**
- 新建：`skills/openmole-verify/SKILL.md`
- 新建：`commands/mole-verify.md`

- [ ] **步骤 1：创建 `skills/openmole-verify/SKILL.md`**

Frontmatter：`name: openmole-verify`，`description` 说明 analyze 阶段 — badsmells 与 tasks 差分。

正文须实现 `analysis.md` §2 步骤 A～F：
- A：列出 badsmells 全部 BS-ID
- B：列出 tasks 引用的 BS-ID
- C：新增条目 → 增补任务
- D：删除条目 → 移除孤儿任务
- E：验收标准变更 → 更新 DoD
- F：摘要写入 analysis §2.1 + 修订历史

包含 `docs/prd/analysis.md` §3 三角检查清单。

RED FLAG：差分未完成时不得进入 plan/apply。

- [ ] **步骤 2：创建 `commands/mole-verify.md`**

```markdown
---
description: Diff badsmells.md against tasks.md and sync (OpenMole analyze phase)
---

Load and follow the **openmole-verify** skill.
```

---

### 任务 10：`openmole-plan` Skill + Command

**涉及文件：**
- 新建：`skills/openmole-plan/SKILL.md`
- 新建：`commands/mole-plan.md`

- [ ] **步骤 1：创建 `skills/openmole-plan/SKILL.md`**

Frontmatter：`name: openmole-plan`。

正文须包含：
1. 门禁：若 badsmells 版本 > tasks 依据版本，拒绝执行并要求先 analyze
2. 选取 §2.0 中 **未清除** 或 **部分残余** 条目
3. 按 `templates/tasks-entry.md` 字段生成 `B-Txx`
4. 保留 `templates/tasks-header.md` 中的 tasks.md §1
5. 每任务步骤：①补测 ②测绿 ③重构 ④测绿 ⑤用户确认
6. 可选：覆盖率基线备注（pytest --cov / jacoco）

- [ ] **步骤 2：创建 `commands/mole-plan.md`**

```markdown
---
description: Create refactoring tasks from uncleared bad smells (OpenMole plan phase)
---

Load and follow the **openmole-plan** skill.
```

---

### 任务 11：`openmole-apply` Skill + Command

**涉及文件：**
- 新建：`skills/openmole-apply/SKILL.md`
- 新建：`commands/mole-apply.md`

- [ ] **步骤 1：创建 `skills/openmole-apply/SKILL.md`**

Frontmatter：`name: openmole-apply`。

正文须包含：
1. 选取下一个未勾选且依赖已满足的 `B-Txx`
2. 执行 ①～④ 并展示测试输出；测试未绿则阻塞
3. 在 ⑤ 暂停等待用户确认——未确认不得 `[x]`
4. 确认后：更新 tasks 复选框 + badsmells §2.0 状态
5. SDD 门禁：若 **SDD 联动** 为「是」，阻塞步骤 ③
6. 发现新坏味道 → 停止，回流 explore → analyze → plan
7. 每次 invocation 仅处理一个任务（constitution §5）

- [ ] **步骤 2：创建 `commands/mole-apply.md`**

```markdown
---
description: Execute the next pending OpenMole refactoring task (OpenMole apply phase)
---

Load and follow the **openmole-apply** skill.
```

- [ ] **步骤 3：运行全部自动化测试**

运行：`bash tests/run-tests.sh`
预期输出：`PASS: frontmatter ok (5 skills)` 与 `ALL TESTS PASSED`

---

### 任务 12：校验脚本

**涉及文件：**
- 新建：`scripts/validate-plugin.sh`

- [ ] **步骤 1：实现校验器**

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "Running plugin tests..."
bash tests/run-tests.sh
echo "Checking commands reference existing skills..."
for cmd in commands/mole-*.md; do
  skill=$(basename "$cmd" .md | sed 's/openmole-/openmole-/')
  # 每个 command 正文须引用对应 skill 名
  grep -q "$skill" "$cmd" || { echo "FAIL: $cmd missing skill ref"; exit 1; }
done
echo "VALIDATION PASSED"
```

运行：`chmod +x scripts/validate-plugin.sh && bash scripts/validate-plugin.sh`
预期输出：`VALIDATION PASSED`

---

### 任务 13：README 与手动验收清单

**涉及文件：**
- 修改：`README.md`

- [ ] **步骤 1：更新 `README.md` 安装章节**

将占位「安装」章节替换为：

```markdown
## 安装

### Cursor（本地 path install）

1. Clone 本仓库
2. 在 Cursor Agent 对话中：从本地路径安装插件（指向仓库根目录）
3. 验证 Skills：`using-openmole`、`openmole-explore`、`openmole-verify`、`openmole-plan`、`openmole-apply`
4. 验证 Commands：`mole:explore`、`mole:verify`、`mole:plan`、`mole:apply`

### OpenCode

见 [.opencode/INSTALL.md](.opencode/INSTALL.md)。

## 开发验证

```bash
bash scripts/validate-plugin.sh
```

手动验收清单：
- [ ] `mole:explore .` 更新 badsmells 格式正确
- [ ] badsmells 升版后 `mole:verify` 同步 tasks
- [ ] `mole:plan` 从 §2.0 开放条目生成 B-Txx
- [ ] `mole:apply` 执行单任务并等待用户确认
```

- [ ] **步骤 2：最终校验**

运行：`bash scripts/validate-plugin.sh`
预期输出：`VALIDATION PASSED`

---

## 规格覆盖自检

| 规格要求 | 对应任务 |
|----------|----------|
| Cursor 插件 manifest | 任务 2 |
| OpenCode openmole.js | 任务 5 |
| 5 个 Skill | 任务 6、8～11 |
| 4 个 Command | 任务 8～11 |
| 工件模板 | 任务 3 |
| docs/reference/openmole 同步 | 任务 4 |
| .openmole.yaml 开发配置 | 任务 1 |
| Shell 测试 | 任务 2、5、7、11 |
| validate-plugin.sh | 任务 12 |
| README 安装说明 | 任务 13 |
| analyze A～F 门禁 | 任务 9 |
| apply 用户确认门 | 任务 11 |
| 零 npm 依赖 | 任务 1、5 |

**v1.1 延后：** hooks、code-reviewer、Claude/Codex/Gemini 清单、增量 explore。

---

## 实现后手动验收

1. Cursor path-install → 运行四个 Command
2. OpenCode 本地安装 → 重复上述流程
3. 确认 `.openmole.yaml` 正确解析到 `docs/prd`
4. 在 `openspec/changes/openmole-workflow/tasks.md` 勾选已完成项

---

## 执行方式

计划完成后，可选：

1. **Subagent-Driven（推荐）** — 每个任务派独立 subagent，任务间审查
2. **Inline Execution** — 本会话使用 executing-plans 批量执行，设检查点
