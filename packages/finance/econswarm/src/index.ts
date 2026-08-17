/**
 * EconSwarm financial multi-agent domain service.
 *
 * The service owns the ported analyst registry, skill bindings, and Layer-1
 * quality-gate vocabulary. Orchestration and model-facing tools live in
 * sibling finance plugins so a deployment can expose the domain without
 * coupling it to one transport.
 *
 * @module @deepseek-ai/dsh-econswarm
 */

import { Context, Service } from '@deepseek-ai/cordis'
import type { AnalystRole } from './types.ts'
import { DEFAULT_ANALYST_IDS, getRole, listRoles } from './roles.ts'

export * from './types.ts'
export * from './roles.ts'
export * from './quality.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    econswarm: EconSwarmRuntime
  }
}

/** EconSwarm domain service registered as `ctx.econswarm`. */
export class EconSwarmRuntime extends Service {
  constructor(ctx: Context) {
    super(ctx, 'econswarm')
  }

  /**
   * List every ported analyst and orchestration role.
   * @returns all ported roles in registration order.
   */
  listRoles(): readonly AnalystRole[] {
    return listRoles()
  }

  /**
   * Resolve one role by its stable id string.
   * @param id - stable role id.
   * @returns the matching role, or `undefined` when unknown.
   */
  getRole(id: string): AnalystRole | undefined {
    return getRole(id)
  }

  /**
   * Return the original seven-core default analyst selection.
   * @returns the seven default core roles.
   */
  defaultAnalysts(): readonly AnalystRole[] {
    return DEFAULT_ANALYST_IDS.map(id => getRole(id)).filter((role): role is AnalystRole => role !== undefined)
  }
}

export default EconSwarmRuntime
