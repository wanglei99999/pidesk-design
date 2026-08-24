# ADR-0004：在 Pi 运行时之上组织 DeskBuddy 能力包

- 状态：已采纳
- 日期：2026-08-24
- 相关任务：[TASK-003](../../../tasks/TASK-003-pi-runner-architecture.md)
- 取代：无
- 被取代：无

## 背景

DeskBuddy 既要提供 Pi 的 Coding Agent 基础能力，也要逐步支持文档、表格、会议和外部服务。Pi 已提供模型循环、Tool、Session、Skill 和 Extension，但完整桌面产品还需要任务、工作区、审批、产物、权限、持久化、文件格式处理和专用界面。

如果把所有办公功能都实现成 Pi Extension，Extension 会同时承担产品状态、确定性业务逻辑和界面职责，难以保证权限边界，也会把 DeskBuddy 与 Pi 的资源加载机制过度耦合。反过来，如果 DeskBuddy 自建 Agent Loop，又会重复 Pi 已经提供的运行能力。

## 决定

DeskBuddy 按三个职责层组织：

1. **产品壳**：负责任务、工作区、会话界面、审批、产物、权限和产品持久化；
2. **Pi Runner**：作为唯一 Agent 执行器，负责模型循环、Tool 调用、Pi 会话、Skill 和 Extension；
3. **DeskBuddy 能力包**：面向 Coding 或办公场景，组合受控 Tool、确定性服务、第一方 Skill/Extension 和声明式界面定义。

能力包遵守以下边界：

- Agent 行为、上下文注入、Tool hook 和运行时策略可以使用 Pi Skill 或 Extension；
- 文件格式处理、外部系统调用、参数校验、权限和副作用执行由 DeskBuddy 服务或受控 Tool 完成；
- Renderer 只渲染 DeskBuddy 定义并校验的声明式界面 Schema，不执行能力包提供的任意代码；
- 能力包不能绕过 Workspace、Approval、CredentialBroker 或审计边界；
- V1 只包含 DeskBuddy 明确注册和审查的第一方能力，不开放任意第三方 Extension 市场；
- Coding 能力是内置基础能力，办公能力在公共任务链路稳定后逐步增加。

## 原因

- 保持 Pi 是唯一 Agent 执行器，避免复制 Agent Loop；
- 让产品状态、权限和确定性业务逻辑由 DeskBuddy 掌控；
- 复用 Pi Skill 和 Extension，而不把所有产品功能强行映射成 Extension；
- 让 Coding 与办公能力共享任务、工作区、审批、产物和持久化；
- 为未来公开扩展保留边界，同时避免 V1 承担不可信代码风险。

## 影响

### 正面影响

- 产品层、Harness 和场景能力的职责清楚；
- 办公能力可以组合 Agent 行为与确定性程序，而不是依赖模型完成全部步骤；
- 能力包可以独立测试，并复用同一权限和产物体系；
- React 不需要理解 Pi 原始类型或加载任意 Extension UI。

### 代价和限制

- 需要定义能力包清单、受控 Tool 接口和声明式界面 Schema；
- 同一能力可能同时包含 Runner 资源和 Control Plane 服务，需要明确版本与依赖关系；
- 第一方审查限制会降低早期扩展自由度；
- 第三方能力市场需要额外的签名、权限声明、隔离和兼容性设计。

## 考虑过的方案

### 所有办公功能都实现为 Pi Extension

接入形式统一，但会把产品状态、文件处理、外部系统和界面职责混入运行时扩展，也无法单靠 Extension hook 建立完整安全边界，因此不采用。

### DeskBuddy 自建完整 Harness

控制力更高，但会重复实现 Pi 的模型循环、Tool、Session、Skill 和 Extension，不符合 ADR-0001，因此不采用。

### Renderer 直接加载能力包界面代码

扩展界面自由度高，但扩大了桌面应用的供应链和权限风险。V1 只接受产品定义的声明式 Schema，不采用任意前端代码加载。

## 重新评估条件

- Pi 提供稳定、可沙箱化且带权限清单的扩展分发机制；
- 多个已实现能力包证明当前组合边界产生严重重复；
- 第三方开发者需求足以承担签名、隔离和兼容性成本；
- 产品从本地单用户桌面形态转为远程或多租户运行。
