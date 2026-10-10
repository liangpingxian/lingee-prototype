import { useState } from "react"
import { publicUrl } from "@/lib/public-url"
import { cx } from "@/lib/cx"
import { experts } from "@/mock/fixtures/experts"
import { DynamicSkillIcon } from "@/features/dev-page/DynamicSkillIcon"

const nameOf = (id: string) => experts.find((x) => x.id === id)?.name ?? id

/** 专家头像：内置专家有各自的头像图，没有图的退回文字头像 */
export function ExpertAvatar(props: { id: string; size?: number; className?: string }) {
  const size = props.size ?? 40
  const [failed, setFailed] = useState(false)
  if (failed) return <DynamicSkillIcon name={nameOf(props.id)} size={size} />
  return (
    <img
      src={publicUrl(`/expert-avatars/${props.id}.png`)}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      className={cx("shrink-0 rounded-full object-cover", props.className)}
      style={{ width: size, height: size }}
    />
  )
}

/** 专家团的叠放头像：取前几位成员 */
export function ExpertFaces(props: { ids: string[]; max?: number; size?: number }) {
  const size = props.size ?? 28
  return (
    <span className="inline-flex shrink-0 items-center">
      {props.ids.slice(0, props.max ?? 4).map((id, index) => (
        <span key={id} className="rounded-full ring-2 ring-[var(--surface-raised-stronger-non-alpha,#fff)]" style={{ marginLeft: index ? -size / 3 : 0, zIndex: 10 - index }}>
          <ExpertAvatar id={id} size={size} />
        </span>
      ))}
    </span>
  )
}
