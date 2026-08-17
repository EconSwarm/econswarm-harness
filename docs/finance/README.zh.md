# EconSwarm 金融插件

[English](README.md) | 中文

本文档记录 EconSwarm 到 DeepSeek Harness 的迁移。 源系统是维护在本仓库之外的 Python/LangGraph 金融多智能体引擎，其工作流引擎、Agent 角色、技能注册表和数源路由器正在移植到 Cordis 插件扩展点。

已发布插件源码位于 [packages/finance](../../packages/finance/README.md)；可运行平台示例位于 [examples/econswarm-platform](../../examples/econswarm-platform/README.md)。

## 文档

- [迁移对照表](migration-map.md) - 模块级源码映射与状态。
- [部署](deployment.md) - 本地、容器与生产运维。
- [测试报告](test-report.md) - 已运行命令与证据。
