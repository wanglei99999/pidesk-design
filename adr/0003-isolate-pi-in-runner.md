# ADR-0003：在独立 Runner 中运行 Pi

- 状态：提议
- 日期：2026-08-24
- 相关任务：[TASK-003](../tasks/TASK-003-pi-runner-architecture.md)
- 取代：无
- 被取代：无

## 背景

ADR-0001 已决定使用 Pi 作为 Agent 运行基础，但没有确定 Pi 与桌面产品的进程边界。TASK-001 验证了 coding-agent SDK 的自定义提示词、Tool 白名单、事件和取消能力。随后对 Pi `0.84.2` 的源码审计确认：

- `AgentSessionRuntime` 已提供会话创建、切换、分支和销毁的官方生命周期容器；
- RPC 模式提供完整的 JSONL 命令和事件边界；
- 当前 `RpcClient` 缺少产品需要的就绪握手、命令级期限、Extension UI 响应和严格错误处理；
- Pi 会话文件没有多进程写锁；
- 内置文件 Tool 接受绝对路径，不能被视为工作区沙箱。

Electron 主进程还要负责窗口、产品数据、权限和 IPC。如果模型、Extension 和 Tool 直接在主进程执行，Agent 故障或失控操作会与应用控制面共享故障边界。

## 决定

Pi SDK 只在独立的 DeskBuddy Pi Runner 子进程中运行。Runner 使用 Pi 官方 `AgentSessionRuntime` 管理会话，并使用官方 `runRpcMode` 暴露 JSONL RPC。

Electron 主进程作为 Control Plane，通过 DeskBuddy 自己的薄 `PiRpcTransport` 使用官方 RPC。该适配层补充启动握手、命令级期限、取消、Extension UI 响应、协议校验、日志和进程退出处理，但不定义另一套 Agent 协议。

V1 全局只运行一个活动 `AgentRun`，并使用应用单实例锁、父子进程断开退出和会话租约保证一个 Pi 会话文件在任意时刻只有一个 Runner 写入。Renderer 只使用 DeskBuddy IPC DTO，不直接导入 Pi 类型或发送任意 RPC 命令。

Pi JSONL 是会话和消息树的权威存储；DeskBuddy SQLite 保存工作区、任务、运行、审批和产物元数据。

## 原因

- 复用 Pi 已验证的 Agent 生命周期和会话能力；
- 将模型、Tool 和 Extension 故障与 Electron Control Plane 隔离；
- 允许主进程强制取消或终止失去响应的 Runner；
- 避免把 Pi 原始类型和事件扩散到 React；
- 保留未来升级 Pi RPC 或替换传输实现的空间；
- 明确单写者规则，避免 JSONL 并发损坏。

## 影响

### 正面影响

- Pi 仍是唯一执行器，产品不会复制 Agent Loop；
- Electron 主进程保持轻量并拥有权限决策权；
- 每次活动运行具有清楚的关联、故障和取消边界；
- Runner 可以独立测试、重启和升级；
- 产品数据与 Pi 会话各自只有一个权威来源。

### 代价和限制

- 需要维护 Runner supervisor 和 `PiRpcTransport`；
- 进程协议需要运行时校验，不能只依赖 TypeScript 类型；
- V1 不支持多个任务同时后台运行；
- Extension 审批界面受当前 RPC UI 能力限制；
- 凭据需要通过受控边界提供给 Runner，不能放入命令行参数或普通日志。

## 考虑过的方案

### 在 Electron 主进程直接使用 coding-agent SDK

开发量较小，但 Agent、Extension 和 Tool 与窗口及产品数据库共享进程。长时间 Tool、内存泄漏或未捕获异常会扩大故障范围，因此不采用。

### 直接使用 Pi 现有 `RpcClient`

它适合示例和基础调用，但固定启动等待、统一请求超时、Extension UI 响应缺口和宽松错误处理不满足桌面产品要求，因此只复用协议和类型，不直接作为产品边界。

### 只使用 agent-core，自建会话和资源系统

控制力更高，但会重复实现 coding-agent 已提供的会话、资源、Extension 和 RPC 能力，不符合 ADR-0001。

### 依赖 Pi 实验性 protocol/client/server

其中的快照、revision 和独占租约设计值得借鉴，但当前仍为实验模块，也没有直接提供完整 coding-agent 服务，因此 V1 不依赖。

## 重新评估条件

- Pi 发布稳定的 coding-agent 服务进程和产品级 RPC 客户端；
- 经过验证的场景必须支持多个后台 AgentRun；
- 子进程通信成为可测量的性能瓶颈；
- 产品转为远程或多设备执行架构；
- Pi 会话存储获得可靠的多进程写入支持。
