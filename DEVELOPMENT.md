# 开发流程

## 目的

GitHub 是本项目唯一的同步来源。无论在哪台电脑开发，拉取仓库后都应该能从文件中确认：

- 当前正在做什么；
- 已经完成什么；
- 做过哪些验证；
- 还有什么问题；
- 下一步从哪里继续。

聊天记录、个人笔记和某台电脑上的未提交修改不能代替仓库记录。

## 文件分工

| 文件 | 用途 |
|---|---|
| [AGENTS.md](AGENTS.md) | AI Agent 和开发者必须遵守的仓库规则 |
| [TASKS.md](TASKS.md) | 所有开发任务的状态和优先级 |
| `tasks/TASK-NNN-名称.md` | 单个任务的范围、计划、进展和下一步 |
| [docs/scenarios/](docs/scenarios/) | 场景需求、风险和验收标准 |
| [docs/product/decisions.md](docs/product/decisions.md) | 产品目标、范围和优先顺序 |
| [docs/architecture/decisions/README.md](docs/architecture/decisions/README.md) | 重要技术决定、原因和影响 |
| [CHANGELOG.md](CHANGELOG.md) | 用户可以感知的单文件版本摘要 |
| [.github/pull_request_template.md](.github/pull_request_template.md) | Pull Request 的验收和公开仓库检查 |
| [docs/development/pi-learning-guide.md](docs/development/pi-learning-guide.md) | Pi 和 Agent 的学习与记录方法 |
| [docs/development/agent-development-rules.md](docs/development/agent-development-rules.md) | 安全基线和经过实现验证的长期规则 |

任务文件负责记录开发进度，场景文件负责说明为什么做和做到什么程度。两者不能相互替代。

## 基本规则

1. `main` 保持可运行和已验证，是单人维护时的默认开发位置。
2. 一个开发任务必须对应一个任务文件，但不强制创建分支。
3. 隔离实验、并行工作或需要 Pull Request 审阅时使用 `task/NNN-short-name` 分支。
4. 默认同一时间只推进一个主要任务。
5. 不在两台电脑上同时修改同一个分支。
6. 开发者本人准备换电脑前，应更新任务文件、提交并推送。
7. 公开仓库只使用公开资料、模拟数据和脱敏样例。
8. 私有连接器、真实接口信息和生产数据放在独立私有环境中。
9. AI Agent 只有得到用户明确授权时才能提交或推送。

## 任务状态

任务只使用四种状态：

| 状态 | 含义 |
|---|---|
| 待开始 | 范围和验收标准已写清，但尚未开发 |
| 进行中 | 当前主要开发任务 |
| 阻塞 | 无法继续，并已在任务文件中说明原因 |
| 已完成 | 验收标准满足，验证通过，相关提交已经进入 `main` |

## 创建任务

1. 从 [tasks/TEMPLATE.md](tasks/TEMPLATE.md) 复制任务文件。
2. 在 [TASKS.md](TASKS.md) 登记编号、状态、开发位置和下一步。
3. 关联对应的场景文件。
4. 写清目标、不做什么和验收标准。
5. 默认在最新 `main` 开始；需要隔离或审阅时创建 `task/NNN-short-name` 分支。

没有验收标准的事项先记录为想法，不直接进入开发。

## 开始一次开发

在任意电脑上开始前：

```bash
git fetch --prune
git status --short
git switch main
git pull --ff-only
```

如果当前任务明确使用任务分支，在更新 `main` 后切换到记录的 `task/NNN-short-name`，并只做 fast-forward 或明确的分支集成。

然后依次阅读：

1. [TASKS.md](TASKS.md) 中当前任务；
2. 对应的任务文件；
3. 任务文件关联的场景和技术文档；
4. “下一步”中的第一项。

如果本地存在来源不明的未提交修改，先确认来源，不覆盖、不丢弃。

## 开发过程中

- 按任务计划逐项完成，不临时扩大范围；
- 开发者本人每完成一个可独立说明的修改就创建一次小提交；
- 修改代码后立即运行相关检查；
- 产品目标、范围和优先顺序写入 `docs/product/decisions.md`；
- 影响多个场景或修改成本较高的技术取舍创建 ADR；
- 用户可以感知的新增、修改和修复写入 `CHANGELOG.md` 的 `[Unreleased]`，日常更新不读取历史版本；
- 新发现但不属于当前范围的事项，登记为新任务；
- 不把仅存在于聊天记录中的结论当作项目结论。

提交信息使用明确的类型和内容，例如：

```text
feat(agent): add file organization preview
fix(agent): prevent target file overwrite
docs: record TASK-001 validation
```

## 结束一次开发

停止工作或准备换电脑前，必须完成：

1. 更新任务计划中的勾选状态；
2. 写明本次完成内容；
3. 记录执行过的检查及结果；
4. 写明阻塞问题；
5. 把“下一步”收敛为一个可以直接执行的动作；
6. 更新 [TASKS.md](TASKS.md)；
7. 检查是否需要新增 ADR 或更新 Changelog；
8. 检查修改中没有密钥、私有数据或本机专用路径；
9. 开发者本人提交当前修改并推送当前开发位置；AI Agent 仅在得到明确授权时执行。

建议检查：

```bash
git status --short
git diff --check
git log -1 --oneline
git push
```

开发者本人即使尚未完成功能，也应提交一个可以解释的阶段结果，避免进度只保留在某台电脑上。AI Agent 未获提交授权时，应更新任务记录并报告未提交状态。

## 完成任务

任务进入“已完成”前需要满足：

- 验收标准全部完成；
- 相关检查和测试通过；
- 任务文件记录最终实现和验证结果；
- 文档与当前实现一致；
- 重要技术决定已经记录为 ADR；
- 用户可感知的变化已经写入 `[Unreleased]`；
- 没有提交凭据、真实生产数据或无关文件；
- 完成验收、记录和公开仓库检查；使用任务分支时同时按 Pull Request 模板审阅；
- 相关提交已经直接进入 `main`，或通过 Pull Request 合并到 `main`；
- [TASKS.md](TASKS.md) 已更新。

使用任务分支时，合并后删除远端任务分支。其他电脑再次开发前，先更新本地 `main`。

## 私有扩展边界

公开仓库只维护通用场景、公共能力和标准接口。私有身份、权限、连接器、规则和真实数据在独立环境适配，只有不含私有信息的通用改进才能反馈到公开仓库。
