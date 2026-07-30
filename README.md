# PiDesk 设计方案

PiDesk 是一个基于 [Pi](https://github.com/earendil-works/pi) 的办公 Agent 方案。本仓库用于记录业务场景、技术设计、实施安排、开发规范和学习过程，目前不包含功能代码。

WorkBuddy 是本方案参考的代表性办公 Agent。我们只整理其公开场景，不研究或复制其内部实现。本项目与 WorkBuddy、腾讯及 Pi 官方没有隶属或合作关系。

## 这套文档解决什么问题

我们希望参考 WorkBuddy 已经公开的办公场景，结合公司的真实工作，用 Pi 开发自己的办公 Agent。

这件事有三个目标，顺序不能颠倒：

1. 解决公司的实际效率问题。
2. 在开发过程中学习 Pi 和 Agent 产品。
3. 把可以公开的知识整理成个人作品和求职材料。

WorkBuddy 是场景参考。我们研究它解决了哪些工作、用户提供什么、最后得到什么，不研究或猜测它的内部代码。技术方案由我们根据 Pi 和公司情况独立设计。

## 当前阶段

当前只写方案，不实现功能代码。

开始开发前还需要补充公司信息：

- 预期使用部门和岗位；
- 日常重复工作清单；
- 已有内部软件及技术栈；
- 需要连接的 OA、ERP、CRM、数据库、邮箱、IM 或知识库；
- 数据安全和部署要求；
- 第一批试用人员和验收方式。

这些信息缺失时，文档中的场景优先级只能作为建议，不能代替公司决策。

## 文档目录

| 文档 | 内容 |
|---|---|
| [01-project-positioning.md](01-project-positioning.md) | 项目目标、范围、工作方法 |
| [02-workbuddy-scenes.md](02-workbuddy-scenes.md) | WorkBuddy 已公开的办公场景 |
| [03-scene-analysis.md](03-scene-analysis.md) | 场景筛选方法和分析模板 |
| [04-pi-technical-plan.md](04-pi-technical-plan.md) | Pi 可复用部分、需要补充的产品功能 |
| [05-delivery-plan.md](05-delivery-plan.md) | 实施顺序、阶段产物和完成条件 |
| [06-development-rules.md](06-development-rules.md) | Tool、Skill、连接器、任务、权限等规范草案 |
| [07-learning-record.md](07-learning-record.md) | 如何在开发场景时学习 Pi 和 Agent |
| [decisions.md](decisions.md) | 已确认决定和待确认事项 |
| [company-task-inventory.md](company-task-inventory.md) | 公司任务收集表 |
| [scenarios/001-file-organization.md](scenarios/001-file-organization.md) | 文件整理场景的完整分析示例 |
| [sources.md](sources.md) | WorkBuddy 官方资料和 Pi 本地资料 |

## 使用方式

以后增加一个场景时，按以下顺序处理：

1. 从公司真实工作中写清问题和人工步骤。
2. 参考 WorkBuddy 同类场景，但不照抄产品表现。
3. 明确输入、输出、风险和验收方式。
4. 判断 Pi 可以直接使用什么。
5. 列出需要新增的 Tool、Skill、连接器和产品功能。
6. 方案确认后再开发。
7. 开发完成后补测试结果、Pi 学习记录和新增规则。

规范文档不是一次写死的。只有实际开发中重复出现的问题，才适合沉淀成正式规则。

## 许可证

本仓库使用 [MIT License](LICENSE)。
