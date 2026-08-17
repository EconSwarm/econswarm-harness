# @deepseek-ai/dsh-client-ui-econswarm

English | [中文](README.zh.md)

The browser plugin that adds the EconSwarm finance navigation to the dsh Web sidebar and hosts three full-center library pages: research workflows, the 34-role agent plaza, and the 184-skill financial library. It occupies the additive `sidebar.nav` seat declared by ui-sidebar and the center-column `shell.center` seat declared by ui-layout, so the sidebar and session columns stay mounted beside or underneath the page and closing it returns without losing conversation state.

## Composition

One apply registers a single shared viewing store and two slot entries: `SidebarNav` fills `sidebar.nav` (wide rows or 36px rail icons), and `EconswarmPages` fills `shell.center` with id `econswarm-pages`. Opening a page from the sidebar flips the center overlay through the shared store; closing the page or starting a workflow session clears the store. Workflow run buttons call the injected shared `workspaces.startSession()` flow and leave the user in the composer.

## Model Experience

None, as this package renders a static browser catalog and adds no prompt, tool schema, request content, or model-visible result.

#### KV Cache effect

None.

## Known Limitations and Deferred Work

- The workflow, agent, and skill catalogs are browser-side presentation copy; the authoritative registries live in the finance host packages and are not streamed to this surface yet.
- Workflow run buttons start a blank session rather than preloading the selected workflow's prompt or skill set.
