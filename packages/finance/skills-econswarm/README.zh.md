# dsh-skill-econswarm

[English](README.md) | 中文

打包的 EconSwarm 金融技能目录 Provider。 它在 `ctx.skills` 上注册一个 `bundled` Provider，并发布 `assets/swarmskills` 下的每个 SKILL.md，保留原始 YAML 名称与描述字段。 Provider 使用 `BUNDLED_SKILL_RANK`，因此项目与用户技能可以在不编辑包的前提下覆盖移植目录项。

原始 EconSwarm 技能树包含跨根目录与领域目录的 184 个 SKILL.md。 领域嵌套项在名称唯一时保留目录名，在与其他目录项重名时添加领域前缀，从而保持模型可见目录为 kebab-case 且无冲突。

## 扩展点

在 `@deepseek-ai/dsh-skill` 与 `@deepseek-ai/dsh-tool-skill` 旁挂载此插件。 Consumer 的标准 `skill({ name })` 工具即可按名称加载任意移植金融技能。

## 许可证说明

打包技能资产来自 Apache-2.0 EconSwarm 项目。 它们按原始许可证重新分发；上游 LICENSE 保留在 `assets/LICENSE`。

## Model Experience

Indirectly, through `@deepseek-ai/dsh-tool-skill`, which renders catalog names and loaded skill bodies into model context.

#### KV Cache effect

Independent of provider requests. Adding or editing a skill asset changes the catalog digest and invalidates the consumer's visible catalog.

## Known Limitations and Deferred Work

- **Frontmatter 子集** - Provider 只解析 `name_en`/`name` 与 `description_en`/`description`；其他原始元数据字段不会投影到 `SkillCandidate.metadata`。
- **资产同步** - 资产树是上游仓库的快照。   更新需要重新执行文档化的同步步骤并重新记录迁移对照表。
