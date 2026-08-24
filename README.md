# DeskBuddy

DeskBuddy 是一个由 [Pi](https://github.com/earendil-works/pi) 驱动的开源本地桌面 Agent 工作台。它以 Coding Agent 作为基础能力，以任务和工作区组织持续工作，并通过受控能力包逐步扩展文档、表格和其他办公场景。

DeskBuddy 不是 Pi 的官方前端，也不复制 Pi CLI。Pi 提供 Agent 运行时，DeskBuddy 负责桌面产品体验、权限、审批、产物和持久化。市面办公 Agent 产品只用于理解已经存在的用户任务、能力组织和交付方式。

## 项目目标

1. 做出可以实际使用并持续扩展的办公 Agent；
2. 通过真实场景学习 Pi、Agent 产品设计和工程实现；
3. 将产品判断、架构决策、实现和验证整理成可公开展示的项目。

项目不以增加独立小工具或页面数量为主线。每个场景都用于验证同一条公共链路：创建任务、加载上下文、调用能力、生成或修改产物、检查结果、继续处理并保存记录。

产品按三层组织：

1. **DeskBuddy 产品壳**：任务、工作区、会话界面、审批、产物、权限和产品数据；
2. **Pi Runner**：模型循环、Tool 调用、Pi 会话、Skill 和 Extension；
3. **DeskBuddy 能力包**：组合受控 Tool、确定性服务、第一方 Skill/Extension 和声明式界面，提供 Coding 与办公能力。

更具体的范围和优先顺序见 [产品决定](docs/product/decisions.md)，长期设计原则见 [产品原则](docs/product/principles.md)。

## 当前阶段

项目基础文档、首批场景、Pi SDK 边界实验、React 工作台原型和 Pi Runner 架构已经建立。当前任务是 [TASK-003：设计真实工作区和 Pi Runner 架构](tasks/TASK-003-pi-runner-architecture.md)，下一步为第一个只读代码工作区纵向切片编写实施计划。

[TASK-001：验证 Pi 办公 Agent 最小运行闭环](tasks/TASK-001-file-organization.md) 已通过公开 `pi-coding-agent` SDK 和 faux provider 验证自定义提示词、Tool 白名单、运行事件和取消传播。[TASK-002：React 工作台前端原型](tasks/TASK-002-react-workbench-prototype.md) 已完成。当前先实现真实代码工作区和只读 Pi Agent 纵向切片，再逐步开放受控修改能力和办公能力包。

历史任务、ADR 和研究记录中的 “PiDesk” 是 DeskBuddy 的旧名称。代码目录、包名和内部标识可以继续使用 `pidesk`，公开产品名称统一为 DeskBuddy。

## 仓库结构

```text
pidesk-design/
├── .github/
│   └── pull_request_template.md               # PR 验收、记录和公开仓库检查
├── docs/
│   ├── README.md                               # 文档导航和职责边界
│   ├── product/                                # 产品决定、原则、路线和场景筛选
│   ├── architecture/
│   │   ├── decisions/                          # ADR 使用规则、模板和决策记录
│   │   ├── diagrams/                           # 架构图和任务执行时序图
│   │   ├── pi-integration.md                   # Pi 接入边界
│   │   └── pi-runner-design.md                 # 已确认的 Runner 架构规范
│   ├── scenarios/                              # 场景需求、风险和验收标准
│   ├── research/                               # 外部来源和产品研究
│   ├── development/                            # Agent 开发规则和学习指南
│   ├── plans/                                  # 已确认设计的实施计划
│   └── templates/                              # 公司适配等复用模板
├── tasks/
│   ├── TEMPLATE.md                            # 开发任务模板
│   ├── TASK-001-file-organization.md          # Pi SDK 边界实验
│   ├── TASK-002-react-workbench-prototype.md  # React 工作台原型
│   └── TASK-003-pi-runner-architecture.md     # 当前架构设计任务
├── src/                                        # React 工作台前端原型
├── test/
│   └── pi-coding-agent-sdk.test.ts            # SDK 接入边界与取消实验
├── .gitattributes                             # 文本和换行符规则
├── .gitignore                                 # 凭据、依赖、产物和本机文件排除规则
├── AGENTS.md                                  # AI Agent 与开发者的仓库规则
├── CHANGELOG.md                               # 用户可感知的版本变化
├── DEVELOPMENT.md                             # 分支、多电脑同步和任务交接流程
├── LICENSE                                    # MIT License
├── package-lock.json                          # 固定 npm 依赖树
├── package.json                               # Node.js 版本、依赖和检查命令
├── README.md                                  # 项目说明和入口
├── TASKS.md                                   # 任务总表、状态和下一步
├── tsconfig.json                              # TypeScript 严格检查配置
└── vite.config.ts                             # Vite 开发和构建配置
```

## 开发方式

推进一个场景或产品能力时：

1. 从实际工作或 [市场场景库](docs/product/market-scenes.md) 中选择具体问题；
2. 用 [场景模板](docs/scenarios/TEMPLATE.md) 写清用户、输入、输出、风险和验收；
3. 创建任务文件，收窄本次范围并记录唯一下一步；
4. 把 Pi 能力当作候选，用最小代码实验确认接入和边界；
5. 接入公共任务链路，避免为每个场景建设孤立入口；
6. 实现完整闭环，分开验证系统正确性和模型质量；
7. 记录实际结论，必要时更新 ADR、开发规则和 `[Unreleased]`。

规范不是一次写死的。安全基线直接执行，其他做法只有经过实际任务重复验证后才升级为长期规则。

跨电脑开发按照 [开发流程](DEVELOPMENT.md) 更新任务文件并推送当前开发位置，任何电脑都以 GitHub 上的最新提交为同步来源。单人维护默认直接使用 `main`；需要隔离实验、并行工作或 Pull Request 审阅时再创建任务分支。

## 常用入口

- [当前任务](TASKS.md)
- [文档导航](docs/README.md)
- [开发流程](DEVELOPMENT.md)
- [产品决定](docs/product/decisions.md)
- [架构决定](docs/architecture/decisions/README.md)
- [市场场景](docs/product/market-scenes.md)
- [Pi 接入方案](docs/architecture/pi-integration.md)

## 许可证

本仓库使用 [MIT License](LICENSE)。
