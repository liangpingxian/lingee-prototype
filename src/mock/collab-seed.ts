import { createDevApp } from "./fixtures/apps"
import { tasks as rawTasks, type BlockedRun, type CollabTask, type TaskSessionRef, type TaskStage } from "./fixtures/collab-tasks"
import { experts, expertTeams } from "./fixtures/experts"
import type { Message, Project, Session } from "./types"

/**
 * 协作开发的初始数据：给任务补齐执行计划，并生成 lingee 原型里的历史会话。
 * 生成规则照 lingee 的 features/tasks-v2/task-sessions.js（按任务确定性生成）、blocked-runs.js，
 * 以及侧栏里写死的三组历史对话（开发 Workspace、工作 · 历史对话、管理 · 提问）。
 */

/** 没有执行计划的任务按默认专家团的开发流程补一份：需求走「功能开发」，缺陷走「缺陷修复」 */
function defaultPlan(task: CollabTask): TaskStage[] {
  const team = expertTeams.find((x) => x.id === "general-app-dev") ?? expertTeams[0]
  const path = team?.paths.find((x) => x.id === (task.issueType === "缺陷" ? "bug" : "feature")) ?? team?.paths[0]
  return (path?.stages ?? []).map((stage) => ({
    id: stage.id,
    title: stage.name,
    desc: stage.desc,
    assignee: experts.find((x) => x.id === stage.experts[0])?.name ?? "",
    status: task.status === "done" ? "done" : "pending",
  }))
}

/** 任务当前所在的阶段：优先取记录的阶段，否则取第一个没完成的 */
export const currentStage = (task: CollabTask) => task.plan.find((x) => x.id === task.stageId) ?? task.plan.find((x) => x.status !== "done")

/** 会话的开场指令：详情里登记的会话和聊天里的第一句用同一句话 */
export function taskOpeningMessage(task: CollabTask, origin: TaskSessionRef["origin"], stageName?: string) {
  if (origin === "revise") return `退回修改「${stageName}」阶段，请按审核意见调整后重新提交。`
  if (origin === "retry") return `重试执行「${stageName}」阶段，沿用上次的输入与配置。`
  if (origin === "start") return `执行「${stageName || "当前节点"}」：任务「${task.title}」；${task.desc.length > 60 ? `${task.desc.slice(0, 60)}…` : task.desc}`
  return `关于任务「${task.title}」，我想先确认几个问题。`
}

export function taskSessionTitle(task: CollabTask, origin: TaskSessionRef["origin"], stageName?: string) {
  if (origin === "revise") return `修改${stageName}阶段产出`
  if (origin === "retry") return `重试${stageName}阶段`
  if (origin === "start") return `执行${stageName || "任务"}：${task.title}`
  return `讨论任务：${task.title}`
}

/** 已阻塞任务上一次执行失败的记录（步骤和失败原因均为演示数据） */
const BLOCKED_RUNS: Record<string, Omit<BlockedRun, "failedAt">> = {
  "4": { duration: "2分18秒", reason: "ERP 测试账套缺少期初余额，借贷平衡校验未通过。", next: "请运维补齐测试账套后重新执行增量拉取。", steps: [["读取 ERP 总账接口定义", "已确认多账套、币种及科目编码映射。"], ["拉取测试账套数据", "已取得总账明细，发现期初余额记录缺失。"], ["执行落库前校验", "借贷余额不平，停止同步以避免写入错误报表数据。"]] },
  "16": { duration: "1分42秒", reason: "集团统一身份认证中心的权限接口尚未开放联调。", next: "等待对方接口排期确认后重试角色和部门权限校验。", steps: [["解析权限矩阵", "已整理高管、主管、业务员的可见范围。"], ["准备行列级权限规则", "已标记成本价与利润率等敏感列。"], ["连接统一身份认证中心", "联调接口尚不可用，无法验证角色与部门映射。"]] },
  "25": { duration: "2分06秒", reason: "e签宝测试密钥仍在法务审批，签署接口无法完成鉴权。", next: "获取测试密钥并配置回调地址后重新发起联调。", steps: [["生成合同签署流程", "已整理 PDF 上传、签署方和签署位置参数。"], ["校验回调与归档规则", "已准备签署状态回调和归档字段。"], ["调用测试环境鉴权", "缺少已批准的测试密钥，执行中止。"]] },
  "40": { duration: "1分57秒", reason: "SLA 规则引擎依赖的调度集群尚未完成扩容审批。", next: "调度集群扩容完成后重试倒计时和超时升级验证。", steps: [["加载 SLA 时效配置", "已匹配四档优先级的响应与解决时效。"], ["检查预警与升级节点", "已定义提前 15 分钟预警及超时升级规则。"], ["启动定时调度验证", "集群容量不足且扩容审批未完成，未启动定时任务。"]] },
  "46": { duration: "1分34秒", reason: "HR 系统开放 API 尚未提供，无法抽取花名册和考勤数据。", next: "待 HR API 开通后重试字段映射与首次全量抽取。", steps: [["检查 ETL 字段映射", "已整理花名册、考勤、薪酬和绩效字段。"], ["准备清洗与异常队列", "已定义空值、越界和编码不匹配规则。"], ["连接 HR 开放 API", "接口排期未到，抽取阶段暂停。"]] },
  "63": { duration: "3分12秒", reason: "任务列表按状态排序时复现偶发乱序，回归验证未通过。", next: "请检查排序稳定性与状态变更后的列表重排，再运行回归测试。", steps: [["构造多状态任务样本", "已覆盖待开始、执行中、待审核和阻塞状态。"], ["切换状态排序并刷新", "发现同状态任务顺序偶发变化。"], ["运行回归断言", "排序结果与预期不一致，保留复现记录并标记失败。"]] },
  "1304": { duration: "2分36秒", reason: "企业微信应用尚未开通「发送应用消息」权限，催办提醒无法推送。", next: "请管理员在企业微信后台为问卷应用开通消息权限后重新执行。", steps: [["统计回收进度", "已按部门汇总应答率，识别 6 个低于 60% 的部门。"], ["生成催办名单", "已生成 214 位未作答人员的提醒名单。"], ["调用企业微信消息接口", "接口返回无权限（errcode 48002），停止推送，避免重复提醒。"]] },
}

