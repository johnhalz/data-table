import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { isDestructiveRowAction } from './rowActionDestructive.js'
import { copyText } from './utils.js'
import { useClickOutside, useDT } from './context.js'

const COPY = 'M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z'
const FILTER = 'M.75 3a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z'
const EDIT = 'M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61z'
const TRASH = 'M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z'

const Sep = () => <div className="my-1" role="separator" style={{ borderTop: '1px solid var(--st-border-secondary)' }} />
const Icon = ({ d }) => (
  <svg className="w-3.5 h-3.5" style={{ color: 'var(--st-text-secondary)' }} viewBox="0 0 16 16" fill="currentColor"><path d={d} /></svg>
)
const UndoIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h7a4 4 0 0 1 0 8H6" /><path d="M6 4L3 7l3 3" /></svg>
)

/** `disabled` may be a boolean or `(rowOriginal) => boolean`. */
export function resolveRowActionDisabled(item, row) {
  if (item == null || item.divider || item.disabled == null) return false
  const d = item.disabled
  return typeof d === 'function' ? !!d(row?.original ?? row ?? null) : !!d
}

/**
 * Right-click menu. `allowRowEdit` / `allowRowDelete` come explicitly from the owning table
 * so a portaled menu matches its table, not an ancestor's context.
 */
export default function ContextMenu({
  x, y, row = null, cell = null, customActions = [], allowRowEdit = false, allowRowDelete = false,
  onClose, onEditRow, onDeleteRow, onFilterByValue, onUndoRow, onUndoCell, onRowAction,
}) {
  const { themeVars = {}, getRowPendingState = () => null, getCellPendingState = () => null } = useDT()
  const menuRef = useRef(null)
  useClickOutside(menuRef, () => onClose())
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const rowPending = row ? getRowPendingState(row.id) : null
  const cellPending = row && cell ? getCellPendingState(row.id, cell.column.id) : null
  const undoRowLabel = rowPending === 'insert' ? 'Discard new row' : rowPending === 'delete' ? 'Restore row' : rowPending === 'update' ? 'Undo row changes' : null
  const cellValue = cell ? cell.getValue() : null
  const colId = cell ? cell.column.id : null

  const act = (fn) => () => {
    fn()
    onClose()
  }

  // Anchor toward the viewport center so the menu is never clipped, without measuring it.
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pos = { position: 'fixed', zIndex: 9999 }
  if (y > vh / 2) pos.bottom = `${vh - y}px`
  else pos.top = `${y}px`
  if (x > vw / 2) pos.right = `${vw - x}px`
  else pos.left = `${x}px`

  const item = 'w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item'

  return createPortal(
    <div ref={menuRef} className="data-table-root" style={{ ...themeVars, ...pos }}>
      <div role="menu" className="w-52 rounded shadow-xl py-1 text-[13px]" style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}>
        <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-text)' }} onClick={act(() => cellValue != null && copyText(String(cellValue)))}>
          <Icon d={COPY} />
          Copy cell
        </button>
        <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-text)' }} onClick={act(() => row && copyText(JSON.stringify(row.original, null, 2)))}>
          <Icon d={COPY} />
          Copy row
        </button>
        <Sep />
        <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-text)' }} onClick={act(() => colId && cellValue != null && onFilterByValue?.(colId, String(cellValue)))}>
          <Icon d={FILTER} />
          Filter by value
        </button>
        {(cellPending === 'modified' || undoRowLabel) && (
          <>
            <Sep />
            {cellPending === 'modified' && (
              <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-accent)' }} onClick={act(() => colId && onUndoCell?.(colId))}>
                <UndoIcon />
                Undo cell change
              </button>
            )}
            {undoRowLabel && (
              <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-accent)' }} onClick={act(() => onUndoRow?.())}>
                <UndoIcon />
                {undoRowLabel}
              </button>
            )}
          </>
        )}
        {customActions.length > 0 && (
          <>
            <Sep />
            {customActions.map((a, idx) => {
              if (a.divider) return <Sep key={`divider-${idx}`} />
              const disabled = resolveRowActionDisabled(a, row)
              return (
                <button
                  key={a.key}
                  type="button"
                  role="menuitem"
                  className={`${item} disabled:pointer-events-none${disabled ? ' opacity-40 cursor-not-allowed' : ''}`}
                  disabled={disabled}
                  style={{ color: isDestructiveRowAction(a) ? 'var(--st-danger)' : 'var(--st-text)' }}
                  onClick={() => {
                    if (disabled) return
                    onRowAction?.(a.key, row?.original ?? null)
                    onClose()
                  }}
                >
                  {a.icon && (
                    <span className="shrink-0 w-3.5 h-3.5 inline-flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full" dangerouslySetInnerHTML={{ __html: a.icon }} />
                  )}
                  <span>{a.label}</span>
                </button>
              )
            })}
          </>
        )}
        {(allowRowEdit || allowRowDelete) && (
          <>
            <Sep />
            {allowRowEdit && (
              <button type="button" role="menuitem" className={item} style={{ color: 'var(--st-text)' }} onClick={act(() => onEditRow?.())}>
                <Icon d={EDIT} />
                Edit row
              </button>
            )}
            {allowRowDelete && rowPending !== 'delete' && (
              <button type="button" role="menuitem" className={item} style={{ color: '#ef4444' }} onClick={act(() => onDeleteRow?.())}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d={TRASH} /></svg>
                Delete row
              </button>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
