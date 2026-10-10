import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import type { Agent } from "@/mock/fixtures/dev"

const CARD = "var(--agent-config-card-bg,var(--surface-raised-stronger-non-alpha))"

const formatTime = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const nextVersion = (last?: string) => {
  if (!last) return "1.0.0"
  const [major = 1, minor = 0, fix = 0] = last.split(".").map(Number)
  return `${major}.${minor}.${fix + 1}`
}

/**
 * 更新日志时间线：最上面是「未发布修改」（橙色节点，列出每条编辑），下面是已发布的版本（最新在前）。
 * compact：详情弹窗里标题字号小一号。
 */
export function ChangelogSection(props: { changelog: Agent["changelog"]; compact?: boolean }) {
  const t = useT()
  const { pending } = props.changelog
  const versions = props.changelog.versions.map((v, i, all) => ({ ...v, latest: i === all.length - 1 })).reverse()
  const total = (pending.length ? 1 : 0) + versions.length

  return (
    <div className="mt-5">
      <div className={cx("font-medium text-text-strong mb-3", props.compact ? "text-[14px] leading-[22px]" : "text-[16px] leading-6")}>
        {t("kcode.agentChangelog.title")}
      </div>
      <div className="rounded-[24px] p-4" style={{ background: "var(--agent-config-card-bg, var(--surface-raised-stronger-non-alpha))" }}>
        {total === 0 && <div className="text-14-regular text-text-base">{t("kcode.agentChangelog.empty")}</div>}

        {pending.length > 0 && (
          <div className="flex gap-[8px]">
            <div className="w-[44px] shrink-0 self-start h-[24px] flex items-center justify-end">
              <span className="text-[14px] font-medium leading-5 uppercase text-text-base">V{nextVersion(props.changelog.versions.at(-1)?.version)}</span>
            </div>
            <div className="relative w-[10px] shrink-0">
              {versions.length > 0 && <div className="absolute left-1/2 -translate-x-1/2 w-px bg-[var(--neutral-200)] top-[12px] bottom-0" />}
              <div className="size-[10px] rounded-full mt-[7px] relative z-[1] border-2 border-[#FF8D42]" style={{ background: CARD }} />
            </div>
            <div className="flex-1 min-w-0 pb-4">
              <div className="h-[24px] flex items-center gap-2">
                <span className="text-[16px] font-medium leading-5 text-[#FF8D42] shrink-0">{t("kcode.agentChangelog.pendingLabel")}</span>
                <span className="text-12-regular text-text-base shrink-0">{t("kcode.agentChangelog.pendingCount", { count: pending.length })}</span>
              </div>
              <div className="mt-3 bg-surface-skill-info rounded-[16px] p-[12px]">
                <div className="max-h-[168px] overflow-y-auto changelog-pending-scroll">
                  {pending.map((record, index) => (
                    <div key={index} className={cx("flex items-baseline gap-2", index > 0 && "mt-2")}>
                      <span className="text-[14px] leading-[22px] text-text-base shrink-0">{formatTime(record.createdAt)}</span>
                      <span className="text-[14px] leading-[22px] text-text-base shrink-0">·</span>
                      <span className="text-[14px] leading-[22px] text-text-base shrink-0 truncate max-w-[120px]" title={record.operator}>
                        {record.operator}
                      </span>
                      <span className="text-[14px] leading-[22px] text-text-base truncate flex-1 min-w-0" title={record.summary}>
                        {record.summary}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {versions.length > 0 && (
          <div className="flex flex-col">
            {versions.map((entry, index) => {
              const first = pending.length === 0 && index === 0
              const last = index === versions.length - 1
              const lines = [
                ...(entry.summary ? [entry.summary] : []),
                ...entry.lines,
              ]
              const shown = lines.length ? lines : [t(entry.version === "1.0.0" ? "kcode.agentChangelog.initialVersion" : "kcode.agentChangelog.noChanges")]
              return (
                <div key={entry.version} className="flex gap-[8px]">
                  <div className="w-[44px] shrink-0 self-start h-[24px] flex items-center justify-end">
                    <span className="text-[14px] font-medium leading-5 uppercase text-text-base">V{entry.version}</span>
                  </div>
                  <div className="relative w-[10px] shrink-0">
                    <div
                      className={cx(
                        "absolute left-1/2 -translate-x-1/2 w-px",
                        total > 1 && "bg-[var(--neutral-200)]",
                        total > 1 && (first ? "top-[12px]" : "top-0"),
                        total > 1 && (last ? "h-[12px]" : "bottom-0"),
                      )}
                    />
                    <div
                      className={cx("size-[10px] rounded-full mt-[7px] relative z-[1] border-2", entry.latest ? "border-[var(--blue-500)]" : "border-[var(--neutral-400)]")}
                      style={{ background: CARD }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="h-[24px] flex items-center gap-2">
                      <span className="text-12-regular text-text-base shrink-0">{formatTime(entry.releasedAt)}</span>
                      <span className="text-12-regular text-text-weak shrink-0">·</span>
                      <span className="text-12-regular text-text-base truncate" title={entry.operator}>
                        {entry.operator}
                      </span>
                      {entry.latest && (
                        <span className="text-[12px] font-normal leading-[18px] text-[#2970FF] px-[6px] py-[3px] rounded-[6px] bg-[rgba(77,137,255,0.08)] shrink-0">
                          {t("kcode.agentChangelog.publishedTag")}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 bg-surface-skill-info rounded-[16px] p-[12px]">
                      {shown.map((line, i) => (
                        <div
                          key={i}
                          className={cx("text-[14px] text-text-base leading-[22px] break-all", !!entry.summary && i === 0 && "font-medium text-text-strong")}
                          title={line}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
