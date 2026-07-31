# TASK-001：验证 Pi 办公 Agent 最小运行闭环

## 基本信息

- 状态：进行中
- 分支：`task/001-file-organization`
- 最后更新：2026-07-31
- 关联场景：[根据内容批量重命名文件](../scenarios/001-file-organization.md)
- 依赖任务：无

## 目标

以文本文件批量重命名作为受控实验，验证 PiDesk 调用 Pi 完成“分析—Tool 调用—结构化计划—预览—确认—安全执行—记录”的最小运行闭环，并用代码比较 SDK 与 RPC 的接入边界。

本任务是运行基础和安全边界验证，不承担 PiDesk 首个完整产品功能的任务、工作区、持续上下文和产物体验。

## 本次范围

- 以本地命令行作为最小产品入口；
- 用户明确指定一个工作目录；
- 只读取根层 UTF-8 `.txt` 和 `.md` 文件；
- 根据内容提取日期、主题和类型；
- 生成 `YYYY-MM-DD_主题_类型.扩展名` 格式的建议；
- 执行前展示完整计划、依据和冲突；
- 用户确认后只执行已批准的重命名；
- 对越界、非法名称、目标冲突和执行前文件变化进行确定性检查；
- 运行时出现失败后停止剩余操作，并区分成功、失败和未执行项；
- 保存执行前计划和执行后逐项结果；
- 使用模拟文件和固定模型响应完成自动测试。

## 不在本次范围

- 移动、删除或覆盖文件；
- 递归读取子目录；
- 解析 Word、Excel、PPT、PDF 或图片；
- 自定义任意命名模板；
- Session 持久化和跨设备继续运行；
- Skill、自动任务、远程控制和多 Agent；
- 真实办公服务或私有文件系统；
- 完整桌面界面；
- 首个用户可感知的产品纵向切片。

## 验收标准

- [ ] 可以用模拟目录完成一次只读分析并生成结构化计划；
- [ ] 确认前和用户取消后不修改任何文件；
- [ ] 确认后执行内容与预览计划一致；
- [ ] 目录外路径、非法名称、已有目标和重复目标不会执行；
- [ ] 确认后发生变化的源文件不会执行；
- [ ] 运行时失败后停止剩余操作，并准确记录已执行和未执行项；
- [ ] 无法判断和部分失败都有逐项原因；
- [ ] 保存的计划、结果与实际文件状态一致；
- [ ] 正常、冲突、取消、越界和文件变化样例通过自动测试；
- [ ] SDK 与 RPC 的比较结论有可复现实验依据；
- [ ] Pi 学习结论和新增开发规则带有代码或测试依据；
- [ ] 最小使用说明与实现一致。

## 接入方式比较问题

接入选择分成两个维度：

- 能力层次：使用 `pi-coding-agent`，还是直接使用 `pi-agent-core`；
- 进程边界：通过同进程 SDK 接入，还是通过独立进程 RPC 接入。

最小阅读和代码实验只回答以下问题：

1. `pi-coding-agent` 能否替换编程任务的默认提示词，并且只启用 PiDesk 明确注册的 Tool；
2. PiDesk 能否接收任务生命周期、模型输出、Tool 调用、取消和错误事件，并转换为自己的运行记录；
3. 用户取消、操作确认和产生副作用的 Tool 能否由 PiDesk 控制，而不是由模型直接决定；
4. Pi 的 Agent Session 与 PiDesk 的任务、工作区和产物状态能否保持清楚边界；
5. 第一版本地 Node.js 产品是否存在必须使用 RPC 进程隔离才能解决的问题；
6. PiDesk 适配层能否避免 Pi 类型扩散到产品核心，并使用 faux provider 完成确定性测试。

默认先检查 `pi-coding-agent` SDK。只有发现编程默认行为无法替换、产品控制能力不足或必须进程隔离时，才分别下沉 `pi-agent-core` 或执行 RPC 实验。

## 源码阅读记录

固定版本：Pi `0.80.10`，提交 `eb8dd587e780b5393f53635002004cb2b5ef8f92`。

