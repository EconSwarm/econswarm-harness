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
