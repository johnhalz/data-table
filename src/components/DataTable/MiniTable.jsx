import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  columnFilteringFeature,
  rowSelectionFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  createFilteredRowModel,
  sortFns,
} from '@tanstack/react-table'
import SelectionToolbar from './SelectionToolbar.jsx'
import TableColumnHeader from './TableColumnHeader.jsx'
import TableCell from './TableCell.jsx'
import RowEditPanel from './RowEditPanel.jsx'
import ContextMenu from './ContextMenu.jsx'
import DeleteRowsConfirmDialog from './DeleteRowsConfirmDialog.jsx'
import { DTContext, DTFontContext } from './context.js'
import { useUpdateEffect } from './useUpdateEffect.js'
import { DATA_TABLE_ROW_SELECT_COL_PX, DATA_TABLE_MIN_COLUMN_WIDTH_PX } from './columnSizingFill.js'
import { DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES, MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD } from './types.js'
import { claimContextMenu, releaseContextMenu } from './contextMenuCoordinator.js'
import { DEFAULT_DT_FONT, resolveFontFamily, buildThemeVars, operatorFilterFn, applyUpdater, stripDeselectedAdditional } from './utils.js'

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowSelectionFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns: { operator: operatorFilterFn },
})

const EMPTY = []
const SHADOW = '2px 0 4px var(--st-shadow-sticky)' // soft shadow only, no inset border
const SKELETON = [60, 75, 85, 55]
const Spinner = ({ className = 'w-4 h-4 animate-spin shrink-0', style }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" style={style} aria-hidden="true">
    <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" />
    <path d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z" />
  </svg>
)
/** Two frames so a spinner paints before a large synchronous selection runs. */
const yieldForPaint = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

/**
 * Narrow single-column list: checkbox + one column, contains filter, infinite scroll (`hasMore` +
 * `onLoadMore`), bulk bar in the footer. Not a wrapper around DataTable: manual sort/filter, so the
 * parent refetches on `onSortChange` / `onColumnFiltersChange`.
 */
