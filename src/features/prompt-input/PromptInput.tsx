import { useEffect, useRef, useState } from "react"
import { DockContainer, DockShellForm, DockTray, IconButton, Tooltip } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { usePrompt } from "@/stores/prompt"
import { AppLinkPicker } from "./AppLinkPicker"
import { AttachMenu } from "./AttachMenu"
import { Editor, type EditorHandle } from "./Editor"
import { ExpertPicker } from "./ExpertPicker"
import { ModeChip } from "./ModeChip"
import { ModelSelector } from "./ModelSelector"
import { ProjectPicker } from "./ProjectPicker"
import { PromptPopover, type PopoverItem } from "./PromptPopover"
import { useCompletion } from "./use-completion"

export interface PromptInputProps {
  /** 所在项目；新会话时在输入框下方展示项目选择 */
  projectId: string
  /** 有值表示在已有会话中（外框变细、下拉向上展开） */
  sessionId?: string
  working: boolean
  onSubmit: (text: string) => void
  onAbort: () => void
  onCreateProject: () => void
  onSkillChange?: (skill: string | undefined) => void
}

/**
 * 输入框：编辑区 + 底部工具条（+ 菜单 / 选择专家 / 关联应用 / 模式胶囊 / 模型 / 发送）。
 * 外层结构、类名与原工程 components/prompt-input.tsx 保持一致，逻辑按能力拆到同目录的小文件里。
 */
export function PromptInput(props: PromptInputProps) {
  const t = useT()
  const editor = useRef<EditorHandle>(null)
  const [focused, setFocused] = useState(false)
  const [empty, setEmpty] = useState(true)
  const [shake, setShake] = useState(false)
  const [skill, setSkill] = useState<string>()
  const { mode, draft, takeDraft, linkedApp, setLinkedApp } = usePrompt()
  // 关联应用只对苍穹应用开发有意义
  const linkable = skill === "app-build"
  const inSession = props.sessionId !== undefined
  const disabled = !props.working && empty
  const placeholder = t(mode === "quest" ? "prompt.placeholder.quest" : "prompt.placeholder.normal", { example: "", agent: "" })

  // "/" 与 "@" 的补全：选中后把触发词替换成胶囊 / 文件引用 / 指令文本
  const applyCompletion = (item: PopoverItem) => {
    if (item.type === "file") return editor.current?.completeFile(item.path)
    if (item.command.kind === "skill") return editor.current?.completeSkill(item.command.id)
    editor.current?.completeText(item.command.title)
  }
  const completion = useCompletion(props.projectId, applyCompletion)

  // 外部来源写入的草稿：推荐卡片、技能入口发给新任务页；开发页的「编辑」发给刚建好的那个会话
  useEffect(() => {
    const text = takeDraft(props.sessionId)
    if (text !== undefined) editor.current?.set(text)
  }, [draft.seq, props.sessionId])

  // 切换会话 / 项目后把焦点还给输入框
  useEffect(() => {
    editor.current?.focus()
  }, [props.sessionId, props.projectId])

  const submit = () => {
    if (props.working) return props.onAbort()
    const text = editor.current?.value() ?? ""
    if (!text) return
    props.onSubmit(linkable && linkedApp ? `${text}\n关联应用：${linkedApp}` : text)
    setLinkedApp(undefined)
    editor.current?.clear()
  }

  return (
    <div
      className={cx(
        "relative size-full flex flex-col gap-0",
        inSession &&
          !completion.trigger &&
          "before:content-[''] before:absolute before:-top-[80px] before:left-0 before:right-0 before:h-[80px] before:bg-[linear-gradient(to_bottom,var(--prompt-input-before-bg-start),var(--prompt-input-before-bg-end))] before:pointer-events-none before:z-[1]",
      )}
    >
      {completion.trigger && (
        <PromptPopover
          type={completion.trigger.type}
          items={completion.items}
          activeKey={completion.activeKey}
          newSession={!inSession}
          onSelect={applyCompletion}
          onActive={completion.setActiveKey}
        />
      )}
      <div
        className={cx("z-[3] flex flex-col gap-0 transition-colors duration-200 ease-out rounded-[30px]", inSession ? "p-[1px]" : "p-[3px]")}
        style={{ background: focused ? "var(--primary-500-6)" : "var(--neutral-50)" }}
      >
        <DockContainer
          data-in-session={inSession ? "" : undefined}
          className={cx("group/prompt-input !p-0", inSession ? "h-auto min-h-[96px]" : "min-h-[unset] !border-0")}
        >
          <DockShellForm
            className="flex h-full min-h-0 flex-col"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <div
              className="relative flex-1 min-h-0 max-h-[220px] overflow-y-auto no-scrollbar"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) editor.current?.focus()
              }}
            >
              <div className="relative">
                <Editor
                  ref={editor}
                  placeholder={placeholder}
                  newSession={!inSession}
                  onFocusChange={setFocused}
                  onSubmit={submit}
                  onTrigger={completion.setTrigger}
                  onKeyIntercept={completion.intercept}
                  onChange={(state) => {
                    setEmpty(state.empty)
                    setSkill(state.skill)
                    props.onSkillChange?.(state.skill)
                  }}
                />
                {empty && (
                  <div className="absolute top-0 inset-x-0 px-4 pt-4 text-[16px] leading-[30px] text-[var(--prompt-input-placeholder)] pointer-events-none whitespace-nowrap truncate">
                    {placeholder}
                  </div>
                )}
              </div>
            </div>

            <DockTray attach="top" className="shrink-0">
              <div className="flex items-center justify-between gap-1 min-w-0 px-2.5 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <AttachMenu placement={inSession ? "top-start" : "bottom-start"} />
                    <ExpertPicker placement={inSession ? "top-start" : "bottom-start"} compact={inSession} />
                    {linkable && <AppLinkPicker placement={inSession ? "top-start" : "bottom-start"} />}
                  </div>
                </div>
                <div className="prompt-input-bar flex items-center gap-2 min-w-0 flex-1 relative">
                  <div className="chips-row flex items-center gap-2 min-w-0 flex-1" />
                  <ModeChip />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <ModelSelector placement={inSession ? "top-end" : "bottom-end"} />
                </div>
                <div
                  className="inline-flex"
                  onPointerDown={() => {
                    if (!disabled) return
                    setShake(false)
                    requestAnimationFrame(() => setShake(true))
                  }}
                >
                  <Tooltip placement="top" value={t(props.working ? "prompt.action.stop" : "prompt.action.send")}>
                    <IconButton
                      data-action="prompt-submit"
                      type="submit"
                      size="normal"
                      disabled={disabled}
                      icon={props.working ? "stop" : "arrow-up"}
                      iconClass="text-[var(--neutral-400)]"
                      iconSize="normal"
                      variant="ghost"
                      className={cx(
                        "size-9 min-w-9 min-h-9 rounded-[50%]",
                        disabled ? "bg-[var(--surface-base)]" : "bg-[var(--primary-600)] [&_[data-slot=icon-svg]]:!text-[var(--white-100)]",
                        shake && "prompt-submit-shake",
                      )}
                      onAnimationEnd={() => setShake(false)}
                      aria-label={t(props.working ? "prompt.action.stop" : "prompt.action.send")}
                    />
                  </Tooltip>
                </div>
              </div>
            </DockTray>
          </DockShellForm>
        </DockContainer>
        {!inSession && <ProjectPicker projectId={props.projectId} onCreateProject={props.onCreateProject} />}
      </div>
    </div>
  )
}

