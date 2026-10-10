import { taskService } from "@/services/task"
import { currentStage } from "../collab-seed"
import type { Scenario, ScenarioContext } from "./types"

/** 各类阶段的产出文件和说明；按阶段名里的关键词匹配 */
const STAGE_KINDS: Array<{ match: RegExp; file: string; reasoning: string; outputs: string[] }> = [
  { match: /需求/, file: "requirements.md", reasoning: "先把目标拆成可观察的需求：谁在什么场景下要完成什么，做到什么程度算通过；同时写清楚这一期不做什么。", outputs: ["需求清单与优先级", "每条需求的验收条件", "非目标与待确认的依赖"] },
  { match: /设计|规划/, file: "design.md", reasoning: "按已确认的需求划分模块边界，定数据模型和接口；每个设计决定都要能对上一条需求。", outputs: ["模块边界与数据模型", "接口与关键流程", "风险点与验证方式"] },
  { match: /测试|验证|验收/, file: "test-report.md", reasoning: "按验收条件逐条设计用例，独立验证实现；发现的问题要能复现，并说明影响范围。", outputs: ["验收用例与执行结果", "发现的问题与修复确认", "回归影响评估"] },
  { match: /部署|交付|发布/, file: "delivery.md", reasoning: "确认上线前置条件，准备发布步骤和回滚方案，上线后核对关键指标。", outputs: ["发布步骤与回滚方案", "上线检查结果", "交付说明"] },
  { match: /./, file: "implementation.md", reasoning: "按设计逐块实现，每完成一块就针对性验证；改动范围控制在这个阶段的目标内。", outputs: ["已实现的功能点", "关键改动说明", "自测结果"] },
]

/**
 * 剧本：执行协作开发任务的一个阶段。任务执行会话里的每条指令（开始执行 / 退回修改 / 追问）都走这里。
 * - 任务处在执行中：做完这个阶段并提交审核，等用户在会话里确认
 * - 其它状态（讨论、追问）：只回答，不动任务状态
 */
export const taskStageScenario = ({ prompt, taskId }: ScenarioContext): Scenario => {
  const task = taskId ? taskService.peek(taskId) : undefined
  const stage = task && currentStage(task)
  if (!task || !stage || task.status !== "in_progress") {
    return {
      todos: [],
      steps: [
        {
          text: task
            ? `关于任务「${task.title}」：目前${stage ? `在「${stage.title}」阶段` : "还没有执行计划"}。你可以直接说想确认的问题，我按任务描述和已有的阶段产出回答；需要推进时，在下方点「开始执行」。`
            : "这个会话关联的任务已经不存在了。",
        },
      ],
    }
  }

  const kind = STAGE_KINDS.find((x) => x.match.test(stage.title)) ?? STAGE_KINDS[STAGE_KINDS.length - 1]
  const revise = prompt.startsWith("退回修改")
  const retry = prompt.startsWith("重试执行")
  const path = `tasks/${task.code}/${kind.file}`
  return {
    todos: [`理解「${stage.title}」阶段目标`, revise ? "按审核意见修改产出" : "执行并生成阶段产出", "提交审核"],
    steps: [
      {
        todo: 0,
        reasoning: revise
          ? `上一版「${stage.title}」产出被退回了。先对照审核意见找出遗漏的场景，只改有问题的部分，其余保持不变。`
          : retry
            ? `上次「${stage.title}」执行中断了。先确认中断的原因已经排除，再沿用上次的输入从断点继续。`
            : kind.reasoning,
        tools: [{ tool: "read", title: `任务 ${task.code} 的描述与上一阶段产出`, output: task.desc || task.title }],
      },
      {
        todo: 1,
        tools: [{ tool: revise ? "edit" : "write", title: path, output: `# ${task.title} · ${stage.title}\n\n${kind.outputs.map((x) => `- ${x}`).join("\n")}` }],
      },
      {
        todo: 2,
        text: `「${stage.title}」阶段${revise ? "已按审核意见修改并重新" : "已完成并"}提交审核。\n\n## 本阶段产出\n\n${kind.outputs.map((x) => `- ${x}`).join("\n")}\n\n产出文件：\`${path}\`\n\n请在下方确认：**通过** 后流转到下一阶段，**退回修改** 我会按意见调整后重新提交。\n\n> 这是原型工程的模拟回复，内容由剧本生成。`,
      },
    ],
    // 阶段做完才把任务推到「待审核」；中途停止则任务留在执行中
    onFinish: () => void taskService.submitStage(task.id),
  }
}
