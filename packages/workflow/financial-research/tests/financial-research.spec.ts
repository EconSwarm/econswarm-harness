import { describe, expect, it } from 'vitest'
import {
  buildFinancialResearchWorkflow,
  renderFinancialResearchSummary,
  type FinancialResearchResult,
} from '../src/index.ts'

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
  ...args: string[]
) => (...args: unknown[]) => Promise<unknown>

describe('financial research workflow builder', () => {
  it('builds one fixed mixed-research workflow with the expected phases and specialist labels', () => {
    const built = buildFinancialResearchWorkflow({
      topic: 'Evaluate ACME under the current semiconductor cycle',
      company: 'ACME',
      industry: 'Semiconductors',
      outputFormat: 'report-draft',
    })

    expect(built.meta).toEqual({
      name: 'financial-research',
      description: 'Run a mixed financial research workflow over fixed specialist agents.',
      phases: [
        { title: 'Collect evidence' },
        { title: 'Run specialists' },
        { title: 'Write result' },
      ],
    })
    expect(built.script).toContain("label: 'statement-analysis'")
    expect(built.script).toContain("label: 'news-attribution'")
    expect(built.script).toContain("label: 'valuation-analysis'")
    expect(built.script).toContain("label: 'risk-review'")
    expect(built.args).toMatchObject({
      topic: 'Evaluate ACME under the current semiconductor cycle',
      company: 'ACME',
      industry: 'Semiconductors',
      outputFormat: 'report-draft',
    })
  })

  it('emits a workflow script that parses before the worker runs it', () => {
    const built = buildFinancialResearchWorkflow({
      topic: 'Evaluate ACME under the current semiconductor cycle',
      company: 'ACME',
      industry: 'Semiconductors',
      outputFormat: 'report-draft',
    })

    expect(() => { new AsyncFunction(built.script) }).not.toThrow()
  })

  it('renders a compact parent-facing summary from the structured result', () => {
    const result: FinancialResearchResult = {
      topic: 'Evaluate ACME under the current semiconductor cycle',
      summary: 'ACME looks attractive if memory pricing remains firm.',
      artifacts: [
        { kind: 'evidence-bundle', title: 'Source bundle', content: '10-K, earnings call, industry note' },
        { kind: 'report-draft', title: 'Draft report', content: 'Draft body' },
      ],
      missingEvidence: ['Channel-check data'],
    }

    expect(renderFinancialResearchSummary(result)).toContain('financial research completed')
    expect(renderFinancialResearchSummary(result)).toContain('evidence-bundle')
    expect(renderFinancialResearchSummary(result)).toContain('Channel-check data')
  })
})
