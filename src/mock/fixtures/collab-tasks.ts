// 协作开发任务的演示数据，由 lingee 原型的 features/tasks-v2/data.js 导出
export const TASK_STATUSES = [
  {
    "id": "planned",
    "name": "待规划",
    "color": "gray"
  },
  {
    "id": "backlog",
    "name": "待开始",
    "color": "gray"
  },
  {
    "id": "in_progress",
    "name": "执行中",
    "color": "orange"
  },
  {
    "id": "in_review",
    "name": "待审核",
    "color": "green"
  },
  {
    "id": "blocked",
    "name": "已阻塞",
    "color": "red"
  },
  {
    "id": "done",
    "name": "已完成",
    "color": "blue"
  },
  {
    "id": "cancelled",
    "name": "已取消",
    "color": "gray"
  }
] as const

export const TASK_PRIORITIES = [
  {
    "id": "urgent",
    "name": "紧急",
    "color": "red"
  },
  {
    "id": "high",
    "name": "高",
    "color": "orange"
  },
  {
    "id": "medium",
    "name": "中",
    "color": "blue"
  },
  {
    "id": "low",
    "name": "低",
    "color": "gray"
  }
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]["id"]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]["id"]

export interface TaskStage {
  id: string
  title: string
  desc: string
  assignee: string
  /** pending 未开始 / running 执行中 / review 待审核 / done 已完成 */
  status: string
}

export interface CollabTask {
  id: string
  code: string
  title: string
  desc: string
  status: TaskStatus
  priority: TaskPriority
  /** 处理人 / 创建人姓名 */
  assignee: string
  createdBy: string
  /** 所属项目名称 */
  project: string
  /** 任务类型：需求 / 缺陷 */
  issueType: string
  createDate: string
  dueDate: string
  /** 当前执行到执行计划里的哪个阶段 */
  stageId: string | null
  /** 执行计划：按专家团的开发流程拆成的阶段 */
  plan: TaskStage[]
  /** 各阶段提交的产物；阶段提交审核时生成，审核通过后标为已通过 */
  artifacts?: TaskArtifact[]
  /** 这个任务发起过的会话，新的在前 */
  sessions?: TaskSessionRef[]
  /** 已阻塞任务上一次执行失败的记录 */
  blockedRun?: BlockedRun
}

export interface BlockedRun {
  failedAt: string
  duration: string
  reason: string
  /** 建议的下一步 */
  next: string
  /** 失败前走过的步骤：[步骤名, 结果] */
  steps: Array<[string, string]>
}

export interface TaskArtifact {
  stageId: string
  title: string
  summary: string
  /** 产出文档正文（Markdown） */
  content: string
  status: "待审核" | "已通过"
  date: string
}

export interface TaskSessionRef {
  sessionId: string
  /** 会话来源：开始执行 / 退回修改 / 重试执行 / 发起会话 */
  origin: "start" | "revise" | "retry" | "manual"
  stageId: string | null
  title: string
  startedAt: string
}

