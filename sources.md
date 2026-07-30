# 资料来源

本文件只登记可以追溯的外部资料及其使用边界。产品分析写入 `research/`，PiDesk 自己的方案写入产品、场景、任务或 ADR 文档。

## 市面产品

### WorkBuddy

WorkBuddy 是当前第一份产品样本，用于了解已经公开的办公场景，不代表 PiDesk 的产品范围。访问日期：2026-07-30。

- [WorkBuddy 简介与实践案例目录](https://www.workbuddy.cn/docs/workbuddy/Overview)
- [文件内容识别与处理](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Practice-One)
- [文档生成与编辑](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Practice-Two)
- [数据分析并可视化](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Practice-Three)
- [每日自动推送资讯简报](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Practice-Five)
- [远程遥控 WorkBuddy](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Practice-Six)
- [AI 自驱动](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Practice-Nine)
- [管理腾讯文档](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Practice-Eleven)
- [自动化](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Automation-Guide)
- [连接器](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Connector)
- [专家和专家团](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Expert-Center)
- [技能](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market)
- [远程助理](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Assistant)
- [默认权限与安全沙箱](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Permission-Modes)

对应研究记录：[WorkBuddy 公开场景](research/products/workbuddy.md)。

## Pi

当前技术分析基于 Pi `0.80.10` 和提交 `eb8dd587e780b5393f53635002004cb2b5ef8f92`。固定版本链接保证 PiDesk 独立克隆后仍可追溯；升级 Pi 时应重新核对这些资料。

- [Pi 仓库说明](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/README.zh.md)
- [pi-ai](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/ai/README.zh.md)
- [pi-agent-core](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/agent/README.zh.md)
- [pi-coding-agent](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/coding-agent/README.zh.md)
- [SDK 文档](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/coding-agent/docs/sdk.md)
- [RPC 文档](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/coding-agent/docs/rpc.md)
- [Skill 文档](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/coding-agent/docs/skills.md)
- [Extension 文档](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/coding-agent/docs/extensions.md)
- [使用方式](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/coding-agent/docs/usage.md)
- [pi-orchestrator](https://github.com/earendil-works/pi/blob/eb8dd587e780b5393f53635002004cb2b5ef8f92/packages/orchestrator/README.zh.md)

## 使用边界

- 外部产品资料只用于确认公开功能、场景和用户结果；
- 研究记录必须区分“来源事实”和“PiDesk 分析”；
- 不根据产品输出反推或猜测其内部实现；
- Pi 文档用于形成候选技术方案，最终结论以 PiDesk 的代码实验为准；
- 标为“候选”“建议”或“待验证”的内容不是外部产品或 Pi 的官方结论。
