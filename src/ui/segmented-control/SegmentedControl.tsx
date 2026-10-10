import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { cx } from "@/lib/cx"

export interface SegmentedControlProps {
  value: string
  onChange: (value: string) => void
  items: Array<{ value: string; label: ReactNode }>
  size?: "normal" | "small"
  className?: string
}

/** 分段选择器：滑块跟随选中项平移并变宽（位置由实测得出，过渡动效在同步来的 CSS 里） */
export function SegmentedControl(props: SegmentedControlProps) {
  const list = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<CSSProperties>({ width: 0 })

  useLayoutEffect(() => {
    const el = list.current
    if (!el) return
    const measure = () => {
      const active = el.querySelector<HTMLElement>("[data-selected]")
      if (active) setIndicator({ width: active.offsetWidth, transform: `translateX(${active.offsetLeft}px)` })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [props.value, props.items.length])

  return (
    <div data-component="segmented-control" data-size={props.size || "normal"} data-orientation="horizontal" className={props.className}>
      <div data-slot="segmented-control-list" role="tablist" ref={list}>
        <div data-slot="segmented-control-indicator" style={indicator} />
        {props.items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={props.value === item.value}
            data-slot="segmented-control-item"
            data-selected={props.value === item.value ? "" : undefined}
            onClick={() => props.onChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
