# EconSwarm 迁移对照表

[English](migration-map.md) | 中文

本表把原始 EconSwarm 模块映射到 DeepSeek Harness 插件包，并记录哪些以源码移植、哪些以打包资产承载、哪些仍待实现。

| 原始模块 | 原始职责 | 移植位置 | 状态 |
|---|---|---|---|
| `swarmagents/graph/trading_graph.py` | 主入口：配置、LLM 选择、图编译、propagate | `packages/finance/tool-econswarm/src/pipeline.ts` | 以子代理编排移植 |
| `swarmagents/graph/setup.py` | LangGraph 节点接线与分析师注册表 | `packages/finance/econswarm/src/roles.ts` | 以数据驱动角色注册表移植 |
| `swarmagents/graph/conditional_logic.py` | 辩论/风险轮次路由 | `tool-econswarm` 的 `maxDebateRounds`/`maxRiskDiscussRounds` | 以循环计数移植 |
| `swarmagents/graph/checkpointer.py` | 每标的 SQLite 断点 | Harness 会话持久化 | 待实现；会话日志负责持久性 |
| `swarmagents/graph/reflection.py` | 延迟收益反思 | 待实现 | 待实现 |
| `swarmagents/graph/signal_processing.py` | 确定性信号提取 | 待实现 | 待实现 |
| `swarmagents/agents/__init__.py` | 34 个 Agent 工厂 | `roles.ts` | 以角色元数据移植；完整提示词待实现 |
| `swarmagents/agents/quality_gate.py` | 第一层硬检查 + LLM 复审 | `packages/finance/econswarm/src/quality.ts` | 第一层已移植；LLM 复审待实现 |
| `swarmagents/skills/registry.py` | SKILL.md 加载、缓存、查询 | `packages/finance/skills-econswarm/src/index.ts` | 已移植全部 184 个资产 |
| `swarmskills/` | 184 个金融 SKILL.md | `packages/finance/skills-econswarm/assets/swarmskills` | 以打包资产承载 |
| `swarmagents/dataflows/interface.py` | Vendor 路由与回退 | 待实现桥接 | 待实现 |
| `swarmagents/dataflows/a_stock.py` | A 股数据 Provider | 待实现桥接 | 待实现 |
| `swarmagents/dataflows/y_finance.py` | yfinance Provider | 待实现桥接 | 待实现 |
| `swarmagents/dataflows/alpha_vantage.py` | Alpha Vantage Provider | 待实现桥接 | 待实现 |
| `swarmagents/llm_clients/` | 多供应商 LLM 客户端 | DeepSeek Harness `ctx.llm` 适配器 | 由框架接缝替代 |
| `cli/main.py` | Typer+Rich CLI | `examples/econswarm-platform/start.sh` | 由 `dsh --profile headless` 替代 |
| `web/` | FastAPI+Vite+React UI | Harness Web profile | 由框架 Web 界面替代 |

## 移植原则

移植以数据、Provider 和 Consumer 保留原始模块边界，而不是导入 Python 运行时代码。 工作流引擎变成一次性子代理委托；技能注册表变成打包的 `ctx.skills` Provider；Agent 工厂注册表变成静态角色数据；LLM 客户端由框架适配器注册表替代。

原始 LangGraph 状态转换映射到 `pipeline.ts` 的阶段循环：分析师按请求顺序串行运行，第一层质量门控在进程内运行，多空辩论按 `maxDebateRounds` 交替，风险辩论按 `maxRiskDiscussRounds` 在激进/保守/中性之间交替。 `chainMode` 映射到分析师 -> 质量门控 -> Portfolio Manager 分支。
