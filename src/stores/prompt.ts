import { create } from "zustand"

export type AgentMode = "build" | "spec" | "quest"

/** 输入框里选中的专家或专家团 */
export interface ExpertPick {
  kind: "expert" | "team"
  id: string
}

interface PromptState {
  mode: AgentMode
  modelId: string
  /** 外部（推荐卡片、技能入口、开发页的「编辑」）写入输入框的草稿；seq 变化时编辑器才会重新灌入。sessionId 为空表示给新任务页的输入框 */
  draft: { text: string; seq: number; sessionId?: string }
  /** 已被输入框取走的草稿序号，避免输入框重新挂载时把旧草稿再灌一遍 */
  consumed: number
  /** 苍穹应用开发时关联的应用；发送时带进提示词 */
  linkedApp?: string
  /** 指定由哪位专家 / 哪个专家团来做；不选则自动匹配 */
  pick?: ExpertPick
  setMode: (mode: AgentMode) => void
  toggleMode: (mode: "spec" | "quest") => void
  setModel: (modelId: string) => void
  setLinkedApp: (name?: string) => void
  setPick: (pick?: ExpertPick) => void
  setDraft: (text: string, sessionId?: string) => void
  /** 取走发给自己（新任务页或指定会话）且尚未消费的草稿；没有则返回 undefined */
  takeDraft: (sessionId?: string) => string | undefined
}

/** 输入框相关的会话外状态：模式（Build/Spec/目标）、当前模型、关联应用、选中的专家、待灌入的草稿 */
export const usePrompt = create<PromptState>((set, get) => ({
  mode: "build",
  modelId: "lingee-deep",
  draft: { text: "", seq: 0 },
  consumed: 0,
  setMode: (mode) => set({ mode }),
  // 互斥：再次选择当前模式则回到 build
  toggleMode: (mode) => set((s) => ({ mode: s.mode === mode ? "build" : mode })),
  setModel: (modelId) => set({ modelId }),
  setLinkedApp: (linkedApp) => set({ linkedApp }),
  setPick: (pick) => set({ pick }),
  setDraft: (text, sessionId) => set((s) => ({ draft: { text, seq: s.draft.seq + 1, sessionId } })),
  takeDraft: (sessionId) => {
    const { draft, consumed } = get()
    if (draft.seq === consumed || draft.sessionId !== sessionId) return undefined
    set({ consumed: draft.seq })
    return draft.text
  },
}))
