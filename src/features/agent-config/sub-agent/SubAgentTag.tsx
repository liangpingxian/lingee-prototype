import { useT } from "@/i18n"
import type { Agent } from "@/mock/fixtures/dev"

const TAG_STYLE = {
  official: "text-[#2f6fd0] bg-[#eaf2ff]",
  beta: "text-[#b07d22] bg-[#fdf4e4]",
  own: "text-text-base bg-[var(--surface-base)]",
}

/** 本地列表里的智能体一律算「企业自建」；更多智能体按发布方给 金蝶官方 / Beta / 企业自建 */
export const tagOf = (agent: Agent) => (agent.source === "mall" ? (agent.tag ?? "official") : "own")

/** 发布状态：已发布或已有线上版本都算已发布，其余显示当前状态 */
export const isPublished = (agent: Agent) => agent.status === "published" || !!agent.online

/** 来源标签（金蝶官方 / Beta / 企业自建），悬停说明含义 */
export function SourceTag(props: { agent: Agent }) {
  const t = useT()
  const tag = tagOf(props.agent)
  return (
    <span className={`shrink-0 rounded-[5px] px-[7px] py-[2px] text-[10.5px] leading-[1.5] font-medium ${TAG_STYLE[tag]}`} title={t(`proto.subAgent.tagTip.${tag}`)}>
      {t(`proto.subAgent.tag.${tag}`)}
    </span>
  )
}

/** 发布状态小标签 */
export function PublishTag(props: { agent: Agent }) {
  const t = useT()
  const live = isPublished(props.agent)
  return (
    <span className={`shrink-0 rounded-[5px] px-[7px] py-[2px] text-[10.5px] leading-[1.5] font-medium ${live ? "text-text-base bg-[#f2f4f7]" : "text-text-weak bg-[var(--surface-base)]"}`}>
      {t(`kcode.agentDev.status.${live ? "published" : props.agent.status}`)}
    </span>
  )
}