### 问题 1：默认提示词与 Tool

结论：`pi-coding-agent` SDK 可以替换编程任务的默认主体，并通过 allowlist 只开放 PiDesk Tool。

证据：

- `DefaultResourceLoader.systemPromptOverride` 可以提供自定义系统提示词；
- `buildSystemPrompt()` 中的 `customPrompt` 替换默认 coding-agent 主体，但仍按配置附加上下文、Skill 和当前工作目录；
- `CreateAgentSessionOptions.tools` 是内置、扩展和自定义 Tool 的最终 allowlist；
- `customTools` 注册 PiDesk Tool，`noTools: "all"` 可以从无 Tool 开始；
- PiDesk 需要显式关闭当前场景不需要的上下文、Skill、Extension 和提示词发现，不能只替换提示词文本。

### 问题 2：事件

结论：公开事件足以让 PiDesk 建立自己的运行状态和记录，具体映射仍需代码验证。

证据：

- `AgentSessionEvent` 包含 Agent、Turn、Message 和 Tool 执行生命周期；
- coding-agent 增加 `agent_settled`、队列、压缩和自动重试事件；
- `subscribe()` 支持多个监听器并返回取消订阅函数；
- Session 内部持久化与外部事件监听分开，PiDesk 可以在适配层转换事件而不修改 Pi。

### 问题 3：取消、确认和副作用

结论：分析过程可以取消，Tool 可以阻止，但第一版产品确认不应实现为模型运行中的临时放行。

证据与决定：

- `AgentSession.abort()` 调用底层 `Agent.abort()` 并等待空闲；
- 自定义 Tool 收到同一次 Agent 运行的 `AbortSignal`；
- Tool 参数校验后、执行前会经过 `beforeToolCall`，返回 `block: true` 时 agent-core 不执行 Tool，而是生成错误 Tool 结果；
- 第一版让 Agent 只生成结构化计划；PiDesk 校验并展示固定计划；用户确认后由确定性执行器执行；
- 未经确认的副作用能力不暴露给模型，不能把模型调用 Tool 等同于用户授权。

### 问题 4：Session 与产品状态

结论：Pi Session 与 PiDesk 任务可以保持清楚边界，TASK-001 不需要直接采用 Pi 的持久化格式。

证据与边界：

- Pi Session JSONL 保存对话消息、Tool 结果、模型、思考级别、压缩和分支；
- `SessionManager.inMemory()` 可以关闭文件持久化；
- PiDesk 任务保存用户目标、工作区授权、审批状态、结构化计划、执行记录和产物；
- PiDesk 适配层可以持有 `AgentSession` 和 `sessionId`，产品核心不直接操作 `SessionManager` 或 Pi 消息类型；
- TASK-001 先使用内存 Session；跨设备会话和产品任务持久化留给后续产品切片。

### 问题 5：SDK 与 RPC

结论：第一版本地 Node.js/TypeScript 产品没有必须使用 RPC 解决的问题，优先使用 SDK。

证据：

- RPC 与 SDK 复用同一个 `AgentSession`，主要增加子进程隔离和跨语言 JSONL 协议；
- Pi 官方文档建议 Node.js 应用优先直接使用 `AgentSession`；
- SDK 可以直接注册 TypeScript 自定义 Tool，RPC 的自定义能力通常需要在子进程中加载 Extension；
- RPC 还需要管理子进程生命周期、命令响应、异步事件、Extension UI 请求和协议类型映射；
- 出现非 Node.js 主程序、Agent 崩溃隔离、独立升级或后台工作进程需求时再重新评估 RPC。

### 问题 6：适配层与确定性测试

结论：PiDesk 可以通过自有接口隔离 Pi，并使用公开 faux provider 完成无网络测试。

证据与边界：

- `@earendil-works/pi-ai/providers/faux` 是发布包公开导出，可以提供固定模型响应；
- `fauxProvider()` 使用显式 Models 集合，不需要网络或真实认证；
- `AgentRuntime`、运行事件和结构化计划使用 PiDesk 自有类型；
- `PiCodingAgentAdapter` 负责把 Pi Session、事件、错误和用量转换为 PiDesk 类型；
- 产品核心单元测试使用假的 `AgentRuntime`，适配层集成测试使用 Pi faux provider；
- 不依赖 `packages/coding-agent/test/` 中未发布的内部测试工具。

