# DeskBuddy 文档

本目录保存产品、架构、场景、研究、开发规则和实施计划等长期文档。仓库根目录只保留项目入口与开发控制文件，当前任务进度保存在根目录 `tasks/`。

## 文档导航

| 目录 | 职责 | 主要入口 |
|---|---|---|
| `product/` | 产品定位、原则、路线和场景选择 | [产品决定](product/decisions.md)、[产品路线](product/roadmap.md) |
| `architecture/` | Pi 接入、Runner 设计、ADR 和架构图 | [架构入口](architecture/README.md) |
| `scenarios/` | 用户问题、风险、边界和验收 | [场景模板](scenarios/TEMPLATE.md) |
| `research/` | 外部来源和公开产品研究 | [资料来源](research/sources.md) |
| `development/` | Agent 开发安全基线和学习方法 | [开发规则](development/agent-development-rules.md)、[学习指南](development/pi-learning-guide.md) |
| `plans/` | 已确认设计的实施计划 | [React 工作台原型计划](plans/2026-08-23-react-workbench-prototype.md) |
| `templates/` | 私有环境适配等复用模板 | [公司任务清单模板](templates/company-adaptation/task-inventory.md) |

## 边界

- `README.md`、`AGENTS.md`、`DEVELOPMENT.md`、`TASKS.md` 和 `CHANGELOG.md` 保留在仓库根目录，作为开发者和 Agent 的固定入口；
- `tasks/` 保存当前及历史任务的范围、进度、验证和下一步；
- `docs/` 保存不随单次任务结束而失效的长期知识；
- 架构决定统一进入 `architecture/decisions/`，不在产品文档中复制完整技术结论；
- 文档链接使用仓库内相对路径，移动文件后必须运行本地链接检查。
