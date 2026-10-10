import equipmentBill from "./artifacts/equipment-repair-bill.html?raw"
import helpdeskApp from "./artifacts/helpdesk-app.html?raw"
import purchaseOrder from "./artifacts/purchase-order.html?raw"
import surveyApp from "./artifacts/survey-app.html?raw"
import { appCardSeeds, defaultCosmicMeta, equipmentCosmicMeta, linkedApps, type CosmicMeta } from "./app-dev-data"

/**
 * 应用开发页的一张应用卡片。
 * - cosmic：苍穹应用，预览面板带「表单 / 列表 / 实体 / 插件 / API / MCP」页签
 * - general：通用应用，预览面板是内置浏览器，直接打开系统地址
 */
export interface DevApp {
  id: string
  name: string
  desc: string
  kind: "cosmic" | "general"
  /** 预览地址栏里显示的地址 */
  url: string
  /** 预览区 iframe 里渲染的页面 */
  html: string
  /** 苍穹应用的元数据示例 */
  meta: CosmicMeta
  /** 打开应用时会话里展示的对话 */
  ask: string
  reply: string
}

const DEFAULT_URL = "https://feature.kingdee.com:1026/feature_vb"

const DEFAULT_REPLY = (name: string) => `已完成「${name}」的开发，以下是实现方案：

## 功能模块

**1. 单据创建**
- 支持选择供应商、采购员、币别、付款条件
- 明细行可添加物料编码、名称、规格、数量、单价
- 自动计算含税金额、折扣金额、总金额

**2. 审批流程**
- 草稿 → 提交 → 部门主管审核 → 财务复核 → 总经理审批（金额 > 10 万触发）
- 审批意见可追溯，支持驳回退回至草稿

**3. 变更与关闭**
- 已审核单据支持变更，记录变更前后差异
- 支持手工关闭和自动关闭

可以直接发布到测试环境验证，或需要我调整某些细节？`

/** 三个有完整演示内容的应用：问卷调研（通用）、设备巡检维修（苍穹）、工单管理（通用） */
const SPECIAL: Record<string, Partial<DevApp>> = {
  问卷调研系统: {
    kind: "general",
    url: "https://apps.lingee.com/survey",
    html: surveyApp,
    ask: "做一个问卷调研系统：支持问卷设计、企业微信和二维码发放、回收进度监控，回收后自动出分析报告。",
    reply: `问卷调研系统已开发完成并部署上线，右侧是正在运行的应用。

1. **需求设计**：17 条需求、验收条件和非目标，评审一次通过
2. **系统设计**：问卷、题目、答卷、发放批次 4 张主表；分析任务异步计算
3. **开发实现**：12 种题型、逻辑跳转、多渠道发放、自动分析报告
4. **测试与审查**：48 条用例全部通过，移动端矩阵题错位已修复
5. **部署上线**：已发布到生产环境，首个调研回收 1,286 份

访问地址：\`https://apps.lingee.com/survey\``,
  },
  设备巡检维修系统: {
    url: "https://apps.lingee.com/equipment",
    html: equipmentBill,
    meta: equipmentCosmicMeta,
    ask: "打开设备巡检维修系统，看一下上线后的运行情况。",
    reply: `设备巡检维修系统由项目「设备巡检维修系统建设」交付，建在金蝶 ERP 的元数据上，表单、列表、实体、插件页签都按元数据生成。

1. **设备台账与扫码巡检**：126 台设备已生成二维码
2. **故障报修与维修记录**：42 条用例全部通过，维修记录归入设备履历
3. **MCP 服务**：设备档案和维修记录通过 MCP 服务 \`equipment-ops\` 只读开放，供智能体技能调用

访问地址：\`https://apps.lingee.com/equipment\``,
  },
  工单管理系统: {
    kind: "general",
    url: "https://apps.lingee.com/helpdesk",
    html: helpdeskApp,
    ask: "打开工单管理系统，看一下上线后的运行情况。",
    reply: `工单管理系统由协作开发项目「客户服务工单平台」交付，右侧是正在运行的系统。

1. **提交工单**：按分类和优先级提交，附件支持截图和日志
2. **SLA 与派单**：按优先级自动给出响应和解决时限，工单自动派给处理人
3. **我的工单与常见问题**：跟踪处理进度、评价已解决工单，常见问题先自助排查

访问地址：\`https://apps.lingee.com/helpdesk\``,
  },
}

/** 新建一个应用（会话回放结束时也用它落库） */
export const createDevApp = (id: string, name: string, desc: string, kind: DevApp["kind"]): DevApp => ({
  id,
  name,
  desc,
  kind,
  url: kind === "general" ? `https://apps.lingee.com/${id}` : DEFAULT_URL,
  html: kind === "general" ? helpdeskApp : purchaseOrder,
  meta: defaultCosmicMeta,
  ask: `帮我开发${name}功能`,
  reply: DEFAULT_REPLY(name),
})

export const apps: DevApp[] = appCardSeeds.map((seed, index) => ({
  ...createDevApp(`app-${index + 1}`, seed.name, seed.desc, "cosmic"),
  ...SPECIAL[seed.name],
}))

/** 「关联应用」里的显示名：同名应用带上编码区分 */
export const appDisplayName = (item: (typeof linkedApps)[number]) =>
  linkedApps.filter((x) => x.app === item.app).length > 1 ? `${item.app} (${item.code})` : item.app
