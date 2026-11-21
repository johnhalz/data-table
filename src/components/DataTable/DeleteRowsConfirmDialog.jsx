import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDT } from './context.js'

/** Escape closes any of the table's modal dialogs. */
export function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

/** Shared "Confirm deletion" modal (toolbar Delete…, context menu, `openDeleteConfirmation`). */
export default function DeleteRowsConfirmDialog({ open, rowCount, onClose, onConfirm }) {
  const { themeVars = {} } = useDT()
  useEscape(open, onClose)
  if (!open) return null
  const rows = `${rowCount} row${rowCount > 1 ? 's' : ''}`
  return createPortal(
    <div className="data-table-root fixed inset-0 z-50 flex items-center justify-center" style={themeVars}>
      <div className="fixed inset-0" style={{ backgroundColor: 'var(--st-bg-overlay)' }} onClick={onClose} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dt-delete-title"
        className="relative rounded-lg shadow-2xl w-96 text-[13px]"
        style={{ ...themeVars, backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}
      >
        <div className="px-5 pt-5 pb-4">
          <h3 id="dt-delete-title" className="font-medium text-sm mb-2" style={{ color: 'var(--st-text)' }}>Confirm deletion</h3>
          <p style={{ color: 'var(--st-text-secondary)' }}>Are you sure you want to delete {rows}? This action cannot be undone.</p>
        </div>
        <div className="px-5 py-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--st-border-secondary)' }}>
          <button
            type="button"
            className="px-3 py-1.5 rounded text-[13px] transition-colors"
            style={{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="button" autoFocus className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium" onClick={onConfirm}>
            Delete {rows}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
