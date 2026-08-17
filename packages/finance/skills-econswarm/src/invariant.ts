/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-skill-econswarm`.
 * @module @deepseek-ai/dsh-skill-econswarm/invariant
 */

import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-skill-econswarm'

/** Cordis companion plugin name. */
export const name = 'skills-econswarm-invariant'
/** Service required before the companion can register. */
export const inject = ['invariants']

/**
 * No runtime invariant: the provider reads a frozen packaged asset tree and
 * the skill registry owns catalog mutation and invalidation.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
