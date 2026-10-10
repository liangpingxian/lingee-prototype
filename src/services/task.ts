import { collabTasks, currentStage, taskOpeningMessage, taskSessionTitle } from "@/mock/collab-seed"
import type { CollabTask, TaskSessionRef, TaskStage } from "@/mock/fixtures/collab-tasks"
import { latency } from "@/mock/latency"

/** 协作开发任务（mock）：增改都落在内存里，刷新页面恢复初始数据 */
let tasks: CollabTask[] = structuredClone(collabTasks)

const nextCode = () => `T${Math.max(...tasks.map((x) => Number(x.code.slice(1)) || 0)) + 1}`
const pad = (value: number) => String(value).padStart(2, "0")
const minuteNow = () => {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}
const find = (id: string) => tasks.find((x) => x.id === id)
const save = (id: string, patch: Partial<CollabTask>) => {
  tasks = tasks.map((x) => (x.id === id ? { ...x, ...patch } : x))
  return structuredClone(find(id))
}
const setStage = (plan: TaskStage[], stageId: string, status: string, extra?: Partial<TaskStage>) =>
  plan.map((stage) => (stage.id === stageId ? { ...stage, ...extra, status } : stage))

export { currentStage, taskOpeningMessage, taskSessionTitle }

export const taskService = {
  list: () => latency(tasks, 300),
  get: (id: string) => latency(find(id), 80),
  /** 同步读一份快照：回放引擎要在开始前按任务状态定剧本 */
  peek: (id: string) => structuredClone(find(id)),
  create(input: Omit<CollabTask, "id" | "code" | "createDate" | "stageId">) {
    const code = nextCode()
    const task: CollabTask = { ...input, id: code, code, createDate: new Date().toISOString().slice(0, 10), stageId: null }
    tasks = [task, ...tasks]
    return latency(task, 200)
  },
  update(id: string, patch: Partial<CollabTask>) {
    return latency(save(id, patch), 80)
  },

  /** 开始执行：待规划 / 待开始 → 执行中，当前阶段标为执行中，处理人换成这个阶段的负责人 */
  startStage(id: string) {
    const task = find(id)
    const stage = task && currentStage(task)
    if (!task || !stage || !["planned", "backlog"].includes(task.status)) return undefined
    return save(id, { status: "in_progress", stageId: stage.id, assignee: stage.assignee || task.assignee, plan: setStage(task.plan, stage.id, "running") })
  },

  /** 提交审核：执行中 → 待审核，生成这个阶段的产物等确认。同步执行，回放引擎在阶段做完时直接调 */
  submitStage(id: string) {
    const task = find(id)
    const stage = task && currentStage(task)
    if (!task || !stage || task.status !== "in_progress") return undefined
    const artifacts = (task.artifacts ?? []).filter((x) => x.stageId !== stage.id)
    return save(id, {
      status: "in_review",
      stageId: stage.id,
      plan: setStage(task.plan, stage.id, "review"),
      artifacts: [
        ...artifacts,
        {
          stageId: stage.id,
          title: `《${task.title}》${stage.title}产出`,
          summary: stage.desc || task.title,
          status: "待审核",
          date: minuteNow(),
          content: `# 《${task.title}》${stage.title}产出\n\n## 执行目标\n\n${stage.desc || task.desc || task.title}\n\n## 任务背景\n\n${task.desc || task.title}\n\n## 提交说明\n\n本阶段产物已生成，等待确认；确认后提交并流转到下一阶段。\n\n- 负责专家：${stage.assignee || "—"}\n- 所属项目：${task.project}`,
        },
      ],
    })
  },

  /**
   * 阶段确认：通过则这个阶段完成——还有下一阶段就流转过去（回到待开始，处理人换成下一阶段负责人），没有就整个任务完成；
   * 退回则回到执行中，等修改后重新提交。
   */
  reviewStage(id: string, approved: boolean) {
    const task = find(id)
    const stage = task && currentStage(task)
    if (!task || !stage || task.status !== "in_review") return undefined
    if (!approved) return save(id, { status: "in_progress", plan: setStage(task.plan, stage.id, "running") })
    const next = task.plan[task.plan.findIndex((x) => x.id === stage.id) + 1]
    return save(id, {
      status: next ? "backlog" : "done",
      stageId: next ? next.id : stage.id,
      assignee: next?.assignee || task.assignee,
      plan: setStage(task.plan, stage.id, "done"),
      artifacts: (task.artifacts ?? []).map((x) => (x.stageId === stage.id ? { ...x, status: "已通过" as const } : x)),
    })
  },

  /** 重试：已阻塞 → 执行中，清掉上次的失败记录，从当前阶段重新做 */
  retryStage(id: string) {
    const task = find(id)
    const stage = task && currentStage(task)
    if (!task || !stage || task.status !== "blocked") return undefined
    return save(id, { status: "in_progress", stageId: stage.id, plan: setStage(task.plan, stage.id, "running"), blockedRun: undefined })
  },

  /** 登记一个任务会话 */
  addSession(id: string, ref: Omit<TaskSessionRef, "startedAt">) {
    const task = find(id)
    if (!task) return undefined
    return save(id, { sessions: [{ ...ref, startedAt: minuteNow() }, ...(task.sessions ?? [])] })
  },
}
