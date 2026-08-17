/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-tool-econswarm`.
 * @module @deepseek-ai/dsh-tool-econswarm/invariant
 */

import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-tool-econswarm'

/** Cordis companion plugin name. */
export const name = 'tool-econswarm-invariant'
/** Service required before the companion can register. */
export const inject = ['invariants']

/**
 * No runtime invariant: the tools are stateless consumers over the subagent
 * seam and the pure EconSwarm domain service; tool registry registration owns
 * disposal.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
