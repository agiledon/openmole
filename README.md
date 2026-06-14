# OpenMole — AI-driven Refactoring

![OpenMole Logo](docs/images/openmole-logo.jpg)

**Version 0.7.0** · CLI: `openmole init` · `openmole update`

> **npm 官方包名 / npm package name:** [`openmole`](https://www.npmjs.com/package/openmole)  
> 安装：`npm install -g openmole` · CLI 命令已更名 **`openmole`**

[English](#english) · [中文](#中文)

---

<a id="english"></a>

## English

> **npm official package name:** [`openmole`](https://www.npmjs.com/package/openmole) — install with `npm install -g openmole`. The CLI command is **`openmole`**.

OpenMole is a refactoring methodology and agent plugin framework driven by code bad smells. Rules live in phase skills; project artifacts live under `openmole/changes/<change-name>/`.

### Commands & Skills

| Command (IDE slash / protocol) | Skill | Phase |
|--------------------------------|-------|-------|
| `/mole-explore` · `mole:explore` | `mole-explore-to-change` | Create/continue change; identify bad smells |
| `/mole-plan` · `mole:plan` | `mole-plan-change` | Task breakdown |
| `/mole-verify` · `mole:verify` | `mole-verify-change` | Verify coverage |
| `/mole-apply` · `mole:apply` | `mole-apply-change` | Execute refactoring |
| `/mole-archive` · `mole:archive` | `mole-archive-change` | Archive change |

Main outputs per phase: `badsmells.md`, `tasks.md`, `analysis.md`, and code changes.

### Workspace

```
openmole/
├── config.yaml              # current_change · installed_ides · init_version · init_at
└── changes/
    ├── <change-name>/
    │   ├── badsmells.md
    │   ├── tasks.md
    │   └── analysis.md
    └── archive/
```

### Workflow

```
mole:explore → review badsmells → mole:plan → review tasks → mole:verify → mole:apply → user confirm → mole:archive
```

### Package layout

```
openmole/                         # npm package root
├── bin/openmole.js               # CLI entry
├── cli/                     # init · update · IDE adapters
├── skills/                  # phase skills (mole-*-change)
├── commands/                # IDE commands (mole-*.md)
├── .cursor-plugin/          # Cursor manifest
├── .claude-plugin/          # Claude Code manifest
├── .codex-plugin/           # Codex manifest
├── gemini-extension.json    # Gemini CLI extension
├── .opencode/plugins/openmole.js # OpenCode plugin (zero npm deps at runtime)
└── templates/               # config / gitignore templates
```

### Tech stack

- **Skills / Commands**: Markdown + YAML frontmatter
- **Plugin harnesses**: Cursor, OpenCode, Claude Code, Codex, Gemini CLI, Kiro, Qoder
- **CLI**: Node.js ESM + `@clack/prompts` (CLI only; plugin runtime has no third-party npm deps)
- **License**: MIT

### Installation

**npm registry (recommended)**

```bash
npm install -g openmole
cd /path/to/your-project
openmole init              # welcome screen → interactive IDE selection
```

**Clone + link (development)**

```bash
git clone https://github.com/agiledon/openmole.git
cd openmole && npm install && npm link

cd /path/to/your-project
openmole init
```

**Install CLI from GitHub**

```bash
npm install -g github:agiledon/openmole
cd /path/to/your-project
openmole init
```

> Package name on npm is **`openmole`** (the `openmole` name is taken). The CLI command is **`openmole`**.

After upgrading OpenMole, run `openmole update` in the target project to refresh IDE configs.

#### `openmole init` options

| Flag | Description |
|------|-------------|
| `--ides cursor,opencode,...` | Non-interactive IDE list |
| `--all` | Configure all 7 IDEs |
| `--none` | Workspace only (`openmole/`) |
| `--force` | Overwrite existing workspace / IDE config |
| `--global` | OpenCode user config (`~/.config/opencode/`) |
| `--dry-run` | Print plan only |

`openmole init` will:

1. Create `openmole/config.yaml`, `openmole/changes/`, `openmole/changes/archive/`
2. Install skills/commands per selected IDE (see table)
3. Merge [gitignore snippet](templates/mole-gitignore.snippet) into `.gitignore` (machine-local symlinks)

| IDE | Install model |
|-----|---------------|
| **Cursor** | Project `.cursor/skills/` + `.cursor/commands/`; user symlink `~/.cursor/plugins/local/openmole` |
| **OpenCode** | Project `opencode.json` → `.opencode/plugins/openmole.js` (`--global` → user config) |
| **Claude Code** | User symlink `~/.claude/plugins/local/openmole` |
| **Codex** | Project `plugins/openmole` symlink + `.agents/plugins/marketplace.json` |
| **Gemini CLI** | Project `.gemini/skills/`, `.gemini/commands/`, `.gemini/extensions/openmole` symlink |
| **Kiro** | Project `.kiro/skills/`, `.kiro/commands/` |
| **Qoder** | Project `.qoder/skills/`, `.qoder/commands/` |

**Extend mode**: If `openmole/config.yaml` exists, workspace is preserved; only IDEs missing from `installed_ides` are configured.

#### `openmole update`

Re-install IDE configs listed in `openmole/config.yaml` `installed_ides` (use after upgrading OpenMole):

```bash
openmole update
openmole update /path/to/project
openmole update --dry-run
```

#### Manual install (fallback)

| IDE | Doc |
|-----|-----|
| Cursor | [.cursor/INSTALL.md](.cursor/INSTALL.md) |
| OpenCode | [.opencode/INSTALL.md](.opencode/INSTALL.md) |
| Claude Code | [.claude/INSTALL.md](.claude/INSTALL.md) |
| Codex | [.codex/INSTALL.md](.codex/INSTALL.md) |
| Gemini CLI | [.gemini/INSTALL.md](.gemini/INSTALL.md) |
| Kiro | [.kiro/INSTALL.md](.kiro/INSTALL.md) |
| Qoder | [.qoder/INSTALL.md](.qoder/INSTALL.md) |

### Development

```bash
bash scripts/validate-cli.sh      # full CLI + plugin tests + npm pack check
bash scripts/validate-plugin.sh   # plugin only
bash scripts/npm-pack-check.sh    # tarball content check
npm link && openmole --help
```

**Maintainers**: publish with `npm publish --access public` (package name `openmole`).

### References

- Plugin architecture inspired by [Superpowers](https://github.com/agiledon/superpowers)
- [Change workspace design](docs/design/2026-06-05-mole-change-workspace-design.md)
- [CLI init design](docs/design/2026-06-05-mole-cli-init-design.md)
- [OpenSpec: mole-cli-init (archived)](openspec/changes/archive/2026-06-05-mole-cli-init/proposal.md)

---

<a id="中文"></a>

## 中文

> **OpenMole 框架在 npm 官方包名为 [`openmole`](https://www.npmjs.com/package/openmole)** — 安装：`npm install -g openmole`。CLI 命令已更名 **`openmole`**。

OpenMole（坏味道驱动重构）是一套面向编码 Agent 的软件重构方法论与 Plugin 框架。规约内嵌于各 phase skill；目标项目工件位于 `openmole/changes/<change-name>/`。

**当前版本**：0.7.0（CLI：`openmole init` · `openmole update`）

### 命令与 Skill

| 命令（IDE slash / 协议） | Skill | 阶段 |
|--------------------------|-------|------|
| `/mole-explore` · `mole:explore` | `mole-explore-to-change` | 创建/继续 change，识别坏味道 |
| `/mole-plan` · `mole:plan` | `mole-plan-change` | 任务分解 |
| `/mole-verify` · `mole:verify` | `mole-verify-change` | 覆盖验证 |
| `/mole-apply` · `mole:apply` | `mole-apply-change` | 重构执行 |
| `/mole-archive` · `mole:archive` | `mole-archive-change` | 归档 change |

各阶段主要产出：`badsmells.md`、`tasks.md`、`analysis.md`、代码变更。

### 工作区

```
openmole/
├── config.yaml              # current_change · installed_ides · init_version · init_at
└── changes/
    ├── <change-name>/
    │   ├── badsmells.md
    │   ├── tasks.md
    │   └── analysis.md
    └── archive/
```

### 工作流

```
mole:explore → 审阅 badsmells → mole:plan → 审阅 tasks → mole:verify → mole:apply → 用户确认 → mole:archive
```

### 包结构

```
openmole/                         # npm package root
├── bin/openmole.js               # CLI 入口
├── cli/                     # init · update · IDE adapters
├── skills/                  # phase skills（mole-*-change）
├── commands/                # IDE commands（mole-*.md）
├── .cursor-plugin/          # Cursor manifest
├── .claude-plugin/          # Claude Code manifest
├── .codex-plugin/           # Codex manifest
├── gemini-extension.json    # Gemini CLI extension
├── .opencode/plugins/openmole.js # OpenCode plugin（零 npm 依赖）
└── templates/               # config / gitignore 模板
```

### 技术栈

- **Skill / Command**：Markdown + YAML frontmatter
- **Plugin harness**：Cursor、OpenCode、Claude Code、Codex、Gemini CLI、Kiro、Qoder
- **CLI**：Node.js ESM + `@clack/prompts`（仅 CLI；plugin 运行时零第三方依赖）
- **许可证**：MIT

### 安装

**npm registry（推荐）**

```bash
npm install -g openmole
cd /path/to/your-project
openmole init              # welcome 画面 → 交互式选择 IDE
```

**本仓库开发 / 本地 link**

```bash
git clone https://github.com/agiledon/openmole.git
cd openmole && npm install && npm link

cd /path/to/your-project
openmole init
```

**从 GitHub 安装 CLI**

```bash
npm install -g github:agiledon/openmole
cd /path/to/your-project
openmole init
```

> npm 包名为 **`openmole`**（`openmole` 已被占用）；CLI 命令已更名 **`openmole`**。

升级 OpenMole 后，在目标项目执行 `openmole update` 刷新 IDE 配置。

#### `openmole init` 常用选项

| 选项 | 说明 |
|------|------|
| `--ides cursor,opencode,...` | 非交互指定 IDE |
| `--all` | 配置全部 7 个 IDE |
| `--none` | 仅创建 `openmole/` 工作区 |
| `--force` | 覆盖已有 workspace / IDE 配置 |
| `--global` | OpenCode 写入用户级 `~/.config/opencode/` |
| `--dry-run` | 只打印计划，不写文件 |

`openmole init` 会：

1. 创建 `openmole/config.yaml`、`openmole/changes/`、`openmole/changes/archive/`
2. 按所选 IDE 安装 skill/command（见下表）
3. 合并 [gitignore 片段](templates/mole-gitignore.snippet) 到项目 `.gitignore`（忽略机器相关的 plugin symlink）

| IDE | 安装方式 |
|-----|----------|
| **Cursor** | 项目 `.cursor/skills/` + `.cursor/commands/`；用户级 `~/.cursor/plugins/local/openmole` symlink |
| **OpenCode** | 项目 `opencode.json` 注册 `.opencode/plugins/openmole.js`（`--global` → 用户配置） |
| **Claude Code** | 用户级 `~/.claude/plugins/local/openmole` symlink |
| **Codex** | 项目 `plugins/openmole` symlink + `.agents/plugins/marketplace.json` |
| **Gemini CLI** | 项目 `.gemini/skills/`、`.gemini/commands/`、`.gemini/extensions/openmole` symlink |
| **Kiro** | 项目 `.kiro/skills/`、`.kiro/commands/` |
| **Qoder** | 项目 `.qoder/skills/`、`.qoder/commands/` |

**Extend 模式**：已存在 `openmole/config.yaml` 时保留 workspace，仅为 `installed_ides` 中缺失的 IDE 追加配置。

#### `openmole update`

在已 init 的项目中，按 `openmole/config.yaml` 的 `installed_ides` 重新安装 IDE 配置（升级 OpenMole 包后使用）：

```bash
openmole update              # 当前目录
openmole update /path/to/project
openmole update --dry-run
```

#### 手动安装（fallback）

| IDE | 文档 |
|-----|------|
| Cursor | [.cursor/INSTALL.md](.cursor/INSTALL.md) |
| OpenCode | [.opencode/INSTALL.md](.opencode/INSTALL.md) |
| Claude Code | [.claude/INSTALL.md](.claude/INSTALL.md) |
| Codex | [.codex/INSTALL.md](.codex/INSTALL.md) |
| Gemini CLI | [.gemini/INSTALL.md](.gemini/INSTALL.md) |
| Kiro | [.kiro/INSTALL.md](.kiro/INSTALL.md) |
| Qoder | [.qoder/INSTALL.md](.qoder/INSTALL.md) |

### 开发验证

```bash
bash scripts/validate-cli.sh      # CLI + plugin 全量测试 + npm pack 检查
bash scripts/validate-plugin.sh   # plugin only
bash scripts/npm-pack-check.sh    # 发布前 tarball 内容检查
npm link && openmole --help
```

**维护者**：`npm publish --access public` 发布（包名 `openmole`）。

```bash
bash scripts/npm-pack-check.sh    # 验证 tarball 内容
npm pack                          # 本地预览（可选）
```

### 设计参考

- Plugin 架构参考 [Superpowers](https://github.com/agiledon/superpowers)
- [Change workspace 设计](docs/design/2026-06-05-mole-change-workspace-design.md)
- [CLI init 设计](docs/design/2026-06-05-mole-cli-init-design.md)
- [OpenSpec：mole-cli-init（已归档）](openspec/changes/archive/2026-06-05-mole-cli-init/proposal.md)
