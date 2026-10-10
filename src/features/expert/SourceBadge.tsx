import { Tag } from "@/ui"
import { useT } from "@/i18n"
import type { Expert } from "@/mock/fixtures/experts"

/** 来源标签：官方（内置）/ 租户（企业共享）/ 个人 */
export function SourceBadge(props: { source: Expert["source"] }) {
  const t = useT()
  return (
    <Tag type={props.source === "builtin" ? "primary" : "normal"} className="shrink-0 whitespace-nowrap !rounded-[6px]">
      {t(`proto.expert.source.${props.source}`)}
    </Tag>
  )
}
