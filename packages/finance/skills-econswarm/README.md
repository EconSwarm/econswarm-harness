# dsh-skill-econswarm

English | [中文](README.zh.md)


Packaged EconSwarm financial skill catalog provider. It registers one `bundled` provider on `ctx.skills` and publishes every SKILL.md carried under `assets/swarmskills`, preserving the original YAML name and description fields. The provider uses `BUNDLED_SKILL_RANK`, so project and user skills can override a ported catalog entry without editing the package.

The original EconSwarm skill tree contains 184 SKILL.md files across root and domain directories. Domain-nested entries keep their directory name when it is unique and receive a domain prefix when another catalog entry shares the name, keeping the model-facing catalog kebab-case and collision-free.

## Extension points

Mount this plugin beside `@deepseek-ai/dsh-skill` and `@deepseek-ai/dsh-tool-skill`. The consumer's normal `skill({ name })` tool then loads any ported financial skill by name.

## License note

The bundled skill assets originate from the Apache-2.0 EconSwarm project. They are redistributed under their original license; the upstream LICENSE is kept under `assets/LICENSE`.

## Model Experience

Indirectly, through `@deepseek-ai/dsh-tool-skill`, which renders catalog names and loaded skill bodies into model context.

#### KV Cache effect

Independent of provider requests. Adding or editing a skill asset changes the catalog digest and invalidates the consumer's visible catalog.

## Known Limitations and Deferred Work

- **Frontmatter subset** — the provider parses `name_en`/`name` and `description_en`/`description` only; other original metadata fields are not projected into `SkillCandidate.metadata`.
- **Asset sync** — the asset tree is a snapshot of the upstream repo.   Updates require re-running the documented sync step and re-recording the migration table.
