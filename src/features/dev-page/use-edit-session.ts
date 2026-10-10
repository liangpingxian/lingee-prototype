import { useNavigate } from "react-router"
import { sessionService } from "@/services"
import { useLayout } from "@/stores/layout"
import { usePrompt } from "@/stores/prompt"
import { useSync } from "@/stores/sync"

/** 进入编辑会话时右侧要打开的抽屉，对应地址里的 ?kdskill= / ?agent= / ?mcpapp= */
export type EditTarget = { kdskill: string } | { agent: string } | { mcpapp: string }

/**
 * 从开发页点「编辑」：和线上一样，不是停在新任务页，而是先建好一个会话直接进去。
 * 进去后输入框里已经带着「/技能 编辑【名称】：」，右侧同时打开这个产物的抽屉，用户接着写要改什么就行。
 */
export function useEditSession() {
  const navigate = useNavigate()
  return async (options: { title: string; draft: string; projectId: string; target: EditTarget }) => {
    const projects = useSync.getState().projects
    const projectId = projects.find((x) => x.id === options.projectId)?.id ?? projects[0]?.id
    if (!projectId) return
    const session = await sessionService.create(projectId, options.title)
    useSync.getState().apply({ type: "session.updated", session })
    useSync.setState((s) => ({ messages: { ...s.messages, [session.id]: [] } }))
    useLayout.getState().expandGroup(projectId)
    usePrompt.getState().setDraft(options.draft, session.id)
    navigate(`/p/${projectId}/session/${session.id}?${new URLSearchParams(options.target).toString()}`)
  }
}
