import type { DrawerTarget } from "@/stores/panel"
import { AgentDrawer } from "./AgentDrawer"
import { AppDrawer } from "./AppDrawer"
import { McpAppDrawer } from "./McpAppDrawer"
import { SkillDrawer } from "./SkillDrawer"

/** 右侧面板里的产物抽屉：按产物类型分发到技能预览 / 智能体配置 / 业务组件详情 / 应用预览 */
export function DrawerView(props: { target: DrawerTarget; working: boolean }) {
  const { target } = props
  if (target.kind === "kdskill") return <SkillDrawer key={target.id} id={target.id} working={props.working} />
  if (target.kind === "agentConfig") return <AgentDrawer key={target.id} id={target.id} working={props.working} />
  if (target.kind === "app") return <AppDrawer key={target.id} id={target.id} />
  return <McpAppDrawer key={target.id} id={target.id} working={props.working} />
}
