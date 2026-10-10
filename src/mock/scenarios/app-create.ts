import { devStore } from "../dev-store"
import { createDevApp } from "../fixtures/apps"
import type { Scenario, ScenarioContext } from "./types"
import { entityName, slugOf } from "./types"

/** 提示词里带「关联应用：xxx」时（输入框里选了关联应用），应用名直接用它 */
const linkedName = (prompt: string) => prompt.match(/关联应用[:：]\s*([^\n，。；]+)/)?.[1]?.trim()

/**
 * 剧本：开发一个应用。/app-build 是苍穹应用（按元数据生成表单、列表、实体、插件），
 * /standalone-build 是通用应用（独立的 Web 应用）。结束时给出应用产物卡片，并把应用写进「应用开发」页的数据。
 */
export const appCreateScenario = ({ prompt }: ScenarioContext): Scenario => {
  const cosmic = /^\/app-build\b/.test(prompt)
  const name = linkedName(prompt) ?? entityName(prompt.replace(/关联应用[:：][^\n]*/g, ""), "应用")
  const id = `app-${slugOf(name, "new")}`

  const finish = () => {
    const desc = prompt.replace(/^\/\S+\s*/, "").replace(/关联应用[:：][^\n]*/g, "").trim().slice(0, 80)
    const app = createDevApp(id, name, desc || `${name}：由对话生成的应用。`, cosmic ? "cosmic" : "general")
    devStore.apps = [app, ...devStore.apps.filter((x) => x.id !== id)]
    return { kind: cosmic ? "kdform" : "kdstandalone", config: { appId: id, title: name } }
  }

  if (cosmic)
    return {
      todos: ["需求设计", "元数据建模", "插件与接口开发", "测试与审查"],
      steps: [
        {
          todo: 0,
          reasoning: "先把目标拆成可验收的需求：单据要有哪些字段、走什么审批、和上下游单据怎么联动。苍穹应用优先用元数据表达，元数据做不到的再写插件。",
          tools: [{ tool: "skill", title: "app-build", output: "已加载苍穹应用开发规范" }],
        },
        {
          todo: 1,
          tools: [
            { tool: "write", title: `${id}/metadata/bill.json`, output: `{\n  "name": "${name}",\n  "entities": ["主表", "明细"],\n  "fields": 20\n}` },
            { tool: "write", title: `${id}/metadata/list.json`, output: `{\n  "columns": ["单据编号", "单据状态", "创建人", "创建时间"]\n}` },
          ],
        },
        {
          todo: 2,
          tools: [
            { tool: "write", title: `${id}/plugin/FormPlugin.java`, output: "public class FormPlugin extends AbstractBillPlugIn {\n  // 表单加载时初始化字段默认值\n}" },
            { tool: "write", title: `${id}/plugin/AuditPlugin.java`, output: "public class AuditPlugin extends AbstractOperationServicePlugIn {\n  // 审核时校验金额上限\n}" },
          ],
        },
        {
          todo: 3,
          tools: [{ tool: "bash", title: "运行验收用例", detail: "24 passed", output: "24 passed, 0 failed" }],
          text: `「${name}」已开发完成，建在苍穹的元数据上。\n\n## 交付内容\n\n- **表单与列表**：单头 + 明细两段式，列表支持按状态筛选和模糊搜索\n- **实体**：主表、明细表，字段标识与类型见右侧「实体」页签\n- **插件**：表单初始化、提交校验、审核校验\n- **接口**：查询、新增、提交、审核等标准接口，并注册为 MCP 工具\n\n点下面的卡片，可以在右侧查看表单、列表、实体、插件、API 和 MCP。\n\n> 这是原型工程的模拟回复，内容由剧本生成。`,
          card: finish,
        },
      ],
    }

  return {
    todos: ["需求设计", "系统设计", "开发实现", "测试与审查"],
    steps: [
      {
        todo: 0,
        reasoning: "通用应用是独立的 Web 应用。先确认用户角色和核心流程，再定数据表和页面，最后实现并验证。",
        tools: [{ tool: "skill", title: "standalone-build", output: "已加载通用应用开发规范" }],
      },
      { todo: 1, tools: [{ tool: "write", title: `${id}/docs/design.md`, output: `# ${name} 系统设计\n\n- 数据表：主表、明细、操作日志\n- 页面：列表、详情、新建` }] },
      {
        todo: 2,
        tools: [
          { tool: "write", title: `${id}/src/App.tsx`, output: "export default function App() {\n  return <Layout><Routes /></Layout>\n}" },
          { tool: "write", title: `${id}/server/routes.ts`, output: "router.get('/api/items', list)\nrouter.post('/api/items', create)" },
        ],
      },
      {
        todo: 3,
        tools: [{ tool: "bash", title: "npm run test", detail: "exit 0", output: "Test Files  6 passed (6)\n     Tests  31 passed (31)" }],
        text: `「${name}」已开发完成并启动，右侧可以直接打开系统。\n\n1. **需求设计**：核心流程与验收条件已确认\n2. **系统设计**：数据表、接口与页面结构\n3. **开发实现**：列表、详情、新建与流程处理\n4. **测试与审查**：31 条用例全部通过\n\n点下面的卡片，可以在右侧的浏览器里预览。\n\n> 这是原型工程的模拟回复，内容由剧本生成。`,
        card: finish,
      },
    ],
  }
}
