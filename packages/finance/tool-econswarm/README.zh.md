# dsh-tool-econswarm

[English](README.md) | 中文

模型可见 EconSwarm Consumer。 它在 `ctx.tools` 上注册 `econswarm_list_roles` 与 `econswarm_run_pipeline`。 流水线工具通过一次性子代理委托复现原始七阶段 EconSwarm 编排：分析师、第一层质量门控、多空辩论、Research Manager、Trader、激进/保守/中性风险辩论与 Portfolio Manager。

Consumer 依赖 `ctx.econswarm` 与 `ctx.subagents`。 部署在配置中选择 subagent Provider 与轮次上限；本包不挂载 Provider。

## 配置

`subagentProvider` 指定 `ctx.subagents` Provider（默认 `spawn`）。 `defaultAnalysts` 在流水线调用省略 `analysts` 时提供选择。 `maxDebateRounds` 与 `maxRiskDiscussRounds` 复现原始 LangGraph 循环计数。 `outputLanguage` 向用户可见阶段提示追加原始语言指令。 可选 `provider` 与 `model` 为每个子代理覆盖 `AgentOptions`。

## Model Experience

### Request context and condition

#### What the model sees

工具 schema 通过标准工具注册表加入提示词组装；见工具目录中的 [econswarm_list_roles](../../../docs/tool-catalog.md#econswarm_list_roles) 与 [econswarm_run_pipeline](../../../docs/tool-catalog.md#econswarm_run_pipeline)。 阶段提示由本包组装，并作为子代理输入投递。

#### Token effect

每个流水线阶段是一次独立模型请求。 完整运行花费每个分析师一次请求，再加上质量门控、辩论、经理、Trader、风险与 Portfolio Manager 阶段；上限继承自部署的 agent 与 subagent token 配置。

#### KV Cache effect

阶段提示随 ticker、日期、目标与先前产物变化，因此完整流水线会替换较早的请求内容。 角色目录工具没有模型上下文缓存效应。

## Known Limitations and Deferred Work

- **仅文本结构化输出** - 移植流水线捕获最终文本；原始 Pydantic schema 以提示词契约表达，而非 `outputSchema` 捕获。
- **质量门控** - 第一层硬检查已移植；原始可选 LLM 复审阶段尚未作为独立子代理阶段。
- **行情工具** - 原始 dataflow Vendor 工具不属于本 Consumer。   分析师提示列出原始工具名，因此需要工具调用时应由部署挂载对应数源 Provider 插件。
