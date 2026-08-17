# EconSwarm platform deployment

English | [中文](deployment.zh.md)


## Local run

Install workspace dependencies, set `DEEPSEEK_API_KEY`, and run one task through the headless profile overlay:

```sh
pnpm install
export DEEPSEEK_API_KEY=sk-...
pnpm dsh --profile headless --patch examples/econswarm-platform/cordis.yml "analyze 600519.SH and return the final decision"
```

## Container

The repository image uses Node 22 and pnpm workspaces. A minimal production Dockerfile builds the host and client bundles, then runs the headless profile with the EconSwarm overlay:

```dockerfile
FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY vendor ./vendor
COPY packages ./packages
COPY apps ./apps
COPY scripts ./scripts
COPY examples ./examples
RUN pnpm install --frozen-lockfile
RUN pnpm run build:lib

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
CMD ["pnpm", "dsh", "--profile", "headless", "--patch", "examples/econswarm-platform/cordis.yml", "analyze 600519.SH and return the final decision"]
```

Mount a read-only secret for `DEEPSEEK_API_KEY` and a writable volume for `$DSH_HOME` when session persistence is required.

## Production notes

The platform is plugin composition, so production replaces the headless runner with the `web` profile, a different subagent provider, or additional data-provider plugins without editing the finance packages. Keep the subagent provider and tool configuration in the deployment overlay; round limits and output language are deployment policy, not code.

The packaged skill tree is part of the npm package. Deployments that customize skills should layer project or user skill roots above `BUNDLED_SKILL_RANK` instead of editing the package assets.

## Operations

Use `pnpm dsh --profile headless --dump-config --patch examples/econswarm-platform/cordis.yml` to inspect the composed plugin tree. Monitor session persistence, subagent provider health, and model request errors through the standard Harness telemetry and logs.
