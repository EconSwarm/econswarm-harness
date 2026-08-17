import type { HardCheckResult, QualityGateResult } from './types.ts'

/** Core analyst report keys checked by the original quality gate. */
const REPORT_FIELDS = [
  ['market', 'market_report'],
  ['social', 'sentiment_report'],
  ['news', 'news_report'],
  ['fundamentals', 'fundamentals_report'],
  ['policy', 'policy_report'],
  ['hot_money', 'hot_money_report'],
  ['lockup', 'lockup_report'],
] as const

const MIN_REPORT_LENGTH = 200
const FAILURE_MARKERS = [
  '无法获取',
  'I cannot retrieve',
  "I don't have access",
  'unable to fetch',
  '工具调用失败',
]

/**
 * Run the original Layer-1 hard checks against one analyst report.
 * @param report - analyst report text.
 * @returns the A-F grade and human-readable detail.
 */
export function hardCheckReport(report: string): HardCheckResult {
  const trimmed = report.trim()
  if (trimmed.length === 0) return { grade: 'F', detail: 'empty report' }
  if (trimmed.length < MIN_REPORT_LENGTH) {
    return { grade: 'D', detail: `report too short (${trimmed.length} chars < ${MIN_REPORT_LENGTH})` }
  }
  let stripped = trimmed
  for (const marker of FAILURE_MARKERS) stripped = stripped.replaceAll(marker, '')
  if (stripped.length < MIN_REPORT_LENGTH) {
    return { grade: 'D', detail: 'report consists mostly of failure markers' }
  }
  const hasTable = trimmed.includes('|') && trimmed.includes('---')
  const missing = (trimmed.match(/\[数据缺失/g) ?? []).length
  const issues: string[] = []
  if (!hasTable) issues.push('missing summary table')
  if (missing > 0) issues.push(`${missing} missing-data markers`)
  if (missing >= 3) return { grade: 'C', detail: issues.join('; ') }
  if (!hasTable || missing > 0) return { grade: 'B', detail: issues.join('; ') || 'basically complete' }
  return { grade: 'A', detail: `complete (${trimmed.length} chars)` }
}

/**
 * Run the original Layer-1 quality gate over the seven core analyst reports.
 * @param reports - report text keyed by original report field names.
 * @returns per-role hard checks and the markdown summary.
 */
export function hardCheckQuality(reports: Readonly<Record<string, string>>): QualityGateResult {
  const hardChecks: Record<string, HardCheckResult> = {}
  const lines: string[] = []
  for (const [role, field] of REPORT_FIELDS) {
    const result = hardCheckReport(reports[field] ?? '')
    hardChecks[role] = result
    lines.push(`- ${role}: [${result.grade}] ${result.detail}`)
  }
  return {
    hardChecks,
    summary: `## Quality Gate\n\n### Hard checks\n${lines.join('\n')}\n`,
  }
}
