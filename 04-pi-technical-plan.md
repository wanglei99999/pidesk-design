# Pi 使用方案

## Pi 当前提供什么

### `packages/ai`

- 统一的多模型接口；
- Provider 和模型配置；
- 凭据解析和 OAuth；
- 流式响应、重试和消息转换。

适合直接用于公司的模型接入，避免为每家模型重复开发。

### `packages/agent`

- Agent 状态；
- Agent Loop；
- 工具调用；
- 事件流；
- 中断和继续；
- 基础会话、压缩和宿主能力。

它负责一次 Agent 请求如何运行。

### `packages/coding-agent`

- `AgentSession`；
- SessionManager；
- Tool 工厂；
- Skills；
- Extensions；
- SDK；
- RPC 模式；
- 工作目录和资源加载；
- 交互、打印和 RPC 三种运行方式。

它原本面向编程任务，但文件工具、会话、技能、扩展和 SDK 对办公 Agent 很有参考价值。

### `packages/tui`

终端界面库。除非公司产品继续采用终端界面，否则主要用于理解 Pi 现有交互，不作为办公产品 UI。

### `packages/orchestrator`

实验性多实例管理。当前 API 和行为不稳定，不作为第一阶段依赖。

## Pi 没有直接提供什么

Pi 官方说明中明确没有内置完整权限系统，也没有内置 MCP、子 Agent、权限弹窗、Plan Mode 和后台 Bash。

办公产品还需要补充：

- 公司用户和组织身份；
- 内部系统权限；
- Tool 操作审批；
- 审计日志；
- Office 文件解析、生成和预览；
- 产物管理；
- 定时任务；
- IM 远程入口；
- 连接器管理和凭据托管；
- 企业知识库；
- 团队协作；
- 面向普通员工的界面。

## 推荐接入方式

### 第一阶段：使用 coding-agent SDK

优先考虑 `packages/coding-agent` 暴露的 SDK：

- 可以复用 AgentSession、SessionManager、Skills、Extensions 和 Tool；
- 与 Pi 在同一 Node.js 进程时有类型信息；
- 适合快速完成第一个办公场景；
- 能直接学习 Pi 的完整请求流程。

产品代码不应直接到处引用 Pi 类型。建议在产品内部增加一层 `PiAdapter` 概念，统一负责：

- 创建和恢复任务；
- 发送用户消息；
- 取消任务；
- 订阅事件；
- 提供 Tool；
- 加载 Skill；
- 切换模型；
- 获取统计信息。

这里目前只定义职责，不写接口代码。

### 何时使用 RPC

以下情况考虑 RPC：

- UI 或主系统不是 Node.js；
- 希望 Pi 单独运行，故障时不影响主进程；
- 公司已有其他语言服务；
- 需要跨机器或跨容器运行。

### 何时直接使用 agent-core

如果 coding-agent 的编程产品假设限制了办公场景，再改为 `agent-core + pi-ai`：

- 需要完全自定义消息和任务模型；
- 不希望继承 coding-agent 的 Session 或资源加载方式；
- 产品已经有自己的 Skill、Tool 和会话系统；
- 需要更小的运行范围。

不要在第一天就重写这些能力。先用一个真实场景验证 SDK 是否合适。

## 产品各部分

```text
办公产品界面
  -> 任务和文件服务
  -> PiAdapter
  -> coding-agent SDK
  -> agent-core
  -> pi-ai
  -> 模型服务

任务和文件服务还会调用：
  - Tool 管理
  - Skill 管理
  - 连接器
  - 权限和审批
  - 产物管理
  - 定时任务
  - 审计记录
```

## 任务执行的基本过程

1. 用户创建任务并选择工作目录。
2. 产品读取用户身份、模型和权限配置。
3. PiAdapter 创建或恢复 AgentSession。
4. Agent 根据输入选择 Tool 或 Skill。
5. Tool 执行前经过权限检查。
6. 需要确认的操作暂停，等待用户决定。
7. Tool 结果返回 Agent。
8. Agent 继续处理，直到完成、失败或取消。
9. 产品保存任务记录和生成文件。
10. 用户可以继续修改或重新执行。

## 需要重点验证的技术问题

- AgentSession 是否适合长时间办公任务；
- Session 存储是否应直接使用还是由产品重新管理；
- Extension 是否适合作为内部连接器；
- Skills 能否满足公司业务方法的版本管理；
- Office 文件工具怎样与现有 Tool 体系结合；
- 权限确认怎样暂停并恢复 Agent；
- 同一任务重复执行怎样避免重复写入；
- 定时任务怎样恢复用户身份和凭据；
- Pi 升级时 Adapter 能否隔离主要变化。

## 与现有学习文档的关系

Pi 源码细节优先参考：

- `docs/study/00-pi-全景地图-zh.md`
- `docs/study/01-agent.md`
- `docs/study/02-ai.md`
- `docs/study/03-coding-agent-core.md`
- `docs/study/04-modes-and-tui.md`
- `docs/study/05-extensions.md`
- `docs/study/06-testing.md`
- `docs/study/07-robustness-and-cost.md`

本目录不重复解释源码，只记录办公场景如何使用这些设计。
