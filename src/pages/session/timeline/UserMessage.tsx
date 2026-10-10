import { useLayoutEffect, useRef, useState } from "react"
import { Icon, IconButton, Tooltip, showToast } from "@/ui"
import { useT } from "@/i18n"
import type { Message } from "@/mock/types"
import { getSkillDisplayName, parseSlash } from "@/features/prompt-input/skill-entries"

const timeOf = (ms: number) => {
  const d = new Date(ms)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

/** 用户消息气泡：前导的 "/技能名" 渲染成技能标签，下方是时间与复制按钮 */
export function UserMessage(props: { message: Message }) {
  const t = useT()
  const raw = props.message.parts.flatMap((part) => (part.type === "text" ? [part.text] : [])).join("\n")
  const { skill, body } = parseSlash(raw)
  const inner = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflow, setOverflow] = useState(false)

  // 长消息默认折叠，超出时才出现展开按钮
  useLayoutEffect(() => {
    const el = inner.current
    if (el && !expanded) setOverflow(el.scrollHeight > el.clientHeight + 1)
  }, [raw, expanded])
  return (
    <div data-component="user-message">
      <div data-slot="user-message-body">
        <div
          data-slot="user-message-text"
          data-expanded={expanded ? "true" : undefined}
          data-has-expand={overflow || expanded ? "true" : undefined}
        >
          <div data-slot="user-message-text-inner" ref={inner}>
            {skill ? (
              <div data-slot="user-message-inline">
                <span data-slot="user-message-skill" className="text-[var(--primary-600)] font-[500] mr-2">
                  {getSkillDisplayName(skill)}
                </span>
                {body}
              </div>
            ) : (
              raw
            )}
          </div>
          {(overflow || expanded) && (
            <button
              type="button"
              data-slot="user-message-expand"
              onClick={() => setExpanded(!expanded)}
              aria-label={t(expanded ? "ui.message.collapse" : "ui.message.expand")}
            >
              <Icon name={expanded ? "collapse-message" : "expand-message"} size="small" />
            </button>
          )}
        </div>
      </div>
      <div data-slot="user-message-copy-wrapper">
        <span data-slot="user-message-meta-wrap">
          <span data-slot="user-message-meta" className="text-12-regular text-text-weak cursor-default">
            {timeOf(props.message.time.created)}
          </span>
        </span>
        <Tooltip value={t("ui.message.copyMessage")} placement="top" gutter={4}>
          <IconButton
            icon="copy"
            size="normal"
            variant="ghost"
            className="w-7 h-7"
            onClick={() => {
              void navigator.clipboard?.writeText(raw)
              showToast({ variant: "success", title: t("ui.message.copied") })
            }}
            aria-label={t("ui.message.copyMessage")}
          />
        </Tooltip>
      </div>
    </div>
  )
}
