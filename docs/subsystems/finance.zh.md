# Finance

[English](finance.md) | 中文

finance 子系统是移植后的 EconSwarm 金融领域：`ctx.econswarm` 拥有分析师角色注册表、角色技能绑定和第一层质量门控；`@deepseek-ai/dsh-skill-econswarm` 通过[技能注册表](skills.md)发布打包金融技能目录；`@deepseek-ai/dsh-tool-econswarm` 拥有模型可见分析师目录与流水线工具。

Source: [`packages/finance/econswarm/src/index.ts`](../../packages/finance/econswarm/src/index.ts), [`packages/finance/skills-econswarm/src/index.ts`](../../packages/finance/skills-econswarm/src/index.ts), and [`packages/finance/tool-econswarm/src/index.ts`](../../packages/finance/tool-econswarm/src/index.ts).

## Service Definition

`ctx.econswarm` 暴露只读角色元数据和原始七核心默认值。 编排属于 Consumer 关注点：流水线工具通过 [subagents](subagent.md) 委托各阶段，质量门控在进程内作为纯函数运行。

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
