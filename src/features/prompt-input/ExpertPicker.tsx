import { useState } from "react"
import { useNavigate } from "react-router"
import { Button, DropdownMenu, Icon } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { experts, expertTeams } from "@/mock/fixtures/experts"
import { usePrompt } from "@/stores/prompt"
import { ExpertAvatar, ExpertFaces } from "@/features/expert/ExpertAvatar"

const GROUP_LABEL = "px-2 pt-2 pb-1 text-[12px] leading-[18px] text-[var(--neutral-400)]"

/**
 * 「选择专家」：指定由哪个专家团或哪位专家来完成这次任务（搜索 + 分组列表）；不选则自动匹配。
 * 底部「管理专家团」跳到协作开发页。
 */
export function ExpertPicker(props: { placement: "top-start" | "bottom-start"; compact?: boolean }) {
  const t = useT()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { pick, setPick } = usePrompt()
  const keyword = query.trim().toLowerCase()
  const match = (name: string) => !keyword || name.toLowerCase().includes(keyword)
  const teams = expertTeams.filter((x) => match(x.name))
  const people = experts.filter((x) => match(x.name))
  const team = pick?.kind === "team" ? expertTeams.find((x) => x.id === pick.id) : undefined
  const expert = pick?.kind === "expert" ? experts.find((x) => x.id === pick.id) : undefined
  const label = team?.name ?? expert?.name

  return (
    <DropdownMenu
      placement={props.placement}
      gutter={8}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setQuery("")
      }}
    >
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="normal"
          data-action="prompt-expert"
          className="group h-9 max-w-[220px] gap-1.5 rounded-[12px] border-none px-[8px] py-[7px] hover:bg-[var(--prompt-input-trigger-bg)]"
        >
          {team ? <ExpertFaces ids={team.members} max={3} size={18} /> : expert ? <ExpertAvatar id={expert.id} size={18} /> : <Icon name="expert" size="small" className="shrink-0 text-[var(--neutral-600)]" />}
          <span className={cx("truncate text-[14px] font-[400] leading-[22px]", label ? "text-[var(--neutral-900)]" : "text-[var(--neutral-700)]")}>
            {label ?? t(props.compact ? "proto.expertPicker.short" : "proto.expertPicker.label")}
          </span>
          <Icon name="arrow-down-12" size="small" className="size-3 shrink-0 text-[var(--neutral-700)] transition-transform duration-150 group-data-[expanded]:rotate-180" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[280px] flex-col p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
          <div className="p-2 pb-0">
            <div className="flex h-8 items-center gap-1.5 rounded-[10px] bg-[var(--neutral-50)] px-2.5">
              <Icon name="search-16" size="small" className="shrink-0 text-[var(--neutral-400)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                // 菜单自带「按字母跳到某一项」，在搜索框里打字时不能让它接管
                onKeyDown={(e) => e.stopPropagation()}
                placeholder={t("proto.expertPicker.search")}
                autoComplete="off"
                className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-[var(--neutral-800)] outline-none placeholder:text-[var(--neutral-400)]"
              />
            </div>
          </div>
          <div className="flex max-h-[280px] flex-col gap-[2px] overflow-y-auto px-1 pb-1">
            {teams.length > 0 && <div className={GROUP_LABEL}>{t("proto.collab.tab.teams")}</div>}
            {teams.map((item) => (
              <DropdownMenu.Item key={item.id} onSelect={() => setPick({ kind: "team", id: item.id })} className="flex items-center gap-2 cursor-pointer">
                <ExpertFaces ids={item.members} max={3} size={20} />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                {pick?.kind === "team" && pick.id === item.id && <Icon name="check" size="small" className="shrink-0 text-[var(--neutral-600)]" />}
              </DropdownMenu.Item>
            ))}
            {people.length > 0 && <div className={GROUP_LABEL}>{t("proto.collab.tab.experts")}</div>}
            {people.map((item) => (
              <DropdownMenu.Item key={item.id} onSelect={() => setPick({ kind: "expert", id: item.id })} className="flex items-center gap-2 cursor-pointer">
                <ExpertAvatar id={item.id} size={20} />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                {pick?.kind === "expert" && pick.id === item.id && <Icon name="check" size="small" className="shrink-0 text-[var(--neutral-600)]" />}
              </DropdownMenu.Item>
            ))}
            {teams.length + people.length === 0 && <div className="px-3 py-4 text-center text-[13px] text-[var(--neutral-400)]">{t("proto.expert.empty")}</div>}
          </div>
          <div className="border-t border-[var(--neutral-100)] p-1">
            {pick && (
              <DropdownMenu.Item onSelect={() => setPick(undefined)} className="flex items-center gap-1.5 cursor-pointer text-[var(--neutral-700)]">
                <Icon name="close-small" size="small" />
                <span>{t("proto.expertPicker.clear")}</span>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item onSelect={() => navigate("/dev/expert?tab=teams")} className="flex items-center gap-1.5 cursor-pointer text-[var(--neutral-700)]">
              <Icon name="square-arrow-top-right" size="small" />
              <span>{t("proto.expertPicker.manage")}</span>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
