/**
 * Static EconSwarm library catalog: workflows, agent roles, and skill
 * categories. The authoritative registries live in the finance host
 * packages; this browser catalog is the presentation copy for the Web UI.
 */

/** One reusable analysis workflow card. */
export interface WorkflowCard {
  readonly id: string
  readonly name: string
  readonly summary: string
  readonly target: string
  readonly stages: number
  readonly agents: number
  readonly skills: number
  readonly system: boolean
}

/** One agent role card. */
export interface AgentCard {
  readonly id: string
  readonly name: string
  readonly summary: string
  readonly tags: readonly string[]
}

/** One agent team section. */
export interface AgentTeam {
  readonly id: string
  readonly label: string
  readonly agents: readonly AgentCard[]
}

/** One skill category card. */
export interface SkillCategory {
  readonly id: string
  readonly label: string
  readonly count: number
  readonly samples: readonly string[]
}

/** Built-in and custom workflow cards, matching the EconSwarm wiki. */
export const WORKFLOW_CARDS: readonly WorkflowCard[] = [
  {
    id: 'builtin-a-stock',
    name: 'A 股全流程分析',
    summary: '16 个阶段覆盖市场、舆情、新闻、基本面、政策、资金流向与供给监控，经质量门控、多空辩论、三方风控与最终决策。',
    target: 'instrument',
    stages: 16,
    agents: 7,
    skills: 3,
    system: true,
  },
  {
    id: 'builtin-cn-a-market-intelligence',
    name: 'A 股市场驱动与产业机会研究',
    summary: '面向市场目标类型，携带 research_contract，输出市场驱动因素与产业机会地图。',
    target: 'market',
    stages: 12,
    agents: 6,
    skills: 4,
    system: true,
  },
  {
    id: 'builtin-cn-a-industry-research',
    name: 'A 股行业趋势与机会研究',
    summary: '围绕行业目标聚合行业数据、竞争格局、政策与估值，生成可复用行业研究。',
    target: 'industry',
    stages: 10,
    agents: 5,
    skills: 5,
    system: true,
  },
  {
    id: 'builtin-cn-a-topic-research',
    name: 'A 股主题与产业机会研究',
    summary: '从主题目标出发筛选事件、资金与产业线索，形成主题级机会判断。',
    target: 'topic',
    stages: 9,
    agents: 5,
    skills: 4,
    system: true,
  },
  {
    id: 'custom-workflow',
    name: '自定义工作流',
    summary: '从 34 个智能体与 184 个金融技能中自由编排分析师、辩论与风控阶段。',
    target: 'auto',
    stages: 8,
    agents: 4,
    skills: 3,
    system: false,
  },
]

