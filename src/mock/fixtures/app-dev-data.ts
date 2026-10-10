// 应用开发的演示数据，摘自 lingee 原型（views/apps.html、views/chat.html、features/apps.js、attach-app.js、composer.js）
export const appCardSeeds: Array<{ name: string; desc: string }> = [
  {
    "name": "设备巡检维修系统",
    "desc": "设备台账、扫码巡检、故障报修与维修履历，由项目「设备巡检维修系统建设」交付上线"
  },
  {
    "name": "问卷调研系统",
    "desc": "问卷设计、多渠道发放、回收监控与自动分析，已部署上线"
  },
  {
    "name": "帮助台工单系统",
    "desc": "面向企业内部 IT/HR/行政等多业务处理部门的通用工单系统"
  },
  {
    "name": "费用报销审批系统",
    "desc": "支持报销申请、多级审批流程、费用标准校验、消息通知和统计报表的费用报销审批系统"
  },
  {
    "name": "工单管理系统",
    "desc": "创建一个工单管理系统"
  },
  {
    "name": "工单系统",
    "desc": "工单提交、分配、处理、回复、SLA、评价的工单管理平台"
  },
  {
    "name": "工单系统",
    "desc": ""
  },
  {
    "name": "合同管理0617演示",
    "desc": "合同签订与收款闭环管理，实现签约-履约-收款最小闭环"
  },
  {
    "name": "合同收款应用",
    "desc": "合同签订与收款闭环应用"
  },
  {
    "name": "开发演示_供销存",
    "desc": "营销库存工作台管理，实现合同签订、履约跟踪与收款记录的最小闭环管理"
  },
  {
    "name": "库存进销存管理系统",
    "desc": "库存进销存管理系统，支持商品管理、采购入库、销售出库、库存预警、库存盘点和报表"
  },
  {
    "name": "任务协作平台",
    "desc": "集成看板管理、时间追踪、子任务拆分、团队协作与周报生成的轻量级任务协作平台"
  },
  {
    "name": "通用应用开发",
    "desc": ""
  },
  {
    "name": "应收",
    "desc": "应收一体化与智能往来结算"
  },
  {
    "name": "营销库存工作台",
    "desc": "营销库存工作台管理"
  },
  {
    "name": "振兴Helpdesk工单系统",
    "desc": "企业级多业务组工单管理系统"
  },
  {
    "name": "helpdesk",
    "desc": ""
  },
  {
    "name": "Helpdesk 工单系统",
    "desc": "面向企业内部 IT/HR/行政等多业务处理部门的通用工单系统，含 SLA、自动分配、双向通知"
  },
  {
    "name": "Helpdesk Ticketing System",
    "desc": ""
  }
]

/** 「关联应用」下拉里可选的苍穹应用 */
export const linkedApps: Array<{ app: string; code: string; cloud: string }> = [
  {
    "app": "采购订单管理",
    "code": "po_mgmt",
    "cloud": "供应链云"
  },
  {
    "app": "报价单管理",
    "code": "quote_mgmt",
    "cloud": "供应链云"
  },
  {
    "app": "资产领用",
    "code": "asset_use",
    "cloud": "财务云"
  },
  {
    "app": "请假管理",
    "code": "leave_mgmt",
    "cloud": "人力云"
  },
  {
    "app": "库存领用",
    "code": "stock_use",
    "cloud": "供应链云"
  },
  {
    "app": "费用报销单",
    "code": "expense_reim",
    "cloud": "财务云"
  },
  {
    "app": "销售合同",
    "code": "sales_contract",
    "cloud": "合同云"
  },
  {
    "app": "员工入职",
    "code": "emp_onboard",
    "cloud": "人力云"
  },
  {
    "app": "出差申请",
    "code": "travel_req",
    "cloud": "费用云"
  },
  {
    "app": "付款申请单",
    "code": "pay_req",
    "cloud": "财务云"
  },
  {
    "app": "采购入库单",
    "code": "po_inbound",
    "cloud": "供应链云"
  },
  {
    "app": "销售订单",
    "code": "sales_order",
    "cloud": "供应链云"
  },
  {
    "app": "项目立项",
    "code": "project_init",
    "cloud": "项目云"
  },
  {
    "app": "项目立项",
    "code": "project_init_v2",
    "cloud": "项目云"
  },
  {
    "app": "固定资产",
    "code": "fixed_asset",
    "cloud": "财务云"
  },
  {
    "app": "库存盘点",
    "code": "stock_count",
    "cloud": "供应链云"
  },
  {
    "app": "应收单",
    "code": "ar_bill",
    "cloud": "财务云"
  },
  {
    "app": "应付单",
    "code": "ap_bill",
    "cloud": "财务云"
  },
  {
    "app": "考勤汇总",
    "code": "attend_sum",
    "cloud": "人力云"
  },
  {
    "app": "预算编制",
    "code": "budget_plan",
    "cloud": "预算云"
  },
  {
    "app": "银行对账单",
    "code": "bank_recon",
    "cloud": "财务云"
  }
]

