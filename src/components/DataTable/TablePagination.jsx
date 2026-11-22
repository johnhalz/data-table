import { useState } from 'react'
import { createPortal } from 'react-dom'
import { DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES, PAGE_SIZE_OPTIONS } from './types.js'
import { useDT } from './context.js'
import { useEscape } from './DeleteRowsConfirmDialog.jsx'

export default function TablePagination({
  table,
  totalCount = null,
  hasRandomAccess = true,
  stagedEdits = false,
  pendingEditCount = 0,
  committing = false,
  countLabelSingular = 'record',
  countLabelPlural = 'records',
  onCommit,
  onDiscard,
}) {
  const { themeVars = {} } = useDT()
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  const closeDiscard = () => setShowDiscardConfirm(false)
  useEscape(showDiscardConfirm, closeDiscard)

  const { pageIndex, pageSize } = table.atoms.pagination.get()
  // Server mode: derive from props; TanStack getPageCount() doesn't follow parent fetches.
  const isServerTotal = totalCount != null && Number.isFinite(Number(totalCount))
  const pageCount = isServerTotal ? Math.max(1, Math.ceil(Number(totalCount) / Math.max(1, pageSize))) : table.getPageCount()
  const canPrev = isServerTotal ? pageIndex > 0 : table.getCanPreviousPage()
  const canNext = isServerTotal ? pageIndex + 1 < pageCount : table.getCanNextPage()
  const totalRecords = totalCount != null ? totalCount : table.getFilteredRowModel().rows.length
  const changes = `${pendingEditCount} pending change${pendingEditCount !== 1 ? 's' : ''}`

  const goToPage = (page) => table.setPageIndex(Math.max(0, Math.min(page, pageCount - 1)))
  const inputStyle = { backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }
  const divider = <div className="w-px h-4 mx-1" style={{ backgroundColor: 'var(--st-border)' }} />

  return (
    <div
      className={`px-3 py-1.5 flex items-center gap-3 text-[13px] shrink-0 ${DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES.join(' ')}`}
      style={{ borderTop: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)', color: 'var(--st-text-secondary)' }}
    >
      <button type="button" aria-label="Previous page" className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled={!canPrev} onClick={() => table.previousPage()}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z" />
        </svg>
      </button>

      <div className="flex items-center gap-1.5">
        <span>Page</span>
        {hasRandomAccess ? (
          <input
            // Uncontrolled + keyed on the page so typing isn't fought by re-renders; commits on change (blur/enter).
            key={pageIndex}
            type="number"
            aria-label="Page number"
            defaultValue={pageIndex + 1}
            min={1}
            max={pageCount}
            className="w-12 rounded px-1.5 py-0.5 text-center text-[13px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={inputStyle}
            onBlur={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val)) goToPage(val - 1)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
          />
        ) : (
          <span className="tabular-nums" style={{ color: 'var(--st-text)' }}>{pageIndex + 1}</span>
        )}
        <span>of {pageCount}</span>
      </div>

      <button type="button" aria-label="Next page" className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled={!canNext} onClick={() => table.nextPage()}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" />
        </svg>
      </button>

      {divider}

      <label className="flex items-center gap-1.5">
        <span>Rows per page:</span>
        <select value={pageSize} className="rounded px-1.5 py-0.5 text-[13px] outline-none cursor-pointer" style={inputStyle} onChange={(e) => table.setPageSize(Number(e.target.value))}>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </label>

      <div className="flex-1" />

      {stagedEdits && pendingEditCount > 0 && (
        <>
          <span className="tabular-nums px-2 py-0.5 rounded" style={{ color: 'var(--st-accent)', backgroundColor: 'var(--st-accent-bg)', border: '1px solid var(--st-accent-border-light)' }}>
            {changes}
          </span>
          <button
            type="button"
            className="px-2 py-0.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)', backgroundColor: 'transparent' }}
            disabled={committing}
            onClick={() => pendingEditCount > 0 && setShowDiscardConfirm(true)}
          >
            Clear edits
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }}
            disabled={committing}
            onClick={() => onCommit?.()}
          >
            {committing && (
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 1.5a6.5 6.5 0 1 1-6.5 6.5" strokeLinecap="round" />
              </svg>
            )}
            {committing ? 'Committing…' : 'Commit'}
          </button>
          {divider}
        </>
      )}

      <span style={{ color: 'var(--st-text-tertiary)' }}>
        {totalRecords.toLocaleString()} {totalRecords === 1 ? countLabelSingular : countLabelPlural}
      </span>

      {showDiscardConfirm &&
        createPortal(
          <div
            className="data-table-root fixed inset-0 z-[100] flex items-center justify-center"
            style={{ ...themeVars, backgroundColor: 'var(--st-bg-overlay)' }}
            onClick={(e) => e.target === e.currentTarget && closeDiscard()}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="dt-discard-title"
              className="rounded-lg shadow-xl p-5 w-80"
              style={{ ...themeVars, backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }}
            >
              <h3 id="dt-discard-title" className="font-semibold text-[14px] mb-2">Clear all pending edits?</h3>
              <p className="text-[13px] mb-4" style={{ color: 'var(--st-text-secondary)' }}>
                This will discard {changes}. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button type="button" className="px-3 py-1 rounded text-[13px]" style={{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }} onClick={closeDiscard}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded text-[13px] font-medium"
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                  onClick={() => {
                    onDiscard?.()
                    closeDiscard()
                  }}
                >
                  Clear edits
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
