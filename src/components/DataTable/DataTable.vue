<script setup>
import { ref, computed, provide, watch, shallowRef } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/vue-table'
import TableToolbar from './TableToolbar.vue'
import SelectionToolbar from './SelectionToolbar.vue'
import TableGrid from './TableGrid.vue'
import TablePagination from './TablePagination.vue'
import RowEditPanel from './RowEditPanel.vue'
import ContextMenu from './ContextMenu.vue'

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  tableName: { type: String, default: 'table' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  defaultColumnVisibility: { type: Object, default: () => ({}) },
  showDataTypes: { type: Boolean, default: true },
  // editable: true | false | { insert, update, delete }
  editable: { type: [Boolean, Object], default: true },
  selectionActions: { type: Array, default: () => [] },
  defaultInsertLabel: { type: String, default: null },
  showRowBorders: { type: Boolean, default: true },
  showColumnBorders: { type: Boolean, default: true },
  cellButtonVisibility: {
    type: String,
    default: 'hover',
    validator: (v) => ['hover', 'always', 'select'].includes(v),
  },
  theme: { type: String, default: 'dark' }, // 'dark' | 'light'
  accentColor: { type: String, default: '#3ecf8e' },
  // Expandable row groups
  getSubTable: { type: Function, default: null }, // (rowData) => SubTableConfig | null
  subTableColumns: { type: Array, default: null }, // shared column defs for all sub-tables
  expandedRows: { type: Object, default: null }, // v-model:expanded-rows for controlled state
  nestingDepth: { type: Number, default: 0 }, // internal — tracks recursion level
  showToolbar: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
  emptyTitle: { type: String, default: 'No rows found' },
  emptyMessage: { type: String, default: 'Get started by inserting a new row.' },
  // Server-side pagination: pass totalCount to enable manual pagination mode
  totalCount: { type: Number, default: null },
  // Externally controlled state (used by parent to push sub-table state into nested instances)
  controlledSorting: { type: Array, default: null },
  controlledColumnFilters: { type: Array, default: null },
  controlledColumnVisibility: { type: Object, default: null },
})

// Theme CSS custom properties
function darkenHex(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function luminance(hex) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) / 255
  const g = ((num >> 8) & 0xff) / 255
  const b = (num & 0xff) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const themeVars = computed(() => {
  const dark = props.theme === 'dark'
  const accent = props.accentColor
  const accentHover = darkenHex(accent, 20)
  const accentOnText = luminance(accent) > 0.4 ? '#000' : '#fff'
  // For active indicator borders/text using accent at partial opacity
  const accentBg10 = `color-mix(in srgb, ${accent} 10%, transparent)`
  const accentBorder40 = `color-mix(in srgb, ${accent} 40%, transparent)`
  const accentBorder30 = `color-mix(in srgb, ${accent} 30%, transparent)`

  return {
    '--st-bg':               dark ? '#1c1c1c' : '#ffffff',
    '--st-bg-header':        dark ? '#2a2a2a' : '#f4f4f5',
    '--st-bg-surface':       dark ? '#2a2a2a' : '#ffffff',
    '--st-bg-input':         dark ? '#2a2a2a' : '#f4f4f5',
    '--st-bg-row-hover':     dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    '--st-bg-menu-hover':    dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    '--st-bg-selected':      dark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)',
    '--st-bg-selected-cell': dark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.12)',
    '--st-bg-overlay':       dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
    '--st-bg-panel-overlay': dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
    '--st-border':           dark ? '#333333' : '#e4e4e7',
    '--st-border-secondary': dark ? '#444444' : '#d4d4d8',
    '--st-border-tertiary':  dark ? '#555555' : '#a1a1aa',
    '--st-text':             dark ? '#e5e5e5' : '#18181b',
    '--st-text-secondary':   dark ? '#a1a1aa' : '#52525b',
    '--st-text-tertiary':    dark ? '#71717a' : '#a1a1aa',
    '--st-text-placeholder': dark ? '#52525b' : '#a1a1aa',
    '--st-text-on-accent':   accentOnText,
    '--st-accent':           accent,
    '--st-accent-hover':     accentHover,
    '--st-accent-bg':        accentBg10,
    '--st-accent-border':    accentBorder40,
    '--st-accent-border-light': accentBorder30,
    '--st-toggle-off':       dark ? '#52525b' : '#d4d4d8',
    '--st-shadow-sticky':    dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
  }
})

