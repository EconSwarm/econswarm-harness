# EconSwarm migration test report

English | [中文](test-report.zh.md)


This report records the verification commands run for the port and their outcomes. It is updated after each verification pass.

## Unit and package tests

Package tests cover the domain service, quality-gate grades, skill catalog discovery and disposal, and tool registration. Run:

```sh
pnpm exec vitest run packages/finance
```

## Typecheck and lint

Run the host aggregate and lint:

```sh
pnpm run build:lib:host
pnpm run lint:contracts-ready
```

## Composition smoke

The runnable leaf is booted through the real Loader with the headless profile and the EconSwarm overlay. Keyless composition checks verify that the plugin tree mounts without a model key; live-model checks self-skip without `DEEPSEEK_API_KEY`.

## Evidence

Passed: `pnpm exec vitest run packages/finance` (3 files, 13 tests), `pnpm run doc-sync` (28 gates), `pnpm run build:lib:host`, `pnpm run lint:contracts-ready`, `pnpm run constraints`, `pnpm run knip`, `pnpm run verify-cordis-config`, `pnpm run verify-package-invariants`, `pnpm run verify-node-next-types`, and `pnpm run verify-runtime-closure`.

Composition smoke: `pnpm dsh --profile headless --dump-config --patch examples/econswarm-platform/cordis.yml` emits the `econswarm`, `econswarm-skills`, and `tool-econswarm` rows over the base tree.

Not run in this environment: live-model e2e without `DEEPSEEK_API_KEY`, and the client-side `build:lib:client` lane that fails on pre-existing React type mismatches in `packages/client/*` tests.

`pnpm run hygiene` stops at the repository's pre-existing `rescope-vendor` residue (26 files, mostly untouched by this port) and cannot reach the client-built publint/invariant stages until that residue and the React type baseline are addressed separately.
