/**
 * EconSwarm library browser plugin: registers the sidebar finance navigation
 * and the full-viewport library pages, sharing one viewing store between the
 * two entries. Export discipline: packages/client/AGENTS.md.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pull the sidebar.nav and shell.overlay SlotMap merges into the
// programs that resolve the runtime shares below.
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { EconswarmPages, type EconswarmPagesInjected } from './EconswarmPages.tsx'
import { SidebarNav } from './SidebarNav.tsx'
import { en, NS, zh, type EconswarmKey } from './locales.ts'
import { createEconswarmStore } from './stores.ts'

export type {
  EconswarmPagesInjected, EconswarmPagesProps,
} from './EconswarmPages.tsx'
export type { SidebarNavProps } from './SidebarNav.tsx'
export type { EconswarmKey } from './locales.ts'
export type { EconswarmPage } from './stores.ts'
export { createEconswarmStore } from './stores.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** EconSwarm navigation and library pages copy. */
    econswarm: EconswarmKey
  }
}

/** Required services: slot composition, locale, and the shared session flow. */
export const inject = ['slots', 'locale', 'workspaces']

/**
 * Register the finance navigation and library pages.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const store = createEconswarmStore()
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-econswarm: dictionaries')

  ctx.slots.inject('sidebar.nav', () => ctx.slots.register({
    name: 'sidebar.nav',
    locale: NS,
    store,
  }, SidebarNav))

  ctx.slots.inject('shell.center', () => ctx.slots.register({
    name: 'shell.center',
    id: 'econswarm-pages',
    locale: NS,
    store,
    inject: (): EconswarmPagesInjected => ({
      startSession: () => { ctx.workspaces.startSession() },
    }),
  }, EconswarmPages))
}
