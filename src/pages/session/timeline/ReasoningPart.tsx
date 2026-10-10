import { useState } from "react"
import { Icon, Markdown } from "@/ui"
import { inlinePaths } from "@/ui/icon/inline-paths.gen"
import { useT } from "@/i18n"
import type { ReasoningPart as ReasoningPartData } from "@/mock/types"

/** 思考过程：进行中显示「正在思考」，结束后折叠成一行摘要，点击展开 */
export function ReasoningPart(props: { part: ReasoningPartData }) {
  const t = useT()
  const [expanded, setExpanded] = useState(false)
  const streaming = props.part.time.end === undefined
  return (
    <div data-component="reasoning-part" data-expanded={expanded} data-state={streaming ? "running" : "ok"}>
      <div data-slot="reasoning-header" role="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
        {!streaming && (
          <span data-slot="reasoning-icon">
            <Icon name="brain-24" size="small" />
          </span>
        )}
        <span data-slot="reasoning-label">
          {t(streaming ? "ui.reasoning.understanding" : "ui.reasoning.thinkingDone")}
        </span>
        {!expanded && !streaming && (
          <>
            <span data-slot="reasoning-summary-separator" aria-hidden="true" />
            <span data-slot="reasoning-summary" title={props.part.text}>
              {props.part.text}
            </span>
          </>
        )}
        <svg data-slot="reasoning-chevron" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d={inlinePaths.reasoningChevron} fill="currentColor" />
        </svg>
      </div>
      {expanded && (
        <div data-slot="reasoning-body">
          <Markdown text={props.part.text} />
        </div>
      )}
    </div>
  )
}
