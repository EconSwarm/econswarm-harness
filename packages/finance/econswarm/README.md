# dsh-econswarm

English | [中文](README.zh.md)


The EconSwarm financial multi-agent domain service. It owns the ported 34-role analyst registry, per-role skill bindings, the seven-core default selection, and the Layer-1 quality-gate functions from the original EconSwarm LangGraph engine. It registers `ctx.econswarm`.

The package is the Service Definition half of the finance plugin family. Sibling packages provide the packaged skill catalog (`@deepseek-ai/dsh-skill-econswarm`) and the model-facing pipeline consumer (`@deepseek-ai/dsh-tool-econswarm`). A deployment that only wants role metadata can mount this package alone.

## Public API

`ctx.econswarm.listRoles()` returns every ported analyst and orchestration role. `ctx.econswarm.getRole(id)` resolves one role. `ctx.econswarm.defaultAnalysts()` returns the original seven-core default. `hardCheckReport(report)` and `hardCheckQuality(reports)` reproduce the original A-F Layer-1 checks.

## Extension points

`AnalystRole` is a data record, not a plugin registry. Deployments that need additional roles register their own model-facing tools and compose their own orchestration; this service keeps the ported baseline stable and inspectable.

## Model Experience

Indirectly, through `@deepseek-ai/dsh-tool-econswarm`, which renders role metadata and pipeline artifacts into model tool results.

#### KV Cache effect

Does not invalidate; this package adds no model-request content.

## Known Limitations and Deferred Work

- **Prompt-fidelity port** — role records carry concise English summaries and original skill bindings, not the full Chinese LangChain system prompts.   Full prompt transcripts remain in the upstream EconSwarm Python source and are staged for a follow-up prompt-asset migration.
- **Data providers** — the original Python dataflow vendors are not re-implemented in TypeScript here; deployments should mount a bridge or provider plugin when model-facing analyst tools need live market data.
