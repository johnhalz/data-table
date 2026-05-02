<script setup>
import TableGridDataRow from './TableGridDataRow.vue'

defineProps({
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
      :selected-cell="selectedCell"
      :editing-row-id="editingRowId"
      @toggle-row-select="(r, e, idx) => emit('toggle-row-select', r, e, idx)"
      @edit-row="(orig) => emit('edit-row', orig)"
      @context-menu="(ev, r, cell) => emit('context-menu', ev, r, cell)"
      @select-cell="(rid, cid) => emit('select-cell', rid, cid)"
      @update-cell="(rid, cid, val) => emit('update-cell', rid, cid, val)"
      @editing-change="(editing, rid) => emit('editing-change', editing, rid)"
    />
  </div>
</template>