## SDK 最小代码实验

### 目的

只验证 `pi-coding-agent` 公开 SDK 是否满足第一版接入边界，不实现文件重命名，不评价真实模型质量。

### 固定条件

- Node.js 版本满足 Pi `>=22.19.0`；
- 依赖固定为 Pi `0.80.10` 对应版本；
- 只从发布包公开入口导入；
- 使用 `fauxProvider()`，不访问网络，不读取真实凭据；
- 使用内存 Settings 和 Session；
- 关闭 Extension、Skill、Prompt Template、主题和项目上下文发现；
- 使用模拟输入，不读写用户文件。

### 实验 A：提示词、Tool 与事件

输入：

- PiDesk 自定义系统提示词；
- 唯一自定义 Tool `inspect_workspace`；
- 固定 faux 响应先调用该 Tool，再返回完成消息。

观察点：

- 模型上下文不包含 coding-agent 默认主体；
- 模型可见 Tool 只有 `inspect_workspace`；
- Tool 收到经过 Schema 校验的参数并返回结构化详情；
- 适配层能观察 Agent、Message、Tool 和 `agent_settled` 事件；
- Session 不创建持久化文件。

通过条件：

- 所有断言使用公开 API 完成；
- 实际 Tool 调用次数、参数和结果与固定响应一致；
- 事件足以映射出开始、执行 Tool、完成或失败状态；
- 测试结束后没有未消费响应和未清理的运行时资源。

### 实验 B：取消

输入：

- 固定 faux 响应调用一个等待型自定义 Tool；
- Tool 开始后由宿主调用 `AgentSession.abort()`。

观察点：

- Tool 收到的 `AbortSignal` 进入 aborted 状态；
- `abort()` 等待 Agent 回到空闲；
- 最终事件可以区分取消与正常完成；
- 取消后不再执行后续 Tool 或副作用。

通过条件：

- 测试不依赖固定延时；
- 取消完成后 Session 处于空闲状态；
- 运行记录能得到明确的取消结果。

### 不在本实验验证

- RPC、agent-core 直接接入；
- 用户审批弹窗；
- 文件系统权限边界；
- Session 持久化；
- 真实模型、真实凭据和模型输出质量。

## 计划

- [x] 阅读固定版本的 SDK 与 RPC 文档，写出最小比较问题；
- [x] 完成最小 SDK 实验；源码和实验未发现需要 RPC 或直接接入 agent-core 的阻碍；
- [ ] 根据实验确定第一版接入方式，并创建新的 ADR；
- [ ] 定义重命名计划、确认信息和执行结果的数据结构；
- [ ] 实现工作目录与只读文件 Tool；
- [ ] 实现 Agent 结构化建议和确定性计划校验；
- [ ] 实现命令行预览、确认和安全重命名；
- [ ] 实现运行结果记录和错误展示；
- [ ] 编写固定响应下的系统自动测试；
- [ ] 执行真实模型的独立质量样例；
- [ ] 补充使用说明、学习记录和经验证的开发规则。

## 最近进展

### 2026-07-30

- 完成：将第一版收窄为根层 `.txt`、`.md` 文件的批量重命名；
- 验证：已核对 Pi `0.80.10` 的 SDK、RPC 和运行方式文档，尚未完成代码实验；
- 结论：SDK 与 RPC 都保留为候选；批量重命名仅作为受控技术实验，移动文件、Office 解析、Skill、工作区和桌面界面不进入本任务。
- 文档检查：本地 Markdown 链接、旧文件引用和 Git 空白检查通过。

### 2026-07-31

