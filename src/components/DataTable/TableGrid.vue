<script setup>
import { ref, computed, inject, useTemplateRef } from 'vue'
import { FlexRender } from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import TableColumnHeader from './TableColumnHeader.vue'
import TableCell from './TableCell.vue'
import DataTable from './DataTable.vue'

const props = defineProps({
  table: { type: Object, required: true },
})

const editable = inject('editable', true)
const showRowBorders = inject('showRowBorders', true)
const showColumnBorders = inject('showColumnBorders', true)
const emptyTitle = inject('emptyTitle', 'No rows found')
const emptyMessage = inject('emptyMessage', 'Get started by inserting a new row.')
const openInsertPanel = inject('openInsertPanel', null)
const defaultInsertLabel = inject('defaultInsertLabel', null)
const insertRow = inject('insertRow', () => {})

const showEmptyInsertMenu = ref(false)

// Expandable row groups
const expanded = inject('expanded', ref({}))
const toggleRowExpanded = inject('toggleRowExpanded', () => {})
const getSubTable = inject('getSubTable', null)
const nestingDepth = inject('nestingDepth', 0)
const parentTheme = inject('parentTheme', 'dark')
const parentAccentColor = inject('parentAccentColor', '#3ecf8e')
const subTableSorting = inject('subTableSorting', ref([]))
const subTableColumnFilters = inject('subTableColumnFilters', ref([]))
const subTableColumnVisibility = inject('subTableColumnVisibility', ref({}))

const emit = defineEmits(['update-cell', 'context-menu', 'edit-row'])

const selectedCell = ref(null)
const editingRowId = ref(null)

const headerGroups = computed(() => props.table.getHeaderGroups())

// Total table width = sticky columns (44 + 40) + sum of all visible column sizes
const totalTableWidth = computed(() => {
  const dataColWidth = props.table.getVisibleLeafColumns().reduce((sum, col) => sum + col.getSize(), 0)
  return 84 + dataColWidth
})

const rows = computed(() => props.table.getRowModel().rows)

const paginationState = computed(() => props.table.getState().pagination)

const isAllSelected = computed(() => props.table.getIsAllRowsSelected())
const isSomeSelected = computed(() => props.table.getIsSomeRowsSelected())

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

const stickyColShadow = computed(() => {
  const border = showColumnBorders ? 'inset -1px 0 0 var(--st-border)' : ''
  const shadow = '2px 0 4px var(--st-shadow-sticky)'
  return border ? `${border}, ${shadow}` : shadow
})

// Expandable row groups
const subTableCache = computed(() => {
  if (!getSubTable) return {}
  const cache = {}
  for (const row of rows.value) {
    const config = getSubTable(row.original)
    if (config) cache[row.id] = config
  }
  return cache
})

function isExpandable(row) {
  return !!subTableCache.value[row.id]
}

function isExpanded(row) {
  return !!expanded.value[row.id]
}

const totalColspan = computed(() => 2 + props.table.getVisibleLeafColumns().length)

// --- Virtualization ---
// Each row model entry is one virtual item. Expanded sub-tables are measured
// dynamically via `measureElement` so their variable height is respected.
const scrollerRef = useTemplateRef('scroller')

const virtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    getScrollElement: () => scrollerRef.value,
    estimateSize: () => 33,
    overscan: 8,
    getItemKey: (index) => rows.value[index]?.id ?? index,
  }))
)

const virtualRows = computed(() => virtualizer.value.getVirtualItems())
const totalHeight = computed(() => virtualizer.value.getTotalSize())
</script>

