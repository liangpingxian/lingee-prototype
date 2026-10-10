import { useState } from "react"
import { BrandButton, Dialog, SegmentedControl, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { experts, type ExpertTeam } from "@/mock/fixtures/experts"
import { ExpertAvatar, ExpertFaces } from "./ExpertAvatar"
import { ExpertDetailDialog, SECTION_TITLE, TriggerPhrase } from "./ExpertDetailDialog"
import { SourceBadge } from "./SourceBadge"
import { useSummon } from "./use-summon"

type Tab = "info" | "flow"
const byId = (id: string) => experts.find((x) => x.id === id)

/**
 * 专家团详情弹窗（只读）。
 * - 基本信息：简介、成员、常见触发词
 * - 开发流程：按路径（功能开发 / 缺陷修复）切换，纵向时间线列出每个阶段和负责的专家
 */
export function TeamDetailDialog(props: { team: ExpertTeam }) {
  const t = useT()
  const dialog = useDialog()
  const summon = useSummon()
  const [tab, setTab] = useState<Tab>("info")
  const [pathId, setPathId] = useState(props.team.paths[0]?.id)
  const { team } = props
  const path = team.paths.find((x) => x.id === pathId) ?? team.paths[0]
  const call = (text?: string) => {
    dialog.close()
    summon({ kind: "team", id: team.id }, text)
  }
  const openExpert = (id: string) => {
    const expert = byId(id)
    if (expert) dialog.show(() => <ExpertDetailDialog expert={expert} />)
  }

  return (
    <Dialog fit title={t("proto.team.detail.title")} className="!w-[640px] !max-w-[90vw] overflow-hidden">
      <div className="flex flex-col" style={{ height: "min(560px, 72vh)" }}>
        <div className="flex shrink-0 items-center gap-3 px-5 pb-4">
          <ExpertFaces ids={team.members} max={3} size={40} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[16px] font-[600] leading-[24px] text-text-strong">{team.name}</span>
              <SourceBadge source={team.source} />
            </div>
            <div className="truncate text-[13px] leading-[20px] text-[var(--neutral-500)]">
              {t("proto.team.memberCount", { count: team.members.length })} · {team.by}
            </div>
          </div>
        </div>
        <div className="shrink-0 px-5 pb-3">
          <SegmentedControl
            value={tab}
            onChange={(value) => setTab(value as Tab)}
            items={[
              { value: "info", label: t("proto.team.detail.info") },
              { value: "flow", label: t("proto.team.detail.flow") },
            ]}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {tab === "info" ? (
            <div className="flex flex-col gap-5">
              <p className="m-0 text-[14px] leading-[22px] text-[var(--neutral-700)]">{team.desc}</p>
              <section>
                <div className={SECTION_TITLE}>
                  {t("proto.team.detail.members")} <span className="font-[400] text-[var(--neutral-400)]">{team.members.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {team.members.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => openExpert(id)}
                      className="flex items-center gap-2 rounded-[12px] border border-[var(--neutral-100)] bg-transparent px-2.5 py-2 text-left cursor-pointer transition-colors hover:bg-[var(--neutral-50)]"
                    >
                      <ExpertAvatar id={id} size={28} />
                      <span className="min-w-0 flex-1 truncate text-[13px] leading-[20px] text-[var(--neutral-800)]">{byId(id)?.name ?? id}</span>
                    </button>
                  ))}
                </div>
              </section>
              {team.cmds.length > 0 && (
                <section>
                  <div className={SECTION_TITLE}>{t("proto.expert.detail.cmds")}</div>
                  <div className="flex flex-col gap-2">
                    {team.cmds.map((cmd) => (
                      <TriggerPhrase key={cmd.q} q={cmd.q} d={cmd.d} onClick={() => call(cmd.q)} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                {team.paths.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === path.id}
                    onClick={() => setPathId(item.id)}
                    className={cx(
                      "flex flex-col items-start rounded-[12px] border px-3 py-2 text-left cursor-pointer transition-colors",
                      item.id === path.id
                        ? "border-[var(--primary-600)] bg-[var(--primary-500-6)]"
                        : "border-[var(--neutral-100)] bg-transparent hover:bg-[var(--neutral-50)]",
                    )}
                  >
                    <span className="text-[13px] font-[500] leading-[20px] text-[var(--neutral-900)]">{item.name}</span>
                    <span className="text-[12px] leading-[18px] text-[var(--neutral-500)]">{item.hint}</span>
                  </button>
                ))}
              </div>
              <ol className="m-0 list-none p-0">
                {path.stages.map((stage, index) => (
                  <li key={stage.id} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < path.stages.length - 1 && <span className="absolute left-[11px] top-6 bottom-0 w-px bg-[var(--neutral-100)]" />}
                    <span className="z-[1] flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary-600)] text-[12px] font-[600] text-[var(--white-100)]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-[500] leading-[24px] text-[var(--neutral-900)]">{stage.name}</div>
                      {stage.desc && <div className="text-[12px] leading-[18px] text-[var(--neutral-500)]">{stage.desc}</div>}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {stage.experts.length === 0 && <span className="text-[12px] text-[var(--neutral-400)]">{t("proto.team.detail.noExpert")}</span>}
                        {stage.experts.map((id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => openExpert(id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--neutral-100)] bg-transparent py-0.5 pl-0.5 pr-2.5 cursor-pointer transition-colors hover:bg-[var(--neutral-50)]"
                          >
                            <ExpertAvatar id={id} size={22} />
                            <span className="text-[12px] leading-[18px] text-[var(--neutral-800)]">{byId(id)?.name ?? id}</span>
                            <span className="rounded-[4px] bg-[var(--neutral-50)] px-1 text-[11px] leading-[16px] text-[var(--neutral-500)]">{t("proto.team.detail.aiExpert")}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        <div className="flex shrink-0 justify-end border-t border-[var(--neutral-100)] px-5 py-3">
          <BrandButton variant="primary" size="normal" onClick={() => call()}>
            {t("proto.team.detail.call")}
          </BrandButton>
        </div>
      </div>
    </Dialog>
  )
}
