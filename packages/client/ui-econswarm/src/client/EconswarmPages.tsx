/**
 * Full-center EconSwarm library pages hosted in the `shell.center` seat:
 * workflows, agent plaza, and the skill library. The overlay is additive by
 * design — the session columns stay mounted underneath, the sidebar remains
 * visible, and closing returns to the conversation without losing state.
 */
import { useState, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { IconCloseOutline16, IconPlayOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { AGENT_TEAMS, SKILL_CATEGORIES, WORKFLOW_CARDS } from './data.ts'
import type { createEconswarmStore } from './stores.ts'
import css from './EconswarmPages.module.css'

/** Injected page actions: starting a workflow closes the library and opens a session. */
export interface EconswarmPagesInjected {
  /** Start the shared New Session flow (workspace-aware). */
  startSession: () => void
}

/** Full library overlay props. */
export type EconswarmPagesProps =
  PropsRuntime<'shell.overlay'>
  & PropsStore<ReturnType<typeof createEconswarmStore>>
  & PropsLocale<'econswarm'>
  & EconswarmPagesInjected

/** Shared empty-state copy. */
function EmptyState({ t }: { t: EconswarmPagesProps['t'] }) {
  return <div className={css.empty}>{t('page.empty')}</div>
}

/** Top bar plus a scrollable page body. */
function PageShell({
  onClose, t, children,
}: {
  onClose: () => void
  t: EconswarmPagesProps['t']
  children: (query: string) => ReactNode
}) {
  const [query, setQuery] = useState('')
  return (
    <div className={css.page} data-econswarm-page="library">
      <header className={css.topbar}>
        <input
          className={css.search}
          type="search"
          value={query}
          aria-label={t('page.search')}
          placeholder={t('page.search')}
          onChange={(event) => { setQuery(event.currentTarget.value) }}
        />
        <button type="button" className={css.close} aria-label={t('page.close')} onClick={onClose}>
          <IconCloseOutline16 />
        </button>
      </header>
      <div className={css.body}>
        <div className={css.inner}>
          {children(query)}
        </div>
      </div>
    </div>
  )
}

/** Workflow library: built-in system workflows plus a custom template. */
function WorkflowsPage({
  query, onRun, t,
}: {
  query: string
  onRun: () => void
  t: EconswarmPagesProps['t']
}) {
  const normalized = query.trim().toLowerCase()
  const items = normalized === ''
    ? WORKFLOW_CARDS
    : WORKFLOW_CARDS.filter(card =>
      [card.name, card.summary, card.target].join(' ').toLowerCase().includes(normalized))
  return (
    <>
      <header className={css.hero}>
        <p className={css.eyebrow}>{t('workflows.count', { count: WORKFLOW_CARDS.length - 1 })}</p>
        <h1 className={css.title}>{t('workflows.title')}</h1>
        <p className={css.subtitle}>{t('workflows.subtitle')}</p>
      </header>
      {items.length === 0
        ? <EmptyState t={t} />
        : (
          <div className={css.cardGrid}>
            {items.map(card => (
              <article key={card.id} className={css.card}>
                <div className={css.cardHead}>
                  <span className={css.cardName}>{card.name}</span>
                  <span className={clsx(css.badge, !card.system && css.badgeCustom)}>
                    {t(card.system ? 'workflows.system' : 'workflows.custom')}
                  </span>
                </div>
                <p className={css.cardSummary}>{card.summary}</p>
                <div className={css.cardMeta}>
                  <span>{t('workflows.stages', { count: card.stages })}</span>
                  <span>{t('workflows.agents', { count: card.agents })}</span>
                  <span>{t('workflows.skills', { count: card.skills })}</span>
                </div>
                <button type="button" className={css.run} onClick={onRun}>
                  <IconPlayOutline16 />
                  <span>{t('workflows.run')}</span>
                </button>
              </article>
            ))}
          </div>
        )}
    </>
  )
}

/** Agent plaza: all 34 roles grouped by team. */
function AgentsPage({ query, t }: { query: string; t: EconswarmPagesProps['t'] }) {
  const normalized = query.trim().toLowerCase()
  const teams = normalized === ''
    ? AGENT_TEAMS
    : AGENT_TEAMS
      .map(team => ({
        ...team,
        agents: team.agents.filter(agent =>
          [agent.name, agent.summary, ...agent.tags].join(' ').toLowerCase().includes(normalized)),
      }))
      .filter(team => team.agents.length > 0)
  return (
    <>
      <header className={css.hero}>
        <p className={css.eyebrow}>{t('agents.count', { count: AGENT_TEAMS.reduce((sum, team) => sum + team.agents.length, 0) })}</p>
        <h1 className={css.title}>{t('agents.title')}</h1>
        <p className={css.subtitle}>{t('agents.subtitle')}</p>
      </header>
      {teams.length === 0
        ? <EmptyState t={t} />
        : teams.map(team => (
          <section key={team.id} className={css.team}>
            <h2 className={css.teamTitle}>{team.label}</h2>
            <div className={css.agentGrid}>
              {team.agents.map(agent => (
                <article key={agent.id} className={css.agentCard}>
                  <div className={css.agentName}>{agent.name}</div>
                  <p className={css.agentSummary}>{agent.summary}</p>
                  <div className={css.tags}>
                    {agent.tags.map(tag => <span key={tag} className={css.tag}>{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
    </>
  )
}

/** Skill library: 184 skills grouped into nine categories. */
function SkillsPage({ query, t }: { query: string; t: EconswarmPagesProps['t'] }) {
  const normalized = query.trim().toLowerCase()
  const categories = normalized === ''
    ? SKILL_CATEGORIES
    : SKILL_CATEGORIES.filter(category =>
      [category.label, ...category.samples].join(' ').toLowerCase().includes(normalized))
  return (
    <>
      <header className={css.hero}>
        <p className={css.eyebrow}>{t('skills.count', { count: SKILL_CATEGORIES.reduce((sum, category) => sum + category.count, 0) })}</p>
        <h1 className={css.title}>{t('skills.title')}</h1>
        <p className={css.subtitle}>{t('skills.subtitle')}</p>
      </header>
      {categories.length === 0
        ? <EmptyState t={t} />
        : (
          <div className={css.skillGrid}>
            {categories.map(category => (
              <article key={category.id} className={css.skillCard}>
                <div className={css.skillHead}>
                  <span className={css.skillName}>{category.label}</span>
                  <span className={css.skillCount}>{t('skills.count', { count: category.count })}</span>
                </div>
                <div className={css.sampleLabel}>{t('skills.sample')}</div>
                <div className={css.samples}>
                  {category.samples.map(sample => <span key={sample} className={css.sample}>{sample}</span>)}
                </div>
              </article>
            ))}
          </div>
        )}
    </>
  )
}

/** Render the active library page, or nothing while closed. */
export function EconswarmPages({ useStore, actions, startSession, t }: EconswarmPagesProps) {
  const page = useStore(state => state.page)
  if (page === null) return null
  const onRun = (): void => {
    actions.close()
    startSession()
  }
  return (
    <PageShell onClose={actions.close} t={t}>
      {(query) => {
        if (page === 'workflows') return <WorkflowsPage query={query} onRun={onRun} t={t} />
        if (page === 'agents') return <AgentsPage query={query} t={t} />
        return <SkillsPage query={query} t={t} />
      }}
    </PageShell>
  )
}
