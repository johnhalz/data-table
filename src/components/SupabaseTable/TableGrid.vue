<script setup>
import { ref, computed, inject } from 'vue'
import { FlexRender } from '@tanstack/vue-table'
import TableColumnHeader from './TableColumnHeader.vue'
import TableCell from './TableCell.vue'

const props = defineProps({
  table: { type: Object, required: true },
  rerenderKey: { type: Number, default: 0 },
})

const editable = inject('editable', true)
const showRowBorders = inject('showRowBorders', true)
const showColumnBorders = inject('showColumnBorders', true)

const emit = defineEmits(['update-cell', 'context-menu'])

const selectedCell = ref(null)

// Force computed to depend on rerenderKey so these recompute on state changes
const headerGroups = computed(() => {
  void props.rerenderKey
  return props.table.getHeaderGroups()
})

// Total table width = sticky columns (44 + 40) + sum of all visible column sizes
const totalTableWidth = computed(() => {
  void props.rerenderKey
  const dataColWidth = props.table.getVisibleLeafColumns().reduce((sum, col) => sum + col.getSize(), 0)
  return 84 + dataColWidth
})

const rows = computed(() => {
  void props.rerenderKey
  return props.table.getRowModel().rows
})

const paginationState = computed(() => {
  void props.rerenderKey
  return props.table.getState().pagination
})

const isAllSelected = computed(() => {
  void props.rerenderKey
  return props.table.getIsAllRowsSelected()
})

const isSomeSelected = computed(() => {
  void props.rerenderKey
  return props.table.getIsSomeRowsSelected()
})

function selectCell(rowId, colId) {
  selectedCell.value = `${rowId}:${colId}`
}

function clearSelection() {
  selectedCell.value = null
}

function handleRowContextMenu(event, row, cell) {
  emit('context-menu', event, row, cell)
}

function toggleAllRows() {
  props.table.toggleAllRowsSelected(!isAllSelected.value)
}

const lastClickedRowIndex = ref(null)

function toggleRow(row, event, rowIndex) {
  if (event?.shiftKey && lastClickedRowIndex.value !== null) {
    const start = Math.min(lastClickedRowIndex.value, rowIndex)
    const end = Math.max(lastClickedRowIndex.value, rowIndex)
    const allRows = rows.value
    for (let i = start; i <= end; i++) {
      allRows[i].toggleSelected(true)
    }
  } else {
    row.toggleSelected(!row.getIsSelected())
  }
  lastClickedRowIndex.value = rowIndex
}

function isRowSelected(row) {
  void props.rerenderKey
  return row.getIsSelected()
}

function openEditPanel(rowOriginal) {
  emit('edit-row', rowOriginal)
}

const stickyColShadow = computed(() => {
  const border = showColumnBorders ? 'inset -1px 0 0 var(--st-border)' : ''
  const shadow = '2px 0 4px var(--st-shadow-sticky)'
  return border ? `${border}, ${shadow}` : shadow
})
</script>

<template>
  <div class="flex-1 overflow-auto min-h-0" @click.self="clearSelection">
    <table class="border-collapse table-fixed" :style="{ width: totalTableWidth + 'px' }">
      <thead class="sticky top-0 z-20">
        <tr
          v-for="headerGroup in headerGroups"
          :key="headerGroup.id"
        >
          <!-- Row number header -->
          <th
            class="px-1.5 py-1.5 text-right font-normal sticky left-0 z-30"
            :style="{
              width: '44px', minWidth: '44px',
              backgroundColor: 'var(--st-bg-header)',
              borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
              color: 'var(--st-text-tertiary)',
            }"
          >
            <span class="text-xs">#</span>
          </th>
          <!-- Checkbox header -->
          <th
            class="px-1 py-1.5 text-center sticky z-30"
            :style="{
              width: '40px', minWidth: '40px', left: '44px',
              backgroundColor: 'var(--st-bg-header)',
              borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
              boxShadow: stickyColShadow,
            }"
          >
            <input
              type="checkbox"
              class="cursor-pointer"
              :style="{ accentColor: 'var(--st-accent)' }"
              :checked="isAllSelected"
              :indeterminate="isSomeSelected"
              @change="toggleAllRows"
            />
          </th>
          <!-- Data column headers -->
          <TableColumnHeader
            v-for="header in headerGroup.headers"
            :key="header.id"
            :header="header"
            :table="table"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="row.id"
          class="group transition-colors"
          :style="{ backgroundColor: isRowSelected(row) ? 'var(--st-bg-selected)' : 'transparent' }"
          @mouseenter="$event.currentTarget.style.backgroundColor = isRowSelected(row) ? 'var(--st-bg-selected)' : 'var(--st-bg-row-hover)'"
          @mouseleave="$event.currentTarget.style.backgroundColor = isRowSelected(row) ? 'var(--st-bg-selected)' : 'transparent'"
        >
          <!-- Row number -->
          <td
            class="py-1.5 sticky left-0 z-10"
            :style="{
              width: '44px', minWidth: '44px',
              backgroundColor: isRowSelected(row) ? 'var(--st-bg-selected-cell)' : 'var(--st-bg)',
              borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
            }"
          >
            <div class="flex items-center justify-end pr-1.5 pl-0.5">
              <button
                v-if="editable"
                class="invisible group-hover:visible flex items-center justify-center w-4 h-4 shrink-0"
                :style="{ color: 'var(--st-text-secondary)' }"
                title="Expand row"
                @click.stop="emit('edit-row', row.original)"
              >
                <svg class="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2h8v8M14 2L6 10" />
                </svg>
              </button>
              <span class="text-xs text-right flex-1" :style="{ color: 'var(--st-text-tertiary)' }">
                {{ paginationState.pageIndex * paginationState.pageSize + rowIndex + 1 }}
              </span>
            </div>
          </td>
          <!-- Checkbox -->
          <td
            class="px-1 py-1.5 text-center sticky z-10"
            :style="{
              width: '40px', minWidth: '40px', left: '44px',
              backgroundColor: isRowSelected(row) ? 'var(--st-bg-selected-cell)' : 'var(--st-bg)',
              borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
              boxShadow: stickyColShadow,
            }"
          >
            <input
              type="checkbox"
              class="cursor-pointer"
              :style="{ accentColor: 'var(--st-accent)' }"
              :checked="isRowSelected(row)"
              @click="(e) => toggleRow(row, e, rowIndex)"
            />
          </td>
          <!-- Data cells -->
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :cell="cell"
            :is-selected="selectedCell === `${row.id}:${cell.column.id}`"
            @select="selectCell(row.id, cell.column.id)"
            @update="(value) => emit('update-cell', row.id, cell.column.id, value)"
            @contextmenu.prevent="handleRowContextMenu($event, row, cell)"
          />
        </tr>
        <tr v-if="rows.length === 0">
          <td
            :colspan="table.getAllColumns().length + 2"
            class="px-4 py-12 text-center"
            :style="{
              color: 'var(--st-text-tertiary)',
              borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
            }"
          >
            No rows found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
