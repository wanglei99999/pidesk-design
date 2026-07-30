# Pi 接入方案

## 状态

本文基于 Pi `0.80.10`、提交 `eb8dd587e780b5393f53635002004cb2b5ef8f92` 整理。

已经确认：

- Pi 作为 Agent 运行基础，见 [ADR-0001](adr/0001-use-pi-as-agent-runtime.md)；
- PiDesk 通过明确边界调用 Pi，不把产品逻辑写入 Pi 内部。

尚未确认：

- 第一版使用 coding-agent SDK、RPC 还是 agent-core；
- 适配边界的具体接口；
- 任务、会话和产物由哪一层保存。

这些问题由 TASK-001 的最小代码验证，不在本文提前定案。

## Pi 当前能力

### `@earendil-works/pi-ai`

- 统一的多模型接口；
- Provider 和模型配置；
- 凭据解析和 OAuth；
- 流式响应和消息转换。

### `@earendil-works/pi-agent-core`

- Agent 状态和 Agent Loop；
- Tool 调用；
- 事件流；
- 中断、继续、steering 和 follow-up；
- 自定义消息、上下文转换和宿主接口。

它负责一次 Agent 请求如何运行，不等同于 PiDesk 的完整任务系统。

### `@earendil-works/pi-coding-agent`

- `AgentSession` 和 SessionManager；
- 内置及自定义 Tool；
- Skill、Extension 和资源加载；
- 工作目录和会话存储；
- SDK 和 RPC 接入；
- 交互、Print/JSON、RPC 和 SDK 四类运行方式。

它面向编程任务，但会话、文件工具、扩展机制和嵌入接口可能适合第一批办公场景。

### `@earendil-works/pi-tui`

终端界面库。第一版可以借助 CLI 快速验证完整流程，但是否作为长期产品界面尚未决定。

### `@earendil-works/pi-orchestrator`

包描述明确标记为实验性。第一阶段不依赖，只有单 Agent 场景稳定后才重新评估。

## PiDesk 需要补充

Pi 官方明确不内置 MCP、sub-agent、Plan Mode、权限弹窗和后台 Bash。PiDesk 还需要根据场景逐步补充：

- 产品级权限和操作确认；
- 任务状态和执行记录；
- 办公文件解析、生成和预览；
- 产物管理；
- 连接器和凭据边界；
- 定时任务和远程入口；
- 面向办公用户的产品界面。

这些不是第一版同时完成的功能。

## 候选接入方式

### 候选 A：coding-agent SDK

适合 Node.js/TypeScript 同进程集成，可以直接使用类型和 `AgentSession`。它是 TASK-001 的首选验证对象，但尚未成为正式架构决定。

需要验证：

- 编程任务的默认假设是否容易替换；
- 内置会话和资源加载是否适合办公任务；
- 自定义 Tool 的权限边界是否清楚；
- 取消、事件和确认流程是否能被产品层控制。

### 候选 B：RPC

适合进程隔离、非 Node.js 主程序、跨容器或独立升级。代价是需要维护 JSONL 协议、进程生命周期和类型映射。

### 候选 C：agent-core + pi-ai

适合完全自定义任务、消息、会话和资源加载。它的控制力最高，但需要自己补充 coding-agent 已经提供的较多能力。

## 候选边界

TASK-001 可以先用一个很薄的适配层隔离 Pi。名称和接口尚未确认，候选职责包括：

- 创建 Agent 或会话；
- 发送输入和取消任务；
- 订阅事件；
- 注册 Tool；
- 读取最终结果和使用信息。

在验证前不实现完整的任务服务、Skill 管理、连接器管理和后台调度。

## TASK-001 验证清单

1. 用 SDK 运行一个只有只读 Tool 的最小任务；
2. 记录初始化、输入、Tool 调用和结束事件；
3. 验证取消信号；
4. 确认工作目录如何传递和限制；
5. 检查编程默认提示词、Tool 和资源加载能否替换；
6. 用最小 RPC 示例对比进程边界和开发成本；
7. 记录继续使用 SDK、改用 RPC 或下沉 agent-core 的理由；
8. 创建新的 ADR 固化最终选择。

## 需要后续验证

- Session 存储由 PiDesk 还是 coding-agent 管理；
- Extension 是否适合作为连接器；
- Skill 如何版本化和按需加载；
- Office 文件工具怎样接入 Tool 体系；
- 用户确认怎样暂停并恢复 Agent；
- 重复执行怎样避免重复写入；
- Pi 升级时适配边界能否隔离变化。

## 资料

固定版本资料见 [sources.md](sources.md)。源码学习只在当前任务需要时按路径读取，不在每次开发开始时加载全部 Pi 文档。
