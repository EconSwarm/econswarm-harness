// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { makeTranslate, SlotTestRuntime } from '@deepseek-ai/dsh-client-test-runtime'
import { EconswarmPages, type EconswarmPagesProps } from '../src/client/EconswarmPages.tsx'
import { SidebarNav, type SidebarNavProps } from '../src/client/SidebarNav.tsx'
import { zh } from '../src/client/locales.ts'
import { createEconswarmStore } from '../src/client/stores.ts'
import { apply, inject } from '../src/client/index.ts'
import { apply as applyNode } from '../src/index.ts'

afterEach(cleanup)

const t = makeTranslate(zh)
const neverHook = (() => { throw new Error('component must not read global hooks') }) as never

function mountNav(wide: boolean) {
  const store = createEconswarmStore().create()
  const props: SidebarNavProps = {
    wide,
    expandSidebar: vi.fn(),
    useSessions: neverHook,
    useWorkspaces: neverHook,
    useStore: bindSnapshotSelector(store),
    actions: store.actions,
    t,
  }
  const view = render(<SidebarNav {...props} />)
  return { view, store }
}

function mountPages() {
  const store = createEconswarmStore().create()
  const startSession = vi.fn()
  const props: EconswarmPagesProps = {
    useSessions: neverHook,
    useWorkspaces: neverHook,
    useStore: bindSnapshotSelector(store),
    actions: store.actions,
    startSession,
    t,
  }
  const view = render(<EconswarmPages {...props} />)
  return { view, store, startSession }
}

describe('Econswarm viewing store', () => {
  it('opens and closes one active page', () => {
    const store = createEconswarmStore().create()
    expect(store.getSnapshot()).toEqual({ page: null })
    store.actions.open('workflows')
    expect(store.getSnapshot().page).toBe('workflows')
    store.actions.close()
    expect(store.getSnapshot().page).toBeNull()
  })
})

describe('SidebarNav', () => {
  it('renders wide labels and opens the active page from the strip', () => {
    const b = mountNav(true)
    expect(screen.getByText('金融导航')).toBeTruthy()
    const workflows = screen.getByRole('button', { name: '工作流' })
    expect(workflows.getAttribute('aria-current')).toBeNull()
    fireEvent.click(workflows)
    expect(b.store.getSnapshot().page).toBe('workflows')
    expect(workflows.getAttribute('aria-current')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: '智能体广场' }))
    expect(b.store.getSnapshot().page).toBe('agents')
    fireEvent.click(screen.getByRole('button', { name: '技能' }))
    expect(b.store.getSnapshot().page).toBe('skills')
  })

  it('keeps rail controls icon-only with tooltip labels', () => {
    const b = mountNav(false)
    expect(screen.queryByText('金融导航')).toBeNull()
    const agents = screen.getByRole('button', { name: '智能体广场' })
    expect(agents.textContent).not.toContain('智能体广场')
    fireEvent.click(agents)
    expect(b.store.getSnapshot().page).toBe('agents')
  })
})

describe('EconswarmPages', () => {
  it('renders nothing while closed', () => {
    mountPages()
    expect(screen.queryByText('研究工作流')).toBeNull()
    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('shows workflows, starts a session on run, and returns to sessions', () => {
    const b = mountPages()
    act(() => { b.store.actions.open('workflows') })
    expect(screen.getByText('研究工作流')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: '发起对话' }).length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByRole('button', { name: '发起对话' })[0]!)
    expect(b.startSession).toHaveBeenCalledOnce()
    expect(b.store.getSnapshot().page).toBeNull()
    expect(screen.queryByText('研究工作流')).toBeNull()
  })

  it('shows the opened page and closes from the top bar', () => {
    const b = mountPages()
    act(() => { b.store.actions.open('agents') })
    expect(screen.getByRole('heading', { name: '智能体广场' })).toBeTruthy()
    expect(screen.getByText('核心分析师')).toBeTruthy()
    act(() => { b.store.actions.open('skills') })
    expect(screen.getByText('金融技能库')).toBeTruthy()
    expect(screen.getByText('共 184 项技能')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '关闭金融导航' }))
    expect(b.store.getSnapshot().page).toBeNull()
  })

  it('filters workflows, agents, and skills by the shared search box', () => {
    const b = mountPages()
    act(() => { b.store.actions.open('workflows') })
    const search = screen.getByRole('searchbox', { name: '搜索工作流、智能体或技能' })
    fireEvent.change(search, { target: { value: '行业' } })
    expect(screen.getByText('A 股行业趋势与机会研究')).toBeTruthy()
    expect(screen.queryByText('A 股全流程分析')).toBeNull()
    fireEvent.change(search, { target: { value: '不存在' } })
    expect(screen.getByText('没有匹配的结果')).toBeTruthy()

    act(() => { b.store.actions.open('agents') })
    fireEvent.change(search, { target: { value: '市场分析师' } })
    expect(screen.getByText('市场分析师')).toBeTruthy()
    expect(screen.queryByText('政策分析师')).toBeNull()

    act(() => { b.store.actions.open('skills') })
    fireEvent.change(search, { target: { value: '私募' } })
    expect(screen.getByText('私募股权')).toBeTruthy()
    expect(screen.queryByText('基金运营')).toBeNull()
  })
})

describe('ui-econswarm apply', () => {
  it('node half provides no host behavior', () => {
    applyNode()
    expect(true).toBe(true)
  })

  it('registers the sidebar nav and overlay sharing one store', async () => {
    const runtime = await SlotTestRuntime.create()
    const locale = new LocaleRuntime(runtime.ctx)
    runtime.provide('locale', locale)
    runtime.slots.installLocale(locale)
    locale.setLocale('zh')
    await runtime.declare({
      'sidebar.nav': { kind: 'single', scope: 'root' },
      'shell.center': { kind: 'list', scope: 'root' },
    })
    const handle = await runtime.mount({ inject: [...inject], apply })
    const nav = runtime.renderSlot('sidebar.nav', { wide: true, expandSidebar: vi.fn() })
    const overlay = runtime.renderSlot('shell.center', {})
    fireEvent.click(nav.view.getByRole('button', { name: '工作流' }))
    expect(overlay.view.getByText('研究工作流')).toBeTruthy()
    fireEvent.click(overlay.view.getAllByRole('button', { name: '发起对话' })[0]!)
    expect(runtime.workspaces.calls.some(call => call.method === 'startSession')).toBe(true)
    await handle.dispose()
    expect(runtime.slots.entries('sidebar.nav')).toHaveLength(0)
    expect(runtime.slots.entries('shell.center').some(entry => entry.options.id === 'econswarm-pages')).toBe(false)
    await runtime.dispose()
  })
})
