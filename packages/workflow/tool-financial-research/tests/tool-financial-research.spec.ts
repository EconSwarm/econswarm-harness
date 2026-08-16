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
