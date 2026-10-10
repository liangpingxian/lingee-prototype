import { useState } from "react"
import { BrandButton, Dialog, Icon, SegmentedControl, Tag, useDialog } from "@/ui"
import { useT } from "@/i18n"
import { MODEL_TIERS, type Expert } from "@/mock/fixtures/experts"
import { ExpertAvatar } from "./ExpertAvatar"
import { SourceBadge } from "./SourceBadge"
import { useSummon } from "./use-summon"

type Tab = "overview" | "skills"

export const SECTION_TITLE = "mb-2 text-[13px] font-[600] leading-[20px] text-[var(--neutral-900)]"
export const CHIP = "inline-flex h-6 items-center rounded-[6px] bg-[var(--neutral-50)] px-2 text-[12px] leading-[18px] text-[var(--neutral-700)]"

/** 触发词：点一下就带着这句话去对话 */
export function TriggerPhrase(props: { q: string; d?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      title={props.d}
      className="group flex w-full items-center gap-3 rounded-[12px] border border-[var(--neutral-100)] bg-transparent px-3 py-2 text-left cursor-pointer transition-colors hover:bg-[var(--neutral-50)]"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] leading-[20px] text-[var(--neutral-800)]">“{props.q}”</span>
        {props.d && <span className="block text-[12px] leading-[18px] text-[var(--neutral-500)]">{props.d}</span>}
      </span>
      <Icon name="speech-bubble" size="small" className="shrink-0 text-[var(--neutral-400)] group-hover:text-[var(--primary-600)]" />
    </button>
  )
}

/** 专家详情弹窗（只读）：概览（简介、常见触发词、能力项、模型级别）/ 技能；底部「对话专家」 */
export function ExpertDetailDialog(props: { expert: Expert }) {
  const t = useT()
  const dialog = useDialog()
  const summon = useSummon()
  const [tab, setTab] = useState<Tab>("overview")
  const { expert } = props
  const tier = MODEL_TIERS.find((x) => x.id === expert.tier) ?? MODEL_TIERS[0]
  const call = (text?: string) => {
    dialog.close()
    summon({ kind: "expert", id: expert.id }, text)
  }

  return (
    <Dialog fit title={t("proto.expert.detail.title")} className="!w-[640px] !max-w-[90vw] overflow-hidden">
      <div className="flex flex-col" style={{ height: "min(560px, 72vh)" }}>
        <div className="flex shrink-0 items-center gap-3 px-5 pb-4">
          <ExpertAvatar id={expert.id} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[16px] font-[600] leading-[24px] text-text-strong">{expert.name}</span>
              <SourceBadge source={expert.source} />
            </div>
            <div className="truncate text-[13px] leading-[20px] text-[var(--neutral-500)]">{[expert.role, expert.by].filter(Boolean).join(" · ")}</div>
          </div>
        </div>
        <div className="shrink-0 px-5 pb-3">
          <SegmentedControl
            value={tab}
            onChange={(value) => setTab(value as Tab)}
            items={[
              { value: "overview", label: t("proto.expert.detail.overview") },
              { value: "skills", label: `${t("proto.expert.detail.skills")} ${expert.skills.length}` },
            ]}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {tab === "overview" ? (
            <div className="flex flex-col gap-5">
              <p className="m-0 text-[14px] leading-[22px] text-[var(--neutral-700)]">{expert.desc}</p>
              {expert.cmds.length > 0 && (
                <section>
                  <div className={SECTION_TITLE}>{t("proto.expert.detail.cmds")}</div>
                  <div className="flex flex-col gap-2">
                    {expert.cmds.map((cmd) => (
                      <TriggerPhrase key={cmd.q} q={cmd.q} d={cmd.d} onClick={() => call(cmd.q)} />
                    ))}
                  </div>
                </section>
              )}
              <section>
                <div className={SECTION_TITLE}>{t("proto.expert.detail.comp")}</div>
                <div className="flex flex-wrap gap-2">
                  {expert.comp.map((item) => (
                    <span key={item.name} className={CHIP}>
                      {item.name}
                      <span className="ml-1 text-[var(--neutral-400)]">{item.level}</span>
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <div className={SECTION_TITLE}>{t("proto.expert.detail.modes")}</div>
                <div className="flex flex-wrap gap-2">
                  {expert.modes.map((mode) => (
                    <span key={mode} className={CHIP}>
                      {mode}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <div className={SECTION_TITLE}>{t("proto.expert.detail.tier")}</div>
                <Tag type="primary" title={tier.desc}>
                  {tier.label}
                </Tag>
              </section>
            </div>
          ) : expert.skills.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[var(--neutral-400)]">{t("proto.expert.detail.noSkills")}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {expert.skills.map((skill) => (
                <div key={skill.name} className="flex items-start gap-3 rounded-[12px] border border-[var(--neutral-100)] px-3 py-2.5">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--primary-500-6)] text-[var(--primary-600)]">
                    <Icon name="skill-bolt" size="small" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-[500] leading-[20px] text-[var(--neutral-900)]">{skill.name}</span>
                    <span className="block text-[12px] leading-[18px] text-[var(--neutral-500)]">{skill.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 justify-end border-t border-[var(--neutral-100)] px-5 py-3">
          <BrandButton variant="primary" size="normal" onClick={() => call()}>
            {t("proto.expert.detail.call")}
          </BrandButton>
        </div>
      </div>
    </Dialog>
  )
}
