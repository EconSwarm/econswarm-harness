/**
 * Packaged EconSwarm financial skill catalog provider.
 *
 * The provider walks the bundled `assets/swarmskills` tree, parses the
 * original SKILL.md frontmatter, and publishes every catalog entry through
 * `ctx.skills`. Domain-nested skills keep their directory name when unique
 * and receive a domain prefix only when another skill shares the name.
 *
 * @module @deepseek-ai/dsh-skill-econswarm
 */

import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import {
  BUNDLED_SKILL_RANK,
  isSkillName,
  type SkillCandidate,
  type SkillDefinition,
  type SkillLookupOptions,
  type SkillProvider,
} from '@deepseek-ai/dsh-skill'

const SKILLS_ROOT = new URL('../assets/swarmskills/', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(SKILLS_ROOT),
} as const
const PROVIDER_NAME = 'econswarm'
const INVOCATION = { modelInvocable: true, userInvocable: true } as const

interface RawSkill {
  readonly name: string
  readonly domain: string
  readonly relativePath: string
  readonly description: string
  readonly locator: URL
}

/** Normalize a directory name into the kebab-case skill-name grammar. */
function normalizeSkillName(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return normalized.length === 0 ? 'skill' : normalized
}

/** Read the original YAML frontmatter name/description without a YAML dependency. */
function parseFrontmatter(raw: string): { name?: string; description?: string } {
  const match = /^---\s*\n([\s\S]*?)\n---/.exec(raw)
  if (match === null) return {}
  const block = match[1]
  if (block === undefined) return {}
  const value = (key: string): string | undefined =>
    new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(block)?.[1]?.trim().replace(/^["']|["']$/g, '')
  const name = value('name_en') ?? value('name')
  const description = value('description_en') ?? value('description')
  return {
    ...name !== undefined ? { name } : {},
    ...description !== undefined ? { description } : {},
  }
}

/** Remove the YAML frontmatter from a SKILL.md body. */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '').trim()
}

/** Recursively collect SKILL.md files below one asset directory. */
async function collectSkills(dir: URL, domain: string, out: RawSkill[]): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir)
    if (entry.isDirectory()) {
      const nextDomain = domain.length === 0 ? entry.name : `${domain}/${entry.name}`
      await collectSkills(child, nextDomain, out)
      continue
    }
    if (entry.name !== 'SKILL.md') continue
    const raw = await readFile(child, 'utf8')
    const parsed = parseFrontmatter(raw)
    const directoryName = new URL('.', child).pathname.split('/').filter(Boolean).at(-2)
    if (directoryName === undefined) continue
    out.push({
      name: parsed.name ?? directoryName,
      domain,
      relativePath: child.pathname.slice(SKILLS_ROOT.pathname.length),
      description: parsed.description ?? '',
      locator: child,
    })
  }
}

/** Build unique kebab-case candidates, prefixing domain on name collisions. */
async function buildCandidates(): Promise<SkillCandidate[]> {
  const raw: RawSkill[] = []
  await collectSkills(SKILLS_ROOT, '', raw)
  const normalized = raw.map(skill => ({
    ...skill,
    normalizedName: normalizeSkillName(skill.name),
  }))
  const counts = new Map<string, number>()
  for (const skill of normalized) {
    counts.set(skill.normalizedName, (counts.get(skill.normalizedName) ?? 0) + 1)
  }
  const used = new Set<string>()
  const candidates: SkillCandidate[] = []
  for (const skill of normalized) {
    let name = skill.normalizedName
    if ((counts.get(name) ?? 0) > 1 && skill.domain.length > 0) {
      name = `${normalizeSkillName(skill.domain.split('/').at(-1) ?? 'domain')}-${name}`
    }
    if (used.has(name)) {
      name = `${normalizeSkillName(skill.domain.replaceAll('/', '-'))}-${name}`
    }
    if (!isSkillName(name)) throw new Error(`invalid EconSwarm skill name after normalization: ${name}`)
    if (used.has(name)) throw new Error(`duplicate EconSwarm skill name: ${name}`)
    used.add(name)
    candidates.push({
      name,
      description: skill.description || `EconSwarm financial skill ${skill.name}`,
      invocation: INVOCATION,
      source: 'bundled',
      provider: PROVIDER_NAME,
      resourceBase: RESOURCE_BASE,
      rank: BUNDLED_SKILL_RANK,
      locator: skill.locator,
      path: fileURLToPath(skill.locator),
      metadata: skill.domain.length > 0 ? { domain: skill.domain } : { domain: '' },
    })
  }
  return candidates.sort((left, right) => left.name.localeCompare(right.name))
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: async (): Promise<SkillCandidate[]> => buildCandidates(),
  async get(candidate: SkillCandidate, _options: SkillLookupOptions): Promise<SkillDefinition | undefined> {
    const locator = candidate.locator as URL
    let raw: string
    try {
      raw = await readFile(locator, 'utf8')
    } catch {
      return undefined
    }
    return {
      name: candidate.name,
      description: candidate.description,
      invocation: candidate.invocation,
      source: candidate.source,
      provider: candidate.provider,
      resourceBase: RESOURCE_BASE,
      ...candidate.path !== undefined ? { path: candidate.path } : {},
      ...candidate.metadata !== undefined ? { metadata: candidate.metadata } : {},
      content: stripFrontmatter(raw),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skills-econswarm'
/** Service required by the packaged provider. */
export const inject = ['skills']

/** Register the packaged EconSwarm skill catalog on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
}
