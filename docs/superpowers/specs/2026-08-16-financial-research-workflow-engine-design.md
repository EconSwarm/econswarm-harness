# Financial Research Multi-Agent Workflow Engine Design

English | [中文](2026-08-16-financial-research-workflow-engine-design.zh.md)

## Overview

This document defines the first subproject for a financial analysis platform built on DeepSeek Harness: a workflow-first multi-agent research engine for a small research team.

The target deployment is local or intranet-hosted.

The first release uses public data and supports mixed research workloads that combine company analysis, industry context, and lightweight quantitative checks.

The engine is the execution core rather than the full product.

It must let a team submit a research task, decompose that task into parallel specialist work, observe progress, review intermediate evidence, and receive a report draft and structured artifacts with session-backed traceability.

## Goals

- Run one standard mixed-research workflow from task intake to report draft without manual orchestration.
- Balance three success signals in one MVP: stable execution, useful output quality, and clear observability.
- Keep the design extensible so a later research workbench and finance skill center can reuse the same execution core.
- Favor DeepSeek Harness seams that already exist: `workflow`, `subagent`, `tools`, `session`, and remote-facing APIs.

## Architecture

The design treats `packages/workflow` as the orchestration owner.

Workflow owns task templates, node dependencies, node lifecycle, retries, cancellation, and final aggregation.

`packages/subagent` supplies the execution units for specialist analysis.

Subagents do not own global flow control.

They receive bounded task context, execute a focused analysis step, and return structured output or a structured failure.

The tool layer supplies public-data retrieval, normalization, calculation, export, and rule checks.

The tool layer never hides business flow inside one tool call.

`packages/session` holds the durable trace for model-visible context, workflow progress, subagent reports, intermediate artifacts, and final outputs.

That log-backed trace is the audit and replay source for a later workbench.

The first-phase user surface can stay thin.

A chat or API entry point starts a research job, while a lightweight workbench view reads task state, logs, and artifacts from the execution core.

## Core Model

The engine defines four primary objects.

`Research Job` is the user request plus template choice, output target, priority, and entry metadata.

`Workflow Run` is one materialized execution of a template for that job, including the node graph, status, dependencies, timing, and terminal reason.

`Node Run` is one step execution inside the workflow.

A node may run directly through a tool call or indirectly through a delegated subagent task.

`Artifact` is any persisted intermediate or final output, such as a source bundle, valuation summary, risk list, or report draft.

## Node Types

The first phase keeps the node vocabulary narrow.

`Intake` nodes validate inputs, resolve the template, initialize session trace data, and build shared task context.

`Tool` nodes gather public material, normalize documents, compute indicators, and prepare reusable structured evidence.

`Delegation` nodes send bounded specialist tasks to subagents such as financial-statement analysis, news attribution, valuation, and risk review.

`Aggregation` nodes merge structured outputs, detect missing evidence, and build the consolidated evidence package used downstream.

`Output` nodes generate the final summary, report draft, and task-level completion payload.

The design deliberately excludes a large custom DSL, cross-workflow nesting, complex manual approval nodes, and long-horizon schedulers from the first phase.

## Execution Flow

One standard mixed-research run follows this path.

The user submits a theme such as a company's investment case under an industry cycle.

The engine creates a `Research Job`, writes the initial session context, and expands the selected workflow template into a concrete `Workflow Run`.

Tool nodes collect public data, earnings material, and recent news, then normalize those inputs into reusable evidence.

Routing logic creates parallel delegation nodes for specialist agents.

At minimum the first phase should support statement analysis, news attribution, valuation, and risk review.

Each specialist returns a structured result that names what it concluded, which evidence it used, and what remains missing.

An aggregation node merges those results into one evidence package.

An output node turns that package into a report draft, a concise conclusion set, and a task summary suitable for the workbench.

The run then closes by persisting artifacts and terminal state into session-backed storage.

## State, Recovery, and Observability

`Workflow Run` moves through `Created`, `Planning`, `Running`, and one terminal state of `Completed`, `Failed`, or `Cancelled`.

`Node Run` moves through `Pending`, `Ready`, `Running`, and one terminal state of `Succeeded`, `Failed`, or `Skipped`.

The first phase supports limited automatic retries for tool failures.

Delegation failures must return structured error data instead of opaque text whenever the underlying provider can do so.

Non-critical nodes may degrade and let the run continue, but the final report must name missing evidence and failed steps.

The design does not require arbitrary checkpoint restart, cross-day resumption, or automatic workflow rewriting in the first phase.

The minimum observable surface shows a task tree, per-node phase logs, specialist ownership, retry and failure reasons, and an artifact panel that can open the evidence package, risk list, and report draft separately.

Harness workflow events, subagent reports, and session logs together provide that view.

## First-Phase Scope

The first phase must ship one complete mixed-research template, three to four specialist subagents, the five node types in this document, a public-data tool set that can support the template end to end, and a minimal task-state surface for operators or researchers.

The first phase does not include enterprise-grade RBAC, approval flows, private data connectors, broad template management, long-running schedules, or a polished end-user product shell.

The point is to prove the execution kernel, not to finish the whole finance platform.

## Verification

Unit tests should cover node lifecycle transitions, dependency resolution, retry limits, degradation behavior, and artifact aggregation.

Integration tests should run one complete mixed-research path across intake, tool execution, parallel specialist analysis, aggregation, and output generation.

Failure-path integration tests should cover a retryable tool failure, a terminal specialist failure, and a non-critical degraded path.

Because the output is product-visible and model-visible, the first implementation should add or update keyless snapshots for task-tree summaries, important execution-state messages, and final research-result output.

A runnable example should demonstrate the same end-to-end flow that the tests pin.

Acceptance for the first phase is simple: the workflow completes reliably, the team can observe what happened, the result links back to supporting evidence, and one added specialist or tool does not require a rewrite of the core orchestrator.

## Follow-On Work

Once the execution core is stable, the next subprojects are a richer research workbench, a finance-oriented skill center, more research templates, and private-data integration.

Those later additions should consume this engine rather than replace it.
