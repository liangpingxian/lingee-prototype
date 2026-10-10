import { useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { BrandButton, DropdownMenu, Icon, showToast, useDialog } from "@/ui"
import { useT } from "@/i18n"
import type { Agent } from "@/mock/fixtures/dev"
import { agentService } from "@/services"
import { canSubmit, canWithdraw, useAgentActions } from "@/features/agent-actions/use-agent-actions"
import { AgentConfigPanel, type AgentConfigHandle } from "@/features/agent-config/AgentConfigPanel"
import { AgentDetailDialog } from "@/features/agent-config/AgentDetailDialog"
import { AgentStatusTag } from "@/features/agent-config/AgentStatusTag"

const Spinner = () => (
  <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
)

/**
 * 智能体配置抽屉：点会话里的智能体卡片、或从开发页点「编辑」时打开，可直接改四个页签的内容。
 * 头部对齐线上 session.tsx 的 AgentConfigContent：名称 + 状态标签、编码；右侧 撤回（审核中才有）/ 保存 / 测试 ▾ / 提交。
 * working：会话里模型还在输出时不允许保存 / 提交，输出结束后自动重新读取（模型可能改了配置）。
 */
export function AgentDrawer(props: { id: string; working: boolean }) {
  const t = useT()
  const dialog = useDialog()
  const panel = useRef<AgentConfigHandle>(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const query = useQuery({ queryKey: ["agent", props.id, props.working], queryFn: () => agentService.get(props.id), staleTime: 0, placeholderData: (prev) => prev })
  const actions = useAgentActions(() => void query.refetch())
  const agent = query.data
  if (!agent) return null
  const locked = props.working || saving || !!actions.busy

  const save = async () => {
    setSaving(true)
    const next = await panel.current?.save()
    setSaving(false)
    if (!next) return undefined
    showToast({ variant: "success", title: t("kcode.agentConfig.saveSuccess") })
    await query.refetch()
    return next
  }
  /** 测试 / 提交前先把没保存的改动落盘，保证推上去的是界面上看到的内容 */
  const withSaved = async (run: (agent: Agent) => void) => {
    const latest = panel.current?.dirty() ? await save() : agent
    if (latest) run(latest)
  }

  return (
    <div className="size-full h-full flex flex-col bg-background-page">
      <div className="shrink-0 flex items-center justify-between gap-3 px-5 pt-6">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            {/* 标题跟着「基础信息」里的名称输入框实时变 */}
            <span className="text-14-medium font-semibold text-text-strong truncate" title={name || agent.name}>
              {name || agent.name}
            </span>
            <AgentStatusTag agent={agent} />
          </div>
          <span className="text-[12px] leading-[16px] text-[var(--text-tile-desc)] font-medium truncate" title={agent.id}>
            {agent.id}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canWithdraw(agent) && (
            <BrandButton variant="secondary" size="normal" icon={actions.busy === "withdraw" ? undefined : "undo"} disabled={locked} onClick={() => actions.withdraw(agent)}>
              {actions.busy === "withdraw" && <Spinner />}
              {t("kcode.agentConfig.withdraw")}
            </BrandButton>
          )}
          <BrandButton variant="secondary" size="normal" icon={saving ? undefined : "save-doc"} disabled={locked} onClick={() => void save()}>
            {saving && <Spinner />}
            {t("kcode.agentConfig.save")}
          </BrandButton>
          {!agent.preset && (
            <DropdownMenu placement="bottom-end" gutter={4}>
              <DropdownMenu.Trigger disabled={locked} data-component="brand-button" data-variant="secondary" data-size="normal">
                {actions.busy === "test" ? <Spinner /> : <Icon name="test-flask" size="small" />}
                {t("kcode.agentConfig.testDropdown")}
                <Icon name="chevron-down-16" size="small" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="test-dropdown-menu">
                  <DropdownMenu.Item className="flex items-center gap-2 cursor-pointer" onSelect={() => void withSaved((x) => void actions.localTest(x))}>
                    <Icon name="monitor" size="small" />
                    <DropdownMenu.ItemLabel>{t("kcode.agentConfig.localTest")}</DropdownMenu.ItemLabel>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-2 cursor-pointer" onSelect={() => void withSaved((x) => actions.cloudTest(x))}>
                    <Icon name="cloud-test" size="small" />
                    <DropdownMenu.ItemLabel>{t("kcode.agentConfig.test")}</DropdownMenu.ItemLabel>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          )}
          {!agent.preset && (
            <BrandButton
              variant="primary"
              size="normal"
              icon={actions.busy === "submit" ? undefined : "submit-upload"}
              disabled={locked || !canSubmit(agent)}
              onClick={() => void withSaved((x) => actions.submit(x))}
            >
              {actions.busy === "submit" && <Spinner />}
              {t("kcode.agentConfig.submit")}
            </BrandButton>
          )}
        </div>
      </div>
      <div className="relative flex-1 min-h-0 h-full p-5">
        <AgentConfigPanel
          ref={panel}
          agent={agent}
          onNameChange={setName}
          onRefresh={() => void query.refetch()}
          onOpenAgent={(sub) => dialog.show(() => <AgentDetailDialog agent={sub} />)}
        />
      </div>
    </div>
  )
}
