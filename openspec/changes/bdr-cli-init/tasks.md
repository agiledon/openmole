## 1. CLI 骨架

- [ ] 1.1 新增 `bin/bdr.js` shebang 入口与 `cli/index.js` 命令路由
- [ ] 1.2 `package.json` 增加 `bin.bdr`；CLI 依赖 `@clack/prompts`（plugin 本体不引用）
- [ ] 1.3 实现 `--help`、`init --help` 与 `--dry-run` / `--force` / `--ides` 参数解析

## 2. 交互式 IDE 选择

- [ ] 2.1 `cli/prompts/ide-select.js`：multiselect 列出 Cursor、OpenCode、Gemini CLI、Claude Code、Codex
- [ ] 2.2 非 TTY 或 `--ides` 时跳过交互
- [ ] 2.3 支持 `--ides all` / `--none`

## 3. 工作区 bootstrap

- [ ] 3.1 `cli/workspace/init.js`：创建 `bdr/config.yaml`、`bdr/changes/`、`bdr/changes/archive/`
- [ ] 3.2 已存在时 extend 模式（skip config，除非 `--force`）
- [ ] 3.3 从 `templates/bdr-config.yaml.example` 复制内容

## 4. IDE 适配器 — Phase A（MVP）

- [ ] 4.1 `cli/adapters/cursor.js`：symlink package root → `~/.cursor/plugins/local/bdr`
- [ ] 4.2 `cli/adapters/opencode.js`：merge `plugin` 路径到项目 `opencode.json`（可选 `--global`）
- [ ] 4.3 BDR 包根路径解析（`import.meta.url` + `BDR_HOME`）
- [ ] 4.4 init 完成后打印 Cursor Cmd+Q、OpenCode 重启验证提示

## 5. IDE 适配器 — Phase B

- [ ] 5.1 补全 `.claude-plugin/` manifest + `cli/adapters/claude-code.js`
- [ ] 5.2 补全 `.codex-plugin/` manifest + `cli/adapters/codex.js`
- [ ] 5.3 补全 `gemini-extension.json` + `cli/adapters/gemini-cli.js`
- [ ] 5.4 Phase A 中对未就绪 IDE 的 warn-and-skip 行为

## 6. 测试

- [ ] 6.1 `tests/cli/test-init-workspace.sh`：temp dir 断言目录与 config.yaml
- [ ] 6.2 `tests/cli/test-init-dry-run.sh`：无文件写入
- [ ] 6.3 `tests/cli/test-init-ides-flag.sh`：非交互 `--ides none` / `cursor`
- [ ] 6.4 更新 `scripts/validate-plugin.sh` 或新增 `scripts/validate-cli.sh`

## 7. 文档与迁移

- [ ] 7.1 README：推荐 `bdr init` 为首选安装方式
- [ ] 7.2 `scripts/install-cursor-plugin.sh` 委托 `bdr init --ides cursor`（或标注 deprecated）
- [ ] 7.3 更新 `.cursor/INSTALL.md`、`.opencode/INSTALL.md`

## 8. 验收

- [ ] 8.1 空目录 `bdr init --ides opencode` → workspace + opencode.json
- [ ] 8.2 空目录 `bdr init --ides cursor` → workspace + symlink
- [ ] 8.3 交互式多选（手动）：两 IDE 同选
- [ ] 8.4 extend 模式：二次 init 追加 IDE 不破坏 config

## Phase 2（不在 Phase A）

- npm registry 发布、`bdr update`、gitignore 模板
