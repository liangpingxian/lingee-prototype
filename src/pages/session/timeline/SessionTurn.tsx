import { Markdown, RenderCard, splitRenderBlocks, type CardClick } from "@/ui"
import { useMemo } from "react"
import { useT } from "@/i18n"
import type { Message } from "@/mock/types"
import { ReasoningPart } from "./ReasoningPart"
import { ToolPart } from "./ToolPart"
import { UserMessage } from "./UserMessage"

/** 一轮对话 = 一条用户消息 + 其后的助手回复。结构对齐 kcode-ui 的 session-turn */
/** 一段正文：普通文字走 Markdown，其中的 :::render:kind {...}::: 指令渲染成产物卡片 */
function TextPart(props: { text: string; onCardClick?: CardClick }) {
  const segments = useMemo(() => splitRenderBlocks(props.text), [props.text])
  return (
    <div data-component="text-part">
      <div data-slot="text-part-body">
        {segments.map((segment, index) =>
          segment.type === "render" ? (
            <RenderCard key={index} kind={segment.kind} config={segment.config} onCardClick={props.onCardClick} />
          ) : (
            segment.content.trim() && <Markdown key={index} text={segment.content} />
          ),
        )}
      </div>
    </div>
  )
}

export function SessionTurn(props: { user: Message; assistants: Message[]; working: boolean; onCardClick?: CardClick }) {
  const t = useT()
  const parts = props.assistants.flatMap((message) => message.parts)
  return (
    <div data-component="session-turn">
      <div data-slot="session-turn-content">
        <div>
          <div data-message={props.user.id} data-slot="session-turn-message-container">
            <div data-slot="session-turn-message-content" aria-live="off">
              <UserMessage message={props.user} />
            </div>
            {parts.length > 0 && (
              <div data-slot="session-turn-assistant-content" aria-hidden={props.working}>
                {parts.map((part) =>
                  part.type === "text" ? (
                    <TextPart key={part.id} text={part.text} onCardClick={props.onCardClick} />
                  ) : part.type === "reasoning" ? (
                    <ReasoningPart key={part.id} part={part} />
                  ) : (
                    <ToolPart key={part.id} part={part} />
                  ),
                )}
              </div>
            )}
            {props.working && parts.length === 0 && (
              <div data-slot="session-turn-thinking" data-state="running" role="status" aria-live="polite">
                <span data-slot="session-turn-thinking-summary">{t("ui.reasoning.understanding")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
