import { useState } from "react"
import { Icon, Markdown, type IconName } from "@/ui"
import { inlinePaths } from "@/ui/icon/inline-paths.gen"
import { useT } from "@/i18n"
import type { ToolPart as ToolPartData } from "@/mock/types"
import { getSkillDisplayName } from "@/features/prompt-input/skill-entries"

const TOOL_META: Record<ToolPartData["tool"], { icon: IconName; labelKey: string; lang?: string }> = {
  read: { icon: "book-open-24", labelKey: "ui.tool.read" },
  skill: { icon: "plugin-24", labelKey: "ui.tool.skill" },
  bash: { icon: "square-code-24", labelKey: "ui.tool.shell", lang: "bash" },
  edit: { icon: "edit-24", labelKey: "ui.tool.patch" },
  write: { icon: "edit-24", labelKey: "ui.tool.patch" },
  grep: { icon: "find-catalog-24", labelKey: "ui.tool.grep", lang: "text" },
  question: { icon: "dialog-box-24", labelKey: "ui.tool.questions" },
  websearch: { icon: "web-search-24", labelKey: "ui.tool.websearch" },
}

const langOf = (part: ToolPartData) => TOOL_META[part.tool].lang ?? (part.title.split(".").pop() === "py" ? "python" : "markdown")

/** 工具调用行：图标 + 工具名 + 参数摘要；有输出时可点击展开。DOM 结构对齐 kcode-ui 的 basic-tool */
export function ToolPart(props: { part: ToolPartData }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const { part } = props
  const meta = TOOL_META[part.tool]
  const expandable = !!part.output
  // 加载技能时显示技能的展示名（skill-builder），不是内部触发名（kingdee-skill-creator）
  const title = part.tool === "skill" ? getSkillDisplayName(part.title) : part.title
  return (
    <div data-component="tool-part-wrapper">
      <div
        data-component="collapsible"
        data-variant="normal"
        className="tool-collapsible"
        data-tool-kind={part.tool}
        data-expanded={open ? "" : undefined}
        data-closed={open ? undefined : ""}
      >
        <div
          data-slot="collapsible-trigger"
          data-hide-details={expandable ? undefined : "true"}
          data-expanded={open ? "" : undefined}
          role={expandable ? "button" : undefined}
          aria-expanded={expandable ? open : undefined}
          onClick={() => expandable && setOpen(!open)}
        >
          <div data-component="tool-trigger" data-tool-kind={part.tool} data-clickable={expandable ? "true" : undefined} data-hide-details={expandable ? undefined : "true"}>
            <div data-slot="basic-tool-tool-trigger-content">
              <div data-slot="basic-tool-tool-indicator" data-tool-status={part.state === "running" ? "pending" : part.state}>
                <Icon name={meta.icon} size="small" />
              </div>
              <div data-slot="basic-tool-tool-info">
                <div data-slot="basic-tool-tool-info-structured">
                  <div data-slot="basic-tool-tool-info-main">
                    <span data-slot="basic-tool-tool-title">{t(meta.labelKey)}</span>
                    <span data-slot="basic-tool-tool-subtitle" title={title}>
                      {title}
                    </span>
                    {part.detail && <span data-slot="basic-tool-tool-arg">{part.detail}</span>}
                  </div>
                </div>
              </div>
            </div>
            {expandable && (
              <div data-slot="collapsible-arrow">
                <span data-slot="collapsible-arrow-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d={inlinePaths.reasoningChevron} fill="currentColor" />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>
        {open && part.output && (
          <div data-slot="collapsible-content" data-expanded="">
            <div data-component="tool-output" data-scrollable>
              <Markdown text={`\`\`\`${langOf(part)}\n${part.output}\n\`\`\``} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
