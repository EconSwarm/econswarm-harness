# @deepseek-ai/dsh-client-ui-econswarm

[English](README.md) | 中文

这个浏览器插件在 dsh Web 左侧边栏新增 EconSwarm 金融导航，并提供三个右侧主区库页面：研究工作流、34 角色智能体广场和 184 技能金融技能库。它占用 ui-sidebar 声明的增量 `sidebar.nav` seat 与 ui-layout 声明的中栏 `shell.center` seat，因此侧边栏与会话列保持可见或挂载在底层，关闭页面即可回到原会话且不丢失状态。

## 装配

一次 apply 注册一个共享的浏览 store 与两个 slot entry：`SidebarNav` 填充 `sidebar.nav`（宽列显示标签，折叠 rail 显示 36px 图标），`EconswarmPages` 以 `econswarm-pages` id 填充 `shell.center`。从侧边栏打开页面通过共享 store 切换右侧主区；关闭页面或启动工作流会话会清空 store。工作流“发起对话”调用注入的共享 `workspaces.startSession()` 流程，用户回到输入框即可继续。

## 模型体验

无，因为本包渲染静态浏览器目录，不增加 prompt、工具 schema、请求内容或模型可见结果。

#### KV Cache effect

无。

## 已知限制与暂缓事项

- 工作流、智能体与技能目录目前是浏览器端展示副本；权威注册表位于 finance host 包中，尚未流式同步到本界面。
- 工作流“发起对话”只启动空白会话，不会预填所选工作流的提示词或技能集。
