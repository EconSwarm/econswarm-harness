# @deepseek-ai/dsh-tool-financial-research

English | [中文](README.zh.md)

This model-facing package exposes the fixed `financial_research` tool. It turns one structured finance request into one foreground `ctx.workflowEngine` run, records package-owned durable Session events, and renders a compact parent-facing summary from the structured workflow result.

## What the model sees

The tool accepts `topic` and `outputFormat`, plus optional `company` and `industry`. The plugin also contributes one `tool:financial_research` system-prompt section telling the model to use this tool only when the user wants the fixed finance workflow over public evidence and specialist finance agents.

## Lifecycle

`execute` requires a calling agent Session, builds the fixed workflow through [`@deepseek-ai/dsh-financial-research`](../financial-research/README.md), starts one workflow run, waits for `run.result`, and always disposes the run in `finally`. Every started run records `tool-financial-research/run-start` before the await and `tool-financial-research/run-end` after settlement, carrying the terminal reason plus the completed artifact kinds when available.

Success returns canonical `{ runId, agentsStarted, result }`, and the tool renderer turns `result` into the compact finance summary. Non-`completed` stop reasons become tool errors instead of partial success.

## Known Limitations and Deferred Work

- **Only the fixed first-phase finance workflow is exposed** — callers cannot alter phases, specialist count, or workflow script.
- **Durable records are run-level only** — this package records start/end markers for the parent Session, not per-specialist child events.
