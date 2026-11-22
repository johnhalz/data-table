import { useRef, useState } from 'react'
import { isDestructiveRowAction } from './rowActionDestructive.js'
import { DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES } from './types.js'
import { copyText, toDelimited, toSqlInserts, toJson } from './utils.js'
import { useClickOutside, useDT } from './context.js'

const DOWNLOAD_FORMATS = {
  json: { mime: 'application/json', build: toJson },
  csv: { mime: 'text/csv', build: (rows) => toDelimited(rows, ',') },
  tsv: { mime: 'text/tab-separated-values', build: (rows) => toDelimited(rows, '\t') },
}
const Sep = () => <div className="my-1" role="separator" style={{ borderTop: '1px solid var(--st-border-secondary)' }} />

/** Bulk bar: replaces the toolbar when rows are selected (DataTable) or sits in the footer (MiniTable, `footerLayout`). */
export default function SelectionToolbar({
  selectedCount,
  table,
  editable = { insert: true, update: true, delete: true },
  selectionActions = [],
  contextMenuActions = [],
  enableSelectAll = true,
  totalFilteredCount = null,
  countLabelSingular = 'record',
  countLabelPlural = 'records',
  enableSelectAllMatching = false,
  selectionSummaryCompact = false,
  summaryRatio = false,
  showBulkActionsMenu = true,
  fixedToolbarRowHeight = false,
  footerLayout = false,
  clearSelectionDanger = false,
  onDeleteConfirmRequest,
  onSelectionAction,
  onSelectAllMatching,
  onClearFullSelection,
}) {
  const { tableName = 'table' } = useDT()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  useClickOutside(dropdownRef, () => setOpen(false))

  // Total row count across all pages (post-filter): "Select all N …" and the ratio denominator.
  const totalRowCount = totalFilteredCount != null ? totalFilteredCount : table.getFilteredRowModel().rows.length
  const allItemsSelected = selectedCount >= totalRowCount && totalRowCount > 0
  const useSelectAllMatching = enableSelectAllMatching && totalFilteredCount != null
  const showSelectAll = !allItemsSelected && (useSelectAllMatching || (enableSelectAll && !enableSelectAllMatching))
  const selectedRows = () => table.getSelectedRowModel().rows.map((r) => r.original)

  const close = (fn) => () => {
    fn()
    setOpen(false)
  }
  const copyAs = (format) =>
    close(() => {
      const rows = selectedRows()
      copyText(format === 'json' ? toJson(rows) : format === 'csv' ? toDelimited(rows, ',') : toSqlInserts(rows, tableName))
    })
  const downloadAs = (format) =>
    close(() => {
      const { mime, build } = DOWNLOAD_FORMATS[format]
      const url = URL.createObjectURL(new Blob([build(selectedRows())], { type: mime }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${tableName || 'export'}.${format}`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 0)
    })

  const rootCls = ['px-3', 'py-1.5', 'flex', 'items-center', 'shrink-0', 'text-[13px]', footerLayout ? 'gap-3' : 'gap-2']
  if (footerLayout) rootCls.push('flex-wrap', ...DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES)
  else if (fixedToolbarRowHeight) rootCls.push('min-h-[41px]')
  const rootStyle = footerLayout
    ? { borderTop: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)', color: 'var(--st-text-secondary)' }
    : { borderBottom: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)' }
  const item = 'w-full text-left px-3 py-1.5 hover-menu-item'
  const text = { color: 'var(--st-text)' }

  return (
    <div className={rootCls.join(' ')} style={rootStyle} role="toolbar" aria-label="Selection">
      <span className={`text-[13px] shrink-0${summaryRatio ? ' tabular-nums' : ''}`} style={text}>
        {summaryRatio
          ? `${selectedCount}/${totalRowCount} selected`
          : selectionSummaryCompact
            ? `${selectedCount} selected`
            : `${selectedCount} row${selectedCount > 1 ? 's' : ''} selected`}
      </span>

      {footerLayout && <div className="flex-1 min-w-[0.5rem]" />}

      {/* Footer: controls grouped right; toolbar: `contents` keeps them inline after the summary */}
      <div className={footerLayout ? 'flex items-center gap-2 shrink-0 flex-wrap justify-end' : 'contents'}>
        {editable.delete && (
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }}
            onClick={() => onDeleteConfirmRequest?.()}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z" />
            </svg>
            Delete...
          </button>
        )}

        {showBulkActionsMenu && (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[13px] transition-colors"
              style={{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }}
              onClick={() => setOpen(!open)}
            >
              Actions
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" />
              </svg>
            </button>
            {open && (
              <div
                role="menu"
                className={`absolute ${footerLayout ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-48 rounded shadow-xl z-50 py-1 text-[13px]`}
                style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}
              >
                <button type="button" role="menuitem" className={item} style={text} onClick={copyAs('csv')}>Copy as CSV</button>
                <button type="button" role="menuitem" className={item} style={text} onClick={copyAs('sql')}>Copy as SQL</button>
                <button type="button" role="menuitem" className={item} style={text} onClick={copyAs('json')}>Copy as JSON</button>
                <Sep />
                <button type="button" role="menuitem" className={item} style={text} onClick={downloadAs('csv')}>Download as CSV</button>
                <button type="button" role="menuitem" className={item} style={text} onClick={downloadAs('tsv')}>Download as TSV</button>
                <button type="button" role="menuitem" className={item} style={text} onClick={downloadAs('json')}>Download as JSON</button>
                {contextMenuActions.length > 0 && (
                  <>
                    <Sep />
                    {contextMenuActions.map((action, idx) => {
                      if (action.divider) return <Sep key={`divider-${idx}`} />
                      // Function-form `disabled` is per-row; bulk actions stay enabled.
                      const disabled = typeof action.disabled === 'function' ? false : !!action.disabled
                      return (
                        <button
                          key={action.key}
                          type="button"
                          role="menuitem"
                          className={`${item} flex items-center gap-2 disabled:pointer-events-none${disabled ? ' opacity-40 cursor-not-allowed' : ''}`}
                          disabled={disabled}
                          style={{ color: isDestructiveRowAction(action) ? 'var(--st-danger)' : 'var(--st-text)' }}
                          onClick={close(() => !disabled && onSelectionAction?.(action.key, selectedRows()))}
                        >
                          {action.icon && (
                            <span className="shrink-0 w-3.5 h-3.5 inline-flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full" dangerouslySetInnerHTML={{ __html: action.icon }} />
                          )}
                          <span>{action.label}</span>
                        </button>
                      )
                    })}
                  </>
                )}
                {selectionActions.length > 0 && (
                  <>
                    <Sep />
                    {selectionActions.map((action) => (
                      <button key={action.key} type="button" role="menuitem" className={item} style={text} onClick={close(() => onSelectionAction?.(action.key, selectedRows()))}>
                        {action.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="text-[13px] transition-colors shrink-0"
          style={{ color: clearSelectionDanger ? 'var(--st-danger)' : 'var(--st-text-secondary)' }}
          onClick={() => onClearFullSelection?.()}
        >
          {footerLayout ? 'Clear' : 'Clear selection'}
        </button>

        {showSelectAll && (
          <button
            type="button"
            className="text-[13px] transition-colors shrink-0"
            style={{ color: 'var(--st-accent)' }}
            onClick={() => (useSelectAllMatching ? onSelectAllMatching?.() : table.toggleAllRowsSelected(true))}
          >
            {footerLayout ? 'Select All' : `Select all ${totalRowCount} ${totalRowCount === 1 ? countLabelSingular : countLabelPlural}`}
          </button>
        )}
      </div>

      {!footerLayout && <div className="flex-1" />}
    </div>
  )
}
