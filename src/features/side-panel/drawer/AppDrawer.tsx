import { useMemo, useState, type ReactNode } from "react"
import { Icon, Tooltip, showToast, type IconName } from "@/ui"
import { cx } from "@/lib/cx"
import { useT } from "@/i18n"
import { apiRows, mcpTools, type CosmicMeta, type McpTool } from "@/mock/fixtures/app-dev-data"
import { appService } from "@/services"

type Tab = "form" | "list" | "entity" | "plugin" | "api" | "mcp"
const TABS: Tab[] = ["form", "list", "entity", "plugin", "api", "mcp"]

const TH = "sticky top-0 z-[1] bg-[var(--neutral-50)] px-3 py-[9px] text-left text-[12px] font-[500] text-[var(--neutral-500)] border-b border-[var(--neutral-100)] whitespace-nowrap bg-clip-padding"
const TD = "px-3 py-2 text-[13px] text-[var(--neutral-800)] border-b border-[var(--neutral-50)]"
const CODE = "font-mono text-[12px]"

/** 「是否必录 / 是否启用」一列的圆形对勾 */
function Check(props: { on: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex size-[18px] items-center justify-center rounded-full",
        props.on ? "bg-[var(--success-50,#e6f7ed)] text-[var(--success-600,#08a040)]" : "bg-[var(--neutral-50)]",
      )}
    >
      {props.on && <Icon name="check-small" size="small" />}
    </span>
  )
}

function NavButton(props: { icon: IconName; tip: string; disabled?: boolean; pressed?: boolean; onClick?: () => void }) {
  return (
    <Tooltip value={props.tip} placement="bottom" openDelay={300}>
      <button
        type="button"
        disabled={props.disabled}
        aria-label={props.tip}
        aria-pressed={props.pressed}
        onClick={props.onClick}
        className={cx(
          "flex size-7 shrink-0 items-center justify-center rounded-[8px] border-none cursor-pointer transition-colors disabled:cursor-default disabled:opacity-40",
          props.pressed ? "bg-[var(--primary-500-6)] text-[var(--primary-600)]" : "bg-transparent text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]",
        )}
      >
        <Icon name={props.icon} size="small" />
      </button>
    </Tooltip>
  )
}

