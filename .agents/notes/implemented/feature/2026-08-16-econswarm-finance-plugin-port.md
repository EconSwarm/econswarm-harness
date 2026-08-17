# Agent Note: EconSwarm finance plugin port

Status: implemented

English | [中文](2026-08-16-econswarm-finance-plugin-port.zh.md)

## Problem

The EconSwarm repository is a Python/LangGraph financial multi-agent engine with 34 analyst roles, a 184-file SKILL.md catalog, and a seven-stage pipeline. DeepSeek Harness has no finance capability family, so deploying EconSwarm on the harness requires porting the domain onto Cordis plugins instead of importing the Python runtime.

## Decision

The port ships as the `packages/finance` group. `@deepseek-ai/dsh-econswarm` owns the analyst registry, role skill bindings, and Layer-1 quality gate. `@deepseek-ai/dsh-skill-econswarm` packages the original 184 SKILL.md files as a `ctx.skills` provider at `BUNDLED_SKILL_RANK`. `@deepseek-ai/dsh-tool-econswarm` registers `econswarm_list_roles` and `econswarm_run_pipeline`; the pipeline consumer reproduces the seven stages as one-shot subagent delegations and applies the ported quality gate in process.

The runnable leaf `examples/econswarm-platform` overlays the headless profile with the three finance rows. Deployment docs, a migration map, and a test report live under `docs/finance`. The original LLM client adapters are replaced by the harness `ctx.llm` seam; the original CLI and Web entry points are replaced by `dsh --profile headless` and the harness Web profile.

The original Python data-vendor router and its A-share/yfinance/Alpha Vantage providers are not yet re-implemented in TypeScript. The role registry keeps the original tool names as metadata, and the migration map records the data layer as a deferred bridge so deployments can mount a provider plugin without changing the domain service.

## Alternatives considered

**Vendoring the Python runtime as a subprocess bridge.** This would preserve every dataflow function immediately, but it would make the npm plugins depend on a Python environment and duplicate the harness subprocess seam. The port keeps the domain and skills harness-native and records the data bridge as a separate consumer.

**One monolithic finance package.** The domain, skill catalog, and tools have different extension roles and consumers. Splitting them mirrors the harness capability-seam pattern and lets a deployment expose role metadata without mounting the pipeline tools.

**Copying LangChain prompts verbatim into TypeScript constants.** The original prompts are Chinese and large; the first port carries concise role summaries and preserves full prompt fidelity as a staged follow-up rather than freezing the entire prompt corpus in one change.

## Consequences

The finance platform is a standard Cordis plugin composition: skills load through `ctx.skills`, pipeline stages delegate through `ctx.subagents`, and model-facing behavior lands in `ctx.tools`. Deployments can swap providers and layers without editing the ported packages.

The packaged skill tree is a snapshot from the upstream Apache-2.0 project and must be re-synced deliberately. The port does not yet provide live market-data tools, structured-output Pydantic captures, delayed reflection, or the original LLM review stage of the quality gate; each is recorded as deferred work in the migration map and package READMEs.
