---
name: openmole-explore
description: mole-explore — 创建/继续 change，扫描源码产出 badsmells.md
---

# OpenMole Explore — 识别坏味道

> **路径解析说明**：
> - `{cwd}` = 用户运行 mole 命令时的当前工作目录（目标项目根目录）
> - `{config_dir}` = OpenMole 用户级配置目录（`~/.config/openmole/`，遵守 XDG Base Directory 规范）
> - 项目级文件（`config.yaml`、`changes/`）位于 `{cwd}/openmole/`
> - 共享资源（`templates/`）位于 `{config_dir}/`

## 何时使用

用户运行 `mole-explore` 或需要识别/更新坏味道清单时。可选指定级别：`mole-explore arch` / `mole-explore design` / `mole-explore impl`。

## 工作区解析

1. 读取 `{cwd}/openmole/config.yaml` → `current_change`
2. `{change_dir}` = `{cwd}/openmole/changes/{change_name}/`
3. 无 `{cwd}/openmole/config.yaml` → 提示从 `{config_dir}/templates/openmole-config.yaml.example` 创建（模板解析见 §模板解析）

## D3 生命周期

| 条件 | 行为 |
|------|------|
| 无 `current_change` | 新建 change；名称由 `[change-name]` 指定或 Agent 提议 + **用户确认** |
| 有 active change 且未传 `[change-name]` | **询问**：继续当前（升版 badsmells）/ 新建 change |
| 显式 `[change-name]` | 目录不存在则创建；存在则在该 change 内升版 |

新建 change 时：

1. 创建 `{cwd}/openmole/changes/<name>/`、`{cwd}/openmole/changes/<name>/.openmole-change.yaml`（参考 `{config_dir}/templates/openmole-change.yaml`）
2. 更新 `{cwd}/openmole/config.yaml` 的 `current_change`

## 级别选择

| 条件 | 行为 |
|------|------|
| 显式指定级别（`mole-explore arch`） | 锁定为 ARCH |
| 隐式 | 使用 `.openmole-change.yaml` 的 `default_level`；若未设置则询问用户 |
| 同一 change 内跨级别 | 创建子目录 `arch/`、`design/`、`impl/`，互不覆盖 |

子目录结构：

```
{change_dir}/
├── arch/   (badsmells.md + tasks.md + analysis.md)
├── design/ (badsmells.md + tasks.md + analysis.md)
└── impl/   (badsmells.md + tasks.md + analysis.md)
```

## 跨 change 去重（步骤 0）

1. 扫描 `{cwd}/openmole/changes/*/badsmells.md` 与 `{cwd}/openmole/changes/archive/*/badsmells.md` §2.0
2. 构建 BS-ID 与指纹 `(规范化路径, 级别, 坏味道标签)`
3. 已消除同指纹 → **跳过**，注明原 change
4. 未清除/部分残余于其他 change → **警告**，不得静默重复

## 扫描流程

1. **确定范围**：`[path]` 默认 `.`
2. **检测语言**：通过文件扩展名、配置文件（`pom.xml`/`Cargo.toml`/`package.json`）、依赖分析自动识别。识别结果写入 `.openmole-change.yaml` 的 `detected_languages`
3. **按级别识别坏味道**：
   - ARCH：扫描模块化、耦合、内聚、层次、边界、演进问题
   - DESIGN：扫描封装、继承、模块化、冗余问题（Fowler 主 + PHAME 补）
   - IMPL：加载 **IMPL-COMMON**（通用） + **IMPL-LANG**（语言特定，激活匹配语言的条目）
4. **分配 BS-ID**：`<LEVEL>-<CATEGORY>-<NNN>`
5. **写入** `{change_dir}/{level}/badsmells.md`

## 语言侦测规则

