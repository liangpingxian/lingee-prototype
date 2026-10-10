import { useState } from "react"
import { DockTray } from "@/ui"
import { inlinePaths } from "@/ui/icon/inline-paths.gen"
import { useT } from "@/i18n"
import type { Todo } from "@/mock/types"

function Spinner(props: { id: string }) {
  return (
    <span className="session-todo-item-spinner">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M12.5 12.5C12.5 5.87258 7.12742 0.5 0.5 0.5" stroke={`url(#${props.id})`} strokeWidth="0.5" strokeLinecap="round" />
        <defs>
          <linearGradient id={props.id} x1="0.5" y1="0.5" x2="12.5" y2="12.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--todo-docker-progress)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--todo-docker-progress)" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  )
}

/** 待办：收起时一行显示当前进行中的事项和进度，展开看完整清单 */
export function TodoDock(props: { todos: Todo[] }) {
  const t = useT()
  const [collapsed, setCollapsed] = useState(true)
  const done = props.todos.filter((x) => x.status === "completed").length
  const activeIndex = props.todos.findIndex((x) => x.status === "in_progress")
  const active = props.todos[activeIndex]
  const label = t(collapsed ? "session.todo.expand" : "session.todo.collapse")

  return (
    <DockTray data-component="session-todo-dock" style={{ overflowX: "visible", overflowY: "hidden" }}>
      <div>
        <div
          data-action="session-todo-toggle"
          className="flex items-center gap-1.5 overflow-visible cursor-pointer select-none"
          tabIndex={0}
          role="button"
          aria-expanded={!collapsed}
          aria-label={label}
          title={label}
          onClick={() => setCollapsed(!collapsed)}
        >
          <p className="text-[16px] leading-[24px] font-[500] text-[var(--todo-docker-title)] shrink-0">{t("session.todo.title")}</p>
          {collapsed && active && (
            <div className="flex items-center gap-1.5 ml-2 min-w-0 flex-1 overflow-hidden">
              <span className="session-todo-item-num">
                <span>{activeIndex + 1}</span>
                <Spinner id="sessionTodoSpinnerGradientHeader" />
              </span>
              <span className="text-[14px] leading-[22px] text-[var(--text-base)] truncate" title={active.content}>
                {active.content}
              </span>
            </div>
          )}
          <p className="text-[16px] leading-[24px] font-[400] text-[var(--todo-docker-num)] ml-auto shrink-0">
            {done + (active ? 1 : 0)}/{props.todos.length}
          </p>
          <button className="flex items-center justify-center ml-1.5 w-7 h-7 text-[var(--neutral-600)] hover:bg-[var(--icon-bg-hover)] active:text-[var(--neutral-900)] cursor-pointer rounded-[8px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d={collapsed ? inlinePaths.userChevron : inlinePaths.todoCollapse} fill="currentColor" />
            </svg>
          </button>
        </div>

        {!collapsed && (
          <div data-slot="session-todo-list">
            <div className="relative">
              <div
                data-slot="session-todo-scroll"
                className="mt-3 pb-3 flex flex-col gap-4"
                style={{ overflowY: props.todos.length > 5 ? "auto" : "visible", maxHeight: props.todos.length > 5 ? 260 : "none" }}
              >
                {props.todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className="session-todo-item"
                    data-in-progress={todo.status === "in_progress" ? "" : undefined}
                    data-state={todo.status}
                    style={{ opacity: todo.status === "pending" ? 0.94 : 1 }}
                  >
                    <span className="session-todo-item-num" aria-hidden="true">
                      {todo.status === "completed" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" fill="none" className="session-todo-item-check">
                          <path d={inlinePaths.todoCheckFill} fill="currentColor" />
                          <path d={inlinePaths.todoCheckStroke} stroke="currentColor" strokeWidth="0.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                      {todo.status === "in_progress" && <Spinner id="sessionTodoSpinnerGradient" />}
                    </span>
                    <span
                      className="text-[14px] leading-[22px] font-[400] min-w-0 break-words"
                      style={{ textDecoration: todo.status === "cancelled" ? "line-through" : undefined }}
                    >
                      {todo.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DockTray>
  )
}
