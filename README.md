# BDR — Bad smell Driven Refactoring

**Version 0.4.0** · CLI: `bdr init` · `bdr update`

[English](#english) · [中文](#中文)

---

<a id="english"></a>

## English

BDR is a refactoring methodology and agent plugin framework driven by code bad smells. Rules live in phase skills; project artifacts live under `bdr/changes/<change-name>/`.

### Commands & Skills

| Command (IDE slash / protocol) | Skill | Phase |
|--------------------------------|-------|-------|
| `/bdr-explore` · `bdr:explore` | `bdr-explore-to-change` | Create/continue change; identify bad smells |
| `/bdr-analyze` · `bdr:analyze` | `bdr-analyze-change` | Diff analysis |
| `/bdr-plan` · `bdr:plan` | `bdr-plan-change` | Task breakdown |
| `/bdr-apply` · `bdr:apply` | `bdr-apply-change` | Execute refactoring |
| `/bdr-archive` · `bdr:archive` | `bdr-archive-change` | Archive change |

Main outputs per phase: `badsmells.md`, `analysis.md`, `tasks.md`, and code changes.

### Workspace

```
bdr/
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
bdr:explore → review badsmells → bdr:analyze → bdr:plan → review tasks → bdr:apply → user confirm → bdr:archive
```

### Package layout

```
bdr/                         # npm package root
├── bin/bdr.js               # CLI entry
├── cli/                     # init · update · IDE adapters
├── skills/                  # phase skills (bdr-*-change)
├── commands/                # IDE commands (bdr-*.md)
├── .cursor-plugin/          # Cursor manifest
├── .claude-plugin/          # Claude Code manifest
├── .codex-plugin/           # Codex manifest
├── gemini-extension.json    # Gemini CLI extension
├── .opencode/plugins/bdr.js # OpenCode plugin (zero npm deps at runtime)
└── templates/               # config / gitignore templates
```

### Tech stack

- **Skills / Commands**: Markdown + YAML frontmatter
- **Plugin harnesses**: Cursor, OpenCode, Claude Code, Codex, Gemini CLI
- **CLI**: Node.js ESM + `@clack/prompts` (CLI only; plugin runtime has no third-party npm deps)
- **License**: MIT

### Installation

> **Distribution**: Not published to the npm registry (`bdr` is taken). Use **`npm link`** or **install from GitHub**.

**Recommended: clone + link**

```bash
git clone https://github.com/agiledon/bdr.git
cd bdr && npm install && npm link

cd /path/to/your-project
bdr init              # interactive IDE selection
```

**Install CLI from GitHub (no fixed clone path)**

```bash
npm install -g github:agiledon/bdr
cd /path/to/your-project
bdr init
```

After upgrading BDR, run `bdr update` in the target project to refresh IDE configs.

#### `bdr init` options

| Flag | Description |
|------|-------------|
| `--ides cursor,opencode,...` | Non-interactive IDE list |
| `--all` | Configure all 5 IDEs |
| `--none` | Workspace only (`bdr/`) |
| `--force` | Overwrite existing workspace / IDE config |
| `--global` | OpenCode user config (`~/.config/opencode/`) |
| `--dry-run` | Print plan only |

`bdr init` will:

1. Create `bdr/config.yaml`, `bdr/changes/`, `bdr/changes/archive/`
2. Install skills/commands per selected IDE (see table)
3. Merge [gitignore snippet](templates/bdr-gitignore.snippet) into `.gitignore` (machine-local symlinks)

| IDE | Install model |
|-----|---------------|
| **Cursor** | Project `.cursor/skills/` + `.cursor/commands/`; user symlink `~/.cursor/plugins/local/bdr` |
| **OpenCode** | Project `opencode.json` → `.opencode/plugins/bdr.js` (`--global` → user config) |
| **Claude Code** | User symlink `~/.claude/plugins/local/bdr` |
| **Codex** | Project `plugins/bdr` symlink + `.agents/plugins/marketplace.json` |
| **Gemini CLI** | Project `.gemini/skills/`, `.gemini/commands/`, `.gemini/extensions/bdr` symlink |

**Extend mode**: If `bdr/config.yaml` exists, workspace is preserved; only IDEs missing from `installed_ides` are configured.

#### `bdr update`

Re-install IDE configs listed in `bdr/config.yaml` `installed_ides` (use after upgrading BDR):

```bash
bdr update
bdr update /path/to/project
bdr update --dry-run
```

#### Manual install (fallback)

| IDE | Doc |
|-----|-----|
| Cursor | [.cursor/INSTALL.md](.cursor/INSTALL.md) |
| OpenCode | [.opencode/INSTALL.md](.opencode/INSTALL.md) |
| Claude Code | [.claude/INSTALL.md](.claude/INSTALL.md) |
| Codex | [.codex/INSTALL.md](.codex/INSTALL.md) |
| Gemini CLI | [.gemini/INSTALL.md](.gemini/INSTALL.md) |

### Development

```bash
bash scripts/validate-cli.sh      # full CLI + plugin tests + npm pack check
bash scripts/validate-plugin.sh   # plugin only
bash scripts/npm-pack-check.sh    # tarball content check
npm link && bdr --help
```

**Maintainers**: `package.json` includes `files` / `repository` for future publish; **not** publishing to npm registry for now.

### References

- Plugin architecture inspired by [Superpowers](https://github.com/agiledon/superpowers)
- [Change workspace design](docs/design/2026-06-05-bdr-change-workspace-design.md)
- [CLI init design](docs/design/2026-06-05-bdr-cli-init-design.md)
- [OpenSpec: bdr-cli-init (archived)](openspec/changes/archive/2026-06-05-bdr-cli-init/proposal.md)

---

<a id="中文"></a>

## 中文

BDR（坏味道驱动重构）是一套面向编码 Agent 的软件重构方法论与 Plugin 框架。规约内嵌于各 phase skill；目标项目工件位于 `bdr/changes/<change-name>/`。

**当前版本**：0.4.0（CLI：`bdr init` · `bdr update`）

### 命令与 Skill

| 命令（IDE slash / 协议） | Skill | 阶段 |
|--------------------------|-------|------|
| `/bdr-explore` · `bdr:explore` | `bdr-explore-to-change` | 创建/继续 change，识别坏味道 |
| `/bdr-analyze` · `bdr:analyze` | `bdr-analyze-change` | 差分分析 |
| `/bdr-plan` · `bdr:plan` | `bdr-plan-change` | 任务分解 |
| `/bdr-apply` · `bdr:apply` | `bdr-apply-change` | 重构执行 |
| `/bdr-archive` · `bdr:archive` | `bdr-archive-change` | 归档 change |

各阶段主要产出：`badsmells.md`、`analysis.md`、`tasks.md`、代码变更。

### 工作区

```
bdr/
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
bdr:explore → 审阅 badsmells → bdr:analyze → bdr:plan → 审阅 tasks → bdr:apply → 用户确认 → bdr:archive
```

### 包结构

```
bdr/                         # npm package root
├── bin/bdr.js               # CLI 入口
├── cli/                     # init · update · IDE adapters
├── skills/                  # phase skills（bdr-*-change）
├── commands/                # IDE commands（bdr-*.md）
├── .cursor-plugin/          # Cursor manifest
├── .claude-plugin/          # Claude Code manifest
├── .codex-plugin/           # Codex manifest
├── gemini-extension.json    # Gemini CLI extension
├── .opencode/plugins/bdr.js # OpenCode plugin（零 npm 依赖）
└── templates/               # config / gitignore 模板
```

### 技术栈

- **Skill / Command**：Markdown + YAML frontmatter
- **Plugin harness**：Cursor、OpenCode、Claude Code、Codex、Gemini CLI
- **CLI**：Node.js ESM + `@clack/prompts`（仅 CLI；plugin 运行时零第三方依赖）
- **许可证**：MIT

### 安装

> **分发方式**：暂不发布 npm registry（`bdr` 包名已被占用）。请使用 **`npm link`** 或 **从 GitHub 克隆** 安装 CLI。

**推荐：本仓库开发 / 本地 link**

```bash
git clone https://github.com/agiledon/bdr.git
cd bdr && npm install && npm link

cd /path/to/your-project
bdr init              # 交互式选择 IDE
```

**从 GitHub 安装 CLI（无需 clone 到固定路径）**

```bash
npm install -g github:agiledon/bdr
cd /path/to/your-project
bdr init
```

升级 BDR 后，在目标项目执行 `bdr update` 刷新 IDE 配置。

#### `bdr init` 常用选项

| 选项 | 说明 |
|------|------|
| `--ides cursor,opencode,...` | 非交互指定 IDE |
| `--all` | 配置全部 5 个 IDE |
| `--none` | 仅创建 `bdr/` 工作区 |
| `--force` | 覆盖已有 workspace / IDE 配置 |
| `--global` | OpenCode 写入用户级 `~/.config/opencode/` |
| `--dry-run` | 只打印计划，不写文件 |

`bdr init` 会：

1. 创建 `bdr/config.yaml`、`bdr/changes/`、`bdr/changes/archive/`
2. 按所选 IDE 安装 skill/command（见下表）
3. 合并 [gitignore 片段](templates/bdr-gitignore.snippet) 到项目 `.gitignore`（忽略机器相关的 plugin symlink）

| IDE | 安装方式 |
|-----|----------|
| **Cursor** | 项目 `.cursor/skills/` + `.cursor/commands/`；用户级 `~/.cursor/plugins/local/bdr` symlink |
| **OpenCode** | 项目 `opencode.json` 注册 `.opencode/plugins/bdr.js`（`--global` → 用户配置） |
| **Claude Code** | 用户级 `~/.claude/plugins/local/bdr` symlink |
| **Codex** | 项目 `plugins/bdr` symlink + `.agents/plugins/marketplace.json` |
| **Gemini CLI** | 项目 `.gemini/skills/`、`.gemini/commands/`、`.gemini/extensions/bdr` symlink |

**Extend 模式**：已存在 `bdr/config.yaml` 时保留 workspace，仅为 `installed_ides` 中缺失的 IDE 追加配置。

#### `bdr update`

在已 init 的项目中，按 `bdr/config.yaml` 的 `installed_ides` 重新安装 IDE 配置（升级 BDR 包后使用）：

```bash
bdr update              # 当前目录
bdr update /path/to/project
bdr update --dry-run
```

#### 手动安装（fallback）

| IDE | 文档 |
|-----|------|
| Cursor | [.cursor/INSTALL.md](.cursor/INSTALL.md) |
| OpenCode | [.opencode/INSTALL.md](.opencode/INSTALL.md) |
| Claude Code | [.claude/INSTALL.md](.claude/INSTALL.md) |
| Codex | [.codex/INSTALL.md](.codex/INSTALL.md) |
| Gemini CLI | [.gemini/INSTALL.md](.gemini/INSTALL.md) |

### 开发验证

```bash
bash scripts/validate-cli.sh      # CLI + plugin 全量测试 + npm pack 检查
bash scripts/validate-plugin.sh   # plugin only
bash scripts/npm-pack-check.sh    # 发布前 tarball 内容检查
npm link && bdr --help
```

**维护者**：`package.json` 已具备 `files` / `repository` 等字段，便于日后发布；当前 **不发布** 到 npm registry。

```bash
bash scripts/npm-pack-check.sh    # 验证 tarball 内容
npm pack                          # 本地预览（可选）
```

### 设计参考

- Plugin 架构参考 [Superpowers](https://github.com/agiledon/superpowers)
- [Change workspace 设计](docs/design/2026-06-05-bdr-change-workspace-design.md)
- [CLI init 设计](docs/design/2026-06-05-bdr-cli-init-design.md)
- [OpenSpec：bdr-cli-init（已归档）](openspec/changes/archive/2026-06-05-bdr-cli-init/proposal.md)
