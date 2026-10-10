# lingee-prototype

灵基 Build 的前端原型工程：React + mock 数据，用来做原型和后续功能的演进。视觉资产（样式、文案、图标、主题）从 lingee-build 同步，保证和线上一致；来源路径在 `sync.config.json` 里配置（也可用环境变量 `LINGEE_BUILD_DIR` 覆盖）。

## 启动

```bash
bun install
bun run dev        # http://127.0.0.1:5180
```

其他命令：

| 命令 | 作用 |
| --- | --- |
| `bun run typecheck` | 类型检查 |
| `bun run build` | 生产构建 |
| `bun run sync` | 从 lingee-build 重新同步样式 / 文案 / 图标 / 主题（线上视觉有变化时跑一次） |

## 目录

```
scripts/sync-from-lingee.ts   同步脚本
src/
  app/          路由、全局 Provider、主框架（侧边栏 + 内容区）
  ui/           React 版基础组件（对应 kcode-ui），一个组件一个目录
  i18n/         文案：dict/ 下是同步来的中英文字典，key 与线上一致
  theme/        明暗主题（复用线上的色板推导逻辑）
  stores/       Zustand：sync（服务端数据）、layout（界面状态）、prompt（输入框状态）
  services/     数据接口层，页面只调这里
  mock/         内存数据库、fixtures、流式回放引擎、剧本
  features/     跨页面复用的能力：sidebar、prompt-input、dev-page、dialogs
  pages/        session（新任务 + 会话）、dev（技能 / 智能体 / 应用 / 业务组件 / 协作开发）、settings
  vendor/       同步来的原始资产，不要手改
```

## 约定

- **不要改 `src/vendor/` 和 `*.gen.ts`**，它们会被 `bun run sync` 覆盖。
- 组件的 DOM 结构、`data-component` / `data-slot` 属性和类名照抄原工程，样式才能直接生效。
- 原工程用 Kobalte，这里用 Radix；`src/lib/kobalte-state.ts` 负责把 Radix 的 `data-state` 镜像成 Kobalte 的 `data-expanded` / `data-closed`。
- 页面不直接碰 mock：数据走 `services/`，以后接真实后端只换实现。
- 文案一律用 `useT()` + 线上的 key，新增文案要同时补中英文。

## 路由

| 路径 | 页面 |
| --- | --- |
| `/p/:projectId/session` | 新任务 |
| `/p/:projectId/session/:sessionId` | 会话 |
| `/dev/skill` `/dev/agent` `/dev/mcpapp` | 技能开发 / 智能体开发 / 业务组件 |
| `/dev/app` | 应用开发：应用卡片，点卡片进入开发会话并在右侧预览应用 |
| `/dev/expert` | 协作开发：任务（`?tab=` 省略）/ 专家（`?tab=experts`）/ 专家团（`?tab=teams`） |
| `/dev/cloudTenant` `/settings` | 占位，待建 |

## 会话里的产物卡片

模型回复末尾的 `:::render:kind {json}:::` 指令会渲染成一张产物卡片（`src/ui/render-card`，解析逻辑同步自线上）：

| 提示词开头 | 剧本 | 卡片 | 点卡片打开 |
| --- | --- | --- | --- |
| `/kingdee-skill-creator`（及其他） | `mock/scenarios/skill-create.ts` | 技能 `kdskill` | 技能预览抽屉 |
| `/ai-partner-creator` | `mock/scenarios/agent-create.ts` | 智能体 `ai-partner` | 智能体配置抽屉（可编辑） |
| `/mcp-apps-builder` | `mock/scenarios/mcp-app-create.ts` | 业务组件 `kdapp-artifact` | 组件详情抽屉 |
| `/app-build` `/standalone-build` | `mock/scenarios/app-create.ts` | 苍穹应用 `kdform` / 通用应用 `kdstandalone` | 应用预览抽屉 |

剧本走到最后一步时把产物写进 `mock/dev-store.ts`，所以对应的开发页里能看到新卡片。抽屉在 `features/side-panel/drawer`，内容与开发页的详情弹窗共用同一批组件（`features/skill-detail`、`features/agent-config`、`features/mcp-app-detail`）。

## 来自 lingee 原型的内容

应用开发和协作开发是照着 lingee 原型（原生 HTML + JS 的那个仓库）的源码重写的，演示数据也从它的源码里导出：

| 数据 | 文件 | 来源 |
| --- | --- | --- |
| 应用卡片、关联应用、列表 / 实体 / 插件 / API / MCP 示例 | `mock/fixtures/app-dev-data.ts` | `views/apps.html`、`views/chat.html`、`features/apps.js`、`attach-app.js`、`composer.js` |
| 应用预览里的页面 | `mock/fixtures/artifacts/*.html` | `src/artifacts/`（两张苍穹单据已注入设计令牌） |
| 专家、专家团及开发流程 | `mock/fixtures/experts.ts`、`public/expert-avatars/` | `features/expert/data.js` |
| 协作开发任务 | `mock/fixtures/collab-tasks.ts` | `features/tasks-v2/data.js` |

这几份是一次性导出的，lingee 那边再改动时需要重新导出。

历史会话不是导出的，而是启动时由 `mock/collab-seed.ts` 按 lingee 的规则生成：任务会话按任务所在项目归组（每个项目在侧边栏是一个分组），另有「工作 · 历史对话」「管理 · 历史提问」两个项目；开发板块 Workspace 下的三条放进了 `workspace`。

## 协作开发任务的执行

任务详情点「开始执行」会新建一个绑定任务的会话（`Session.taskId`），回放走 `mock/scenarios/task-stage.ts`：做完当前阶段后把任务推到「待审核」。会话输入框上方的阶段确认条（`features/task-run/TaskStageBar.tsx`）给出「通过 / 退回修改 / 开始下一阶段 / 重试」，状态流转都在 `services/task.ts`。
