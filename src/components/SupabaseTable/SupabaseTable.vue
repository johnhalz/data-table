<script setup>
import { ref, computed, provide, watch, triggerRef, shallowRef } from 'vue'
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
  defaultColumnVisibility: { type: Object, default: () => ({}) },
  showDataTypes: { type: Boolean, default: true },
  editable: { type: Boolean, default: true },
  selectionActions: { type: Array, default: () => [] },
  defaultInsertLabel: { type: String, default: null }, // label for split insert button; null = single dropdown
  showRowBorders: { type: Boolean, default: true },
  showColumnBorders: { type: Boolean, default: true },
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
])

const data = ref(props.rows)
watch(() => props.rows, (val) => { data.value = val })

const sorting = ref(props.controlledSorting ?? [])
const columnFilters = ref(props.controlledColumnFilters ?? [])
const rowSelection = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 100 })
const columnSizing = ref({})
const columnVisibility = ref(props.controlledColumnVisibility ?? { ...props.defaultColumnVisibility })

// Sync externally controlled state into internal refs (for nested sub-tables)
watch(() => props.controlledSorting, (val) => {
  if (val !== null) { sorting.value = val; rerenderKey.value++ }
}, { deep: true })
watch(() => props.controlledColumnFilters, (val) => {
  if (val !== null) { columnFilters.value = val; rerenderKey.value++ }
}, { deep: true })
watch(() => props.controlledColumnVisibility, (val) => {
  if (val !== null) { columnVisibility.value = val; rerenderKey.value++ }
}, { deep: true })

// Sub-table state (managed by parent toolbar, applied to all nested sub-tables)
const subTableSorting = ref([])
const subTableColumnFilters = ref([])
const subTableColumnVisibility = ref({})

// Rerender key — incremented on state change to force re-render
const rerenderKey = ref(0)

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
  rerenderKey.value++
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
    get columnVisibility() { return columnVisibility.value },
  },
  onSortingChange: updater => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    rerenderKey.value++
  },
  onColumnFiltersChange: updater => {
    columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater
    rerenderKey.value++
  },
  onRowSelectionChange: updater => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    rerenderKey.value++
  },
  onPaginationChange: updater => {
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
    rerenderKey.value++
  },
  onColumnSizingChange: updater => {
    columnSizing.value = typeof updater === 'function' ? updater(columnSizing.value) : updater
    rerenderKey.value++
  },
  onColumnVisibilityChange: updater => {
    columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater
    rerenderKey.value++
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  enableRowSelection: true,
  enableMultiRowSelection: true,
  enableColumnResizing: true,
  columnResizeMode: 'onChange',
  getRowId: (row) => String(row.id),
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
  rerenderKey.value++
}

provide('themeVars', themeVars)
provide('table', table)
provide('tableName', props.tableName)
provide('showDataTypes', props.showDataTypes)
provide('editable', computed(() => props.editable))
provide('showRowBorders', props.showRowBorders)
provide('showColumnBorders', props.showColumnBorders)
provide('emit', emit)
provide('openEditPanel', openEditPanel)
provide('openInsertPanel', openInsertPanel)
provide('openContextMenu', openContextMenu)
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
    :class="nestingDepth === 0 ? 'flex-1 min-h-0' : ''"
    :style="{ ...themeVars, backgroundColor: 'var(--st-bg)', color: 'var(--st-text)' }"
  >
    <template v-if="showToolbar">
      <SelectionToolbar
        v-if="hasSelection"
        :selected-count="selectedCount"
        :table="table"
        :editable="editable"
        :selection-actions="selectionActions"
        :key="'sel-' + rerenderKey"
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
        :editable="editable"
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

    <TableGrid
      :table="table"
      :rerender-key="rerenderKey"
      @update-cell="(rowId, colId, value) => emit('update-row', { id: rowId, changes: { [colId]: value } })"
      @context-menu="openContextMenu"
      @edit-row="openEditPanel"
    />

    <TablePagination v-if="showPagination" :table="table" :key="'pag-' + rerenderKey" />

    <RowEditPanel
      v-if="editable && editPanel.open"
      :mode="editPanel.mode"
      :row-data="editPanel.rowData"
      :table="table"
      :table-name="tableName"
      @save="handleSavePanel"
      @close="closeEditPanel"
    />

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
