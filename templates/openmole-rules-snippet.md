## OpenMole 规约摘要（内嵌于各 Skill，非独立文件）

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

每次 `mole:apply` 仅处理一个未完成任务。

### specification §4 — badsmells 条目

七字段 + §2.0 状态：**未清除** / **已消除** / **部分残余**。

### specification §7 — 修订历史

升版时 **提交版本** = `git rev-parse HEAD`，未提交填 `—`。