export interface CosmicMeta {
  listTitle: string
  searchPlaceholder: string
  columns: string[]
  rows: string[][]
  entities: Array<{ name: string; count: number }>
  fields: Array<{ name: string; key: string; type: string; required: boolean }>
  plugins: Array<{ type: string; className: string; desc: string; enabled: boolean }>
}

/** 苍穹应用预览里「列表 / 实体 / 插件」页签的默认示例（采购订单） */
export const defaultCosmicMeta: CosmicMeta = {
  "listTitle": "采购订单",
  "searchPlaceholder": "搜索单据编号、供应商…",
  "columns": [
    "单据编号",
    "供应商",
    "采购组织",
    "采购员",
    "订单日期",
    "总金额",
    "单据状态"
  ],
  "rows": [
    [
      "PO-2026-0001",
      "深圳恒达科技有限公司",
      "采购一部",
      "张伟",
      "2026-07-28",
      "145,205.00",
      "已审核"
    ],
    [
      "PO-2026-0002",
      "上海博远电子有限公司",
      "采购二部",
      "李敏",
      "2026-07-25",
      "89,350.00",
      "已审核"
    ],
    [
      "PO-2026-0003",
      "广州华信科技有限公司",
      "采购一部",
      "张伟",
      "2026-07-22",
      "216,800.00",
      "已审核"
    ],
    [
      "PO-2026-0004",
      "北京天元科技有限公司",
      "采购三部",
      "王强",
      "2026-07-20",
      "56,320.00",
      "待审核"
    ],
    [
      "PO-2026-0005",
      "深圳恒达科技有限公司",
      "采购一部",
      "张伟",
      "2026-07-18",
      "34,260.00",
      "已审核"
    ],
    [
      "PO-2026-0006",
      "成都鼎盛科技有限公司",
      "采购二部",
      "李敏",
      "2026-07-15",
      "178,430.00",
      "待审核"
    ],
    [
      "PO-2026-0007",
      "杭州云天信息技术有限公司",
      "采购三部",
      "王强",
      "2026-07-12",
      "92,600.00",
      "已审核"
    ],
    [
      "PO-2026-0008",
      "苏州工业园区新科电子",
      "采购一部",
      "张伟",
      "2026-07-10",
      "67,850.00",
      "已审核"
    ],
    [
      "PO-2026-0009",
      "武汉长江通讯设备有限公司",
      "采购二部",
      "李敏",
      "2026-07-08",
      "123,400.00",
      "已审核"
    ],
    [
      "PO-2026-0010",
      "南京瑞丰科技有限公司",
      "采购三部",
      "王强",
      "2026-07-05",
      "45,780.00",
      "已关闭"
    ],
    [
      "PO-2026-0011",
      "深圳恒达科技有限公司",
      "采购一部",
      "张伟",
      "2026-07-03",
      "201,500.00",
      "已审核"
    ],
    [
      "PO-2026-0012",
      "厦门海天科技有限公司",
      "采购二部",
      "李敏",
      "2026-07-01",
      "78,920.00",
      "已审核"
    ]
  ],
  "entities": [
    {
      "name": "采购订单主表",
      "count": 12
    },
    {
      "name": "采购订单明细",
      "count": 8
    },
    {
      "name": "采购入库单",
      "count": 10
    },
    {
      "name": "供应商",
      "count": 6
    }
  ],
  "fields": [
    {
      "name": "单据编号",
      "key": "billno",
      "type": "单据编号",
      "required": true
    },
    {
      "name": "单据状态",
      "key": "billstatus",
      "type": "下拉列表",
      "required": true
    },
    {
      "name": "供应商",
      "key": "supplier",
      "type": "基础资料",
      "required": true
    },
    {
      "name": "采购组织",
      "key": "purchaseorg",
      "type": "基础资料",
      "required": true
    },
    {
      "name": "订单日期",
      "key": "orderdate",
      "type": "日期",
      "required": false
    },
    {
      "name": "币别",
      "key": "currency",
      "type": "基础资料",
      "required": false
    },
    {
      "name": "含税金额",
      "key": "totalamount",
      "type": "金额",
      "required": false
    },
    {
      "name": "采购员",
      "key": "purchaser",
      "type": "基础资料",
      "required": false
    },
    {
      "name": "备注",
      "key": "remark",
      "type": "文本",
      "required": false
    },
    {
      "name": "创建人",
      "key": "creator",
      "type": "基础资料",
      "required": false
    },
    {
      "name": "创建时间",
      "key": "createtime",
      "type": "日期时间",
      "required": false
    },
    {
      "name": "修改时间",
      "key": "modifytime",
      "type": "日期时间",
      "required": false
    }
  ],
  "plugins": [
    {
      "type": "表单插件",
      "className": "kd.bos.form.plugin.FormPlugin",
      "desc": "表单加载时初始化字段默认值",
      "enabled": true
    },
    {
      "type": "表单插件",
      "className": "kd.bos.form.plugin.ValidatePlugin",
      "desc": "提交前校验必填字段",
      "enabled": true
    },
    {
      "type": "表单插件",
      "className": "kd.bos.form.plugin.DataChangePlugin",
      "desc": "字段联动：供应商变更时刷新币别",
      "enabled": true
    },
    {
      "type": "列表插件",
      "className": "kd.bos.list.plugin.ListPlugin",
      "desc": "列表查询数据过滤",
      "enabled": true
    },
    {
      "type": "操作插件",
      "className": "kd.bos.entity.plugin.SubmitPlugin",
      "desc": "提交时更新单据状态",
      "enabled": true
    },
    {
      "type": "操作插件",
      "className": "kd.bos.entity.plugin.AuditPlugin",
      "desc": "审核时校验金额上限",
      "enabled": true
    },
    {
      "type": "调度插件",
      "className": "kd.bos.schedule.plugin.SyncPlugin",
      "desc": "定时同步外部采购数据",
      "enabled": false
    }
  ]
}