const emit = defineEmits([
  'insert-row',
  'update-row',
  'delete-rows',
  'insert-column',
  'update-column',
  'delete-column',
  'refresh',
  'selection-action',
  'view-change',
  'update:expanded-rows',
  'sub-table-event',
  'column-resize',
  'page-change',
])

// Normalize editable prop to { insert, update, delete }
const editableCaps = computed(() => {
  if (props.editable === true) return { insert: true, update: true, delete: true }
  if (props.editable === false) return { insert: false, update: false, delete: false }
  return { insert: true, update: true, delete: true, ...props.editable }
})

// Dismiss error banner
const errorDismissed = ref(false)
watch(() => props.error, () => { errorDismissed.value = false })

const data = shallowRef(props.rows)
watch(() => props.rows, (val) => { data.value = val })

const sorting = ref(props.controlledSorting ?? [])
const columnFilters = ref(props.controlledColumnFilters ?? [])
const rowSelection = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 100 })
const columnSizing = ref({})
const columnSizingInfo = ref({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: [],
})
const columnVisibility = ref(props.controlledColumnVisibility ?? { ...props.defaultColumnVisibility })

// Sync externally controlled state into internal refs (for nested sub-tables)
watch(() => props.controlledSorting, (val) => {
  if (val !== null) sorting.value = val
}, { deep: true })
watch(() => props.controlledColumnFilters, (val) => {
  if (val !== null) columnFilters.value = val
}, { deep: true })
watch(() => props.controlledColumnVisibility, (val) => {
  if (val !== null) columnVisibility.value = val
}, { deep: true })

// Sub-table state (managed by parent toolbar, applied to all nested sub-tables)
const subTableSorting = ref([])
const subTableColumnFilters = ref([])
const subTableColumnVisibility = ref({})

// Expand state for row groups
const internalExpanded = ref({})
const expanded = computed(() => props.expandedRows ?? internalExpanded.value)

function toggleRowExpanded(rowId) {
  if (props.expandedRows !== null) {
    const next = { ...props.expandedRows, [rowId]: !props.expandedRows[rowId] }
    emit('update:expanded-rows', next)
  } else {
    internalExpanded.value = {
      ...internalExpanded.value,
      [rowId]: !internalExpanded.value[rowId],
    }
  }
}

// Custom filter function that supports operator-based filtering
function operatorFilterFn(row, columnId, filterValue) {
  if (!filterValue || typeof filterValue !== 'object') return true
  const { operator, value } = filterValue
  if (!operator || value === '' || value === undefined) return true

  const cellValue = row.getValue(columnId)
  const cellStr = cellValue == null ? '' : String(cellValue)
  const cellNum = Number(cellValue)
  const valNum = Number(value)
  const bothNumeric = !isNaN(cellNum) && !isNaN(valNum) && value !== ''

  switch (operator) {
    case '=': return cellStr === value
    case '<>': return cellStr !== value
    case '>': return bothNumeric ? cellNum > valNum : cellStr > value
    case '<': return bothNumeric ? cellNum < valNum : cellStr < value
    case '>=': return bothNumeric ? cellNum >= valNum : cellStr >= value
    case '<=': return bothNumeric ? cellNum <= valNum : cellStr <= value
    case '~~': return cellStr.includes(value)
    case '~~*': return cellStr.toLowerCase().includes(value.toLowerCase())
    case 'in': {
      const list = value.split(',').map(s => s.trim())
      return list.includes(cellStr)
    }
    case 'is': {
      const v = value.toLowerCase()
      if (v === 'null') return cellValue == null
      if (v === 'not null') return cellValue != null
      if (v === 'true') return cellValue === true
      if (v === 'false') return cellValue === false
      return true
    }
    default: return cellStr.toLowerCase().includes(value.toLowerCase())
  }
}

// Derive primary key field from column definitions (falls back to 'id')
const primaryKeyField = computed(() => {
  for (const col of props.columns) {
    if (col.meta?.isPrimaryKey) return col.accessorKey ?? col.id ?? 'id'
  }
  return 'id'
})

