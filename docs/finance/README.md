# EconSwarm finance plugins

English | [中文](README.zh.md)


This directory documents the EconSwarm-to-DeepSeek-Harness migration. The source system is the Python/LangGraph financial multi-agent engine kept outside this repository, whose workflow engine, agent roles, skill registry, and data-vendor router are being ported onto Cordis plugin extension points.

The shipped plugin source lives in [packages/finance](../../packages/finance/README.md); the runnable platform leaf is [examples/econswarm-platform](../../examples/econswarm-platform/README.md).

## Documents

- [Migration map](migration-map.md) - module-by-module source mapping and status.
- [Deployment](deployment.md) - local, container, and production operations.
- [Test report](test-report.md) - commands run and evidence.
