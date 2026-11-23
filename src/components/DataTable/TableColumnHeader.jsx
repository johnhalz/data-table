import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { flexRender } from '@tanstack/react-table'
import { widthPxForCellButtons } from './cellButtonWidth.js'
import { copyText } from './utils.js'
import { useDT } from './context.js'

const COPY_ICON =
  'M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z'

export default function TableColumnHeader({ header, table }) {
  const { showDataTypes = true, themeVars = {}, showRowBorders = true, showColumnBorders = true } = useDT()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const thRef = useRef(null)
  const meta = header.column.columnDef.meta || {}
  const sorted = header.column.getIsSorted()

  function toggle(e) {
    e.stopPropagation()
    if (!open && thRef.current) {
      const rect = thRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 2, left: rect.left })
    }
    setOpen(!open)
  }

  const run = (fn) => () => {
    fn()
    setOpen(false)
  }

  // absent when the table has no columnResizingFeature (MiniTable)
  const onResizeStart = (e) => header.getResizeHandler?.()?.(e)

  function autoFitColumn(e) {
    e.stopPropagation()
    const th = thRef.current
    if (typeof document === 'undefined' || !th) return
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) return
    const ff = getComputedStyle(th).fontFamily
    ctx.font = `13px ${ff && ff.trim() !== '' ? ff : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}`

    const col = header.column
    const colMeta = col.columnDef.meta || {}
    let contentWidth = ctx.measureText(typeof col.columnDef.header === 'string' ? col.columnDef.header : String(col.id)).width
    if (showDataTypes && colMeta.type) contentWidth += 6 + ctx.measureText(String(colMeta.type)).width
    const isFixedUiCell = (colMeta.type === 'boolean' && !colMeta.badge) || !!colMeta.progressBar || typeof colMeta.render === 'function'
    if (!isFixedUiCell) {
      for (const row of table.getFilteredRowModel().rows) {
        const value = row.getValue(col.id)
        if (value == null) continue
        contentWidth = Math.max(contentWidth, ctx.measureText(String(value)).width)
      }
    }
    if (Array.isArray(colMeta.cellButtons) && colMeta.cellButtons.length > 0) {
      contentWidth += widthPxForCellButtons(colMeta.cellButtons)
    }
    const ownSize = typeof colMeta.render === 'function' ? (col.columnDef.size ?? 0) : 0
    const newWidth = Math.min(Math.max(Math.ceil(contentWidth) + 16 + 28, ownSize, 60), 500)
    table.setColumnSizing((prev) => ({ ...prev, [col.id]: newWidth }))
  }

  const item = 'w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item'

  return (
    <th
      ref={thRef}
      role="columnheader"
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
      className="relative z-[21] text-left font-normal select-none group/header"
      style={{
        width: `${header.getSize()}px`,
        minWidth: `${header.getSize()}px`,
        backgroundColor: 'var(--st-bg-header)',
        borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
        borderRight: showColumnBorders ? '1px solid var(--st-border)' : 'none',
      }}
    >
      <div className="flex items-center gap-1.5 px-2 py-1.5 cursor-default overflow-hidden">
        <span className="shrink-0 text-[13px]" style={{ color: 'var(--st-text)' }}>
          {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {showDataTypes && (
          <span className="text-xs font-normal truncate min-w-0" style={{ color: 'var(--st-text-tertiary)' }}>
            {meta.type}
          </span>
        )}
        {sorted && (
          <span className="text-xs shrink-0" style={{ color: 'var(--st-accent)' }}>
            {sorted === 'asc' ? '↑' : '↓'}
          </span>
        )}
        <button
          type="button"
          className={`ml-auto shrink-0 w-4 h-4 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity${open ? ' !opacity-100' : ''}`}
          style={{ color: 'var(--st-text-tertiary)' }}
          aria-label={`Column options: ${header.column.id}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
        >
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" />
          </svg>
        </button>
      </div>

      {/* Portaled to body to escape the thead stacking context */}
      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              role="menu"
              className="data-table-root fixed w-52 rounded shadow-xl z-50 py-1 text-[13px]"
              style={{
                ...themeVars,
                fontFamily: 'var(--dt-font-family)',
                top: pos.top + 'px',
                left: pos.left + 'px',
                backgroundColor: 'var(--st-bg-surface)',
                border: '1px solid var(--st-border-secondary)',
                color: 'var(--st-text)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-text)' }} onClick={run(() => header.column.toggleSorting(false))}>
                <span className="w-4 text-center" style={{ color: 'var(--st-text-secondary)' }}>↑</span>Sort Ascending
              </button>
              <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-text)' }} onClick={run(() => header.column.toggleSorting(true))}>
                <span className="w-4 text-center" style={{ color: 'var(--st-text-secondary)' }}>↓</span>Sort Descending
              </button>
              <div className="my-1" style={{ borderTop: '1px solid var(--st-border-secondary)' }} />
              <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-text)' }} onClick={run(() => copyText(header.column.id))}>
                <span className="w-4 text-center" style={{ color: 'var(--st-text-secondary)' }}>
                  <svg className="w-3.5 h-3.5 inline" viewBox="0 0 16 16" fill="currentColor"><path d={COPY_ICON} /></svg>
                </span>
                Copy name
              </button>
            </div>
          </>,
          document.body,
        )}

      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500${header.column.getIsResizing?.() ? ' bg-blue-500' : ''}`}
        onMouseDown={onResizeStart}
        onTouchStart={onResizeStart}
        onDoubleClick={autoFitColumn}
      />
    </th>
  )
}
