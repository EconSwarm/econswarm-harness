# @deepseek-ai/dsh-tool-financial-research

[English](README.md) | 中文

这个面向模型的包公开固定的 `financial_research` 工具。它把一次结构化金融研究请求转换成一次前台 `ctx.workflowEngine` 运行，记录包自有的 durable Session 事件，并从结构化工作流结果渲染一段面向父级的紧凑摘要。

## 模型看到的内容

工具接受 `topic` 和 `outputFormat`，并可选接受 `company` 与 `industry`。插件还会贡献一个 `tool:financial_research` 系统提示词段，告诉模型只有在用户需要基于公开证据和金融专责 agent 的固定金融工作流时才使用该工具。

## 生命周期

`execute` 要求存在调用方 agent Session，通过 [`@deepseek-ai/dsh-financial-research`](../financial-research/README.md) 构建固定工作流，启动一次工作流运行，等待 `run.result`，并在 `finally` 中始终 dispose 该运行。每次已启动的运行都会在等待前记录 `tool-financial-research/run-start`，并在结算后记录 `tool-financial-research/run-end`；若有完成结果，还会携带终态原因和产物类型列表。

成功时返回规范的 `{ runId, agentsStarted, result }`，工具渲染器再把 `result` 转换成紧凑的金融研究摘要。非 `completed` 的结束原因会变成工具错误，而不是局部成功。

## 已知限制与暂缓事项

- **只公开固定的第一阶段金融工作流**：调用方不能改变阶段、专责数量或工作流脚本。
- **持久记录只到运行级别**：本包只给父级 Session 记录开始/结束标记，不记录每个专责子运行的事件。
