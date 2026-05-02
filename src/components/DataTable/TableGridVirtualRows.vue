<script setup>
import { computed, inject, unref } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import TableGridDataRow from './TableGridDataRow.vue'

const props = defineProps({
  rows: { type: Array, required: true },
  scrollElementRef: { type: Object, required: true },
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

const cellOverflowProvided = inject('cellOverflow', 'truncate')
const getSubTable = inject('getSubTable', null)
const expandedInject = inject('expanded')

const EST_ROW_TRUNCATE = 36
const EST_ROW_WRAP = 56
const EST_ROW_EXPAND_TOGGLE = 40
const EST_ROW_EXPANDED_SHELL = 300

const useScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window

/** Snapshot for reactive virtual estimates when rows expand/collapse */
const expandedMap = computed(() => unref(expandedInject) ?? {})

const virtualizer = useVirtualizer(
  computed(() => {
    const rowModels = props.rows
    const exp = expandedMap.value
    const wrap = unref(cellOverflowProvided) === 'wrap'

    const cache = {}
    const gt = getSubTable
    if (gt) {
      for (const row of rowModels) {
        const cfg = gt(row.original)
        if (cfg) cache[row.id] = cfg
      }
    }

    return {
      count: rowModels.length,
      getScrollElement: () => unref(props.scrollElementRef),
      estimateSize: (index) => {
        const row = rowModels[index]
        if (!row) return EST_ROW_TRUNCATE
        const base = wrap ? EST_ROW_WRAP : EST_ROW_TRUNCATE
        if (cache[row.id]) {
          if (exp[row.id]) return Math.max(base, EST_ROW_EXPANDED_SHELL)
          return Math.max(base, EST_ROW_EXPAND_TOGGLE)
        }
        return base
      },
      overscan: 8,
      getItemKey: (index) => rowModels[index]?.id ?? index,
      useScrollendEvent: useScrollEnd,
      isScrollingResetDelay: useScrollEnd ? 100 : 150,
    }
  }),
)

const virtualRows = computed(() => virtualizer.value.getVirtualItems())
const totalHeight = computed(() => virtualizer.value.getTotalSize())

function bindMeasure(el, vRow) {
  if (!el || vRow == null) return
  const dom = el.$el ?? el
  if (!dom || typeof dom.setAttribute !== 'function') return
  dom.setAttribute('data-index', String(vRow.index))
  virtualizer.value.measureElement(dom)
}

function orderForIndex(i) {
  return props.paginationState.pageIndex * props.paginationState.pageSize + i + 1
}
</script>

<template>
  <div
    :style="{
      position: 'relative',
      height: totalHeight + 'px',
      width: totalTableWidth + 'px',
    }"
  >
    <TableGridDataRow
      v-for="vRow in virtualRows"
      :key="vRow.key"
      :ref="(el) => bindMeasure(el, vRow)"
      :row="rows[vRow.index]"
      :row-index="vRow.index"
      :order-number="orderForIndex(vRow.index)"
      :virtual-offset-y="vRow.start"
      :total-table-width="totalTableWidth"
      :selected-cell="selectedCell"
      :editing-row-id="editingRowId"
      @toggle-row-select="(r, e, idx) => emit('toggle-row-select', r, e, idx)"
      @edit-row="(orig) => emit('edit-row', orig)"
      @context-menu="(ev, row, cell) => emit('context-menu', ev, row, cell)"
      @select-cell="(rid, cid) => emit('select-cell', rid, cid)"
      @update-cell="(rid, cid, val) => emit('update-cell', rid, cid, val)"
      @editing-change="(editing, rid) => emit('editing-change', editing, rid)"
    />
  </div>
</template>
