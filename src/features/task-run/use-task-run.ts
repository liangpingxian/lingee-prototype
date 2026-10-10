import { useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { showToast } from "@/ui"
import { useT } from "@/i18n"
import type { CollabTask, TaskSessionRef } from "@/mock/fixtures/collab-tasks"
import { sessionService } from "@/services"
import { currentStage, taskOpeningMessage, taskService, taskSessionTitle } from "@/services/task"
import { useLayout } from "@/stores/layout"
import { useSync } from "@/stores/sync"

export const TASKS_QUERY_KEY = ["collab-tasks"]

/**
 * 任务执行的几个动作，任务详情和会话里的阶段确认条共用：
 * 开始执行（建会话并发出开场指令）、重试、发起讨论、通过、退回修改、在同一个会话里接着做下一阶段。
 */
export function useTaskRun() {
  const t = useT()
  const navigate = useNavigate()
  const client = useQueryClient()
  const apply = useSync((s) => s.apply)

  /** 把服务层返回的任务写回列表缓存 */
  const put = (task?: CollabTask) => {
    if (task) client.setQueryData<CollabTask[]>(TASKS_QUERY_KEY, (items) => (items ?? []).map((x) => (x.id === task.id ? task : x)))
    return task
  }
  const refresh = () => client.invalidateQueries({ queryKey: TASKS_QUERY_KEY })

  /** 新建一个任务会话、登记到任务上、进入会话并发出第一句 */
  const openNewSession = async (task: CollabTask, origin: TaskSessionRef["origin"]) => {
    const projectId = useSync.getState().projects[0]?.id
    if (!projectId) return
    const stage = currentStage(task)
    const title = taskSessionTitle(task, origin, stage?.title)
    const session = await sessionService.create(projectId, title, { taskId: task.id })
    put(taskService.addSession(task.id, { sessionId: session.id, origin, stageId: stage?.id ?? null, title }))
    apply({ type: "session.updated", session })
    useSync.setState((s) => ({ messages: { ...s.messages, [session.id]: [] } }))
    useLayout.getState().expandGroup(projectId)
    navigate(`/p/${projectId}/session/${session.id}`)
    sessionService.prompt(session.id, taskOpeningMessage(task, origin, stage?.title), apply)
  }

  return {
    refresh,

    /** 开始执行当前阶段 */
    async start(task: CollabTask) {
      const started = put(taskService.startStage(task.id))
      if (!started) return showToast({ description: t("proto.task.run.cannotStart") })
      await openNewSession(started, "start")
    },

    /** 已阻塞的任务：排除问题后重新执行当前阶段 */
    async retry(task: CollabTask) {
      const retried = put(taskService.retryStage(task.id))
      if (!retried) return showToast({ description: t("proto.task.run.cannotStart") })
      await openNewSession(retried, "retry")
    },

    /** 不推进任务，只是就这个任务聊一聊 */
    discuss: (task: CollabTask) => openNewSession(task, "manual"),

    openSession(sessionId: string) {
      const session = useSync.getState().sessions.find((x) => x.id === sessionId)
      if (!session) return showToast({ description: t("proto.task.run.sessionGone") })
      navigate(`/p/${session.projectId}/session/${session.id}`)
    },

    /** 阶段确认：通过 */
    approve(task: CollabTask) {
      const next = put(taskService.reviewStage(task.id, true))
      if (!next) return
      showToast({ variant: "success", title: t(next.status === "done" ? "proto.task.run.done" : "proto.task.run.approved", { stage: currentStage(next)?.title ?? "" }) })
    },

    /** 阶段确认：退回修改。任务回到执行中，并在这个会话里让它按意见重做 */
    reject(task: CollabTask, sessionId: string) {
      const stage = currentStage(task)
      if (!put(taskService.reviewStage(task.id, false))) return
      sessionService.prompt(sessionId, taskOpeningMessage(task, "revise", stage?.title), apply)
    },

    /** 在当前会话里重试已阻塞的阶段 */
    retryHere(task: CollabTask, sessionId: string) {
      const retried = put(taskService.retryStage(task.id))
      if (!retried) return showToast({ description: t("proto.task.run.cannotStart") })
      sessionService.prompt(sessionId, taskOpeningMessage(retried, "retry", currentStage(retried)?.title), apply)
    },

    /** 上一阶段通过后，在同一个会话里接着执行下一阶段 */
    startNext(task: CollabTask, sessionId: string) {
      const started = put(taskService.startStage(task.id))
      if (!started) return showToast({ description: t("proto.task.run.cannotStart") })
      sessionService.prompt(sessionId, taskOpeningMessage(started, "start", currentStage(started)?.title), apply)
    },
  }
}