/** 设备巡检维修系统自己的元数据 */
export const equipmentCosmicMeta: CosmicMeta = {
  "listTitle": "维修记录",
  "searchPlaceholder": "搜索维修单号、设备…",
  "columns": [
    "维修单号",
    "设备",
    "故障现象",
    "故障原因",
    "更换零件",
    "维修人",
    "完成时间"
  ],
  "rows": [
    [
      "WX-2026-0912",
      "3 号注塑机",
      "温度波动 ±12℃",
      "热电偶接线松动",
      "热电偶 K 型",
      "王师傅",
      "2026-09-12"
    ],
    [
      "WX-2026-0920",
      "1 号空压机",
      "排气压力不足",
      "进气滤芯堵塞",
      "进气滤芯",
      "李师傅",
      "2026-09-20"
    ],
    [
      "WX-2026-0926",
      "5 号数控机床",
      "主轴异响",
      "润滑不足",
      "—",
      "王师傅",
      "2026-09-26"
    ],
    [
      "WX-2026-1002",
      "2 号注塑机",
      "射胶不稳",
      "止逆环磨损",
      "止逆环",
      "赵师傅",
      "2026-10-02"
    ],
    [
      "WX-2026-1004",
      "4 号冲床",
      "滑块异响",
      "导轨润滑不足",
      "—",
      "赵师傅",
      "2026-10-04"
    ]
  ],
  "entities": [
    {
      "name": "维修记录",
      "count": 8
    },
    {
      "name": "报修单",
      "count": 10
    },
    {
      "name": "设备档案",
      "count": 9
    },
    {
      "name": "维修组",
      "count": 4
    }
  ],
  "fields": [
    {
      "name": "维修单号",
      "key": "billno",
      "type": "单据编号",
      "required": true
    },
    {
      "name": "设备",
      "key": "equipment",
      "type": "基础资料",
      "required": true
    },
    {
      "name": "故障现象",
      "key": "symptom",
      "type": "多行文本",
      "required": true
    },
    {
      "name": "故障原因",
      "key": "cause",
      "type": "文本",
      "required": true
    },
    {
      "name": "更换零件",
      "key": "parts",
      "type": "基础资料",
      "required": false
    },
    {
      "name": "维修耗时",
      "key": "hours",
      "type": "小数",
      "required": false
    },
    {
      "name": "维修人",
      "key": "repairer",
      "type": "人员",
      "required": true
    },
    {
      "name": "完成时间",
      "key": "finishtime",
      "type": "日期时间",
      "required": true
    }
  ],
  "plugins": [
    {
      "type": "表单插件",
      "className": "kd.eqp.repair.RepairBillFormPlugin",
      "desc": "扫码带出设备档案，校验必填与照片",
      "enabled": true
    },
    {
      "type": "操作插件",
      "className": "kd.eqp.repair.RepairDispatchPlugin",
      "desc": "提交报修时按设备类型派给维修组",
      "enabled": true
    },
    {
      "type": "操作插件",
      "className": "kd.eqp.repair.RepairRecordAuditPlugin",
      "desc": "维修完成后写入设备履历",
      "enabled": true
    },
    {
      "type": "列表插件",
      "className": "kd.eqp.repair.RepairListPlugin",
      "desc": "按设备、类型、日期过滤维修记录",
      "enabled": true
    },
    {
      "type": "接口插件",
      "className": "kd.eqp.repair.QueryRepairRecordsApi",
      "desc": "只读查询维修记录，供智能体技能调用",
      "enabled": true
    }
  ]
}

