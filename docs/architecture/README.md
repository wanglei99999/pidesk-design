# DeskBuddy 架构图

本目录保存与架构规范同步维护的静态可视化文件。

## 总体架构

- [SVG](deskbuddy-pi-runner-architecture.svg)
- [PNG](deskbuddy-pi-runner-architecture.png)

展示 React Renderer、Electron Control Plane、独立 Pi Runner、官方 RPC、SQLite、Pi JSONL、受控工具和本地资源之间的边界。

## 任务执行时序

- [SVG](deskbuddy-task-execution-sequence.svg)
- [PNG](deskbuddy-task-execution-sequence.png)

展示任务重新打开、临时 Runner 恢复快照、AgentRun 启动、事件投影、只读工具调用、取消和崩溃处理。

架构含义以 [DeskBuddy Pi Runner 架构设计](../superpowers/specs/2026-08-24-deskbuddy-pi-runner-architecture-design.md) 和 [ADR-0003](../../adr/0003-isolate-pi-in-runner.md) 为准。
