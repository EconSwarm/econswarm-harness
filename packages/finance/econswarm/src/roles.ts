import type { AnalystId, AnalystRole } from './types.ts'

/**
 * Brand a raw string as an {@link AnalystId}.
 * @param value - raw analyst id string.
 * @returns the branded id.
 */
export function analystId(value: string): AnalystId {
  return value as AnalystId
}

const ROLES: readonly AnalystRole[] = [
  {
    id: analystId('market'),
    displayName: 'Market Analyst',
    description: 'Technical analysis of price, volume, and A-share market microstructure.',
    modelClass: 'quick',
    hasTools: true,
    tools: ['get_stock_data', 'get_indicators'],
    skills: [],
  },
  {
    id: analystId('social'),
    displayName: 'Social Media Analyst',
    description: 'Social sentiment and market discussion heat analysis.',
    modelClass: 'quick',
    hasTools: true,
    tools: ['get_news'],
    skills: [],
  },
  {
    id: analystId('news'),
    displayName: 'News Analyst',
    description: 'Company, sector, global event, and insider-transaction news analysis.',
    modelClass: 'quick',
    hasTools: true,
    tools: ['get_news', 'get_global_news', 'get_insider_transactions'],
    skills: [],
  },
  {
    id: analystId('fundamentals'),
    displayName: 'Fundamentals Analyst',
    description: 'Financial statements, profitability, valuation, forecasts, and peer comparison.',
    modelClass: 'quick',
    hasTools: true,
    tools: [
      'get_fundamentals',
      'get_balance_sheet',
      'get_cashflow',
      'get_income_statement',
      'get_profit_forecast',
      'get_industry_comparison',
    ],
    skills: [],
  },
  {
    id: analystId('policy'),
    displayName: 'Policy Analyst',
    description: 'Regulatory, industrial-policy, and macro-environment analysis.',
    modelClass: 'quick',
    hasTools: true,
    tools: ['get_news', 'get_global_news'],
    skills: [],
  },
  {
    id: analystId('hot_money'),
    displayName: 'Hot Money Tracker',
    description: 'Capital-flow, hot-stock, northbound, concept-block, and dragon-tiger-board tracking.',
    modelClass: 'quick',
    hasTools: true,
    tools: [
      'get_stock_data',
      'get_news',
      'get_insider_transactions',
      'get_hot_stocks',
      'get_northbound_flow',
      'get_concept_blocks',
      'get_fund_flow',
      'get_dragon_tiger_board',
      'get_industry_comparison',
    ],
    skills: [],
  },
  {
    id: analystId('lockup'),
    displayName: 'Lockup Watcher',
    description: 'Lockup expiry, insider reduction, and supply-shock monitoring.',
    modelClass: 'quick',
    hasTools: true,
    tools: ['get_insider_transactions', 'get_news', 'get_fundamentals', 'get_lockup_expiry'],
    skills: [],
  },
  {
    id: analystId('china_earnings_reviewer'),
    displayName: 'Earnings Reviewer',
    description: 'China earnings review and surplus analysis.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['china-market-data', 'china-comps', 'china-earnings-analysis', 'china-earnings-preview', 'china-model-update'],
  },
  {
    id: analystId('china_market_researcher'),
    displayName: 'Market Researcher',
    description: 'China market, sector, and competitive deep research.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['china-market-data', 'china-comps', 'china-sector-overview', 'china-competitive-analysis', 'china-idea-generation', 'china-catalyst-calendar'],
  },
  {
    id: analystId('china_model_builder'),
    displayName: 'Model Builder',
    description: 'China three-statement, DCF, LBO, and model-update construction.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['china-market-data', 'china-comps', 'china-dcf', 'china-3-statement-model', 'china-lbo-model', 'china-model-update', 'china-audit-xls'],
  },
  {
    id: analystId('china_pitch_agent'),
    displayName: 'Pitch Agent',
    description: 'China investment-banking pitch deck and teaser generation.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [
      'china-market-data',
      'china-comps',
      'china-dcf',
      'china-3-statement-model',
      'china-lbo-model',
      'china-strip-profile',
      'china-competitive-analysis',
      'china-sector-overview',
      'china-initiating-coverage',
      'china-pitch-deck',
      'china-process-letter',
      'china-teaser',
      'china-cim-builder',
      'china-buyer-list',
      'china-datapack-builder',
    ],
  },
  {
    id: analystId('china_finance_agent'),
    displayName: 'Finance Analyst',
    description: 'Comprehensive China financial analysis and client deliverables.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [
      'china-3-statement-model',
      'china-comps',
      'china-comps-analysis',
      'china-dcf',
      'china-dcf-model',
      'china-market-data',
      'china-earnings-analysis',
      'china-sector-overview',
      'china-model-update',
      'china-financial-plan',
      'china-client-report',
      'china-investment-proposal',
    ],
  },
  {
    id: analystId('fund_admin'),
    displayName: 'Fund Admin Agent',
    description: 'Fund accounting, NAV reconciliation, expense allocation, and GL support.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['china-accrual-schedule', 'china-break-trace', 'china-gl-recon', 'china-nav-tieout', 'china-roll-forward', 'china-variance-commentary'],
  },
  {
    id: analystId('investment_banking'),
    displayName: 'Investment Banking Agent',
    description: 'Valuation, M&A, LBO, due diligence, and China deal deliverables.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [
      'china-buyer-list',
      'china-cim-builder',
      'china-competitive-analysis',
      'china-datapack-builder',
      'china-deal-tracker',
      'china-merger-model',
      'china-pitch-deck',
      'china-process-letter',
      'china-strip-profile',
      'china-teaser',
    ],
  },
  {
    id: analystId('operations_kyc'),
    displayName: 'Operations KYC Agent',
    description: 'Operations compliance, KYC document parsing, and license checks.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['china-kyc-doc-parse', 'china-kyc-rules'],
  },
  {
    id: analystId('private_equity'),
    displayName: 'Private Equity Agent',
    description: 'Deal sourcing, DD, IC memos, returns, and portfolio monitoring.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [
      'china-ai-readiness',
      'china-dd-checklist',
      'china-dd-meeting-prep',
      'china-deal-sourcing',
      'china-ic-memo',
      'china-portfolio-monitoring',
      'china-returns-analysis',
      'china-unit-economics',
      'china-value-creation-plan',
    ],
  },
  {
    id: analystId('wealth_management'),
    displayName: 'Wealth Management Agent',
    description: 'Client reports, asset allocation, financial plans, and rebalancing.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['china-client-report', 'china-client-review', 'china-financial-plan', 'china-investment-proposal', 'china-portfolio-rebalance'],
  },
  {
    id: analystId('lseg'),
    displayName: 'LSEG Agent',
    description: 'Cross-asset LSEG data analysis for bonds, rates, FX, and options.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['bond-futures-basis', 'bond-relative-value', 'equity-research', 'fixed-income-portfolio', 'fx-carry-trade', 'macro-rates-monitor', 'option-vol-analysis', 'swap-curve-strategy'],
  },
  {
    id: analystId('spglobal'),
    displayName: 'S&P Global Agent',
    description: 'S&P Global company profiles, funding digest, and tear sheets.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['tear-sheet', 'earnings-preview-beta', 'funding-digest'],
  },
  {
    id: analystId('valuation_reviewer'),
    displayName: 'Valuation Reviewer',
    description: 'DCF, returns, portfolio monitoring, and IC-memo valuation review.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['returns-analysis', 'portfolio-monitoring', 'ic-memo', 'xlsx-author'],
  },
  {
    id: analystId('statement_auditor'),
    displayName: 'Statement Auditor',
    description: 'NAV tie-out, audit workbook, and statement validation.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['nav-tieout', 'audit-xls', 'xlsx-author'],
  },
  {
    id: analystId('month_end_closer'),
    displayName: 'Month End Closer',
    description: 'Accrual schedules, roll-forwards, variance commentary, and audit workbooks.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['accrual-schedule', 'roll-forward', 'variance-commentary', 'audit-xls', 'xlsx-author'],
  },
  {
    id: analystId('gl_reconciler'),
    displayName: 'GL Reconciler',
    description: 'General-ledger reconciliation, break tracing, and audit exports.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['gl-recon', 'break-trace', 'audit-xls', 'xlsx-author'],
  },
  {
    id: analystId('kyc_screener'),
    displayName: 'KYC Screener',
    description: 'KYC document parsing, rules, and XLSX deliverables.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['kyc-doc-parse', 'kyc-rules', 'xlsx-author'],
  },
  {
    id: analystId('meeting_prep'),
    displayName: 'Meeting Prep Agent',
    description: 'Client review, client reports, investment proposals, and PPTX preparation.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: ['client-review', 'client-report', 'investment-proposal', 'pptx-author'],
  },
  {
    id: analystId('quality_gate'),
    displayName: 'Quality Gate',
    description: 'Layer-1 hard checks plus optional LLM review of analyst reports.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('bull_researcher'),
    displayName: 'Bull Researcher',
    description: 'Constructive side of the bull/bear investment debate.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('bear_researcher'),
    displayName: 'Bear Researcher',
    description: 'Skeptical side of the bull/bear investment debate.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('research_manager'),
    displayName: 'Research Manager',
    description: 'Synthesizes debate evidence into a structured research plan.',
    modelClass: 'deep',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('trader'),
    displayName: 'Trader',
    description: 'Converts the research plan into an executable A-share transaction proposal.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('aggressive_debator'),
    displayName: 'Aggressive Debator',
    description: 'Risk-debate position favoring higher conviction and larger position sizing.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('conservative_debator'),
    displayName: 'Conservative Debator',
    description: 'Risk-debate position emphasizing capital preservation and smaller sizing.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('neutral_debator'),
    displayName: 'Neutral Debator',
    description: 'Balanced risk-debate position between aggressive and conservative views.',
    modelClass: 'quick',
    hasTools: false,
    tools: [],
    skills: [],
  },
  {
    id: analystId('portfolio_manager'),
    displayName: 'Portfolio Manager',
    description: 'Delivers the final Buy/Overweight/Hold/Underweight/Sell decision.',
    modelClass: 'deep',
    hasTools: false,
    tools: [],
    skills: [],
  },
]

/** The original seven-core analyst selection used when a request omits analysts. */
export const DEFAULT_ANALYST_IDS: readonly AnalystId[] = [
  analystId('market'),
  analystId('social'),
  analystId('news'),
  analystId('fundamentals'),
  analystId('policy'),
  analystId('hot_money'),
  analystId('lockup'),
]

/**
 * Return every ported role in registration order.
 * @returns all ported roles.
 */
export function listRoles(): readonly AnalystRole[] {
  return ROLES
}

/**
 * Resolve one role by id string.
 * @param value - stable role id string.
 * @returns the matching role, or `undefined` when unknown.
 */
export function getRole(value: string): AnalystRole | undefined {
  return ROLES.find(role => role.id === value)
}

/**
 * Resolve role ids and fail loud on unknown ids, preserving request order.
 * @param values - requested analyst id strings.
 * @returns the branded ids in request order.
 */
export function resolveAnalystIds(values: readonly string[]): readonly AnalystId[] {
  return values.map((value) => {
    const role = getRole(value)
    if (role === undefined) throw new Error(`unknown EconSwarm analyst id: ${value}`)
    return role.id
  })
}