export const apiRows: Array<{ method: string; path: string; desc: string; note: string }> = [
  {
    "method": "GET",
    "path": "/kapi/v2/scm/pm/purchaseorder",
    "desc": "查询采购订单列表",
    "note": "分页、按状态/供应商/日期过滤"
  },
  {
    "method": "GET",
    "path": "/kapi/v2/scm/pm/purchaseorder/{id}",
    "desc": "查询采购订单详情",
    "note": "返回单头 + 明细行"
  },
  {
    "method": "POST",
    "path": "/kapi/v2/scm/pm/purchaseorder",
    "desc": "新增采购订单",
    "note": "校验必填与金额上限"
  },
  {
    "method": "PUT",
    "path": "/kapi/v2/scm/pm/purchaseorder/{id}",
    "desc": "修改采购订单",
    "note": "仅草稿态可改"
  },
  {
    "method": "POST",
    "path": "/kapi/v2/scm/pm/purchaseorder/{id}/submit",
    "desc": "提交审批",
    "note": "触发三级审批流"
  },
  {
    "method": "POST",
    "path": "/kapi/v2/scm/pm/purchaseorder/{id}/audit",
    "desc": "审核",
    "note": "写入审核人与审核时间"
  },
  {
    "method": "POST",
    "path": "/kapi/v2/scm/pm/purchaseorder/{id}/unaudit",
    "desc": "反审核",
    "note": "下游已生成入库单时拒绝"
  },
  {
    "method": "POST",
    "path": "/kapi/v2/scm/pm/purchaseorder/{id}/push",
    "desc": "下推入库单",
    "note": "按未入库数量生成"
  },
  {
    "method": "DELETE",
    "path": "/kapi/v2/scm/pm/purchaseorder/{id}",
    "desc": "删除采购订单",
    "note": "仅草稿态可删"
  }
]

