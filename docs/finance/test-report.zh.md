# EconSwarm 迁移测试报告

[English](test-report.md) | 中文

本报告记录移植验证命令及其结果。 每次验证通过后更新。

## 单元与包测试

包测试覆盖领域服务、质量门控分级、技能目录发现与卸载、工具注册。 运行：

```sh
pnpm exec vitest run packages/finance
```

## 类型检查与 Lint

运行 host 聚合与 lint：

```sh
pnpm run build:lib:host
pnpm run lint:contracts-ready
```

## 组合冒烟

可运行示例通过真实 Loader、headless profile 和 EconSwarm 叠加层启动。 无密钥组合检查验证插件树可以在没有模型密钥的情况下挂载；真实模型检查在没有 `DEEPSEEK_API_KEY` 时自动跳过。

## 证据

已通过：`pnpm exec vitest run packages/finance`（3 个文件、13 个测试）、`pnpm run doc-sync`（28 个门禁）、`pnpm run build:lib:host`、`pnpm run lint:contracts-ready`、`pnpm run constraints`、`pnpm run knip`、`pnpm run verify-cordis-config`、`pnpm run verify-package-invariants`、`pnpm run verify-node-next-types` 与 `pnpm run verify-runtime-closure`。

组合冒烟：`pnpm dsh --profile headless --dump-config --patch examples/econswarm-platform/cordis.yml` 在基础树上输出 `econswarm`、`econswarm-skills` 与 `tool-econswarm` 三行。

本环境未运行：缺少 `DEEPSEEK_API_KEY` 的真实模型 e2e，以及因 `packages/client/*` 测试中既有的 React 类型不匹配而失败的 client 侧 `build:lib:client` 通道。

`pnpm run hygiene` 会停在本仓库既有的 `rescope-vendor` 残留（26 个文件，其中大多数与本移植无关），在单独处理该残留与 React 类型基线前无法进入 client 构建后的 publint/invariant 阶段。
