# EconSwarm migration map

English | [中文](migration-map.zh.md)


This table maps the original EconSwarm modules to the DeepSeek Harness plugin packages and documents what is ported in source, what is carried as packaged assets, and what remains deferred.

| Original module | Original responsibility | Ported home | Status |
|---|---|---|---|
| `swarmagents/graph/trading_graph.py` | Main entry: config, LLM selection, graph compile, propagate | `packages/finance/tool-econswarm/src/pipeline.ts` | Ported as subagent orchestration |
| `swarmagents/graph/setup.py` | LangGraph node wiring and analyst registry | `packages/finance/econswarm/src/roles.ts` | Ported as data-driven role registry |
| `swarmagents/graph/conditional_logic.py` | Debate/risk round routing | `tool-econswarm` `maxDebateRounds`/`maxRiskDiscussRounds` | Ported as loop counters |
| `swarmagents/graph/checkpointer.py` | SQLite per-ticker checkpoint | Harness session persistence | Deferred; session log owns durability |
| `swarmagents/graph/reflection.py` | Delayed return reflection | Deferred | Deferred |
| `swarmagents/graph/signal_processing.py` | Deterministic signal extraction | Deferred | Deferred |
| `swarmagents/agents/__init__.py` | 34 agent factories | `roles.ts` | Ported as role metadata; full prompts deferred |
| `swarmagents/agents/quality_gate.py` | Layer-1 hard checks + LLM review | `packages/finance/econswarm/src/quality.ts` | Layer-1 ported; LLM review deferred |
| `swarmagents/skills/registry.py` | SKILL.md loading, caching, querying | `packages/finance/skills-econswarm/src/index.ts` | Ported with all 184 assets |
| `swarmskills/` | 184 financial SKILL.md files | `packages/finance/skills-econswarm/assets/swarmskills` | Carried as packaged assets |
| `swarmagents/dataflows/interface.py` | Vendor routing and fallback | Deferred bridge | Deferred |
| `swarmagents/dataflows/a_stock.py` | A-share data providers | Deferred bridge | Deferred |
| `swarmagents/dataflows/y_finance.py` | yfinance provider | Deferred bridge | Deferred |
| `swarmagents/dataflows/alpha_vantage.py` | Alpha Vantage provider | Deferred bridge | Deferred |
| `swarmagents/llm_clients/` | Multi-provider LLM clients | DeepSeek Harness `ctx.llm` adapters | Replaced by framework seam |
| `cli/main.py` | Typer+Rich CLI | `examples/econswarm-platform/start.sh` | Replaced by `dsh --profile headless` |
| `web/` | FastAPI+Vite+React UI | Harness Web profile | Replaced by framework web surface |

## Porting principles

The port preserves the original module boundaries as data, providers, and consumers instead of importing Python runtime code. The workflow engine becomes one-shot subagent delegation; the skill registry becomes a packaged `ctx.skills` provider; the agent factory registry becomes static role data; the LLM clients are replaced by the framework adapter registry.

Original LangGraph state transitions map to the stage loop in `pipeline.ts`: analysts run serially in request order, Layer-1 quality gate runs in process, bull/bear debate alternates for `maxDebateRounds`, and the risk debate alternates aggressive/conservative/neutral for `maxRiskDiscussRounds`. `chainMode` maps to the analysts -> quality gate -> Portfolio Manager branch.
