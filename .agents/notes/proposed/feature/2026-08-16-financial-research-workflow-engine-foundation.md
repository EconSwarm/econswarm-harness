# Agent Note: Financial research workflow-engine foundation

Status: proposed

English | [中文](2026-08-16-financial-research-workflow-engine-foundation.zh.md)

## Problem

DeepSeek Harness already exposes the core seams needed for a workflow-first research system, but the repository does not yet have a concrete finance-oriented design that fixes the first deliverable, the execution boundary, or the acceptance bar for that kind of composition.

Without that design, future implementation work can spread across workbench UI, data connectors, specialist agents, and orchestration features at the same time.

That would make the first milestone too large, blur ownership between `workflow`, `subagent`, `tools`, and `session`, and weaken the repo's ability to demonstrate one focused assembled example.

## Proposal

Define the first finance-oriented deliverable as a workflow-first multi-agent research engine for a small team using local or intranet deployment and public data.

The first milestone centers on one mixed-research template that can intake a task, collect public evidence, delegate bounded specialist analysis, aggregate artifacts, and produce a report draft with replayable trace data.

`workflow` owns orchestration and node lifecycle.

`subagent` owns specialist execution units.

`tools` own data retrieval, normalization, calculations, and rule checks.

`session` owns the durable trace used for replay, observability, and later workbench views.

The product shell, private-data connectors, enterprise permissions, and broad template management remain out of scope for this first milestone.

The detailed design lives in [the paired spec](../../../../docs/superpowers/specs/2026-08-16-financial-research-workflow-engine-design.md).

## Expected composition

The first implementation should keep the node vocabulary small: intake, tool, delegation, aggregation, and output.

One standard mixed-research run should support at least statement analysis, news attribution, valuation, and risk review as specialist tasks.

The minimum visible surface should show a task tree, per-node state, failure or retry reasons, and separate artifacts for the evidence package and report draft.

## Alternatives considered

**Start with a full research workbench.** Rejected because the most valuable early proof is reliable execution and observability. A broad UI shell would force premature decisions about product layout, collaboration affordances, and state ownership before the execution kernel is stable.

**Start with a finance skill center only.** Rejected because isolated tools do not prove decomposition, parallel execution, or result aggregation. The repository already has strong tool seams; the missing first proof is the assembled workflow.

**Start with a platform-wide task middle layer.** Rejected for the first milestone because it would optimize for a larger product shape before one end-to-end research run exists. The workflow-first design keeps the first step demonstrable and bounded.

## Acceptance criteria

- The design fixes one first milestone around a workflow-first finance research engine rather than a whole-platform build.
- The milestone is explicitly bounded to local or intranet deployment, public data, and one standard mixed-research template.
- The ownership split between `workflow`, `subagent`, `tools`, and `session` is clear enough to guide later implementation changes.
- The paired spec defines the node model, execution flow, observability requirements, and verification path needed for implementation planning.

## Risks

The narrow first milestone may still attract premature requests for polished UI, more templates, or private-data integration.

The proposal therefore depends on keeping the first acceptance bar tied to execution quality and traceability rather than breadth.

Public-data-only research also limits immediate realism for some finance teams, but that trade-off keeps the first assembled example implementable without external system dependency.
