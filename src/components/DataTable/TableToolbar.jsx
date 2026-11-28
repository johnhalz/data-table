import { useRef, useState } from 'react'
import { useClickOutside } from './context.js'
import SortPanel from './SortPanel.jsx'
import FilterBar from './FilterBar.jsx'
import ColumnVisibilityPanel from './ColumnVisibilityPanel.jsx'

const CARET = 'M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'
const accent = { backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }
const plainBtn = { border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }
const activeBtn = { border: '1px solid var(--st-accent-border)', color: 'var(--st-accent)', backgroundColor: 'var(--st-accent-bg)' }
const disabledBtn = { ...plainBtn, opacity: 0.4, cursor: 'default' }
const Caret = ({ className = 'w-3 h-3' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor"><path d={CARET} /></svg>
)

/** One dropdown open flag + click-outside, per toolbar button. */
function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))
  return { open, setOpen, ref }
}

export default function TableToolbar({
  table,
  sorting = [],
  columnFilters = [],
  columnVisibility = {},
  defaultColumnVisibility = {},
  editable = { insert: true, update: true, delete: true },
  loading = false,
  defaultInsertLabel = null,
  insertActions = [],
  toolbarActions = [],
  toolbarActionsLabel = 'Actions',
  toolbarButtons = [],
  subTableColumns = null,
  subTableSorting = [],
  subTableColumnFilters = [],
  subTableColumnVisibility = {},
  tableName = 'table',
  isEmpty = false,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onSubTableSortingChange,
  onSubTableColumnFiltersChange,
  onSubTableColumnVisibilityChange,
  onInsertRow,
  onInsertAction,
  onRefresh,
  onToolbarAction,
}) {
  const sort = useDropdown()
  const actions = useDropdown()
  const columns = useDropdown()
  const insert = useDropdown()

  const sortCount = sorting.length + subTableSorting.length
  const hiddenColumnCount =
    Object.values(columnVisibility).filter((v) => v === false).length +
    Object.values(subTableColumnVisibility).filter((v) => v === false).length
  const isDefaultVisibility =
    table.getAllColumns().every((c) => (columnVisibility[c.id] !== false) === (defaultColumnVisibility[c.id] !== false)) &&
    !Object.values(subTableColumnVisibility).includes(false)

  const allColumns = table.getAllColumns().map((col) => ({ id: col.id, type: col.columnDef.meta?.type || 'text' }))
  const subTableColumnList = subTableColumns
    ? subTableColumns.map((col) => ({ id: col.accessorKey || col.id || col.header, type: col.meta?.type || col.columnDef?.meta?.type || 'text' }))
    : null

  return (
    <div style={{ borderBottom: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)' }}>
      <div className="flex items-center gap-2 px-3 py-1.5" role="toolbar" aria-label="Table">
        <FilterBar
          table={table}
          columnFilters={columnFilters}
          allColumns={allColumns}
          subTableColumns={subTableColumnList}
          subTableColumnFilters={subTableColumnFilters}
          tableName={tableName}
          onColumnFiltersChange={onColumnFiltersChange}
          onSubTableColumnFiltersChange={onSubTableColumnFiltersChange}
          className="flex-1"
          style={isEmpty ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
        />

        <button type="button" className="p-1.5 rounded transition-colors" style={{ color: 'var(--st-text-secondary)' }} disabled={loading} title="Refresh" aria-label="Refresh" onClick={() => onRefresh?.()}>
          <svg className={`w-4 h-4${loading ? ' animate-spin' : ''}`} viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" />
            <path d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z" />
          </svg>
        </button>

        {toolbarButtons.map((b) => (
          <button
            key={b.key}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
            style={b.disabled ? disabledBtn : plainBtn}
            disabled={b.disabled}
            title={b.title}
            onClick={() => !b.disabled && onToolbarAction?.(b.key)}
          >
            {b.icon && <span className="shrink-0 flex items-center" dangerouslySetInnerHTML={{ __html: b.icon }} />}
            {b.label}
          </button>
        ))}

        <div ref={sort.ref} className="relative">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={sort.open}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
            style={isEmpty ? disabledBtn : sortCount > 0 ? activeBtn : plainBtn}
            disabled={isEmpty}
            onClick={() => !isEmpty && sort.setOpen(!sort.open)}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.5 2.5a.5.5 0 00-1 0v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L3.5 12.293V2.5zm4 .5a.5.5 0 010-1h1a.5.5 0 010 1h-1zm0 3a.5.5 0 010-1h3a.5.5 0 010 1h-3zm0 3a.5.5 0 010-1h5a.5.5 0 010 1h-5zm0 3a.5.5 0 010-1h7a.5.5 0 010 1h-7z" />
            </svg>
            {sortCount > 0 ? `Sorted by ${sortCount} rule${sortCount > 1 ? 's' : ''}` : 'Sort'}
          </button>
          {sort.open && (
            <SortPanel
              table={table}
              sorting={sorting}
              allColumns={allColumns}
              subTableColumns={subTableColumnList}
              subTableSorting={subTableSorting}
              tableName={tableName}
              onSortingChange={onSortingChange}
              onSubTableSortingChange={onSubTableSortingChange}
              onClose={() => sort.setOpen(false)}
            />
          )}
        </div>

        {toolbarActions.length > 0 && (
          <div ref={actions.ref} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={actions.open}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
              style={isEmpty ? disabledBtn : plainBtn}
              disabled={isEmpty}
              onClick={() => !isEmpty && actions.setOpen(!actions.open)}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
              {toolbarActionsLabel}
              <Caret className="w-3 h-3 opacity-60" />
            </button>
            {actions.open && (
              <div role="menu" className="absolute top-full left-0 mt-1 min-w-[12rem] rounded shadow-xl z-50 py-1 text-[13px]" style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}>
                {toolbarActions.map((action, idx) =>
                  action.divider ? (
                    <div key={action.key ?? `divider-${idx}`} className="my-1" role="separator" style={{ borderTop: '1px solid var(--st-border-secondary)' }} />
                  ) : (
                    <button
                      key={action.key}
                      type="button"
                      role="menuitem"
                      className="w-full text-left px-3 py-1.5 hover-menu-item flex items-center gap-2"
                      style={{ color: 'var(--st-text)', opacity: action.disabled ? 0.4 : 1, cursor: action.disabled ? 'not-allowed' : 'pointer' }}
                      disabled={action.disabled}
                      onClick={() => {
                        if (action.disabled) return
                        onToolbarAction?.(action.key)
                        actions.setOpen(false)
                      }}
                    >
                      {action.icon && <span className="shrink-0 flex items-center" dangerouslySetInnerHTML={{ __html: action.icon }} />}
                      <span className="flex-1">{action.label}</span>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        <div ref={columns.ref} className="relative">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={columns.open}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
            style={isEmpty ? disabledBtn : !isDefaultVisibility ? activeBtn : plainBtn}
            disabled={isEmpty}
            onClick={() => !isEmpty && columns.setOpen(!columns.open)}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.5 2A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13zM1 3.5a.5.5 0 01.5-.5H5v10H1.5a.5.5 0 01-.5-.5v-9zM6 13V3h4v10H6zm5 0V3h3.5a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H11z" />
            </svg>
            {isDefaultVisibility ? 'Columns' : `${hiddenColumnCount} hidden`}
          </button>
          {columns.open && (
            <ColumnVisibilityPanel
              table={table}
              columnVisibility={columnVisibility}
              defaultColumnVisibility={defaultColumnVisibility}
              subTableColumns={subTableColumnList}
              subTableColumnVisibility={subTableColumnVisibility}
              tableName={tableName}
              onColumnVisibilityChange={onColumnVisibilityChange}
              onSubTableColumnVisibilityChange={onSubTableColumnVisibilityChange}
              onClose={() => columns.setOpen(false)}
            />
          )}
        </div>

        {/* Insert: A) label + insertActions → labeled dropdown; B) label only → plain button (insert-row);
            C) insertActions only → "Insert ▼" with them; D) neither → "Insert ▼" with "Insert row". */}
        {editable.insert && (
          <div ref={insert.ref} className="relative">
            {defaultInsertLabel && insertActions.length === 0 ? (
              <button type="button" className="flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors" style={accent} onClick={() => onInsertRow?.()}>
                {defaultInsertLabel}
              </button>
            ) : (
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={insert.open}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors"
                style={accent}
                onClick={() => insert.setOpen(!insert.open)}
              >
                {defaultInsertLabel || 'Insert'}
                <Caret />
              </button>
            )}
            {insert.open && (
              <div
                role="menu"
                className="absolute top-full right-0 mt-1 flex min-w-[11rem] w-max flex-col items-stretch rounded shadow-xl z-50 py-1 text-[13px]"
                style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}
              >
                {insertActions.length > 0 ? (
                  insertActions.map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      role="menuitem"
                      className="flex items-center gap-2 whitespace-nowrap text-left px-3 py-1.5 hover-menu-item"
                      style={{ color: 'var(--st-text)' }}
                      onClick={() => {
                        onInsertAction?.(action.key)
                        insert.setOpen(false)
                      }}
                    >
                      {action.icon && <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: action.icon }} />}
                      <span className="shrink-0 whitespace-nowrap">{action.label}</span>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    className="whitespace-nowrap text-left px-3 py-1.5 hover-menu-item"
                    style={{ color: 'var(--st-text)' }}
                    onClick={() => {
                      onInsertRow?.()
                      insert.setOpen(false)
                    }}
                  >
                    Insert row
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
