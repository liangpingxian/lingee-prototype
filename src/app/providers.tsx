import { useEffect, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DialogHost, ToastRegion, TooltipProvider } from "@/ui"
import { useSync } from "@/stores/sync"

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } })

/** 全局 Provider：数据请求、提示气泡、全局弹窗、Toast；并在启动时拉一次基础数据 */
export function Providers(props: { children: ReactNode }) {
  const bootstrap = useSync((s) => s.bootstrap)
  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={400} skipDelayDuration={0}>
        {props.children}
        <DialogHost />
        <ToastRegion />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
