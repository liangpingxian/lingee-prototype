import { createBrowserRouter, Navigate, Outlet } from "react-router"
import { AppShell } from "./AppShell"
import { Providers } from "./providers"
import { useSync } from "@/stores/sync"

function Root() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}

/** 首页：线上没有项目时才停留在 "/"，有项目则直接进入第一个项目的新任务页 */
function HomeRedirect() {
  const { ready, projects } = useSync()
  if (!ready) return <div className="size-full" />
  if (projects[0]) return <Navigate to={`/p/${projects[0].id}/session`} replace />
  return <Navigate to="/dev/skill" replace />
}

export const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      {
        Component: AppShell,
        children: [
          { index: true, Component: HomeRedirect },
          { path: "p/:projectId/session/:sessionId?", lazy: () => import("@/pages/session/SessionPage") },
          { path: "dev/:mode", lazy: () => import("@/pages/dev/DevPage") },
          { path: "settings/:section?", lazy: () => import("@/pages/settings/SettingsPage") },
          { path: "*", element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
], { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" })
