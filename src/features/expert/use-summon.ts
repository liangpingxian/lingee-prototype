import { useNavigate } from "react-router"
import { usePrompt, type ExpertPick } from "@/stores/prompt"
import { useSync } from "@/stores/sync"

/**
 * 「对话」某位专家或某个专家团：回到新任务页，输入框里已经选好它；带了触发词的话一并填进输入框。
 */
export function useSummon() {
  const navigate = useNavigate()
  return (pick: ExpertPick, text?: string) => {
    const projectId = useSync.getState().projects[0]?.id
    if (!projectId) return
    usePrompt.getState().setPick(pick)
    if (text) usePrompt.getState().setDraft(text)
    navigate(`/p/${projectId}/session`)
  }
}
