import { useEffect, useRef, useState } from "react"
import { Dialog, DropdownMenu, Icon, Tooltip, showToast, useDialog } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { linkedApps } from "@/mock/fixtures/app-dev-data"
import { appDisplayName } from "@/mock/fixtures/apps"

type CreateType = "new" | "extend" | "inherit"
const TYPES: CreateType[] = ["new", "extend", "inherit"]

const FIELD =
  "flex h-10 w-full items-center rounded-[12px] border border-[var(--input-border-color)] bg-[var(--input-bg)] px-3 text-[14px] leading-[22px] text-[var(--neutral-800)] outline-none transition-[border-color] duration-150 hover:border-[var(--neutral-300)] focus:border-[var(--primary-600)]"
const LABEL = "flex items-center gap-1 text-[14px] font-[400] text-[var(--neutral-600)]"

/**
 * 新建应用弹窗：从「关联应用」下拉底部的「新建」打开。
 * 创建类型为扩展 / 继承时要先选一个已有应用（名称默认带出来）；确认后把新应用关联到输入框。
 */
export function NewAppDialog(props: { onCreated: (name: string) => void }) {
  const t = useT()
  const dialog = useDialog()
  const [type, setType] = useState<CreateType>("new")
  const [source, setSource] = useState<string>()
  const [name, setName] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const needSource = type !== "new"

  useEffect(() => {
    const timer = setTimeout(() => input.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      showToast({ description: t("proto.newApp.nameRequired") })
      return input.current?.focus()
    }
    if (needSource && !source) return showToast({ description: t("proto.newApp.sourceRequired") })
    props.onCreated(trimmed)
    showToast({ variant: "success", title: t("proto.newApp.created", { name: trimmed }) })
    dialog.close()
  }

  return (
    <Dialog fit className="dialog-rename-reset">
      <div className="flex w-[456px] flex-col items-start gap-5 rounded-[24px] bg-[var(--rename-bg)] p-5">
        <div className="flex items-center justify-between self-stretch">
          <span className="text-[20px] font-[600] leading-[30px] text-[var(--neutral-800)]">{t("proto.newApp.title")}</span>
          <button
            type="button"
            onClick={dialog.close}
            className="-m-1.5 flex size-7 items-center justify-center rounded-lg border-none bg-transparent p-0 text-[var(--icon-fill)] cursor-pointer transition-colors hover:bg-[var(--icon-bg-hover)]"
            aria-label="Close"
          >
            <Icon name="close" size="small" />
          </button>
        </div>

        <div className="flex flex-col gap-2 self-stretch">
          <span className={LABEL}>
            {t("proto.newApp.type")}
            <Tooltip
              placement="top"
              value={TYPES.map((x) => t(`proto.newApp.tip.${x}`)).join("\n")}
              contentStyle={{ whiteSpace: "pre-line", maxWidth: 320 }}
            >
              <span className="inline-flex text-[var(--neutral-400)]">
                <Icon name="help" size="small" />
              </span>
            </Tooltip>
          </span>
          <div role="radiogroup" className="flex items-center gap-6">
            {TYPES.map((value) => (
              <label key={value} className="flex items-center gap-1.5 text-[14px] text-[var(--neutral-800)] cursor-pointer">
                <input type="radio" name="createType" checked={type === value} onChange={() => setType(value)} className="accent-[var(--primary-600)]" />
                {t(`proto.newApp.type.${value}`)}
              </label>
            ))}
          </div>
        </div>

        {needSource && (
          <div className="flex flex-col gap-2 self-stretch">
            <span className={LABEL}>{t("proto.newApp.source")}</span>
            <DropdownMenu placement="bottom-start" gutter={4}>
              <DropdownMenu.Trigger className={cx(FIELD, "justify-between cursor-pointer")}>
                <span className={cx("truncate", !source && "text-[var(--neutral-400)]")}>{source ?? " "}</span>
                <Icon name="chevron-down-16" size="small" className="shrink-0 text-[var(--neutral-500)]" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content style={{ width: 416, maxHeight: 260, overflowY: "auto" }}>
                  {linkedApps.map((item) => (
                    <DropdownMenu.Item
                      key={item.code}
                      className="flex items-center justify-between gap-3 cursor-pointer"
                      onSelect={() => {
                        setSource(item.app)
                        setName(item.app)
                        requestAnimationFrame(() => input.current?.focus())
                      }}
                    >
                      <span className="truncate">{appDisplayName(item)}</span>
                      <span className="shrink-0 text-[12px] text-[var(--neutral-400)]">{item.cloud}</span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          </div>
        )}

        <div className="flex flex-col gap-2 self-stretch">
          <label className={LABEL}>{t("proto.newApp.name")}</label>
          <input
            ref={input}
            type="text"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) submit()
            }}
            className={FIELD}
          />
        </div>

        <div className="flex items-center justify-end gap-3 self-stretch">
          <button
            type="button"
            onClick={dialog.close}
            className="flex shrink-0 items-center justify-center rounded-lg border-none bg-transparent px-4 py-2 text-sm font-normal leading-[22px] !text-[var(--button-text-text)] cursor-pointer transition-colors hover:bg-[var(--icon-bg-hover)]"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex shrink-0 items-center justify-center rounded-lg border-none !bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-medium leading-5 text-[var(--button-primary-text)] cursor-pointer hover:!bg-[var(--button-primary-bg-hover)]"
          >
            {t("common.ok")}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
