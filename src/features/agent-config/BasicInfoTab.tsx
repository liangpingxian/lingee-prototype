import { useRef, type CSSProperties } from "react"
import { publicUrl } from "@/lib/public-url"
import { Input, Switch } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { pickAvatar, type TabProps } from "./form"
import { DomainSelect, ModelLevelSelect } from "./selects"

const CARD_BG = { background: "var(--agent-config-card-bg, var(--surface-raised-stronger-non-alpha))" }

/**
 * 「基础信息」页签：身份卡片（头像 + 名称 + 领域 + 功能描述）和模型策略。
 * hideIdentity：详情弹窗已在页签上方展示名称与头像，这里只留功能描述。
 */
export function BasicInfoTab(props: TabProps & { agentId: string; hideIdentity?: boolean }) {
  const t = useT()
  const file = useRef<HTMLInputElement>(null)
  const { form, set, readonly } = props

  const upload = (picked: File) => {
    const reader = new FileReader()
    reader.onload = () => set({ avatar: String(reader.result) })
    reader.readAsDataURL(picked)
  }

  return (
    <div className="flex flex-col gap-6" style={{ "--input-base": "var(--input-agent-config)" } as CSSProperties}>
      {props.hideIdentity ? (
        <div className="flex flex-col gap-3">
          <div className="text-[14px] font-medium leading-[22px] text-text-strong">{t("kcode.agentConfig.basic.desc")}</div>
          <div className="rounded-[24px] p-4" style={CARD_BG}>
            <div className="text-[14px] leading-[22px] text-text-weak whitespace-pre-wrap break-words">{form.desc}</div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 rounded-[24px] p-4" style={CARD_BG}>
          <div
            className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl overflow-hidden", !readonly && "cursor-pointer")}
            title={readonly ? undefined : t("kcode.agentConfig.basic.changeAvatar")}
            onClick={readonly ? undefined : () => file.current?.click()}
          >
            <img src={publicUrl(form.avatar || pickAvatar(props.agentId))} alt="" className="h-full w-full object-cover" />
          </div>
          <input
            ref={file}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const picked = e.currentTarget.files?.[0]
              if (picked) upload(picked)
              e.currentTarget.value = ""
            }}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* 名称保底 160px：面板过窄时领域换到下一行 */}
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[160px] flex-1">
                <Input
                  label={t("kcode.agentConfig.basic.name")}
                  required
                  readOnly={readonly}
                  value={form.name}
                  onChange={(name) => set({ name })}
                  placeholder={t("kcode.agentConfig.basic.namePlaceholder")}
                />
              </div>
              <div className="w-[220px] max-w-full shrink-0">
                <DomainSelect value={form.domain} onChange={(domain) => set({ domain })} label={t("kcode.agentConfig.basic.domain")} readonly={readonly} />
              </div>
            </div>
            <Input
              label={t("kcode.agentConfig.basic.desc")}
              required
              multiline
              readOnly={readonly}
              value={form.desc}
              onChange={(desc) => set({ desc })}
              placeholder={t("kcode.agentConfig.basic.descPlaceholder")}
              className="min-h-[100px] max-h-[160px] overflow-y-auto"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className={cx("font-medium text-text-strong", props.hideIdentity ? "text-[14px] leading-[22px]" : "text-[16px] leading-6")}>
          {t("kcode.agentConfig.basic.modelPolicy.title")}
        </div>
        <div className="flex flex-col gap-4 rounded-[24px] p-4" style={CARD_BG}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[14px] leading-5 text-text-strong">{t("kcode.agentConfig.basic.modelPolicy.allowSwitch")}</span>
              <span className="text-[12px] leading-4 text-text-weak">{t("kcode.agentConfig.basic.modelPolicy.allowSwitchDesc")}</span>
            </div>
            <Switch className="shrink-0" checked={form.allowModelSwitch} onChange={(allowModelSwitch) => set({ allowModelSwitch })} readOnly={readonly} hideLabel>
              {t("kcode.agentConfig.basic.modelPolicy.allowSwitch")}
            </Switch>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[14px] leading-5 text-text-strong">{t("kcode.agentConfig.basic.modelPolicy.defaultLevel")}</span>
              <span className="text-[12px] leading-4 text-text-weak">{t(`kcode.agentConfig.basic.modelPolicy.levelDesc.${form.defaultModelLevel}`)}</span>
            </div>
            <ModelLevelSelect value={form.defaultModelLevel} onChange={(defaultModelLevel) => set({ defaultModelLevel })} readonly={readonly} />
          </div>
        </div>
      </div>
    </div>
  )
}
