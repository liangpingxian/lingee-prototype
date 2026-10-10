import { useState } from "react"
import { useNavigate } from "react-router"
import { BrandButton, ConfirmDialog, DropdownMenu, Empty, Icon, Tile, showToast, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import type { DevApp } from "@/mock/fixtures/apps"
import { appService } from "@/services"
import { useLayout } from "@/stores/layout"
import { useSync } from "@/stores/sync"
import { DEV_GRID, DOT_BUTTON, DevPageLayout } from "@/features/dev-page/DevPageLayout"
import { useDevList } from "@/features/dev-page/use-dev-list"
import { useStartSession } from "@/features/dev-page/use-start-session"

type AppCard = Pick<DevApp, "id" | "name" | "desc" | "kind">

/** 「新建」下拉的两种应用类型：选中后带着对应的开发技能进入新任务页 */
const NEW_APP_KINDS = [
  { kind: "general", skill: "standalone-build", labelKey: "kcode.starter.app.general" },
  { kind: "cosmic", skill: "app-build", labelKey: "kcode.starter.app.erp" },
] as const

function AppCardActions(props: { app: AppCard; onDelete: () => void }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cx(
        "flex items-center transition-opacity duration-150",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu placement="bottom-start" open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger aria-label="more" className={DOT_BUTTON}>
          <Icon name="dot-grid" size="small" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content style={{ minWidth: 100 }}>
            <DropdownMenu.Item onSelect={props.onDelete} className="group/delete flex items-center cursor-pointer gap-1" variant="destructive">
              <Icon name="trash-16" size="small" className="group-hover/delete:text-[var(--text-on-error-base)]" />
              <span className="group-hover/delete:text-[var(--text-on-error-base)]">{t("kcode.appDev.menu.delete")}</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </div>
  )
}

/**
 * 应用开发页：应用卡片列表 + 搜索 + 「新建」（通用应用 / 苍穹应用）。
 * 点卡片进入这个应用的开发会话，右侧同时打开应用预览。
 */
export function AppDevPage() {
  const t = useT()
  const dialog = useDialog()
  const navigate = useNavigate()
  const startSession = useStartSession()
  const data = useDevList<AppCard>({
    queryKey: "apps",
    fetch: appService.list,
    matchTab: () => true,
    searchText: (app) => `${app.name} ${app.desc}`,
  })

  const open = async (app: AppCard) => {
    const projectId = useSync.getState().projects[0]?.id
    if (!projectId) return
    const session = await appService.openSession(app.id, projectId)
    if (!session) return
    useSync.getState().apply({ type: "session.updated", session })
    useLayout.getState().expandGroup(session.projectId)
    navigate(`/p/${session.projectId}/session/${session.id}?app=${app.id}`)
  }

  const remove = (app: AppCard) =>
    dialog.show(() => (
      <ConfirmDialog
        variant="danger"
        title={t("kcode.appDev.delete.title")}
        description={t("kcode.appDev.delete.content")}
        cancelText={t("kcode.appDev.delete.cancel")}
        confirmText={t("kcode.appDev.delete.confirm")}
        onConfirm={() => {
          data.update((items) => items.filter((x) => x.id !== app.id))
          void appService.remove(app.id)
          showToast({ variant: "success", title: t("kcode.appDev.delete.success") })
        }}
      />
    ))

  return (
    <DevPageLayout
      title={t("kcode.appDev.title")}
      searchWrapperStyle={{ background: "color-mix(in srgb, var(--surface-raised-stronger-non-alpha) 64%, transparent)" }}
      addBeforeAction={
        <DropdownMenu placement="bottom-end">
          <DropdownMenu.Trigger asChild>
            <BrandButton variant="primary" size="normal" icon="plus-fill" iconSize="xs">
              {t("kcode.appDev.add")}
              <Icon name="chevron-down-16" size="small" />
            </BrandButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content style={{ minWidth: 140 }}>
              {NEW_APP_KINDS.map((item) => (
                <DropdownMenu.Item key={item.kind} onSelect={() => startSession(`/${item.skill} `)} className="flex items-center cursor-pointer gap-1">
                  <Icon name={item.kind === "general" ? "app-general" : "app-cosmic"} size="small" />
                  <span>{t(item.labelKey)}</span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>
      }
      tab={data.tab}
      onTabChange={data.setTab}
      searchValue={data.query}
      onSearchChange={data.setQuery}
      onRefresh={data.refresh}
      searchPlaceholder={t("kcode.appDev.search")}
    >
      {data.loading ? (
        <div className="text-14-regular text-text-weak py-8 text-center">{t("kcode.appDev.loading")}</div>
      ) : data.list.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-2">
          <Empty description={t(data.filtered ? "kcode.appDev.empty.noMatch" : "kcode.appDev.empty")} />
        </div>
      ) : (
        <div className={DEV_GRID}>
          {data.list.map((app) => (
            <Tile
              key={app.id}
              className="dev-page-tile tile-filled tile-icon-40 group cursor-pointer"
              name={app.name}
              desc={app.desc}
              icon={
                <div className="flex size-10 items-center justify-center rounded-[12px] bg-[var(--primary-500-6)] text-[var(--primary-600)]">
                  <Icon name="app-grid" />
                </div>
              }
              onClick={() => void open(app)}
              footer={<span className="text-[12px] leading-[18px] whitespace-nowrap text-[var(--neutral-500)]">{t(`kcode.appDev.type.${app.kind}`)}</span>}
              action={<AppCardActions app={app} onDelete={() => remove(app)} />}
            />
          ))}
        </div>
      )}
    </DevPageLayout>
  )
}
