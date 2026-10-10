import { useState } from "react"
import { Button, DropdownMenu, Icon, showToast, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { linkedApps } from "@/mock/fixtures/app-dev-data"
import { appDisplayName } from "@/mock/fixtures/apps"
import { usePrompt } from "@/stores/prompt"
import { NewAppDialog } from "./NewAppDialog"

/**
 * 「关联应用」：苍穹应用开发时，选一个已有的苍穹应用作为本次开发的对象（搜索 + 列表），
 * 也可以从底部「新建」开一个新应用。只在输入框里选了苍穹应用技能时出现。
 */
export function AppLinkPicker(props: { placement: "top-start" | "bottom-start" }) {
  const t = useT()
  const dialog = useDialog()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { linkedApp, setLinkedApp } = usePrompt()
  const keyword = query.trim().toLowerCase()
  const list = keyword ? linkedApps.filter((x) => x.app.toLowerCase().includes(keyword)) : linkedApps

  const pick = (name: string) => {
    setLinkedApp(name)
    showToast({ description: t("proto.linkApp.linked", { name }) })
  }

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
          data-action="prompt-link-app"
          className="group h-9 max-w-[200px] gap-1 rounded-[12px] border-none px-[8px] py-[7px] hover:bg-[var(--prompt-input-trigger-bg)]"
        >
          <span className={cx("size-1.5 shrink-0 rounded-full", linkedApp ? "bg-[var(--primary-600)]" : "bg-[var(--neutral-300)]")} />
          <span className={cx("truncate text-[14px] font-[400] leading-[22px]", linkedApp ? "text-[var(--neutral-900)]" : "text-[var(--neutral-500)]")}>
            {linkedApp ?? t("proto.linkApp.label")}
          </span>
          <Icon name="arrow-down-12" size="small" className="size-3 shrink-0 text-[var(--neutral-700)] transition-transform duration-150 group-data-[expanded]:rotate-180" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[280px] flex-col p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
          <div className="p-2 pb-1">
            <div className="flex h-8 items-center gap-1.5 rounded-[10px] bg-[var(--neutral-50)] px-2.5">
              <Icon name="search-16" size="small" className="shrink-0 text-[var(--neutral-400)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                // 菜单自带「按字母跳到某一项」，在搜索框里打字时不能让它接管
                onKeyDown={(e) => e.stopPropagation()}
                placeholder={t("proto.linkApp.search")}
                autoComplete="off"
                className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-[var(--neutral-800)] outline-none placeholder:text-[var(--neutral-400)]"
              />
            </div>
          </div>
          <div className="flex max-h-[240px] flex-col gap-[2px] overflow-y-auto px-1 pb-1">
            {list.map((item) => (
              <DropdownMenu.Item key={item.code} onSelect={() => pick(item.app)} className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] leading-[20px] text-[var(--neutral-800)]">{appDisplayName(item)}</span>
                  <span className="block text-[12px] leading-[16px] text-[var(--neutral-400)]">{item.cloud}</span>
                </span>
                {item.app === linkedApp && <Icon name="check" size="small" className="shrink-0 text-[var(--neutral-600)]" />}
              </DropdownMenu.Item>
            ))}
            {list.length === 0 && <div className="px-3 py-4 text-center text-[13px] text-[var(--neutral-400)]">{t("proto.linkApp.empty")}</div>}
          </div>
          <div className="border-t border-[var(--neutral-100)] p-1">
            {linkedApp && (
              <DropdownMenu.Item onSelect={() => setLinkedApp(undefined)} className="flex items-center gap-1.5 cursor-pointer text-[var(--neutral-700)]">
                <Icon name="close-small" size="small" />
                <span>{t("proto.linkApp.clear")}</span>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item
              onSelect={() => dialog.show(() => <NewAppDialog onCreated={setLinkedApp} />)}
              className="flex items-center gap-1.5 cursor-pointer text-[var(--neutral-700)]"
            >
              <Icon name="plus-16" size="small" />
              <span>{t("proto.linkApp.new")}</span>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
