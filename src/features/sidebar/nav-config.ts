import type { IconName } from "@/ui"

export type DevMode = "skill" | "agent" | "app" | "mcpapp" | "expert" | "cloudTenant"

/** 左侧开发导航：顺序、图标、文案 key 与线上一致 */
export const NAV_ITEMS: Array<{ id: DevMode; icon: IconName; labelKey: string }> = [
  { id: "skill", icon: "skill-bolt", labelKey: "kcode.nav.skillDev" },
  { id: "agent", icon: "ai-partner", labelKey: "kcode.nav.agentDev" },
  { id: "app", icon: "app-grid", labelKey: "kcode.nav.appDev" },
  { id: "mcpapp", icon: "cube", labelKey: "kcode.nav.mcpDev" },
  { id: "expert", icon: "collab", labelKey: "kcode.nav.expertDev" },
  { id: "cloudTenant", icon: "cloud", labelKey: "kcode.nav.cloudTenant" },
]

export type TopTab = "chat" | "work" | "dev"

export const TOP_TABS: Array<{ id: TopTab; icon: IconName; labelKey: string }> = [
  { id: "chat", icon: "chat", labelKey: "kcode.tab.chat" },
  { id: "work", icon: "work", labelKey: "kcode.tab.work" },
  { id: "dev", icon: "dev", labelKey: "kcode.tab.dev" },
]
