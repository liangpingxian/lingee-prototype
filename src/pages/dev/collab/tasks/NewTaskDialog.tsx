import { useEffect, useRef, useState, type ReactNode } from "react"
import { Dialog, Icon, showToast, useDialog } from "@/ui"
import { useT } from "@/i18n"
import { TASK_PRIORITIES, type CollabTask, type TaskPriority } from "@/mock/fixtures/collab-tasks"
import { experts, expertTeams } from "@/mock/fixtures/experts"
import { useSync } from "@/stores/sync"
import { PickMenu, PriorityLabel } from "./task-meta"

const FIELD =
  "flex h-10 w-full items-center rounded-[12px] border border-[var(--input-border-color)] bg-[var(--input-bg)] px-3 text-[14px] leading-[22px] text-[var(--neutral-800)] outline-none transition-[border-color] duration-150 hover:border-[var(--neutral-300)] focus:border-[var(--primary-600)]"
const SELECT = `${FIELD} justify-between gap-2 cursor-pointer`

function Field(props: { label: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${props.className ?? ""}`}>
      <span className="text-[13px] text-[var(--neutral-600)]">
        {props.label}
        {props.required && <span className="ml-0.5 text-[#e04a3a]">*</span>}
      </span>
      {props.children}
    </div>
  )
}

/**
 * 新建任务弹窗：标题、描述、所属项目、任务类型、优先级、截止日期、专家团。
 * 选了专家团，执行计划就按它的开发流程生成（需求走「功能开发」，缺陷走「缺陷修复」），每个阶段带上负责的专家。
 */
export function NewTaskDialog(props: { projects: string[]; onCreate: (task: Omit<CollabTask, "id" | "code" | "createDate" | "stageId">) => void }) {
  const t = useT()
  const dialog = useDialog()
  const me = useSync((s) => s.user?.displayName ?? "")
  const input = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [project, setProject] = useState(props.projects[0] ?? "")
  const [issueType, setIssueType] = useState("需求")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [dueDate, setDueDate] = useState("")
  const [teamId, setTeamId] = useState(expertTeams[0]?.id ?? "")
  const team = expertTeams.find((x) => x.id === teamId)

  useEffect(() => {
    const timer = setTimeout(() => input.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  const submit = () => {
    if (!title.trim()) {
      showToast({ description: t("proto.task.new.titleRequired") })
      return input.current?.focus()
    }
    const path = team?.paths.find((x) => x.id === (issueType === "缺陷" ? "bug" : "feature")) ?? team?.paths[0]
    props.onCreate({
      title: title.trim(),
      desc: desc.trim(),
      status: "backlog",
      priority,
      assignee: me,
      createdBy: me,
      project,
      issueType,
      dueDate,
      plan: (path?.stages ?? []).map((stage) => ({
        id: stage.id,
        title: stage.name,
        desc: stage.desc,
        assignee: experts.find((x) => x.id === stage.experts[0])?.name ?? "",
        status: "pending",
      })),
    })
    dialog.close()
  }

  const chevron = <Icon name="chevron-down-16" size="small" className="shrink-0 text-[var(--neutral-500)]" />

  return (
    <Dialog fit className="dialog-rename-reset">
      <div className="flex w-[560px] max-w-[92vw] flex-col gap-4 rounded-[24px] bg-[var(--rename-bg)] p-5">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-[600] leading-[30px] text-[var(--neutral-800)]">{t("proto.task.new.title")}</span>
          <button
            type="button"
            onClick={dialog.close}
            aria-label="Close"
            className="-m-1.5 flex size-7 items-center justify-center rounded-lg border-none bg-transparent p-0 text-[var(--icon-fill)] cursor-pointer transition-colors hover:bg-[var(--icon-bg-hover)]"
          >
            <Icon name="close" size="small" />
          </button>
        </div>

        <Field label={t("proto.task.field.title")} required>
          <input ref={input} value={title} onChange={(e) => setTitle(e.currentTarget.value)} placeholder={t("proto.task.new.titlePlaceholder")} className={FIELD} />
        </Field>
        <Field label={t("proto.task.field.desc")}>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.currentTarget.value)}
            rows={3}
            placeholder={t("proto.task.new.descPlaceholder")}
            className={`${FIELD} h-auto resize-none py-2`}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("proto.task.field.project")}>
            <PickMenu value={project} onChange={setProject} options={props.projects.map((value) => ({ value, label: value }))} triggerClass={SELECT}>
              <span className="truncate">{project}</span>
              {chevron}
            </PickMenu>
          </Field>
          <Field label={t("proto.task.field.type")}>
            <PickMenu value={issueType} onChange={setIssueType} options={["需求", "缺陷"].map((value) => ({ value, label: value }))} triggerClass={SELECT}>
              <span>{issueType}</span>
              {chevron}
            </PickMenu>
          </Field>
          <Field label={t("proto.task.field.priority")}>
            <PickMenu
              value={priority}
              onChange={setPriority}
              options={TASK_PRIORITIES.map((p) => ({ value: p.id, label: <PriorityLabel priority={p.id} /> }))}
              triggerClass={SELECT}
            >
              <PriorityLabel priority={priority} />
              {chevron}
            </PickMenu>
          </Field>
          <Field label={t("proto.task.field.dueDate")}>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.currentTarget.value)} className={FIELD} />
          </Field>
          <Field label={t("proto.collab.tab.teams")} className="col-span-2">
            <PickMenu value={teamId} onChange={setTeamId} options={expertTeams.map((x) => ({ value: x.id, label: x.name }))} triggerClass={SELECT}>
              <span className="truncate">{team?.name}</span>
              {chevron}
            </PickMenu>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={dialog.close}
            className="flex shrink-0 items-center justify-center rounded-lg border-none bg-transparent px-4 py-2 text-sm font-normal leading-[22px] !text-[var(--button-text-text)] cursor-pointer transition-colors hover:bg-[var(--icon-bg-hover)]"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex shrink-0 items-center justify-center rounded-lg border-none !bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-medium leading-5 text-[var(--button-primary-text)] cursor-pointer hover:!bg-[var(--button-primary-bg-hover)]"
          >
            {t("proto.task.new.submit")}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
