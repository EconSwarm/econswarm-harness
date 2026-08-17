/**
 * Sidebar finance navigation: three feature entries (workflows, agent plaza,
 * skills) rendered in the `sidebar.nav` seat. Wide columns show labels;
 * the collapsed rail keeps 36px icon controls with tooltips. Selection lives
 * in the shared EconSwarm viewing store, which also drives the page overlay.
 */
import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import {
  IconAgentPresetOutline16, IconDataOutline16, IconSkillOutline16, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type { EconswarmKey } from './locales.ts'
import type { createEconswarmStore, EconswarmPage } from './stores.ts'
import css from './SidebarNav.module.css'

/** Full sidebar navigation props. */
export type SidebarNavProps =
  PropsRuntime<'sidebar.nav'>
  & PropsStore<ReturnType<typeof createEconswarmStore>>
  & PropsLocale<'econswarm'>

const NAV_ITEMS: readonly { page: EconswarmPage; key: EconswarmKey; icon: ReactNode }[] = [
  { page: 'workflows', key: 'nav.workflows', icon: <IconDataOutline16 /> },
  { page: 'agents', key: 'nav.agents', icon: <IconAgentPresetOutline16 /> },
  { page: 'skills', key: 'nav.skills', icon: <IconSkillOutline16 /> },
]

/** Render the sidebar finance navigation strip. */
export function SidebarNav({ wide, useStore, actions, t }: SidebarNavProps) {
  const page = useStore(state => state.page)
  return (
    <nav className={clsx(css.nav, !wide && css.rail)} aria-label={t('nav.title')}>
      {wide && <div className={css.title}>{t('nav.title')}</div>}
      {NAV_ITEMS.map(({ page: target, key, icon }) => {
        const label = t(key)
        const button = (
          <button
            key={target}
            type="button"
            className={clsx(css.item, page === target && css.active)}
            aria-current={page === target ? 'true' : undefined}
            aria-label={wide ? undefined : label}
            onClick={() => { actions.open(target) }}
          >
            <span className={css.icon}>{icon}</span>
            {wide && <span className={css.label}>{label}</span>}
          </button>
        )
        return wide ? button : (
          <Tooltip key={target} label={label} side="right" delayMs={500}>
            {button}
          </Tooltip>
        )
      })}
    </nav>
  )
}