const MiniTable = forwardRef(function MiniTable(props, ref) {
  const {
    column,
    rows,
    tableName = 'table',
    loading = false,
    error = null,
    editable = false,
    selectionActions = EMPTY,
    contextMenuActions = EMPTY,
    cellButtonVisibility = 'hover',
    showDataTypes = false,
    showRowBorders = true,
    showColumnBorders = true,
    theme = 'dark',
    accentColor = '#3ecf8e',
    fontFamily = null,
    emptyTitle = 'No rows found',
    emptyMessage = 'Nothing to show yet.',
    countLabelSingular = 'record',
    countLabelPlural = 'records',
    totalCount = null,
    totalFilteredCount = null,
    hasMore = false,
    columnFilters: columnFiltersProp = null,
    highlightedRowId = null,
    enableSelectAll = true,
    enableSelectAllMatching = false,
    inferSelectAllMatching = true,
    additionalSelectedRowIds = EMPTY,
    onRefresh, onLoadMore, onColumnFiltersChange, onSortChange, onSelectionChange, onAdditionalSelectedRowIdsChange,
    onSelectAllMatching, onSelectionAction, onRowAction, onDeleteRows, onUpdateRow,
  } = props

  const parentFont = useContext(DTFontContext)
  const resolvedFont = resolveFontFamily(fontFamily, parentFont)
  const themeVars = useMemo(() => ({ ...buildThemeVars(theme, accentColor), '--dt-font-family': resolvedFont || DEFAULT_DT_FONT }), [theme, accentColor, resolvedFont])

  const scrollerRef = useRef(null)
  const sentinelRef = useRef(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [errorDismissed, setErrorDismissed] = useState(false)
  useEffect(() => setErrorDismissed(false), [error])

  const editableCaps = useMemo(() => {
    if (editable === true) return { insert: false, update: true, delete: true }
    if (editable === false) return { insert: false, update: false, delete: false }
    return { insert: false, update: false, delete: false, ...editable }
  }, [editable])

  const leafColumnId = String(column.id ?? column.accessorKey ?? 'column')
  const primaryKeyField = column.meta?.isPrimaryKey ? column.accessorKey ?? column.id ?? 'id' : 'id'
  const idOf = (row) => String(row[primaryKeyField] ?? row.id)

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState(columnFiltersProp ?? [])
  const [rowSelection, setRowSelection] = useState({})
  const [columnSizing, setColumnSizing] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})

  // The toolbar's contains filter is a `~~` / `~~*` filter on the leaf column; last one wins.
  const isContainsFilter = (f) => String(f.id) === leafColumnId && (f.value?.operator === '~~' || f.value?.operator === '~~*')
  const containsQueryOf = (filters) => filters.filter(isContainsFilter).map((f) => String(f.value?.value ?? '')).pop() ?? ''
  const [containsQuery, setContainsQuery] = useState(() => containsQueryOf(columnFilters))

  const setFiltersAndEmit = (next) => {
    setColumnFilters(next)
    onColumnFiltersChange?.(next)
  }
  useUpdateEffect(() => {
    if (columnFiltersProp !== null) {
      setColumnFilters(columnFiltersProp)
      setContainsQuery(containsQueryOf(columnFiltersProp))
    }
  }, [columnFiltersProp])
  useUpdateEffect(() => setContainsQuery(containsQueryOf(columnFilters)), [leafColumnId])

  const resolvedTotalFilteredCount = totalFilteredCount != null ? totalFilteredCount : totalCount
  const capN = resolvedTotalFilteredCount != null && Number.isFinite(Number(resolvedTotalFilteredCount)) ? Number(resolvedTotalFilteredCount) : null
  // Prefer "select all matching" when the eligible total is larger than the loaded slice.
  const effectiveSelectAllMatching = capN != null && (enableSelectAllMatching || (inferSelectAllMatching && capN > rows.length))

  const additionalSet = useMemo(() => new Set((additionalSelectedRowIds || []).map(String)), [additionalSelectedRowIds])
  const mergedSelectedIds = () => [...new Set([...additionalSet, ...Object.keys(rowSelection).map(String)])]
  const selectedCount = mergedSelectedIds().length
  const isRowDisplayedSelected = (row) => row.getIsSelected() || additionalSet.has(String(row.original[primaryKeyField] ?? row.original.id))
  const highlighted = highlightedRowId != null && highlightedRowId !== '' ? String(highlightedRowId) : null

  // Emit merged selection when it changes; skip same-content arrays (parent reassigning identical ids).
  const lastEmitted = useRef(null)
  useUpdateEffect(() => {
    const ids = mergedSelectedIds()
    const prev = lastEmitted.current
    if (prev && prev.length === ids.length && prev.every((id, i) => id === ids[i])) return
    lastEmitted.current = ids
    onSelectionChange?.(ids)
  }, [rowSelection, additionalSelectedRowIds])

  // Loaded rows the parent already holds as selected get their checkbox ticked.
  useEffect(() => {
    if (additionalSet.size === 0) return
    setRowSelection((sel) => {
      let next = null
      for (const row of rows) {
        const id = idOf(row)
        if (additionalSet.has(id) && !sel[id]) (next ??= { ...sel })[id] = true
      }
      return next ?? sel
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, additionalSet])

  const tableColumns = useMemo(() => [column], [column])
  const table = useTable({
    features,
    data: rows,
    columns: tableColumns,
    defaultColumn: { filterFn: 'operator' },
    state: { sorting, columnFilters, rowSelection, columnSizing, columnVisibility },
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: (u) => {
      const next = applyUpdater(u, sorting)
      setSorting(next)
      onSortChange?.(next)
    },
    onColumnFiltersChange: (u) => setColumnFilters((prev) => applyUpdater(u, prev)),
    onRowSelectionChange: (u) => {
      const next = applyUpdater(u, rowSelection)
      const stripped = stripDeselectedAdditional(rowSelection, next, additionalSelectedRowIds)
      if (stripped) onAdditionalSelectedRowIdsChange?.(stripped)
      setRowSelection(next)
    },
    onColumnSizingChange: (u) => setColumnSizing((prev) => applyUpdater(u, prev)),
    onColumnVisibilityChange: (u) => setColumnVisibility((prev) => applyUpdater(u, prev)),
    enableRowRangeSelection: false,
    getRowId: (row) => String(row[primaryKeyField] ?? row.id),
  })

  const rowModels = table.getRowModel().rows
  const totalTableWidth = DATA_TABLE_ROW_SELECT_COL_PX + table.getVisibleLeafColumns().reduce((s, c) => s + c.getSize(), 0)
  const leafColumnSize = table.getVisibleLeafColumns()[0]?.getSize() ?? 120
  const allPage = rowModels.length > 0 && rowModels.every(isRowDisplayedSelected)
  const somePage = rowModels.length > 0 && !allPage && rowModels.some(isRowDisplayedSelected)
  const totalRecordsFooter = totalCount != null && Number.isFinite(Number(totalCount)) ? Number(totalCount) : rows.length
  const borderBottom = showRowBorders ? '1px solid var(--st-border)' : 'none'

  /** 'header' or a row id: shows a spinner on that checkbox while a large selection runs. */
  const [busyTarget, setBusyTarget] = useState(null)
  const lastClickedRowIndex = useRef(null)

  async function withSpinner(target, fn) {
    if (target != null) {
      flushSync(() => setBusyTarget(target))
      await yieldForPaint()
    }
    try {
      fn()
    } finally {
      if (target != null) setBusyTarget(null)
    }
  }

  function onHeaderCheckbox() {
    withSpinner(rowModels.length > MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD ? 'header' : null, () => table.toggleAllPageRowsSelected(!allPage))
  }

  function onRowCheckbox(row, event, rowIndex) {
    const shift = event.shiftKey && lastClickedRowIndex.current !== null
    const start = shift ? Math.min(lastClickedRowIndex.current, rowIndex) : rowIndex
    const end = shift ? Math.max(lastClickedRowIndex.current, rowIndex) : rowIndex
    const spin = shift && end - start + 1 > MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD ? String(row.id) : null
    withSpinner(spin, () => {
      if (shift) for (let i = start; i <= end; i++) rowModels[i].toggleSelected(true)
      else row.toggleSelected(!isRowDisplayedSelected(row))
      lastClickedRowIndex.current = rowIndex
    })
  }

  const [selectedCell, setSelectedCell] = useState(null)

  const clearFullSelection = () => {
    lastEmitted.current = null
    table.resetRowSelection()
    onAdditionalSelectedRowIdsChange?.([])
  }

  function openDeleteConfirmation(ids) {
    const list = (ids ?? []).map(String).filter(Boolean)
    if (list.length > 0) setDeleteConfirm(list)
  }

  const [editRow, setEditRow] = useState(null) // row original being edited, or null
  const closeEditPanel = useCallback(() => setEditRow(null), [])

  const [contextMenu, setContextMenu] = useState(null)
  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
    releaseContextMenu(closeContextMenu)
  }, [])

  // Data column fills the viewport (minus the checkbox column).
  const fitColumn = () => {
    const w = scrollerRef.current?.clientWidth
    if (!Number.isFinite(w) || w <= 0) return
    setColumnSizing({ [leafColumnId]: Math.max(DATA_TABLE_MIN_COLUMN_WIDTH_PX, Math.floor(w - DATA_TABLE_ROW_SELECT_COL_PX)) })
  }
  const fitRef = useRef(fitColumn)
  fitRef.current = fitColumn
  useLayoutEffect(() => {
    fitRef.current()
    const el = scrollerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => fitRef.current())
    ro.observe(el)
    return () => {
      ro.disconnect()
      releaseContextMenu(closeContextMenu)
    }
  }, [closeContextMenu])
  useUpdateEffect(() => fitRef.current(), [leafColumnId])

  // Infinite scroll: the sentinel after the last row emits load-more as it nears the viewport.
  useEffect(() => {
    const root = scrollerRef.current
    const target = sentinelRef.current
    if (!root || !target || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) onLoadMore?.()
      },
      { root, rootMargin: '120px', threshold: 0 },
    )
    io.observe(target)
    return () => io.disconnect()
  }, [hasMore, loading, rows.length, onLoadMore])

  useImperativeHandle(ref, () => ({ openDeleteConfirmation }))

  const ctx = {
    themeVars,
    table,
    tableName,
    showDataTypes,
    editable: editableCaps,
    showRowBorders,
    showColumnBorders,
    cellButtonVisibility,
    cellOverflow: 'truncate',
    emptyTitle,
    emptyMessage,
    loading,
    isRowDisplayedSelected,
    highlightedRowId: highlighted,
    nestingDepth: 0,
    parentTheme: theme,
    parentAccentColor: accentColor,
  }

  return (
    <DTFontContext.Provider value={resolvedFont}>
      <DTContext.Provider value={ctx}>
        <div
          className="data-table-root mini-table-root flex flex-col flex-1 min-h-0 min-w-0 text-[13px]"
          data-st-theme={theme}
          style={{ ...themeVars, backgroundColor: 'var(--st-bg)', color: 'var(--st-text)' }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 shrink-0 min-h-[41px]" style={{ borderBottom: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg-input)' }}>
            <input
              type="search"
              className={`flex-1 min-w-0 rounded pl-0 pr-2 py-1 text-[13px] outline-none [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none${rows.length === 0 && !loading ? ' opacity-40 pointer-events-none' : ''}`}
              value={containsQuery}
              placeholder="Filter…"
              style={{ backgroundColor: 'var(--st-bg-input)', border: 'none', color: 'var(--st-text)' }}
              aria-label="Filter visible column"
              onChange={(e) => {
                const raw = e.target.value
                setContainsQuery(raw)
                const trimmed = raw.trim()
                const base = columnFilters.filter((f) => !isContainsFilter(f))
                setFiltersAndEmit(trimmed ? [...base, { id: leafColumnId, value: { operator: '~~*', value: trimmed } }] : base)
              }}
            />
            <button type="button" className="p-1.5 rounded transition-colors shrink-0" style={{ color: 'var(--st-text-secondary)' }} disabled={loading} title="Refresh" aria-label="Refresh" onClick={() => onRefresh?.()}>
              <Spinner className={`w-4 h-4${loading ? ' animate-spin' : ''}`} />
            </button>
          </div>

          {error && !errorDismissed && (
            <div role="alert" className="flex items-center gap-2 px-3 py-2 text-[13px] shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
              <span className="flex-1">{error}</span>
              <button type="button" aria-label="Dismiss error" className="opacity-60 hover:opacity-100" onClick={() => setErrorDismissed(true)}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex flex-1 min-h-0 min-w-0">
            <div className="flex flex-col flex-1 min-w-0 min-h-0">
              <div className="flex-1 min-h-0 relative">
                <div
                  ref={scrollerRef}
                  role="table"
                  aria-label={tableName}
                  className="mini-table-scroll absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col items-start"
                  style={{ scrollbarGutter: 'stable' }}
                  onClick={(e) => e.target === e.currentTarget && setSelectedCell(null)}
                >
                  <div className="sticky top-0 z-[26] shrink-0 isolate" role="rowgroup" style={{ width: totalTableWidth + 'px', backgroundColor: 'var(--st-bg-header)' }}>
                    <table role="presentation" className="border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent mini-table-header-table" style={{ width: totalTableWidth + 'px' }}>
                      <thead role="presentation">
                        {table.getHeaderGroups().map((hg) => (
                          <tr key={hg.id} role="row">
                            <th
                              role="columnheader"
                              aria-label="Select all rows on this page"
                              className="px-1 py-1.5 text-center align-middle sticky left-0 z-[39]"
                              style={{ width: DATA_TABLE_ROW_SELECT_COL_PX + 'px', minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px', backgroundColor: 'var(--st-bg-header)', borderBottom, boxShadow: SHADOW }}
                            >
                              <div className="relative flex items-center justify-center min-h-5" aria-busy={busyTarget === 'header' ? 'true' : undefined}>
                                {busyTarget === 'header' ? (
                                  <Spinner style={{ color: 'var(--st-accent)' }} />
                                ) : (
                                  <input
                                    type="checkbox"
                                    className="cursor-pointer align-middle"
                                    style={{ accentColor: 'var(--st-accent)' }}
                                    checked={allPage}
                                    ref={(el) => {
                                      if (el) el.indeterminate = somePage
                                    }}
                                    title="Select all rows on this page"
                                    aria-label="Select all rows on this page"
                                    onChange={() => {}}
                                    onClick={onHeaderCheckbox}
                                  />
                                )}
                              </div>
                            </th>
                            {hg.headers.map((header) => (
                              <TableColumnHeader key={header.id} header={header} table={table} />
                            ))}
                          </tr>
                        ))}
                      </thead>
                    </table>
                  </div>

                  {loading && rows.length === 0 ? (
                    <div className="shrink-0" style={{ width: totalTableWidth + 'px' }} aria-busy="true">
                      <table className="border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent" style={{ width: totalTableWidth + 'px' }}>
                        <tbody>
                          {Array.from({ length: 8 }, (_, i) => (
                            <tr key={i}>
                              <td
                                className="sticky left-0 z-10 px-1 py-1.5 text-center align-middle"
                                style={{ width: DATA_TABLE_ROW_SELECT_COL_PX + 'px', minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px', backgroundColor: 'var(--st-bg)', borderBottom, boxShadow: SHADOW }}
                              />
                              <td className="px-2 py-1.5 align-middle" style={{ width: leafColumnSize + 'px', borderBottom }}>
                                <div className="h-3 rounded animate-pulse" style={{ width: `${SKELETON[(i + 1) % 4]}%`, backgroundColor: 'var(--st-border-secondary)' }} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : rows.length > 0 ? (
                    <div role="rowgroup" className="contents">
                      {rowModels.map((row, rowIndex) => {
                        const selected = isRowDisplayedSelected(row)
                        return (
                          <div
                            key={row.id}
                            className={`st-row shrink-0${selected ? ' st-row--selected' : ''}${highlighted != null && row.id === highlighted ? ' st-row--active' : ''}`}
                            style={{ width: totalTableWidth + 'px' }}
                          >
                            <div className="group/row" role="row" style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                              <div
                                role="cell"
                                className="px-1 py-1.5 text-center align-middle sticky left-0 z-10 st-sticky-cell"
                                style={{ display: 'table-cell', width: DATA_TABLE_ROW_SELECT_COL_PX + 'px', minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px', borderBottom, boxShadow: SHADOW }}
                              >
                                <div className="relative flex items-center justify-center min-h-5" aria-busy={busyTarget === String(row.id) ? 'true' : undefined}>
                                  {busyTarget === String(row.id) ? (
                                    <Spinner style={{ color: 'var(--st-accent)' }} />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      className="cursor-pointer align-middle"
                                      style={{ accentColor: 'var(--st-accent)' }}
                                      aria-label="Select row"
                                      checked={selected}
                                      onChange={() => {}}
                                      onClick={(e) => onRowCheckbox(row, e, rowIndex)}
                                    />
                                  )}
                                </div>
                              </div>
                              {row.getVisibleCells().map((cell) => (
                                <TableCell
                                  key={cell.id}
                                  cell={cell}
                                  isSelected={selectedCell === `${row.id}:${cell.column.id}`}
                                  onSelect={() => setSelectedCell(`${row.id}:${cell.column.id}`)}
                                  onUpdate={(value) => onUpdateRow?.({ id: row.id, changes: { [cell.column.id]: value } })}
                                  onContextMenu={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    claimContextMenu(closeContextMenu)
                                    setContextMenu({ x: e.clientX, y: e.clientY, row, cell })
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 w-full" style={{ color: 'var(--st-text-secondary)' }}>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--st-text)' }}>{emptyTitle}</span>
                      <span className="text-xs text-center">{emptyMessage}</span>
                    </div>
                  )}

                  <div ref={sentinelRef} className="w-full shrink-0" style={{ minHeight: '1px' }} />
                  {loading && rows.length > 0 && (
                    <div className="flex items-center justify-center gap-2 py-3 w-full text-[13px] shrink-0" style={{ color: 'var(--st-text-secondary)' }}>
                      <Spinner />
                      <span>Loading…</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedCount > 0 ? (
                <SelectionToolbar
                  footerLayout
                  summaryRatio
                  selectedCount={selectedCount}
                  table={table}
                  editable={editableCaps}
                  selectionActions={selectionActions}
                  contextMenuActions={contextMenuActions}
                  enableSelectAll={enableSelectAll}
                  totalFilteredCount={resolvedTotalFilteredCount}
                  enableSelectAllMatching={effectiveSelectAllMatching}
                  countLabelSingular={countLabelSingular}
                  countLabelPlural={countLabelPlural}
                  showBulkActionsMenu={editable !== false}
                  clearSelectionDanger
                  onDeleteConfirmRequest={() => openDeleteConfirmation(mergedSelectedIds())}
                  onSelectionAction={(action, selRows) => onSelectionAction?.(action, selRows, mergedSelectedIds())}
                  onSelectAllMatching={() => onSelectAllMatching?.()}
                  onClearFullSelection={clearFullSelection}
                />
              ) : (
                <div
                  className={`px-3 py-1.5 flex items-center gap-3 text-[13px] shrink-0 ${DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES.join(' ')}`}
                  style={{ borderTop: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)', color: 'var(--st-text-secondary)' }}
                >
                  <div className="flex-1" />
                  <span style={{ color: 'var(--st-text-tertiary)' }}>
                    {totalRecordsFooter.toLocaleString()} {totalRecordsFooter === 1 ? countLabelSingular : countLabelPlural}
                  </span>
                </div>
              )}

              {editableCaps.update && editRow && (
                <RowEditPanel
                  key={JSON.stringify(editRow)}
                  mode="update"
                  rowData={editRow}
                  table={table}
                  tableName={tableName}
                  onSave={(data) => {
                    onUpdateRow?.({ id: idOf(data), changes: data })
                    closeEditPanel()
                  }}
                  onClose={closeEditPanel}
                />
              )}
            </div>
          </div>

          <DeleteRowsConfirmDialog
            open={deleteConfirm !== null}
            rowCount={deleteConfirm?.length ?? 0}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={() => {
              const ids = deleteConfirm
              setDeleteConfirm(null)
              onDeleteRows?.(ids)
              clearFullSelection()
            }}
          />

          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              row={contextMenu.row}
              cell={contextMenu.cell}
              customActions={contextMenuActions}
              allowRowEdit={editableCaps.update}
              allowRowDelete={editableCaps.delete}
              onClose={closeContextMenu}
              onEditRow={() => setEditRow({ ...contextMenu.row.original })}
              onDeleteRow={() => openDeleteConfirmation([contextMenu.row.id])}
              onFilterByValue={(colId, val) => {
                const id = String(colId)
                setFiltersAndEmit([...columnFilters.filter((f) => !(String(f.id) === id && f.value?.operator === '=')), { id, value: { operator: '=', value: val } }])
              }}
              onRowAction={(key, rowData) => onRowAction?.(key, rowData)}
            />
          )}
        </div>
      </DTContext.Provider>
    </DTFontContext.Provider>
  )
})

export default MiniTable
