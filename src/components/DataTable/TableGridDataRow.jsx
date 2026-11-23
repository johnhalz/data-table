import { forwardRef } from 'react'
import TableCell from './TableCell.jsx'
import DataTable from './DataTable.jsx'
import { useDT } from './context.js'
import { DATA_TABLE_ROW_NUMBER_COL_PX, DATA_TABLE_ROW_SELECT_COL_PX } from './columnSizingFill.js'

/**
 * Body row: `#` column, expand / edit toggle, checkbox, cells, sub-table.
 * `virtualOffsetY` null = document-flow layout; else the TanStack Virtual Y offset.
 * `on` carries the grid's row handlers: toggleRowSelect, editRow, contextMenu, selectCell, updateCell, editingChange.
 */
const TableGridDataRow = forwardRef(function TableGridDataRow(
  { row, rowIndex, orderNumber, virtualOffsetY = null, totalTableWidth, selectedColId = null, isEditing = false, on },
  ref,
) {
  const dt = useDT()
  const {
    editable,
    showRowBorders = true,
    showColumnBorders = true,
    getSubTable,
    expanded = {},
    toggleRowExpanded = () => {},
    nestingDepth = 0,
    parentTheme = 'dark',
    parentAccentColor = '#3ecf8e',
    subTableSorting,
    setSubTableSorting,
    subTableColumnFilters,
    subTableColumnVisibility,
    getRowPendingState = () => null,
    isRowDisplayedSelected,
    highlightedRowId,
  } = dt

  const looksSelected = typeof isRowDisplayedSelected === 'function' ? isRowDisplayedSelected(row) : row.getIsSelected()
  const isActive = highlightedRowId != null && highlightedRowId !== '' && row.id === highlightedRowId
  const pending = getRowPendingState(row.id)

  const stickyColShadow = (showColumnBorders ? 'inset -1px 0 0 var(--st-border), ' : '') + '2px 0 4px var(--st-shadow-sticky)'

  const subCfg = getSubTable?.(row.original) ?? null
  const { onRowAction, onPageChange, onSortChange, ...subTableProps } = subCfg ?? {}
  const isExpanded = !!expanded?.[row.id]
  const borderBottom = showRowBorders ? '1px solid var(--st-border)' : 'none'

  const wrapperStyle =
    virtualOffsetY == null
      ? { width: '100%' }
      : {
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          transform: `translateY(${virtualOffsetY}px)`,
          zIndex: isEditing ? 5 : 'auto',
        }

  const cls = ['st-row']
  if (looksSelected) cls.push('st-row--selected')
  if (isActive) cls.push('st-row--active')
  if (pending === 'insert') cls.push('st-row--pending-insert')
  if (pending === 'delete') cls.push('st-row--pending-delete')

  return (
    <div
      ref={ref}
      className={cls.join(' ')}
      style={wrapperStyle}
      data-index={virtualOffsetY != null ? rowIndex : undefined}
    >
      <div className="group/row" role="row" style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
        <div
          className="py-1.5 align-middle sticky left-0 z-10 st-sticky-cell"
          role="cell"
          style={{
            display: 'table-cell',
            width: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
            minWidth: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
            borderBottom,
          }}
        >
          <div className="flex h-full gap-1 pr-1.5 pl-1 items-center justify-end pl-0.5">
            <div className="flex min-w-0 flex-1 items-center">
              <div className="flex w-4 shrink-0 items-center justify-center">
                {subCfg ? (
                  <button
                    type="button"
                    className="flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-150"
                    style={{
                      color: isExpanded ? 'var(--st-accent)' : 'var(--st-text-secondary)',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                    title="Toggle sub-table"
                    aria-label="Toggle sub-table"
                    aria-expanded={isExpanded}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleRowExpanded(row.id)
                    }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6 3l5 5-5 5V3z" />
                    </svg>
                  </button>
                ) : editable?.update ? (
                  <button
                    type="button"
                    className="invisible group-hover/row:visible flex items-center justify-center w-4 h-4 shrink-0"
                    style={{ color: 'var(--st-text-secondary)' }}
                    title="Expand row"
                    aria-label="Expand row"
                    onClick={(e) => {
                      e.stopPropagation()
                      on.editRow?.(row.original)
                    }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2h8v8M14 2L6 10" />
                    </svg>
                  </button>
                ) : null}
              </div>
              <span
                className="min-w-0 flex-1 text-xs tabular-nums whitespace-nowrap text-right overflow-hidden"
                style={{ color: 'var(--st-text-tertiary)' }}
              >
                {orderNumber}
              </span>
            </div>
          </div>
        </div>
        <div
          className="px-1 py-1.5 text-center align-middle sticky z-10 st-sticky-cell"
          role="cell"
          style={{
            display: 'table-cell',
            width: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
            minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
            left: DATA_TABLE_ROW_NUMBER_COL_PX + 'px',
            borderBottom,
            boxShadow: stickyColShadow,
          }}
        >
          <input
            type="checkbox"
            className="cursor-pointer align-middle"
            style={{ accentColor: 'var(--st-accent)' }}
            aria-label="Select row"
            checked={looksSelected}
            onChange={() => {}}
            onClick={(e) => on.toggleRowSelect?.(row, e, rowIndex)}
          />
        </div>
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            cell={cell}
            isSelected={selectedColId === cell.column.id}
            onSelect={() => on.selectCell?.(row.id, cell.column.id)}
            onUpdate={(value) => on.updateCell?.(row.id, cell.column.id, value)}
            onEditingChange={(editing) => on.editingChange?.(editing, row.id)}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
              on.contextMenu?.(e, row, cell)
            }}
          />
        ))}
      </div>

      {isExpanded && subCfg && (
        <div style={{ display: 'block', width: totalTableWidth + 'px', borderBottom }}>
          <div
            style={{
              borderLeft: '3px solid var(--st-accent)',
              marginLeft: 10 + Number(nestingDepth || 0) * 16 + 'px',
              backgroundColor: 'var(--st-bg)',
            }}
          >
            {/* Remount once lazily-loaded `rows` arrive. Not per length: a short last page would reset the page number. */}
            <DataTable
              key={`${row.id}-${(subCfg.rows ?? []).length > 0}`}
              {...subTableProps}
              editable={subCfg.editable ?? { insert: false, update: false, delete: false }}
              theme={subCfg.theme ?? parentTheme}
              accentColor={subCfg.accentColor ?? parentAccentColor}
              nestingDepth={nestingDepth + 1}
              controlledSorting={subTableSorting}
              controlledColumnFilters={subTableColumnFilters}
              controlledColumnVisibility={subTableColumnVisibility}
              onRowAction={(key, rowData) => onRowAction?.(key, rowData)}
              onPageChange={(p) => onPageChange?.(p)}
              onSortChange={(sorting) => {
                onSortChange?.(sorting)
                setSubTableSorting?.(sorting)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
})

export default TableGridDataRow
