import { createPortal } from "react-dom"
import { BrandButton, Dialog, Icon, Markdown, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { TASK_PRIORITIES, TASK_STATUSES, type CollabTask } from "@/mock/fixtures/collab-tasks"
import { currentStage } from "@/services/task"
import { useTaskRun } from "@/features/task-run/use-task-run"
import { PersonChip, PickMenu, PriorityLabel, StatusLabel, TypeTag } from "./task-meta"

const ROW = "flex min-h-8 items-center gap-3 text-[13px]"
const KEY = "w-[72px] shrink-0 text-[var(--neutral-500)]"
const VALUE_BUTTON = "flex h-7 items-center gap-1 rounded-[8px] border-none bg-transparent px-1.5 -ml-1.5 cursor-pointer transition-colors hover:bg-[var(--neutral-50)]"

/** 执行计划里某个阶段的状态：已完成 / 当前（执行中或待审核）/ 未开始 */
function stageState(task: CollabTask, index: number): "done" | "current" | "pending" {
  const stage = task.plan[index]
  if (task.status === "done" || stage.status === "done") return "done"
  // 还没开始的任务（待规划 / 待开始）没有「当前阶段」
  if (task.status === "planned" || task.status === "backlog" || task.status === "cancelled") return "pending"
  const current = task.plan.findIndex((x) => x.id === currentStage(task)?.id)
  return index < current ? "done" : index === current ? "current" : "pending"
}

/**
 * 任务详情（右侧滑出）：标题、描述、属性（状态 / 优先级可直接改）、执行计划时间线、阶段产出、我的会话。
 * 底部是这一步该做的动作：开始执行 / 继续会话 / 通过 · 退回修改。
 * 执行计划是任务按专家团的开发流程拆出的阶段，高亮当前执行到哪一步。
 * 主内容区带 transform，fixed 定位会被它截住，所以挂到 body 上。
 */
export function TaskDetailPanel(props: { task: CollabTask; onClose: () => void; onUpdate: (patch: Partial<CollabTask>) => void }) {
  const t = useT()
  const { task } = props
  const run = useTaskRun()
  const dialog = useDialog()
  const stage = currentStage(task)
  const sessions = task.sessions ?? []
  const artifacts = task.artifacts ?? []
  const startable = (task.status === "planned" || task.status === "backlog") && !!stage
  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onClick={props.onClose} />
      {/* 同步来的样式里把 aside 整个隐藏了，这里用 div */}
      <div
        role="complementary"
        aria-label={task.title}
        className="fixed inset-y-0 right-0 z-50 flex w-[520px] max-w-[92vw] flex-col border-l border-[var(--neutral-100)] bg-[var(--surface-raised-stronger-non-alpha)] shadow-[-12px_0_32px_rgba(0,0,0,0.08)]"
      >
        <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--neutral-100)] px-5">
          <span className="font-mono text-[12px] text-[var(--neutral-500)]">{task.code}</span>
          <TypeTag type={task.issueType} />
          <span className="flex-1" />
          <button
            type="button"
            onClick={props.onClose}
            aria-label={t("common.close")}
            className="flex size-7 items-center justify-center rounded-[8px] border-none bg-transparent text-[var(--neutral-600)] cursor-pointer hover:bg-[var(--neutral-50)]"
          >
            <Icon name="close" size="small" />
          </button>
        </div>
        <div className="min-h-0 flex-1 select-text overflow-y-auto px-5 py-4">
          <h3 className="m-0 text-[18px] font-[600] leading-[28px] text-[var(--neutral-900)]">{task.title}</h3>
          {task.desc && <p className="mt-2 mb-0 whitespace-pre-wrap text-[14px] leading-[22px] text-[var(--neutral-700)]">{task.desc}</p>}

          <div className="mt-5 flex flex-col gap-1 border-t border-[var(--neutral-100)] pt-4">
            <div className={ROW}>
              <span className={KEY}>{t("proto.task.field.status")}</span>
              <PickMenu
                value={task.status}
                onChange={(status) => props.onUpdate({ status })}
                options={TASK_STATUSES.map((s) => ({ value: s.id, label: <StatusLabel status={s.id} /> }))}
                triggerClass={VALUE_BUTTON}
              >
                <StatusLabel status={task.status} />
                <Icon name="chevron-down-16" size="small" className="text-[var(--neutral-400)]" />
              </PickMenu>
            </div>
            <div className={ROW}>
              <span className={KEY}>{t("proto.task.field.priority")}</span>
              <PickMenu
                value={task.priority}
                onChange={(priority) => props.onUpdate({ priority })}
                options={TASK_PRIORITIES.map((p) => ({ value: p.id, label: <PriorityLabel priority={p.id} /> }))}
                triggerClass={VALUE_BUTTON}
              >
                <PriorityLabel priority={task.priority} />
                <Icon name="chevron-down-16" size="small" className="text-[var(--neutral-400)]" />
              </PickMenu>
            </div>
            <div className={ROW}>
              <span className={KEY}>{t("proto.task.field.assignee")}</span>
              <PersonChip name={task.assignee} />
            </div>
            <div className={ROW}>
              <span className={KEY}>{t("proto.task.field.project")}</span>
              <span className="text-[var(--neutral-800)]">{task.project}</span>
            </div>
            <div className={ROW}>
              <span className={KEY}>{t("proto.task.field.createdBy")}</span>
              <PersonChip name={task.createdBy} />
            </div>
            <div className={ROW}>
              <span className={KEY}>{t("proto.task.field.createDate")}</span>
              <span className="text-[var(--neutral-800)]">{task.createDate || "—"}</span>
            </div>
            <div className={ROW}>
              <span className={KEY}>{t("proto.task.field.dueDate")}</span>
              <span className="text-[var(--neutral-800)]">{task.dueDate || "—"}</span>
            </div>
          </div>

          {task.status === "blocked" && task.blockedRun && (
            <div className="mt-5 rounded-[12px] border border-[rgba(224,74,58,0.24)] bg-[rgba(224,74,58,0.04)] p-3">
              <div className="flex items-center gap-2 text-[13px] font-[600] text-[#e04a3a]">
                <Icon name="warning-circle" size="small" />
                {t("proto.task.blocked.title")}
                <span className="flex-1" />
                <span className="font-[400] text-[12px] text-[var(--neutral-500)]">
                  {task.blockedRun.failedAt} · {task.blockedRun.duration}
                </span>
              </div>
              <ol className="mt-2 mb-0 flex list-decimal flex-col gap-1 pl-5 text-[12px] leading-[18px] text-[var(--neutral-700)]">
                {task.blockedRun.steps.map(([name, detail]) => (
                  <li key={name}>
                    <span className="font-[500] text-[var(--neutral-900)]">{name}</span>：{detail}
                  </li>
                ))}
              </ol>
              <div className="mt-2 text-[13px] leading-[20px] text-[var(--neutral-900)]">{task.blockedRun.reason}</div>
              <div className="mt-1 text-[12px] leading-[18px] text-[var(--neutral-600)]">{task.blockedRun.next}</div>
            </div>
          )}

          <div className="mt-5 border-t border-[var(--neutral-100)] pt-4">
            <div className="mb-3 text-[13px] font-[600] text-[var(--neutral-900)]">{t("proto.task.plan")}</div>
            {task.plan.length === 0 ? (
              <div className="text-[13px] text-[var(--neutral-400)]">{t("proto.task.plan.empty")}</div>
            ) : (
              <ol className="m-0 list-none p-0">
                {task.plan.map((stage, index) => {
                  const state = stageState(task, index)
                  return (
                    <li key={stage.id} className="relative flex gap-3 pb-4 last:pb-0">
                      {index < task.plan.length - 1 && <span className={cx("absolute left-[9px] top-5 bottom-0 w-px", state === "done" ? "bg-[var(--primary-600)]" : "bg-[var(--neutral-100)]")} />}
                      <span
                        className={cx(
                          "z-[1] mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-[600]",
                          state === "done" && "bg-[var(--primary-600)] text-[var(--white-100)]",
                          state === "current" && "border-2 border-[var(--primary-600)] bg-[var(--surface-raised-stronger-non-alpha)] text-[var(--primary-600)]",
                          state === "pending" && "bg-[var(--neutral-100)] text-[var(--neutral-500)]",
                        )}
                      >
                        {state === "done" ? <Icon name="check-small" size="small" /> : index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cx("text-[14px] leading-[24px]", state === "pending" ? "text-[var(--neutral-600)]" : "font-[500] text-[var(--neutral-900)]")}>{stage.title}</span>
                          {state === "current" && <span className="rounded-[4px] bg-[var(--primary-500-6)] px-1.5 text-[11px] leading-[18px] text-[var(--primary-600)]">{t(task.status === "in_review" ? "proto.task.plan.review" : "proto.task.plan.current")}</span>}
                          <span className="flex-1" />
                          <PersonChip name={stage.assignee} size={18} />
                        </div>
                        {stage.desc && <div className="text-[12px] leading-[18px] text-[var(--neutral-500)]">{stage.desc}</div>}
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>
          {artifacts.length > 0 && (
            <div className="mt-5 border-t border-[var(--neutral-100)] pt-4">
              <div className="mb-3 text-[13px] font-[600] text-[var(--neutral-900)]">{t("proto.task.artifacts")}</div>
              <div className="flex flex-col gap-2">
                {artifacts.map((item) => (
                  <button
                    key={item.stageId}
                    type="button"
                    onClick={() =>
                      dialog.show(() => (
                        <Dialog fit title={item.title} className="!w-[720px] !max-w-[90vw] overflow-hidden">
                          <div className="select-text overflow-y-auto px-6 pb-6" style={{ maxHeight: "70vh" }}>
                            <Markdown text={item.content} />
                          </div>
                        </Dialog>
                      ))
                    }
                    className="flex items-center gap-3 rounded-[12px] border border-[var(--neutral-100)] bg-transparent px-3 py-2 text-left cursor-pointer transition-colors hover:bg-[var(--neutral-50)]"
                  >
                    <Icon name="edit-doc-16" size="small" className="shrink-0 text-[var(--neutral-500)]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] text-[var(--neutral-900)]">{item.title}</div>
                      <div className="truncate text-[12px] text-[var(--neutral-500)]">{item.date}</div>
                    </div>
                    <span className={cx("shrink-0 text-[12px]", item.status === "已通过" ? "text-[#08a040]" : "text-[#c06010]")}>{item.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 border-t border-[var(--neutral-100)] pt-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] font-[600] text-[var(--neutral-900)]">{t("proto.task.sessions")}</span>
              <button
                type="button"
                onClick={() => void run.discuss(task)}
                className="flex h-7 items-center gap-1 rounded-[8px] border-none bg-transparent px-1.5 text-[12px] text-[var(--primary-600)] cursor-pointer hover:bg-[var(--neutral-50)]"
              >
                <Icon name="plus-16" size="small" />
                {t("proto.task.sessions.new")}
              </button>
            </div>
            {sessions.length === 0 ? (
              <div className="text-[13px] text-[var(--neutral-400)]">{t("proto.task.sessions.empty")}</div>
            ) : (
              <div className="flex flex-col gap-1">
                {sessions.map((item) => (
                  <button
                    key={item.sessionId}
                    type="button"
                    onClick={() => run.openSession(item.sessionId)}
                    className="flex items-center gap-3 rounded-[10px] border-none bg-transparent px-2 py-1.5 -mx-2 text-left cursor-pointer hover:bg-[var(--neutral-50)]"
                  >
                    <Icon name="speech-bubble" size="small" className="shrink-0 text-[var(--neutral-500)]" />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--neutral-800)]">{item.title}</span>
                    <span className="shrink-0 text-[12px] text-[var(--neutral-500)]">
                      {t(`proto.task.sessions.origin.${item.origin}`)} · {item.startedAt.slice(5)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {(startable || ["in_progress", "in_review", "blocked"].includes(task.status)) && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--neutral-100)] px-5 py-3">
            {startable && (
              <BrandButton variant="primary" size="normal" onClick={() => void run.start(task)}>
                {t("proto.task.run.startStage", { stage: stage.title })}
              </BrandButton>
            )}
            {task.status === "blocked" && (
              <BrandButton variant="primary" size="normal" onClick={() => void run.retry(task)}>
                {t("proto.task.run.retry")}
              </BrandButton>
            )}
            {task.status === "in_progress" && sessions[0] && (
              <BrandButton variant="primary" size="normal" onClick={() => run.openSession(sessions[0].sessionId)}>
                {t("proto.task.run.continue")}
              </BrandButton>
            )}
            {task.status === "in_review" && (
              <>
                {sessions[0] && (
                  <BrandButton variant="secondary" size="normal" onClick={() => run.openSession(sessions[0].sessionId)}>
                    {t("proto.task.run.continue")}
                  </BrandButton>
                )}
                <BrandButton variant="primary" size="normal" onClick={() => run.approve(task)}>
                  {t("proto.task.run.approve")}
                </BrandButton>
              </>
            )}
          </div>
        )}
      </div>
    </>,
    document.body,
  )
}
