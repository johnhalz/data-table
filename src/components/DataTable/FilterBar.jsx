import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FILTER_OPERATORS, DATE_TIME_TYPES } from './types.js'
import FilterDatePicker from './FilterDatePicker.jsx'
import { useDT } from './context.js'

const FLAT_OPERATORS = FILTER_OPERATORS.flatMap((g) => [{ type: 'header', label: g.group }, ...g.operators.map((op) => ({ type: 'operator', ...op }))])
const SELECTABLE_OPERATORS = FLAT_OPERATORS.filter((i) => i.type === 'operator')
const CLOSE = 'M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z'

/**
 * Inline filter chips + a search input that walks column → operator. Filters are TanStack
 * `{ id, value: { operator, value } }`; parent-table and sub-table filters share one chip row.
 */
export default function FilterBar({
  columnFilters = [],
  allColumns = [],
  subTableColumns = null,
  subTableColumnFilters = [],
  tableName = 'table',
  onColumnFiltersChange,
  onSubTableColumnFiltersChange,
  className = '',
  style,
}) {
  const { showDataTypes = true, themeVars = {} } = useDT()
  const [dropdown, setDropdown] = useState('closed') // 'closed' | 'columns' | 'operators'
  const [pendingColumn, setPendingColumn] = useState(null) // { id, table }
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const searchRef = useRef(null)
  const anchorRef = useRef(null)
  const pendingChipRef = useRef(null)
  const valueInputs = useRef([])
  const focusLastRef = useRef(false)
  const pickerRef = useRef(null)

  const merged = [
    ...columnFilters.map((f, i) => ({ ...f, table: 'parent', sourceIndex: i })),
    ...subTableColumnFilters.map((f, i) => ({ ...f, table: 'sub', sourceIndex: i })),
  ]
  const showSubBadge = merged.some((f) => f.table === 'sub')
  const q = query.toLowerCase()
  // Column picker lists only this table's columns, not nested sub-table defs
  const filteredColumns = q ? allColumns.filter((c) => c.id.toLowerCase().includes(q)) : allColumns
  const placeholder = `Filter by ${allColumns.map((c) => c.id).slice(0, 3).join(', ')}...`
  const allFlat = [...allColumns, ...(subTableColumns || [])]
  const columnType = (colId) => allFlat.find((c) => c.id === colId)?.type || 'varchar'

  function updatePos() {
    // Operator picker anchors to the end of the pending chip; column picker to the search input.
    const el = dropdown === 'operators' && pendingChipRef.current ? pendingChipRef.current : anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: el === pendingChipRef.current ? rect.right : rect.left })
  }

  useLayoutEffect(() => {
    if (dropdown === 'closed') return
    updatePos()
    const schedule = () => requestAnimationFrame(updatePos)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)
    return () => {
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdown, pendingColumn])

  // Focus the new filter's value input once the parent re-renders with it.
  useEffect(() => {
    if (!focusLastRef.current) return
    focusLastRef.current = false
    valueInputs.current[merged.length - 1]?.focus()
  })

  useEffect(() => {
    pickerRef.current?.querySelector('[data-highlighted="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [highlight])

  function close() {
    setDropdown('closed')
    setPendingColumn(null)
    setQuery('')
    setHighlight(0)
  }

  function selectColumn(id, table) {
    setPendingColumn({ id, table })
    setQuery('')
    setDropdown('operators')
    setHighlight(0)
  }

  function selectOperator(op) {
    if (!pendingColumn) return
    const newFilter = { id: pendingColumn.id, value: { operator: op, value: '' } }
    if (pendingColumn.table === 'sub') onSubTableColumnFiltersChange?.([...subTableColumnFilters, newFilter])
    else onColumnFiltersChange?.([...columnFilters, newFilter])
    close()
    searchRef.current?.blur()
    focusLastRef.current = true
  }

  function removeFilter(i) {
    const f = merged[i]
    if (f.table === 'sub') onSubTableColumnFiltersChange?.(subTableColumnFilters.filter((_, j) => j !== f.sourceIndex))
    else onColumnFiltersChange?.(columnFilters.filter((_, j) => j !== f.sourceIndex))
  }

  function updateValue(i, value) {
    const f = merged[i]
    const list = f.table === 'sub' ? [...subTableColumnFilters] : [...columnFilters]
    const existing = list[f.sourceIndex]
    list[f.sourceIndex] = { ...existing, value: { operator: existing.value?.operator || '=', value } }
    if (f.table === 'sub') onSubTableColumnFiltersChange?.(list)
    else onColumnFiltersChange?.(list)
  }

  function navigate(e, count, pick) {
    if (count === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, count - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      pick(highlight)
    }
  }

  function onSearchKeyDown(e) {
    if (dropdown === 'columns') navigate(e, filteredColumns.length, (i) => filteredColumns[i] && selectColumn(filteredColumns[i].id, 'parent'))
    else if (dropdown === 'operators') navigate(e, SELECTABLE_OPERATORS.length, (i) => SELECTABLE_OPERATORS[i] && selectOperator(SELECTABLE_OPERATORS[i].value))
    else if (e.key !== 'Escape') {
      setDropdown('columns')
      setHighlight(0)
    }
    if (e.key === 'Escape') {
      close()
      searchRef.current?.blur()
    }
  }

  const chipStyle = { backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }
  const badgeStyle = { color: 'var(--st-text-placeholder)', backgroundColor: 'var(--st-bg-input)' }
  const popupStyle = {
    ...themeVars,
    top: pos.top + 'px',
    left: pos.left + 'px',
    fontFamily: 'var(--dt-font-family)',
    backgroundColor: 'var(--st-bg-surface)',
    border: '1px solid var(--st-border-secondary)',
    color: 'var(--st-text)',
  }
  const hl = (on) => (on ? { backgroundColor: 'var(--st-bg-menu-hover)' } : undefined)

  return (
    <div className={`flex items-center gap-1.5 flex-wrap flex-1 min-w-0 ${className}`} style={style}>
      {merged.map((f, i) => {
        const value = f.value?.value ?? ''
        return (
          <div key={f.table + '-' + f.sourceIndex} className="flex items-center gap-1 rounded px-2 py-0.5 text-[13px]" style={chipStyle}>
            {showSubBadge && <span className="text-[10px] font-medium uppercase px-1 rounded" style={badgeStyle}>{f.table === 'sub' ? 'sub' : tableName}</span>}
            <span style={{ color: 'var(--st-text-secondary)' }}>{f.id}</span>
            <span className="font-mono text-xs" style={{ color: 'var(--st-text-placeholder)' }}>{f.value?.operator || '='}</span>
            <input
              ref={(el) => {
                valueInputs.current[i] = el
              }}
              value={value}
              aria-label={`Filter value for ${f.id}`}
              className="bg-transparent outline-none text-[13px]"
              style={{ color: 'var(--st-text)', width: Math.max(6, String(value).length + 1) + 'ch' }}
              placeholder="value"
              onChange={(e) => updateValue(i, e.target.value)}
            />
            {DATE_TIME_TYPES.includes(columnType(f.id)) && <FilterDatePicker value={value} columnType={columnType(f.id)} onUpdate={(v) => updateValue(i, v)} />}
            <button
              type="button"
              aria-label={`Remove filter on ${f.id}`}
              className="ml-0.5 w-5 h-5 flex items-center justify-center rounded transition-colors filter-chip-close shrink-0"
              style={{ color: 'var(--st-text-placeholder)' }}
              onClick={() => removeFilter(i)}
            >
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d={CLOSE} /></svg>
            </button>
          </div>
        )
      })}

      {pendingColumn && (
        <div ref={pendingChipRef} className="flex items-center gap-1 rounded px-2 py-0.5 text-[13px]" style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-accent-border)' }}>
          {(showSubBadge || pendingColumn.table === 'sub') && (
            <span className="text-[10px] font-medium uppercase px-1 rounded" style={badgeStyle}>{pendingColumn.table === 'sub' ? 'sub' : tableName}</span>
          )}
          <span style={{ color: 'var(--st-text-secondary)' }}>{pendingColumn.id}</span>
        </div>
      )}

      <div ref={anchorRef} className="relative flex-1 min-w-[200px]">
        <input
          ref={searchRef}
          value={query}
          role="combobox"
          aria-expanded={dropdown !== 'closed'}
          aria-controls={dropdown === 'columns' ? 'dt-column-picker' : dropdown === 'operators' ? 'dt-operator-picker' : undefined}
          className="w-full bg-transparent outline-none text-[13px] py-1"
          style={{ color: 'var(--st-text)', caretColor: dropdown === 'operators' ? 'transparent' : undefined }}
          placeholder={dropdown === 'operators' ? 'Pick a filter method...' : merged.length > 0 ? '+ Add more filters...' : placeholder}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlight(0)
          }}
          onFocus={() => {
            if (dropdown === 'closed') {
              setDropdown('columns')
              setHighlight(0)
            }
          }}
          onKeyDown={onSearchKeyDown}
        />

        {dropdown !== 'closed' &&
          createPortal(
            <>
              <div className="fixed inset-0 z-40" onClick={close} />
              {dropdown === 'columns' ? (
                <div ref={pickerRef} id="dt-column-picker" role="listbox" className="data-table-root fixed w-60 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto" style={popupStyle}>
                  {filteredColumns.map((col, idx) => (
                    <div
                      key={'p-' + col.id}
                      role="option"
                      aria-selected={idx === highlight}
                      className="flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]"
                      data-highlighted={idx === highlight}
                      style={hl(idx === highlight)}
                      onClick={() => selectColumn(col.id, 'parent')}
                      onMouseEnter={() => setHighlight(idx)}
                    >
                      <span style={{ color: 'var(--st-text)' }}>{col.id}</span>
                      {showDataTypes && <span className="text-xs" style={{ color: 'var(--st-text-placeholder)' }}>{col.type}</span>}
                    </div>
                  ))}
                  {filteredColumns.length === 0 && (
                    <div className="px-3 py-2 text-[13px]" style={{ color: 'var(--st-text-placeholder)' }}>No columns found</div>
                  )}
                </div>
              ) : (
                <div ref={pickerRef} id="dt-operator-picker" role="listbox" className="data-table-root fixed w-52 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto" style={popupStyle}>
                  {FLAT_OPERATORS.map((item, idx) => {
                    if (item.type === 'header') {
                      return (
                        <div key={idx} className="px-3 py-1 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--st-text-placeholder)' }}>
                          {item.label}
                        </div>
                      )
                    }
                    const sel = SELECTABLE_OPERATORS.findIndex((o) => o.value === item.value)
                    return (
                      <div
                        key={idx}
                        role="option"
                        aria-selected={sel === highlight}
                        className="flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]"
                        data-highlighted={sel === highlight}
                        style={hl(sel === highlight)}
                        onClick={() => selectOperator(item.value)}
                        onMouseEnter={() => setHighlight(sel)}
                      >
                        <span style={{ color: 'var(--st-text)' }}>{item.label}</span>
                        <span className="font-mono text-xs" style={{ color: 'var(--st-text-placeholder)' }}>{item.value}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </>,
            document.body,
          )}
      </div>
    </div>
  )
}
