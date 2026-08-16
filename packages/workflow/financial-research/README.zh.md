# @deepseek-ai/dsh-financial-research

[English](README.md) | 中文

这个浏览器安全的领域包定义了第一阶段固定金融研究工作流的请求与结果数据，以及把一次研究请求转换成一次 `ctx.workflowEngine.start()` payload 的辅助函数。

它拥有金融研究输入与结果类型、固定工作流的元数据与脚本，以及面向父级调用方的紧凑完成摘要渲染器。

## 工作流

`buildFinancialResearchWorkflow(input)` 返回一个不可变的 `{ meta, script, args }` payload，对应三阶段流程：收集证据、并行运行固定金融专责分析、撰写最终结果。

`renderFinancialResearchSummary(result)` 把结构化结果转换成一段简短文本，列出产物类型、缺失证据和最终摘要。

## 模型体验

通过消费方包间接影响模型；消费方会把返回的工作流 payload 交给 `ctx.workflowEngine`，并在结束后渲染结构化结果。

#### KV Cache 影响

没有直接影响。这个包不增加提示词、工具 schema 或会话事件。

## 已知限制与暂缓事项

- **专责策略固定**：阶段顺序和专责集合都为第一阶段金融里程碑写死。
- **产物词汇仍是第一阶段范围**：结果类型目前只覆盖公开证据工作流，还没有描述私有数据增强或评审器输出。
