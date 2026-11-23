import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  sortFns,
} from '@tanstack/react-table'
import TableToolbar from './TableToolbar.jsx'
import SelectionToolbar from './SelectionToolbar.jsx'
import TableGrid from './TableGrid.jsx'
import TablePagination from './TablePagination.jsx'
import RowEditPanel from './RowEditPanel.jsx'
import ContextMenu from './ContextMenu.jsx'
import DeleteRowsConfirmDialog from './DeleteRowsConfirmDialog.jsx'
import { DTContext, DTFontContext } from './context.js'
import { useUpdateEffect } from './useUpdateEffect.js'
import { distributeWidthsLargestRemainder, DATA_TABLE_STICKY_CHROME_PX, DATA_TABLE_MIN_COLUMN_WIDTH_PX } from './columnSizingFill.js'
import { widthPxForCellButtons } from './cellButtonWidth.js'
import { claimContextMenu, releaseContextMenu } from './contextMenuCoordinator.js'
import { PENDING_EDIT_KINDS, PENDING_INSERT_ID_PREFIX } from './types.js'
import { DEFAULT_DT_FONT, resolveFontFamily, buildThemeVars, operatorFilterFn, applyUpdater, stripDeselectedAdditional } from './utils.js'

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns: { operator: operatorFilterFn },
})

const EMPTY = []
const EMPTY_OBJ = {}
const NO_EDIT = { insert: false, update: false, delete: false }
const INITIAL_RESIZING = { startOffset: null, startSize: null, deltaOffset: null, deltaPercentage: null, isResizingColumn: false, columnSizingStart: [] }

/** Reused across sizing passes instead of allocating a canvas each time. */
let measureCtx = null

