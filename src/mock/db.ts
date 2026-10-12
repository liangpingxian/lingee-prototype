import * as fixtures from "./fixtures/projects"
import type { Message, Project, Session } from "./types"

/** 内存数据库：刷新页面即恢复初始数据，方便反复演示 */
export const db = {
  user: fixtures.user,
  models: fixtures.models,
  projects: structuredClone(fixtures.projects) as Project[],
  sessions: structuredClone(fixtures.sessions) as Session[],
  messages: structuredClone(fixtures.messages) as Message[],
}
