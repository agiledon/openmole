> **策略**：Big-bang（brainstorming 2026-06-05 批准）。实现完成后归档 `openmole-workflow`。

## 0. 归档 openmole-workflow

- [x] 0.1 更新 `openmole-workflow/tasks.md`：10.6 标记跳过（OpenCode ✓）；v1.1 指向 Phase 2
- [x] 0.2 `/opsx-archive openmole-workflow`（sync specs 若尚未完成则先 sync）

## 1. 删除旧文档与配置

- [x] 1.1 删除 `docs/prd/` 整个目录
- [x] 1.2 删除 `docs/reference/openmole/` 整个目录
- [x] 1.3 删除 `scripts/sync-reference-docs.sh`
- [x] 1.4 删除根目录 `.openmole.yaml`
- [x] 1.5 更新 README：移除 docs/prd 引用；说明 Skill 内嵌规约

## 2. openmole/ 工作区

- [x] 2.1 新增 `templates/openmole-config.yaml.example`（current_change）
- [x] 2.2 新增 `templates/openmole-change.yaml`（name, created, scan_scope, status）
- [x] 2.3 删除 `templates/.openmole.yaml.example`
- [x] 2.4 五 Skill 统一「工作区解析」：`openmole/config.yaml` → `{change_dir}`

## 3. 移除 using-openmole

- [x] 3.1 删除 `skills/using-openmole/`
- [x] 3.2 更新 `.opencode/plugins/openmole.js`：短 bootstrap，不读文件
- [x] 3.3 更新 INSTALL / README 技能列表

## 4. Skill 内嵌规约（F1）

- [x] 4.1 定义共享「OpenMole 规约摘要」块（constitution §3–§5、spec §4/§7）
- [x] 4.2 写入 mole-explore / analyze / plan / apply / archive 五 Skill
- [x] 4.3 各 Skill 保留精简 RED FLAGS

## 5. mole-explore

- [x] 5.1 D3：有 active change 时询问继续/新建
- [x] 5.2 新建 change 目录 + `.openmole-change.yaml` + 更新 config.yaml
- [x] 5.3 跨 change 去重（changes/ + archive/ §2.0）
- [x] 5.4 输出 `{change_dir}/badsmells.md`
- [x] 5.5 更新 `commands/mole-explore.md`：`[path] [change-name]`

## 6. analyze / plan / apply

- [x] 6.1 更新三 Skill：读写 `{change_dir}/` exclusively
- [x] 6.2 plan analyze 门禁限定同 change

## 7. mole-archive（新增）

- [x] 7.1 `skills/openmole-archive/SKILL.md`
- [x] 7.2 `commands/mole-archive.md`
- [x] 7.3 完成度检查 + 用户确认 + mv 至 archive/

## 8. 测试与验收

- [x] 8.1 更新 test-skills-frontmatter（5 skills，无 using-openmole）
- [x] 8.2 更新 validate-plugin.sh（含 mole-archive）
- [x] 8.3 删除/替换 reference bundle 相关测试
- [x] 8.4 **7.5 验收**：Cursor + OpenCode path-install 全链路（explore→archive）
  - [x] OpenCode ✓（2026-06-05）
  - [x] Cursor — **跳过**（Phase 2 或后续补验）

## 9. OpenSpec

- [x] 9.1 更新 delta specs（F1 移除 bundle、C1 config、D3 explore）
- [x] 9.2 sync → `openspec/specs/`；更新 config.yaml context
- [x] 9.3 归档本 change

## Phase 2（不在此次实现）

- Claude/Codex/Gemini 清单、hooks、code-reviewer、version-bump、AGENTS/CLAUDE/GEMINI
