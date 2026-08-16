/**
 * Browser-safe durable finance-workflow tool events recorded in the calling
 * parent Session.
 * @module @deepseek-ai/dsh-tool-financial-research/types
 */

import type { FinancialResearchArtifactKind } from '@deepseek-ai/dsh-financial-research'
import type { WorkflowRunId, WorkflowStopReason } from '@deepseek-ai/dsh-workflow/types'

/** Opens one durable fixed finance workflow run record. */
export interface ToolFinancialResearchRunStartData {
  readonly runId: WorkflowRunId
  readonly topic: string
}

/** Closes one durable fixed finance workflow run record. */
export interface ToolFinancialResearchRunEndData {
  readonly runId: WorkflowRunId
  readonly stopReason: WorkflowStopReason
  readonly artifactKinds: FinancialResearchArtifactKind[]
}

declare module '@deepseek-ai/dsh-session/types' {
  interface SessionEventMap {
    /**
     * Opens one fixed finance workflow record.
     * @param data - stable run identity and the requested topic.
     */
    'tool-financial-research/run-start': ToolFinancialResearchRunStartData
    /**
     * Closes one fixed finance workflow record.
     * @param data - stable run identity, stop reason, and produced artifact kinds.
     */
    'tool-financial-research/run-end': ToolFinancialResearchRunEndData
  }
}