/** lingee 侧栏里写死的三组历史对话 */
const WORKSPACE_HISTORY = ["采购订单管理应用开发", "采购入库单流程配置", "供应商评级逻辑设计"]
const WORK_HISTORY = [
  "科技风灵基一动轻松工作图", "PPT制作需求对话", "PPT制作对话", "查询费用报销单", "Build与苍穹平台交付汇报", "AI平台应用规划", "国外出差报销流程", "国外出差打车费无法开票处理",
  "查询待办任务", "解答问题", "查询固定资产列表", "查询已办任务", "查询名下资产", "查询本期科目余额表", "查询年假天数",
]
const MANAGE_HISTORY = [
  "这周有哪些经营异常我要看", "上月费用超支主要在哪些科目", "把昨天的经营会结论整理成纪要", "华东区库存周转现在什么水平",
  "一上为什么超了 1.2 个点", "分档压降怎么分才不吵架", "人力 +5.2% 的构成拆解", "去年 78 天到底耗在哪",
  "铜材涨价对 Q3 目标的影响", "长协锁价还是分批建仓", "第三家供应商值不值得引入",
]
/** lingee 里这两组对话只有标题，没有保存内容 */
const NO_CONTENT = "这条历史对话的内容没有保存，可以在这里继续提问。"

const MIN = 60_000
const at = (text: string) => new Date(text.replace(" ", "T")).getTime()
const slug = (index: number) => `prj_lingee_${index}`