const isServerPagination = computed(() => props.totalCount !== null)

const table = useVueTable({
  data: data,
  get columns() { return props.columns },
  filterFns: { operator: operatorFilterFn },
  defaultColumn: { filterFn: 'operator' },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get rowSelection() { return rowSelection.value },
    get pagination() { return pagination.value },
    get columnSizing() { return columnSizing.value },
    get columnSizingInfo() { return columnSizingInfo.value },
    get columnVisibility() { return columnVisibility.value },
  },
  onSortingChange: updater => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onColumnFiltersChange: updater => {
    columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater
  },
  onRowSelectionChange: updater => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
  },
  onPaginationChange: updater => {
    const next = typeof updater === 'function' ? updater(pagination.value) : updater
    pagination.value = next
    if (isServerPagination.value) {
      emit('page-change', { pageIndex: next.pageIndex, pageSize: next.pageSize })
    }
  },
  onColumnSizingChange: updater => {
    const next = typeof updater === 'function' ? updater(columnSizing.value) : updater
    columnSizing.value = next
  },
  onColumnSizingInfoChange: updater => {
    const prev = columnSizingInfo.value
    const next = typeof updater === 'function' ? updater(prev) : updater
    columnSizingInfo.value = next
    if (prev.isResizingColumn && !next.isResizingColumn) {
      emit('column-resize', columnSizing.value)
    }
  },
  onColumnVisibilityChange: updater => {
    columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  get manualPagination() { return isServerPagination.value },
  get pageCount() {
    if (!isServerPagination.value) return undefined
    return Math.ceil(props.totalCount / pagination.value.pageSize)
  },
  enableRowSelection: true,
  enableMultiRowSelection: true,
  enableColumnResizing: true,
  columnResizeMode: 'onChange',
  getRowId: (row) => String(row[primaryKeyField.value] ?? row.id),
})

const selectedCount = computed(() => Object.keys(rowSelection.value).length)
const hasSelection = computed(() => selectedCount.value > 0)

// Row edit panel state
const editPanel = ref({ open: false, mode: 'insert', rowData: null })

function openInsertPanel() {
  editPanel.value = { open: true, mode: 'insert', rowData: null }
}

function openEditPanel(rowData) {
  editPanel.value = { open: true, mode: 'update', rowData: { ...rowData } }
}

function closeEditPanel() {
  editPanel.value = { open: false, mode: 'insert', rowData: null }
}

function handleSavePanel(data) {
  if (editPanel.value.mode === 'insert') {
    emit('insert-row', data)
  } else {
    emit('update-row', { id: data.id, changes: data })
  }
  closeEditPanel()
}

function handleDeleteRows(ids) {
  emit('delete-rows', ids)
  table.resetRowSelection()
}

// Context menu state
const contextMenu = ref({ show: false, x: 0, y: 0, row: null, cell: null })

function openContextMenu(event, row, cell) {
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    row,
    cell,
  }
}

function closeContextMenu() {
  contextMenu.value = { show: false, x: 0, y: 0, row: null, cell: null }
}

function handleFilterByValue(colId, val) {
  const existing = columnFilters.value.find(f => f.id === colId)
  if (existing) {
    columnFilters.value = columnFilters.value.map(f =>
      f.id === colId ? { ...f, value: { operator: '=', value: val } } : f
    )
  } else {
    columnFilters.value = [...columnFilters.value, { id: colId, value: { operator: '=', value: val } }]
  }
}

provide('themeVars', themeVars)
provide('table', table)
provide('tableName', props.tableName)
provide('showDataTypes', props.showDataTypes)
provide('editable', editableCaps)
provide('showRowBorders', props.showRowBorders)
provide('showColumnBorders', props.showColumnBorders)
provide('cellButtonVisibility', computed(() => props.cellButtonVisibility))
provide('insertRow', () => emit('insert-row'))
provide('openInsertPanel', openInsertPanel)
provide('emptyTitle', computed(() => props.emptyTitle))
provide('emptyMessage', computed(() => props.emptyMessage))
provide('defaultInsertLabel', computed(() => props.defaultInsertLabel))
// Expandable row groups
provide('expanded', expanded)
provide('toggleRowExpanded', toggleRowExpanded)
provide('getSubTable', props.getSubTable)
provide('nestingDepth', props.nestingDepth)
provide('parentTheme', computed(() => props.theme))
provide('parentAccentColor', computed(() => props.accentColor))
provide('subTableSorting', subTableSorting)
provide('subTableColumnFilters', subTableColumnFilters)
provide('subTableColumnVisibility', subTableColumnVisibility)

