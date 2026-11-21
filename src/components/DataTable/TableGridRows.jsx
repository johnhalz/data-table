import { useVirtualizer } from '@tanstack/react-virtual'
import TableGridDataRow from './TableGridDataRow.jsx'
import { useDT } from './context.js'

/** This row's selected column id, from the grid's single `selectedCell` ("rowId:colId"). */
function selectedColIdForRow(selectedCell, rowId) {
  if (!selectedCell) return null
  const prefix = `${rowId}:`
  return selectedCell.startsWith(prefix) ? selectedCell.slice(prefix.length) : null
}

const orderFor = (i, p) => p.pageIndex * p.pageSize + i + 1

/** ≤ virtualization threshold: rows in document flow (stable scrollbar track). */
export function TableGridFlowRows({ rows, totalTableWidth, selectedCell, editingRowId, paginationState, on }) {
  return (
    <div className="flex flex-col" role="rowgroup" style={{ width: totalTableWidth + 'px' }}>
      {rows.map((row, i) => (
        <TableGridDataRow
          key={row.id}
          row={row}
          rowIndex={i}
          orderNumber={orderFor(i, paginationState)}
          totalTableWidth={totalTableWidth}
          selectedColId={selectedColIdForRow(selectedCell, row.id)}
          isEditing={editingRowId === row.id}
          on={on}
        />
      ))}
    </div>
  )
}

const EST_ROW_TRUNCATE = 36
const EST_ROW_WRAP = 56
const EST_ROW_EXPAND_TOGGLE = 40
const EST_ROW_EXPANDED_SHELL = 300
const useScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window

/** > threshold: TanStack Virtual. */
export function TableGridVirtualRows({ rows, scrollElementRef, totalTableWidth, selectedCell, editingRowId, paginationState, on }) {
  const { cellOverflow = 'truncate', getSubTable, expanded = {} } = useDT()
  const wrap = cellOverflow === 'wrap'

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: (index) => {
      const row = rows[index]
      const base = wrap ? EST_ROW_WRAP : EST_ROW_TRUNCATE
      if (!row || !getSubTable?.(row.original)) return base
      return Math.max(base, expanded[row.id] ? EST_ROW_EXPANDED_SHELL : EST_ROW_EXPAND_TOGGLE)
    },
    overscan: 8,
    getItemKey: (index) => rows[index]?.id ?? index,
    useScrollendEvent: useScrollEnd,
    isScrollingResetDelay: useScrollEnd ? 100 : 150,
  })

  return (
    // shrink-0: rows are absolutely positioned, so as a flex item this would otherwise collapse to ~0 and cap scrolling
    <div
      className="shrink-0"
      role="rowgroup"
      style={{ position: 'relative', height: virtualizer.getTotalSize() + 'px', width: totalTableWidth + 'px' }}
    >
      {virtualizer.getVirtualItems().map((vRow) => {
        const row = rows[vRow.index]
        if (!row) return null
        return (
          <TableGridDataRow
            key={vRow.key}
            ref={virtualizer.measureElement}
            row={row}
            rowIndex={vRow.index}
            orderNumber={orderFor(vRow.index, paginationState)}
            virtualOffsetY={vRow.start}
            totalTableWidth={totalTableWidth}
            selectedColId={selectedColIdForRow(selectedCell, row.id)}
            isEditing={editingRowId === row.id}
            on={on}
          />
        )
      })}
    </div>
  )
}
