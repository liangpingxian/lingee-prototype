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
  pages/        session（新任务 + 会话）、dev（技能 / 智能体 / 业务组件）、settings
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
| `/dev/app` `/dev/expert` `/dev/cloudTenant` `/settings` | 占位，待建 |

## 会话里的产物卡片

模型回复末尾的 `:::render:kind {json}:::` 指令会渲染成一张产物卡片（`src/ui/render-card`，解析逻辑同步自线上）：

| 提示词开头 | 剧本 | 卡片 | 点卡片打开 |
| --- | --- | --- | --- |
| `/kingdee-skill-creator`（及其他） | `mock/scenarios/skill-create.ts` | 技能 `kdskill` | 技能预览抽屉 |
| `/ai-partner-creator` | `mock/scenarios/agent-create.ts` | 智能体 `ai-partner` | 智能体配置抽屉（可编辑） |
| `/mcp-apps-builder` | `mock/scenarios/mcp-app-create.ts` | 业务组件 `kdapp-artifact` | 组件详情抽屉 |

剧本走到最后一步时把产物写进 `mock/dev-store.ts`，所以对应的开发页里能看到新卡片。抽屉在 `features/side-panel/drawer`，内容与开发页的详情弹窗共用同一批组件（`features/skill-detail`、`features/agent-config`、`features/mcp-app-detail`）。

## 采购价格异常预警创建演示

启动后进入 `/p/scm-skills/session?demo=procurement`。该链接仅在原有新任务输入框预填需求，点击发送后，进入产品现有的技能创建会话。

- 完全复用 MessageTimeline、SessionTurn、ReasoningPart、ToolPart、TodoDock、QuestionDock、RenderCard 和 SkillDrawer，不使用独立演示页面或样式。
- 原有流式回放驱动技能加载、技能检索、业务对象发现、工具发现及校验、执行方案、集中提问和技能文件生成。创建过程不展示待办控件或订单分析报告；完成后显示简短说明与技能产物卡片。
- 规则通过原有提问区确认，可一键选择全部推荐项；阈值可自填。跳过时采用推荐配置，最终在生成摘要中明确展示实际规则。
- 点击本地测试后才展示采购订单价格分析。默认 90 天、15% 阈值时精密轴承异常、紧固件套装正常；改为 30% 时两项均正常。180 天历史样本可展示时间范围及数量加权的影响。
- 产物卡片打开原有技能预览抽屉；「本地测试」预填该技能，发送后按创建时的规则再次模拟。原有文件面板可查看技能说明、Python 脚本、执行方案和 10 条评测用例（已打开的文件树可点刷新）。
- 重新演示：点击产品原有「新任务」，再次输入需求。所有记录及产物仅保存在原项目 Mock 内存数据库中，刷新会清空。
- 核心剧本：`src/mock/scenarios/procurement-create.ts`；独立数据适配：`src/services/procurement.ts`；生成产物：`src/mock/procurement-artifacts.ts`。均不调用真实 ERP/DC/MCP。

## 与产品源码对齐的运行时组件

运行时样式来自当前「Build的源码」，通过 `npm run sync:runtime` 更新；原始组件代码保存在 `src/source-runtime/reference/`，CSS 和来源校验清单保存在同级目录。React 移植及组件对应关系见 [运行时移植说明](docs/runtime-source-port.md)。

执行 `npm run test:runtime` 可检查来源完整性、执行分组和采购规则联动，再用 `npm run build` 检查构建。

领导演示版本：界面及生成技能文件隐藏技术性 Mock 标签；底层继续使用独立本地 fixture，不调用真实 DC/ERP。采购业务样本及工具结构位于 `src/mock/fixtures/procurement-context.ts`。