/** 预览区：地址栏（后退 / 前进 / 刷新 / 地址 / 编辑 / 选择元素 / 切换尺寸）+ 页面 */
function Browser(props: { html: string; url: string }) {
  const t = useT()
  const [url, setUrl] = useState(props.url)
  const [reload, setReload] = useState(0)
  const [editing, setEditing] = useState(false)
  const [picking, setPicking] = useState(false)
  const [mobile, setMobile] = useState(false)
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-1 border-b border-[var(--neutral-100)] px-3 py-1.5">
        <NavButton icon="chevron-left" tip={t("proto.appDev.preview.back")} disabled />
        <NavButton icon="chevron-right" tip={t("proto.appDev.preview.forward")} disabled />
        <NavButton icon="refresh" tip={t("session.files.refresh")} onClick={() => setReload(reload + 1)} />
        <input
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label={t("proto.appDev.preview.url")}
          className="mx-1 h-7 min-w-0 flex-1 rounded-[8px] border-none bg-[var(--neutral-50)] px-3 text-[12px] text-[var(--neutral-700)] outline-none focus:bg-[var(--neutral-100)]"
        />
        <NavButton icon="edit" tip={t("proto.appDev.preview.edit")} pressed={editing} onClick={() => setEditing(!editing)} />
        <NavButton icon="window-cursor" tip={t("proto.appDev.preview.pick")} pressed={picking} onClick={() => setPicking(!picking)} />
        <NavButton
          icon="monitor"
          tip={t(mobile ? "proto.appDev.preview.desktop" : "proto.appDev.preview.mobile")}
          pressed={mobile}
          onClick={() => setMobile(!mobile)}
        />
      </div>
      <div className={cx("flex min-h-0 flex-1 justify-center", mobile && "bg-[var(--neutral-50)] py-4")}>
        <iframe
          key={reload}
          title={props.url}
          srcDoc={props.html}
          sandbox="allow-scripts allow-forms"
          className={cx("h-full border-none bg-white", mobile ? "w-[390px] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "w-full")}
        />
      </div>
    </div>
  )
}

const TAG_COLORS: Record<string, string> = { 已审核: "#08a040", 待审核: "#c06010", 已关闭: "#e04a3a" }

function ListTab(props: { meta: CosmicMeta }) {
  const t = useT()
  const { meta } = props
  const [query, setQuery] = useState("")
  const [checked, setChecked] = useState<string[]>([])
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 }>()
  const rows = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const list = meta.rows.filter((row) => !keyword || row.join(" ").toLowerCase().includes(keyword))
    if (!sort) return list
    const num = (value: string) => Number(value.replace(/,/g, ""))
    return [...list].sort((a, b) => {
      const [x, y] = [a[sort.col], b[sort.col]]
      return (Number.isNaN(num(x)) || Number.isNaN(num(y)) ? x.localeCompare(y) : num(x) - num(y)) * sort.dir
    })
  }, [meta.rows, query, sort])
  const allChecked = rows.length > 0 && rows.every((row) => checked.includes(row[0]))
  const act = (label: string) => showToast({ description: checked.length ? `${label}：${checked.length} 条` : t("proto.appDev.list.pickFirst") })

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-4 pt-3 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[15px] font-[600] text-[var(--neutral-900)]">{meta.listTitle}</div>
          <div className="flex h-8 w-[240px] items-center gap-1.5 rounded-[8px] border border-[var(--neutral-100)] px-2.5">
            <Icon name="search-16" size="small" className="text-[var(--neutral-400)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              placeholder={meta.searchPlaceholder}
              className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-[var(--neutral-800)] outline-none placeholder:text-[var(--neutral-400)]"
            />
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          {(["new", "delete", "submit", "audit", "export", "print"] as const).map((key, index) => (
            <button
              key={key}
              type="button"
              onClick={() => (key === "new" ? showToast({ description: t("proto.appDev.list.new") }) : act(t(`proto.appDev.list.${key}`)))}
              className={cx(
                "h-7 rounded-[6px] px-3 text-[12px] cursor-pointer transition-colors",
                index === 0
                  ? "border-none bg-[var(--primary-600)] text-[var(--white-100)] hover:opacity-90"
                  : "border border-[var(--neutral-100)] bg-transparent text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]",
              )}
            >
              {t(`proto.appDev.list.${key}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className={cx(TH, "w-9")}>
                <input type="checkbox" checked={allChecked} onChange={() => setChecked(allChecked ? [] : rows.map((row) => row[0]))} />
              </th>
              {meta.columns.map((column, col) => (
                <th
                  key={column}
                  className={cx(TH, "cursor-pointer select-none hover:text-[var(--neutral-800)]")}
                  onClick={() => setSort(sort?.col === col ? (sort.dir === 1 ? { col, dir: -1 } : undefined) : { col, dir: 1 })}
                >
                  {column}
                  {sort?.col === col && <span className="ml-1">{sort.dir === 1 ? "↑" : "↓"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="hover:bg-[var(--neutral-50)]">
                <td className={TD}>
                  <input
                    type="checkbox"
                    checked={checked.includes(row[0])}
                    onChange={() => setChecked(checked.includes(row[0]) ? checked.filter((x) => x !== row[0]) : [...checked, row[0]])}
                  />
                </td>
                {row.map((cell, i) => (
                  <td key={i} className={cx(TD, "whitespace-nowrap", i === 0 && "text-[var(--primary-600)]")}>
                    {TAG_COLORS[cell] ? (
                      <span
                        className="inline-flex h-5 items-center rounded-[3px] border px-2 text-[11px] font-[500]"
                        style={{ borderColor: TAG_COLORS[cell], color: TAG_COLORS[cell] }}
                      >
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 items-center justify-between border-t border-[var(--neutral-100)] px-4 py-2 text-[12px] text-[var(--neutral-500)]">
        <span>{t("proto.appDev.list.pager", { count: rows.length })}</span>
        <span className="inline-flex size-6 items-center justify-center rounded-[4px] bg-[var(--primary-600)] text-[var(--white-100)]">1</span>
      </div>
    </div>
  )
}

function EntityTab(props: { meta: CosmicMeta }) {
  const t = useT()
  const [active, setActive] = useState(0)
  return (
    <div className="flex h-full min-h-0">
      <div className="w-[200px] shrink-0 overflow-y-auto border-r border-[var(--neutral-100)] py-2">
        {props.meta.entities.map((entity, index) => (
          <button
            key={entity.name}
            type="button"
            onClick={() => setActive(index)}
            className={cx(
              "flex w-full items-center gap-2 border-none px-3.5 py-2 text-left text-[13px] text-[var(--neutral-800)] cursor-pointer transition-colors",
              index === active ? "bg-[var(--neutral-100)] font-[500]" : "bg-transparent hover:bg-[var(--neutral-50)]",
            )}
          >
            <Icon name="edit-doc-16" size="small" className="shrink-0 text-[var(--neutral-500)]" />
            <span className="min-w-0 flex-1 truncate">{entity.name}</span>
            <span className="shrink-0 text-[11px] text-[var(--neutral-400)]">{t("proto.appDev.entity.count", { count: entity.count })}</span>
          </button>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-auto">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr>
              {(["name", "key", "type", "required"] as const).map((key) => (
                <th key={key} className={TH}>
                  {t(`proto.appDev.entity.${key}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.meta.fields.map((field) => (
              <tr key={field.key}>
                <td className={TD}>{field.name}</td>
                <td className={cx(TD, CODE)}>{field.key}</td>
                <td className={TD}>{field.type}</td>
                <td className={TD}>
                  <Check on={field.required} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SimpleTable(props: { head: string[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse" style={{ minWidth: props.minWidth ?? 600 }}>
        <thead>
          <tr>
            {props.head.map((label, i) => (
              <th key={i} className={TH}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </table>
    </div>
  )
}

const METHOD_COLORS: Record<string, string> = { GET: "#08a040", POST: "#495dff", PUT: "#c06010", DELETE: "#e04a3a" }

function McpRow(props: { tool: McpTool }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const { tool } = props
  const details: Array<[string, ReactNode]> = [
    [t("proto.appDev.mcp.uniqueId"), <span className={CODE}>{tool.toolUniqueID}</span>],
    [t("proto.appDev.mcp.targetApi"), <span className={CODE}>{tool.targetAPI}</span>],
    [t("proto.appDev.mcp.domain"), tool.domain],
    [t("proto.appDev.mcp.module"), tool.module],
    [t("proto.appDev.mcp.sensitive"), tool.sensitive ? <span className="text-[#e04a3a]">{t("proto.appDev.mcp.sensitive.yes")}</span> : t("proto.appDev.mcp.no")],
    [t("proto.appDev.mcp.source"), tool.serviceSource],
    [t("proto.appDev.mcp.customParams"), tool.customParams ? t("proto.appDev.mcp.configured") : "—"],
    [t("proto.appDev.mcp.errorLog"), tool.errorLog],
  ]
  const blocks: Array<[string, string]> = [
    [t("proto.appDev.mcp.precond"), tool.precond],
    [t("proto.appDev.mcp.postcond"), tool.postcond],
    [t("proto.appDev.mcp.recovery"), tool.recovery],
  ]
  return (
    <>
      <tr className="cursor-pointer hover:bg-[var(--neutral-50)]" onClick={() => setOpen(!open)}>
        <td className={cx(TD, CODE, "whitespace-nowrap")}>{tool.tool}</td>
        <td className={cx(TD, "whitespace-nowrap")}>{tool.desc}</td>
        <td className={cx(TD, "whitespace-nowrap")}>{tool.actionType}</td>
        <td className={cx(TD, "whitespace-nowrap")}>{t(tool.status === "published" ? "proto.appDev.mcp.published" : "proto.appDev.mcp.failed")}</td>
        <td className={cx(TD, "text-center")}>
          <Icon name="chevron-right" size="small" className={cx("text-[var(--neutral-500)] transition-transform", open && "rotate-90")} />
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={5} className="border-b border-[var(--neutral-50)] bg-[var(--neutral-50)] px-3.5 py-2.5">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[12px] leading-[1.8] text-[var(--neutral-800)]">
              {details.map(([label, value]) => (
                <div key={label} className="contents">
                  <span className="text-[var(--neutral-500)]">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              {blocks
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="contents">
                    <span className="self-start text-[var(--neutral-500)]">{label}</span>
                    <pre className="m-0 whitespace-pre-wrap rounded-[4px] bg-[var(--neutral-100)] px-2 py-1.5 font-mono text-[11px]">{value}</pre>
                  </div>
                ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/**
 * 应用预览抽屉：从应用开发页点卡片、或点会话里的应用产物卡片时打开。
 * - 通用应用：内置浏览器，直接打开系统地址
 * - 苍穹应用：表单 / 列表 / 实体 / 插件 / API / MCP 六个页签，内容来自应用的元数据
 */
export function AppDrawer(props: { id: string }) {
  const t = useT()
  const [tab, setTab] = useState<Tab>("form")
  const app = appService.get(props.id)
  if (!app) return null
  if (app.kind === "general") return <Browser html={app.html} url={app.url} />

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div role="tablist" className="flex h-10 shrink-0 items-stretch gap-5 border-b border-[var(--neutral-100)] px-4">
        {TABS.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cx(
              "-mb-px border-0 border-b-2 border-solid bg-transparent p-0 text-[13px] font-[500] cursor-pointer whitespace-nowrap transition-colors",
              tab === value ? "border-[var(--primary-600)] text-[var(--primary-600)]" : "border-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-800)]",
            )}
          >
            {t(`proto.appDev.tab.${value}`)}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        {tab === "form" && <Browser html={app.html} url={app.url} />}
        {tab === "list" && <ListTab meta={app.meta} />}
        {tab === "entity" && <EntityTab meta={app.meta} />}
        {tab === "plugin" && (
          <SimpleTable head={(["type", "className", "desc", "enabled"] as const).map((key) => t(`proto.appDev.plugin.${key}`))}>
            {app.meta.plugins.map((plugin) => (
              <tr key={plugin.className}>
                <td className={cx(TD, "whitespace-nowrap text-[var(--primary-600)]")}>{plugin.type}</td>
                <td className={cx(TD, CODE, "whitespace-nowrap")}>{plugin.className}</td>
                <td className={TD}>{plugin.desc}</td>
                <td className={TD}>
                  <Check on={plugin.enabled} />
                </td>
              </tr>
            ))}
          </SimpleTable>
        )}
        {tab === "api" && (
          <SimpleTable head={(["method", "path", "desc", "note"] as const).map((key) => t(`proto.appDev.api.${key}`))}>
            {apiRows.map((api) => (
              <tr key={`${api.method} ${api.path}`}>
                <td className={TD}>
                  <span className="font-mono text-[11px] font-[600]" style={{ color: METHOD_COLORS[api.method] }}>
                    {api.method}
                  </span>
                </td>
                <td className={cx(TD, CODE, "whitespace-nowrap")}>{api.path}</td>
                <td className={cx(TD, "whitespace-nowrap")}>{api.desc}</td>
                <td className={TD}>{api.note}</td>
              </tr>
            ))}
          </SimpleTable>
        )}
        {tab === "mcp" && (
          <SimpleTable head={[t("proto.appDev.mcp.tool"), t("proto.appDev.mcp.desc"), t("proto.appDev.mcp.actionType"), t("proto.appDev.mcp.status"), ""]}>
            {mcpTools.map((tool) => (
              <McpRow key={tool.id} tool={tool} />
            ))}
          </SimpleTable>
        )}
      </div>
    </div>
  )
}
