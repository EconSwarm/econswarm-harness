# EconSwarm 平台部署

[English](deployment.md) | 中文

## 本地运行

安装工作区依赖，设置 `DEEPSEEK_API_KEY`，并通过 headless profile 叠加层运行一个任务：

```sh
pnpm install
export DEEPSEEK_API_KEY=sk-...
pnpm dsh --profile headless --patch examples/econswarm-platform/cordis.yml "analyze 600519.SH and return the final decision"
```

## 容器

仓库镜像使用 Node 22 与 pnpm workspaces。 最小生产 Dockerfile 构建 host 与 client 产物，然后以 EconSwarm 叠加层运行 headless profile。

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

为 `DEEPSEEK_API_KEY` 挂载只读密钥，并在需要会话持久化时为 `$DSH_HOME` 挂载可写卷。

## 生产说明

平台是插件组合，生产环境可以用 `web` profile、其他 subagent Provider 或额外数源插件替换 headless runner，无需修改 finance 包。 把 subagent Provider 与工具配置保留在部署叠加层；轮次上限和输出语言属于部署策略而非代码。

打包技能树属于 npm 包。 需要定制技能的部署应在 `BUNDLED_SKILL_RANK` 之上叠加项目或用户技能根目录，而不是编辑包资产。

## 运维

使用 `pnpm dsh --profile headless --dump-config --patch examples/econswarm-platform/cordis.yml` 检查组合后的插件树。 通过标准 Harness 遥测与日志监控会话持久化、subagent Provider 健康状态和模型请求错误。
