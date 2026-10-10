import { useState } from "react"
import { Button, DropdownMenu, Icon, TooltipKeybind, type IconName } from "@/ui"
import { useT } from "@/i18n"
import type { Model } from "@/mock/types"
import { usePrompt } from "@/stores/prompt"
import { useSync } from "@/stores/sync"

const levelIcon = (level?: string): IconName =>
  level === "fast" ? "lightning-charge" : level === "deep" ? "deep-thinking" : level === "expert" ? "level" : "models"

const formatCoefficient = (value?: string) => (value ? `${parseFloat(value).toFixed(1)}x` : undefined)

/** 模型选择器：等级模型（快速/深度/专家）在前，其余模型在后，右侧展示消耗系数 */
export function ModelSelector(props: { placement: "top-end" | "bottom-end" }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const models = useSync((s) => s.models)
  const { modelId, setModel } = usePrompt()
  const current = models.find((x) => x.id === modelId)
  const label = (model: Model) => (model.modelLevel ? t(`model.displayName.${model.modelLevel}`) : model.name)
  const ordered = [...models.filter((x) => x.modelLevel), ...models.filter((x) => !x.modelLevel)]

  return (
    <TooltipKeybind placement="top" gutter={4} title={current ? label(current) : t("command.model.choose")}>
      <DropdownMenu open={open} onOpenChange={setOpen} placement={props.placement} gutter={8}>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="normal"
            className="group max-w-[200px] h-9 py-[7px] px-[8px] rounded-[12px] text-[var(--prompt-input-trigger-text)] text-[14px] font-[400] leading-[22px] gap-1 hover:bg-[var(--prompt-input-trigger-bg)] border-none"
            data-action="prompt-model"
          >
            <Icon name={current ? levelIcon(current.modelLevel) : "refresh"} size="small" className="shrink-0 text-[var(--neutral-600)]" />
            <span className="truncate text-[14px] leading-[22px] font-[400] text-[var(--neutral-700)]">{current ? label(current) : ""}</span>
            <Icon
              name="arrow-down-12"
              size="small"
              className="size-3 shrink-0 transition-transform duration-150 group-data-[expanded]:rotate-180 text-[var(--neutral-700)]"
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="kcode-model-selector__popover"
            style={{ height: Math.min(ordered.length * 34 + 8, 312) }}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="kcode-model-selector__viewport">
              <section className="kcode-model-selector__panel kcode-model-selector__panel--models" tabIndex={-1}>
                <div className="kcode-model-selector__scroll">
                  <div className="kcode-model-selector__model-list" role="listbox" aria-label={t("model.selector.aria.chooseModel")}>
                    {ordered.map((model) => (
                      <DropdownMenu.Item
                        key={model.id}
                        className="kcode-model-selector__model-option"
                        role="option"
                        aria-selected={model.id === modelId}
                        onSelect={() => setModel(model.id)}
                      >
                        <Icon name={levelIcon(model.modelLevel)} size="small" className="shrink-0" />
                        <span className="kcode-model-selector__model-main">
                          <span className="kcode-model-selector__model-label" title={label(model)}>
                            {label(model)}
                          </span>
                        </span>
                        <span className="kcode-model-selector__model-end">
                          {model.consumptionCoefficient && (
                            <span className="kcode-model-selector__model-ratio">{formatCoefficient(model.consumptionCoefficient)}</span>
                          )}
                          {model.id === modelId && (
                            <span className="kcode-model-selector__model-check">
                              <Icon name="check" size="small" />
                            </span>
                          )}
                        </span>
                      </DropdownMenu.Item>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </TooltipKeybind>
  )
}
