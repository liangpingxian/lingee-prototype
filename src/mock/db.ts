import { historyMessages, historyProjects, historySessions, workspaceHistory } from "./collab-seed"
import * as fixtures from "./fixtures/projects"
import type { Message, Project, Session } from "./types"

const workspace = workspaceHistory(fixtures.projects[0].id)

/** 内存数据库：刷新页面即恢复初始数据，方便反复演示 */
export const db = {
  user: fixtures.user,
  models: fixtures.models,
  // 后面几个项目装的是从 lingee 原型带过来的历史会话：任务会话按任务所在项目归组，另有「工作」「管理」两组历史对话
  projects: structuredClone([...fixtures.projects, ...historyProjects]) as Project[],
  sessions: structuredClone([...fixtures.sessions, ...workspace.sessions, ...historySessions]) as Session[],
  messages: structuredClone([...fixtures.messages, ...workspace.messages, ...historyMessages]) as Message[],
}