<template>
  <div :class="nestingDepth === 0 ? 'flex-1 min-h-0 relative' : 'overflow-auto'">
  <div
    ref="scroller"
    :class="nestingDepth === 0 ? 'absolute inset-0 overflow-auto flex flex-col' : 'flex flex-col'"
    @click.self="clearSelection"
  >
    <table class="border-collapse table-fixed shrink-0" :style="{ width: totalTableWidth + 'px' }">
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
            class="px-1 py-1.5 text-center align-middle sticky z-30"
            :style="{
              width: '40px', minWidth: '40px', left: '44px',
              backgroundColor: 'var(--st-bg-header)',
              borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
              boxShadow: stickyColShadow,
            }"
          >
            <input
              type="checkbox"
              class="cursor-pointer align-middle"
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
      <tbody
        :style="{
          display: 'block',
          position: 'relative',
          height: totalHeight + 'px',
          width: totalTableWidth + 'px',
        }"
      >
        <template v-for="vRow in virtualRows" :key="vRow.key">
          <tr
            :ref="el => el && virtualizer.measureElement(el)"
            :data-index="vRow.index"
            class="st-row group"
            :class="{ 'st-row--selected': rows[vRow.index].getIsSelected() }"
            :style="{
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '100%',
              transform: `translateY(${vRow.start}px)`,
              display: 'block',
              zIndex: editingRowId === rows[vRow.index].id ? 5 : 'auto',
            }"
          >
            <!-- Inner cell row: uses table layout so cells align with headers -->
            <div :style="{ display: 'table', tableLayout: 'fixed', width: '100%' }" class="contents-row">
            <!-- Row number -->
            <td
              class="py-1.5 sticky left-0 z-10 st-sticky-cell"
              :style="{
                width: '44px', minWidth: '44px',
                borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
              }"
            >
              <div class="flex items-center justify-end pr-1.5 pl-0.5">
                <!-- Expand toggle for expandable rows -->
                <button
                  v-if="isExpandable(rows[vRow.index])"
                  class="flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-150"
                  :style="{
                    color: isExpanded(rows[vRow.index]) ? 'var(--st-accent)' : 'var(--st-text-secondary)',
                    transform: isExpanded(rows[vRow.index]) ? 'rotate(90deg)' : 'rotate(0deg)',
                  }"
                  title="Toggle sub-table"
                  @click.stop="toggleRowExpanded(rows[vRow.index].id)"
                >
                  <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 3l5 5-5 5V3z" />
                  </svg>
                </button>
                <!-- Edit row button (non-expandable rows only) -->
                <button
                  v-else-if="editable.update"
                  class="invisible group-hover:visible flex items-center justify-center w-4 h-4 shrink-0"
                  :style="{ color: 'var(--st-text-secondary)' }"
                  title="Expand row"
                  @click.stop="emit('edit-row', rows[vRow.index].original)"
                >
                  <svg class="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2h8v8M14 2L6 10" />
                  </svg>
                </button>
                <span class="text-xs text-right flex-1" :style="{ color: 'var(--st-text-tertiary)' }">
                  {{ paginationState.pageIndex * paginationState.pageSize + vRow.index + 1 }}
                </span>
              </div>
            </td>
            <!-- Checkbox -->
            <td
              class="px-1 py-1.5 text-center align-middle sticky z-10 st-sticky-cell"
              :style="{
                width: '40px', minWidth: '40px', left: '44px',
                borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
                boxShadow: stickyColShadow,
              }"
            >
              <input
                type="checkbox"
                class="cursor-pointer align-middle"
                :style="{ accentColor: 'var(--st-accent)' }"
                :checked="rows[vRow.index].getIsSelected()"
                @click="(e) => toggleRow(rows[vRow.index], e, vRow.index)"
              />
            </td>
            <!-- Data cells -->
            <TableCell
              v-for="cell in rows[vRow.index].getVisibleCells()"
              :key="cell.id"
              :cell="cell"
              :is-selected="selectedCell === `${rows[vRow.index].id}:${cell.column.id}`"
              @select="selectCell(rows[vRow.index].id, cell.column.id)"
              @update="(value) => emit('update-cell', rows[vRow.index].id, cell.column.id, value)"
              @editing-change="(editing) => editingRowId = editing ? rows[vRow.index].id : null"
              @contextmenu.prevent="handleRowContextMenu($event, rows[vRow.index], cell)"
            />
            </div>

            <!-- Expansion sub-table sits inside the measured row so its height is part of the virtual item -->
            <div
              v-if="isExpanded(rows[vRow.index])"
              :style="{
                display: 'block',
                width: totalTableWidth + 'px',
                borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
              }"
            >
              <div
                :style="{
                  borderLeft: '3px solid var(--st-accent)',
                  marginLeft: (10 + nestingDepth * 16) + 'px',
                  backgroundColor: 'var(--st-bg)',
                }"
              >
                <DataTable
                  v-bind="subTableCache[rows[vRow.index].id]"
                  :theme="subTableCache[rows[vRow.index].id].theme ?? parentTheme"
                  :accent-color="subTableCache[rows[vRow.index].id].accentColor ?? parentAccentColor"
                  :nesting-depth="nestingDepth + 1"
                  :controlled-sorting="subTableSorting"
                  :controlled-column-filters="subTableColumnFilters"
                  :controlled-column-visibility="subTableColumnVisibility"
                />
              </div>
            </div>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!-- Empty state — absolute overlay so it stays centered regardless of horizontal scroll -->
  <div
    v-if="rows.length === 0"
    class="absolute inset-0 flex items-center justify-center pointer-events-none"
    style="top: 33px"
  >
    <div class="flex flex-col items-center gap-4 text-center px-6 pointer-events-auto">
      <!-- Icon -->
      <div
        class="flex items-center justify-center w-14 h-14 rounded-2xl"
        :style="{ backgroundColor: 'var(--st-accent-bg)', border: '1px solid var(--st-accent-border-light)' }"
      >
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :style="{ color: 'var(--st-accent)' }">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M3 15h18M9 9v9M15 9v9"/>
        </svg>
      </div>
      <!-- Title + message -->
      <div class="flex flex-col gap-1">
        <p class="font-semibold text-[15px]" :style="{ color: 'var(--st-text)' }">{{ emptyTitle }}</p>
        <p class="text-[13px] max-w-xs leading-relaxed" :style="{ color: 'var(--st-text-tertiary)' }">{{ emptyMessage }}</p>
      </div>
      <!-- Insert button — mirrors the toolbar insert button exactly -->
      <div v-if="editable.insert" class="relative mt-1">
        <!-- Split button -->
        <div v-if="defaultInsertLabel" class="flex items-center">
          <button
            class="flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors"
            :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
            @click="insertRow()"
          >
            {{ defaultInsertLabel }}
          </button>
          <button
            class="flex items-center self-stretch px-1.5 rounded-r transition-colors"
            :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)', borderLeft: '1px solid var(--st-accent-hover)' }"
            @click="showEmptyInsertMenu = !showEmptyInsertMenu"
          >
            <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
            </svg>
          </button>
        </div>
        <!-- Single dropdown button -->
        <button
          v-else
          class="flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors"
          :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
          @click="showEmptyInsertMenu = !showEmptyInsertMenu"
        >
          Insert
          <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showEmptyInsertMenu"
          class="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]"
          :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
        >
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="openInsertPanel(); showEmptyInsertMenu = false">
            Insert row
          </button>
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="showEmptyInsertMenu = false">
            Insert column
          </button>
          <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="showEmptyInsertMenu = false">
            Import data from CSV
          </button>
        </div>
        <Teleport to="body">
          <div v-if="showEmptyInsertMenu" class="fixed inset-0 z-40" @click="showEmptyInsertMenu = false" />
        </Teleport>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}

/* Row hover / selection — avoids per-row JS handlers on mouseenter/mouseleave */
.st-row {
  background-color: transparent;
}
.st-row:hover {
  background-color: var(--st-bg-row-hover);
}
.st-row--selected {
  background-color: var(--st-bg-selected);
}
.st-row--selected:hover {
  background-color: var(--st-bg-selected);
}

/* Sticky cells pick up the row's background so they stay opaque when scrolled. */
.st-sticky-cell {
  background-color: var(--st-bg);
}
.st-row--selected .st-sticky-cell {
  background-color: var(--st-bg-selected-cell);
}
</style>
