import type { Context } from '@deepseek-ai/cordis'
import type { Agent, AgentOptions } from '@deepseek-ai/dsh-agent'
import { analystId, getRole, hardCheckQuality } from '@deepseek-ai/dsh-econswarm'
import type { PipelineArtifacts, QualityGateResult } from '@deepseek-ai/dsh-econswarm'
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import type { SubagentResult } from '@deepseek-ai/dsh-subagent'

/** Deployment-owned pipeline policy forwarded to every stage. */
export interface PipelineConfig {
  /** Named provider used for every one-shot child delegation. */
  readonly subagentProvider: string
  /** Bull/bear alternating round count. */
  readonly maxDebateRounds: number
  /** Aggressive/conservative/neutral alternating round count. */
  readonly maxRiskDiscussRounds: number
  /** Output language appended to user-facing stage prompts. */
  readonly outputLanguage: string
  /** Optional provider/model overrides applied to every child. */
  readonly agentOptions?: AgentOptions
}

/** Model-facing pipeline request. */
export interface PipelineInput {
  readonly ticker: string
  readonly tradeDate: string
  readonly analysisGoal: string
  readonly analysts: readonly string[]
  readonly chainMode: boolean
}

/** Canonical pipeline result returned by the model tool. */
export interface PipelineRunResult extends PipelineArtifacts {
  /** Executed stage labels in order. */
  readonly stages: readonly string[]
  /** Number of one-shot children started. */
  readonly agentsStarted: number
}

function textOf(result: SubagentResult): string {
  return result.output
    .filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text')
    .map(block => block.text)
    .join('\n')
    .trim()
}

async function runOne(
  ctx: Context,
  parent: Agent,
  config: PipelineConfig,
  label: string,
  prompt: string,
  signal: AbortSignal,
): Promise<string> {
  const run = await ctx.subagents.start(config.subagentProvider, {
    label,
    prompt: [{ type: 'text', text: prompt }] as ContentBlock[],
    parent,
    signal,
    ...config.agentOptions !== undefined ? { agentOptions: config.agentOptions } : {},
  })
  try {
    const result = await run.result
    if (result.stopReason !== 'completed') {
      throw new Error(`EconSwarm stage "${label}" ended with ${result.stopReason}`)
    }
    const output = textOf(result)
    if (output.length === 0) throw new Error(`EconSwarm stage "${label}" returned no text`)
    return output
  } finally {
    await run.dispose()
  }
}

function languageInstruction(language: string): string {
  return language.trim().toLowerCase() === 'english' ? '' : ` Write your entire response in ${language}.`
}

function analystPrompt(roleId: string, input: PipelineInput, language: string): string {
  const role = getRole(roleId)
  if (role === undefined) throw new Error(`unknown EconSwarm analyst id: ${roleId}`)
  const skills = role.skills.length > 0 ? `\nRelevant skills: ${role.skills.join(', ')}` : ''
  const tools = role.tools.length > 0 ? `\nAvailable tools: ${role.tools.join(', ')}` : ''
  return `You are the ${role.displayName}. ${role.description}
Analyze ${input.ticker} for trade date ${input.tradeDate}.
Research goal: ${input.analysisGoal}
${tools}${skills}
Write a detailed financial research report with concrete evidence and a markdown summary table.${languageInstruction(language)}`
}

function researchManagerPrompt(input: PipelineInput, debateHistory: string, language: string): string {
  return `You are the Research Manager. Synthesize the bull/bear debate and deliver a structured investment plan for ${input.ticker} on ${input.tradeDate}.
Research goal: ${input.analysisGoal}
Use exactly one rating: Buy, Overweight, Hold, Underweight, or Sell.
Debate history:
${debateHistory}${languageInstruction(language)}`
}

function traderPrompt(input: PipelineInput, plan: string, language: string): string {
  return `You are the Trader. Convert the research plan into an executable A-share transaction proposal for ${input.ticker}.
Trading constraints: T+1 settlement, daily price limits, minimum lot 100/200 shares, Beijing trading hours.
Research plan:
${plan}${languageInstruction(language)}`
}

function riskDebaterPrompt(
  input: PipelineInput,
  stance: string,
  proposal: string,
  history: string,
  language: string,
): string {
  return `You are the ${stance} risk debater. Evaluate the trader proposal for ${input.ticker} from a ${stance.toLowerCase()} risk posture.
Proposal:
${proposal}
Debate history:
${history}${languageInstruction(language)}`
}

