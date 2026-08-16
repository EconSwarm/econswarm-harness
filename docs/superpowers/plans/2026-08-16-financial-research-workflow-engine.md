# Financial Research Workflow Engine Implementation Plan

English | [中文](2026-08-16-financial-research-workflow-engine.zh.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fixed-policy `financial_research` workflow tool that runs one mixed-research flow over existing workflow and subagent seams, emits durable trace events, and proves the assembled behavior through a runnable headless snapshot.

**Architecture:** Keep orchestration on the existing `ctx.workflowEngine` seam and avoid changing the worker-thread engine or generic subagent runtime for the first milestone. Add one browser-safe finance domain package for types and workflow construction, one model-facing tool package that starts the fixed workflow and records durable session events, and one headless example snapshot that proves the end-to-end flow.

**Tech Stack:** TypeScript, Cordis plugins, `@deepseek-ai/dsh-workflow`, `@deepseek-ai/dsh-subagent`, `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-session`, Vitest, headless snapshot fixtures, bilingual package READMEs

---

## File Map

### New package: finance domain

- Create: `packages/workflow/financial-research/package.json`
- Create: `packages/workflow/financial-research/tsconfig.json`
- Create: `packages/workflow/financial-research/src/types.ts`
- Create: `packages/workflow/financial-research/src/workflow.ts`
- Create: `packages/workflow/financial-research/src/index.ts`
- Create: `packages/workflow/financial-research/tests/financial-research.spec.ts`
- Create: `packages/workflow/financial-research/README.md`
- Create: `packages/workflow/financial-research/README.zh.md`
- Create: `packages/workflow/financial-research/README.i18n.yaml`

### New package: model-facing finance tool

- Create: `packages/workflow/tool-financial-research/package.json`
- Create: `packages/workflow/tool-financial-research/tsconfig.json`
- Create: `packages/workflow/tool-financial-research/src/types.ts`
- Create: `packages/workflow/tool-financial-research/src/index.ts`
- Create: `packages/workflow/tool-financial-research/tests/tool-financial-research.spec.ts`
- Create: `packages/workflow/tool-financial-research/README.md`
- Create: `packages/workflow/tool-financial-research/README.zh.md`
- Create: `packages/workflow/tool-financial-research/README.i18n.yaml`
- Modify: `packages/core/session/src/known-event-types.ts`
- Modify: `packages/workflow/README.md`
- Modify: `packages/workflow/README.zh.md`
- Modify: `packages/workflow/README.i18n.yaml`

### Runnable proof

- Create: `examples/headless-agent/financial-research.cordis.snapshot.yml`
- Modify: `examples/headless-agent/tests/headless.snapshot.ts`
- Create: `examples/headless-agent/tests/snapshots/financial-research/input.json`
- Create: `examples/headless-agent/tests/snapshots/financial-research/replay.override.json`
- Create: `examples/headless-agent/tests/snapshots/financial-research/stream-json.expected.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.1.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.2.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.3.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.4.jsonl`

## Task 1: Add The Finance Domain Package

**Files:**
- Create: `packages/workflow/financial-research/package.json`
- Create: `packages/workflow/financial-research/tsconfig.json`
- Create: `packages/workflow/financial-research/src/types.ts`
- Create: `packages/workflow/financial-research/src/workflow.ts`
- Create: `packages/workflow/financial-research/src/index.ts`
- Test: `packages/workflow/financial-research/tests/financial-research.spec.ts`
- Doc: `packages/workflow/financial-research/README.md`
- Doc: `packages/workflow/financial-research/README.zh.md`

- [ ] **Step 1: Write the failing domain tests**

```ts
import { describe, expect, it } from 'vitest'
import {
  buildFinancialResearchWorkflow,
  renderFinancialResearchSummary,
  type FinancialResearchResult,
} from '../src/index.ts'

describe('financial research workflow builder', () => {
  it('builds one fixed mixed-research workflow with the expected phases and specialist labels', () => {
    const built = buildFinancialResearchWorkflow({
      topic: 'Evaluate ACME under the current semiconductor cycle',
      company: 'ACME',
      industry: 'Semiconductors',
      outputFormat: 'report-draft',
    })

    expect(built.meta).toEqual({
      name: 'financial-research',
      description: 'Run a mixed financial research workflow over fixed specialist agents.',
      phases: [
        { title: 'Collect evidence' },
        { title: 'Run specialists' },
        { title: 'Write result' },
      ],
    })
    expect(built.script).toContain("label: 'statement-analysis'")
    expect(built.script).toContain("label: 'news-attribution'")
    expect(built.script).toContain("label: 'valuation-analysis'")
    expect(built.script).toContain("label: 'risk-review'")
    expect(built.args).toMatchObject({
      topic: 'Evaluate ACME under the current semiconductor cycle',
      company: 'ACME',
      industry: 'Semiconductors',
      outputFormat: 'report-draft',
    })
  })

  it('renders a compact parent-facing summary from the structured result', () => {
    const result: FinancialResearchResult = {
      topic: 'Evaluate ACME under the current semiconductor cycle',
      summary: 'ACME looks attractive if memory pricing remains firm.',
      artifacts: [
        { kind: 'evidence-bundle', title: 'Source bundle', content: '10-K, earnings call, industry note' },
        { kind: 'report-draft', title: 'Draft report', content: 'Draft body' },
      ],
      missingEvidence: ['Channel-check data'],
    }

    expect(renderFinancialResearchSummary(result)).toContain('financial research completed')
    expect(renderFinancialResearchSummary(result)).toContain('evidence-bundle')
    expect(renderFinancialResearchSummary(result)).toContain('Channel-check data')
  })
})
```

- [ ] **Step 2: Run the new test to verify the package does not exist yet**

Run:

```bash
pnpm vitest run packages/workflow/financial-research/tests/financial-research.spec.ts
```

Expected: FAIL with missing file or missing export errors for `buildFinancialResearchWorkflow`.

- [ ] **Step 3: Write the minimal finance-domain package**

`packages/workflow/financial-research/package.json`

```json
{
  "name": "@deepseek-ai/dsh-financial-research",
  "description": "Fixed mixed-research workflow builder and result types for finance workflows",
  "version": "0.1.0-rc.5",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/types/**/*.js",
    "lib/types/**/*.d.ts"
  ],
  "peerDependencies": {
    "@deepseek-ai/dsh-workflow": "workspace:^"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-workflow": "workspace:^"
  }
}
```

`packages/workflow/financial-research/src/types.ts`

```ts
export type FinancialResearchArtifactKind =
  | 'evidence-bundle'
  | 'statement-summary'
  | 'news-summary'
  | 'valuation-summary'
  | 'risk-list'
  | 'report-draft'

export interface FinancialResearchInput {
  topic: string
  company?: string
  industry?: string
  outputFormat: 'report-draft' | 'brief'
}

export interface FinancialResearchArtifact {
  kind: FinancialResearchArtifactKind
  title: string
  content: string
}

export interface FinancialResearchResult {
  topic: string
  summary: string
  artifacts: FinancialResearchArtifact[]
  missingEvidence: string[]
}
```

`packages/workflow/financial-research/src/workflow.ts`

```ts
import type { WorkflowMeta } from '@deepseek-ai/dsh-workflow'
import type { FinancialResearchInput, FinancialResearchResult } from './types.ts'

export interface FinancialResearchWorkflowDefinition {
  meta: WorkflowMeta
  script: string
  args: FinancialResearchInput
}

export function buildFinancialResearchWorkflow(input: FinancialResearchInput): FinancialResearchWorkflowDefinition {
  const meta: WorkflowMeta = {
    name: 'financial-research',
    description: 'Run a mixed financial research workflow over fixed specialist agents.',
    phases: [
      { title: 'Collect evidence' },
      { title: 'Run specialists' },
      { title: 'Write result' },
    ],
  }
  const script = `
    phase('Collect evidence')
    const evidence = await agent('Collect public filings, news, and sector context for ' + args.topic, { label: 'evidence-collector', phase: 'Collect evidence' })
    phase('Run specialists')
    const [statementSummary, newsSummary, valuationSummary, riskList] = await parallel([
      () => agent('Analyze the financial statements for ' + args.topic + '\\nEvidence:\\n' + evidence, { label: 'statement-analysis', phase: 'Run specialists' }),
      () => agent('Attribute the recent news flow for ' + args.topic + '\\nEvidence:\\n' + evidence, { label: 'news-attribution', phase: 'Run specialists' }),
      () => agent('Produce a valuation view for ' + args.topic + '\\nEvidence:\\n' + evidence, { label: 'valuation-analysis', phase: 'Run specialists' }),
      () => agent('Review key risks for ' + args.topic + '\\nEvidence:\\n' + evidence, { label: 'risk-review', phase: 'Run specialists' }),
    ])
    phase('Write result')
    const report = await agent('Write a concise investment report draft for ' + args.topic + '\\nStatements:\\n' + statementSummary + '\\nNews:\\n' + newsSummary + '\\nValuation:\\n' + valuationSummary + '\\nRisks:\\n' + riskList, { label: 'report-writer', phase: 'Write result' })
    return {
      topic: args.topic,
      summary: String(report),
      artifacts: [
        { kind: 'evidence-bundle', title: 'Collected evidence', content: String(evidence) },
        { kind: 'statement-summary', title: 'Statement summary', content: String(statementSummary) },
        { kind: 'news-summary', title: 'News summary', content: String(newsSummary) },
        { kind: 'valuation-summary', title: 'Valuation summary', content: String(valuationSummary) },
        { kind: 'risk-list', title: 'Risk list', content: String(riskList) },
        { kind: 'report-draft', title: 'Draft report', content: String(report) },
      ],
      missingEvidence: [],
    } satisfies FinancialResearchResult
  `
  return { meta, script, args: input }
}

export function renderFinancialResearchSummary(result: FinancialResearchResult): string {
  return [
    `financial research completed for "${result.topic}".`,
    `Artifacts: ${result.artifacts.map(artifact => artifact.kind).join(', ') || '(none)'}.`,
    `Missing evidence: ${result.missingEvidence.join(', ') || '(none)'}.`,
    'Summary:',
    result.summary,
  ].join('\n')
}
```

`packages/workflow/financial-research/src/index.ts`

```ts
export type {
  FinancialResearchArtifact,
  FinancialResearchArtifactKind,
  FinancialResearchInput,
  FinancialResearchResult,
} from './types.ts'
export {
  buildFinancialResearchWorkflow,
  renderFinancialResearchSummary,
  type FinancialResearchWorkflowDefinition,
} from './workflow.ts'
```

- [ ] **Step 4: Run the focused domain test**

Run:

```bash
pnpm vitest run packages/workflow/financial-research/tests/financial-research.spec.ts
```

Expected: PASS with 2 tests passing.

- [ ] **Step 5: Commit the domain package**

```bash
git add packages/workflow/financial-research
git commit -m "feat: add financial research workflow domain package"
```

## Task 2: Add The `financial_research` Tool And Durable Trace

**Files:**
- Create: `packages/workflow/tool-financial-research/package.json`
- Create: `packages/workflow/tool-financial-research/tsconfig.json`
- Create: `packages/workflow/tool-financial-research/src/types.ts`
- Create: `packages/workflow/tool-financial-research/src/index.ts`
- Test: `packages/workflow/tool-financial-research/tests/tool-financial-research.spec.ts`
- Modify: `packages/core/session/src/known-event-types.ts`
- Modify: `packages/workflow/README.md`
- Modify: `packages/workflow/README.zh.md`

- [ ] **Step 1: Write the failing tool tests**

```ts
import { describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import { Session, SessionId } from '@deepseek-ai/dsh-session'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { WorkflowEngine, WorkflowRunId } from '@deepseek-ai/dsh-workflow'
import * as financialResearchTool from '../src/index.ts'

class StubEngine extends WorkflowEngine {
  requests = []
  settle!: (result: { value: unknown; stopReason: 'completed'; agentsStarted: number }) => void
  start(request) {
    this.requests.push(request)
    return {
      id: WorkflowRunId('finance-run-1'),
      meta: request.meta,
      result: new Promise(resolve => { this.settle = resolve }),
      cancel() {},
      async dispose() {},
    }
  }
}

describe('dsh-tool-financial-research', () => {
  it('starts the fixed workflow and renders the finance summary', async () => {
    const ctx = new Context()
    await ctx.plugin(SystemPrompt)
    await ctx.plugin(ToolRuntime)
    await ctx.plugin(StubEngine)
    await ctx.plugin(financialResearchTool)
    const session = Session.create(SessionId('parent'))
    const parent = { id: session.id, options: {}, session } as unknown as Agent

    const pending = ctx.tools.execute({
      callId: 'call-1',
      signal: new AbortController().signal,
      name: 'financial_research',
      arguments: { topic: 'Evaluate ACME', outputFormat: 'report-draft' },
      agent: parent,
    })

    await vi.waitFor(() => { expect(ctx.workflowEngine.requests).toHaveLength(1) })
    expect(ctx.workflowEngine.requests[0].meta.name).toBe('financial-research')
    ctx.workflowEngine.settle({
      value: {
        topic: 'Evaluate ACME',
        summary: 'ACME is interesting.',
        artifacts: [{ kind: 'report-draft', title: 'Draft', content: 'body' }],
        missingEvidence: [],
      },
      stopReason: 'completed',
      agentsStarted: 5,
    })

    const result = await pending
    expect(result.isError).toBe(false)
    expect(result.content[0].text).toContain('financial research completed')
    expect(session.events.map(event => event.type)).toEqual([
      'tool-financial-research/run-start',
      'tool-financial-research/run-end',
    ])
  })
})
```

- [ ] **Step 2: Run the new tool test**

Run:

```bash
pnpm vitest run packages/workflow/tool-financial-research/tests/tool-financial-research.spec.ts
```

Expected: FAIL because the package and session event names do not exist yet.

- [ ] **Step 3: Write the minimal tool package**

`packages/workflow/tool-financial-research/src/types.ts`

```ts
export interface ToolFinancialResearchRunStartData {
  runId: string
  topic: string
}

export interface ToolFinancialResearchRunEndData {
  runId: string
  stopReason: string
  artifactKinds: string[]
}
```

`packages/workflow/tool-financial-research/src/index.ts`

```ts
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { Session } from '@deepseek-ai/dsh-session'
import type {
  ToolFinancialResearchRunEndData,
  ToolFinancialResearchRunStartData,
} from './types.ts'
import {
  buildFinancialResearchWorkflow,
  renderFinancialResearchSummary,
  type FinancialResearchInput,
  type FinancialResearchResult,
} from '@deepseek-ai/dsh-financial-research'
import type {} from '@deepseek-ai/dsh-system-prompt'

export const name = 'tool-financial-research'
export const inject = ['tools', 'workflowEngine', 'systemPrompt']

function appendRunStart(session: Session, data: ToolFinancialResearchRunStartData): void {
  session.append('tool-financial-research/run-start', data)
}

function appendRunEnd(session: Session, data: ToolFinancialResearchRunEndData): void {
  session.append('tool-financial-research/run-end', data)
}

export function apply(ctx: Context): void {
  ctx.systemPrompt.section({
    name: 'tool:financial_research',
    order: 115,
    text: 'Use the financial_research tool when the user wants one fixed mixed-research workflow over public evidence and specialist finance agents.',
  })

  ctx.tools.register(defineTool({
    name: 'financial_research',
    description: 'Run the fixed finance workflow over evidence collection, specialist analysis, and report writing.',
    parameters: {
      topic: { type: 'string', required: true, description: 'Research topic or question.' },
      company: { type: 'string', description: 'Optional company name.' },
      industry: { type: 'string', description: 'Optional industry or sector.' },
      outputFormat: { type: 'string', required: true, enum: ['report-draft', 'brief'] },
    },
    async execute(args, exec) {
      const agent = exec.agent as Agent | undefined
      if (agent?.session === undefined) return { isError: true, content: [{ type: 'text', text: 'Error: financial_research requires a calling agent session.' }] }
      const built = buildFinancialResearchWorkflow(args as FinancialResearchInput)
      const run = ctx.workflowEngine.start({ ...built, parent: agent, signal: exec.signal })
      appendRunStart(agent.session, { runId: run.id, topic: built.args.topic })
      try {
        const result = await run.result
        if (result.stopReason !== 'completed') {
          return { isError: true, content: [{ type: 'text', text: `Error: financial research run failed: ${result.stopReason}` }] }
        }
        const value = result.value as FinancialResearchResult
        appendRunEnd(agent.session, {
          runId: run.id,
          stopReason: result.stopReason,
          artifactKinds: value.artifacts.map(artifact => artifact.kind),
        })
        return {
          isError: false,
          value: { runId: run.id, agentsStarted: result.agentsStarted, result: value },
          content: [{ type: 'text', text: renderFinancialResearchSummary(value) }],
        }
      } finally {
        await run.dispose()
      }
    },
  }))
}
```

`packages/core/session/src/known-event-types.ts`

```ts
  'tool-financial-research/run-start',
  'tool-financial-research/run-end',
```

`packages/workflow/README.md`

```md
| [`financial-research/`](financial-research/README.md) | Defines finance workflow types and the fixed workflow builder | — |
| [`tool-financial-research/`](tool-financial-research/README.md) | Exposes the fixed finance workflow to the model | registers on `ctx.tools` |
```

- [ ] **Step 4: Run the focused tool test**

Run:

```bash
pnpm vitest run packages/workflow/tool-financial-research/tests/tool-financial-research.spec.ts
```

Expected: PASS with the fixed workflow request and durable run events asserted.

- [ ] **Step 5: Commit the tool package**

```bash
git add packages/workflow/tool-financial-research packages/core/session/src/known-event-types.ts packages/workflow/README.md packages/workflow/README.zh.md packages/workflow/README.i18n.yaml
git commit -m "feat: add financial research workflow tool"
```

## Task 3: Prove The Flow Through The Shipped Headless App

**Files:**
- Create: `examples/headless-agent/financial-research.cordis.snapshot.yml`
- Modify: `examples/headless-agent/tests/headless.snapshot.ts`
- Create: `examples/headless-agent/tests/snapshots/financial-research/input.json`
- Create: `examples/headless-agent/tests/snapshots/financial-research/replay.override.json`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.1.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.2.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.3.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/session.4.jsonl`
- Create or refresh: `examples/headless-agent/tests/snapshots/financial-research/stream-json.expected.jsonl`

- [ ] **Step 1: Add the failing snapshot test entry**

`examples/headless-agent/tests/headless.snapshot.ts`

```ts
it('replays a financial research workflow through the one-shot app', async () => {
  const prompt = await scenarioPrompt(financialResearchScenarioDir, 'financial-research')
  const streamExpected = join(financialResearchScenarioDir, 'stream-json.expected.jsonl')
  let runCwd = ''
  const result = await runLoaderSmoke({
    label: 'financial research headless stream-json snapshot',
    tempDirPrefix: 'headless-snapshot-financial-research-',
    binScript,
    libBinScript: binScript,
    configPath: financialResearchConfigPath,
    binArgs: [financialResearchConfigPath, prompt],
    tsconfigPath,
    env: {
      DSH_SNAPSHOT: 'replay',
      DSH_SNAPSHOT_FILE: join(financialResearchScenarioDir, 'session.jsonl'),
      DSH_SNAPSHOT_OVERRIDE: join(financialResearchScenarioDir, 'replay.override.json'),
      DSH_SNAPSHOT_CHILD_FILES: [
        join(financialResearchScenarioDir, 'session.1.jsonl'),
        join(financialResearchScenarioDir, 'session.2.jsonl'),
        join(financialResearchScenarioDir, 'session.3.jsonl'),
        join(financialResearchScenarioDir, 'session.4.jsonl'),
      ].join(delimiter),
    },
    prepare: (cwd) => { runCwd = cwd },
  })
  expect(result.stderr).toBe('')
  const normalized = normalizeHeadlessStream(result.stdout, runCwd)
  expect(normalized).toBe(await readFile(streamExpected, 'utf8'))
}, LOADER_SMOKE_TEST_TIMEOUT_MS)
```

- [ ] **Step 2: Run the snapshot test to confirm the scenario is missing**

Run:

```bash
pnpm vitest run examples/headless-agent/tests/headless.snapshot.ts -t "financial research headless stream-json snapshot"
```

Expected: FAIL because the scenario directory and config file do not exist yet.

- [ ] **Step 3: Add the headless finance composition and prompt fixture**

`examples/headless-agent/financial-research.cordis.snapshot.yml`

```yaml
plugins:
  - package: '@deepseek-ai/dsh-session-persistence-jsonl'
  - package: '@deepseek-ai/dsh-fs-local'
  - package: '@deepseek-ai/dsh-subprocess-local'
  - package: '@deepseek-ai/dsh-subagent'
  - package: '@deepseek-ai/dsh-subagent-spawn-in-process'
  - package: '@deepseek-ai/dsh-tool-subagent'
  - package: '@deepseek-ai/dsh-tool-subagent-report'
  - package: '@deepseek-ai/dsh-workflow-worker-thread'
    config:
      provider: spawn
      maxConcurrentAgents: 4
  - package: '@deepseek-ai/dsh-tool-financial-research'
```

`examples/headless-agent/tests/snapshots/financial-research/input.json`

```json
{
  "steps": [
    {
      "op": "prompt",
      "text": "Run a financial research workflow on ACME in semiconductors and return a report draft."
    }
  ]
}
```

`examples/headless-agent/tests/snapshots/financial-research/replay.override.json`

```json
{
  "messages": [
    {
      "role": "assistant",
      "content": [
        {
          "type": "tool_call",
          "name": "financial_research",
          "arguments": {
            "topic": "Run a financial research workflow on ACME in semiconductors and return a report draft.",
            "company": "ACME",
            "industry": "Semiconductors",
            "outputFormat": "report-draft"
          }
        }
      ]
    }
  ]
}
```

- [ ] **Step 4: Record and inspect the snapshot fixtures**

Run:

```bash
pnpm vitest run examples/headless-agent/tests/headless.snapshot.ts -t "financial research headless stream-json snapshot"
```

Then refresh the durable fixtures and expected output with the same pattern already used by the other headless scenarios:

```bash
pnpm run test:snapshot:record -- -t "financial research headless stream-json snapshot"
```

Expected: the scenario directory now contains one parent session log, four child session logs, and `stream-json.expected.jsonl`, and the replayed result text includes `financial research completed`.

- [ ] **Step 5: Commit the runnable proof**

```bash
git add examples/headless-agent/financial-research.cordis.snapshot.yml examples/headless-agent/tests/headless.snapshot.ts examples/headless-agent/tests/snapshots/financial-research
git commit -m "test: add headless financial research snapshot"
```

## Task 4: Add Package Documentation And Run Final Checks

**Files:**
- Create: `packages/workflow/financial-research/README.md`
- Create: `packages/workflow/financial-research/README.zh.md`
- Create: `packages/workflow/tool-financial-research/README.md`
- Create: `packages/workflow/tool-financial-research/README.zh.md`
- Modify: `packages/workflow/README.md`
- Modify: `packages/workflow/README.zh.md`

- [ ] **Step 1: Write the package READMEs**

`packages/workflow/financial-research/README.md`

```md
# @deepseek-ai/dsh-financial-research

English | [中文](README.zh.md)

This package defines the fixed mixed-research workflow shape used by the first finance milestone.

It owns the finance input and result types, the fixed workflow metadata, and the helper that turns one research request into one `ctx.workflowEngine.start()` payload.
```

`packages/workflow/tool-financial-research/README.md`

```md
# @deepseek-ai/dsh-tool-financial-research

English | [中文](README.zh.md)

The model-facing `financial_research` tool starts the fixed finance workflow, waits for completion, records package-owned session events, and returns a compact research summary to the parent session.
```

- [ ] **Step 2: Re-record the paired docs**

Run:

```bash
pnpm run verify-translation-pairing --write packages/workflow/financial-research/README.md packages/workflow/tool-financial-research/README.md packages/workflow/README.md docs/superpowers/plans/2026-08-16-financial-research-workflow-engine.md
```

Expected: `.i18n.yaml` files update for the new package READMEs and the edited workflow family README.

- [ ] **Step 3: Run focused tests and documentation checks**

Run:

```bash
pnpm vitest run packages/workflow/financial-research/tests/financial-research.spec.ts packages/workflow/tool-financial-research/tests/tool-financial-research.spec.ts
pnpm vitest run examples/headless-agent/tests/headless.snapshot.ts -t "financial research headless stream-json snapshot"
pnpm run doc-sync
git diff --check
```

Expected: all focused tests pass, `doc-sync` passes, and `git diff --check` prints nothing.

- [ ] **Step 4: Commit the docs and final verification updates**

```bash
git add packages/workflow/financial-research/README.md packages/workflow/financial-research/README.zh.md packages/workflow/financial-research/README.i18n.yaml packages/workflow/tool-financial-research/README.md packages/workflow/tool-financial-research/README.zh.md packages/workflow/tool-financial-research/README.i18n.yaml packages/workflow/README.md packages/workflow/README.zh.md packages/workflow/README.i18n.yaml
git commit -m "docs: document financial research workflow packages"
```

## Self-Review

- Spec coverage: this plan implements the fixed workflow core, specialist decomposition, durable trace, and one runnable example. It does not add a web workbench or private-data connectors, which the spec explicitly defers.
- Placeholder scan: no `TBD`, `TODO`, or deferred implementation markers remain in the task steps.
- Type consistency: the plan uses one fixed package split, one tool name (`financial_research`), one workflow name (`financial-research`), and one result type (`FinancialResearchResult`) across all tasks.
