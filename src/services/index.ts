import { db } from "@/mock/db"
import { latency } from "@/mock/latency"

export * from "./project"
export * from "./session"

export const userService = { current: () => latency(db.user) }
export const modelService = { list: () => latency(db.models) }
export * from "./dev"
export * from "./file"
