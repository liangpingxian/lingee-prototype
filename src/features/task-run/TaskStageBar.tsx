import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { BrandButton, Icon } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { TASK_STATUSES } from "@/mock/fixtures/collab-tasks"
import { currentStage, taskService } from "@/services/task"
import { TASKS_QUERY_KEY, useTaskRun } from "./use-task-run"

/**
 * 任务执行会话里、输入框上方的阶段确认条：显示任务、当前阶段和进度，并给出这一步该做的动作。
 * - 待审核：通过 / 退回修改
 * - 上一阶段已通过、下一阶段待开始：开始下一阶段
 * - 已阻塞：重试
 * - 执行中 / 已完成：只显示状态
 */
export function TaskStageBar(props: { taskId: string; sessionId: string; working: boolean }) {
  const t = useT()
  const navigate = useNavigate()
  const run = useTaskRun()
  const query = useQuery({ queryKey: TASKS_QUERY_KEY, queryFn: taskService.list, staleTime: 0 })
  const task = query.data?.find((x) => x.id === props.taskId)

  // 回放结束时剧本会把任务推到「待审核」，这里重新取一次
  useEffect(() => {
    if (!props.working) void query.refetch()
  }, [props.working])

  if (!task) return null
  const stage = currentStage(task)
  const index = stage ? task.plan.findIndex((x) => x.id === stage.id) : -1
  const status = TASK_STATUSES.find((x) => x.id === task.status)
  const reviewing = task.status === "in_review" && !props.working
  const canStart = (task.status === "backlog" || task.status === "planned") && !!stage && !props.working

  return (
    // 输入框上方有一段向上的渐隐遮罩（盖住滚动到底部的消息），确认条要压在它上面，否则会被一起盖淡
    <div className="relative z-[2] mb-2 flex items-center gap-3 rounded-[16px] border border-[var(--neutral-100)] bg-[var(--surface-raised-stronger-non-alpha)] px-3 py-2">
      <button
        type="button"
        onClick={() => navigate("/dev/expert")}
        title={t("proto.task.run.viewTask")}
        className="flex min-w-0 flex-1 items-center gap-2 border-none bg-transparent p-0 text-left cursor-pointer"
      >
        <span className="shrink-0 font-mono text-[12px] text-[var(--neutral-500)]">{task.code}</span>
        <span className="min-w-0 truncate text-[13px] font-[500] text-[var(--neutral-900)]">{task.title}</span>
      </button>

      {task.plan.length > 0 && (
        <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
          {task.plan.map((item, i) => (
            <span
              key={item.id}
              title={item.title}
              className={cx("h-1.5 w-5 rounded-full", item.status === "done" || task.status === "done" ? "bg-[var(--primary-600)]" : i === index ? "bg-[var(--primary-600)] opacity-40" : "bg-[var(--neutral-100)]")}
            />
          ))}
        </div>
      )}
      <span className="shrink-0 text-[12px] text-[var(--neutral-600)]">
        {stage && task.status !== "done" ? `${stage.title} · ` : ""}
        {status?.name}
      </span>

      {reviewing && (
        <div className="flex shrink-0 items-center gap-2">
          <BrandButton variant="secondary" size="small" onClick={() => run.reject(task, props.sessionId)}>
            {t("proto.task.run.reject")}
          </BrandButton>
          <BrandButton variant="primary" size="small" onClick={() => run.approve(task)}>
            <Icon name="check-small" size="small" />
            {t("proto.task.run.approve")}
          </BrandButton>
        </div>
      )}
      {task.status === "blocked" && !props.working && (
        <BrandButton variant="primary" size="small" className="shrink-0" onClick={() => run.retryHere(task, props.sessionId)}>
          {t("proto.task.run.retry")}
        </BrandButton>
      )}
      {canStart && (
        <BrandButton variant="primary" size="small" className="shrink-0" onClick={() => run.startNext(task, props.sessionId)}>
          {t("proto.task.run.startStage", { stage: stage.title })}
        </BrandButton>
      )}
    </div>
  )
}
