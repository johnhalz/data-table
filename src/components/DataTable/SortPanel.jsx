import { useEffect, useState } from 'react'
import { useDT } from './context.js'

const ASC = 'M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z'
const DESC = 'M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z'
const CLOSE = 'M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z'

/** Draft sort rules for this table (and its sub-tables); nothing applies until "Apply sorting". */
export default function SortPanel({ sorting = [], allColumns = [], subTableColumns = null, subTableSorting = [], tableName = 'table', onSortingChange, onSubTableSortingChange, onClose }) {
  const { showDataTypes = true } = useDT()
  const hasSubTable = !!subTableColumns && subTableColumns.length > 0
  const build = () => [...sorting.map((r) => ({ ...r, table: 'parent' })), ...subTableSorting.map((r) => ({ ...r, table: 'sub' }))]
  const [rules, setRules] = useState(build)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRules(build()), [sorting, subTableSorting])

  const patch = (i, change) => setRules(rules.map((r, j) => (j === i ? { ...r, ...change } : r)))
  const strip = (table) => rules.filter((r) => r.table === table).map(({ table: _t, ...r }) => r)

  function addRule(table) {
    const cols = table === 'parent' ? allColumns : subTableColumns
    const used = new Set(rules.filter((r) => r.table === table).map((r) => r.id))
    const available = cols.find((c) => !used.has(c.id))
    if (available) setRules([...rules, { id: available.id, desc: false, table }])
  }

  function apply(next) {
    onSortingChange?.(next ? strip('parent') : [])
    if (hasSubTable) onSubTableSortingChange?.(next ? strip('sub') : [])
    onClose?.()
  }

  function onDragEnd() {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const next = [...rules]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(dragOverIndex, 0, moved)
      setRules(next)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }

  function renderSection(table, columns) {
    let n = 0
    return rules.map((rule, gi) => {
      if (rule.table !== table) return null
      const i = n++
      return (
        <div
          key={`${table}-${gi}`}
          className="flex items-center gap-2 mb-2 rounded px-1 -mx-1 transition-colors"
          style={dragOverIndex === gi && dragIndex !== gi ? { backgroundColor: 'var(--st-bg-menu-hover)' } : undefined}
          draggable
          onDragStart={() => setDragIndex(gi)}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOverIndex(gi)
          }}
          onDragEnd={onDragEnd}
        >
          <span className="cursor-grab active:cursor-grabbing shrink-0 flex items-center" style={{ color: 'var(--st-text-placeholder)' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              {[4, 8, 12].map((cy) => [5.5, 10.5].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" />))}
            </svg>
          </span>
          <span className="text-xs w-12 shrink-0" style={{ color: 'var(--st-text-tertiary)' }}>{i === 0 ? 'sort by' : 'then by'}</span>
          <select
            value={rule.id}
            aria-label={i === 0 ? 'Sort by column' : 'Then by column'}
            className="sort-select flex-1 rounded py-1 text-[13px] outline-none min-w-0"
            style={{ backgroundColor: 'var(--st-bg)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }}
            onChange={(e) => patch(gi, { id: e.target.value })}
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.id}
                {showDataTypes ? ` (${col.type})` : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="shrink-0 w-[68px] flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors"
            style={
              rule.desc
                ? { color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }
                : { color: 'var(--st-accent)', backgroundColor: 'var(--st-accent-bg)', border: '1px solid var(--st-accent-border-light)' }
            }
            title={rule.desc ? 'Descending — click to toggle' : 'Ascending — click to toggle'}
            onClick={() => patch(gi, { desc: !rule.desc })}
          >
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d={rule.desc ? DESC : ASC} /></svg>
            {rule.desc ? 'DESC' : 'ASC'}
          </button>
          <button
            type="button"
            className="shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors"
            style={{ color: 'var(--st-text-tertiary)' }}
            title="Remove sort rule"
            aria-label="Remove sort rule"
            onClick={() => setRules(rules.filter((_, j) => j !== gi))}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d={CLOSE} /></svg>
          </button>
        </div>
      )
    })
  }

  const sectionLabel = (text) => (
    <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--st-text-placeholder)' }}>{text}</div>
  )
  const addBtn = (table) => (
    <button type="button" className="text-[13px] mt-1" style={{ color: 'var(--st-text-secondary)' }} onClick={() => addRule(table)}>
      + Pick a column to sort by
    </button>
  )

  return (
    <div
      role="dialog"
      aria-label="Sort"
      className="absolute top-full right-0 mt-1 w-96 rounded shadow-xl z-50 text-[13px]"
      style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3">
        {rules.length === 0 && (
          <div className="text-center py-4" style={{ color: 'var(--st-text-tertiary)' }}>
            <p className="mb-1">No sorts applied to this view</p>
            <p className="text-xs">Add a column below to sort the view</p>
          </div>
        )}
        {hasSubTable && sectionLabel(tableName)}
        {renderSection('parent', allColumns)}
        {addBtn('parent')}
        {hasSubTable && (
          <>
            <div className="my-3" style={{ borderTop: '1px solid var(--st-border-secondary)' }} />
            {sectionLabel('Sub-table')}
            {renderSection('sub', subTableColumns)}
            {addBtn('sub')}
          </>
        )}
      </div>
      <div className="px-3 py-2 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--st-border-secondary)' }}>
        {rules.length > 0 && (
          <button type="button" className="px-3 py-1 rounded text-[13px] transition-colors" style={{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }} onClick={() => apply(false)}>
            Clear sorting
          </button>
        )}
        <button type="button" className="px-3 py-1 rounded text-[13px] font-medium transition-colors" style={{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }} onClick={() => apply(true)}>
          Apply sorting
        </button>
      </div>
    </div>
  )
}