export const tasks: CollabTask[] = [
 {
  "id": "1",
  "code": "T1000001",
  "title": "采购订单列表页开发",
  "desc": "完成采购订单列表页的前端开发，包含多条件筛选（供应商、日期范围、订单状态）、分页加载、批量导出 Excel。列表需支持列排序、列宽拖拽调整、固定表头。筛选区域可折叠保存，表格行右键支持快捷操作菜单（查看详情、复制订单、打印）。接口对接后端分页查询 API，需处理 loading 态和空数据态。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "张工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-25",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "2",
  "code": "T1000002",
  "title": "供应商评级模型设计",
  "desc": "设计供应商多维度评级算法，覆盖交货准时率（30%）、质量合格率（25%）、价格竞争力（20%）、服务响应速度（15%）、合作年限（10%）五个维度。支持权重动态配置与评级周期自定义（月度/季度/年度）。评级结果分 A/B/C/D 四档，自动生成评级报告并推送至采购负责人。需输出算法设计文档、数据库表结构设计、评级计算存储过程。",
  "status": "in_review",
  "priority": "urgent",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-18",
  "dueDate": "2026-09-24",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "3",
  "code": "T1000003",
  "title": "入库单审批流程配置",
  "desc": "配置入库单的多级审批流程：仓管员提交→库管主管初审（金额<1万）→采购经理复审（1万-10万）→财务总监终审（>10万）。支持金额阈值自动路由、审批人代理设置（请假/出差）、审批超时自动催办（24小时未处理）。审批节点支持自定义表单字段（审批意见、附件、签字）。需与工作流引擎对接，审批记录可追溯。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-09-28",
  "stageId": null,
  "plan": []
 },
 {
  "id": "4",
  "code": "T1000004",
  "title": "财务报表数据源对接",
  "desc": "对接 ERP 总账数据源，实现资产负债表、利润表、现金流量表的实时数据同步。需处理多账套合并取数、币种折算、期初期末结转等场景。接口采用定时增量拉取+手动全量刷新双模式，数据落库前做完整性校验（借贷平衡、科目编码规范）。阻塞原因：ERP 测试环境账套数据不完整，需协调运维补数。",
  "status": "blocked",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-19",
  "dueDate": "2026-09-26",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "5",
  "code": "T1000005",
  "title": "采购订单详情页交互",
  "desc": "完成采购订单详情页全部交互逻辑：订单基本信息展示、明细行增删改、金额自动计算（含税/不含税切换）、状态流转时间轴、附件预览（PDF/图片在线预览）、操作日志。支持订单复制创建、变更对比（标红变更字段）、打印预览。底部评论区域支持 @ 提及人员并推送通知。",
  "status": "in_progress",
  "priority": "medium",
  "assignee": "张工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-27",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "6",
  "code": "T1000006",
  "title": "供应商黑白名单管理",
  "desc": "开发供应商黑白名单管理功能：支持单条录入与 Excel 批量导入（含模板下载、数据校验、导入预览）。黑名单供应商自动拦截采购下单并弹窗提示原因；白名单供应商享受绿色通道（免审批、优先付款）。名单变更需审批，变更记录可追溯。已通过测试验收并上线运行。",
  "status": "done",
  "priority": "low",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-10",
  "dueDate": "2026-09-15",
  "stageId": null,
  "plan": []
 },
 {
  "id": "7",
  "code": "T1000007",
  "title": "入库质检标准配置",
  "desc": "按品类配置入库质检标准和抽检比例：原材料类全检（外观+尺寸+批次），标准件类按 AQL 2.5 抽检，辅料类免检。质检项目包含外观、尺寸、重量、性能指标，不合格项支持退货/让步接收/返工处理。质检结果自动关联入库单状态，不合格自动冻结入库流程并通知采购。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-09-30",
  "stageId": null,
  "plan": []
 },
 {
  "id": "8",
  "code": "T1000008",
  "title": "报表导出性能优化",
  "desc": "优化大数据量报表导出性能，当前 10 万行导出耗时 28 秒，目标降至 3 秒内。优化方案：1. 查询层加索引+分页游标读取；2. 内存层用流式写入替代全量缓存；3. 输出层异步生成文件+进度条反馈；4. 引入 Redis 缓存高频报表模板。已完成查询优化和流式写入，正在对接前端进度条组件。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-29",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "9",
  "code": "T1000009",
  "title": "采购订单打印模板",
  "desc": "设计并开发采购订单打印模板，支持自定义字段配置（公司信息、签章位置、明细列显示/隐藏）。模板支持 A4/热敏两种纸张规格，打印时自动分页并带页眉页脚（页码、打印时间、制单人）。支持批量打印（按日期范围筛选）。已完成模板设计稿评审，正在开发模板渲染引擎。",
  "status": "in_review",
  "priority": "low",
  "assignee": "周杰",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-19",
  "dueDate": "2026-09-25",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "10",
  "code": "T1000010",
  "title": "供应商准入审核流程",
  "desc": "配置供应商准入资质审核全流程：基础信息录入→营业执照OCR校验→资质文件上传（营业执照、税务登记、开户许可、质量体系认证）→风控核查（司法风险、信用黑名单）→采购初审→风控复审→管理层审批。资质文件支持 OCR 自动识别关键字段并填充，风控数据对接第三方征信接口。审核通过自动创建供应商档案。",
  "status": "backlog",
  "priority": "urgent",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-23",
  "dueDate": "2026-09-24",
  "stageId": null,
  "plan": []
 },
 {
  "id": "11",
  "code": "T1000011",
  "title": "入库异常预警机制",
  "desc": "开发入库异常自动预警系统，监控维度：库存超上限/低于安全库存、保质期临期（剩余<30天黄色/15天橙色/7天红色）、批次号重复、规格与采购订单不符。预警通过站内消息+邮件双通道推送至仓管员和采购员。看板页面实时滚动展示异常清单，支持标记已处理/忽略。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-28",
  "stageId": "requirements",
  "plan": []
 },
 {
  "id": "12",
  "code": "T1000012",
  "title": "财务月报自动生成",
  "desc": "配置月度财务报表自动生成定时任务：每月 1 日凌晨 2:00 自动拉取上月凭证数据，生成资产负债表、利润表、费用明细表、应收应付账龄分析表。报表导出 PDF 并推送至财务群邮件组，同时在系统中创建月报归档记录。支持手动触发补生成和自定义报表期间。",
  "status": "done",
  "priority": "medium",
  "assignee": "陈晨",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-08",
  "dueDate": "2026-09-14",
  "stageId": null,
  "plan": []
 },
 {
  "id": "13",
  "code": "T1000013",
  "title": "采购价格比对看板",
  "desc": "开发采购价格历史比对看板，展示同一物料近 12 个月采购价格趋势曲线，标注最高/最低/均价。支持多供应商横向比价（柱状图+表格双视图）。价格异常波动（偏离均价±15%）自动标红并推送预警。看板支持按物料分类、供应商、采购员筛选。已完成前端组件开发，正在对接数据接口。",
  "status": "in_review",
  "priority": "medium",
  "assignee": "张工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-26",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "14",
  "code": "T1000014",
  "title": "供应商合同到期提醒",
  "desc": "配置供应商合同到期自动提醒机制：到期前 90/60/30/15/7 天分五级递进提醒，提醒方式从站内消息逐步升级至邮件+短信。提醒对象为合同签约人和对应采购员。支持合同续签在线发起（带原合同信息预填），续签审批通过后自动延长合同到期日并重置提醒周期。",
  "status": "backlog",
  "priority": "low",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-22",
  "dueDate": "2026-10-05",
  "stageId": null,
  "plan": []
 },
 {
  "id": "15",
  "code": "T1000015",
  "title": "入库单批量打印",
  "desc": "开发入库单批量打印功能：支持按日期范围、仓库、单据状态筛选入库单，勾选后一键批量打印。打印队列支持排序（按日期/单号/仓库），打印进度实时显示（已打印/总计）。支持打印份数设置和补打标记（避免重复打印浪费纸张）。已完成后端接口和筛选交互，正在开发打印队列渲染逻辑。",
  "status": "in_progress",
  "priority": "low",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-30",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "16",
  "code": "T1000016",
  "title": "报表权限分级管控",
  "desc": "配置报表查看权限分级管控体系：按角色（高管/部门主管/业务员）和部门维度控制报表可见范围。高管查看全公司汇总报表，部门主管仅看本部门明细，业务员仅看本人数据。支持行列级权限（隐藏敏感列如成本价、利润率）。权限变更需审批并记录日志。阻塞原因：权限矩阵需与集团统一身份认证中心联调，对方接口排期到下周。",
  "status": "blocked",
  "priority": "urgent",
  "assignee": "赵琳",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-18",
  "dueDate": "2026-09-23",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "17",
  "code": "T1000017",
  "title": "采购退货流程开发",
  "desc": "开发采购退货全流程：发起退货申请（选退货原因、填写退货数量、上传照片凭证）→退货审批（采购主管+质量主管双签）→生成退货出库单→库存回退（扣减入库数量、恢复可用库存）→财务退款处理（冲销应付账款）。退货原因分类：质量问题、规格不符、多发货、过期退货。支持退货明细行级部分退货。",
  "status": "backlog",
  "priority": "high",
  "assignee": "张工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-23",
  "dueDate": "2026-10-02",
  "stageId": null,
  "plan": []
 },
 {
  "id": "18",
  "code": "T1000018",
  "title": "供应商评分明细报表",
  "desc": "开发供应商评分明细报表，展示每个供应商各维度评分明细及加权总分。支持多维度钻取：点击交货准时率可下钻到每笔订单的交货记录，点击质量合格率可下钻到每批次质检报告。报表支持导出 Excel 并附评分趋势图（近 6 期评分变化折线）。已完成后端查询逻辑，正在开发前端钻取交互。",
  "status": "in_review",
  "priority": "medium",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-27",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "19",
  "code": "T1000019",
  "title": "入库扫码功能开发",
  "desc": "开发 PDA 扫码入库功能：扫描采购订单条码自动带出待入库明细，扫描物料条码匹配明细行并填入实收数量。支持连续扫描模式（不跳转页面逐条扫描）。异常处理：扫码与订单不符时弹窗提示并阻止入库、实收大于应收时拦截。扫码完成后一键提交入库单并打印入库标签。已完成 PDA 端页面框架，正在对接扫码 SDK。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-09-29",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "20",
  "code": "T1000020",
  "title": "财务凭证自动生成",
  "desc": "配置采购入库自动生成财务凭证规则：入库单审核通过后自动生成借记\"原材料\"、贷记\"应付账款\"凭证；退货入库生成红字冲销凭证。凭证模板支持科目映射配置（按物料类别映射不同存货科目）、摘要模板自定义、辅助核算项自动填充。月结时批量校验凭证借贷平衡，异常凭证自动标记并通知会计处理。",
  "status": "done",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-06",
  "dueDate": "2026-09-12",
  "stageId": null,
  "plan": []
 },
 {
  "id": "21",
  "code": "T1000021",
  "title": "采购订单批量审批",
  "desc": "开发采购订单批量审批功能：列表页支持勾选多张订单后点击\"批量审批\"，弹窗显示选中订单汇总信息（总金额、供应商数、明细行数）供确认。支持快捷键操作（Ctrl+A 全选、Enter 确认、Esc 取消）。批量审批限制：不同供应商订单不能混合审批、超过单笔审批限额的订单自动排除。审批结果汇总展示成功/失败条数。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "李工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-23",
  "dueDate": "2026-10-03",
  "stageId": null,
  "plan": []
 },
 {
  "id": "22",
  "code": "T1000022",
  "title": "供应商资质文件管理",
  "desc": "开发供应商资质文件管理模块：支持营业执照、税务登记证、组织机构代码证、开户许可证、质量体系认证等文件的上传（PDF/图片，单文件<10MB）。OCR 自动识别证照关键字段（编号、有效期、经营范围）并入库。到期前 60 天自动提醒更新，过期文件标红冻结。支持文件版本管理，历史版本可追溯。",
  "status": "in_review",
  "priority": "low",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-19",
  "dueDate": "2026-09-28",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "23",
  "code": "T1000023",
  "title": "入库库存预警看板",
  "desc": "开发入库库存预警实时看板，适配仓库大屏展示（1920x1080 横屏）。看板分四个区域：今日入库概览（总单数/总数量/异常数）、库存水位监控（红黄绿三色预警图）、实时入库流水（滚动展示最新 20 条）、异常待处理清单。数据每 30 秒自动刷新，支持手动暂停刷新。已完成大屏 UI 框架，正在对接 WebSocket 实时推送。",
  "status": "in_progress",
  "priority": "urgent",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-24",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "24",
  "code": "T1000024",
  "title": "报表数据校验规则",
  "desc": "配置报表数据完整性校验规则库：借贷平衡校验（差额=0）、科目编码规范校验（长度/层级/编码段）、必填项校验（摘要/日期/金额非空）、逻辑校验（资产=负债+权益）。校验不通过时自动生成异常清单并标记异常类型和行号，支持一键定位到原始凭证。校验规则支持自定义扩展，规则变更需审批。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "陈晨",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-22",
  "dueDate": "2026-10-01",
  "stageId": null,
  "plan": []
 },
 {
  "id": "25",
  "code": "T1000025",
  "title": "采购合同电子签署",
  "desc": "对接第三方电子签署平台（e签宝），完成采购合同在线签署全流程：上传合同 PDF→设置签署方（乙方信息自动填充）→拖拽设置签署位置→发起签署→对方短信通知→签署完成回调。签署完成的合同自动归档并带数字签名水印。支持签署状态实时查询和签署日志导出。阻塞原因：e签宝测试环境密钥申请流程卡在法务审批。",
  "status": "blocked",
  "priority": "high",
  "assignee": "张工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-17",
  "dueDate": "2026-09-25",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "26",
  "code": "T1000026",
  "title": "供应商评级接口联调",
  "desc": "供应商评级计算接口与前端联调测试：后端提供评级查询（按供应商/期间/维度）、评级明细钻取、评级趋势图数据三个接口。联调发现问题：钻取接口分页参数传递异常（已修复）、趋势图日期范围边界值返回空（已修复）、评级总分小数精度不一致（待修复）。需补充接口文档并更新 Mock 数据。",
  "status": "in_review",
  "priority": "high",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-26",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "27",
  "code": "T1000027",
  "title": "入库上架指引开发",
  "desc": "开发入库上架指引页面：扫描物料条码后系统自动推荐上架库位，推荐算法基于就近原则（优先同品属相邻库位）+分散存储策略（同批次拆分到不同货架降低风险）。指引页面显示推荐库位平面图（高亮目标货架）、搬运路径规划。支持人工修改库位，修改时校验该库位容量和承重限制。",
  "status": "in_progress",
  "priority": "low",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-10-04",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "28",
  "code": "T1000028",
  "title": "财务对账自动化",
  "desc": "开发采购与财务自动对账功能：按采购订单维度自动匹配采购入库记录与财务付款记录，匹配规则：订单号+金额完全一致自动匹配、金额差异<100元标记为\"小额差异\"待人工确认、差异>100元标记为\"异常\"。对账结果生成差异明细表，支持导出 Excel 和批量处理（确认/退回/挂账）。已上线运行，月均处理对账记录 3000+条。",
  "status": "done",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-04",
  "dueDate": "2026-09-10",
  "stageId": null,
  "plan": []
 },
 {
  "id": "29",
  "code": "T1000029",
  "title": "采购询价比价功能",
  "desc": "开发采购询价比价模块：发起询价时自动拉取同物料历史采购价作为基准价参考，支持同时向多家供应商发起询价（邮件/站内消息）。供应商报价回收后自动生成比价矩阵表（含报价、交期、最小起订量、付款条件），按综合成本最低推荐中标供应商。支持询价单转采购订单一键创建。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "李工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-23",
  "dueDate": "2026-10-06",
  "stageId": null,
  "plan": []
 },
 {
  "id": "30",
  "code": "T1000030",
  "title": "供应商绩效月报",
  "desc": "配置供应商绩效月报自动生成和推送：每月 3 日自动生成上月供应商绩效报告，内容包括交货准时率排行、质量异常 TOP10、价格波动分析、合作金额统计。报告以 PDF 附件形式邮件推送至采购总监和各品类采购经理，同时在系统中归档可在线查阅。支持订阅特定供应商的绩效月报。",
  "status": "in_review",
  "priority": "low",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "供应链协同平台",
  "issueType": "缺陷",
  "createDate": "2026-09-19",
  "dueDate": "2026-09-29",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "31",
  "code": "T1000031",
  "title": "入库盘点任务管理",
  "desc": "开发入库盘点任务全流程管理：创建盘点计划（选择仓库/品类/盘点日期）→系统生成盘点清单（自动带出账面库存）→分配盘点人→PDA 扫码盘点录入实盘数量→系统自动计算盘盈盘亏→生成盘点差异报告→差异审批处理（盘亏需追究责任）→调整库存账面。支持盲盘（不显示账面数量）和明盘两种模式。",
  "status": "in_progress",
  "priority": "medium",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-30",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "32",
  "code": "T1000032",
  "title": "报表订阅推送配置",
  "desc": "配置报表定时订阅推送功能：用户可订阅任意报表并设置推送规则（每日/每周/每月、推送时间、收件人、格式 PDF/Excel）。推送渠道支持邮件附件、站内消息链接、企业微信卡片三种。订阅管理页面展示所有订阅列表，支持暂停/恢复/删除。已实现订阅创建和邮件推送通道，企业微信通道待对接。",
  "status": "backlog",
  "priority": "low",
  "assignee": "赵琳",
  "createdBy": "吴宏超",
  "project": "费用报销应用",
  "issueType": "缺陷",
  "createDate": "2026-09-22",
  "dueDate": "2026-10-08",
  "stageId": null,
  "plan": []
 },
 {
  "id": "33",
  "code": "T1000033",
  "title": "生产工单排程引擎开发",
  "desc": "开发生产工单排程引擎，基于工序工时、设备产能和交期约束自动生成最优排产计划。支持手动拖拽调整排程甘特图，调整后自动重算后续工序时间。排程冲突（设备占用、人员重叠）时高亮提示并给出替代方案。已完成排程算法核心逻辑，正在开发甘特图交互组件。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "张工",
  "createdBy": "吴宏超",
  "project": "生产制造执行系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-28",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "34",
  "code": "T1000034",
  "title": "工序流转状态机设计",
  "desc": "设计工序流转状态机：待开工→开工→首检→工序加工→完工检验→流转下一工序。支持并行工序和可选工序分支。状态变更自动记录操作人、时间和设备编号。异常状态（返工、报废、让步接收）走独立流转分支，需质量主管审批后才能继续。已完成状态机UML设计文档，待架构评审。",
  "status": "in_review",
  "priority": "medium",
  "assignee": "王工",
  "createdBy": "张工",
  "project": "生产制造执行系统",
  "issueType": "缺陷",
  "createDate": "2026-09-19",
  "dueDate": "2026-09-26",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "35",
  "code": "T1000035",
  "title": "产能利用率看板开发",
  "desc": "开发车间产能利用率实时看板：按产线/设备/班组维度展示当日产能、实际产出、利用率（绿>85%正常/黄70-85%关注/红<70%预警）。看板支持班次切换查看历史对比，自动生成产能趋势曲线（近30天）。低于阈值时推送告警给车间主任。已完成后端聚合查询，正在对接前端图表。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "赵琳",
  "createdBy": "李工",
  "project": "生产制造执行系统",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-10-02",
  "stageId": null,
  "plan": []
 },
 {
  "id": "36",
  "code": "T1000036",
  "title": "生产报工扫码功能",
  "desc": "开发车间PDA扫码报工功能：扫描工单条码自动带出工序列表，选择当前工序后扫描设备码确认开工。完工时扫描物料批次号关联产出批次，输入完工数量和不合格数量。支持离线报工缓存，联网后自动同步。已完成PDA端页面开发，正在对接扫码SDK和离线缓存方案。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "周杰",
  "createdBy": "王工",
  "project": "生产制造执行系统",
  "issueType": "缺陷",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-30",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "37",
  "code": "T1000037",
  "title": "质量追溯数据链路",
  "desc": "搭建产品质量全链路追溯：从原材料批次（供应商/入库/检验）→生产工序（设备/人员/参数）→完工检验→成品入库→发货记录，全链路数据关联并可正反向追溯。输入成品序列号即可查看完整生产履历。追溯数据支持导出PDF质量证明书。已上线试运行，覆盖3条核心产线。",
  "status": "done",
  "priority": "low",
  "assignee": "吴宏超",
  "createdBy": "赵琳",
  "project": "生产制造执行系统",
  "issueType": "需求",
  "createDate": "2026-09-08",
  "dueDate": "2026-09-15",
  "stageId": null,
  "plan": []
 },
 {
  "id": "38",
  "code": "T1000038",
  "title": "工单自动派单算法",
  "desc": "开发工单自动派单算法：按技能标签匹配工程师（Java/前端/运维），叠加当前负载权重（处理中工单数）和SLA优先级（紧急工单插队）。支持手动指派覆盖自动分配结果，手动指派记录操作日志。派单后自动推送企微通知，30分钟未响应自动转派。算法方案已评审，正在编码实现。",
  "status": "in_review",
  "priority": "urgent",
  "assignee": "张工",
  "createdBy": "吴宏超",
  "project": "客户服务工单平台",
  "issueType": "缺陷",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-25",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "39",
  "code": "T1000039",
  "title": "多渠道工单接入层",
  "desc": "开发多渠道工单接入层：统一接入企业微信、邮件、电话录音转写、官网表单四个渠道的工单。各渠道消息格式归一化为标准工单结构（标题/描述/紧急程度/联系人/来源渠道）。邮件渠道支持附件提取并关联到工单。已完成企微和邮件渠道对接，电话和官网渠道待开发。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "张工",
  "createdBy": "张工",
  "project": "客户服务工单平台",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-29",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "40",
  "code": "T1000040",
  "title": "SLA倒计时监控",
  "desc": "开发工单SLA倒计时监控：按工单优先级配置响应时效（紧急30分/高2时/中4时/低8时）和解决时效（紧急4时/高8时/中24时/低48时）。超时前15分钟黄色预警，超时后红色告警并自动升级优先级。看板展示所有倒计时工单，按剩余时间排序。阻塞原因：SLA规则引擎依赖的定时调度服务集群扩容审批中。",
  "status": "blocked",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "赵琳",
  "project": "客户服务工单平台",
  "issueType": "缺陷",
  "createDate": "2026-09-18",
  "dueDate": "2026-09-26",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "41",
  "code": "T1000041",
  "title": "客户满意度评价页",
  "desc": "开发工单关闭后的客户满意度评价页面：1-5星评分+标签快选（响应快/专业/耐心/已解决）+可选文字评价。评价链接随工单关闭通知短信/邮件发送。低于3星的工单自动标记并推送至客服主管，触发回访流程。已完成评价页UI和提交接口，正在对接通知推送。",
  "status": "backlog",
  "priority": "low",
  "assignee": "赵琳",
  "createdBy": "陈晨",
  "project": "客户服务工单平台",
  "issueType": "需求",
  "createDate": "2026-09-23",
  "dueDate": "2026-10-05",
  "stageId": null,
  "plan": []
 },
 {
  "id": "42",
  "code": "T1000042",
  "title": "工单批量导出功能",
  "desc": "开发工单批量导出功能：支持按时间范围、渠道、状态、处理人筛选后一键导出 Excel。导出字段可配置（默认含工单号/标题/状态/优先级/处理人/创建时间/关闭时间/满意度），导出数据量上限 5 万条。已上线使用，日均导出 30+ 次。",
  "status": "done",
  "priority": "medium",
  "assignee": "陈晨",
  "createdBy": "周杰",
  "project": "客户服务工单平台",
  "issueType": "缺陷",
  "createDate": "2026-09-06",
  "dueDate": "2026-09-12",
  "stageId": null,
  "plan": []
 },
 {
  "id": "43",
  "code": "T1000043",
  "title": "人效指标体系搭建",
  "desc": "搭建人力效能指标体系：人均产值（总产值/在职人数）、人均利润、单位人工成本产出、加班占比、核心岗位流失率。指标按部门/团队/个人三级下钻，支持同比环比对比。指标定义文档已通过HR部门评审，正在开发指标计算逻辑和落库方案。",
  "status": "in_review",
  "priority": "high",
  "assignee": "赵琳",
  "createdBy": "王工",
  "project": "人力数据分析平台",
  "issueType": "需求",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-27",
  "stageId": "design",
  "plan": []
 },
 {
  "id": "44",
  "code": "T1000044",
  "title": "组织画像可视化看板",
  "desc": "开发组织画像可视化看板：部门人数分布树状图、学历分布饼图、年龄结构柱状图、司龄分布、职级分布。支持按部门筛选和层级下钻。看板顶部展示组织健康度综合评分（结构合理性+人才密度+流动率）。已完成前端框架和数据接口对接，正在开发下钻交互。",
  "status": "in_progress",
  "priority": "medium",
  "assignee": "王工",
  "createdBy": "赵琳",
  "project": "人力数据分析平台",
  "issueType": "缺陷",
  "createDate": "2026-09-22",
  "dueDate": "2026-09-30",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "45",
  "code": "T1000045",
  "title": "离职风险预测模型",
  "desc": "开发员工离职风险预测模型：特征工程包含司龄、调薪间隔、加班时长趋势、请假天数变化、绩效评分变化、直属主管离职率等12个维度。采用梯度提升树算法，输出离职概率分档（高>70%/中30-70%/低<30%）。高险人员自动推送给HRBP，附风险因子贡献度。模型方案设计中。",
  "status": "backlog",
  "priority": "urgent",
  "assignee": "王工",
  "createdBy": "陈晨",
  "project": "人力数据分析平台",
  "issueType": "需求",
  "createDate": "2026-09-23",
  "dueDate": "2026-09-25",
  "stageId": null,
  "plan": []
 },
 {
  "id": "46",
  "code": "T1000046",
  "title": "人力数据ETL管道",
  "desc": "搭建人力数据ETL管道：从HR系统（花名册/考勤/薪酬/绩效）定时抽取数据，经清洗转换后落入分析数仓。增量抽取频率每日凌晨2点，全量补数据支持手动触发。字段映射规则可配置，异常数据（空值/越界/编码不匹配）进入待确认队列。阻塞原因：HR系统开放API排期到下月。",
  "status": "blocked",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "人力数据分析平台",
  "issueType": "缺陷",
  "createDate": "2026-09-18",
  "dueDate": "2026-09-28",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "47",
  "code": "T1000047",
  "title": "考勤数据自动汇总",
  "desc": "配置考勤数据自动汇总定时任务：每日凌晨从考勤机系统拉取打卡记录，按排班规则自动计算迟到/早退/缺卡/加班时长，生成日考勤汇总。异常打卡（缺班/连续迟到3天）自动推送部门主管。月度汇总次月3日生成，支持导出 Excel 考勤月报。已上线运行。",
  "status": "done",
  "priority": "low",
  "assignee": "陈晨",
  "createdBy": "王工",
  "project": "人力数据分析平台",
  "issueType": "需求",
  "createDate": "2026-09-04",
  "dueDate": "2026-09-10",
  "stageId": null,
  "plan": []
 },
 {
  "id": "48",
  "code": "T1000048",
  "title": "库位动态优化算法",
  "desc": "开发库位动态优化算法：基于ABC分类（高频出入库A类就近/低频C类远端）+批次亲和性（同物料集中存放）+承重均衡三大策略，自动推荐货物上架库位。每周生成库位调整建议清单，支持一键执行调整（系统自动打印搬移标签）。算法模型已通过模拟验证，正在对接WMS库位数据。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "智能仓储管理平台",
  "issueType": "缺陷",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-28",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "49",
  "code": "T1000049",
  "title": "扫码出入库PDA开发",
  "desc": "开发仓储PDA扫码出入库功能：入库时扫描采购订单→扫描物料条码→输入实收数量→系统校验订单明细匹配→确认入库并打印库位标签。出库时扫描领料单→推荐拣货库位→扫码确认拣货→更新库存。支持连续扫码模式和离线缓存。已完成PDA端框架和入库流程，出库扫码待开发。",
  "status": "in_review",
  "priority": "urgent",
  "assignee": "周杰",
  "createdBy": "张工",
  "project": "智能仓储管理平台",
  "issueType": "需求",
  "createDate": "2026-09-19",
  "dueDate": "2026-09-25",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "50",
  "code": "T1000050",
  "title": "库存实时预警引擎",
  "desc": "开发库存实时预警引擎：监控安全库存阈值（低于安全线黄色/为零红色）、库龄超期（>180天橙色/>365天红色）、呆滞料识别（无动销>90天标记）。预警事件推送至仓储主管和对应采购员，同时在看板滚动展示。引擎已部署，正在调试阈值参数和推送频率。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "张工",
  "createdBy": "李工",
  "project": "智能仓储管理平台",
  "issueType": "缺陷",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-29",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "51",
  "code": "T1000051",
  "title": "库龄分析与呆滞料识别",
  "desc": "开发库龄分析与呆滞料识别报表：按物料维度展示入库日期、库龄天数、库龄分布直方图。呆滞料识别规则：90天无动销预警、180天冻结采购建议、365天启动清仓处理。报表支持按仓库/品类/供应商筛选，自动计算呆滞金额占比。已完成后端分析逻辑。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "李工",
  "createdBy": "王工",
  "project": "智能仓储管理平台",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-10-03",
  "stageId": null,
  "plan": []
 },
 {
  "id": "52",
  "code": "T1000052",
  "title": "仓储大屏可视化",
  "desc": "开发仓储运营大屏（1920x1080横屏）：四区布局——今日出入库概览（单数/数量/异常）、库存水位热力图（按库区色温展示利用率）、实时出入库流水滚动、预警待处理清单。数据每15秒自动刷新，支持暂停。已上线部署在仓库入口大屏，日均运行稳定。",
  "status": "done",
  "priority": "low",
  "assignee": "张工",
  "createdBy": "周杰",
  "project": "智能仓储管理平台",
  "issueType": "缺陷",
  "createDate": "2026-09-07",
  "dueDate": "2026-09-14",
  "stageId": null,
  "plan": []
 },
 {
  "id": "73",
  "code": "T1000073",
  "title": "采购合同电子签章需求梳理",
  "desc": "梳理采购合同电子签章的适用单据、签署顺序、证书校验和归档范围；待法务确认签章主体与验收边界后，再安排专家团评估和实施。",
  "status": "planned",
  "priority": "medium",
  "assignee": "李工",
  "createdBy": "周杰",
  "project": "采购管理系统",
  "issueType": "需求",
  "createDate": "2026-09-24",
  "dueDate": "2026-10-12",
  "stageId": null,
  "plan": []
 },
 {
  "id": "74",
  "code": "T1000074",
  "title": "旧版工单短信模板迁移",
  "desc": "原计划将旧版工单短信模板迁移到新通知中心；因模板已被统一消息服务替代，项目负责人取消该项工作并保留任务记录供追溯。",
  "status": "cancelled",
  "priority": "low",
  "assignee": "赵琳",
  "createdBy": "张工",
  "project": "客户服务工单平台",
  "issueType": "缺陷",
  "createDate": "2026-09-20",
  "dueDate": "2026-09-30",
  "stageId": null,
  "plan": []
 },
 {
  "id": "75",
  "code": "T1000075",
  "title": "属性元模型抽取脚本开发",
  "desc": "从 bos-metadata-8.0.jar 离线抽取 839 条属性 style 记录，覆盖 708 个属性名与 34 个模型类型的资源继承链",
  "status": "done",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-10",
  "dueDate": "2026-10-05",
  "stageId": null,
  "plan": []
 },
 {
  "id": "80",
  "code": "T1000080",
  "title": "Visible 属性取值域类型修正",
  "desc": "Visible 是 mcombo 而非 boolean，Invisible/Hidden 为 checkbox，修正属性元模型取值域类型标注",
  "status": "done",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "缺陷",
  "createDate": "2026-09-15",
  "dueDate": "2026-10-10",
  "stageId": null,
  "plan": []
 },
 {
  "id": "81",
  "code": "T1000081",
  "title": "操作类型注册表扫描与集成",
  "desc": "扫描 mservice/lib 与 mservice-cosmic/lib 下 5300+ jar，提取 256 个操作类型（20 个云）与 92 个平台预置操作",
  "status": "done",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-16",
  "dueDate": "2026-10-11",
  "stageId": null,
  "plan": []
 },
 {
  "id": "82",
  "code": "T1000082",
  "title": "操作参数形状抽取与映射",
  "desc": "抽取 66 个操作/校验 Java 类的序列化槽位，建立 38 条操作类型→参数类官方映射",
  "status": "in_progress",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-17",
  "dueDate": "2026-10-12",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "83",
  "code": "T1000083",
  "title": "平台预置操作清单集成",
  "desc": "集成 92 个平台预置操作实例，支持按模型类型筛选可用操作",
  "status": "done",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-18",
  "dueDate": "2026-10-13",
  "stageId": null,
  "plan": []
 },
 {
  "id": "84",
  "code": "T1000084",
  "title": "操作业务规则类型目录构建",
  "desc": "集成 174 个操作业务规则类型，含 RunClass 与 SettingFormId 映射，支持操作挂载业务规则",
  "status": "in_progress",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-19",
  "dueDate": "2026-10-14",
  "stageId": "requirements",
  "plan": []
 },
 {
  "id": "86",
  "code": "T1000086",
  "title": "操作参数 Complex 注解支持修复",
  "desc": "Operation.Parameter 是 @ComplexPropertyAttribute，现有抽取器只认 Simple/Collection 两种注解，需补充第三种注解支持",
  "status": "blocked",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "缺陷",
  "createDate": "2026-09-11",
  "dueDate": "2026-10-16",
  "stageId": "implementation",
  "plan": []
 },
 {
  "id": "87",
  "code": "T1000087",
  "title": "规则动作类型清单集成",
  "desc": "集成 32 个规则动作类型，含由字节码注解得到的序列化槽位",
  "status": "done",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-12",
  "dueDate": "2026-10-17",
  "stageId": null,
  "plan": []
 },
 {
  "id": "89",
  "code": "T1000089",
  "title": "LockFieldAction 序列化形状修复",
  "desc": "LockFieldAction 序列化形状应为 Fields:List<FieldId> + GroupName/RET/Description/ActionType/Id/Seq",
  "status": "done",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "缺陷",
  "createDate": "2026-09-14",
  "dueDate": "2026-10-19",
  "stageId": null,
  "plan": []
 },
 {
  "id": "90",
  "code": "T1000090",
  "title": "SummaryToField 四槽位结构实现",
  "desc": "修复 SummaryToField 为四槽位 {FieldId,FieldKey,FieldName,SumType:int}，字符串写法结构性不生效",
  "status": "done",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "缺陷",
  "createDate": "2026-09-15",
  "dueDate": "2026-10-20",
  "stageId": null,
  "plan": []
 },
 {
  "id": "93",
  "code": "T1000093",
  "title": "设计器只读属性处理",
  "desc": "处理 7 个设计器只读属性（ChildrenPropertyCollection/ExecuteActions/FieldName/JSPlugins/PermissionControl/PermissionDimension/ThumbnailsParam）",
  "status": "done",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-18",
  "dueDate": "2026-10-23",
  "stageId": null,
  "plan": []
 },
 {
  "id": "94",
  "code": "T1000094",
  "title": "EntryId 冲突裁决实现",
  "desc": "解决 EntryId 在 property 与 complex shape 间的冲突，按共享规则裁决写入路由",
  "status": "in_progress",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "缺陷",
  "createDate": "2026-09-19",
  "dueDate": "2026-10-24",
  "stageId": "verification",
  "plan": []
 },
 {
  "id": "96",
  "code": "T1000096",
  "title": "后端端点探测与缺口分析",
  "desc": "探测 ai-meta 端点可用性，标记元模型证实但端点不存在的属性写入缺口",
  "status": "in_progress",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-11",
  "dueDate": "2026-10-26",
  "stageId": "requirements",
  "plan": []
 },
 {
  "id": "98",
  "code": "T1000098",
  "title": "两个运行时构建差异记录",
  "desc": "记录 mservice/lib 与 mservice-cosmic/lib 的 bos-metadata jar 字节差异及 3 个差异操作类型",
  "status": "done",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-13",
  "dueDate": "2026-10-28",
  "stageId": null,
  "plan": []
 },
 {
  "id": "1300",
  "code": "T1001300",
  "title": "问卷调研需求梳理与验收标准",
  "desc": "梳理问卷调研全流程需求：问卷设计、发放、回收、分析四个环节；明确首期范围与非目标（不做付费问卷和外部样本采购）；每条需求附可观察的验收条件。",
  "status": "done",
  "priority": "high",
  "assignee": "赵琳",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-09-07",
  "dueDate": "2026-09-14",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "done"
   }
  ]
 },
 {
  "id": "1301",
  "code": "T1001301",
  "title": "问卷系统技术方案设计",
  "desc": "设计问卷系统技术方案：问卷结构以 JSON Schema 存储，题型扩展不改表结构；答卷按问卷分区存储；分析任务异步计算；企业微信、短信、链接三种发放通道统一封装。",
  "status": "done",
  "priority": "high",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-09-14",
  "dueDate": "2026-09-25",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "done"
   }
  ]
 },
 {
  "id": "1302",
  "code": "T1001302",
  "title": "问卷设计器：题型、逻辑跳转与预览",
  "desc": "实现问卷设计器：支持单选、多选、矩阵、量表、排序等 12 种题型；支持按答案逻辑跳转（最多 3 层）与必答校验；桌面端与移动端实时预览。",
  "status": "in_review",
  "priority": "high",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-09-25",
  "dueDate": "2026-10-09",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "吴宏超",
    "status": "review"
   }
  ]
 },
 {
  "id": "1303",
  "code": "T1001303",
  "title": "多渠道发放：链接、二维码与企业微信",
  "desc": "实现问卷多渠道发放：生成公开链接与二维码；按组织架构选择企业微信推送对象；支持定时发放与匿名作答；同一人防重复作答。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "张工",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-09-26",
  "dueDate": "2026-10-12",
  "stageId": "implementation",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "张工",
    "status": "running"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1304",
  "code": "T1001304",
  "title": "回收进度监控与催办提醒",
  "desc": "实时展示回收进度与各部门应答率；低于阈值的部门自动生成催办名单并通过企业微信提醒。阻塞原因：企业微信应用尚未开通发送消息权限。",
  "status": "blocked",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-09-28",
  "dueDate": "2026-10-14",
  "stageId": "implementation",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "吴宏超",
    "status": "blocked"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1305",
  "code": "T1001305",
  "title": "自动分析报告：交叉分析与图表",
  "desc": "回收结束后自动生成分析报告：题目分布、部门交叉分析、开放题关键词归纳与改进建议；报告可在线查看并导出 PDF。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "王工",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-09-30",
  "dueDate": "2026-10-16",
  "stageId": "design",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "running"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "张工",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1306",
  "code": "T1001306",
  "title": "问卷模板库与一键复用",
  "desc": "把已发布的问卷沉淀为模板：员工满意度、客户满意度、培训评估等；新建问卷时可一键套用并修改，模板按部门共享。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "吴宏超",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-10-02",
  "dueDate": "2026-10-20",
  "stageId": "requirements",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "吴宏超",
    "status": "pending"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "pending"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "张工",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1307",
  "code": "T1001307",
  "title": "答卷数据导出与权限控制",
  "desc": "答卷支持导出 Excel；按角色控制可见范围：创建人看全部，部门负责人只看本部门，匿名问卷不展示作答人。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "赵琳",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-10-02",
  "dueDate": "2026-10-22",
  "stageId": "requirements",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "赵琳",
    "status": "pending"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "pending"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "张工",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1308",
  "code": "T1001308",
  "title": "首个调研：2026 员工满意度问卷",
  "desc": "用新系统完成首个真实调研：2026 员工满意度问卷，共 32 题，覆盖 1,500 人，7 天内回收并输出分析报告。",
  "status": "done",
  "priority": "medium",
  "assignee": "赵琳",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-09-20",
  "dueDate": "2026-10-02",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "done"
   }
  ]
 },
 {
  "id": "1309",
  "code": "T1001309",
  "title": "问卷系统上线部署与验收",
  "desc": "完成生产环境部署、数据备份与监控告警配置；组织业务验收并发布使用说明。",
  "status": "planned",
  "priority": "high",
  "assignee": "周杰",
  "createdBy": "吴宏超",
  "project": "问卷调研系统建设",
  "issueType": "需求",
  "createDate": "2026-10-03",
  "dueDate": "2026-10-30",
  "stageId": "requirements",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "明确目标、范围与验收条件",
    "assignee": "周杰",
    "status": "pending"
   },
   {
    "id": "design",
    "title": "系统设计",
    "desc": "设计系统边界、接口与数据流",
    "assignee": "王工",
    "status": "pending"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "实现功能并完成针对性验证",
    "assignee": "周杰",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "独立验证验收行为与回归影响",
    "assignee": "陈晨",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1500",
  "code": "T1001500",
  "title": "设备巡检需求梳理与验收标准",
  "desc": "梳理设备巡检、故障报修、维修记录三个环节的需求；明确首期覆盖注塑、空压、数控三类 126 台设备；每条需求附可观察的验收条件。",
  "status": "done",
  "priority": "high",
  "assignee": "",
  "createdBy": "张工",
  "project": "设备巡检维修系统建设",
  "issueType": "需求",
  "createDate": "2026-09-14",
  "dueDate": "2026-09-18",
  "stageId": "delivery",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "访谈设备部，梳理巡检与维修现状",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "方案设计",
    "desc": "划定首期设备范围与非目标",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "planning",
    "title": "实现规划",
    "desc": "拆分需求清单与优先级",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "编码实现",
    "desc": "编写需求文档与验收条件",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "逐条核对验收条件可观察",
    "assignee": "陈晨",
    "status": "done"
   },
   {
    "id": "delivery",
    "title": "部署交付",
    "desc": "需求评审并归档",
    "assignee": "张工",
    "status": "done"
   }
  ]
 },
 {
  "id": "1501",
  "code": "T1001501",
  "title": "巡检维修系统技术方案",
  "desc": "设计设备、巡检计划、巡检记录、报修单、维修记录五个核心对象；设备二维码作为统一入口；维修记录开放查询接口，供后续智能体技能调用。",
  "status": "done",
  "priority": "high",
  "assignee": "",
  "createdBy": "张工",
  "project": "设备巡检维修系统建设",
  "issueType": "需求",
  "createDate": "2026-09-18",
  "dueDate": "2026-09-24",
  "stageId": "delivery",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认移动端、离线与扫码要求",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "design",
    "title": "方案设计",
    "desc": "设计五个核心对象与二维码入口",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "planning",
    "title": "实现规划",
    "desc": "规划接口与开发顺序",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "编码实现",
    "desc": "输出方案文档与接口契约",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "评审方案风险与预案",
    "assignee": "陈晨",
    "status": "done"
   },
   {
    "id": "delivery",
    "title": "部署交付",
    "desc": "方案评审通过并归档",
    "assignee": "张工",
    "status": "done"
   }
  ]
 },
 {
  "id": "1502",
  "code": "T1001502",
  "title": "设备台账与扫码巡检",
  "desc": "建立设备台账并为每台设备生成二维码；维修工扫码打开巡检表，按设备类型加载巡检项，异常项拍照留证并可一键转报修。",
  "status": "done",
  "priority": "high",
  "assignee": "",
  "createdBy": "张工",
  "project": "设备巡检维修系统建设",
  "issueType": "需求",
  "createDate": "2026-09-24",
  "dueDate": "2026-10-02",
  "stageId": "delivery",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认台账字段与巡检项模板",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "方案设计",
    "desc": "设计二维码规则与巡检表结构",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "planning",
    "title": "实现规划",
    "desc": "拆分台账、二维码、巡检三个切片",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "编码实现",
    "desc": "实现台账、扫码巡检与异常转报修",
    "assignee": "李工",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "验证 126 台设备二维码与巡检流程",
    "assignee": "陈晨",
    "status": "done"
   },
   {
    "id": "delivery",
    "title": "部署交付",
    "desc": "发布到测试环境",
    "assignee": "周杰",
    "status": "done"
   }
  ]
 },
 {
  "id": "1503",
  "code": "T1001503",
  "title": "故障报修与维修记录",
  "desc": "维修工扫码报修，填写故障现象并拍照；系统按设备类型派给对应维修组；维修完成后记录故障原因、更换零件和耗时，形成每台设备的维修履历。",
  "status": "in_review",
  "priority": "high",
  "assignee": "",
  "createdBy": "张工",
  "project": "设备巡检维修系统建设",
  "issueType": "需求",
  "createDate": "2026-09-28",
  "dueDate": "2026-10-09",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "需求智能体：确认报修字段、派工规则与维修履历",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "design",
    "title": "方案设计",
    "desc": "方案智能体：设计报修单、维修记录与派工规则",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "开发智能体：基于苍穹元数据实现扫码报修、自动派工与维修记录",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "测试智能体：验证报修到维修闭环与设备履历，张工审核结果",
    "assignee": "张工",
    "status": "review"
   },
   {
    "id": "delivery",
    "title": "部署发布",
    "desc": "部署智能体：发布到生产环境",
    "assignee": "张工",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1504",
  "code": "T1001504",
  "title": "移动端离线巡检与拍照上传",
  "desc": "车间信号弱时可离线完成巡检，恢复网络后自动上传；照片压缩到 500KB 以内，上传失败自动重试。",
  "status": "in_progress",
  "priority": "medium",
  "assignee": "",
  "createdBy": "张工",
  "project": "设备巡检维修系统建设",
  "issueType": "需求",
  "createDate": "2026-10-02",
  "dueDate": "2026-10-14",
  "stageId": "implementation",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认离线时长与照片要求",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "design",
    "title": "方案设计",
    "desc": "设计本地缓存与同步冲突规则",
    "assignee": "王工",
    "status": "done"
   },
   {
    "id": "planning",
    "title": "实现规划",
    "desc": "规划缓存、同步、重试步骤",
    "assignee": "张工",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "编码实现",
    "desc": "实现离线缓存与断点上传",
    "assignee": "李工",
    "status": "running"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "弱网与断网场景验证",
    "assignee": "陈晨",
    "status": "pending"
   },
   {
    "id": "delivery",
    "title": "部署交付",
    "desc": "随系统上线发布",
    "assignee": "周杰",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1505",
  "code": "T1001505",
  "title": "系统上线部署与设备数据导入",
  "desc": "导入 126 台设备台账和近一年纸质维修记录；完成生产环境部署、备份与监控；打印并张贴设备二维码。",
  "status": "backlog",
  "priority": "high",
  "assignee": "",
  "createdBy": "张工",
  "project": "设备巡检维修系统建设",
  "issueType": "需求",
  "createDate": "2026-10-03",
  "dueDate": "2026-10-16",
  "stageId": "requirements",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认导入范围与上线计划",
    "assignee": "周杰",
    "status": "pending"
   },
   {
    "id": "design",
    "title": "方案设计",
    "desc": "设计导入映射与回滚方案",
    "assignee": "王工",
    "status": "pending"
   },
   {
    "id": "planning",
    "title": "实现规划",
    "desc": "排定导入、部署与张贴顺序",
    "assignee": "周杰",
    "status": "pending"
   },
   {
    "id": "implementation",
    "title": "编码实现",
    "desc": "执行导入与部署",
    "assignee": "周杰",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "抽查导入数据与扫码入口",
    "assignee": "陈晨",
    "status": "pending"
   },
   {
    "id": "delivery",
    "title": "部署交付",
    "desc": "正式上线",
    "assignee": "张工",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1506",
  "code": "T1001506",
  "title": "设备故障诊断助手",
  "desc": "设备巡检维修系统上线了，帮我做一个设备故障诊断助手。维修工程师报上设备编号和故障现象，先从系统里查这台设备的档案和最近的维修记录，再按我的经验给排查步骤。比如注塑机温度忽高忽低，先查热电偶接线，再查加热圈，最后查温控表；最近换过的零件要优先怀疑；碰到高压电的活先断电挂牌。",
  "status": "in_review",
  "priority": "high",
  "assignee": "",
  "createdBy": "周建国",
  "project": "设备巡检维修系统建设",
  "issueType": "需求",
  "createDate": "2026-10-03",
  "dueDate": "2026-10-23",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "把周师傅的话整理成排障经验清单",
    "assignee": "周建国",
    "status": "done"
   },
   {
    "id": "design",
    "title": "方案设计",
    "desc": "确定角色设定、技能和知识范围",
    "assignee": "周建国",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "编码实现",
    "desc": "生成角色设定，挂载调用设备巡检维修系统 MCP 服务的技能",
    "assignee": "周建国",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "在测试环境用真实故障测试，确认回答符合经验",
    "assignee": "周建国",
    "status": "review"
   },
   {
    "id": "delivery",
    "title": "提交上架",
    "desc": "在智能体开发中提交上架审核，管理员审核后发布",
    "assignee": "周建国",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1600",
  "code": "T1001600",
  "title": "工单提交与表单设计",
  "desc": "客户和一线人员可提交工单：标题、描述、分类、优先级、附件；提交后生成编号并通知处理组。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-25",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1601",
  "code": "T1001601",
  "title": "工单分类与优先级规则",
  "desc": "维护一级 / 二级分类和四档优先级，规则变更立即生效并留痕。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-21",
  "dueDate": "2026-09-25",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1602",
  "code": "T1001602",
  "title": "工单状态流转引擎",
  "desc": "定义受理、处理中、待确认、已关闭四个状态及合法流转，非法流转直接拦截。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-09-25",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1603",
  "code": "T1001603",
  "title": "角色与权限矩阵",
  "desc": "一线、二线、主管、管理员四类角色，按分类和处理组控制可见与可操作范围。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-09-25",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1604",
  "code": "T1001604",
  "title": "处理组与排班管理",
  "desc": "按处理组维护成员与排班，支持节假日顺延与临时替班。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-23",
  "dueDate": "2026-09-26",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1605",
  "code": "T1001605",
  "title": "工单列表与高级筛选",
  "desc": "按状态、分类、处理人、时间范围筛选并保存常用视图，支持批量操作。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-24",
  "dueDate": "2026-09-30",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1606",
  "code": "T1001606",
  "title": "工单详情与处理记录",
  "desc": "展示工单全程处理记录、内部备注与附件，每次变更写入操作日志。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-24",
  "dueDate": "2026-09-30",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1607",
  "code": "T1001607",
  "title": "站内消息与邮件通知",
  "desc": "工单创建、流转、超时自动通知相关人，按角色配置通知渠道。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-25",
  "dueDate": "2026-09-30",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1608",
  "code": "T1001608",
  "title": "客户满意度评价",
  "desc": "工单关闭后推送评价，低分自动生成回访任务。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-25",
  "dueDate": "2026-09-30",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1609",
  "code": "T1001609",
  "title": "知识库关联与推荐",
  "desc": "工单详情按关键词推荐相似历史工单和知识条目，处理人一键引用。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-28",
  "dueDate": "2026-10-02",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1610",
  "code": "T1001610",
  "title": "工单自动派单算法",
  "desc": "按分类、处理组负载和技能标签自动派单；规则引擎依赖调度集群，扩容后才能压测并上线。",
  "status": "blocked",
  "priority": "high",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-01",
  "dueDate": "2026-10-09",
  "stageId": "s3",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "需求",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "架构",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "开发",
    "status": "blocked"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1611",
  "code": "T1001611",
  "title": "SLA 时效配置",
  "desc": "四档优先级分别配置响应和解决时限，工作时间日历可调。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-28",
  "dueDate": "2026-10-02",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1612",
  "code": "T1001612",
  "title": "SLA 倒计时与超时预警",
  "desc": "工单卡片实时倒计时，临近超时提醒处理人，超时自动升级给主管。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-02",
  "dueDate": "2026-10-09",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1613",
  "code": "T1001613",
  "title": "工单统计报表",
  "desc": "按分类、处理组、处理人统计量、时效达成率和满意度，支持导出。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-29",
  "dueDate": "2026-10-05",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1614",
  "code": "T1001614",
  "title": "管理驾驶舱看板",
  "desc": "主管视角的实时看板：积压、超时、满意度趋势。",
  "status": "in_review",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-02",
  "dueDate": "2026-10-09",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "需求",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "架构",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "开发",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "review"
   }
  ]
 },
 {
  "id": "1615",
  "code": "T1001615",
  "title": "历史工单数据迁移",
  "desc": "从旧系统导入近两年 8.6 万条历史工单，字段映射并校验。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-09-30",
  "dueDate": "2026-10-06",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1616",
  "code": "T1001616",
  "title": "权限审计与操作日志",
  "desc": "关键操作全程留痕，支持按人员、对象、时间检索，满足审计要求。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-01",
  "dueDate": "2026-10-07",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1617",
  "code": "T1001617",
  "title": "企业微信集成",
  "desc": "工单消息推送到企业微信，支持在微信内受理和回复。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-01",
  "dueDate": "2026-10-07",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1618",
  "code": "T1001618",
  "title": "批量导入导出",
  "desc": "工单批量导出 Excel（上限 5 万条）和模板化批量导入。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-02",
  "dueDate": "2026-10-07",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1619",
  "code": "T1001619",
  "title": "移动端工单处理",
  "desc": "手机端受理、回复、转派和拍照上传。",
  "status": "in_review",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-03",
  "dueDate": "2026-10-09",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "需求",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "架构",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "开发",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "review"
   }
  ]
 },
 {
  "id": "1620",
  "code": "T1001620",
  "title": "性能压测与安全扫描",
  "desc": "并发 500 压测、接口鉴权与越权扫描，输出报告。",
  "status": "done",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-06",
  "dueDate": "2026-10-08",
  "stageId": "s4",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "done"
   }
  ]
 },
 {
  "id": "1621",
  "code": "T1001621",
  "title": "上线部署与数据割接",
  "desc": "生产环境部署、备份监控与割接演练，正式上线。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "",
  "createdBy": "赵琳",
  "project": "工单管理系统",
  "issueType": "需求",
  "createDate": "2026-10-08",
  "dueDate": "2026-10-16",
  "stageId": "s1",
  "plan": [
   {
    "id": "s1",
    "title": "需求分析",
    "desc": "",
    "assignee": "需求",
    "status": "pending"
   },
   {
    "id": "s2",
    "title": "系统设计",
    "desc": "",
    "assignee": "架构",
    "status": "pending"
   },
   {
    "id": "s3",
    "title": "开发实现",
    "desc": "",
    "assignee": "开发",
    "status": "pending"
   },
   {
    "id": "s4",
    "title": "测试验证",
    "desc": "",
    "assignee": "赵琳",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1200",
  "code": "T1001200",
  "title": "设计器属性元模型抽取范围确认",
  "desc": "梳理 bos-metadata-8.0.jar 离线抽取范围：839 条属性 style 记录（820 定义 + 19 局部覆盖）、708 个属性名、34 个模型类型的资源继承链；确认 mcombo 逗号连接取值域与 btnedit 复杂属性（ide_* 参数表单）的边界，以及 37 个取值域随模型类型变化的属性清单。",
  "status": "backlog",
  "priority": "high",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-26",
  "dueDate": "2026-10-12",
  "stageId": "requirements",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认抽取范围、验收条件与模型类型继承链口径",
    "assignee": "吴晓锋",
    "status": "pending"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计属性 style 解析与局部覆盖合并方案；拆解 extract_designer_metamodel.py 的解析步骤与依赖；实现 *Property.xml 解析与 out 产物生成",
    "assignee": "张利军",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "核对 839 条记录与 extraction-report 失败项；产物归档并输出使用说明",
    "assignee": "陈惠琼",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1201",
  "code": "T1001201",
  "title": "操作元模型四张注册表抽取方案设计",
  "desc": "设计操作元模型抽取方案：256 个操作类型（20 个云）、92 个平台预置操作、174 个操作业务规则类型、33 个校验器类型；确定 mservice/lib 与 mservice-cosmic/lib 双运行时差异的记录策略，以及 38 条「操作类型 → 参数类」官方映射的集成方式。已完成需求梳理，正在产出方案设计文档。",
  "status": "in_progress",
  "priority": "high",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-24",
  "dueDate": "2026-10-15",
  "stageId": "implementation",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认四张注册表的范围与双运行时差异口径",
    "assignee": "吴晓锋",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计扫描策略与注册表集成方案；规划 extract_operation_metamodel.py 步骤；实现操作元数据类扫描与槽位抽取",
    "assignee": "张利军",
    "status": "running"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "核对 256 个操作类型与 66 个类槽位；产出 operation-metamodel.json 并归档",
    "assignee": "陈瑾",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1202",
  "code": "T1001202",
  "title": "编辑器提交形状与 EntryId 冲突裁决实现",
  "desc": "实现 9 类编辑器（checkbox/btnedit/combo/text/integer/ecombo/dimension/mcombo/color，共 789 条 style）的设计器提交形状与校验规则；对接 btnedit 参数表单入参协议，处理 alias 只读契约与 EntryId 冲突裁决，关闭 359 条未证实取值域。来源为 bos-platform 前端源码而非 jar。已完成前三阶段，正在编码实现。",
  "status": "in_progress",
  "priority": "medium",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-22",
  "dueDate": "2026-10-10",
  "stageId": "implementation",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认 9 类编辑器的提交形状范围",
    "assignee": "吴晓锋",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计提交形状与校验规则的抽取方案；规划 extract_editor_value_shapes.py 步骤；实现编辑器形状抽取与冲突裁决",
    "assignee": "付鹏城",
    "status": "running"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "验证 789 条 style 与关闭项清单；产出 editor-value-shapes.json 并归档",
    "assignee": "陈惠琼",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1203",
  "code": "T1001203",
  "title": "规则动作类型序列化槽位验证",
  "desc": "验证 32 个规则动作类型由字节码注解得到的序列化槽位，并与采购订单规则配置清单交叉核对：LockFieldAction 应为 Fields:List<FieldId> + GroupName/RET/Description/ActionType/Id/Seq；SummaryToField 为四槽位 {FieldId,FieldKey,FieldName,SumType:int}。测试验证产物已生成，等待审核。",
  "status": "in_review",
  "priority": "high",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-18",
  "dueDate": "2026-10-08",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认规则动作槽位验证范围与清单来源",
    "assignee": "吴晓锋",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计字节码注解槽位的验证方案；规划 gen_rule_excel.py 与交叉核对步骤；实现槽位抽取与清单生成",
    "assignee": "王育权",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "交叉核对清单并验证序列化形状；产出 rule-action-types.json 并归档",
    "assignee": "陈瑾",
    "status": "review"
   }
  ]
 },
 {
  "id": "1204",
  "code": "T1001204",
  "title": "扩展表单属性锁定规则解析修复",
  "desc": "解析 ExtendControl/ExtPropertyConfig.json 的 545 条扩展表单属性锁定规则（lock 341 / unlock 160 / speciallock 44）；speciallock 44 条语义平台组尚未确认，解析暂时阻塞，等待确认后恢复。",
  "status": "blocked",
  "priority": "medium",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "缺陷",
  "createDate": "2026-09-20",
  "dueDate": "2026-10-06",
  "stageId": "implementation",
  "plan": [
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "定位根因，修改代码并完成针对性自测",
    "assignee": "钟伟纯",
    "status": "blocked"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "验证问题解决且相关功能未受影响",
    "assignee": "陈来珍",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1205",
  "code": "T1001205",
  "title": "采购订单规则配置清单交付",
  "desc": "将规则动作类型与取值形状集成到采购订单规则配置清单（xlsx），附使用说明与字段口径，归档证据到 evidence 目录；前五个阶段已完成，正在执行交付收口。",
  "status": "in_progress",
  "priority": "low",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-16",
  "dueDate": "2026-10-04",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认清单字段口径与交付范围",
    "assignee": "吴晓锋",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计清单结构与取值形状映射；规划 xlsx 生成与归档步骤；实现清单生成脚本",
    "assignee": "王育权",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "验证清单与规则动作一致性；交付清单并归档证据",
    "assignee": "暴福音",
    "status": "running"
   }
  ]
 },
 {
  "id": "1206",
  "code": "T1001206",
  "title": "属性元模型与 app-build 契约交叉比对集成",
  "desc": "完成 compare_with_app_build.py 交叉比对：产出 appbuild-crosscheck.json 差异清单，与 property-input-index.json 及 property-guides 的差异全部闭环，用平台声明的事实替换此前靠实测探测 + FI 语料反推得到的近似契约。",
  "status": "done",
  "priority": "high",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-12",
  "dueDate": "2026-09-30",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认比对基准与差异闭环口径",
    "assignee": "吴晓锋",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计交叉比对与差异清单方案；规划 compare_with_app_build.py 步骤；实现比对脚本与差异报告",
    "assignee": "张利军",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "验证差异清单与闭环结果；集成差异清单到 app-build 契约",
    "assignee": "荆龙刚",
    "status": "done"
   }
  ]
 },
 {
  "id": "1207",
  "code": "T1001207",
  "title": "属性继承链取值域合并验证",
  "desc": "验证 37 个取值域随模型类型变化的属性按 DomainModelTypeDefiners 继承链的覆盖合并结果，与 property-by-model-type.json 及 element-property-map.json 交叉核对，确认局部覆盖优先于全局定义、34 个模型类型的继承链无断链。测试验证产物已生成，等待审核。",
  "status": "in_review",
  "priority": "high",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-25",
  "dueDate": "2026-10-14",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认取值域覆盖合并的验证范围与判定口径",
    "assignee": "吴晓锋",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计继承链覆盖优先级与断链检测方案；规划合并验证脚本与产物清单步骤；实现继承链合并与交叉核对脚本",
    "assignee": "张利军",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "核对 37 个属性合并结果与两张映射表；产出 domain-value-merge-report.json 并归档",
    "assignee": "陈瑾",
    "status": "review"
   }
  ]
 },
 {
  "id": "1208",
  "code": "T1001208",
  "title": "复杂属性参数表单与转换器映射核对",
  "desc": "核对 150 个 btnedit 复杂属性的 ide_* 参数表单与 100 个转换器注册表的映射关系，逐条确认 alias 只读契约与 EntryId 写入路由，关闭未证实的映射项；核对结论与 complex-property-routes.json 对齐后归档。映射核对清单已生成，等待审核。",
  "status": "in_review",
  "priority": "medium",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-24",
  "dueDate": "2026-10-11",
  "stageId": "verification",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认映射核对范围与关闭项判定标准",
    "assignee": "吴晓锋",
    "status": "done"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计参数表单与转换器的核对方案；规划映射核对脚本与清单输出步骤；实现映射核对与未证实项标记",
    "assignee": "王育权",
    "status": "done"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "抽查映射结论与 complex-property-routes 一致性；产出 converter-mapping-check.json 并归档",
    "assignee": "陈惠琼",
    "status": "review"
   }
  ]
 },
 {
  "id": "1209",
  "code": "T1001209",
  "title": "操作元模型注册表数据字典编制",
  "desc": "把操作元模型四张注册表（256 个操作类型、92 个平台预置操作、174 个操作业务规则类型、33 个校验器类型）整理成可查询的数据字典：含操作类型 → 参数类官方映射、云归属、双运行时差异标注与挂载业务规则说明，输出 operation-data-dictionary.json 与使用说明，供设计器操作目录直接消费。",
  "status": "backlog",
  "priority": "medium",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-27",
  "dueDate": "2026-10-16",
  "stageId": "requirements",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认字典字段口径、消费方与查询场景",
    "assignee": "吴晓锋",
    "status": "pending"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计注册表到字典条目的映射方案；规划字典生成脚本与校验步骤；实现字典生成与结构校验脚本",
    "assignee": "张利军",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "核对四张注册表计数与映射完整性；产出字典与使用说明并归档",
    "assignee": "陈惠琼",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1210",
  "code": "T1001210",
  "title": "设计器元模型抽取工程接入 CI 校验",
  "desc": "将 extract_designer_metamodel.py 等抽取脚本接入 CI 流水线：产物 JSON 变更需通过计数与结构校验（属性 style 记录 839 条、模型类型 34 个、操作类型 256 个），校验失败阻断合并；产物随流水线归档，出现漂移时自动生成差异报告并通知负责人。",
  "status": "backlog",
  "priority": "low",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "需求",
  "createDate": "2026-09-27",
  "dueDate": "2026-10-18",
  "stageId": "requirements",
  "plan": [
   {
    "id": "requirements",
    "title": "需求分析",
    "desc": "确认校验范围、阈值与阻断策略",
    "assignee": "吴晓锋",
    "status": "pending"
   },
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "设计流水线接入与产物校验方案；规划校验脚本与差异报告生成步骤；实现计数与结构校验及漂移检测",
    "assignee": "刘鉴洲",
    "status": "pending"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "验证漂移检测与差异报告输出；接入流水线并归档校验基线",
    "assignee": "陈瑾",
    "status": "pending"
   }
  ]
 },
 {
  "id": "1211",
  "code": "T1001211",
  "title": "设计器控件元数据增量扫描异常修复",
  "desc": "修复设计器控件元数据增量扫描异常：扫描任务在合并局部覆盖定义时检测到重复 EntryId，当前批次已停止写入，等待清理冲突数据后重新执行。",
  "status": "blocked",
  "priority": "high",
  "assignee": "吴晓锋",
  "createdBy": "吴晓锋",
  "project": "苍穹应用开发",
  "issueType": "缺陷",
  "createDate": "2026-09-29",
  "dueDate": "2026-10-10",
  "stageId": "implementation",
  "plan": [
   {
    "id": "implementation",
    "title": "开发实现",
    "desc": "定位根因，修改代码并完成针对性自测",
    "assignee": "吴晓锋",
    "status": "blocked"
   },
   {
    "id": "verification",
    "title": "测试验证",
    "desc": "验证问题解决且相关功能未受影响",
    "assignee": "陈惠琼",
    "status": "pending"
   }
  ]
 }
] as CollabTask[]
