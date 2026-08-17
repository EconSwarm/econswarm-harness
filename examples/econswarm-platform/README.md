# econswarm-platform

English | [中文](README.zh.md)


Runnable EconSwarm financial multi-agent platform on DeepSeek Harness. The leaf mounts `@deepseek-ai/dsh-econswarm`, `@deepseek-ai/dsh-skill-econswarm`, and `@deepseek-ai/dsh-tool-econswarm` over the shared `dsh --profile headless` composition.

## Prerequisites

Node.js `^22.19 || >=24`, pnpm, a `DEEPSEEK_API_KEY` in the repo root `.env` or exported environment, and the workspace dependencies installed with `pnpm install`.

## Run

```sh
pnpm dsh --profile headless --patch examples/econswarm-platform/cordis.yml "analyze 600519.SH and return the final decision"
```

The convenience launcher forwards its first argument as the task:

```sh
examples/econswarm-platform/start.sh "analyze 600519.SH and return the final decision"
```

The model can call `econswarm_list_roles` and `econswarm_run_pipeline`; the standard `skill` tool loads any of the 184 packaged financial skills.

See [deployment](../../docs/finance/deployment.md) for container and production setup, and [migration map](../../docs/finance/migration-map.md) for the module-by-module porting record.
