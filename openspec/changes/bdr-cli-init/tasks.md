## 1. CLI 骨架（方案 1）

- [x] 1.1 新增 `bin/bdr.js`、`cli/index.js` 路由（init / --help / --version）
- [x] 1.2 `package.json`：`bin.bdr`；`dependencies: { "@clack/prompts": "..." }`（plugin 不引用）
- [x] 1.3 `cli/commands/init.js`：解析 `--ides` / `--all` / `--none` / `--force` / `--global` / `--dry-run`

## 2. config.yaml 与 workspace

- [x] 2.1 更新 `templates/bdr-config.yaml.example`：`installed_ides`、`init_version`、`init_at`
- [x] 2.2 `cli/lib/config-yaml.js`：读/写/合并 YAML（零依赖）
- [x] 2.3 `cli/workspace/bootstrap.js`：创建 `bdr/changes/`、`bdr/changes/archive/`
- [x] 2.4 extend 模式：已存在 config 时 skip（除非 `--force`）；更新 `installed_ides`

## 3. 交互式 IDE 选择

- [x] 3.1 `cli/prompts/ide-select.js`：5 IDE multiselect
- [x] 3.2 非 TTY 或 `--ides` 时跳过交互

## 4. 包路径与 adapter — Phase A

- [x] 4.1 `cli/lib/package-root.js`：`BDR_HOME` / `import.meta.url`
- [x] 4.2 `cli/adapters/cursor.js`：用户级 symlink → `~/.cursor/plugins/local/bdr`
- [x] 4.3 `cli/adapters/opencode.js`：项目级 merge `opencode.json`；`--global` 写用户配置
- [x] 4.4 `cli/adapters/stub.js`：Claude/Codex/Gemini warn-and-skip
- [x] 4.5 init 结束打印验证清单

## 5. IDE adapter — Phase B

- [ ] 5.1 `.claude-plugin/` + `cli/adapters/claude-code.js`
- [ ] 5.2 `.codex-plugin/` + `cli/adapters/codex.js`
- [ ] 5.3 `gemini-extension.json` + `cli/adapters/gemini-cli.js`
- [x] 5.4 Phase A warn-and-skip 行为

## 6. 测试

- [x] 6.1 `tests/cli/test-init-workspace.sh`
- [x] 6.2 `tests/cli/test-init-dry-run.sh`
- [x] 6.3 `tests/cli/test-init-extend.sh`
- [x] 6.4 `scripts/validate-cli.sh`

## 7. 文档

- [x] 7.1 README：`npm link` 开发 + 目标 `npm install -g bdr && bdr init`
- [x] 7.2 `install-cursor-plugin.sh` 委托 `bdr init --ides cursor`
- [x] 7.3 更新 `.cursor/INSTALL.md`、`.opencode/INSTALL.md`

## 8. 验收

- [x] 8.1 `bdr init --ides opencode` → workspace + opencode.json
- [x] 8.2 `bdr init --ides cursor` → workspace + symlink
- [ ] 8.3 交互式双选 IDE（手动）
- [x] 8.4 extend：二次 init 追加 IDE，`config.yaml` 保留

## Phase 2（不在 Phase A）

- npm registry、`bdr update`
