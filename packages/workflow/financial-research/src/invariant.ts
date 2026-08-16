/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-financial-research`.
 * @module @deepseek-ai/dsh-financial-research/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-financial-research'

/** Cordis companion plugin name. */
export const name = 'financial-research-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: this browser-safe domain package owns only pure data builders and render
 * helpers; workflow execution and durable traces are validated by the Consumer packages that use it.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
