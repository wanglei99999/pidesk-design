# Pi 接入方案

## 状态

本文基于已安装的 Pi `0.84.2` 和本地 Pi 源码审计整理。审计同时对比了 `v0.84.2` 与当前源码，本文采用的核心接口均存在于已发布的 `0.84.2`，不依赖未发布实现。

已经确认：

- Pi 是 DeskBuddy 唯一的 Agent 执行基础，见 [ADR-0001](adr/0001-use-pi-as-agent-runtime.md)；
- Pi SDK 运行在独立 Runner 子进程内；
- Electron Control Plane 通过 Pi 官方 JSONL RPC 协议控制 Runner；
- DeskBuddy 维护薄的可靠传输适配层，不把现有 `RpcClient` 直接作为产品边界；
- Pi JSONL 保存会话和消息树，DeskBuddy SQLite 保存产品元数据；
- 具体边界见 [ADR-0003](adr/0003-isolate-pi-in-runner.md) 和[架构设计规范](docs/superpowers/specs/2026-08-24-deskbuddy-pi-runner-architecture-design.md)。

ADR-0003 在书面规范通过审阅前保持“提议”状态。

## Pi 负责什么

### `@earendil-works/pi-ai`

- 模型、Provider 和流式响应；
- 凭据接口和 OAuth 能力；
- 消息转换和用量信息。

### `@earendil-works/pi-agent-core`

- Agent Loop 和 Agent 状态；
- Tool 调用；
- 运行事件；
- 中断、继续、steering 和 follow-up；
- 顺序或并行 Tool 执行策略。

### `@earendil-works/pi-coding-agent`

- `AgentSession`、`AgentSessionRuntime` 和 `SessionManager`；
- Tool、Skill、Extension 和资源加载；
- SDK 和 JSONL RPC 模式；
- 会话切换、分支、压缩和恢复。

DeskBuddy 优先使用这些公开接口，不复制 Pi 已经提供的 Agent 生命周期和会话机制。

## DeskBuddy 负责什么

- 工作区、任务和运行记录；
- Electron 窗口、React 界面和安全 IPC；
- Runner 进程生命周期和独占执行；
- 工作区路径边界；
- Tool 白名单、操作审批和审计；
- 流式事件投影和权威快照；
- 产物索引；
- 凭据保管边界；
- 崩溃、取消和重新打开后的产品状态。

## 选定接入方式

### SDK 位于 Runner 内

Runner 使用 `createAgentSessionServices`、`createAgentSessionRuntime` 和 `runRpcMode` 组合 Pi 官方能力。SDK 提供类型和生命周期控制，但不会进入 Renderer，也不直接运行在 Electron 主进程。

这样既保留 SDK 的完整能力，又把模型、Tool 和 Extension 执行放进可独立终止的进程。

### 官方 RPC 作为进程协议

Electron Control Plane 与 Runner 使用 Pi 官方 JSONL 命令和事件。DeskBuddy 的 `PiRpcTransport` 负责：

- 用 `get_state` 完成启动握手；
- 为不同命令设置独立期限并支持取消；
- 发送 Extension UI 响应；
- 校验 JSONL 帧和协议类型；
- 隔离事件监听器错误；
- 收集结构化 stderr 和退出原因。

它不增加第二套 Agent 协议，只补齐桌面产品需要的可靠性。

### 一个活动运行对应一个 Runner

V1 全局只允许一个活动 `AgentRun`。每次执行启动一个临时 Runner，加载所属 `Task` 的 Pi 会话；运行结束并完成持久化后，Runner 可以退出。

重新打开已有 Task 时，也可以短暂启动 Runner，通过官方 `get_entries` 读取 Pi JSONL 并生成产品快照；Control Plane 不直接解析 Pi 会话文件。

同一 Pi 会话文件不能被两个进程同时写入。`RunCoordinator` 负责产品执行所有权，`SessionLeaseService` 用跨进程租约防止残留 Runner 或第二个应用实例同时写入。

## 会话和产品数据

Pi JSONL 保存：

- 完整消息和 Tool 结果；
- 会话树和分支；
- 模型与 thinking 变化；
- 压缩记录。

DeskBuddy SQLite 保存：

- `Workspace`：授权目录和可用状态；
- `Task`：用户目标、模式和 Pi 会话指针；
- `AgentRun`：一次执行的指令、状态、时间和错误；
- `Approval`：待确认动作和决定；
- `Artifact`：工作成果索引。

SQLite 不复制完整聊天记录。Pi 会话文件位于 Electron `userData` 下的应用私有目录，不写入用户代码仓库。

## Extension 和 Tool

V1 使用私有 `agentDir` 和显式资源加载配置：

- 不自动加载用户全局 Pi Extension、Skill、Prompt Template 和 Theme；
- 只加载 DeskBuddy 注册的 Extension factory；
- 只开放明确批准的 Tool；
- 首个切片只提供 `workspace_read`、`workspace_list` 和 `workspace_search`；
- 不开放 Pi 内置 `bash`、`edit` 和 `write`。

Pi Extension 用于运行时策略、Tool hook 和审批暂停。产品状态、路径授权和审批记录仍由 DeskBuddy 管理。

## 事件边界

Renderer 不消费 Pi 原始事件。`PiEventProjector` 把事件转换为：

- `RunProgress`：只用于当前流式显示；
- `RunSnapshot`：带 `revision` 的权威任务快照。

Electron 为所有事件附加 `taskId` 和 `agentRunId`。重新连接或重新打开页面时以快照为准，不尝试只靠增量事件还原状态。

## V1 实施顺序

1. 建立 Electron、Preload 和严格 IPC 边界；
2. 持久化工作区，并处理目录缺失和重新关联；
3. 建立最小 `Workspace`、`Task`、`AgentRun` 数据模型；
4. 实现 Runner supervisor 和 `PiRpcTransport`；
5. 接入私有 Pi 资源加载和只读工作区 Tool；
6. 投影运行进度和权威快照；
7. 验证取消、Runner 崩溃和应用重启恢复。

以下内容不进入 V1：任意第三方 Extension、Shell 和写文件、多任务并行、后台自动化、多 Agent、远程运行，以及 Pi 实验性 client/server。

## 验证要求

- 使用 faux provider，不调用真实付费模型；
- 路径边界覆盖绝对路径、`..`、符号链接和 Windows reparse point；
- RPC 覆盖启动失败、非法帧、命令超时、取消和进程退出；
- 会话覆盖首次响应前崩溃、已有 JSONL 恢复和重复打开；
- Renderer 测试只依赖 DeskBuddy IPC DTO，不导入 Pi 类型；
- 每次代码变更运行 `npm run check`，修改测试时运行对应专项测试。

## 重新评估条件

- Pi 官方提供稳定的 coding-agent 服务进程或更完整的 RPC 客户端；
- 一个活动运行的限制阻碍经过验证的用户场景；
- 只读 Tool 无法验证首个真实工作区闭环；
- Pi 公共接口发生破坏性变化；
- 产品需要跨设备或远程执行。
