// 专家与专家团的演示数据，由 lingee 原型的 features/expert/data.js 导出（内置目录）
export interface Expert {
  id: string
  name: string
  role: string
  by: string
  desc: string
  tags: string[]
  /** 工作方式：分析 / 设计 / 实现 … */
  modes: string[]
  /** 能力项及等级 */
  comp: Array<{ name: string; level: string }>
  /** 模型级别 */
  tier: string
  skills: Array<{ name: string; desc: string }>
  /** 常见触发词及说明 */
  cmds: Array<{ q: string; d: string }>
  /** 来源：官方内置 / 租户共享 / 个人 */
  source: "builtin" | "shared" | "personal"
}

export interface ExpertTeam {
  id: string
  name: string
  by: string
  desc: string
  domains: string[]
  leadId: string
  /** 开发流程：每条路径（功能开发 / 缺陷修复）按阶段列出负责的专家 */
  paths: Array<{ id: string; name: string; hint: string; stages: Array<{ id: string; name: string; desc: string; experts: string[] }> }>
  members: string[]
  cmds: Array<{ q: string; d: string }>
  source: "builtin" | "shared" | "personal"
}

export const experts: Expert[] = [
  {
    "id": "general-app-team-lead",
    "name": "通用应用团队负责人",
    "role": "通用应用团队负责人",
    "by": "Lingee 内置",
    "desc": "将已批准的应用设计拆分为边界清晰、可独立验证的实现切片",
    "tags": [
      "任务拆分",
      "纵向切片"
    ],
    "modes": [
      "分析",
      "设计",
      "规划",
      "集成",
      "评审",
      "恢复"
    ],
    "comp": [
      {
        "name": "任务编排",
        "level": "资深"
      },
      {
        "name": "交付编排",
        "level": "资深"
      },
      {
        "name": "集成收口",
        "level": "精通"
      },
      {
        "name": "边界与分层",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "通用应用任务编排 / General Application Task Orchestration",
        "desc": "Split an approved general application architecture-baseline.md into bounded, independently verifiable vertical-slice implementation tasks."
      },
      {
        "name": "通用应用交付协调",
        "desc": "Coordinate general application slices, evidence-based integration gates, and delivery closure."
      }
    ],
    "cmds": [
      {
        "q": "把已批准的设计拆成可独立验证的应用开发任务",
        "d": ""
      },
      {
        "q": "检查这份任务计划的边界、依赖与验证条件",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "general-app-product-expert",
    "name": "通用应用需求设计",
    "role": "通用应用需求设计",
    "by": "Lingee 内置",
    "desc": "将用户明确目标和已有产品背景转化为可执行的产品需求",
    "tags": [
      "需求设计",
      "产品基线",
      "需求验收"
    ],
    "modes": [
      "分析",
      "设计",
      "评审",
      "恢复"
    ],
    "comp": [
      {
        "name": "产品基线",
        "level": "资深"
      },
      {
        "name": "产品基线评审",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "需求设计闭合",
        "desc": "Convert explicit user goals and provided product context into one executable product requirements document with functional and acceptance coverage."
      },
      {
        "name": "需求设计评审",
        "desc": "Independently review a requirement design for journey coverage, functional behavior, and executable acceptance."
      }
    ],
    "cmds": [
      {
        "q": "把用户提供的产品背景和明确目标整理成产品需求",
        "d": ""
      },
      {
        "q": "为这个需求定义角色、旅程、规则和验收场景",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "general-app-architecture-expert",
    "name": "通用应用系统设计",
    "role": "通用应用系统设计",
    "by": "Lingee 内置",
    "desc": "读取产品需求和技术证据，将其转化为完整的技术系统设计，并对设计进行独立评审",
    "tags": [
      "系统设计",
      "整体技术方案",
      "分层架构",
      "模块边界",
      "公共模块复用",
      "设计评审"
    ],
    "modes": [
      "分析",
      "设计",
      "集成",
      "评审",
      "恢复"
    ],
    "comp": [
      {
        "name": "领域建模",
        "level": "资深"
      },
      {
        "name": "业务规则",
        "level": "资深"
      },
      {
        "name": "权限语义",
        "level": "精通"
      },
      {
        "name": "计算语义",
        "level": "精通"
      },
      {
        "name": "边界与分层",
        "level": "资深"
      },
      {
        "name": "契约与集成",
        "level": "资深"
      },
      {
        "name": "数据与迁移",
        "level": "精通"
      },
      {
        "name": "可靠性与可运维性",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "通用应用系统设计",
        "desc": "Turn a product requirements baseline into the smallest understandable and implementable system design."
      },
      {
        "name": "通用应用系统设计评审",
        "desc": "Independently review one combined business-and-technical system design without modifying the source artifact."
      }
    ],
    "cmds": [
      {
        "q": "把这些需求和来源事实转化为一份包含边界、契约、数据、权限和必要技术决策的系统设计",
        "d": ""
      },
      {
        "q": "评审这份系统设计中的边界、数据、权限、外部连接和兼容性风险",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "general-app-development-expert",
    "name": "通用应用开发",
    "role": "通用应用开发",
    "by": "Lingee 内置",
    "desc": "追踪根因并实现可维护的通用应用变更，形成可追溯验证",
    "tags": [
      "软件实现",
      "根因分析",
      "纵向切片"
    ],
    "modes": [
      "分析",
      "设计",
      "实现",
      "集成",
      "验证",
      "恢复"
    ],
    "comp": [
      {
        "name": "编码实现",
        "level": "资深"
      },
      {
        "name": "问题诊断",
        "level": "精通"
      },
      {
        "name": "工程集成",
        "level": "精通"
      },
      {
        "name": "纵向切片",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "通用应用实现",
        "desc": "Implement and verify scoped general-application changes across the complete affected call chain."
      },
      {
        "name": "通用应用诊断",
        "desc": "Diagnose general-application defects by reproducing current behavior, tracing the call chain, and proving the root cause before repair."
      },
      {
        "name": "通用应用纵向切片",
        "desc": "Deliver a real end-to-end vertical slice for a general application and validate its business, technical, and runtime boundaries."
      },
      {
        "name": "通用应用 Builder",
        "desc": "Implement a general-application module from the confirmed requirements and system design, using the global UI baseline and selected implementation recipes."
      }
    ],
    "cmds": [
      {
        "q": "追踪这项通用应用变更，实现最小完整修复并完成验证",
        "d": ""
      },
      {
        "q": "根据产品、领域和架构基线实现下一条可验证纵向切片",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "general-app-qa-expert",
    "name": "测试与代码审查",
    "role": "测试与代码审查",
    "by": "Lingee 内置",
    "desc": "面向通用应用制定并独立执行风险驱动的验证与契约驱动的代码审查，复现缺陷并维护质量基线",
    "tags": [
      "质量保障",
      "独立验证",
      "代码审查",
      "性能验证"
    ],
    "modes": [
      "分析",
      "设计",
      "评审",
      "验证",
      "测试编写",
      "性能测试",
      "代码审查"
    ],
    "comp": [
      {
        "name": "质量验证",
        "level": "资深"
      },
      {
        "name": "实现正确性",
        "level": "资深"
      },
      {
        "name": "回归分析",
        "level": "精通"
      },
      {
        "name": "测试构建",
        "level": "精通"
      },
      {
        "name": "缺陷复现",
        "level": "精通"
      },
      {
        "name": "性能与容量",
        "level": "精通"
      },
      {
        "name": "契约设计",
        "level": "精通"
      },
      {
        "name": "并发与提交模型",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "通用应用质量验证",
        "desc": "Independently plan and execute risk-based verification for a general application, reproduce failures, and issue traceable quality evidence."
      },
      {
        "name": "测试计划",
        "desc": "Convert application acceptance, invariants, risk labels, and change impact into an executable verification plan and test matrix."
      },
      {
        "name": "缺陷复现",
        "desc": "Reproduce general-application defects with a minimal replayable case, classify the broken contract, and define repair acceptance evidence."
      },
      {
        "name": "性能与容量验证",
        "desc": "Generate and execute authorized k6-based performance verification for general applications, including load scenarios, resource conditions, and comparison evidence."
      },
      {
        "name": "安全验证",
        "desc": "Plan and execute authorized security verification for general applications, covering authentication, authorization, tenant isolation, input handling, secret management, and dependency exposure."
      },
      {
        "name": "Contract-driven code review",
        "desc": "Review the contract, implementation, and existing test evidence, recording each reviewed acceptance criterion with its code location and basis."
      }
    ],
    "cmds": [
      {
        "q": "为这个通用应用制定并执行风险驱动的验证计划",
        "d": ""
      },
      {
        "q": "对照契约审查这次实现，输出可执行的评审问题",
        "d": ""
      },
      {
        "q": "复现这个缺陷并输出基于证据的验证报告",
        "d": ""
      },
      {
        "q": "生成并执行已授权的性能验证矩阵",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "agent-development-expert",
    "name": "智能体开发",
    "role": "智能体开发",
    "by": "Lingee 内置",
    "desc": "在 Lingee 项目中开发智能体、技能和业务组件：配置智能体并绑定技能与知识，创建和校验金蝶业务技能，构建可嵌入对话的交互组件",
    "tags": [
      "智能体开发",
      "技能开发",
      "业务组件开发",
      "MCP 工具",
      "交互组件"
    ],
    "modes": [
      "分析",
      "设计",
      "实现",
      "集成",
      "验证"
    ],
    "comp": [
      {
        "name": "智能体开发",
        "level": "资深"
      },
      {
        "name": "技能开发",
        "level": "精通"
      },
      {
        "name": "业务组件开发",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "智能体开发",
        "desc": "创建、编辑和管理智能体（assistant.json），为智能体配置角色、绑定项目技能与企业知识目录，并在交付前完成配置校验。"
      },
      {
        "name": "技能开发",
        "desc": "创建、编辑、微调和校验技能，支持金蝶 ERP 业务技能（MCP）与通用技能，并可查询当前可用的 MCP 工具。"
      },
      {
        "name": "业务组件开发",
        "desc": "创建、编辑、导入和打包 MCP Apps 业务组件（看板、报表、表单、确认卡片等对话内交互卡片），并修复组件关联的 MCP 工具。"
      }
    ],
    "cmds": [
      {
        "q": "创建一个应收账款催收智能体，绑定项目里的催收相关技能",
        "d": ""
      },
      {
        "q": "创建一个查询供应商付款情况的金蝶业务技能",
        "d": ""
      },
      {
        "q": "做一个展示销售订单执行进度的业务组件卡片",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-api-engineer",
    "name": "苍穹 API 开发",
    "role": "苍穹 API 开发",
    "by": "Lingee 内置",
    "desc": "负责苍穹零代码 API、Custom API 与 API 扩展插件的设计和交付",
    "tags": [
      "API",
      "OpenAPI"
    ],
    "modes": [
      "分析",
      "设计",
      "实现",
      "集成",
      "评审",
      "验证",
      "恢复"
    ],
    "comp": [
      {
        "name": "零代码接口",
        "level": "资深"
      },
      {
        "name": "自定义接口",
        "level": "精通"
      },
      {
        "name": "接口扩展",
        "level": "精通"
      },
      {
        "name": "接口验证",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "app build api",
        "desc": "Lingee Build 智能体定义中配置的技能。"
      }
    ],
    "cmds": [
      {
        "q": "设计并交付苍穹 API",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-architect",
    "name": "苍穹架构师",
    "role": "苍穹架构师",
    "by": "Lingee 内置",
    "desc": "在已验证的平台边界内设计苍穹元数据模型与运行时扩展",
    "tags": [
      "软件架构",
      "可靠性"
    ],
    "modes": [
      "分析",
      "设计",
      "集成",
      "评审",
      "恢复"
    ],
    "comp": [
      {
        "name": "系统设计",
        "level": "资深"
      },
      {
        "name": "可靠性设计",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "苍穹架构设计",
        "desc": "Produce the Cosmic architecture design consumed by development task orchestration."
      }
    ],
    "cmds": [
      {
        "q": "评审架构并闭合主要风险",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-code-reviewer",
    "name": "苍穹代码审查",
    "role": "苍穹代码审查",
    "by": "Lingee 内置",
    "desc": "独立审查苍穹元数据、实现正确性、回归风险和交付契约",
    "tags": [
      "代码审查",
      "交付契约"
    ],
    "modes": [
      "评审",
      "验证"
    ],
    "comp": [
      {
        "name": "实现正确性",
        "level": "资深"
      },
      {
        "name": "文件系统安全",
        "level": "精通"
      },
      {
        "name": "并发与提交模型",
        "level": "资深"
      },
      {
        "name": "契约设计",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "Contract-driven code review",
        "desc": "Lingee Build 智能体定义中配置的技能。"
      }
    ],
    "cmds": [],
    "source": "builtin"
  },
  {
    "id": "cosmic-metadata-expert",
    "name": "苍穹元数据",
    "role": "苍穹元数据",
    "by": "Lingee 内置",
    "desc": "依据 app-build 契约完成苍穹应用元数据建模、修改和验证",
    "tags": [
      "元数据",
      "低代码"
    ],
    "modes": [
      "分析",
      "设计",
      "实现",
      "集成",
      "评审",
      "验证",
      "恢复"
    ],
    "comp": [
      {
        "name": "元数据建模",
        "level": "资深"
      },
      {
        "name": "元数据修改",
        "level": "资深"
      },
      {
        "name": "元数据界面",
        "level": "精通"
      },
      {
        "name": "元数据接口",
        "level": "精通"
      },
      {
        "name": "元数据验证",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "cosmic metadata delivery",
        "desc": "Deliver Cosmic metadata modeling and modification through verified app-build contracts."
      },
      {
        "name": "苍穹应用构建",
        "desc": "Lingee Build 内置能力。"
      }
    ],
    "cmds": [
      {
        "q": "使用已验证元数据建模或修改苍穹表单",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-product-manager",
    "name": "苍穹产品经理",
    "role": "苍穹产品经理",
    "by": "Lingee 内置",
    "desc": "将苍穹应用目标转化为理解元数据边界且可验证的需求",
    "tags": [
      "需求分析",
      "验收设计"
    ],
    "modes": [
      "分析",
      "设计",
      "评审"
    ],
    "comp": [
      {
        "name": "需求定义",
        "level": "资深"
      },
      {
        "name": "验收设计",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "苍穹需求分析",
        "desc": "Load cosmic-requirements-spec for full Cosmic requirement analysis methodology and produce requirements.md as the stage artifact."
      }
    ],
    "cmds": [
      {
        "q": "将这个目标整理为有范围的验收条件",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-qa-engineer",
    "name": "苍穹质量工程师",
    "role": "苍穹质量工程师",
    "by": "Lingee 内置",
    "desc": "独立验证苍穹元数据、运行时行为、回归影响与交付风险",
    "tags": [
      "质量保障",
      "独立验证"
    ],
    "modes": [
      "分析",
      "设计",
      "评审",
      "验证"
    ],
    "comp": [
      {
        "name": "质量验证",
        "level": "资深"
      },
      {
        "name": "回归分析",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "质量验证",
        "desc": "Independently verify software acceptance, regressions, failure behavior, and residual risk."
      }
    ],
    "cmds": [
      {
        "q": "制定并执行风险驱动的验证计划",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-software-engineer",
    "name": "苍穹软件工程师",
    "role": "苍穹软件工程师",
    "by": "Lingee 内置",
    "desc": "在苍穹平台边界内实现经过验证的元数据与运行时变更",
    "tags": [
      "软件实现",
      "系统集成"
    ],
    "modes": [
      "分析",
      "设计",
      "实现",
      "集成",
      "验证",
      "恢复"
    ],
    "comp": [
      {
        "name": "编码实现",
        "level": "精通"
      },
      {
        "name": "工程集成",
        "level": "精通"
      },
      {
        "name": "插件实现",
        "level": "精通"
      },
      {
        "name": "插件代码生成",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "软件实现",
        "desc": "Implement scoped software changes using repository conventions and behavior-focused verification."
      }
    ],
    "cmds": [
      {
        "q": "实现这项有边界的变更并端到端验证",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-team-lead",
    "name": "苍穹团队负责人",
    "role": "苍穹团队负责人",
    "by": "Lingee 内置",
    "desc": "编排苍穹交付从元数据建模到 API 发布的智能体分工",
    "tags": [
      "交付管理",
      "开发任务编排"
    ],
    "modes": [
      "分析",
      "设计",
      "规划",
      "集成",
      "评审",
      "恢复"
    ],
    "comp": [
      {
        "name": "交付编排",
        "level": "资深"
      },
      {
        "name": "任务编排",
        "level": "资深"
      },
      {
        "name": "元数据建模",
        "level": "了解"
      },
      {
        "name": "零代码接口",
        "level": "了解"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "苍穹开发任务编排",
        "desc": "Plan Cosmic application implementation with expert-team task decomposition by Cosmic concern type."
      },
      {
        "name": "苍穹实施协调",
        "desc": "Dispatch and reconcile an approved Cosmic development task plan without replacing its task DAG."
      }
    ],
    "cmds": [
      {
        "q": "按智能体分工编排苍穹实施任务",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "cosmic-ui-designer",
    "name": "苍穹 UI 设计师",
    "role": "苍穹 UI 设计师",
    "by": "Lingee 内置",
    "desc": "基于需求为苍穹应用表单和页面创建视觉原型",
    "tags": [
      "原型设计",
      "界面设计"
    ],
    "modes": [
      "分析",
      "设计",
      "评审"
    ],
    "comp": [
      {
        "name": "界面原型",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "苍穹 UI 原型设计",
        "desc": "Load kingdee-design for visual prototype creation based on Cosmic requirements."
      }
    ],
    "cmds": [
      {
        "q": "为这个苍穹表单创建视觉原型",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "kwc-frontend-engineer",
    "name": "KWC 前端工程师",
    "role": "KWC 前端工程师",
    "by": "Lingee 内置",
    "desc": "开发苍穹应用 KWC 自定义页面、组件、页面元数据和 KingScript 脚本控制器",
    "tags": [
      "KWC",
      "前端"
    ],
    "modes": [
      "分析",
      "设计",
      "实现",
      "集成",
      "验证",
      "恢复"
    ],
    "comp": [
      {
        "name": "前端工程初始化",
        "level": "精通"
      },
      {
        "name": "前端组件开发",
        "level": "精通"
      },
      {
        "name": "前端页面开发",
        "level": "精通"
      },
      {
        "name": "前端控制器开发",
        "level": "精通"
      },
      {
        "name": "前端部署",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "kd frontend development",
        "desc": "Lingee Build 智能体定义中配置的技能。"
      }
    ],
    "cmds": [
      {
        "q": "为这个苍穹应用开发一个 KWC 自定义页面",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "code-reviewer",
    "name": "代码审查",
    "role": "代码审查",
    "by": "Lingee 内置",
    "desc": "独立审查实现正确性、回归风险和交付契约",
    "tags": [
      "代码审查",
      "正确性"
    ],
    "modes": [
      "评审",
      "验证"
    ],
    "comp": [
      {
        "name": "实现正确性",
        "level": "资深"
      },
      {
        "name": "文件系统安全",
        "level": "精通"
      },
      {
        "name": "并发与提交模型",
        "level": "资深"
      },
      {
        "name": "契约设计",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "Contract-driven code review",
        "desc": "Lingee Build 智能体定义中配置的技能。"
      }
    ],
    "cmds": [],
    "source": "builtin"
  },
  {
    "id": "read-only-analyst",
    "name": "只读分析",
    "role": "只读分析",
    "by": "Lingee 内置",
    "desc": "在不修改工作区的前提下分析软件与代码。",
    "tags": [
      "源码分析",
      "只读评审"
    ],
    "modes": [
      "分析",
      "评审",
      "验证"
    ],
    "comp": [
      {
        "name": "源码分析",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "Repository analysis",
        "desc": "Lingee Build 智能体定义中配置的技能。"
      }
    ],
    "cmds": [],
    "source": "builtin"
  },
  {
    "id": "security-reviewer",
    "name": "安全评审",
    "role": "安全评审",
    "by": "Lingee 内置",
    "desc": "独立评审应用安全风险。",
    "tags": [
      "安全评审",
      "风险识别"
    ],
    "modes": [
      "评审",
      "验证"
    ],
    "comp": [
      {
        "name": "应用安全",
        "level": "资深"
      },
      {
        "name": "文件系统安全",
        "level": "精通"
      },
      {
        "name": "并发与提交模型",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "Adversarial security review",
        "desc": "Lingee Build 智能体定义中配置的技能。"
      }
    ],
    "cmds": [],
    "source": "builtin"
  },
  {
    "id": "software-architect",
    "name": "软件架构师",
    "role": "软件架构师",
    "by": "Lingee 内置",
    "desc": "设计可演进的系统边界、合同、数据流与失败处理",
    "tags": [
      "软件架构",
      "可靠性"
    ],
    "modes": [
      "分析",
      "设计",
      "集成",
      "评审",
      "恢复"
    ],
    "comp": [
      {
        "name": "系统设计",
        "level": "资深"
      },
      {
        "name": "可靠性设计",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "架构设计",
        "desc": "Design and review software boundaries, contracts, data flows, migration, and resilience."
      }
    ],
    "cmds": [
      {
        "q": "评审架构并闭合主要风险",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "software-engineer",
    "name": "软件工程师",
    "role": "软件工程师",
    "by": "Lingee 内置",
    "desc": "实现可维护的软件变更并完成针对性验证",
    "tags": [
      "软件实现",
      "系统集成"
    ],
    "modes": [
      "分析",
      "设计",
      "实现",
      "集成",
      "验证",
      "恢复"
    ],
    "comp": [
      {
        "name": "编码实现",
        "level": "精通"
      },
      {
        "name": "工程集成",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "软件实现",
        "desc": "Implement scoped software changes using repository conventions and behavior-focused verification."
      }
    ],
    "cmds": [
      {
        "q": "实现这项有边界的变更并端到端验证",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "software-product-manager",
    "name": "软件产品经理",
    "role": "软件产品经理",
    "by": "Lingee 内置",
    "desc": "将用户目标转化为有优先级且可观察的软件需求",
    "tags": [
      "需求分析",
      "验收设计"
    ],
    "modes": [
      "分析",
      "设计",
      "评审"
    ],
    "comp": [
      {
        "name": "需求定义",
        "level": "资深"
      },
      {
        "name": "验收设计",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "需求闭合",
        "desc": "Convert software product goals into scoped workflows and observable acceptance criteria."
      }
    ],
    "cmds": [
      {
        "q": "将这个目标整理为有范围的验收条件",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "software-qa-engineer",
    "name": "软件测试工程师",
    "role": "软件测试工程师",
    "by": "Lingee 内置",
    "desc": "独立验证验收行为、回归影响与交付风险",
    "tags": [
      "质量保障",
      "独立验证"
    ],
    "modes": [
      "分析",
      "设计",
      "评审",
      "验证"
    ],
    "comp": [
      {
        "name": "质量验证",
        "level": "资深"
      },
      {
        "name": "回归分析",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "质量验证",
        "desc": "Independently verify software acceptance, regressions, failure behavior, and residual risk."
      }
    ],
    "cmds": [
      {
        "q": "制定并执行风险驱动的验证计划",
        "d": ""
      }
    ],
    "source": "builtin"
  },
  {
    "id": "software-team-lead",
    "name": "软件团队负责人",
    "role": "软件团队负责人",
    "by": "Lingee 内置",
    "desc": "协调范围、分工、集成、风险与交付闭环",
    "tags": [
      "交付管理",
      "团队协调"
    ],
    "modes": [
      "分析",
      "设计",
      "规划",
      "集成",
      "评审",
      "验证",
      "恢复"
    ],
    "comp": [
      {
        "name": "任务编排",
        "level": "资深"
      },
      {
        "name": "交付编排",
        "level": "资深"
      },
      {
        "name": "集成收口",
        "level": "精通"
      }
    ],
    "tier": "auto",
    "skills": [
      {
        "name": "交付协调",
        "desc": "Coordinate bounded software delivery assignments and evidence-based integration gates."
      },
      {
        "name": "开发任务编排 / Development Task Orchestration",
        "desc": "Author a bounded implementation task DAG for general software delivery."
      }
    ],
    "cmds": [
      {
        "q": "协调这项工作从范围确认到验证闭环",
        "d": ""
      }
    ],
    "source": "builtin"
  }
]

export const expertTeams: ExpertTeam[] = [
  {
    "id": "cosmic-app-dev",
    "name": "苍穹应用开发专家团",
    "by": "Lingee 内置",
    "desc": "面向苍穹应用完整交付，覆盖需求、表单、流程、报表、二开插件、接口、智能体开发与质量验证。",
    "domains": [
      "苍穹应用",
      "表单",
      "工作流",
      "报表",
      "集成"
    ],
    "leadId": "cosmic-team-lead",
    "paths": [
      {
        "id": "feature",
        "name": "功能开发",
        "hint": "新需求、功能建设",
        "stages": [
          {
            "id": "requirements",
            "name": "需求分析",
            "desc": "明确目标、范围与验收条件",
            "experts": [
              "cosmic-product-manager"
            ]
          },
          {
            "id": "implementation",
            "name": "开发实现",
            "desc": "实现功能并完成针对性验证",
            "experts": [
              "cosmic-software-engineer",
              "kwc-frontend-engineer"
            ]
          },
          {
            "id": "verification",
            "name": "测试验证",
            "desc": "独立验证验收行为与回归影响",
            "experts": [
              "cosmic-code-reviewer",
              "cosmic-qa-engineer"
            ]
          }
        ]
      },
      {
        "id": "bug",
        "name": "缺陷修复",
        "hint": "错误、异常、回归问题",
        "stages": [
          {
            "id": "implementation",
            "name": "开发实现",
            "desc": "定位根因，修改代码并完成针对性自测",
            "experts": [
              "cosmic-software-engineer",
              "kwc-frontend-engineer"
            ]
          },
          {
            "id": "verification",
            "name": "测试验证",
            "desc": "验证问题解决且相关功能未受影响",
            "experts": [
              "cosmic-code-reviewer",
              "cosmic-qa-engineer"
            ]
          }
        ]
      }
    ],
    "members": [
      "cosmic-team-lead",
      "cosmic-product-manager",
      "cosmic-architect",
      "cosmic-metadata-expert",
      "cosmic-software-engineer",
      "cosmic-api-engineer",
      "kwc-frontend-engineer",
      "cosmic-ui-designer",
      "cosmic-qa-engineer",
      "cosmic-code-reviewer",
      "agent-development-expert"
    ],
    "cmds": [
      {
        "q": "帮我在苍穹上做一套请假申请，从单据到审批",
        "d": "表单、流程、报表、接口一体化交付"
      },
      {
        "q": "这个业务要在苍穹落地，帮我出方案并实现",
        "d": "先出需求规格，再按依赖拆分实现与验证"
      },
      {
        "q": "苍穹单据、流程和报表都要改，帮我排一下",
        "d": "按依赖顺序编排配置、二开与验证任务"
      }
    ],
    "source": "builtin"
  },
  {
    "id": "general-app-dev",
    "name": "通用应用开发专家团",
    "by": "Lingee 内置",
    "desc": "面向 Web 与通用业务应用，覆盖产品、架构、体验、前后端实现、测试与集成交付。",
    "domains": [
      "通用应用",
      "Web",
      "前端",
      "产品设计"
    ],
    "leadId": "general-app-team-lead",
    "paths": [
      {
        "id": "feature",
        "name": "功能开发",
        "hint": "新需求、功能建设",
        "stages": [
          {
            "id": "requirements",
            "name": "需求分析",
            "desc": "明确目标、范围与验收条件",
            "experts": [
              "general-app-product-expert"
            ]
          },
          {
            "id": "design",
            "name": "系统设计",
            "desc": "设计系统边界、接口与数据流",
            "experts": [
              "general-app-architecture-expert"
            ]
          },
          {
            "id": "implementation",
            "name": "开发实现",
            "desc": "实现功能并完成针对性验证",
            "experts": [
              "general-app-development-expert"
            ]
          },
          {
            "id": "verification",
            "name": "测试验证",
            "desc": "独立验证验收行为与回归影响",
            "experts": [
              "general-app-qa-expert"
            ]
          }
        ]
      },
      {
        "id": "bug",
        "name": "缺陷修复",
        "hint": "错误、异常、回归问题",
        "stages": [
          {
            "id": "implementation",
            "name": "开发实现",
            "desc": "定位根因，修改代码并完成针对性自测",
            "experts": [
              "general-app-development-expert"
            ]
          },
          {
            "id": "verification",
            "name": "测试验证",
            "desc": "验证问题解决且相关功能未受影响",
            "experts": [
              "general-app-qa-expert"
            ]
          }
        ]
      }
    ],
    "members": [
      "general-app-team-lead",
      "general-app-product-expert",
      "general-app-architecture-expert",
      "general-app-development-expert",
      "general-app-qa-expert",
      "agent-development-expert"
    ],
    "cmds": [
      {
        "q": "帮我把购物车支持优惠券做成能上线的功能",
        "d": "从需求、设计、实现到验收走完整闭环"
      },
      {
        "q": "做一个业务管理 Web 应用",
        "d": "产品、架构、体验与工程协同交付"
      },
      {
        "q": "按这份设计稿把页面实现出来并走查一遍",
        "d": "实现页面并完成设计与质量验证"
      }
    ],
    "source": "builtin"
  }
]

export const MODEL_TIERS = [
  {
    "id": "auto",
    "label": "自动",
    "desc": "按任务复杂度自动选择"
  },
  {
    "id": "fast",
    "label": "快速",
    "desc": "响应最快，适合简单明确的任务"
  },
  {
    "id": "expert",
    "label": "专家",
    "desc": "更强推理，适合复杂任务"
  },
  {
    "id": "deep",
    "label": "深度",
    "desc": "深度思考，适合高难度任务"
  }
]
