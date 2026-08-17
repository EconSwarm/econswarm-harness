# Finance packages

English | [中文](README.zh.md)


The `finance` group ports the EconSwarm financial multi-agent engine onto DeepSeek Harness extension points. It contains the domain service, the packaged skill catalog, and the model-facing pipeline consumer.

| Package | npm name | Role |
|---|---|---|
| [`econswarm/`](econswarm/README.md) | `@deepseek-ai/dsh-econswarm` | Analyst registry, skill bindings, quality gate |
| [`skills-econswarm/`](skills-econswarm/README.md) | `@deepseek-ai/dsh-skill-econswarm` | Packaged 184-skill financial catalog provider |
| [`tool-econswarm/`](tool-econswarm/README.md) | `@deepseek-ai/dsh-tool-econswarm` | `econswarm_list_roles` and `econswarm_run_pipeline` tools |

The group follows the harness capability-seam pattern: the domain service owns vocabulary and pure logic, the skill package contributes through `ctx.skills`, and the consumer registers model-facing tools without owning providers.
