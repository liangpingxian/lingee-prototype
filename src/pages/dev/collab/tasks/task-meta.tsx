import type { ReactNode } from "react"
import { DropdownMenu, Icon } from "@/ui"
import { cx } from "@/lib/cx"
import { TASK_PRIORITIES, TASK_STATUSES, type CollabTask, type TaskPriority, type TaskStatus } from "@/mock/fixtures/collab-tasks"
import { DynamicSkillIcon } from "@/features/dev-page/DynamicSkillIcon"

const COLORS: Record<string, string> = { gray: "var(--neutral-400)", orange: "#f08a24", green: "#08a040", red: "#e04a3a", blue: "var(--primary-600)" }

export const statusOf = (id: TaskStatus) => TASK_STATUSES.find((x) => x.id === id) ?? TASK_STATUSES[0]
export const priorityOf = (id: TaskPriority) => TASK_PRIORITIES.find((x) => x.id === id) ?? TASK_PRIORITIES[2]
export const colorOf = (name: string) => COLORS[name] ?? COLORS.gray

/** 状态圆环：填充多少表示进展（待开始空心、执行中半满、待审核大半、已完成打勾） */
export function StatusIcon(props: { status: TaskStatus; size?: number }) {
  const size = props.size ?? 14
  const color = colorOf(statusOf(props.status).color)
  const fill = { planned: 0, backlog: 0, in_progress: 0.5, in_review: 0.75, blocked: 0, done: 1, cancelled: 0 }[props.status]
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className="shrink-0" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray={props.status === "planned" ? "2 2" : undefined} />
      {fill > 0 && fill < 1 && <circle cx="7" cy="7" r="2" fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${fill * 12.57} 12.57`} transform="rotate(-90 7 7)" />}
      {fill === 1 && (
        <>
          <circle cx="7" cy="7" r="6" fill={color} />
          <path d="M4.2 7.2l1.9 1.9 3.7-4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {props.status === "blocked" && <path d="M3.5 10.5l7-7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />}
      {props.status === "cancelled" && <path d="M4.8 4.8l4.4 4.4M9.2 4.8l-4.4 4.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
  )
}

export function StatusLabel(props: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] text-[var(--neutral-800)]">
      <StatusIcon status={props.status} />
      {statusOf(props.status).name}
    </span>
  )
}

/** 优先级：三格信号条，紧急为红色感叹号 */
export function PriorityLabel(props: { priority: TaskPriority; bare?: boolean }) {
  const item = priorityOf(props.priority)
  const level = { urgent: 3, high: 3, medium: 2, low: 1 }[props.priority]
  const color = colorOf(item.color)
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] text-[var(--neutral-800)]">
      <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={2 + i * 4} y={9 - i * 3} width="2.4" height={3 + i * 3} rx="1" fill={i < level ? color : "var(--neutral-200)"} />
        ))}
      </svg>
      {!props.bare && item.name}
    </span>
  )
}

export function PersonChip(props: { name: string; size?: number }) {
  if (!props.name) return <span className="text-[13px] text-[var(--neutral-400)]">—</span>
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-[var(--neutral-800)]">
      <span className="shrink-0 overflow-hidden rounded-full">
        <DynamicSkillIcon name={props.name} size={props.size ?? 20} />
      </span>
      <span className="truncate">{props.name}</span>
    </span>
  )
}

export function TypeTag(props: { type: string }) {
  const bug = props.type === "缺陷"
  return (
    <span
      className={cx("inline-flex h-5 shrink-0 items-center rounded-[4px] px-1.5 text-[11px] font-[500]", bug ? "text-[#e04a3a]" : "text-[var(--primary-600)]")}
      style={{ background: bug ? "rgba(224,74,58,0.08)" : "var(--primary-500-6)" }}
    >
      {props.type}
    </span>
  )
}

/** 通用的小下拉：触发器由调用方给，选项带勾选 */
export function PickMenu<T extends string>(props: {
  value: T
  options: Array<{ value: T; label: ReactNode }>
  onChange: (value: T) => void
  children: ReactNode
  triggerClass?: string
  placement?: "bottom-start" | "bottom-end"
}) {
  return (
    <DropdownMenu placement={props.placement ?? "bottom-start"} gutter={4}>
      <DropdownMenu.Trigger className={props.triggerClass} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content style={{ minWidth: 150, maxHeight: 300, overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
          {props.options.map((option) => (
            <DropdownMenu.Item key={option.value} onSelect={() => props.onChange(option.value)} className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="min-w-0 truncate">{option.label}</span>
              {option.value === props.value && <Icon name="check" size="small" className="shrink-0 text-[var(--neutral-600)]" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}

export type GroupBy = "status" | "priority" | "project" | "assignee" | "none"
export type SortBy = "createDate" | "dueDate" | "priority"

const PRIORITY_RANK: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export function sortTasks(list: CollabTask[], sortBy: SortBy, desc: boolean) {
  const sign = desc ? -1 : 1
  return [...list].sort((a, b) => {
    if (sortBy === "priority") return (PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]) * sign
    return (a[sortBy] || "").localeCompare(b[sortBy] || "") * sign
  })
}

/** 按分组依据把任务分组；状态和优先级按固定顺序，其余按出现顺序 */
export function groupTasks(list: CollabTask[], groupBy: GroupBy, unassigned: string): Array<{ key: string; label: string; items: CollabTask[] }> {
  if (groupBy === "none") return [{ key: "all", label: "", items: list }]
  if (groupBy === "status") return TASK_STATUSES.map((s) => ({ key: s.id, label: s.name, items: list.filter((x) => x.status === s.id) })).filter((g) => g.items.length)
  if (groupBy === "priority") return TASK_PRIORITIES.map((p) => ({ key: p.id, label: p.name, items: list.filter((x) => x.priority === p.id) })).filter((g) => g.items.length)
  const keys = [...new Set(list.map((x) => x[groupBy]))]
  return keys.map((key) => ({ key: key || "-", label: key || unassigned, items: list.filter((x) => x[groupBy] === key) }))
}