export interface McpTool {
  id: number
  act: string
  tool: string
  toolUniqueID: string
  desc: string
  status: "published" | "draft"
  actionType: string
  domain: string
  module: string
  sensitive: boolean
  serviceSource: string
  customParams: boolean
  errorLog: string
  precond: string
  postcond: string
  recovery: string
  targetAPI: string
}

export const mcpTools: McpTool[] = [
  {
    "id": 1,
    "act": "新增",
    "tool": "create_purchase_order",
    "toolUniqueID": "post_v2_scm_po_save",
    "desc": "新增采购订单，校验必填字段与金额上限",
    "status": "published",
    "actionType": "保存操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": false,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"用户具有采购订单新增权限\"},{\"condition\":\"供应商基础资料有效\"},{\"condition\":\"物料编码有效\"}]",
    "postcond": "[{\"effect\":\"保存后数据状态为暂存\",\"field\":\"billstatus\",\"to_value\":\"A\"}]",
    "recovery": "{\"open.100001\":{\"hint\":\"必填字段缺失\",\"cause\":\"请求参数校验失败\",\"suggestion\":\"请检查必填字段后重试\",\"auto_recoverable\":true}}",
    "targetAPI": "POST /kapi/v2/scm/pm/purchaseorder"
  },
  {
    "id": 2,
    "act": "提交",
    "tool": "submit_purchase_order",
    "toolUniqueID": "post_v2_scm_po_submit",
    "desc": "提交采购订单审批，触发三级审批流程",
    "status": "published",
    "actionType": "提交操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": false,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"订单状态为暂存\"},{\"condition\":\"金额>10万需总经理审批\"}]",
    "postcond": "[{\"effect\":\"订单状态变为审批中\",\"field\":\"billstatus\",\"to_value\":\"B\"},{\"effect\":\"通知相关审批人\"}]",
    "recovery": "{\"flow.1001\":{\"hint\":\"审批流程异常\",\"cause\":\"审批节点配置异常\",\"suggestion\":\"联系管理员检查审批流配置\",\"auto_recoverable\":false}}",
    "targetAPI": "POST /kapi/v2/scm/pm/purchaseorder/{id}/submit"
  },
  {
    "id": 3,
    "act": "审核",
    "tool": "audit_purchase_order",
    "toolUniqueID": "post_v2_scm_po_audit",
    "desc": "审核采购订单，写入审核人与审核时间",
    "status": "published",
    "actionType": "审核操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": true,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"订单状态为审批中\"},{\"condition\":\"当前用户具有审核权限\"}]",
    "postcond": "[{\"effect\":\"订单状态变为已审核\",\"field\":\"billstatus\",\"to_value\":\"C\"},{\"effect\":\"记录审核人与审核时间\"}]",
    "recovery": "{\"audit.1001\":{\"hint\":\"审核失败\",\"cause\":\"订单金额超出您的审批额度\",\"suggestion\":\"请联系上级审批人处理\",\"auto_recoverable\":false}}",
    "targetAPI": "POST /kapi/v2/scm/pm/purchaseorder/{id}/audit"
  },
  {
    "id": 4,
    "act": "反审核",
    "tool": "unaudit_purchase_order",
    "toolUniqueID": "post_v2_scm_po_unaudit",
    "desc": "反审核已审核的采购订单",
    "status": "published",
    "actionType": "反审核操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": true,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"订单状态为已审核\"},{\"condition\":\"下游未生成入库单\"}]",
    "postcond": "[{\"effect\":\"订单状态变为暂存\",\"field\":\"billstatus\",\"to_value\":\"A\"}]",
    "recovery": "{\"audit.1002\":{\"hint\":\"反审核拒绝\",\"cause\":\"下游已生成入库单\",\"suggestion\":\"请先删除入库单后重试\",\"auto_recoverable\":false}}",
    "targetAPI": "POST /kapi/v2/scm/pm/purchaseorder/{id}/unaudit"
  },
  {
    "id": 5,
    "act": "下推",
    "tool": "push_purchase_order",
    "toolUniqueID": "post_v2_scm_po_push",
    "desc": "按未入库数量下推生成入库单",
    "status": "draft",
    "actionType": "下推操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": false,
    "serviceSource": "自定义",
    "customParams": true,
    "errorLog": "2026-09-11 下推超时",
    "precond": "[{\"condition\":\"订单状态为已审核\"},{\"condition\":\"存在未入库数量\"}]",
    "postcond": "[{\"effect\":\"生成入库单草稿\"},{\"effect\":\"更新已下推数量\"}]",
    "recovery": "{\"push.1001\":{\"hint\":\"下推失败\",\"cause\":\"无可下推的未入库数量\",\"suggestion\":\"请检查采购数量\",\"auto_recoverable\":true}}",
    "targetAPI": "POST /kapi/v2/scm/pm/purchaseorder/{id}/push"
  },
  {
    "id": 6,
    "act": "删除",
    "tool": "delete_purchase_order",
    "toolUniqueID": "delete_v2_scm_po",
    "desc": "删除草稿态的采购订单",
    "status": "published",
    "actionType": "删除操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": true,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"订单状态为暂存\"}]",
    "postcond": "[{\"effect\":\"订单被物理删除不可恢复\"}]",
    "recovery": "{\"delete.1001\":{\"hint\":\"删除失败\",\"cause\":\"订单不是草稿态\",\"suggestion\":\"请先反审核后删除\",\"auto_recoverable\":false}}",
    "targetAPI": "DELETE /kapi/v2/scm/pm/purchaseorder/{id}"
  },
  {
    "id": 7,
    "act": "修改",
    "tool": "update_purchase_order",
    "toolUniqueID": "put_v2_scm_po_update",
    "desc": "修改草稿态的采购订单",
    "status": "published",
    "actionType": "保存操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": false,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"订单状态为暂存\"}]",
    "postcond": "[{\"effect\":\"更新订单数据\"},{\"effect\":\"记录修改日志\"}]",
    "recovery": "{\"update.1001\":{\"hint\":\"修改失败\",\"cause\":\"订单不是草稿态\",\"suggestion\":\"请先反审核后修改\",\"auto_recoverable\":false}}",
    "targetAPI": "PUT /kapi/v2/scm/pm/purchaseorder/{id}"
  },
  {
    "id": 8,
    "act": "查询列表",
    "tool": "query_purchase_order_list",
    "toolUniqueID": "get_v2_scm_po_list",
    "desc": "分页查询采购订单列表，支持按状态/供应商/日期过滤",
    "status": "published",
    "actionType": "查询操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": false,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"用户具有查询权限\"}]",
    "postcond": "[{\"effect\":\"返回采购订单分页列表\"}]",
    "recovery": "",
    "targetAPI": "GET /kapi/v2/scm/pm/purchaseorder"
  },
  {
    "id": 9,
    "act": "查询详情",
    "tool": "query_purchase_order_detail",
    "toolUniqueID": "get_v2_scm_po_detail",
    "desc": "查询采购订单详情，返回单头+明细行完整数据",
    "status": "published",
    "actionType": "查询操作",
    "domain": "采购管理",
    "module": "purchase_order",
    "sensitive": false,
    "serviceSource": "系统内置",
    "customParams": false,
    "errorLog": "—",
    "precond": "[{\"condition\":\"用户具有查询权限\"}]",
    "postcond": "[{\"effect\":\"返回订单完整数据\"}]",
    "recovery": "",
    "targetAPI": "GET /kapi/v2/scm/pm/purchaseorder/{id}"
  }
]
