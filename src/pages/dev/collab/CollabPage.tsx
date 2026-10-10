import { useMemo, useState, type ReactNode } from "react"
import { useSearchParams } from "react-router"
import { Empty, Tile, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { experts, expertTeams, type Expert, type ExpertTeam } from "@/mock/fixtures/experts"
import { DEV_GRID, DevPageLayout } from "@/features/dev-page/DevPageLayout"
import { useStartSession } from "@/features/dev-page/use-start-session"
import { ExpertAvatar, ExpertFaces } from "@/features/expert/ExpertAvatar"
import { ExpertDetailDialog } from "@/features/expert/ExpertDetailDialog"
import { SourceBadge } from "@/features/expert/SourceBadge"
import { TeamDetailDialog } from "@/features/expert/TeamDetailDialog"
import { useSummon } from "@/features/expert/use-summon"
import { useTasksTab } from "./tasks/TasksTab"

type Tab = "tasks" | "experts" | "teams"
type Source = "all" | Expert["source"]
const TABS: Tab[] = ["tasks", "experts", "teams"]
const SOURCES: Source[] = ["all", "builtin", "shared", "personal"]

/** 卡片右上角的「对话」：悬停时出现 */
function CallButton(props: { onClick: () => void }) {
  const t = useT()
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        props.onClick()
      }}
      className="h-7 rounded-[8px] border border-[var(--neutral-100)] bg-[var(--surface-raised-stronger-non-alpha)] px-2.5 text-[12px] text-[var(--neutral-800)] opacity-0 cursor-pointer transition-opacity hover:bg-[var(--neutral-50)] group-hover:opacity-100"
    >
      {t("proto.expert.call")}
    </button>
  )
}

function Chips(props: { items: string[] }) {
  return (
    <div className="flex min-w-0 flex-wrap gap-1.5 overflow-hidden" style={{ maxHeight: 22 }}>
      {props.items.map((item) => (
        <span key={item} className="rounded-[6px] bg-[var(--neutral-50)] px-1.5 text-[12px] leading-[22px] text-[var(--neutral-600)] whitespace-nowrap">
          {item}
        </span>
      ))}
    </div>
  )
}

/** 来源筛选：全部 / 官方 / 租户 / 个人，带数量 */
function SourceFilter(props: { value: Source; onChange: (value: Source) => void; items: Array<{ source: Expert["source"] }> }) {
  const t = useT()
  return (
    <div className="flex items-center gap-1.5">
      {SOURCES.map((source) => {
        const count = source === "all" ? props.items.length : props.items.filter((x) => x.source === source).length
        return (
          <button
            key={source}
            type="button"
            aria-pressed={props.value === source}
            onClick={() => props.onChange(source)}
            className={cx(
              "h-7 rounded-full border px-3 text-[12px] cursor-pointer transition-colors",
              props.value === source
                ? "border-[var(--primary-600)] bg-[var(--primary-500-6)] text-[var(--primary-600)]"
                : "border-[var(--neutral-100)] bg-transparent text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]",
            )}
          >
            {t(`proto.expert.source.${source}`)} {count}
          </button>
        )
      })}
    </div>
  )
}

/**
 * 协作开发页：任务 / 专家 / 专家团 三个页签。
 * 任务按专家团的开发流程分阶段执行，列表 / 看板两种视图；
 * 专家是能独立完成某类工作的角色，专家团把多位专家按开发流程编在一起；点卡片看详情，点「对话」直接让它来做。
 */
export function CollabPage() {
  const t = useT()
  const dialog = useDialog()
  const summon = useSummon()
  const startSession = useStartSession()
  const [search, setSearch] = useSearchParams()
  const tab = (TABS.find((x) => x === search.get("tab")) ?? "tasks") as Tab
  const [query, setQuery] = useState("")
  const [source, setSource] = useState<Source>("all")
  const keyword = query.trim().toLowerCase()
  const tasks = useTasksTab(tab === "tasks" ? query : "")

  const expertList = useMemo(
    () =>
      experts.filter(
        (x) =>
          (source === "all" || x.source === source) &&
          (!keyword || `${x.name}${x.role}${x.desc}${x.tags.join()}${x.skills.map((s) => s.name).join()}`.toLowerCase().includes(keyword)),
      ),
    [keyword, source],
  )
  const teamList = useMemo(
    () =>
      expertTeams.filter(
        (x) =>
          (source === "all" || x.source === source) &&
          (!keyword ||
            `${x.name}${x.desc}${x.domains.join()}${x.members.map((id) => experts.find((e) => e.id === id)?.name ?? "").join()}`.toLowerCase().includes(keyword)),
      ),
    [keyword, source],
  )

  const grid = (list: unknown[], children: ReactNode) =>
    list.length === 0 ? (
      <div className="flex-1 flex items-center justify-center p-2">
        <Empty description={t("proto.expert.empty")} />
      </div>
    ) : (
      <div className={DEV_GRID}>{children}</div>
    )

  return (
    <DevPageLayout
      title={t("kcode.nav.expertDev")}
      tabs={TABS.map((value) => ({ value, label: t(`proto.collab.tab.${value}`) }))}
      tab={tab}
      onTabChange={(value) => {
        setSearch(value === "tasks" ? {} : { tab: value }, { replace: true })
        setQuery("")
        setSource("all")
      }}
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder={t(`proto.collab.search.${tab}`)}
      searchWrapperStyle={{ background: "color-mix(in srgb, var(--surface-raised-stronger-non-alpha) 64%, transparent)" }}
      addLabel={t("kcode.appDev.add")}
      onAdd={tab === "tasks" ? tasks.openNew : () => startSession(t(tab === "experts" ? "proto.expert.createDraft" : "proto.team.createDraft"))}
      subToolbar={tab === "tasks" ? tasks.toolbar : <SourceFilter value={source} onChange={setSource} items={tab === "experts" ? experts : expertTeams} />}
    >
      {tab === "tasks" && tasks.content}

      {tab === "experts" &&
        grid(
          expertList,
          expertList.map((expert: Expert) => (
            <Tile
              key={expert.id}
              className="dev-page-tile tile-filled tile-icon-40 group cursor-pointer"
              name={expert.name}
              nameExtra={<SourceBadge source={expert.source} />}
              subname={<span className="text-[12px] leading-[18px] text-[var(--neutral-500)]">{t("proto.expert.skillCount", { count: expert.skills.length })}</span>}
              desc={expert.desc}
              icon={<ExpertAvatar id={expert.id} size={40} />}
              onClick={() => dialog.show(() => <ExpertDetailDialog expert={expert} />)}
              footer={<Chips items={expert.tags.length ? expert.tags : expert.skills.map((s) => s.name)} />}
              action={<CallButton onClick={() => summon({ kind: "expert", id: expert.id })} />}
            />
          )),
        )}

      {tab === "teams" &&
        grid(
          teamList,
          teamList.map((team: ExpertTeam) => (
            <Tile
              key={team.id}
              className="dev-page-tile tile-filled group cursor-pointer"
              name={team.name}
              nameExtra={<SourceBadge source={team.source} />}
              subname={<span className="text-[12px] leading-[18px] text-[var(--neutral-500)]">{t("proto.team.memberCount", { count: team.members.length })}</span>}
              desc={team.desc}
              icon={<ExpertFaces ids={team.members} max={3} size={32} />}
              onClick={() => dialog.show(() => <TeamDetailDialog team={team} />)}
              footer={<Chips items={team.domains} />}
              action={<CallButton onClick={() => summon({ kind: "team", id: team.id })} />}
            />
          )),
        )}
    </DevPageLayout>
  )
}