| 特征 | 判定语言 |
|------|---------|
| `*.scala` / `build.sbt` | Scala |
| `*.py` / `setup.py` / `pyproject.toml` | Python |
| `*.ts` / `tsconfig.json` | TypeScript |
| `*.rs` / `Cargo.toml` | Rust |
| `*.rb` / `Gemfile` | Ruby |
| `*.java` / `pom.xml` / `build.gradle` | Java |
| `*.cpp` / `CMakeLists.txt` | C++ |
| `*.go` / `go.mod` | Go |
| 多语言项目 | 激活所有对应语言特定坏味道集 |

## 输出格式

- 使用 `{config_dir}/templates/badsmells-header.md` + `badsmells-entry.md`（模板解析见 §模板解析）
- §2.0 索引含 **类别** 列；七字段表格含 **级别**；升版时 `git rev-parse HEAD` 填提交版本
- 静态参考：`{config_dir}/templates/badsmells-catalog.md`（全级别坏味道全集）

## 语言附录

**Python**：pytest、unittest.mock
**Java**：JUnit、Mockito
**TypeScript**：jest/vitest
**Scala**：scalatest、mockito-scala
**Rust**：cargo test
**Go**：go test

## 模板解析

`{config_dir}/templates/` 下的模板按以下顺序解析：

1. **用户级模板**：`{config_dir}/templates/`（`openmole init` / `openmole update` 时自动从安装包复制至用户配置目录）
2. **安装包级模板**：OpenMole 安装目录下的 `templates/`（通过 `OPENMOLE_HOME` 环境变量或从 `node_modules/openmole/` 向上查找）

模板是跨项目共享资源，仅存于用户级配置目录（`~/.config/openmole/templates/`），不复制到目标项目内。

## OpenMole 规约摘要（内嵌于各 Skill，非独立文件）

### constitution §2 — 三级坏味道

| 级别 | ID前缀 | 范围 |
|------|--------|------|
| 架构级 | ARCH | 模块化、耦合、内聚、层次、边界、演进 |
| 设计级 | DESIGN | 封装、继承、模块化、冗余 |
| 实现级 | IMPL | 函数、命名、参数、注释、语言惯用法 |

### constitution §3 — 八项第一性原则

清晰性、一致性、可读性、复用性、可扩展性、健壮性、安全性、简洁性。

### constitution §3a — 安全原则（写操作门禁）

> 所有写操作（文档/代码的新建、修改、删除）必须由 AI 生成操作范围与变更 diff，展示给用户并获得明确确认后方可执行。**该门禁不可豁免。**

### constitution §4 — 标准重构步骤（级别特定）

**IMPL（6 步）**：① 确认坏味道 / ② 补测 / ③ 测绿 / ④ 应用重构手法（语言感知）/ ⑤ 回归测绿 / ⑥ **用户确认**（写操作门禁）

**DESIGN（7 步）**：① 确认坏味道 / ② 识别接缝（Feathers）/ ③ 测试安全网 / ④ 解依赖 / ⑤ 应用重构 / ⑥ 回归测绿 / ⑦ **用户确认**（写操作门禁）

**ARCH（8 步）**：① 确认坏味道 / ② 影响分析 / ③ 测试安全网 / ④ 选择架构模式 / ⑤ 迁移计划（可豁免）/ ⑥ 增量执行 / ⑦ 回归测绿 / ⑧ **用户确认**（写操作门禁）

### constitution §5 — 执行粒度

每次 `mole-apply` 仅处理一个未完成任务。

### specification §4 — badsmells 条目

**级别** + 六字段 + §2.0 状态：**未清除** / **已消除** / **部分残余**。

### specification §7 — 修订历史

升版时 **提交版本** = `git rev-parse HEAD`，未提交填 `—`。

## 完成后建议

探索完成后，建议继续执行 `mole-plan` 进行任务分解。

## RED FLAGS

- 跳过测绿直接重构
- 无代码证据编造坏味道
- 跨 change 静默重复同一坏味道
- `[SDD]` 标记项未获批准即改生产代码
- 未侦测语言直接套用通用 IMPL 坏味道
- 写操作未展示 diff 即执行
