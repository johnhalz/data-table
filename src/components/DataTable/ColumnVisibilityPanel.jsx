import { useDT } from './context.js'

const CHECK = 'M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'

export default function ColumnVisibilityPanel({
  table,
  columnVisibility = {},
  defaultColumnVisibility = {},
  subTableColumns = null,
  subTableColumnVisibility = {},
  tableName = 'table',
  onColumnVisibilityChange,
  onSubTableColumnVisibilityChange,
}) {
  const { showDataTypes = true } = useDT()
  const hasSubTable = !!subTableColumns && subTableColumns.length > 0
  const columns = table.getAllLeafColumns().map((col) => ({ id: col.id, type: col.columnDef.meta?.type || 'text', isVisible: columnVisibility[col.id] !== false }))
  const subColumns = hasSubTable ? subTableColumns.map((col) => ({ id: col.id, type: col.type || 'text', isVisible: subTableColumnVisibility[col.id] !== false })) : []
  const totalVisible = [...columns, ...subColumns].filter((c) => c.isVisible).length
  const toggled = (vis, id) => ({ ...vis, [id]: vis[id] === false })
  const allOn = (cols) => Object.fromEntries(cols.map((c) => [c.id, true]))

  const row = (col, onToggle, prefix) => (
    <button
      key={prefix + col.id}
      type="button"
      role="menuitemcheckbox"
      aria-checked={col.isVisible}
      className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 transition-colors hover-menu-item"
      onClick={onToggle}
    >
      <span
        className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
        style={col.isVisible ? { backgroundColor: 'var(--st-accent)', borderColor: 'var(--st-accent)' } : { borderColor: 'var(--st-border-tertiary)', backgroundColor: 'transparent' }}
      >
        {col.isVisible && (
          <svg className="w-3 h-3" style={{ color: 'var(--st-text-on-accent)' }} viewBox="0 0 16 16" fill="currentColor"><path d={CHECK} /></svg>
        )}
      </span>
      <span className="truncate" style={{ color: col.isVisible ? 'var(--st-text)' : 'var(--st-text-tertiary)' }}>{col.id}</span>
      {showDataTypes && <span className="text-xs ml-auto shrink-0" style={{ color: 'var(--st-text-placeholder)' }}>{col.type}</span>}
    </button>
  )
  const label = (text) => (
    <div className="px-3 py-1 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--st-text-placeholder)' }}>{text}</div>
  )

  return (
    <div
      role="dialog"
      aria-label="Columns"
      className="absolute top-full right-0 mt-1 w-64 rounded shadow-xl z-50 text-[13px]"
      style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid var(--st-border-secondary)' }}>
        <span className="font-medium" style={{ color: 'var(--st-text-secondary)' }}>{totalVisible} of {columns.length + subColumns.length} columns</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-xs"
            style={{ color: 'var(--st-text-secondary)' }}
            onClick={() => {
              onColumnVisibilityChange?.(allOn(columns))
              if (hasSubTable) onSubTableColumnVisibilityChange?.(allOn(subColumns))
            }}
          >
            Show all
          </button>
          <span style={{ color: 'var(--st-text-placeholder)' }}>|</span>
          <button
            type="button"
            className="text-xs"
            style={{ color: 'var(--st-text-secondary)' }}
            onClick={() => {
              onColumnVisibilityChange?.({ ...defaultColumnVisibility })
              if (hasSubTable) onSubTableColumnVisibilityChange?.({})
            }}
          >
            Default
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-auto py-1" role="menu">
        {hasSubTable && label(tableName)}
        {columns.map((col) => row(col, () => onColumnVisibilityChange?.(toggled(columnVisibility, col.id)), 'p-'))}
        {hasSubTable && (
          <>
            <div className="my-1" style={{ borderTop: '1px solid var(--st-border-secondary)' }} />
            {label('Sub-table')}
            {subColumns.map((col) => row(col, () => onSubTableColumnVisibilityChange?.(toggled(subTableColumnVisibility, col.id)), 's-'))}
          </>
        )}
      </div>
    </div>
  )
}
