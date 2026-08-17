# dsh-tool-econswarm

English | [中文](README.zh.md)


Model-facing EconSwarm consumer. It registers `econswarm_list_roles` and `econswarm_run_pipeline` on `ctx.tools`. The pipeline tool reproduces the original seven-stage EconSwarm orchestration through one-shot subagent delegations: analysts, Layer-1 quality gate, bull/bear debate, Research Manager, Trader, aggressive/conservative/neutral risk debate, and Portfolio Manager.

The consumer depends on `ctx.econswarm` and `ctx.subagents`. The deployment selects the subagent provider and round limits in configuration; the package does not mount a provider itself.

## Configuration

`subagentProvider` names the `ctx.subagents` provider (default `spawn`). `defaultAnalysts` supplies the selection when a pipeline call omits `analysts`. `maxDebateRounds` and `maxRiskDiscussRounds` reproduce the original LangGraph loop counters. `outputLanguage` appends the original language instruction to user-facing stage prompts. Optional `provider` and `model` override `AgentOptions` for every child.

## Model Experience

### Request context and condition

#### What the model sees

Tool schemas join prompt assembly through the standard tool registry; see [econswarm_list_roles](../../../docs/tool-catalog.md#econswarm_list_roles) and [econswarm_run_pipeline](../../../docs/tool-catalog.md#econswarm_run_pipeline) in the tool catalog. Stage prompts are assembled by this package and delivered as subagent input.

#### Token effect

Each pipeline stage is an independent model request. A full run costs one request per analyst plus quality-gate, debate, manager, trader, risk, and portfolio-manager stages; bounds are inherited from the deployment's agent and subagent token configuration.

#### KV Cache effect

Stage prompts vary by ticker, date, goal, and prior artifacts, so a full pipeline replaces earlier request content. The role catalog tool has no model-context cache effect.

## Known Limitations and Deferred Work

- **Text-only structured output** — the ported pipeline captures final text; the original Pydantic schemas are represented by prompt contracts, not `outputSchema` captures.
- **Quality gate** — Layer 1 hard checks are ported; the original optional LLM review stage is not yet a separate subagent stage.
- **Market-data tools** — the original dataflow vendor tools are not part of this consumer.   Analyst prompts list the original tool names, so deployments should mount the corresponding data provider plugin when tool use is expected.