function build() {
  const tasks: CollabTask[] = structuredClone(rawTasks).map((task) => ({ ...task, plan: task.plan.length ? task.plan : defaultPlan(task) }))
  const projects: Project[] = []
  const sessions: Session[] = []
  const messages: Message[] = []
  let seq = 0

  const projectId = (name: string) => {
    const found = projects.find((x) => x.name === name)
    if (found) return found.id
    const project: Project = { id: slug(projects.length + 1), name, worktree: `/Users/liangpx/lingee/${name}`, git: false }
    projects.push(project)
    return project.id
  }

  /** 写入一个会话和它的对话；turns 里 user / agent 交替出现，连续的 agent 合成一条回复 */
  const addSession = (project: string, title: string, started: number, last: number, turns: Array<["user" | "agent", string]>, extra?: Partial<Session>) => {
    const id = `ses_lingee_${++seq}`
    sessions.push({ id, projectId: project, title, time: { created: started, updated: last }, status: "idle", ...extra })
    let reply: Message | undefined
    turns.forEach(([role, text], index) => {
      const part = { id: `${id}_p${index}`, type: "text" as const, text }
      if (role === "agent" && reply) return void reply.parts.push(part)
      const message: Message = { id: `${id}_m${index}`, sessionId: id, role: role === "user" ? "user" : "assistant", time: { created: started, completed: last }, parts: [part], ...(role === "agent" ? { agent: "build" } : {}) }
      messages.push(message)
      reply = role === "agent" ? message : undefined
    })
    return id
  }

  // 一、任务会话：按任务所在项目归组
  for (const task of tasks) {
    if (!["in_progress", "in_review", "blocked", "done"].includes(task.status)) continue
    const numeric = Number(task.id)
    const day = task.createDate
    const stage = currentStage(task) ?? task.plan[0]
    const stageName = stage?.title ?? ""
    const project = projectId(task.project)
    const refs: TaskSessionRef[] = []
    const record = (sessionId: string, origin: TaskSessionRef["origin"], title: string, startedAt: string, withStage = true) =>
      refs.unshift({ sessionId, origin, stageId: withStage ? (stage?.id ?? null) : null, title, startedAt })

    if (numeric % 2 === 0) {
      const title = "梳理任务范围与验收标准"
      const id = addSession(project, title, at(`${day} 09:48`), at(`${day} 10:06`), [
        ["user", `先帮我梳理一下「${task.title}」的范围和验收标准。`],
        ["agent", "已按任务描述整理出范围边界与验收标准，并标出了需要你确认的依赖项。"],
        ["user", "可以，按这个范围开始执行。"],
      ], { taskId: task.id })
      record(id, "manual", title, `${day} 09:48`, false)
    }

    const active = task.status === "in_progress"
    const progress =
      task.status === "done" ? "全部阶段已完成，交付物已归档到任务详情。"
      : task.status === "in_review" ? `「${stageName}」阶段产出已生成，等待你确认。`
      : task.status === "blocked" ? `「${stageName}」阶段执行中断，详情见异常会话。`
      : `正在执行「${stageName}」阶段，完成后会通知你审核。`
    const startTitle = taskSessionTitle(task, "start", stageName)
    const startId = addSession(project, startTitle, at(`${day} 10:20`), active ? Date.now() - ((numeric % 40) + 6) * MIN : at(`${day} 11:02`), [
      ["user", taskOpeningMessage(task, "start")],
      ["agent", `已接收任务，按「${task.plan.map((x) => x.title).join(" → ")}」推进。`],
      ["agent", progress],
    ], { taskId: task.id, unread: task.status === "in_review" })
    record(startId, "start", startTitle, `${day} 10:20`)

    if (task.status === "in_review" && numeric % 3 === 0 && task.plan.findIndex((x) => x.id === stage?.id) > 0) {
      const title = taskSessionTitle(task, "revise", stageName)
      const id = addSession(project, title, at(`${day} 15:10`), at(`${day} 15:36`), [
        ["user", taskOpeningMessage(task, "revise", stageName)],
        ["agent", `已根据审核意见补充遗漏的边界场景，并重新提交「${stageName}」阶段产出。`],
      ], { taskId: task.id })
      record(id, "revise", title, `${day} 15:10`)
    }

    const run = task.status === "blocked" ? BLOCKED_RUNS[task.id] : undefined
    if (run) {
      task.blockedRun = { ...run, failedAt: `${day} 14:12` }
      const title = `${stageName}阶段执行异常`
      const id = addSession(project, title, at(`${day} 14:12`), at(`${day} 14:12`), [
        ["user", `继续执行「${stageName}」阶段。`],
        ["agent", `${run.steps.map(([name, detail], index) => `${index + 1}. **${name}**：${detail}`).join("\n")}\n\n**执行中断**：${run.reason}\n\n**建议**：${run.next}`],
      ], { taskId: task.id, status: "error" })
      record(id, "start", title, `${day} 14:12`)
    }
    task.sessions = refs
  }

  // 二、三组只有标题的历史对话
  const now = Date.now()
  const plain = (project: string, titles: string[], reply: (title: string) => string, ask: (title: string) => string) =>
    titles.forEach((title, index) => {
      const time = now - (index * 7 + 3) * 60 * MIN
      addSession(project, title, time - 4 * MIN, time, [["user", ask(title)], ["agent", reply(title)]])
    })
  plain(projectId("工作 · 历史对话"), WORK_HISTORY, () => NO_CONTENT, (title) => title)
  plain(projectId("管理 · 历史提问"), MANAGE_HISTORY, () => NO_CONTENT, (title) => title)

  return { tasks, projects, sessions, messages }
}

const built = build()

/** 开发板块 Workspace 下的三条历史会话：放进原型已有的 workspace 项目 */
export function workspaceHistory(projectId: string) {
  const sessions: Session[] = []
  const messages: Message[] = []
  WORKSPACE_HISTORY.forEach((title, index) => {
    const id = `ses_lingee_ws_${index + 1}`
    const time = Date.now() - (index * 26 + 2) * 60 * MIN
    sessions.push({ id, projectId, title, time: { created: time - 6 * MIN, updated: time }, status: "idle" })
    messages.push(
      { id: `${id}_u`, sessionId: id, role: "user", time: { created: time - 6 * MIN, completed: time - 6 * MIN }, parts: [{ id: `${id}_up`, type: "text", text: `帮我开发${title}功能` }] },
      { id: `${id}_a`, sessionId: id, role: "assistant", agent: "build", time: { created: time - 6 * MIN, completed: time }, parts: [{ id: `${id}_ap`, type: "text", text: createDevApp(id, title, "", "cosmic").reply }] },
    )
  })
  return { sessions, messages }
}

export const collabTasks = built.tasks
export const historyProjects = built.projects
export const historySessions = built.sessions
export const historyMessages = built.messages
