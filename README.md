# PiDesk

PiDesk 是一个基于 [Pi](https://github.com/earendil-works/pi) 的独立办公 Agent 工作台。它以任务和工作区为主要使用方式，让用户通过自然语言调用文件、Skill 和连接器，完成可检查、可继续、可复用，并逐步支持自动执行的办公任务。

市面办公 Agent 产品用于理解已经存在的用户任务、能力组织和交付方式。PiDesk 独立设计自己的任务执行链路和产品实现，不照抄产品表现，也不猜测其内部实现。

## 项目目标

1. 做出可以实际使用并持续扩展的办公 Agent；
2. 通过真实场景学习 Pi、Agent 产品设计和工程实现；
3. 将产品判断、架构决策、实现和验证整理成可公开展示的项目。

项目不以增加独立小工具或页面数量为主线。每个场景都用于验证同一条公共链路：创建任务、加载上下文、调用能力、生成或修改产物、检查结果、继续处理并保存记录。

更具体的范围和优先顺序见 [产品决定](product-decisions.md)，长期设计原则见 [产品原则](01-product-principles.md)。

## 当前阶段

项目基础文档、首批场景和 Pi SDK 边界实验已经建立。当前任务是 [TASK-002：实现 React 工作台前端原型](tasks/TASK-002-react-workbench-prototype.md)，使用模拟数据验证 DeskBuddy 的工作区、任务时间线、操作确认、成果预览和继续输入体验，不在原型阶段接入真实模型或文件。

[TASK-001：验证 Pi 办公 Agent 最小运行闭环](tasks/TASK-001-file-organization.md) 已通过公开 `pi-coding-agent` SDK 和 faux provider 验证自定义提示词、Tool 白名单、运行事件和取消传播，当前暂停业务实现。前端原型提交后，项目将先实现真实代码工作区和代码开发任务闭环，再扩展日常办公场景。

## 仓库结构

```text
pidesk-design/
├── .github/
│   └── pull_request_template.md               # PR 验收、记录和公开仓库检查
├── adr/
│   ├── README.md                              # ADR 使用规则和决策索引
│   ├── TEMPLATE.md                            # 新架构决定模板
│   ├── 0001-use-pi-as-agent-runtime.md        # 采用 Pi 作为 Agent 运行基础
│   └── 0002-separate-public-core-and-private-adapters.md
│                                                # 公开产品与私有适配的边界
├── research/
│   └── products/
│       └── workbuddy.md                       # WorkBuddy 公开事实与 PiDesk 分析
├── scenarios/
│   ├── TEMPLATE.md                            # 场景说明模板
│   └── 001-file-organization.md               # 文本文件批量重命名场景
├── tasks/
│   ├── TEMPLATE.md                            # 开发任务模板
│   └── TASK-001-file-organization.md          # 当前开发任务及进度
├── src/                                        # React 工作台前端原型
├── test/
│   └── pi-coding-agent-sdk.test.ts            # SDK 接入边界与取消实验
├── templates/
│   └── company-adaptation/
│       └── task-inventory.md                  # 私有环境复用时的空白调研模板
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
├── product-decisions.md                       # 产品目标、范围和优先顺序
├── 01-product-principles.md                   # 产品与实现原则
├── 02-market-scenes.md                        # 跨产品办公场景库
├── 03-scene-analysis.md                       # 场景选择与分析方法
├── 04-pi-integration-plan.md                  # Pi 能力、接入候选和验证计划
├── 05-product-roadmap.md                      # 产品能力演进顺序
├── 06-development-rules.md                    # 安全基线和待验证实践
├── 07-learning-guide.md                       # Pi 与 Agent 学习方法
└── sources.md                                 # 可追溯的市面产品和 Pi 资料
```

## 开发方式

推进一个场景或产品能力时：

1. 从实际工作或 [市场场景库](02-market-scenes.md) 中选择具体问题；
2. 用 [场景模板](scenarios/TEMPLATE.md) 写清用户、输入、输出、风险和验收；
3. 创建任务文件，收窄本次范围并记录唯一下一步；
4. 把 Pi 能力当作候选，用最小代码实验确认接入和边界；
5. 接入公共任务链路，避免为每个场景建设孤立入口；
6. 实现完整闭环，分开验证系统正确性和模型质量；
7. 记录实际结论，必要时更新 ADR、开发规则和 `[Unreleased]`。

规范不是一次写死的。安全基线直接执行，其他做法只有经过实际任务重复验证后才升级为长期规则。

跨电脑开发按照 [开发流程](DEVELOPMENT.md) 更新任务文件并推送当前任务分支，任何电脑都以 GitHub 上的最新提交为同步来源。

## 常用入口

- [当前任务](TASKS.md)
- [开发流程](DEVELOPMENT.md)
- [产品决定](product-decisions.md)
- [架构决定](adr/README.md)
- [市场场景](02-market-scenes.md)
- [Pi 接入计划](04-pi-integration-plan.md)

## 许可证

本仓库使用 [MIT License](LICENSE)。
