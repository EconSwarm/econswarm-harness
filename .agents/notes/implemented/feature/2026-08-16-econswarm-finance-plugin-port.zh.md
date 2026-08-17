# Agent Note: EconSwarm 金融插件移植

Status: implemented

[English](2026-08-16-econswarm-finance-plugin-port.md) | 中文

## Problem

EconSwarm 是一个 Python/LangGraph 金融多智能体引擎，包含 34 个分析师角色、184 个 SKILL.md 技能文件和七阶段流水线。 DeepSeek Harness 没有金融能力族，在 harness 上部署 EconSwarm 需要把领域逻辑移植为 Cordis 插件，而不是导入 Python 运行时。

## Decision

移植以 `packages/finance` 插件组发布。 `@deepseek-ai/dsh-econswarm` 拥有分析师注册表、角色技能绑定和第一层质量门控。 `@deepseek-ai/dsh-skill-econswarm` 把原始 184 个 SKILL.md 打包为 `ctx.skills` Provider，使用 `BUNDLED_SKILL_RANK`。 `@deepseek-ai/dsh-tool-econswarm` 注册 `econswarm_list_roles` 和 `econswarm_run_pipeline`；流水线 Consumer 以一次性子代理委托复现七阶段流程，并在进程内执行移植后的质量门控。

可运行示例 `examples/econswarm-platform` 在 headless profile 上叠加三个 finance 插件行。 部署文档、迁移对照表和测试报告位于 `docs/finance`。 原始 LLM 客户端适配器由 harness `ctx.llm` 接缝替代；原始 CLI 和 Web 入口由 `dsh --profile headless` 与 harness Web profile 替代。

原始 Python 数据源路由及其 A 股、yfinance、Alpha Vantage Provider 尚未以 TypeScript 重新实现。 角色注册表保留原始工具名作为元数据，迁移对照表把数据层记录为待实现的桥接，使部署可以在不修改领域服务的前提下挂载数据 Provider。

## Alternatives considered

**以子进程桥接方式打包 Python 运行时。** 这会立即保留全部数据流函数，但会让 npm 插件依赖 Python 环境，并重复 harness 的 subprocess 接缝。 本次移植保持领域和技能为 harness 原生插件，并把数据桥接记录为独立 Consumer。

**使用单一金融包。** 领域、技能目录和工具具有不同的扩展角色和 Consumer。 拆分符合 harness 能力接缝模式，也让部署可以只挂载角色元数据而不安装流水线工具。

**把 LangChain 提示词原样复制为 TypeScript 常量。** 原始提示词为中文且体量很大；首轮移植携带简洁角色摘要，并把完整提示词保真度作为后续阶段，而不是在一次变更中冻结整个提示词语料。

## Consequences

金融平台是标准 Cordis 插件组合：技能通过 `ctx.skills` 加载，流水线阶段通过 `ctx.subagents` 委托，模型可见行为落在 `ctx.tools`。 部署可以在不修改移植包的前提下替换 Provider 和叠加层。

打包技能目录是上游 Apache-2.0 项目的快照，需要刻意重新同步。 本次移植尚未提供实时行情工具、Pydantic 结构化输出捕获、延迟反思或质量门控的 LLM 复审阶段；这些均记录在迁移对照表和包 README 的待办中。
