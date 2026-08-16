import type { WorkflowMeta } from '@deepseek-ai/dsh-workflow'
import type { FinancialResearchInput, FinancialResearchResult } from './types.ts'

/** One ready-to-start fixed finance workflow definition. */
export interface FinancialResearchWorkflowDefinition {
  /** Display and progress metadata for the workflow engine. */
  meta: WorkflowMeta
  /** The fixed workflow script body. */
  script: string
  /** Plain JSON arguments exposed to the script as `args`. */
  args: FinancialResearchInput
}

/**
 * Build the fixed first-phase finance workflow.
 * @param input - the plain research request carried into the workflow engine.
 * @returns the immutable workflow payload a Consumer passes to `ctx.workflowEngine.start()`.
 */
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
  const script = [
    "phase('Collect evidence')",
    "const evidence = await agent('Collect public filings, news, and sector context for ' + args.topic, { label: 'evidence-collector', phase: 'Collect evidence' })",
    "phase('Run specialists')",
    "const [statementSummary, newsSummary, valuationSummary, riskList] = await parallel([",
    "  () => agent('Analyze the financial statements for ' + args.topic + '\nEvidence:\n' + evidence, { label: 'statement-analysis', phase: 'Run specialists' }),",
    "  () => agent('Attribute the recent news flow for ' + args.topic + '\nEvidence:\n' + evidence, { label: 'news-attribution', phase: 'Run specialists' }),",
    "  () => agent('Produce a valuation view for ' + args.topic + '\nEvidence:\n' + evidence, { label: 'valuation-analysis', phase: 'Run specialists' }),",
    "  () => agent('Review key risks for ' + args.topic + '\nEvidence:\n' + evidence, { label: 'risk-review', phase: 'Run specialists' }),",
    '])',
    "phase('Write result')",
    "const report = await agent('Write a concise investment report draft for ' + args.topic + '\nStatements:\n' + statementSummary + '\nNews:\n' + newsSummary + '\nValuation:\n' + valuationSummary + '\nRisks:\n' + riskList, { label: 'report-writer', phase: 'Write result' })",
    'return {',
    '  topic: args.topic,',
    '  summary: String(report),',
    '  artifacts: [',
    "    { kind: 'evidence-bundle', title: 'Collected evidence', content: String(evidence) },",
    "    { kind: 'statement-summary', title: 'Statement summary', content: String(statementSummary) },",
    "    { kind: 'news-summary', title: 'News summary', content: String(newsSummary) },",
    "    { kind: 'valuation-summary', title: 'Valuation summary', content: String(valuationSummary) },",
    "    { kind: 'risk-list', title: 'Risk list', content: String(riskList) },",
    "    { kind: 'report-draft', title: 'Draft report', content: String(report) },",
    '  ],',
    '  missingEvidence: [],',
    '} satisfies FinancialResearchResult',
  ].join('\n')
  return { meta, script, args: input }
}

/**
 * Render one compact parent-facing completion summary.
 * @param result - the structured finance workflow result.
 * @returns a short text block with artifact kinds, missing evidence, and summary text.
 */
export function renderFinancialResearchSummary(result: FinancialResearchResult): string {
  return [
    `financial research completed for "${result.topic}".`,
    `Artifacts: ${result.artifacts.map((artifact) => artifact.kind).join(', ') || '(none)'}.`,
    `Missing evidence: ${result.missingEvidence.join(', ') || '(none)'}.`,
    'Summary:',
    result.summary,
  ].join('\n')
}
