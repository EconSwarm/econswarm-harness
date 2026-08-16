/**
 * Fixed first-phase finance workflow builder and result helpers.
 * @module @deepseek-ai/dsh-financial-research
 */

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
