# Finance

English | [中文](finance.zh.md)

The finance subsystem is the ported EconSwarm financial domain: `ctx.econswarm` owns the analyst role registry, role skill bindings, and Layer-1 quality gate; `@deepseek-ai/dsh-skill-econswarm` publishes the packaged financial skill catalog through the [skill registry](skills.md); `@deepseek-ai/dsh-tool-econswarm` owns the model-facing analyst catalog and pipeline tools.

Source: [`packages/finance/econswarm/src/index.ts`](../../packages/finance/econswarm/src/index.ts), [`packages/finance/skills-econswarm/src/index.ts`](../../packages/finance/skills-econswarm/src/index.ts), and [`packages/finance/tool-econswarm/src/index.ts`](../../packages/finance/tool-econswarm/src/index.ts).

## Service Definition

`ctx.econswarm` exposes read-only role metadata and the original seven-core default. Orchestration is a consumer concern: the pipeline tool delegates stages through [subagents](subagent.md), and the quality gate runs in process as a pure function.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — this section is byte-identical in both language sides of the page. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxeconswarm--econswarmruntime"></a>

### `ctx.econswarm` — `EconSwarmRuntime`

EconSwarm domain service registered as `ctx.econswarm`.

```ts cordis-catalog
/**
 * List every ported analyst and orchestration role.
 * @returns all ported roles in registration order.
 */
listRoles(): readonly AnalystRole[]

/**
 * Resolve one role by its stable id string.
 * @param id - stable role id.
 * @returns the matching role, or `undefined` when unknown.
 */
getRole(id: string): AnalystRole | undefined

/**
 * Return the original seven-core default analyst selection.
 * @returns the seven default core roles.
 */
defaultAnalysts(): readonly AnalystRole[]
```

Source: [`packages/finance/econswarm/src/index.ts:27`](../../packages/finance/econswarm/src/index.ts)
<!-- END GENERATED cordis-surface -->
