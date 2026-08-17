import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SkillRegistry from '@deepseek-ai/dsh-skill'
import * as SkillsEconswarm from '../src/index.ts'

describe('dsh-skill-econswarm plugin', () => {
  it('declares stable plugin metadata', () => {
    expect(SkillsEconswarm.name).toBe('skills-econswarm')
    expect(SkillsEconswarm.inject).toEqual(['skills'])
  })

  it('publishes the complete ported financial catalog', async () => {
    const ctx = new Context()
    await ctx.plugin(SkillRegistry)
    await ctx.plugin(SkillsEconswarm)
    const skills = await ctx.skills.list()
    expect(skills.length).toBeGreaterThanOrEqual(180)
    expect(new Set(skills.map(skill => skill.name)).size).toBe(skills.length)
    expect(skills.every(skill => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.name))).toBe(true)
  })

  it('loads a full skill body and strips frontmatter', async () => {
    const ctx = new Context()
    await ctx.plugin(SkillRegistry)
    await ctx.plugin(SkillsEconswarm)
    const skill = await ctx.skills.get('dcf-model')
    expect(skill).toBeDefined()
    expect(skill?.content).toContain('DCF Model Builder')
    expect(skill?.content.startsWith('---')).toBe(false)
    expect(skill?.description).toContain('DCF')
  })

  it('unregisters the provider when its fiber disposes', async () => {
    const ctx = new Context()
    await ctx.plugin(SkillRegistry)
    const fiber = await ctx.plugin(SkillsEconswarm)
    expect((await ctx.skills.list()).length).toBeGreaterThan(0)
    await fiber.dispose()
    expect(await ctx.skills.list()).toEqual([])
  })
})
