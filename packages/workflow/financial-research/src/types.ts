/**
 * Browser-safe finance workflow input/output vocabulary.
 * @module @deepseek-ai/dsh-financial-research/types
 */

/** One persisted output kind produced by the first finance workflow milestone. */
export type FinancialResearchArtifactKind =
  | 'evidence-bundle'
  | 'statement-summary'
  | 'news-summary'
  | 'valuation-summary'
  | 'risk-list'
  | 'report-draft'

/** One request to the fixed finance workflow. */
export interface FinancialResearchInput {
  /** The research topic or question. */
  topic: string
  /** Optional company name for routing and labeling. */
  company?: string
  /** Optional industry or sector label. */
  industry?: string
  /** The caller-facing output target. */
  outputFormat: 'report-draft' | 'brief'
}

/** One structured artifact produced by the workflow result. */
export interface FinancialResearchArtifact {
  /** The artifact category. */
  kind: FinancialResearchArtifactKind
  /** Short display title for the artifact. */
  title: string
  /** Full artifact body or summary text. */
  content: string
}

/** The structured result returned by the fixed finance workflow. */
export interface FinancialResearchResult {
  /** The original research topic. */
  topic: string
  /** Parent-facing summary text. */
  summary: string
  /** Intermediate and final workflow artifacts. */
  artifacts: FinancialResearchArtifact[]
  /** Explicit evidence gaps left by the workflow. */
  missingEvidence: string[]
}
