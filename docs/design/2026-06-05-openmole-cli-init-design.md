# OpenMole CLI — `openmole init` 整合设计

**日期**：2026-06-05  
**状态**：已批准（brainstorming）  
**依据**：`openspec/changes/openmole-cli-init/`  
**实现方案**：方案 1 — 单包 `cli/` + `bin/openmole`（与 plugin 同 repo 发布）

---

## 1. 背景与动机

OpenMole 0.2.0 已完成 change workspace 与 Cursor/OpenCode 手动安装，但用户需手工 symlink、手改 `opencode.json`，门槛高。OpenSpec `openspec init` 验证了「交互式 IDE 多选 + Tool Configurator + 项目结构 bootstrap」模式。

**目标**：在任意目标目录运行 `openmole init`，完成：

1. `openmole/` 工作区初始化（`config.yaml`、`changes/`、`changes/archive/`）
2. 所选 AI IDE 的 skill/command 接入

---

## 2. Brainstorming 决策记录

| # | 议题 | 决策 |
|---|------|------|
| 1 | IDE 配置作用域 | **混合** — 各 harness 按惯例（Cursor 用户级，OpenCode 项目级等） |
| 2 | 未就绪 IDE（Claude/Codex/Gemini） | **warn-and-skip** — 列表始终 5 项，不阻断其他 IDE |
| 3 | CLI 分发 | **`npm link` 开发** + 文档推荐 `npm install -g`；registry **Phase 2** |
| 4 | init 状态 | 写入 **`openmole/config.yaml`**（非独立 state 文件） |
| 5 | config 元数据 | `installed_ides` + `init_version` + `init_at` + `current_change` |
| 6 | 包结构 | **方案 1** — 单包 `cli/` + `bin/openmole.js`，不拆子包 |

---

## 3. 架构

```
openmole/                              # npm package root
├── bin/openmole.js                    # #!/usr/bin/env node → cli/index.js
├── cli/
│   ├── index.js                  # init | --help | --version
│   ├── commands/init.js
│   ├── prompts/ide-select.js     # @clack/prompts multiselect
│   ├── workspace/bootstrap.js
│   ├── adapters/
│   │   ├── cursor.js             # 用户级
│   │   ├── opencode.js           # 项目级（--global 可选）
│   │   ├── claude-code.js        # Phase B / warn-skip
│   │   ├── codex.js
│   │   └── gemini-cli.js
│   └── lib/
│       ├── package-root.js       # OpenMole_HOME / import.meta.url
│       └── config-yaml.js        # 读写 config.yaml
├── skills/ …                     # 不变
├── .opencode/plugins/openmole.js      # 不变，零 npm 依赖
└── package.json                  # bin + dependencies: @clack/prompts
```

**依赖隔离**：仅 `cli/`、`bin/` 引用 `@clack/prompts`；plugin 运行时保持零 npm 依赖。

---

## 4. `openmole init` 流程

```
openmole init [path] [flags]
    │
    ├─ 解析 target（默认 cwd）
    ├─ workspace bootstrap
    │     ├─ mkdir openmole/changes/、openmole/changes/archive/
    │     └─ 创建/合并 openmole/config.yaml
    ├─ IDE 选择
    │     ├─ TTY 且无 --ides → @clack multiselect（5 IDE）
    │     └─ --ides / --all / --none
    ├─ 对每个 IDE 跑 adapter（idempotent）
    │     ├─ 成功 → 更新 installed_ides
    │     └─ manifest 未就绪 → warn，继续
    └─ 打印验证清单（重启 IDE、/mole-explore）
```

### 4.1 Extend 模式

- `openmole/config.yaml` 已存在且未 `--force` → 不覆盖 workspace 字段
- 仅对 `installed_ides` 中**缺失**的 IDE 运行 adapter
- 提示：「OpenMole 已初始化，正在追加 IDE 配置」

### 4.2 `openmole/config.yaml` schema

```yaml
current_change: null
installed_ides: []          # cursor | opencode | gemini | claude | codex
init_version: "0.3.0"       # 执行 init 的 OpenMole CLI 版本
init_at: "2026-06-05T12:00:00Z"
```

`--force` 时从 template 重建上述字段（保留 `current_change` 可选策略：默认 force 也重置为 null，文档说明）。

---

## 5. IDE Adapter（混合作用域）

| IDE | 作用域 | Phase A | 未就绪时 |
|-----|--------|---------|----------|
| **Cursor** | 用户级 | symlink `{pkgRoot}` → `~/.cursor/plugins/local/openmole` | — |
| **OpenCode** | 项目级（默认） | merge `opencode.json` → `plugin: ["{abs}/.opencode/plugins/openmole.js"]` | — |
| **OpenCode --global** | 用户级 | merge `~/.config/opencode/opencode.json` | — |
| **Claude Code** | 依官方文档 | adapter 占位 | warn-skip |
| **Codex** | 项目级 | adapter 占位 | warn-skip |
| **Gemini CLI** | 项目级 | adapter 占位 | warn-skip |

**包路径解析**（`cli/lib/package-root.js`）：

1. 环境变量 `OPENMOLE_HOME`（开发 override）
2. `import.meta.url` → 上溯至 package root
3. 全局安装 fallback（`npm root -g`/openmole）

OpenCode JSON merge：深合并 `plugin` 数组（去重）；写入前备份 `.bak`。

---

## 6. CLI 接口

```
openmole init [path] [options]

Options:
  --ides <list>    cursor,opencode,gemini,claude,codex
  --all            全部 IDE
  --none           仅 workspace，不配置 IDE
  --force          覆盖 config / IDE 配置
  --global         OpenCode 等写用户级配置
  --dry-run        打印计划，不写文件
  -h, --help
```

---

## 7. 分期交付

| 阶段 | 范围 |
|------|------|
| **Phase A** | CLI 骨架、workspace、Clack TUI、Cursor + OpenCode adapter、测试、文档 |
| **Phase B** | `.claude-plugin/`、`.codex-plugin/`、`gemini-extension.json` + 三 adapter |
| **Phase 2** | npm registry 发布、`openmole update`、gitignore 模板 |

---

## 8. 非目标

- 不实现 `openmole explore/analyze/...` CLI 子命令（仍由 IDE Agent 执行）
- init 不扫描坏味道、不复制 constitution/specification
- 不自动安装 Cursor/OpenCode 本体

---

## 9. 风险与缓解

| 风险 | 缓解 |
|------|------|
| Claude/Codex/Gemini manifest 缺失 | Phase A warn-skip |
| Cursor 企业版禁用 local plugin | init 输出 troubleshooting |
| OpenCode JSON 冲突 | 深合并 + `.bak` |
| npm 全局路径差异 | `OPENMOLE_HOME` + `npm link` 文档 |

---

## 10. 参考

- OpenSpec `openspec init` / `--tools`
- [整合设计（workspace）](2026-06-05-openmole-change-workspace-design.md)
- 实现计划：[plans/2026-06-05-openmole-cli-init.md](plans/2026-06-05-openmole-cli-init.md)