function portfolioManagerPrompt(
  input: PipelineInput,
  proposal: string,
  riskHistory: string,
  chainMode: boolean,
  reports: Readonly<Record<string, string>>,
  language: string,
): string {
  const reportsBlock = Object.entries(reports)
    .map(([role, report]) => `### ${role}\n${report}`)
    .join('\n\n')
  const context = chainMode
    ? `Analyst reports:\n${reportsBlock}`
    : `Trader proposal:\n${proposal}\n\nRisk debate history:\n${riskHistory}`
  return `You are the Portfolio Manager. Deliver the final Buy/Overweight/Hold/Underweight/Sell decision for ${input.ticker}.
Research goal: ${input.analysisGoal}
${context}${languageInstruction(language)}`
}

/**
 * Run the ported EconSwarm pipeline using one-shot subagent delegations.
 * @param ctx - Cordis context carrying the subagent runtime.
 * @param parent - the initiating agent used as every child's parent.
 * @param input - ticker, date, goal, analyst selection, and chain mode.
 * @param config - provider, round limits, language, and optional child options.
 * @param signal - cancellation signal forwarded to every child.
 * @returns the pipeline artifacts and stage accounting.
 */
export async function runPipeline(
  ctx: Context,
  parent: Agent,
  input: PipelineInput,
  config: PipelineConfig,
  signal: AbortSignal,
): Promise<PipelineRunResult> {
  const roles = input.analysts.map(roleId => analystId(roleId))
  for (const roleId of roles) {
    if (getRole(roleId) === undefined) throw new Error(`unknown EconSwarm analyst id: ${roleId}`)
  }
  const reports: Record<string, string> = {}
  const stages: string[] = []
  let agentsStarted = 0
  for (const roleId of roles) {
    const role = getRole(roleId)
    if (role === undefined) continue
    stages.push(`analyst:${roleId}`)
    reports[roleId] = await runOne(
      ctx,
      parent,
      config,
      role.displayName,
      analystPrompt(roleId, input, config.outputLanguage),
      signal,
    )
    agentsStarted += 1
  }
  const qualityGate: QualityGateResult = hardCheckQuality(reports)
  stages.push('quality-gate')

  if (input.chainMode) {
    const finalDecision = await runOne(
      ctx,
      parent,
      config,
      'Portfolio Manager',
      portfolioManagerPrompt(input, '', '', true, reports, config.outputLanguage),
      signal,
    )
    agentsStarted += 1
    return {
      reports,
      qualityGate,
      debateHistory: '',
      researchPlan: '',
      traderProposal: '',
      riskDebateHistory: '',
      finalDecision,
      stages,
      agentsStarted,
    }
  }

  let debateHistory = ''
  for (let round = 0; round < config.maxDebateRounds; round += 1) {
    const bull = await runOne(ctx, parent, config, 'Bull Researcher', `Bull argument for ${input.ticker}.\n${debateHistory}`, signal)
    const bear = await runOne(ctx, parent, config, 'Bear Researcher', `Bear argument for ${input.ticker}.\n${bull}\n${debateHistory}`, signal)
    debateHistory += `Round ${round + 1} bull:\n${bull}\n\nRound ${round + 1} bear:\n${bear}\n\n`
    agentsStarted += 2
  }

  const researchPlan = await runOne(
    ctx,
    parent,
    config,
    'Research Manager',
    researchManagerPrompt(input, debateHistory, config.outputLanguage),
    signal,
  )
  agentsStarted += 1

  const traderProposal = await runOne(
    ctx,
    parent,
    config,
    'Trader',
    traderPrompt(input, researchPlan, config.outputLanguage),
    signal,
  )
  agentsStarted += 1

  let riskDebateHistory = ''
  const stances = ['Aggressive Debator', 'Conservative Debator', 'Neutral Debator']
  for (let round = 0; round < config.maxRiskDiscussRounds; round += 1) {
    for (const stance of stances) {
      const response = await runOne(
        ctx,
        parent,
        config,
        stance,
        riskDebaterPrompt(input, stance, traderProposal, riskDebateHistory, config.outputLanguage),
        signal,
      )
      riskDebateHistory += `Round ${round + 1} ${stance}:\n${response}\n\n`
      agentsStarted += 1
    }
  }

  const finalDecision = await runOne(
    ctx,
    parent,
    config,
    'Portfolio Manager',
    portfolioManagerPrompt(input, traderProposal, riskDebateHistory, false, reports, config.outputLanguage),
    signal,
  )
  agentsStarted += 1

  return {
    reports,
    qualityGate,
    debateHistory,
    researchPlan,
    traderProposal,
    riskDebateHistory,
    finalDecision,
    stages,
    agentsStarted,
  }
}