// Reset selection when rows change
watch(() => props.rows, () => {
  table.resetRowSelection()
})
</script>

<template>
  <div
    class="flex flex-col text-[13px]"
    :class="nestingDepth === 0 ? 'flex-1 min-h-0 min-w-0' : ''"
    :style="{ ...themeVars, backgroundColor: 'var(--st-bg)', color: 'var(--st-text)' }"
  >
    <template v-if="showToolbar">
      <SelectionToolbar
        v-if="hasSelection"
        :selected-count="selectedCount"
        :table="table"
        :editable="editableCaps"
        :selection-actions="selectionActions"
        @delete-rows="handleDeleteRows"
        @selection-action="(action, rows) => emit('selection-action', action, rows)"
      />
      <TableToolbar
        v-else
        :table="table"
        :sorting="sorting"
        :column-filters="columnFilters"
        :column-visibility="columnVisibility"
        :default-column-visibility="defaultColumnVisibility"
        :editable="editableCaps"
        :loading="loading"
        :is-empty="data.length === 0"
        :default-insert-label="defaultInsertLabel"
        :sub-table-columns="subTableColumns"
        :sub-table-sorting="subTableSorting"
        :sub-table-column-filters="subTableColumnFilters"
        :sub-table-column-visibility="subTableColumnVisibility"
        :table-name="tableName"
        @update:sorting="val => sorting = val"
        @update:column-filters="val => columnFilters = val"
        @update:column-visibility="val => columnVisibility = val"
        @update:sub-table-sorting="val => subTableSorting = val"
        @update:sub-table-column-filters="val => subTableColumnFilters = val"
        @update:sub-table-column-visibility="val => subTableColumnVisibility = val"
        @insert-row="openInsertPanel"
        @refresh="emit('refresh')"
      />
    </template>

    <!-- Error banner -->
    <div
      v-if="error && !errorDismissed"
      class="flex items-center gap-2 px-3 py-2 text-[13px] shrink-0"
      :style="{ backgroundColor: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }"
    >
      <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
      </svg>
      <span class="flex-1">{{ error }}</span>
      <button class="opacity-60 hover:opacity-100" @click="errorDismissed = true">
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
        </svg>
      </button>
    </div>

    <div class="flex flex-1 min-h-0 min-w-0">
      <div class="flex flex-col flex-1 min-w-0 min-h-0">
        <TableGrid
          :table="table"
          @update-cell="(rowId, colId, value) => emit('update-row', { id: rowId, changes: { [colId]: value } })"
          @context-menu="openContextMenu"
          @edit-row="openEditPanel"
        />

        <TablePagination v-if="showPagination" :table="table" :total-count="totalCount" />
      </div>

      <Transition name="slide-panel">
        <RowEditPanel
          v-if="(editableCaps.insert || editableCaps.update) && editPanel.open"
          :mode="editPanel.mode"
          :row-data="editPanel.rowData"
          :table="table"
          :table-name="tableName"
          @save="handleSavePanel"
          @close="closeEditPanel"
        />
      </Transition>
    </div>

    <ContextMenu
      v-if="contextMenu.show"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :row="contextMenu.row"
      :cell="contextMenu.cell"
      @close="closeContextMenu"
      @edit-row="openEditPanel(contextMenu.row.original)"
      @delete-row="handleDeleteRows([contextMenu.row.id])"
      @filter-by-value="handleFilterByValue"
    />
  </div>
</template>

<style scoped>
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: width 0.25s ease, opacity 0.25s ease;
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  width: 0 !important;
  opacity: 0;
}
.slide-panel-enter-to,
.slide-panel-leave-from {
  width: 420px;
  opacity: 1;
}
</style>
