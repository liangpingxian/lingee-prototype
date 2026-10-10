import { agentCreateScenario } from "./agent-create"
import { appCreateScenario } from "./app-create"
import { mcpAppCreateScenario } from "./mcp-app-create"
import { skillCreateScenario } from "./skill-create"
import { taskStageScenario } from "./task-stage"
import type { Scenario, ScenarioContext } from "./types"

export type { Scenario, ScenarioStep } from "./types"

/** 按提示词开头的技能（/xxx）挑剧本：智能体开发、业务组件开发、应用开发各有一套，其余都按技能开发回放 */
export function pickScenario(ctx: ScenarioContext): Scenario {
  // 任务执行会话：不看技能，按任务当前阶段回放
  if (ctx.taskId) return taskStageScenario(ctx)
  const skill = ctx.prompt.match(/^\/(\S+)/)?.[1]
  if (skill === "ai-partner-creator") return agentCreateScenario(ctx)
  if (skill === "mcp-apps-builder") return mcpAppCreateScenario(ctx)
  if (skill === "app-build" || skill === "standalone-build") return appCreateScenario(ctx)
  return skillCreateScenario(ctx)
}
