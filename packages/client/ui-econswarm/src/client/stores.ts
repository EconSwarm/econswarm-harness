/**
 * EconSwarm library viewing store: the active page shared by the sidebar
 * navigation and the overlay page host. One handle is created in apply and
 * passed to both registrations, so opening from the sidebar flips the
 * overlay and closing from the page returns to the session surface.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** One library page id. */
export type EconswarmPage = 'workflows' | 'agents' | 'skills'

/** Library navigation state. */
export type EconswarmNavState = {
  /** Active page; null renders no overlay. */
  page: EconswarmPage | null
}

/** Declared write surface for the library store. */
type EconswarmNavActions = {
  open: (draft: EconswarmNavState, page: EconswarmPage) => void
  close: (draft: EconswarmNavState) => void
}

/**
 * Create the library viewing-store handle.
 * @returns the store handle (init + declared actions).
 */
export function createEconswarmStore(): EngineStoreHandle<EconswarmNavState, EconswarmNavActions> {
  return defineStore({
    init: (): EconswarmNavState => ({ page: null }),
    actions: {
      open: (draft, page: EconswarmPage) => { draft.page = page },
      close: (draft) => { draft.page = null },
    },
  })
}
