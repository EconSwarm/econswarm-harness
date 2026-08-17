# dsh-econswarm

[English](README.md) | 中文

EconSwarm 金融多智能体领域服务。 它拥有移植后的 34 角色分析师注册表、角色技能绑定、七核心默认选择和来自原始 EconSwarm LangGraph 引擎的第一层质量门控函数。 它注册 `ctx.econswarm`。

该包是 finance 插件族的 Service Definition 一半。 兄弟包提供打包技能目录（`@deepseek-ai/dsh-skill-econswarm`）和模型可见流水线 Consumer（`@deepseek-ai/dsh-tool-econswarm`）。 只需要角色元数据的部署可以单独挂载此包。

## 公开 API

`ctx.econswarm.listRoles()` 返回所有移植的分析师与编排角色。 `ctx.econswarm.getRole(id)` 解析一个角色。 `ctx.econswarm.defaultAnalysts()` 返回原始七核心默认值。 `hardCheckReport(report)` 与 `hardCheckQuality(reports)` 复现原始 A-F 第一层检查。

## 扩展点

`AnalystRole` 是数据记录，不是插件注册表。 需要额外角色的部署自行注册模型可见工具并组合自己的编排；本服务保持移植基线稳定且可检查。

## Model Experience

Indirectly, through `@deepseek-ai/dsh-tool-econswarm`, which renders role metadata and pipeline artifacts into model tool results.

#### KV Cache effect

Does not invalidate; this package adds no model-request content.

## Known Limitations and Deferred Work

- **提示词保真度移植** - 角色记录携带简洁英文摘要与原始技能绑定，而非完整中文 LangChain 系统提示词。   完整提示词仍保留在上游 EconSwarm Python 源码中，计划作为后续提示词资产迁移。
- **数源 Provider** - 原始 Python dataflow Vendor 尚未在此处用 TypeScript 重新实现；当模型可见分析师工具需要实时行情时，部署应挂载桥接或 Provider 插件。
