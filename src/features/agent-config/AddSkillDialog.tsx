import { useMemo, useState, type CSSProperties } from "react"
import { useQuery } from "@tanstack/react-query"
import { BrandButton, Dialog, Empty, Icon, Search, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import type { AgentSkill } from "@/mock/fixtures/dev"
import { skillService } from "@/services"
import { DynamicSkillIcon } from "@/features/dev-page/DynamicSkillIcon"
import { SkillTags } from "./SkillConfigTab"

/**
 * 添加技能弹窗：可选范围 = 当前项目的本地技能 + 企业已发布的技能。
 * 多选，确认后整体替换智能体的技能列表（不在可选范围里的已选技能原样保留）。
 */
export function AddSkillDialog(props: { projectId: string; selected: AgentSkill[]; onConfirm: (skills: AgentSkill[]) => void }) {
  const t = useT()
  const dialog = useDialog()
  const [query, setQuery] = useState("")
  const [picked, setPicked] = useState(() => new Set(props.selected.map((x) => x.id)))
  const all = useQuery({ queryKey: ["skills"], queryFn: skillService.list, staleTime: 0 })

  const available = useMemo<AgentSkill[]>(
    () =>
      (all.data ?? [])
        .filter((x) => x.projectId === props.projectId || x.enterpriseStatus === "published")
        .map((x) => ({
          id: x.name,
          name: x.displayName,
          skillName: x.name,
          desc: x.desc,
          source: x.enterpriseStatus === "published" ? "marketplace" : "local",
          publishStatus: x.enterpriseStatus === "published" ? "published" : x.enterpriseStatus === "submitted" ? "reviewing" : "unpublished",
        })),
    [all.data, props.projectId],
  )
  const keyword = query.trim().toLowerCase()
  const list = keyword ? available.filter((x) => x.name.toLowerCase().includes(keyword) || x.desc.toLowerCase().includes(keyword)) : available
  const count = available.filter((x) => picked.has(x.id)).length

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })
  const confirm = () => {
    const kept = props.selected.filter((x) => !available.some((y) => y.id === x.id))
    props.onConfirm([...kept, ...available.filter((x) => picked.has(x.id))])
    dialog.close()
  }

  return (
    <Dialog fit className="w-[640px] overflow-hidden">
      <div
        className="flex flex-col"
        style={{ height: "65vh", "--border-weak-base": "var(--border-agent-config)", "--input-base": "var(--input-agent-config)" } as CSSProperties}
      >
        <div className="flex items-center justify-between px-5 py-5 shrink-0">
          <span className="text-20-medium text-text-strong">{t("kcode.agentConfig.skills.add")}</span>
          <div className="flex items-center gap-3">
            <Search value={query} onChange={setQuery} placeholder={t("kcode.agentConfig.skills.search")} />
            <button type="button" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg hover:bg-[var(--neutral-50)]" onClick={dialog.close}>
              <Icon name="close-small" size="small" className="text-text-weak" />
            </button>
          </div>
        </div>

        {all.isPending ? (
          <div className="flex flex-1 flex-col gap-2 px-5 pb-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl border border-[var(--border-weak-base)] bg-[var(--input-base)] px-4 py-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-base" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-3.5 w-32 rounded bg-surface-base" />
                  <div className="h-3 w-48 rounded bg-surface-base" />
                </div>
                <div className="h-5 w-5 shrink-0 rounded-full bg-surface-base" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-5">
            <Empty description={t(keyword ? "kcode.agentConfig.skills.noMatch" : "kcode.agentConfig.skills.noData")} />
          </div>
        ) : (
          <div className="relative flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {list.map((skill) => {
              const checked = picked.has(skill.id)
              return (
                <div key={skill.id} className="px-5 pb-2">
                  <div
                    className={cx(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                      checked ? "border-[var(--brand-button-primary-base)] bg-[var(--brand-button-ghost-base)]" : "border-[var(--border-weak-base)]",
                    )}
                    onClick={() => toggle(skill.id)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <DynamicSkillIcon name={skill.name} size={40} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[14px] leading-5 font-medium text-text-strong mr-1" title={skill.name}>
                          {skill.name}
                        </span>
                        <SkillTags source={skill.source} status={skill.publishStatus} />
                      </div>
                      <span className="truncate text-12-regular text-text-weak" title={skill.desc}>
                        {skill.desc}
                      </span>
                    </div>
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{
                        borderColor: checked ? "var(--brand-button-primary-base)" : "var(--border-weak-base)",
                        backgroundColor: checked ? "var(--brand-button-primary-base)" : "var(--input-base)",
                      }}
                    >
                      {checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="var(--text-invert-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex shrink-0 items-center justify-between px-5 py-5">
          <span className="text-14-regular text-text-weak">
            {t("kcode.agentConfig.skills.selected")}
            <span style={{ color: "var(--brand-button-primary-base)" }}>{count}</span>
            {t("kcode.agentConfig.skills.selectedUnit")}
          </span>
          <div className="flex items-center gap-3">
            <BrandButton variant="text" size="normal" onClick={dialog.close}>
              {t("kcode.agentConfig.skills.cancel")}
            </BrandButton>
            <BrandButton variant="primary" size="normal" onClick={confirm}>
              {t("kcode.agentConfig.skills.confirm")}
            </BrandButton>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
