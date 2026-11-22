import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import TableColumnHeader from './TableColumnHeader.jsx'
import InsertMenuButton from './InsertMenuButton.jsx'
import { TableGridFlowRows, TableGridVirtualRows } from './TableGridRows.jsx'
import { useDT } from './context.js'
import { DATA_TABLE_STICKY_CHROME_PX, DATA_TABLE_ROW_NUMBER_COL_PX, DATA_TABLE_ROW_SELECT_COL_PX } from './columnSizingFill.js'

/** Rows at or below this render in document flow (stable scrollbar track); above uses TanStack Virtual. */
const ROW_VIRTUALIZATION_THRESHOLD = 500
/** Placeholder rows while `loading` is true and there is no data yet. */
const SKELETON_ROW_COUNT = 8
/** Stable bar widths (%) for skeleton cells: cycles by (row + col) index. */
const SKELETON_BAR_WIDTH_PCT = [60, 75, 85, 55, 70, 80, 65, 90]

/**
 * Header + body rows + skeleton + empty state. Ref exposes `getScrollViewportInnerWidth()` and
 * `getViewportResizeObserveTarget()` for the parent's auto column sizing.
 */
const TableGrid = forwardRef(function TableGrid({ table, onUpdateCell, onContextMenu, onEditRow }, ref) {
  const {
    editable,
    showRowBorders = true,
    showColumnBorders = true,
    loading = false,
    emptyTitle = 'No rows found',
    emptyMessage = 'Get started by inserting a new row.',
    openInsertPanel,
    defaultInsertLabel,
    insertActions,
    insertRow = () => {},
    emitInsertAction = () => {},
    nestingDepth = 0,
    isRowDisplayedSelected,
  } = useDT()

  const [selectedCell, setSelectedCell] = useState(null)
  const [editingRowId, setEditingRowId] = useState(null)
  const lastClickedRowIndex = useRef(null)
  const scrollerRef = useRef(null)

  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const totalTableWidth = DATA_TABLE_STICKY_CHROME_PX + visibleColumns.reduce((sum, col) => sum + col.getSize(), 0)
  const paginationState = table.atoms.pagination?.get() ?? { pageIndex: 0, pageSize: rows.length }

  const looksSelected = (row) => (typeof isRowDisplayedSelected === 'function' ? isRowDisplayedSelected(row) : row.getIsSelected())
  const allPage = rows.length > 0 && rows.every(looksSelected)
  const somePage = rows.length > 0 && !allPage && rows.some(looksSelected)
  const borderBottom = showRowBorders ? '1px solid var(--st-border)' : 'none'
  const stickyColShadow = (showColumnBorders ? 'inset -1px 0 0 var(--st-border), ' : '') + '2px 0 4px var(--st-shadow-sticky)'

  /** Scroll shell for horizontal clipping: root uses the scroller; nested uses its parent `overflow-auto` wrapper */
  const getViewportScrollShell = () => {
    const inner = scrollerRef.current
    if (!inner) return null
    return nestingDepth > 0 ? inner.parentElement : inner
  }
  useImperativeHandle(ref, () => ({
    getScrollViewportInnerWidth: () => getViewportScrollShell()?.clientWidth ?? 0,
    getViewportResizeObserveTarget: getViewportScrollShell,
  }))

  const on = {
    toggleRowSelect(row, event, rowIndex) {
      if (event?.shiftKey && lastClickedRowIndex.current !== null) {
        const start = Math.min(lastClickedRowIndex.current, rowIndex)
        const end = Math.max(lastClickedRowIndex.current, rowIndex)
        for (let i = start; i <= end; i++) rows[i].toggleSelected(true)
      } else {
        row.toggleSelected(!looksSelected(row))
      }
      lastClickedRowIndex.current = rowIndex
    },
    editRow: (o) => onEditRow?.(o),
    contextMenu: (e, row, cell) => onContextMenu?.(e, row, cell),
    selectCell: (rowId, colId) => setSelectedCell(`${rowId}:${colId}`),
    updateCell: (rid, cid, val) => onUpdateCell?.(rid, cid, val),
    editingChange: (editing, rowId) => setEditingRowId(editing ? rowId : null),
  }

  const rowProps = { rows, totalTableWidth, selectedCell, editingRowId, paginationState, on }
  const insertActionList = Array.isArray(insertActions) ? insertActions : []
  const insertLabel = defaultInsertLabel == null ? '' : String(defaultInsertLabel).trim()

  return (
    <div className={nestingDepth === 0 ? 'flex-1 min-h-0 relative' : 'overflow-auto relative min-h-[180px]'}>
      <div
        ref={scrollerRef}
        role="table"
        className={nestingDepth === 0 ? 'absolute inset-0 overflow-auto flex flex-col items-start min-h-0' : 'flex flex-col items-start'}
        style={{ scrollbarGutter: 'stable' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedCell(null)
        }}
      >
        {/* Sticky shell: vertical stick lives on this block so it still works when the body is a flex sibling. */}
        <div
          className="sticky top-0 z-[26] shrink-0 isolate"
          role="rowgroup"
          style={{ width: totalTableWidth + 'px', backgroundColor: 'var(--st-bg-header)' }}
        >
          <table role="presentation" className="border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent" style={{ width: totalTableWidth + 'px' }}>
            <thead role="presentation">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} role="row">
                  <th
                    role="columnheader"
                    className="px-1.5 py-1.5 text-right font-normal sticky left-0 z-[40]"
                    style={{
                      width: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
                      minWidth: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
                      backgroundColor: 'var(--st-bg-header)',
                      borderBottom,
                      color: 'var(--st-text-tertiary)',
                    }}
                  >
                    <span className="text-xs">#</span>
                  </th>
                  <th
                    role="columnheader"
                    aria-label="Select all rows on this page"
                    className="px-1 py-1.5 text-center align-middle sticky z-[39]"
                    style={{
                      width: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                      minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                      left: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
                      backgroundColor: 'var(--st-bg-header)',
                      borderBottom,
                      boxShadow: stickyColShadow,
                    }}
                  >
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
                      onChange={() => table.toggleAllPageRowsSelected(!allPage)}
                    />
                  </th>
                  {headerGroup.headers.map((header) => (
                    <TableColumnHeader key={header.id} header={header} table={table} />
                  ))}
                </tr>
              ))}
            </thead>
          </table>
        </div>

        {rows.length > 0 && rows.length > ROW_VIRTUALIZATION_THRESHOLD ? (
          <TableGridVirtualRows {...rowProps} scrollElementRef={scrollerRef} />
        ) : rows.length > 0 ? (
          <TableGridFlowRows {...rowProps} />
        ) : loading ? (
          <div className="shrink-0" style={{ width: totalTableWidth + 'px' }} aria-busy="true">
            <table className="border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent" style={{ width: totalTableWidth + 'px' }}>
              <tbody>
                {Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIdx) => (
                  <tr key={rowIdx}>
                    <td
                      className="sticky left-0 z-10 py-1.5 align-middle"
                      style={{
                        width: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
                        minWidth: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
                        backgroundColor: 'var(--st-bg)',
                        borderBottom,
                      }}
                    />
                    <td
                      className="sticky z-10 px-1 py-1.5 text-center align-middle"
                      style={{
                        width: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                        minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                        left: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
                        backgroundColor: 'var(--st-bg)',
                        borderBottom,
                        boxShadow: stickyColShadow,
                      }}
                    />
                    {visibleColumns.map((col, colIdx) => (
                      <td key={col.id} className="px-2 py-1.5 align-middle" style={{ width: col.getSize() + 'px', borderBottom, backgroundColor: 'var(--st-bg)' }}>
                        <div
                          className="animate-pulse rounded max-w-full"
                          style={{
                            width: SKELETON_BAR_WIDTH_PCT[(rowIdx + colIdx) % SKELETON_BAR_WIDTH_PCT.length] + '%',
                            height: '12px',
                            backgroundColor: 'var(--st-border-secondary)',
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {/* Empty state — absolute overlay so it stays centered regardless of horizontal scroll */}
      {rows.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '33px' }}>
          <div className="flex flex-col items-center gap-4 text-center px-6 pointer-events-auto">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ backgroundColor: 'var(--st-accent-bg)', border: '1px solid var(--st-accent-border-light)' }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--st-accent)' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M9 9v9M15 9v9" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[15px]" style={{ color: 'var(--st-text)' }}>{emptyTitle}</p>
              <p className="text-[13px] max-w-xs leading-relaxed" style={{ color: 'var(--st-text-tertiary)' }}>{emptyMessage}</p>
            </div>
            {editable?.insert && (
              <div className="mt-1">
                <InsertMenuButton
                  label={insertLabel}
                  insertActions={insertActionList}
                  onInsertRow={insertRow}
                  onInsertAction={emitInsertAction}
                  onOpenInsertPanel={() => openInsertPanel?.()}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

export default TableGrid
