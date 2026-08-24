# TASK-003：设计真实工作区和 Pi Runner 架构

## 基本信息

- 状态：设计中
- 分支：`main`
- 最后更新：2026-08-24
- 关联场景：代码工作区中的 Agent 任务
- 依赖任务：[TASK-001](TASK-001-file-organization.md)、[TASK-002](TASK-002-react-workbench-prototype.md)

## 目标

确定 DeskBuddy 在 Electron + React 形态下接入 Pi `0.84.2` 的进程、会话、数据和安全边界，使后续实现可以从真实工作区纵向切片开始，而不需要重新设计 Agent 生命周期。

## 本次范围

- 审计 Pi `0.84.2` 的公开 SDK、RPC、Session、Extension 和 Tool 边界；
- 确定 React、Electron Control Plane 和 Pi Runner 的职责；
- 确定 Workspace、Task、AgentRun、Approval 和 Artifact 的最小数据模型；
- 确定 Pi JSONL 与 SQLite 的权威数据分工；
- 确定单活动运行、崩溃恢复和工作区重新关联规则；
- 创建 ADR-0003 和可审阅的架构设计规范；
- 更新旧 Pi 接入说明。

## 不在本次范围

- 编写 Electron、SQLite、Runner 或 IPC 业务代码；
- 修改现有 React 原型行为；
- 开放写文件、Shell 或代码执行权限；
- 多任务并行、多 Agent、自动化或远程运行；
- 提交或推送 Git。

## 验收标准

- [x] 架构明确 Pi 是 Runner 内的唯一执行器；
- [x] SDK、官方 RPC 和 DeskBuddy 传输适配层职责清楚；
- [x] 工作区、任务、运行和 Pi 会话的持久化边界清楚；
- [x] Tool、Extension、凭据和 Renderer 权限边界清楚；
- [x] 正常运行、取消、崩溃和应用重启路径有确定结果；
- [x] V1 范围和非目标明确；
- [ ] 用户完成书面规范审阅；
- [ ] ADR-0003 从“提议”更新为“已采纳”。

## 计划

- [x] 核对 Pi 版本和当前依赖；
- [x] 审计 `AgentSessionRuntime`、RPC、SessionManager、Extension 和 Tool；
- [x] 对比 Pi 实验性 protocol/client/server 的可借鉴边界；
- [x] 编写架构设计规范；
- [x] 创建 ADR-0003；
- [x] 更新 Pi 接入文档和项目入口；
- [ ] 根据用户书面审阅意见修订；
- [ ] 编写分阶段实施计划。

## 最近进展

### 2026-08-24

- 依赖：Pi 直接依赖已从 `0.80.10` 更新为 `0.84.2`；
- 验证：`npm run check` 和 `npm run test:sdk` 已通过；
- 生命周期：确认使用官方 `AgentSessionRuntime`，不自建会话切换和销毁逻辑；
- 进程：确认 Pi SDK 位于独立 Runner，Control Plane 使用官方 JSONL RPC；
- 可靠性：现有 `RpcClient` 不直接作为产品边界，由薄 `PiRpcTransport` 补齐握手、期限、UI 响应和错误处理；
- 数据：Pi JSONL 保存会话树，SQLite 保存产品元数据；
- 安全：V1 使用私有资源目录和只读工作区 Tool，不开放内置 `bash`、`edit`、`write`；
- 并发：V1 全局只允许一个活动 AgentRun，一个 Pi 会话文件只允许一个 Runner 写入。
- 恢复：补充临时 Runner 读取 Pi JSONL 并重建权威快照的路径，Control Plane 不直接解析 Pi 会话文件。
- 可视化：总体架构图和任务执行时序图已同步到独立 Runner、官方 RPC、双存储和 V1 只读边界。

## 验证记录

| 命令或检查 | 结果 |
|---|---|
| `npm run check` | Pi `0.84.2` 依赖下通过 |
| `npm run test:sdk` | 通过，2/2 |
| Pi `0.84.2` 类型和本地源码审计 | 核心结论均可由已发布公开接口支持 |
| 规范占位、类型一致性、链接和 `git diff --check` | 通过 |
| 架构图 XML、几何、构图校验与浏览器视觉检查 | 通过 |

## 阻塞问题

- 无实现阻塞；进入实施计划前需要用户审阅书面规范。

## 相关记录

- ADR：[ADR-0003](../adr/0003-isolate-pi-in-runner.md)；
- 设计规范：[DeskBuddy Pi Runner 架构设计](../docs/superpowers/specs/2026-08-24-deskbuddy-pi-runner-architecture-design.md)；
- Changelog：本任务只调整内部架构文档，不记录用户可见变化。

## 下一步

- 用户审阅书面规范；通过后把 ADR-0003 标记为“已采纳”，再编写分阶段实施计划。

## 完成记录

- 合并提交：未完成
- 完成日期：未完成
- 最终验证：未完成
- 后续任务：实现 Electron 本地工作区和只读 Pi Runner 纵向切片
