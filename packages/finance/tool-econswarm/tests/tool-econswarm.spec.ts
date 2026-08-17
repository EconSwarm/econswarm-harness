import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import EconSwarmRuntime from '@deepseek-ai/dsh-econswarm'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import SubagentRuntime from '@deepseek-ai/dsh-subagent'
import type { SubagentProvider, SubagentRun } from '@deepseek-ai/dsh-subagent'
import type { SessionId } from '@deepseek-ai/dsh-session'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import * as ToolEconswarm from '../src/index.ts'

function fakeProvider(reply: string): SubagentProvider {
  const run: SubagentRun = {
    id: 'fake-run' as SessionId,
    localAgent: undefined,
    result: Promise.resolve({
      output: [{ type: 'text', text: reply }],
      stopReason: 'completed',
    }),
    dispose: async () => {},
  }
  return {
    name: 'fake',
    capabilities: { outputSchema: false, depthLimit: false, toolFilter: false, persona: false },
    inheritsParentContext: false,
    start: async () => run,
  }
}

async function setup(reply: string): Promise<Context> {
  const ctx = new Context()
  await ctx.plugin(EconSwarmRuntime)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(SubagentRuntime)
  ctx.subagents.registerProvider(fakeProvider(reply))
  await ctx.plugin(ToolEconswarm, {
    subagentProvider: 'fake',
    defaultAnalysts: ['market', 'news'],
    maxDebateRounds: 0,
    maxRiskDiscussRounds: 0,
    outputLanguage: 'English',
  })
  return ctx
}

describe('dsh-tool-econswarm plugin', () => {
  it('declares stable plugin metadata', () => {
    expect(ToolEconswarm.name).toBe('tool-econswarm')
    expect(ToolEconswarm.inject).toEqual(['tools', 'econswarm', 'subagents'])
  })

  it('registers the role catalog tool', async () => {
    const ctx = await setup('ok')
    const tool = ctx.tools.get('econswarm_list_roles')
    expect(tool).toBeDefined()
  })

  it('registers the pipeline tool', async () => {
    const ctx = await setup('ok')
    expect(ctx.tools.get('econswarm_run_pipeline')).toBeDefined()
  })
})