/** The 34 ported EconSwarm roles grouped by team. */
export const AGENT_TEAMS: readonly AgentTeam[] = [
  {
    id: 'core-analysts',
    label: '核心分析师',
    agents: [
      { id: 'market', name: '市场分析师', summary: '价格、成交量与 A 股市场微观结构技术分析。', tags: ['行情', '技术面'] },
      { id: 'social', name: '舆情分析师', summary: '社媒情绪与市场讨论热度分析。', tags: ['舆情', '热度'] },
      { id: 'news', name: '新闻分析师', summary: '公司、行业、全球事件与内部交易新闻分析。', tags: ['新闻', '事件'] },
      { id: 'fundamentals', name: '基本面分析师', summary: '财务报表、盈利能力、估值、预测与同业比较。', tags: ['财务', '估值'] },
      { id: 'policy', name: '政策分析师', summary: '监管、产业政策与宏观环境分析。', tags: ['政策', '宏观'] },
      { id: 'hot_money', name: '资金流向追踪员', summary: '资金流、热门股、北向、概念板块与龙虎榜追踪。', tags: ['资金流', '北向'] },
      { id: 'lockup', name: '供给监控员', summary: '限售解禁、内部减持与供给冲击监控。', tags: ['解禁', '供给'] },
    ],
  },
  {
    id: 'china-research',
    label: '中国研究专家',
    agents: [
      { id: 'china_earnings_reviewer', name: '业绩评审员', summary: '中国业绩回顾与盈余分析。', tags: ['业绩', '盈余'] },
      { id: 'china_market_researcher', name: '市场研究员', summary: '中国市场、行业与竞争深度研究。', tags: ['行业', '竞争'] },
      { id: 'china_model_builder', name: '建模工程师', summary: '三表、DCF、LBO 与模型更新构建。', tags: ['建模', 'DCF'] },
      { id: 'china_pitch_agent', name: '投行材料 Agent', summary: '中国投行路演材料与摘要生成。', tags: ['投行', 'Pitch'] },
      { id: 'china_finance_agent', name: '综合金融分析师', summary: '综合中国金融分析与客户交付物。', tags: ['综合', '交付'] },
    ],
  },
  {
    id: 'institutional',
    label: '机构与合规',
    agents: [
      { id: 'fund_admin', name: '基金运营 Agent', summary: '基金会计、净值核对、费用分摊与总账支持。', tags: ['基金运营', '净值'] },
      { id: 'investment_banking', name: '投行 Agent', summary: '估值、并购、LBO、尽调与中国交易交付物。', tags: ['投行', '并购'] },
      { id: 'operations_kyc', name: 'KYC 运营 Agent', summary: '运营合规、KYC 文档解析与牌照检查。', tags: ['合规', 'KYC'] },
      { id: 'private_equity', name: '私募股权 Agent', summary: '项目源、尽调、IC 备忘录、回报与组合监控。', tags: ['私募', '尽调'] },
      { id: 'wealth_management', name: '财富管理 Agent', summary: '客户报告、资产配置、财务计划与再平衡。', tags: ['财富', '配置'] },
      { id: 'lseg', name: 'LSEG 数据 Agent', summary: '债券、利率、外汇与期权的跨资产 LSEG 数据分析。', tags: ['LSEG', '跨资产'] },
      { id: 'spglobal', name: 'S&P Global Agent', summary: 'S&P Global 公司档案、融资摘要与单页报告。', tags: ['S&P', '档案'] },
    ],
  },
  {
    id: 'operations-audit',
    label: '运营与审计',
    agents: [
      { id: 'valuation_reviewer', name: '估值评审员', summary: 'DCF、回报、组合监控与 IC 备忘录估值评审。', tags: ['估值', '评审'] },
      { id: 'statement_auditor', name: '报表审计员', summary: '净值核对、审计工作簿与报表验证。', tags: ['审计', '报表'] },
      { id: 'month_end_closer', name: '月末结账员', summary: '应计表、滚动表、差异评论与审计工作簿。', tags: ['月末', '应计'] },
      { id: 'gl_reconciler', name: '总账核对员', summary: '总账核对、断链追踪与审计导出。', tags: ['总账', '核对'] },
      { id: 'kyc_screener', name: 'KYC 筛查员', summary: 'KYC 文档解析、规则与 XLSX 交付。', tags: ['KYC', '筛查'] },
      { id: 'meeting_prep', name: '会议准备 Agent', summary: '客户评审、客户报告、投资提案与 PPTX 准备。', tags: ['会议', 'PPT'] },
    ],
  },
  {
    id: 'orchestration',
    label: '编排与决策',
    agents: [
      { id: 'quality_gate', name: '质量门控', summary: '分析师报告的 A-F 硬检查与可选 LLM 评审。', tags: ['门控', '质量'] },
      { id: 'bull_researcher', name: '多方研究员', summary: '多空投资辩论中的建设性一方。', tags: ['多空', '辩论'] },
      { id: 'bear_researcher', name: '空方研究员', summary: '多空投资辩论中的怀疑一方。', tags: ['多空', '辩论'] },
      { id: 'research_manager', name: '研究经理', summary: '综合辩论证据形成结构化研究计划。', tags: ['研究', '计划'] },
      { id: 'trader', name: '交易员', summary: '将研究计划转化为可执行的 A 股交易提案。', tags: ['交易', '提案'] },
      { id: 'aggressive_debator', name: '激进风控辩论员', summary: '风控辩论中偏好更高确信度与更大仓位。', tags: ['风控', '激进'] },
      { id: 'conservative_debator', name: '保守风控辩论员', summary: '风控辩论中强调资本保全与更小仓位。', tags: ['风控', '保守'] },
      { id: 'neutral_debator', name: '中性风控辩论员', summary: '在激进与保守观点之间保持平衡。', tags: ['风控', '中性'] },
      { id: 'portfolio_manager', name: '组合经理', summary: '输出最终买入、超配、持有、低配或卖出决策。', tags: ['决策', '组合'] },
    ],
  },
]

/** The 184-skill catalog grouped into nine presentation categories. */
export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    id: 'equity-research-valuation',
    label: '证券研究与估值',
    count: 42,
    samples: ['china-market-data', 'china-comps', 'china-dcf', 'china-3-statement-model', 'equity-research'],
  },
  {
    id: 'investment-banking',
    label: '投资银行',
    count: 22,
    samples: ['pitch-deck', 'cim-builder', 'merger-model', 'deal-sourcing', 'ib-check-deck'],
  },
  {
    id: 'private-equity',
    label: '私募股权',
    count: 18,
    samples: ['dd-checklist', 'ic-memo', 'returns-analysis', 'value-creation-plan', 'portfolio-monitoring'],
  },
  {
    id: 'fund-operations',
    label: '基金运营',
    count: 16,
    samples: ['nav-tieout', 'roll-forward', 'variance-commentary', 'audit-xls', 'accrual-schedule'],
  },
  {
    id: 'wealth-management',
    label: '财富管理',
    count: 12,
    samples: ['client-report', 'financial-plan', 'portfolio-rebalance', 'investment-proposal'],
  },
  {
    id: 'compliance-operations',
    label: '合规与运营',
    count: 14,
    samples: ['kyc-rules', 'kyc-doc-parse', 'break-trace', 'operations'],
  },
  {
    id: 'market-data',
    label: '金融市场数据',
    count: 24,
    samples: ['market-data', 'data-providers', 'macro-liquidity', 'us-market-sentiment'],
  },
  {
    id: 'tools-meta',
    label: '工具与元技能',
    count: 18,
    samples: ['skill-creator', 'xlsx-author', 'pptx-author', 'ui-tools', 'startup-tools'],
  },
  {
    id: 'financial-analysis',
    label: '金融分析',
    count: 18,
    samples: ['catalyst-calendar', 'earnings-analysis', 'thesis-tracker', 'morning-note', 'tech-earnings-deepdive'],
  },
]
