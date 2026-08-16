/**
 * The model-facing `financial_research` tool: start the fixed finance
 * workflow, await foreground completion, record durable run events in the
 * calling parent Session, and render one compact summary.
 * @module @deepseek-ai/dsh-tool-financial-research
 */

import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { JsonValue, Session } from '@deepseek-ai/dsh-session'
import type { WorkflowResult } from '@deepseek-ai/dsh-workflow'
import {
  buildFinancialResearchWorkflow,
  renderFinancialResearchSummary,
  type FinancialResearchInput,
  type FinancialResearchResult,
} from '@deepseek-ai/dsh-financial-research'
import type {
  ToolFinancialResearchRunEndData,
  ToolFinancialResearchRunStartData,
} from './types.ts'
// Declaration merge only: makes ctx.systemPrompt visible for the section registration.
import type {} from '@deepseek-ai/dsh-system-prompt'

export const name = 'tool-financial-research'
export const inject = ['tools', 'workflowEngine', 'systemPrompt']

interface ToolFinancialResearchOutput {
  readonly runId: string
  readonly agentsStarted: number
  readonly result: JsonValue
}

function appendRunStart(session: Session, data: ToolFinancialResearchRunStartData): void {
  session.append('tool-financial-research/run-start', data)
}

function appendRunEnd(session: Session, data: ToolFinancialResearchRunEndData): void {
  session.append('tool-financial-research/run-end', data)
}

function stopReasonError(result: WorkflowResult): string | undefined {
  switch (result.stopReason) {
    case 'completed':
      return undefined
    case 'cancelled':
      return `financial research run was cancelled${result.error === undefined ? '' : ` (${result.error})`}`
    case 'error':
      return `financial research run failed: ${result.error ?? 'unknown error'}`
    /* v8 ignore start -- WorkflowStopReason is closed; a future variant must fail loud here. */
    default:
      return `financial research run ended abnormally (${String(result.stopReason satisfies never)})`
    /* v8 ignore stop */
  }
}

function renderOutput(output: ToolFinancialResearchOutput): string {
  return renderFinancialResearchSummary(output.result as FinancialResearchResult)
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
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          runId: { type: 'string', required: true },
          agentsStarted: { type: 'integer', required: true },
          result: { type: 'json', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: renderOutput(value as ToolFinancialResearchOutput) }],
    },
    async execute(args, exec) {
      const parent = exec.agent as Agent | undefined
      if (parent?.session === undefined) {
        throw new Error('financial_research requires a calling agent session')
      }

      const built = buildFinancialResearchWorkflow(args as FinancialResearchInput)
      const run = ctx.workflowEngine.start({
        ...built,
        parent,
        signal: exec.signal,
      })
      appendRunStart(parent.session, { runId: run.id, topic: built.args.topic })

      let settled: WorkflowResult | undefined
      let value: FinancialResearchResult | undefined
      try {
        settled = await run.result
        const error = stopReasonError(settled)
        if (error !== undefined) throw new Error(error)
        value = settled.value as FinancialResearchResult
        return {
          runId: run.id,
          agentsStarted: settled.agentsStarted,
          result: value as unknown as JsonValue,
        }
      } finally {
        try {
          await run.dispose()
        } finally {
          if (settled !== undefined) {
            appendRunEnd(parent.session, {
              runId: run.id,
              stopReason: settled.stopReason,
              artifactKinds: value?.artifacts.map((artifact) => artifact.kind) ?? [],
            })
          }
        }
      }
    },
  }))
}
