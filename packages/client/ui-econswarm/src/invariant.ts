/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-econswarm`.
 * @module @deepseek-ai/dsh-client-ui-econswarm/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-client-ui-econswarm'

/** Cordis companion plugin name. */
export const name = 'client-ui-econswarm-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the browser plugin renders a static feature catalog
 * and owns a single viewing store; the Host finance packages own the
 * authoritative role and skill registries.
 */
const install: InvariantInstaller = () => {}

/** Register this package's invariant companion. */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
