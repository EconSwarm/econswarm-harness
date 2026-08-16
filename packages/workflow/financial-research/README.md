# @deepseek-ai/dsh-financial-research

English | [中文](README.zh.md)

This browser-safe domain package defines the fixed first-phase finance workflow request and result data, plus the helper that turns one research request into one `ctx.workflowEngine.start()` payload.

It owns the finance input and result types, the fixed workflow metadata and script, and the compact renderer for a parent-facing completion summary.

## Workflow

`buildFinancialResearchWorkflow(input)` returns one immutable `{ meta, script, args }` payload for a three-phase workflow: collect evidence, run fixed finance specialists in parallel, and write the final result.

`renderFinancialResearchSummary(result)` turns the structured result into a short text block listing artifact kinds, missing evidence, and the final summary text.

## Model Experience

Indirectly, through a Consumer package that passes the returned workflow payload to `ctx.workflowEngine` and later renders the structured result.

#### KV Cache effect

None directly. This package adds no prompt text, tool schema, or session event.

## Known Limitations and Deferred Work

- **Fixed specialist policy** — the phase order and specialist set are hard-coded for the first finance milestone.
- **First-milestone artifact vocabulary** — the result types cover the public-evidence workflow only and do not yet model private-data enrichment or evaluator outputs.
