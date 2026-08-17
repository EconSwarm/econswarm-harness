# Finance 包

[English](README.md) | 中文

`finance` 组把 EconSwarm 金融多智能体引擎移植到 DeepSeek Harness 扩展点。 它包含领域服务、打包技能目录和模型可见流水线 Consumer。

| 包 | npm 名称 | 角色 |
|---|---|---|
| [`econswarm/`](econswarm/README.md) | `@deepseek-ai/dsh-econswarm` | 分析师注册表、技能绑定、质量门控 |
| [`skills-econswarm/`](skills-econswarm/README.md) | `@deepseek-ai/dsh-skill-econswarm` | 打包的 184 技能金融目录 Provider |
| [`tool-econswarm/`](tool-econswarm/README.md) | `@deepseek-ai/dsh-tool-econswarm` | `econswarm_list_roles` 与 `econswarm_run_pipeline` 工具 |

该组遵循 harness 能力接缝模式：领域服务拥有词汇与纯逻辑，技能包通过 `ctx.skills` 贡献，Consumer 注册模型可见工具但不拥有 Provider。
