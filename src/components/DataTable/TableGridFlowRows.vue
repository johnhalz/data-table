<script setup>
import TableGridDataRow from './TableGridDataRow.vue'

const props = defineProps({
  rows: { type: Array, required: true },
  totalTableWidth: { type: Number, required: true },
  selectedCell: { type: String, default: null },
  editingRowId: { type: [String, Number, null], default: null },
  paginationState: { type: Object, required: true },
})

const emit = defineEmits([
  'toggle-row-select',
  'edit-row',
  'context-menu',
  'select-cell',
  'update-cell',
  'editing-change',
])

function orderForIndex(i, state) {
  return state.pageIndex * state.pageSize + i + 1
}

/**
 * Derive per-row selection props from the single global `selectedCell` string so an
 * unrelated row's props stay referentially equal across a click — Vue then skips
 * re-rendering it instead of every row re-evaluating its cells on every selection change.
 */
function selectedColIdForRow(rowId) {
  const sel = props.selectedCell
  if (!sel) return null
  const prefix = `${rowId}:`
  return sel.startsWith(prefix) ? sel.slice(prefix.length) : null
}
</script>

<template>
  <div class="flex flex-col" :style="{ width: totalTableWidth + 'px' }">
    <TableGridDataRow
      v-for="(row, rowIndex) in rows"
      :key="row.id"
      :row="row"
      :row-index="rowIndex"
      :order-number="orderForIndex(rowIndex, paginationState)"
      :total-table-width="totalTableWidth"
      :selected-col-id="selectedColIdForRow(row.id)"
      :is-editing="editingRowId === row.id"
      @toggle-row-select="(r, e, idx) => emit('toggle-row-select', r, e, idx)"
      @edit-row="(orig) => emit('edit-row', orig)"
      @context-menu="(ev, r, cell) => emit('context-menu', ev, r, cell)"
      @select-cell="(rid, cid) => emit('select-cell', rid, cid)"
      @update-cell="(rid, cid, val) => emit('update-cell', rid, cid, val)"
      @editing-change="(editing, rid) => emit('editing-change', editing, rid)"
    />
  </div>
</template>