- 完成：将接入选择拆分为“coding-agent 或 agent-core”与“SDK 或 RPC”两个维度，并完成 `pi-coding-agent` SDK 最小代码实验；
- 工程：建立 Node.js/TypeScript 最小结构，固定 Pi `0.80.10`、TypeScript、Vitest 和 TypeBox 依赖版本；
- 实验 A：确认可以替换默认提示词、只开放 PiDesk 注册的 Tool、接收完整生命周期事件并使用内存 Session；
- 实验 B：确认 `AgentSession.abort()` 会把取消信号传给正在运行的自定义 Tool，并等待 Session 回到空闲；
- 兼容性：同为 `0.80.10`，本地 Pi 源码包含 `registerNativeProvider()`，npm 发布包公开类型只提供 `registerProvider()`；实现以实际安装的发布包 API 为准；
- 学习结论：agent-core 负责 Agent Loop 和运行状态，coding-agent 提供更完整的产品运行能力；SDK 与 RPC 是同进程和跨进程两种接入方式；Provider 是模型适配边界，faux provider 是用于确定性测试的假模型实现；
- 暂定选择：通过 PiDesk 自有 `AgentRuntime` 适配层接入 `pi-coding-agent` SDK，第一版不直接依赖 agent-core，不使用 RPC；
- 测试边界：faux provider 验证系统正确性；真实模型质量需要后续单独评估，不能由该实验代替；
- 交接：当前机器系统默认 Node.js 为 `16.20.2`，不满足项目要求；运行项目命令前需要切换到 Node.js `>=22.19.0`。

## 验证记录

| 命令或检查 | 结果 |
|---|---|
| 本地 Markdown 链接、旧文件引用、`git diff --check` | 通过 |
| SDK、agent-core、RPC 接入问题 1—6 源码阅读 | 通过，结论记录在本任务 |
| `npm run check`（Node.js `24.9.0`） | 通过，无 TypeScript 错误 |
| `npm ls --depth=0` 与 lockfile 检查 | 通过；直接依赖版本与 `package.json` 一致，安装脚本已通过 `--ignore-scripts` 禁用并检查 |
| `npm audit --registry=https://registry.npmjs.org/` | 发现 Pi shrinkwrap 中 1 个高危 `brace-expansion` DoS 和 1 个中危 `protobufjs` DoS；自动修复不能更新 |
| `vitest run test/pi-coding-agent-sdk.test.ts`（Node.js `24.9.0`） | 通过，1 个测试文件、2 个测试 |
| SDK 最小实验 | 通过：提示词、Tool 白名单、事件、内存 Session、取消传播均符合预期 |
| 系统默认 Node.js `16.20.2` 执行 `npm run test:sdk` | 不支持，Vitest 启动前失败；项目要求 Node.js `>=22.19.0` |
| RPC 最小实验 | 未执行；当前没有必须使用 RPC 的证据 |

## 阻塞问题

- 无。

## 待处理风险

- Pi `0.80.10` 发布包的 shrinkwrap 固定了存在 DoS 告警的 `brace-expansion 5.0.6` 和 `protobufjs 7.6.4`；当前 faux 实验不处理外部输入，不受阻塞，但进入产品功能实现前必须选择升级后的 Pi 版本或经过验证的依赖覆盖方案。
- `npm audit fix --package-lock-only --ignore-scripts --dry-run` 无法自动修改这两个嵌套依赖，因此不能把自动修复视为已解决。

## 相关记录

- ADR：[ADR-0001：使用 Pi 作为 Agent 运行基础](../adr/0001-use-pi-as-agent-runtime.md)；
- ADR 需求：需要新增接入方式 ADR，记录 `pi-coding-agent` SDK、PiDesk 自有适配层以及暂不使用 RPC/直接接入 agent-core 的决定；
- 技术计划：[Pi 接入计划](../04-pi-integration-plan.md)；
- 后续产品切片：[产品路线阶段 2](../05-product-roadmap.md)；
- Changelog：本次仅建立内部实验和测试基础，不产生用户可感知变化，暂不记录。

## 下一步

- 与用户一起创建并评审 Pi 接入方式 ADR，明确 `AgentRuntime` 的职责边界；ADR 确认前不继续实现业务功能。

## 完成记录

- 合并提交：待填写
- 完成日期：待填写
- 最终验证：待填写
- 后续任务：待填写
