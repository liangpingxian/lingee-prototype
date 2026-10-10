import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { DropdownMenu, Empty, Icon, Tooltip, showToast, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { TASK_PRIORITIES, TASK_STATUSES, type CollabTask } from "@/mock/fixtures/collab-tasks"
import { taskService } from "@/services/task"
import { useSync } from "@/stores/sync"
import { TASKS_QUERY_KEY } from "@/features/task-run/use-task-run"
import { NewTaskDialog } from "./NewTaskDialog"
import { TaskDetailPanel } from "./TaskDetailPanel"
import { PersonChip, PickMenu, PriorityLabel, StatusIcon, StatusLabel, TypeTag, groupTasks, sortTasks, type GroupBy, type SortBy } from "./task-meta"

type View = "all" | "mine" | "in_progress"
type Layout = "list" | "board"
/** 筛选条件：每个字段选中的值，空数组表示不限 */
type Filters = Record<"status" | "priority" | "issueType" | "project", string[]>

const VIEWS: View[] = ["all", "mine", "in_progress"]
const GROUPS: GroupBy[] = ["status", "priority", "project", "assignee", "none"]
const SORTS: SortBy[] = ["createDate", "dueDate", "priority"]
const EMPTY_FILTERS: Filters = { status: [], priority: [], issueType: [], project: [] }
const TOOL_BUTTON =
  "flex h-8 items-center gap-1.5 rounded-[10px] border border-[var(--neutral-100)] bg-transparent px-2.5 text-[13px] text-[var(--neutral-700)] cursor-pointer transition-colors hover:bg-[var(--neutral-50)]"
const TH = "sticky top-0 z-[1] bg-[var(--background-page,var(--neutral-0))] px-3 py-2 text-left text-[12px] font-[500] text-[var(--neutral-500)] border-b border-[var(--neutral-100)] whitespace-nowrap"
const TD = "px-3 py-2.5 text-[13px] text-[var(--neutral-800)] border-b border-[var(--neutral-50)]"

function TaskCard(props: { task: CollabTask; onOpen: () => void }) {
  const { task } = props
  return (
    <button
      type="button"
      onClick={props.onOpen}
      className="flex w-full flex-col gap-2 rounded-[14px] border border-[var(--neutral-100)] bg-[var(--surface-raised-stronger-non-alpha)] p-3 text-left cursor-pointer transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-[var(--neutral-500)]">{task.code}</span>
        <TypeTag type={task.issueType} />
        <span className="flex-1" />
        <PriorityLabel priority={task.priority} bare />
      </div>
      <div className="line-clamp-2 text-[13px] font-[500] leading-[20px] text-[var(--neutral-900)]">{task.title}</div>
      <div className="flex items-center gap-2 text-[12px] text-[var(--neutral-500)]">
        <span className="min-w-0 flex-1 truncate">{task.project}</span>
        <PersonChip name={task.assignee} size={18} />
      </div>
    </button>
  )
}

/**
 * 协作开发 · 任务页签的状态与界面（工具栏和内容分开返回，由协作开发页放进各自的位置）。
 * 视图（全部 / 我负责 / 执行中）、筛选、显示设置（看板 / 列表、分组、排序）、任务详情、新建任务。
 */
export function useTasksTab(query: string) {
  const t = useT()
  const dialog = useDialog()
  const client = useQueryClient()
  const me = useSync((s) => s.user?.displayName ?? "")
  const result = useQuery({ queryKey: TASKS_QUERY_KEY, queryFn: taskService.list, staleTime: 0 })
  const all = result.data ?? []
  const [view, setView] = useState<View>("all")
  const [layout, setLayout] = useState<Layout>("list")
  const [groupBy, setGroupBy] = useState<GroupBy>("status")
  const [sortBy, setSortBy] = useState<SortBy>("createDate")
  const [desc, setDesc] = useState(true)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [openId, setOpenId] = useState<string>()

  const projects = useMemo(() => [...new Set(all.map((x) => x.project))], [all])
  const filterFields: Array<{ id: keyof Filters; options: Array<{ value: string; label: string }> }> = [
    { id: "status", options: TASK_STATUSES.map((s) => ({ value: s.id, label: s.name })) },
    { id: "issueType", options: ["需求", "缺陷"].map((value) => ({ value, label: value })) },
    { id: "priority", options: TASK_PRIORITIES.map((p) => ({ value: p.id, label: p.name })) },
    { id: "project", options: projects.map((value) => ({ value, label: value })) },
  ]
  const filterCount = Object.values(filters).reduce((sum, list) => sum + list.length, 0)
  const toggleFilter = (field: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [field]: prev[field].includes(value) ? prev[field].filter((x) => x !== value) : [...prev[field], value] }))

  const list = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const matched = all.filter(
      (task) =>
        (view === "all" || (view === "mine" ? task.assignee === me : task.status === "in_progress")) &&
        (Object.keys(filters) as Array<keyof Filters>).every((field) => filters[field].length === 0 || filters[field].includes(task[field])) &&
        (!keyword || `${task.title} ${task.code}`.toLowerCase().includes(keyword)),
    )
    return sortTasks(matched, sortBy, desc)
  }, [all, view, me, filters, query, sortBy, desc])

  const patch = (id: string, change: Partial<CollabTask>) => {
    client.setQueryData<CollabTask[]>(TASKS_QUERY_KEY, (items) => (items ?? []).map((x) => (x.id === id ? { ...x, ...change } : x)))
    void taskService.update(id, change)
  }
  const openNew = () =>
    dialog.show(() => (
      <NewTaskDialog
        projects={projects}
        onCreate={async (input) => {
          const task = await taskService.create(input)
          client.setQueryData<CollabTask[]>(TASKS_QUERY_KEY, (items) => [task, ...(items ?? [])])
          showToast({ variant: "success", title: t("proto.task.new.created", { code: task.code }) })
          setOpenId(task.id)
        }}
      />
    ))

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        {VIEWS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={view === item}
            onClick={() => setView(item)}
            className={cx(
              "h-8 rounded-[10px] border-none px-3 text-[13px] cursor-pointer transition-colors",
              view === item ? "bg-[var(--neutral-100)] font-[500] text-[var(--neutral-900)]" : "bg-transparent text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]",
            )}
          >
            {t(`proto.task.view.${item}`)}
          </button>
        ))}
      </div>
      <span className="flex-1" />

      <DropdownMenu placement="bottom-end" gutter={4}>
        <DropdownMenu.Trigger className={cx(TOOL_BUTTON, filterCount > 0 && "!border-[var(--primary-600)] !text-[var(--primary-600)]")}>
          <Icon name="filter-lines-16" size="small" />
          {t("proto.task.filter")}
          {filterCount > 0 && <span>{filterCount}</span>}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content style={{ minWidth: 160 }}>
            {filterFields.map((field) => (
              <DropdownMenu.Sub key={field.id} gutter={6}>
                <DropdownMenu.SubTrigger className="flex w-full items-center gap-2 cursor-pointer">
                  <span className="flex-1 text-left">{t(`proto.task.field.${field.id === "issueType" ? "type" : field.id}`)}</span>
                  {filters[field.id].length > 0 && <span className="text-[12px] text-[var(--primary-600)]">{filters[field.id].length}</span>}
                  <Icon name="chevron-right-16" size="small" className="text-[var(--neutral-400)]" />
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent style={{ minWidth: 160, maxHeight: 320, overflowY: "auto" }}>
                    {field.options.map((option) => (
                      <DropdownMenu.Item
                        key={option.value}
                        // 多选：点完不收起菜单
                        onSelect={(e) => {
                          e.preventDefault()
                          toggleFilter(field.id, option.value)
                        }}
                        className="flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="truncate">{option.label}</span>
                        {filters[field.id].includes(option.value) && <Icon name="check" size="small" className="shrink-0 text-[var(--neutral-600)]" />}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
            ))}
            {filterCount > 0 && (
              <>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={() => setFilters(EMPTY_FILTERS)} className="cursor-pointer">
                  {t("proto.task.filter.clear")}
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>

      <div className="flex h-8 items-center rounded-[10px] border border-[var(--neutral-100)] p-0.5">
        {(["board", "list"] as const).map((item) => (
          <Tooltip key={item} value={t(`proto.task.layout.${item}`)} placement="top">
            <button
              type="button"
              aria-pressed={layout === item}
              aria-label={t(`proto.task.layout.${item}`)}
              onClick={() => setLayout(item)}
              className={cx(
                "flex h-7 w-8 items-center justify-center rounded-[8px] border-none cursor-pointer transition-colors",
                layout === item ? "bg-[var(--neutral-100)] text-[var(--neutral-900)]" : "bg-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-800)]",
              )}
            >
              <Icon name={item === "board" ? "grid-16" : "bullet-list"} size="small" />
            </button>
          </Tooltip>
        ))}
      </div>

      {layout === "list" && (
        <PickMenu value={groupBy} onChange={setGroupBy} options={GROUPS.map((value) => ({ value, label: t(`proto.task.group.${value}`) }))} triggerClass={TOOL_BUTTON} placement="bottom-end">
          <Icon name="group-16" size="small" />
          {t("proto.task.group")}：{t(`proto.task.group.${groupBy}`)}
        </PickMenu>
      )}
      <PickMenu value={sortBy} onChange={setSortBy} options={SORTS.map((value) => ({ value, label: t(`proto.task.sort.${value}`) }))} triggerClass={TOOL_BUTTON} placement="bottom-end">
        {t("proto.task.sort")}：{t(`proto.task.sort.${sortBy}`)}
      </PickMenu>
      <Tooltip value={t(desc ? "proto.task.sort.desc" : "proto.task.sort.asc")} placement="top">
        <button type="button" onClick={() => setDesc(!desc)} aria-label={t(desc ? "proto.task.sort.desc" : "proto.task.sort.asc")} className={cx(TOOL_BUTTON, "w-8 justify-center px-0")}>
          <Icon name="arrow-up" size="small" className={cx("transition-transform", desc && "rotate-180")} />
        </button>
      </Tooltip>
    </div>
  )

  const groups = groupTasks(list, layout === "board" ? "status" : groupBy, t("proto.task.unassigned"))
  const opened = all.find((x) => x.id === openId)

  const content = result.isPending ? (
    <div className="text-14-regular text-text-weak py-8 text-center">{t("kcode.appDev.loading")}</div>
  ) : list.length === 0 ? (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-2">
      <Empty description={t("proto.task.empty")} />
      {(filterCount > 0 || query) && (
        <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className={TOOL_BUTTON}>
          {t("proto.task.filter.clear")}
        </button>
      )}
    </div>
  ) : layout === "board" ? (
    <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
      {TASK_STATUSES.filter((s) => s.id !== "cancelled").map((status) => {
        const items = groups.find((g) => g.key === status.id)?.items ?? []
        return (
          <div key={status.id} className="flex w-[272px] shrink-0 flex-col rounded-[16px] bg-[var(--neutral-50)] p-2">
            <div className="flex items-center gap-2 px-1.5 py-1.5">
              <StatusIcon status={status.id} />
              <span className="text-[13px] font-[500] text-[var(--neutral-900)]">{status.name}</span>
              <span className="text-[12px] text-[var(--neutral-500)]">{items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((task) => (
                <TaskCard key={task.id} task={task} onOpen={() => setOpenId(task.id)} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    <table className="w-full min-w-[860px] border-collapse">
      <thead>
        <tr>
          {(["code", "title", "status", "priority", "assignee", "project", "dueDate"] as const).map((key) => (
            <th key={key} className={TH}>
              {t(`proto.task.field.${key}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {groups.map((group) => {
          const folded = collapsed.includes(group.key)
          return [
            group.label && (
              <tr key={`g-${group.key}`}>
                <td colSpan={7} className="border-b border-[var(--neutral-50)] bg-[var(--neutral-50)] px-2 py-1.5">
                  <button
                    type="button"
                    aria-expanded={!folded}
                    onClick={() => setCollapsed(folded ? collapsed.filter((x) => x !== group.key) : [...collapsed, group.key])}
                    className="flex items-center gap-1.5 border-none bg-transparent p-0 text-[13px] font-[500] text-[var(--neutral-800)] cursor-pointer"
                  >
                    <Icon name={folded ? "chevron-right-16" : "chevron-down-16"} size="small" className="text-[var(--neutral-500)]" />
                    {groupBy === "status" && <StatusIcon status={group.key as CollabTask["status"]} />}
                    {group.label}
                    <span className="font-[400] text-[var(--neutral-500)]">{group.items.length}</span>
                  </button>
                </td>
              </tr>
            ),
            ...(folded
              ? []
              : group.items.map((task) => (
                  <tr key={task.id} onClick={() => setOpenId(task.id)} className={cx("cursor-pointer hover:bg-[var(--neutral-50)]", openId === task.id && "bg-[var(--neutral-50)]")}>
                    <td className={cx(TD, "whitespace-nowrap font-mono text-[12px] text-[var(--neutral-500)]")}>{task.code}</td>
                    <td className={TD}>
                      <span className="flex min-w-0 items-center gap-2">
                        <TypeTag type={task.issueType} />
                        <span className="line-clamp-1" title={task.title}>
                          {task.title}
                        </span>
                      </span>
                    </td>
                    <td className={TD}>
                      <PickMenu
                        value={task.status}
                        onChange={(status) => patch(task.id, { status })}
                        options={TASK_STATUSES.map((s) => ({ value: s.id, label: <StatusLabel status={s.id} /> }))}
                        triggerClass="flex items-center rounded-[6px] border-none bg-transparent p-0 cursor-pointer"
                      >
                        <StatusLabel status={task.status} />
                      </PickMenu>
                    </td>
                    <td className={TD}>
                      <PriorityLabel priority={task.priority} />
                    </td>
                    <td className={cx(TD, "max-w-[140px]")}>
                      <PersonChip name={task.assignee} />
                    </td>
                    <td className={cx(TD, "max-w-[180px] truncate text-[var(--neutral-600)]")}>{task.project}</td>
                    <td className={cx(TD, "whitespace-nowrap text-[var(--neutral-600)]")}>{task.dueDate || "—"}</td>
                  </tr>
                ))),
          ]
        })}
      </tbody>
    </table>
  )

  return {
    toolbar,
    openNew,
    content: (
      <>
        {content}
        {opened && <TaskDetailPanel task={opened} onClose={() => setOpenId(undefined)} onUpdate={(change) => patch(opened.id, change)} />}
      </>
    ),
  }
}
