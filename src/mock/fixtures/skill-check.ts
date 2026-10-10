/** 技能检查的 mock：十个检查项分三大类，个别技能预置了不通过 / 警告的结果 */

export type CheckItemKey = "dir" | "yaml" | "body" | "script" | "kingdee" | "N1" | "N2" | "security" | "S1" | "N3"
export type CheckStatus = "pending" | "running" | "pass" | "fail" | "warn"
export interface CheckResult {
  status: CheckStatus
  reason?: string
}

export const CHECK_CATEGORIES: Array<{ key: "spec" | "security" | "resource"; items: CheckItemKey[] }> = [
  { key: "spec", items: ["dir", "yaml", "body", "script", "kingdee", "N1", "N2"] },
  { key: "security", items: ["security", "S1"] },
  { key: "resource", items: ["N3"] },
]

export const CHECK_ORDER = CHECK_CATEGORIES.flatMap((x) => x.items)

export const emptyCheckItems = () =>
  Object.fromEntries(CHECK_ORDER.map((key) => [key, { status: "pending" }])) as Record<CheckItemKey, CheckResult>

/** 预置的非通过结果：技能 id → 检查项 → 结果。没列出的项一律通过 */
export const presetCheckResults: Record<string, Partial<Record<CheckItemKey, CheckResult>>> = {
  sk_leave: {
    yaml: { status: "fail", reason: "frontmatter 缺少必填字段 description" },
    body: { status: "fail", reason: "未说明跨年假期的处理方式" },
  },
  sk_ar: { N1: { status: "warn", reason: "SKILL.md 已达 18KB，建议把字段说明拆到 references/" } },
  sk_supplier: { N3: { status: "fail", reason: "未找到 MCP 工具 supplier_score_query" } },
}
