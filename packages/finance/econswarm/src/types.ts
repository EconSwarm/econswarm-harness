import type { Branded } from '@deepseek-ai/dsh-brand'

/** Stable role identifier used by EconSwarm analysts and pipeline stages. */
export type AnalystId = Branded<'AnalystId'>

/** Which model class the original EconSwarm routing assigned to a role. */
export type ModelClass = 'quick' | 'deep'

/** One ported EconSwarm analyst or orchestration role. */
export interface AnalystRole {
  /** Stable role id used by pipeline requests and model tools. */
  readonly id: AnalystId
  /** Human-readable role name. */
  readonly displayName: string
  /** One-line responsibility statement for prompt assembly. */
  readonly description: string
  /** Original quick-thinking or deep-thinking model route. */
  readonly modelClass: ModelClass
  /** Whether the original LangGraph role bound model-facing data tools. */
  readonly hasTools: boolean
  /** Original tool names exposed to the role. */
  readonly tools: readonly string[]
  /** Skill names injected into the original role prompt. */
  readonly skills: readonly string[]
}

/** Result of one original quality-gate hard check. */
export interface HardCheckResult {
  /** Original A-F grade. */
  readonly grade: 'A' | 'B' | 'C' | 'D' | 'F'
  /** Human-readable reason. */
  readonly detail: string
}

/** Ported Layer-1 quality gate output for the seven core analysts. */
export interface QualityGateResult {
  /** Per-role hard-check results. */
  readonly hardChecks: Readonly<Record<string, HardCheckResult>>
  /** Markdown summary consumed by downstream orchestration. */
  readonly summary: string
}

/** Durable artifacts of one ported EconSwarm pipeline run. */
export interface PipelineArtifacts {
  /** Analyst role id to report text. */
  readonly reports: Readonly<Record<string, string>>
  /** Layer-1 quality gate result. */
  readonly qualityGate: QualityGateResult
  /** Bull/bear debate transcript. */
  readonly debateHistory: string
  /** Research Manager structured plan text. */
  readonly researchPlan: string
  /** Trader structured proposal text. */
  readonly traderProposal: string
  /** Aggressive/conservative/neutral debate transcript. */
  readonly riskDebateHistory: string
  /** Portfolio Manager final decision text. */
  readonly finalDecision: string
}