const DataTable = forwardRef(function DataTable(props, ref) {
  const {
    columns,
    rows,
    tableName = 'table',
    loading = false,
    error = null,
    defaultColumnVisibility = EMPTY_OBJ,
    showDataTypes = true,
    editable = true,
    selectionActions = EMPTY,
    contextMenuActions = EMPTY,
    enableSelectAll = true,
    toolbarActions = EMPTY,
    toolbarActionsLabel = 'Actions',
    defaultInsertLabel = null,
    showRowBorders = true,
    showColumnBorders = true,
    cellButtonVisibility = 'hover',
    cellOverflow = 'truncate',
    insertActions = EMPTY,
    countLabelSingular = 'record',
    countLabelPlural = 'records',
    theme = 'dark',
    accentColor = '#3ecf8e',
    fontFamily = null,
    getSubTable = null,
    subTableColumns = null,
    expandedRows = null,
    nestingDepth = 0,
    showToolbar = true,
    showPagination = true,
    emptyTitle = 'No rows found',
    emptyMessage = 'Get started by inserting a new row.',
    totalCount = null,
    totalFilteredCount = null,
    additionalSelectedRowIds = EMPTY,
    highlightedRowId = null,
    enableSelectAllMatching = false,
    hasRandomAccess = true,
    columnFilters: columnFiltersProp = null,
    controlledSorting = null,
    controlledColumnFilters = null,
    controlledColumnVisibility = null,
    stagedEdits = false,
    // events
    onInsertRow, onUpdateRow, onDeleteRows, onRefresh, onSelectionAction, onRowAction, onToolbarAction,
    onInsertAction, onExpandedRowsChange, onColumnResize, onPageChange, onSortChange, onSelectAllMatching,
    onAdditionalSelectedRowIdsChange, onColumnFiltersChange, onCommitEdits, onDiscardEdits,
  } = props

  const parentFont = useContext(DTFontContext)
  const resolvedFont = resolveFontFamily(fontFamily, parentFont)
  const themeVars = useMemo(() => ({ ...buildThemeVars(theme, accentColor), '--dt-font-family': resolvedFont || DEFAULT_DT_FONT }), [theme, accentColor, resolvedFont])

  const rootElRef = useRef(null)
  const tableGridRef = useRef(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // ids pending confirmation, or null

  const editableCaps = useMemo(() => {
    if (editable === true) return { insert: true, update: true, delete: true }
    if (editable === false) return NO_EDIT
    return { insert: true, update: true, delete: true, ...editable }
  }, [editable])

  const [errorDismissed, setErrorDismissed] = useState(false)
  useEffect(() => setErrorDismissed(false), [error])

  const isServerPagination = totalCount !== null
  const [sorting, setSorting] = useState(controlledSorting ?? [])
  const [columnFilters, setColumnFilters] = useState(controlledColumnFilters ?? columnFiltersProp ?? [])
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100 })
  const [columnSizing, setColumnSizing] = useState({})
  const [columnResizing, setColumnResizing] = useState(INITIAL_RESIZING)
  const [columnVisibility, setColumnVisibility] = useState(controlledColumnVisibility ?? { ...defaultColumnVisibility })

  // Externally controlled state (nested sub-tables get it from the root's Sort / filter / columns panels).
  useUpdateEffect(() => {
    if (controlledSorting === null) return
    setSorting(controlledSorting)
    // Server tables must emit to refetch when the root's Sort panel pushes new rules.
    if (isServerPagination) {
      setPagination((p) => ({ ...p, pageIndex: 0 }))
      onSortChange?.(controlledSorting)
    }
  }, [controlledSorting])
  useUpdateEffect(() => {
    if (controlledColumnFilters !== null) setColumnFilters(controlledColumnFilters)
  }, [controlledColumnFilters])
  useUpdateEffect(() => {
    if (columnFiltersProp !== null) setColumnFilters(columnFiltersProp)
  }, [columnFiltersProp])
  useUpdateEffect(() => {
    if (controlledColumnVisibility !== null) setColumnVisibility(controlledColumnVisibility)
  }, [controlledColumnVisibility])

  // Sub-table state: managed by this table's toolbar, applied to every nested sub-table.
  const [subTableSorting, setSubTableSorting] = useState([])
  const [subTableColumnFilters, setSubTableColumnFilters] = useState([])
  const [subTableColumnVisibility, setSubTableColumnVisibility] = useState({})

  const [internalExpanded, setInternalExpanded] = useState({})
  const expanded = expandedRows ?? internalExpanded
  const toggleRowExpanded = (rowId) => {
    if (expandedRows !== null) onExpandedRowsChange?.({ ...expandedRows, [rowId]: !expandedRows[rowId] })
    else setInternalExpanded((e) => ({ ...e, [rowId]: !e[rowId] }))
  }

  // Primary key from column defs (falls back to 'id')
  const primaryKeyField = useMemo(() => {
    for (const col of columns) if (col.meta?.isPrimaryKey) return col.accessorKey ?? col.id ?? 'id'
    return 'id'
  }, [columns])
  const idOf = (row) => String(row[primaryKeyField] ?? row.id)
  const resolvedTotalFilteredCount = totalFilteredCount != null ? totalFilteredCount : totalCount
  const additionalSet = useMemo(() => new Set((additionalSelectedRowIds || []).map(String)), [additionalSelectedRowIds])

  const mergedSelectedIds = () => [...new Set([...additionalSet, ...Object.keys(rowSelection).map(String)])]
  const selectedCount = mergedSelectedIds().length

  // --- Staged edits: Map<rowId, { kind, changes?, snapshot? }> ---
  const [pendingEdits, setPendingEdits] = useState(() => new Map())
  const [committing, setCommitting] = useState(false)
  const insertCounter = useRef(0)
  const getRowById = (rowId) => rows.find((r) => idOf(r) === String(rowId))

  // Rows rendered by the grid with pending edits merged in.
  const effectiveRows = useMemo(() => {
    if (!stagedEdits || pendingEdits.size === 0) return rows
    const merged = rows.map((row) => {
      const entry = pendingEdits.get(String(row[primaryKeyField] ?? row.id))
      return entry?.kind === PENDING_EDIT_KINDS.UPDATE ? { ...row, ...entry.changes } : row // deletes render struck-through
    })
    // Pending inserts carry their synthetic id in `__stagedId` so getRowId stays unique even if the PK collides or is blank.
    for (const [rowId, entry] of pendingEdits) {
      if (entry.kind === PENDING_EDIT_KINDS.INSERT) merged.push({ ...entry.changes, __stagedId: rowId })
    }
    return merged
  }, [rows, stagedEdits, pendingEdits, primaryKeyField])

  function queueInsert(data) {
    insertCounter.current += 1
    const id = `${PENDING_INSERT_ID_PREFIX}${Date.now()}_${insertCounter.current}`
    setPendingEdits((prev) => new Map(prev).set(id, { kind: PENDING_EDIT_KINDS.INSERT, changes: { ...data } }))
  }

  function queueUpdate(rowId, changes) {
    const key = String(rowId)
    setPendingEdits((prev) => {
      const next = new Map(prev)
      const existing = next.get(key)
      const differs = (c, snap) => Object.keys(c).some((k) => c[k] !== snap?.[k])
      if (existing?.kind === PENDING_EDIT_KINDS.INSERT) {
        next.set(key, { kind: PENDING_EDIT_KINDS.INSERT, changes: { ...existing.changes, ...changes } })
      } else if (existing?.kind === PENDING_EDIT_KINDS.DELETE) {
        // Editing a row queued for delete cancels the delete and becomes an update.
        next.set(key, { kind: PENDING_EDIT_KINDS.UPDATE, changes: { ...changes }, snapshot: existing.snapshot ?? getRowById(key) })
      } else if (existing?.kind === PENDING_EDIT_KINDS.UPDATE) {
        const mergedChanges = { ...existing.changes, ...changes }
        // Drop the entry once every change matches the snapshot again.
        if (differs(mergedChanges, existing.snapshot)) next.set(key, { kind: PENDING_EDIT_KINDS.UPDATE, changes: mergedChanges, snapshot: existing.snapshot })
        else next.delete(key)
      } else {
        const snapshot = getRowById(key)
        if (differs(changes, snapshot)) next.set(key, { kind: PENDING_EDIT_KINDS.UPDATE, changes: { ...changes }, snapshot })
      }
      return next
    })
  }

  function queueDelete(ids) {
    setPendingEdits((prev) => {
      const next = new Map(prev)
      for (const raw of ids) {
        const id = String(raw)
        const existing = next.get(id)
        if (existing?.kind === PENDING_EDIT_KINDS.INSERT) next.delete(id) // deleting a pending insert discards it
        else next.set(id, { kind: PENDING_EDIT_KINDS.DELETE, snapshot: existing?.snapshot ?? getRowById(id) })
      }
      return next
    })
  }

  const undoRowEdit = (rowId) =>
    setPendingEdits((prev) => {
      const next = new Map(prev)
      next.delete(String(rowId))
      return next
    })

  const undoCellEdit = (rowId, colId) =>
    setPendingEdits((prev) => {
      const key = String(rowId)
      const entry = prev.get(key)
      if (!entry || entry.kind !== PENDING_EDIT_KINDS.UPDATE) return prev
      const { [colId]: _dropped, ...rest } = entry.changes
      const next = new Map(prev)
      if (Object.keys(rest).length === 0) next.delete(key)
      else next.set(key, { ...entry, changes: rest })
      return next
    })

  const getRowPendingState = (rowId) => pendingEdits.get(String(rowId))?.kind ?? null
  const getCellPendingState = (rowId, colId) => {
    const entry = pendingEdits.get(String(rowId))
    return entry?.kind === PENDING_EDIT_KINDS.UPDATE && colId in entry.changes ? 'modified' : null
  }
  const getCellPreviousValue = (rowId, colId) => {
    const entry = pendingEdits.get(String(rowId))
    return entry?.kind === PENDING_EDIT_KINDS.UPDATE ? entry.snapshot?.[colId] : undefined
  }

  function commitEdits() {
    if (committing || pendingEdits.size === 0) return
    const inserts = []
    const updates = []
    const deletes = []
    for (const [rowId, entry] of pendingEdits) {
      if (entry.kind === PENDING_EDIT_KINDS.INSERT) inserts.push({ ...entry.changes })
      else if (entry.kind === PENDING_EDIT_KINDS.UPDATE) updates.push({ id: rowId, changes: { ...entry.changes } })
      else if (entry.kind === PENDING_EDIT_KINDS.DELETE) deletes.push(rowId)
    }
    setCommitting(true)
    // Parent calls done(ok): true clears the queue, false keeps it for retry / discard.
    onCommitEdits?.({ inserts, updates, deletes }, (ok) => {
      setCommitting(false)
      if (ok) setPendingEdits(new Map())
    })
  }

  const table = useTable({
    features,
    data: effectiveRows,
    columns,
    defaultColumn: { filterFn: 'operator' },
    state: { sorting, columnFilters, rowSelection, pagination, columnSizing, columnResizing, columnVisibility },
    manualSorting: isServerPagination,
    manualFiltering: isServerPagination,
    manualPagination: isServerPagination,
    pageCount: isServerPagination ? Math.ceil(totalCount / pagination.pageSize) : undefined,
    onSortingChange: (u) => {
      const next = applyUpdater(u, sorting)
      setSorting(next)
      if (isServerPagination) onSortChange?.(next)
    },
    onColumnFiltersChange: (u) => {
      const next = applyUpdater(u, columnFilters)
      setColumnFilters(next)
      onColumnFiltersChange?.(next)
    },
    onRowSelectionChange: (u) => {
      const next = applyUpdater(u, rowSelection)
      const stripped = stripDeselectedAdditional(rowSelection, next, additionalSelectedRowIds)
      if (stripped) onAdditionalSelectedRowIdsChange?.(stripped)
      setRowSelection(next)
    },
    onPaginationChange: (u) => {
      const next = applyUpdater(u, pagination)
      setPagination(next)
      if (isServerPagination) onPageChange?.({ ...next })
    },
    onColumnSizingChange: (u) => setColumnSizing((prev) => applyUpdater(u, prev)),
    onColumnResizingChange: (u) => {
      const next = applyUpdater(u, columnResizing)
      setColumnResizing(next)
      if (columnResizing.isResizingColumn && !next.isResizingColumn) onColumnResize?.(columnSizing)
    },
    onColumnVisibilityChange: (u) => setColumnVisibility((prev) => applyUpdater(u, prev)),
    enableRowRangeSelection: false,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getRowId: (row) => (row.__stagedId ? String(row.__stagedId) : String(row[primaryKeyField] ?? row.id)),
  })

  /** `base` plus every on-page row whose id the parent holds in `additionalSelectedRowIds` (server mode only). */
  const withAdditionalOnPage = (base) => {
    if (totalCount == null || !additionalSelectedRowIds?.length) return base
    const next = { ...base }
    for (const row of rows) if (additionalSet.has(idOf(row))) next[idOf(row)] = true
    return next
  }
  // New rows (page change / refetch) reset checkboxes, keeping the parent's cross-page selection.
  useUpdateEffect(() => setRowSelection(withAdditionalOnPage({})), [rows])
  useUpdateEffect(() => setRowSelection((s) => withAdditionalOnPage(s)), [additionalSelectedRowIds, additionalSelectedRowIds?.length, totalCount])

  const clearFullSelection = () => {
    table.resetRowSelection()
    onAdditionalSelectedRowIdsChange?.([])
  }

  // Row edit panel
  const [editPanel, setEditPanel] = useState({ open: false, mode: 'insert', rowData: null })
  const openInsertPanel = () => setEditPanel({ open: true, mode: 'insert', rowData: null })
  const openEditPanel = (rowData) => setEditPanel({ open: true, mode: 'update', rowData: { ...rowData } })
  const closeEditPanel = useCallback(() => setEditPanel({ open: false, mode: 'insert', rowData: null }), [])
  const onToolbarInsertRow = () => {
    if (typeof defaultInsertLabel === 'string' && defaultInsertLabel.trim() !== '') onInsertRow?.()
    else openInsertPanel()
  }

  function handleSavePanel(data) {
    if (editPanel.mode === 'insert') {
      if (stagedEdits) queueInsert(data)
      else onInsertRow?.(data)
    } else if (stagedEdits) {
      const rowId = idOf(data)
      const original = getRowById(rowId) ?? {}
      const changes = {}
      for (const k of Object.keys(data)) if (k !== primaryKeyField && data[k] !== original[k]) changes[k] = data[k]
      if (Object.keys(changes).length > 0) queueUpdate(rowId, changes)
    } else {
      onUpdateRow?.({ id: data[primaryKeyField] ?? data.id, changes: data })
    }
    closeEditPanel()
  }

  function handleDeleteRows(ids) {
    if (stagedEdits) queueDelete(ids)
    else onDeleteRows?.(ids)
    table.resetRowSelection()
    onAdditionalSelectedRowIdsChange?.([])
  }

  function openDeleteConfirmation(ids) {
    const list = (ids ?? []).map(String).filter(Boolean)
    if (list.length > 0) setDeleteConfirm(list)
  }

  const handleUpdateCell = (rowId, colId, value) => {
    if (stagedEdits) queueUpdate(rowId, { [colId]: value })
    else onUpdateRow?.({ id: rowId, changes: { [colId]: value } })
  }

  // Context menu (one open across all nested tables, see contextMenuCoordinator)
  const [contextMenu, setContextMenu] = useState(null) // { x, y, row, cell }
  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
    releaseContextMenu(closeContextMenu)
  }, [])
  const openContextMenu = (event, row, cell) => {
    claimContextMenu(closeContextMenu)
    setContextMenu({ x: event.clientX, y: event.clientY, row, cell })
  }

  function handleFilterByValue(colId, val) {
    const value = { operator: '=', value: val }
    const next = columnFilters.some((f) => f.id === colId) ? columnFilters.map((f) => (f.id === colId ? { ...f, value } : f)) : [...columnFilters, { id: colId, value }]
    setColumnFilters(next)
    onColumnFiltersChange?.(next)
  }

  // --- Auto column sizing ---
  /** Canvas/content-based widths (min 60, max 500) for every leaf column. */
  function computeContentSizedColumns() {
    const sizing = {}
    if (typeof document === 'undefined') return sizing
    measureCtx ??= document.createElement('canvas').getContext('2d')
    const ctx = measureCtx
    if (!ctx) return sizing
    const fromRoot = rootElRef.current ? getComputedStyle(rootElRef.current).fontFamily : ''
    ctx.font = `13px ${fromRoot && fromRoot.trim() !== '' ? fromRoot : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}`
    const CELL_PADDING_PX = 16 // px-2 both sides
    const HEADER_CHROME_PX = 28 // chevron + sort indicator
    const sample = effectiveRows.slice(0, 200) // perf cap

    for (const col of table.getAllLeafColumns()) {
      const meta = col.columnDef.meta || {}
      let w = ctx.measureText(typeof col.columnDef.header === 'string' ? col.columnDef.header : String(col.id)).width
      if (showDataTypes && meta.type) w += 6 + ctx.measureText(meta.type).width
      const isSegmentedBar = !!meta.segmentedBar
      const isFixedUiCell = (meta.type === 'boolean' && !meta.badge) || !!meta.progressBar || isSegmentedBar || typeof meta.render === 'function'
      if (!isFixedUiCell) {
        const { accessorFn } = col.columnDef
        const accessorKey = col.columnDef.accessorKey ?? col.id
        sample.forEach((row, i) => {
          let value
          if (typeof accessorFn === 'function') {
            try {
              value = accessorFn(row, i)
            } catch {
              value = undefined
            }
          } else value = row?.[accessorKey]
          if (value != null) w = Math.max(w, ctx.measureText(String(value)).width)
        })
      }
      if (Array.isArray(meta.cellButtons) && meta.cellButtons.length > 0) w += widthPxForCellButtons(meta.cellButtons)
      let finalWidth = Math.ceil(w) + CELL_PADDING_PX + HEADER_CHROME_PX
      if (isSegmentedBar) finalWidth = Math.max(finalWidth, 200)
      sizing[col.id] = Math.min(Math.max(finalWidth, 60), 500)
    }
    return sizing
  }

  /**
   * Scales visible leaf columns so data columns sum to `viewport - sticky chrome` when the viewport
   * allows (stretch up, shrink down); below min width × count, baselines stay (horizontal scroll).
   */
  function applyAutoSizedColumnsForViewport(vw) {
    const out = computeContentSizedColumns()
    const ids = table.getVisibleLeafColumns().map((c) => c.id)
    if (Number.isFinite(vw) && vw > 0 && ids.length > 0) {
      const baselines = ids.map((id) => out[id] ?? DATA_TABLE_MIN_COLUMN_WIDTH_PX)
      const sum = baselines.reduce((a, b) => a + b, 0)
      const usable = Math.max(0, Math.floor(vw - DATA_TABLE_STICKY_CHROME_PX))
      if (sum > 0 && usable >= DATA_TABLE_MIN_COLUMN_WIDTH_PX * ids.length && sum !== usable) {
        const filled = distributeWidthsLargestRemainder(ids, baselines, usable)
        for (const id of ids) out[id] = filled[id]
      }
    }
    setColumnSizing(out)
  }

  // Latest sizing fn for the async callbacks below (they outlive the render that scheduled them).
  const autoSizeRef = useRef(applyAutoSizedColumnsForViewport)
  autoSizeRef.current = applyAutoSizedColumnsForViewport
  const hasInitiallyAutoSized = useRef(false)
  const viewportWidth = () => tableGridRef.current?.getScrollViewportInnerWidth?.() ?? 0

  useEffect(() => {
    let observer = null
    const raf = requestAnimationFrame(() => {
      const vw = viewportWidth()
      autoSizeRef.current(vw)
      hasInitiallyAutoSized.current = effectiveRows.length > 0
      if (vw > 0) return
      // Mounted hidden / zero-width (e.g. inside an opening dialog): size once it has a width.
      const target = tableGridRef.current?.getViewportResizeObserveTarget?.()
      if (target && typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => {
          const w = viewportWidth()
          if (w <= 0) return
          autoSizeRef.current(w)
          observer.disconnect()
          observer = null
        })
        observer.observe(target)
      }
    })
    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
      releaseContextMenu(closeContextMenu)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hasInitiallyAutoSized.current || rows.length === 0) return
    hasInitiallyAutoSized.current = true
    const raf = requestAnimationFrame(() => autoSizeRef.current(viewportWidth()))
    return () => cancelAnimationFrame(raf)
  }, [rows])

  useImperativeHandle(ref, () => ({
    openDeleteConfirmation,
    /** Current Sort-panel rules for nested tables (depth 0), for caller refetch hooks. */
    getSubTableSorting: () => subTableSorting,
  }))

  const ctx = {
    themeVars,
    table,
    tableName,
    showDataTypes,
    editable: editableCaps,
    showRowBorders,
    showColumnBorders,
    cellButtonVisibility,
    cellOverflow,
    insertRow: () => onInsertRow?.(),
    emitInsertAction: (key) => onInsertAction?.(key),
    openInsertPanel,
    emptyTitle,
    emptyMessage,
    defaultInsertLabel,
    insertActions,
    loading,
    isRowDisplayedSelected: (row) => row.getIsSelected() || additionalSet.has(String(row.original[primaryKeyField] ?? row.original.id)),
    highlightedRowId: highlightedRowId != null && highlightedRowId !== '' ? String(highlightedRowId) : null,
    expanded,
    toggleRowExpanded,
    getSubTable,
    nestingDepth,
    parentTheme: theme,
    parentAccentColor: accentColor,
    subTableSorting,
    setSubTableSorting,
    subTableColumnFilters,
    subTableColumnVisibility,
    stagedEditsEnabled: stagedEdits,
    getRowPendingState,
    getCellPendingState,
    getCellPreviousValue,
    undoRowEdit,
    undoCellEdit,
  }

  const hasSelection = selectedCount > 0

  return (
    <DTFontContext.Provider value={resolvedFont}>
      <DTContext.Provider value={ctx}>
        <div
          ref={rootElRef}
          className={`data-table-root flex flex-col text-[13px]${nestingDepth === 0 ? ' flex-1 min-h-0 min-w-0' : ''}`}
          data-st-theme={theme}
          style={{ ...themeVars, backgroundColor: 'var(--st-bg)', color: 'var(--st-text)' }}
        >
          {showToolbar &&
            (hasSelection ? (
              <SelectionToolbar
                selectedCount={selectedCount}
                table={table}
                editable={editableCaps}
                selectionActions={selectionActions}
                contextMenuActions={contextMenuActions}
                enableSelectAll={enableSelectAll}
                totalFilteredCount={isServerPagination ? resolvedTotalFilteredCount : null}
                enableSelectAllMatching={enableSelectAllMatching}
                countLabelSingular={countLabelSingular}
                countLabelPlural={countLabelPlural}
                onDeleteConfirmRequest={() => openDeleteConfirmation(mergedSelectedIds())}
                onSelectionAction={(action, selRows) => onSelectionAction?.(action, selRows, mergedSelectedIds())}
                onSelectAllMatching={() => onSelectAllMatching?.()}
                onClearFullSelection={clearFullSelection}
              />
            ) : (
              <TableToolbar
                table={table}
                sorting={sorting}
                columnFilters={columnFilters}
                columnVisibility={columnVisibility}
                defaultColumnVisibility={defaultColumnVisibility}
                editable={editableCaps}
                loading={loading}
                isEmpty={effectiveRows.length === 0}
                defaultInsertLabel={defaultInsertLabel}
                insertActions={insertActions}
                toolbarActions={toolbarActions}
                toolbarActionsLabel={toolbarActionsLabel}
                subTableColumns={subTableColumns}
                subTableSorting={subTableSorting}
                subTableColumnFilters={subTableColumnFilters}
                subTableColumnVisibility={subTableColumnVisibility}
                tableName={tableName}
                onSortingChange={setSorting}
                onColumnFiltersChange={(val) => {
                  setColumnFilters(val)
                  onColumnFiltersChange?.(val)
                }}
                onColumnVisibilityChange={setColumnVisibility}
                onSubTableSortingChange={setSubTableSorting}
                onSubTableColumnFiltersChange={setSubTableColumnFilters}
                onSubTableColumnVisibilityChange={setSubTableColumnVisibility}
                onInsertRow={onToolbarInsertRow}
                onInsertAction={(key) => onInsertAction?.(key)}
                onRefresh={() => onRefresh?.()}
                onToolbarAction={(key) => onToolbarAction?.(key)}
              />
            ))}

          {error && !errorDismissed && (
            <div
              role="alert"
              className="flex items-center gap-2 px-3 py-2 text-[13px] shrink-0"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
            >
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
              <TableGrid ref={tableGridRef} table={table} onUpdateCell={handleUpdateCell} onContextMenu={openContextMenu} onEditRow={openEditPanel} />
              {showPagination && (
                <TablePagination
                  table={table}
                  totalCount={totalCount}
                  hasRandomAccess={hasRandomAccess}
                  stagedEdits={stagedEdits}
                  pendingEditCount={pendingEdits.size}
                  committing={committing || loading}
                  countLabelSingular={countLabelSingular}
                  countLabelPlural={countLabelPlural}
                  onCommit={commitEdits}
                  onDiscard={() => {
                    setPendingEdits(new Map())
                    onDiscardEdits?.()
                  }}
                />
              )}
            </div>
            {(editableCaps.insert || editableCaps.update) && editPanel.open && (
              <RowEditPanel
                key={editPanel.mode + JSON.stringify(editPanel.rowData)}
                mode={editPanel.mode}
                rowData={editPanel.rowData}
                table={table}
                tableName={tableName}
                onSave={handleSavePanel}
                onClose={closeEditPanel}
              />
            )}
          </div>

          <DeleteRowsConfirmDialog
            open={deleteConfirm !== null}
            rowCount={deleteConfirm?.length ?? 0}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={() => {
              const ids = deleteConfirm
              setDeleteConfirm(null)
              handleDeleteRows(ids)
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
              onEditRow={() => openEditPanel(contextMenu.row.original)}
              onDeleteRow={() => openDeleteConfirmation([contextMenu.row.id])}
              onFilterByValue={handleFilterByValue}
              onUndoRow={() => undoRowEdit(contextMenu.row.id)}
              onUndoCell={(colId) => undoCellEdit(contextMenu.row.id, colId)}
              onRowAction={(key, rowData) => onRowAction?.(key, rowData)}
            />
          )}
        </div>
      </DTContext.Provider>
    </DTFontContext.Provider>
  )
})

export default DataTable
