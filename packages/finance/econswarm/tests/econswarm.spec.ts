import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import EconSwarmRuntime from '../src/index.ts'
import { hardCheckQuality, listRoles, resolveAnalystIds } from '../src/index.ts'

describe('dsh-econswarm plugin', () => {
  it('registers the domain service with all 34 ported roles', async () => {
    const ctx = new Context()
    await ctx.plugin(EconSwarmRuntime)
    expect(ctx.econswarm.listRoles()).toHaveLength(34)
    expect(ctx.econswarm.defaultAnalysts().map(role => role.id)).toEqual([
      'market',
      'social',
      'news',
      'fundamentals',
      'policy',
      'hot_money',
      'lockup',
    ])
  })

  it('resolves request analyst ids and rejects unknown ids', () => {
    expect(resolveAnalystIds(['market', 'news', 'portfolio_manager'])).toEqual([
      'market',
      'news',
      'portfolio_manager',
    ])
    expect(() => resolveAnalystIds(['missing'])).toThrow(/unknown EconSwarm analyst id/)
  })

  it('exposes role metadata and skill bindings', () => {
    const roles = listRoles()
    const modelBuilder = roles.find(role => role.id === 'china_model_builder')
    expect(modelBuilder?.skills).toContain('china-3-statement-model')
    expect(roles.find(role => role.id === 'portfolio_manager')?.modelClass).toBe('deep')
  })
})

describe('econswarm quality gate', () => {
  const longReport = '| field | value |\n|---|---|\n| close | 10 |\n' + 'x'.repeat(250)

  it('grades empty and short reports', () => {
    expect(hardCheckQuality({ market_report: '' }).hardChecks.market?.grade).toBe('F')
    expect(hardCheckQuality({ market_report: 'short' }).hardChecks.market?.grade).toBe('D')
  })

  it('grades a complete report as A', () => {
    expect(hardCheckQuality({ market_report: longReport }).hardChecks.market?.grade).toBe('A')
  })

  it('downgrades missing-data markers', () => {
    const report = `${longReport}\n[数据缺失: cash flow]\n[数据缺失: guidance]\n[数据缺失: peers]`
    expect(hardCheckQuality({ market_report: report }).hardChecks.market?.grade).toBe('C')
  })
})
