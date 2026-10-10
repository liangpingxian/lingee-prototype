import { fileContent, projectFilePaths, sessionDiffs } from "@/mock/fixtures/files"
import { latency } from "@/mock/latency"

export const fileService = {
  /** 项目下全部文件的相对路径 */
  list: (projectId: string) => latency(projectFilePaths[projectId] ?? [], 200),
  read: (_projectId: string, path: string) => latency(fileContent(path), 150),
  /** 会话产生的文件变更 */
  diff: (sessionId: string) => latency(sessionDiffs[sessionId] ?? [], 200),
}
