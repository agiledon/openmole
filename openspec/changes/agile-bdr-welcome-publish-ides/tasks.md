## 1. Welcome 画面

- [ ] 1.1 新增 `cli/prompts/welcome.js`：ASCII R logo、青色闪烁动画、BDR 文案与 Quick start
- [ ] 1.2 TTY 检测；非 TTY 跳过 welcome
- [ ] 1.3 `cli/index.js`：无参数 `bdr` → welcome → `runInit`
- [ ] 1.4 `cli/commands/init.js`：TTY 且无 `--ides` 时先 welcome 再 multiselect
- [ ] 1.5 测试 `tests/cli/test-welcome.sh`

## 2. Kiro / Qoder adapter

- [ ] 2.1 新增 `cli/adapters/kiro.js`：copy 至 `.kiro/skills/`、`.kiro/commands/`
- [ ] 2.2 新增 `cli/adapters/qoder.js`：copy 至 `.qoder/skills/`、`.qoder/commands/`
- [ ] 2.3 更新 `cli/prompts/ide-select.js`：7 IDE
- [ ] 2.4 更新 `cli/lib/ide-install.js`、`init.js` extend 检测
- [ ] 2.5 新增 `.kiro/INSTALL.md`、`.qoder/INSTALL.md`（含 gitignore 例外）
- [ ] 2.6 测试 `tests/cli/test-init-kiro.sh`、`test-init-qoder.sh`

## 3. agile-bdr npm 发布

- [ ] 3.1 `package.json`：`name` → `agile-bdr`，bump 版本（如 0.5.0）
- [ ] 3.2 更新 README 中英文：registry 安装 `npm install -g agile-bdr`
- [ ] 3.3 更新 `test-package-publish.sh` 断言包名
- [ ] 3.4 `npm publish --access public`（需 npm login）
- [ ] 3.5 验证 `npm install -g agile-bdr` 后 `bdr --version`

## 4. 文档与验收

- [ ] 4.1 更新 `templates/bdr-config.yaml.example` installed_ides 注释（7 IDE）
- [ ] 4.2 `bash scripts/validate-cli.sh` 全绿
- [ ] 4.3 手动：TTY 运行 `bdr` → 见闪烁 R → Enter → 7 IDE 清单
