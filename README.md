# PiDesk

PiDesk 是一个基于 [Pi](https://github.com/earendil-works/pi) 的独立办公 Agent 项目。它从具体、可验证的办公任务开始，逐步形成可复用的任务运行、文件处理、工具调用、确认和结果检查能力。

市面办公 Agent 产品只作为场景来源。PiDesk 研究它们公开解决了什么问题、接收什么输入、交付什么结果，再独立设计自己的产品和实现，不照抄产品表现，也不猜测其内部实现。

## 项目目标

1. 做出可以实际使用并持续扩展的办公 Agent；
2. 通过真实场景学习 Pi、Agent 产品设计和工程实现；
3. 将产品判断、架构决策、实现和验证整理成可公开展示的项目。

更具体的范围和优先顺序见 [产品决定](product-decisions.md)，长期设计原则见 [产品原则](01-product-principles.md)。

## 当前阶段

项目基础文档和首批场景已经整理完成，代码结构尚未创建。当前任务是 [TASK-001：完成文本文件批量重命名](tasks/TASK-001-file-organization.md)，先用根层 `.txt`、`.md` 模拟文件完成“分析—预览—确认—执行—记录”的最小闭环，同时用代码比较 Pi SDK 与 RPC 的接入边界。

在 TASK-001 确定程序入口、依赖和检查命令后，再按实际需要创建 `src/`、测试、包配置和 CI，不提前保留空目录。

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
├── templates/
│   └── company-adaptation/
│       └── task-inventory.md                  # 私有环境复用时的空白调研模板
├── .gitattributes                             # 文本和换行符规则
├── .gitignore                                 # 凭据、依赖、产物和本机文件排除规则
├── AGENTS.md                                  # AI Agent 与开发者的仓库规则
├── CHANGELOG.md                               # 用户可感知的版本变化
├── DEVELOPMENT.md                             # 分支、多电脑同步和任务交接流程
├── LICENSE                                    # MIT License
├── README.md                                  # 项目说明和入口
├── TASKS.md                                   # 任务总表、状态和下一步
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

增加一个场景时：

1. 从实际工作或 [市场场景库](02-market-scenes.md) 中选择具体问题；
2. 用 [场景模板](scenarios/TEMPLATE.md) 写清用户、输入、输出、风险和验收；
3. 创建任务文件，收窄本次范围并记录唯一下一步；
4. 把 Pi 能力当作候选，用最小代码实验确认接入和边界；
5. 实现完整闭环，分开验证系统正确性和模型质量；
6. 记录实际结论，必要时更新 ADR、开发规则和 `[Unreleased]`。

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
