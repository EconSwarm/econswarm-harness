/**
 * Model-facing EconSwarm consumer.
 *
 * Registers `econswarm_list_roles` and `econswarm_run_pipeline` on
 * `ctx.tools`. The pipeline consumer reproduces the original seven-stage
 * orchestration as one-shot subagent delegations: analysts, Layer-1 quality
 * gate, bull/bear debate, Research Manager, Trader, risk debate, and
 * Portfolio Manager.
 *
 * @module @deepseek-ai/dsh-tool-econswarm
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { AgentOptions } from '@deepseek-ai/dsh-agent'
import { defineTool, type JsonValue } from '@deepseek-ai/dsh-tools'
import { runPipeline, type PipelineConfig, type PipelineInput, type PipelineRunResult } from './pipeline.ts'

/** Cordis plugin name. */
export const name = 'tool-econswarm'
/** Services required before the model-facing tools can register. */
export const inject = ['tools', 'econswarm', 'subagents']

/** Deployment policy for the EconSwarm model tools. */
export interface Config {
  /** Named subagent provider used by every pipeline stage. */
  readonly subagentProvider: string
  /** Role ids used when a pipeline call omits `analysts`. */
  readonly defaultAnalysts: string[]
  /** Bull/bear alternating round count. */
  readonly maxDebateRounds: number
  /** Aggressive/conservative/neutral alternating round count. */
  readonly maxRiskDiscussRounds: number
  /** Output language appended to user-facing stage prompts. */
  readonly outputLanguage: string
  /** Optional provider override applied to every child. */
  readonly provider?: string
  /** Optional model override applied to every child. */
  readonly model?: string
}

/** Schemastery configuration for the EconSwarm consumer. */
export const Config: z<Config> = z.object({
  subagentProvider: z.string().default('spawn'),
  defaultAnalysts: z.array(z.string()).default(['market', 'news', 'fundamentals', 'policy']),
  maxDebateRounds: z.number().min(0).default(1),
  maxRiskDiscussRounds: z.number().min(0).default(1),
  outputLanguage: z.string().default('English'),
  provider: z.string(),
  model: z.string(),
})

function agentOptions(config: Config): AgentOptions | undefined {
  const options: AgentOptions = {}
  if (config.provider !== undefined) options.provider = config.provider
  if (config.model !== undefined) options.model = config.model
  return Object.keys(options).length === 0 ? undefined : options
}

/** Register the EconSwarm model-facing tools. */
export function apply(ctx: Context, config: Config): void {
  const childOptions = agentOptions(config)
  const pipelineConfig: PipelineConfig = {
    subagentProvider: config.subagentProvider,
    maxDebateRounds: config.maxDebateRounds,
    maxRiskDiscussRounds: config.maxRiskDiscussRounds,
    outputLanguage: config.outputLanguage,
    ...childOptions !== undefined ? { agentOptions: childOptions } : {},
  }

  ctx.tools.register(defineTool({
    name: 'econswarm_list_roles',
    description: 'List EconSwarm financial analyst and orchestration roles with their tool and skill bindings.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          roles: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string', required: true },
                displayName: { type: 'string', required: true },
                description: { type: 'string', required: true },
                skills: { type: 'array', required: true, items: { type: 'string' } },
              },
            },
          },
        },
      },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    execute: () => {
      const roles = ctx.econswarm.listRoles().map(role => ({
        id: String(role.id),
        displayName: role.displayName,
        description: role.description,
        skills: [...role.skills],
      }))
      return Promise.resolve({ roles })
    },
  }))

  ctx.tools.register(defineTool({
    name: 'econswarm_run_pipeline',
    description: 'Run the EconSwarm multi-agent financial pipeline for one instrument and return the final decision.',
    parameters: {
      ticker: { type: 'string', required: true, description: 'Instrument ticker, for example 600519.SH or AAPL.' },
      tradeDate: { type: 'string', required: true, description: 'Trade date in YYYY-MM-DD format.' },
      analysisGoal: { type: 'string', description: 'Research goal or user focus for the run.' },
      analysts: {
        type: 'array',
        description: 'Analyst role ids; defaults to the deployment selection.',
        items: { type: 'string' },
      },
      chainMode: { type: 'boolean', description: 'Use the simplified analysts to Portfolio Manager chain.' },
    },
    output: {
      schema: { type: 'json' },
      render: (_args, value) => {
        const result = value as unknown as PipelineRunResult
        return [{
          type: 'text',
          text: `Final decision:\n${result.finalDecision}\n\nQuality gate:\n${result.qualityGate.summary}`,
        }]
      },
    },
    async execute(args, exec) {
      const agent = exec.agent
      if (agent === undefined) throw new Error('econswarm_run_pipeline requires an agent execution context')
      const input: PipelineInput = {
        ticker: args.ticker,
        tradeDate: args.tradeDate,
        analysisGoal: args.analysisGoal ?? '',
        analysts: args.analysts?.length ? args.analysts : config.defaultAnalysts,
        chainMode: args.chainMode ?? false,
      }
      const result: PipelineRunResult = await runPipeline(ctx, agent, input, pipelineConfig, exec.signal)
      return result as unknown as JsonValue
    },
  }))
}
