# econswarm-platform

[English](README.md) | 中文

基于 DeepSeek Harness 的可运行 EconSwarm 金融多智能体平台。 示例在共享 `dsh --profile headless` 组合上挂载 `@deepseek-ai/dsh-econswarm`、`@deepseek-ai/dsh-skill-econswarm` 与 `@deepseek-ai/dsh-tool-econswarm`。

## 前置条件

Node.js `^22.19 || >=24`、pnpm、仓库根目录 `.env` 或环境中导出的 `DEEPSEEK_API_KEY`，以及通过 `pnpm install` 安装的工作区依赖。

## 运行

```sh
pnpm dsh --profile headless --patch examples/econswarm-platform/cordis.yml "analyze 600519.SH and return the final decision"
```

便捷启动脚本把第一个参数作为任务：

```sh
examples/econswarm-platform/start.sh "analyze 600519.SH and return the final decision"
```

模型可以调用 `econswarm_list_roles` 与 `econswarm_run_pipeline`；标准 `skill` 工具可以加载 184 个打包金融技能中的任意一个。

容器与生产配置见 [部署](../../docs/finance/deployment.md)，模块级移植记录见 [迁移对照表](../../docs/finance/migration-map.md)。
