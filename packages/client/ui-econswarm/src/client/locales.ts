/** `econswarm` namespace dictionaries: sidebar navigation and library pages. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'econswarm'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'nav.title': '金融导航',
  'nav.workflows': '工作流',
  'nav.agents': '智能体广场',
  'nav.skills': '技能',
  'page.close': '关闭金融导航',
  'page.search': '搜索工作流、智能体或技能',
  'page.empty': '没有匹配的结果',
  'workflows.title': '研究工作流',
  'workflows.subtitle': '编排多智能体与金融技能，复用可追溯的分析流水线。',
  'workflows.count': '{count} 个内置工作流',
  'workflows.run': '发起对话',
  'workflows.system': '系统工作流',
  'workflows.custom': '自定义工作流',
  'workflows.stages': '{count} 个阶段',
  'workflows.agents': '{count} 个智能体',
  'workflows.skills': '{count} 项技能',
  'agents.title': '智能体广场',
  'agents.subtitle': '34 个专业角色按团队分组，覆盖研究、投行、私募、基金运营与合规。',
  'agents.count': '共 {count} 个角色',
  'agents.tools': '{count} 个工具',
  'agents.skills': '{count} 项技能',
  'skills.title': '金融技能库',
  'skills.subtitle': '184 项可复用金融技能，按研究、交付与运营场景分类。',
  'skills.count': '共 {count} 项技能',
  'skills.sample': '代表技能',
} satisfies Record<string, string>

/** English dictionary, checked complete against the zh key set. */
export const en: Record<EconswarmKey, string> = {
  'nav.title': 'Finance',
  'nav.workflows': 'Workflows',
  'nav.agents': 'Agent Plaza',
  'nav.skills': 'Skills',
  'page.close': 'Close finance navigation',
  'page.search': 'Search workflows, agents, or skills',
  'page.empty': 'No matching results',
  'workflows.title': 'Research Workflows',
  'workflows.subtitle': 'Orchestrate multi-agent pipelines with reusable financial skills.',
  'workflows.count': '{count} built-in workflows',
  'workflows.run': 'Start session',
  'workflows.system': 'System workflow',
  'workflows.custom': 'Custom workflow',
  'workflows.stages': '{count} stages',
  'workflows.agents': '{count} agents',
  'workflows.skills': '{count} skills',
  'agents.title': 'Agent Plaza',
  'agents.subtitle': '34 specialized roles grouped by team, covering research, banking, PE, fund operations, and compliance.',
  'agents.count': '{count} roles in total',
  'agents.tools': '{count} tools',
  'agents.skills': '{count} skills',
  'skills.title': 'Financial Skill Library',
  'skills.subtitle': '184 reusable financial skills organized by research, delivery, and operations.',
  'skills.count': '{count} skills in total',
  'skills.sample': 'Representative skills',
}

/** Union of this namespace's dictionary keys. */
export type EconswarmKey = keyof typeof zh
