<script setup>
import {
  ref,
  computed,
  provide,
  inject,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  unref,
} from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table'
import SelectionToolbar from './SelectionToolbar.vue'
import TableColumnHeader from './TableColumnHeader.vue'
import TableCell from './TableCell.vue'
import RowEditPanel from './RowEditPanel.vue'
import ContextMenu from './ContextMenu.vue'
import DeleteRowsConfirmDialog from './DeleteRowsConfirmDialog.vue'
import {
  DATA_TABLE_ROW_SELECT_COL_PX,
  DATA_TABLE_MIN_COLUMN_WIDTH_PX,
} from './columnSizingFill.js'
import {
  DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES,
  MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD,
} from './types.js'
import { claimContextMenu, releaseContextMenu } from './contextMenuCoordinator.js'

/** Provide/inject: resolved font stacks for nesting (matches DataTable). */
const DT_FONT_FAMILY_KEY = Symbol('dataTable.fontFamily')
const DEFAULT_DT_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const props = defineProps({
  column: { type: Object, required: true },
  rows: { type: Array, required: true },
  tableName: { type: String, default: 'table' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  editable: { type: [Boolean, Object], default: false },
  selectionActions: { type: Array, default: () => [] },
  contextMenuActions: { type: Array, default: () => [] },
  cellButtonVisibility: {
    type: String,
    default: 'hover',
    validator: (v) => ['hover', 'always', 'select'].includes(v),
  },
  showDataTypes: { type: Boolean, default: false },
  showRowBorders: { type: Boolean, default: true },
  showColumnBorders: { type: Boolean, default: true },
  theme: { type: String, default: 'dark' },
  accentColor: { type: String, default: '#3ecf8e' },
  fontFamily: { type: String, default: null },
  emptyTitle: { type: String, default: 'No rows found' },
  emptyMessage: { type: String, default: 'Nothing to show yet.' },
  countLabelSingular: { type: String, default: 'record' },
  countLabelPlural: { type: String, default: 'records' },
  /** Total rows available on the server (footer + selection labels). */
  totalCount: { type: Number, default: null },
  /** Exact filtered count (server); used for “Select all N matching”. */
  totalFilteredCount: { type: Number, default: null },
  /** More pages available — enables infinite scroll sentinel. */
  hasMore: { type: Boolean, default: false },
  columnFilters: { type: Array, default: null },
  highlightedRowId: { type: [String, Number], default: null },
  enableSelectAll: { type: Boolean, default: true },
  enableSelectAllMatching: { type: Boolean, default: false },
  /**
   * When true (default), Select All uses matching semantics (emit `select-all-matching`) if
   * `totalFilteredCount` / `totalCount` exceeds loaded `rows.length` so parents can select unloaded rows.
   */
  inferSelectAllMatching: { type: Boolean, default: true },
  /** Cross-page / not-yet-loaded selection ids (v-model). */
  additionalSelectedRowIds: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'refresh',
  'load-more',
  'update:column-filters',
  'sort-change',
  'selection-change',
  'update:additionalSelectedRowIds',
  'select-all-matching',
  'selection-action',
  'row-action',
  'delete-rows',
  'update-row',
])

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
  const accentBg10 = `color-mix(in srgb, ${accent} 10%, transparent)`
  const accentBorder40 = `color-mix(in srgb, ${accent} 40%, transparent)`
  const accentBorder30 = `color-mix(in srgb, ${accent} 30%, transparent)`

  return {
    '--st-bg': dark ? '#1c1c1c' : '#ffffff',
    '--st-bg-header': dark ? '#2a2a2a' : '#f4f4f5',
    '--st-bg-surface': dark ? '#2a2a2a' : '#ffffff',
    '--st-bg-input': dark ? '#2a2a2a' : '#f4f4f5',
    '--st-bg-row-hover': dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    '--st-bg-menu-hover': dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    '--st-bg-selected': dark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)',
    '--st-bg-selected-cell': dark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.12)',
    '--st-bg-overlay': dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
    '--st-bg-panel-overlay': dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
    '--st-border': dark ? '#333333' : '#e4e4e7',
    '--st-border-secondary': dark ? '#444444' : '#d4d4d8',
    '--st-border-tertiary': dark ? '#555555' : '#a1a1aa',
    '--st-text': dark ? '#e5e5e5' : '#18181b',
    '--st-text-secondary': dark ? '#a1a1aa' : '#52525b',
    '--st-text-tertiary': dark ? '#71717a' : '#a1a1aa',
    '--st-text-placeholder': dark ? '#52525b' : '#a1a1aa',
    '--st-text-on-accent': accentOnText,
    '--st-accent': accent,
    '--st-accent-hover': accentHover,
    '--st-accent-bg': accentBg10,
    '--st-accent-border': accentBorder40,
    '--st-accent-border-light': accentBorder30,
    '--st-toggle-off': dark ? '#52525b' : '#d4d4d8',
    '--st-shadow-sticky': dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
    '--st-danger': dark ? '#f87171' : '#dc2626',
  }
})

const parentFontFamily = inject(DT_FONT_FAMILY_KEY, null)

const resolvedFontFamily = computed(() => {
  if (props.fontFamily != null && String(props.fontFamily).trim() !== '') {
    return String(props.fontFamily).trim()
  }
  const p = parentFontFamily == null ? null : unref(parentFontFamily)
  if (p != null && String(p).trim() !== '') return String(p).trim()
  return null
})

provide(DT_FONT_FAMILY_KEY, resolvedFontFamily)

const fontCssVars = computed(() => ({
  '--dt-font-family': resolvedFontFamily.value || DEFAULT_DT_FONT,
}))

const mergedRootStyles = computed(() => ({
  ...themeVars.value,
  ...fontCssVars.value,
  backgroundColor: 'var(--st-bg)',
  color: 'var(--st-text)',
}))

const rootElRef = ref(null)
const scrollerRef = ref(null)
const sentinelRef = ref(null)

const deleteConfirmOpen = ref(false)
const pendingDeleteRowIds = ref([])
const errorDismissed = ref(false)
watch(() => props.error, () => {
  errorDismissed.value = false
})

const editableCaps = computed(() => {
  if (props.editable === true) return { insert: false, update: true, delete: true }
  if (props.editable === false) return { insert: false, update: false, delete: false }
  return { insert: false, update: false, delete: false, ...props.editable }
})

/** Hide bulk Actions menu when MiniTable is explicitly non-editable (`editable === false`). */
const showMiniBulkActionsMenu = computed(() => props.editable !== false)

const contextMenuAllowRowEdit = computed(() => editableCaps.value.update)
const contextMenuAllowRowDelete = computed(() => editableCaps.value.delete)

const leafColumnId = computed(() =>
  String(props.column.id ?? props.column.accessorKey ?? 'column'),
)

const primaryKeyField = computed(() => {
  const c = props.column
  if (c.meta?.isPrimaryKey) return c.accessorKey ?? c.id ?? 'id'
  return 'id'
})

const sorting = ref([])
const columnFilters = ref(props.columnFilters ?? [])
const rowSelection = ref({})
const columnSizing = ref({})
const columnSizingInfo = ref({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: [],
})
const columnVisibility = ref({})

function isMiniToolbarContainsFilter(f) {
  return (
    String(f.id) === leafColumnId.value &&
    (f.value?.operator === '~~' || f.value?.operator === '~~*')
  )
}

/** Last wins if multiple toolbar-style contains filters exist on the leaf column. */
function extractMiniContainsQuery(filters) {
  let last = ''
  const lid = leafColumnId.value
  for (const f of filters) {
    if (
      String(f.id) === lid &&
      (f.value?.operator === '~~' || f.value?.operator === '~~*')
    ) {
      last = String(f.value?.value ?? '')
    }
  }
  return last
}

function mergeMiniContainsIntoFilters(filters, trimmedContains) {
  const base = filters.filter((f) => !isMiniToolbarContainsFilter(f))
  if (!trimmedContains) return base
  return [...base, { id: leafColumnId.value, value: { operator: '~~*', value: trimmedContains } }]
}

function setColumnFiltersAndEmit(next) {
  columnFilters.value = next
  emit('update:column-filters', next)
}

const miniContainsQuery = ref(extractMiniContainsQuery(columnFilters.value))

watch(
  () => props.columnFilters,
  (val) => {
    if (val !== null) {
      columnFilters.value = val
      miniContainsQuery.value = extractMiniContainsQuery(val)
    }
  },
  { deep: true },
)

watch(leafColumnId, () => {
  miniContainsQuery.value = extractMiniContainsQuery(columnFilters.value)
})

function onMiniContainsInput(e) {
  const raw = e.target.value
  miniContainsQuery.value = raw
  const trimmed = raw.trim()
  const next = mergeMiniContainsIntoFilters(columnFilters.value, trimmed)
  setColumnFiltersAndEmit(next)
}

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
    case '=':
      return cellStr === value
    case '<>':
      return cellStr !== value
    case '>':
      return bothNumeric ? cellNum > valNum : cellStr > value
    case '<':
      return bothNumeric ? cellNum < valNum : cellStr < value
    case '>=':
      return bothNumeric ? cellNum >= valNum : cellStr >= value
    case '<=':
      return bothNumeric ? cellNum <= valNum : cellStr <= value
    case '~~':
      return cellStr.includes(value)
    case '~~*':
      return cellStr.toLowerCase().includes(value.toLowerCase())
    case 'in': {
      const list = value.split(',').map((s) => s.trim())
      return list.includes(cellStr)
    }
    case 'is': {
      const v = String(value).toLowerCase()
      if (v === 'null') return cellValue == null
      if (v === 'not null') return cellValue != null
      if (v === 'true') return cellValue === true
      if (v === 'false') return cellValue === false
      return true
    }
    default:
      return cellStr.toLowerCase().includes(String(value).toLowerCase())
  }
}

const resolvedTotalFilteredCount = computed(() => {
  if (props.totalFilteredCount != null) return props.totalFilteredCount
  return props.totalCount
})

/** Prefer matching Select All when eligible total is larger than loaded slice (infinite scroll). */
const effectiveEnableSelectAllMatching = computed(() => {
  const cap = resolvedTotalFilteredCount.value
  const capN = cap != null && Number.isFinite(Number(cap)) ? Number(cap) : null
  if (props.enableSelectAllMatching && capN != null) return true
  if (props.inferSelectAllMatching && capN != null && capN > props.rows.length) return true
  return false
})

const additionalSelectedSet = computed(
  () => new Set((props.additionalSelectedRowIds || []).map((id) => String(id))),
)

/** While clearing, props may still hold stale additional IDs until v-model applies — treat merge as empty. */
const clearingSelection = ref(false)

function getMergedSelectedRowIds() {
  if (clearingSelection.value) return []
  const set = new Set()
  for (const id of props.additionalSelectedRowIds || []) {
    set.add(String(id))
  }
  for (const k of Object.keys(rowSelection.value)) {
    set.add(String(k))
  }
  return [...set]
}

/** Avoid selection-change feedback loops when parent reassigns the same merged IDs (new array ref). */
let lastEmittedSelectionIds = null

const mergedSelectedCount = computed(() => {
  if (clearingSelection.value) return 0
  const addSet = additionalSelectedSet.value
  let extra = 0
  for (const k of Object.keys(rowSelection.value)) {
    if (!addSet.has(String(k))) extra++
  }
  return addSet.size + extra
})
const hasSelection = computed(() => mergedSelectedCount.value > 0)
const selectedCount = mergedSelectedCount

function isRowDisplayedSelected(row) {
  if (clearingSelection.value) return row.getIsSelected()
  const key = primaryKeyField.value
  const id = String(row.original[key] ?? row.original.id)
  return row.getIsSelected() || additionalSelectedSet.value.has(id)
}

provide('isRowDisplayedSelected', isRowDisplayedSelected)

const highlightedRowIdStr = computed(() =>
  props.highlightedRowId != null && props.highlightedRowId !== ''
    ? String(props.highlightedRowId)
    : null,
)

provide('highlightedRowId', highlightedRowIdStr)

function emitSelectionChange() {
  const newIds = getMergedSelectedRowIds()
  if (lastEmittedSelectionIds !== null && lastEmittedSelectionIds.length === newIds.length) {
    let same = true
    for (let i = 0; i < newIds.length; i++) {
      if (newIds[i] !== lastEmittedSelectionIds[i]) {
        same = false
        break
      }
    }
    if (same) return
  }
  lastEmittedSelectionIds = newIds
  emit('selection-change', newIds)
}

watch([rowSelection, () => props.additionalSelectedRowIds], () => emitSelectionChange(), {
  deep: true,
})

watch(
  () => [props.rows, props.additionalSelectedRowIds],
  () => {
    const add = new Set((props.additionalSelectedRowIds || []).map(String))
    if (add.size === 0) return
    const pk = primaryKeyField.value
    const next = { ...rowSelection.value }
    let changed = false
    for (const row of props.rows) {
      const id = String(row[pk] ?? row.id)
      if (add.has(id) && !next[id]) {
        next[id] = true
        changed = true
      }
    }
    if (changed) rowSelection.value = next
  },
  { deep: true },
)

const originalColumnMetaById = computed(() => {
  const c = props.column
  const id = String(c.id ?? c.accessorKey ?? 'column')
  const map = Object.create(null)
  if (c.meta) map[id] = c.meta
  return map
})

const table = useVueTable({
  get data() {
    return props.rows
  },
  get columns() {
    return [props.column]
  },
  filterFns: { operator: operatorFilterFn },
  defaultColumn: { filterFn: 'operator' },
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get columnSizing() {
      return columnSizing.value
    },
    get columnSizingInfo() {
      return columnSizingInfo.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
  },
  manualSorting: true,
  manualFiltering: true,
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    emit('sort-change', sorting.value)
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value =
      typeof updater === 'function' ? updater(columnFilters.value) : updater
  },
  onRowSelectionChange: (updater) => {
    const prev = rowSelection.value
    const next = typeof updater === 'function' ? updater(prev) : updater
    if ((props.additionalSelectedRowIds?.length ?? 0) > 0) {
      const prevKeys = new Set(Object.keys(prev))
      const nextKeys = new Set(Object.keys(next))
      const removed = [...prevKeys].filter((k) => !nextKeys.has(k))
      if (removed.length > 0) {
        const addList = props.additionalSelectedRowIds || []
        const addSet = new Set(addList.map(String))
        const toStrip = removed.filter((id) => addSet.has(String(id)))
        if (toStrip.length > 0) {
          const strip = new Set(toStrip.map(String))
          emit(
            'update:additionalSelectedRowIds',
            addList.filter((id) => !strip.has(String(id))),
          )
        }
      }
    }
    rowSelection.value = next
  },
  onColumnSizingChange: (updater) => {
    columnSizing.value =
      typeof updater === 'function' ? updater(columnSizing.value) : updater
  },
  onColumnSizingInfoChange: (updater) => {
    columnSizingInfo.value =
      typeof updater === 'function' ? updater(columnSizingInfo.value) : updater
  },
  onColumnVisibilityChange: (updater) => {
    columnVisibility.value =
      typeof updater === 'function' ? updater(columnVisibility.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  enableRowSelection: true,
  enableMultiRowSelection: true,
  enableColumnResizing: false,
  columnResizeMode: 'onChange',
  getRowId: (row) => String(row[primaryKeyField.value] ?? row.id),
})

const headerGroups = computed(() => {
  void props.rows.length
  return table.getHeaderGroups()
})

const rowModels = computed(() => {
  void props.rows.length
  void sorting.value
  void columnFilters.value
  void rowSelection.value
  return table.getRowModel().rows
})

const totalRecordsFooter = computed(() => {
  if (props.totalCount != null && Number.isFinite(Number(props.totalCount))) {
    return Number(props.totalCount)
  }
  return props.rows.length
})

const totalTableWidth = computed(() => {
  const dataColWidth = table
    .getVisibleLeafColumns()
    .reduce((sum, col) => sum + col.getSize(), 0)
  return DATA_TABLE_ROW_SELECT_COL_PX + dataColWidth
})

const leafColumnSize = computed(() => table.getVisibleLeafColumns()[0]?.getSize() ?? 120)

/** Soft shadow only — no inset border between select column and first data column. */
const stickyColShadow = computed(() => '2px 0 4px var(--st-shadow-sticky)')

const isAllPageSelected = computed(() => {
  if (!rowModels.value.length) return false
  return rowModels.value.every((r) => isRowDisplayedSelected(r))
})

const isSomePageSelected = computed(() => {
  if (!rowModels.value.length) return false
  const any = rowModels.value.some((r) => isRowDisplayedSelected(r))
  const all = rowModels.value.every((r) => isRowDisplayedSelected(r))
  return any && !all
})

function toggleAllPageRows() {
  table.toggleAllPageRowsSelected(!isAllPageSelected.value)
}

/** `'header'` or row id string — shows inline spinner on that checkbox while a large selection runs. */
const bulkSelectionBusyTarget = ref(null)

function yieldForSpinnerPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

async function handleHeaderCheckboxClick() {
  const n = rowModels.value.length
  const showSpinner = n > MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD
  if (showSpinner) {
    bulkSelectionBusyTarget.value = 'header'
    await nextTick()
    await yieldForSpinnerPaint()
  }
  try {
    toggleAllPageRows()
  } finally {
    if (showSpinner) bulkSelectionBusyTarget.value = null
  }
}

const lastClickedRowIndex = ref(null)

function toggleRow(row, event, rowIndex) {
  if (event?.shiftKey && lastClickedRowIndex.value !== null) {
    const start = Math.min(lastClickedRowIndex.value, rowIndex)
    const end = Math.max(lastClickedRowIndex.value, rowIndex)
    const allRows = rowModels.value
    for (let i = start; i <= end; i++) {
      allRows[i].toggleSelected(true)
    }
  } else {
    row.toggleSelected(!isRowDisplayedSelected(row))
  }
  lastClickedRowIndex.value = rowIndex
}

async function handleRowCheckboxClick(row, event, rowIndex) {
  let spinId = null
  if (event.shiftKey && lastClickedRowIndex.value !== null) {
    const start = Math.min(lastClickedRowIndex.value, rowIndex)
    const end = Math.max(lastClickedRowIndex.value, rowIndex)
    const count = end - start + 1
    if (count > MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD) {
      spinId = String(row.id)
    }
  }
  if (spinId != null) {
    bulkSelectionBusyTarget.value = spinId
    await nextTick()
    await yieldForSpinnerPaint()
  }
  try {
    toggleRow(row, event, rowIndex)
  } finally {
    if (spinId != null) bulkSelectionBusyTarget.value = null
  }
}

const selectedCell = ref(null)
const editingRowId = ref(null)

function selectCell(rowId, colId) {
  selectedCell.value = `${rowId}:${colId}`
}

function clearCellSelection() {
  selectedCell.value = null
}

function editingChange(editing, rowId) {
  editingRowId.value = editing ? rowId : null
}

function clearFullSelection() {
  lastEmittedSelectionIds = null
  clearingSelection.value = true
  table.resetRowSelection()
  emit('update:additionalSelectedRowIds', [])
  emitSelectionChange()
  nextTick(() => {
    clearingSelection.value = false
    emitSelectionChange()
  })
}

function beginSelectionToolbarDeleteConfirmation() {
  openDeleteConfirmation(getMergedSelectedRowIds())
}

function handleDeleteRows(ids) {
  emit('delete-rows', ids)
  lastEmittedSelectionIds = null
  clearingSelection.value = true
  table.resetRowSelection()
  emit('update:additionalSelectedRowIds', [])
  emitSelectionChange()
  nextTick(() => {
    clearingSelection.value = false
    emitSelectionChange()
  })
}

function openDeleteConfirmation(ids) {
  const list = (ids ?? []).map(String).filter(Boolean)
  if (list.length === 0) return
  pendingDeleteRowIds.value = list
  deleteConfirmOpen.value = true
}

function confirmDeleteDialog() {
  const ids = [...pendingDeleteRowIds.value]
  deleteConfirmOpen.value = false
  pendingDeleteRowIds.value = []
  handleDeleteRows(ids)
}

watch(deleteConfirmOpen, (open) => {
  if (!open) pendingDeleteRowIds.value = []
})

const editPanel = ref({ open: false, mode: 'insert', rowData: null })

function openInsertPanel() {}

function openEditPanel(rowData) {
  editPanel.value = { open: true, mode: 'update', rowData: { ...rowData } }
}

function closeEditPanel() {
  editPanel.value = { open: false, mode: 'insert', rowData: null }
}

function handleSavePanel(data) {
  const key = primaryKeyField.value
  const rowId = String(data[key] ?? data.id)
  emit('update-row', { id: rowId, changes: data })
  closeEditPanel()
}

function handleUpdateCell(rowId, colId, value) {
  emit('update-row', { id: rowId, changes: { [colId]: value } })
}

const contextMenu = ref({ show: false, x: 0, y: 0, row: null, cell: null })

function openContextMenu(event, row, cell) {
  claimContextMenu(closeContextMenu)
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
  releaseContextMenu(closeContextMenu)
}

function handleFilterByValue(colId, val) {
  const id = String(colId)
  const withoutEq = columnFilters.value.filter(
    (f) => !(String(f.id) === id && f.value?.operator === '='),
  )
  const next = [...withoutEq, { id, value: { operator: '=', value: val } }]
  setColumnFiltersAndEmit(next)
}

provide('themeVars', computed(() => ({ ...themeVars.value, ...fontCssVars.value })))
provide('originalColumnMetaById', originalColumnMetaById)
provide('table', table)
provide('tableSourceRows', computed(() => props.rows))
provide('tableName', props.tableName)
provide('showDataTypes', props.showDataTypes)
provide('editable', editableCaps)
provide('showRowBorders', props.showRowBorders)
provide('showColumnBorders', props.showColumnBorders)
provide('cellButtonVisibility', computed(() => props.cellButtonVisibility))
provide('cellOverflow', computed(() => 'truncate'))
provide('insertRow', () => {})
provide('openInsertPanel', openInsertPanel)
provide('emptyTitle', computed(() => props.emptyTitle))
provide('emptyMessage', computed(() => props.emptyMessage))
provide('defaultInsertLabel', computed(() => null))
provide('insertActions', computed(() => []))
provide('loading', computed(() => props.loading))
provide('expanded', ref({}))
provide('toggleRowExpanded', () => {})
provide('getSubTable', null)
provide('nestingDepth', 0)
provide('parentTheme', computed(() => props.theme))
provide('parentAccentColor', computed(() => props.accentColor))
provide('subTableSorting', ref([]))
provide('subTableColumnFilters', ref([]))
provide('subTableColumnVisibility', ref({}))
provide('stagedEditsEnabled', computed(() => false))
provide('getRowPendingState', () => null)
provide('getCellPendingState', () => null)
provide('getCellPreviousValue', () => undefined)
provide('undoRowEdit', () => {})
provide('undoCellEdit', () => {})

let viewportResizeObserver = null
let intersectionObserver = null

function applyMiniColumnWidthFromViewport() {
  const el = scrollerRef.value
  if (!el) return
  const w = el.clientWidth
  if (!(typeof w === 'number' && Number.isFinite(w)) || w <= 0) return
  const dataW = Math.max(
    DATA_TABLE_MIN_COLUMN_WIDTH_PX,
    Math.floor(w - DATA_TABLE_ROW_SELECT_COL_PX),
  )
  columnSizing.value = { [leafColumnId.value]: dataW }
}

function disconnectObservers() {
  viewportResizeObserver?.disconnect()
  viewportResizeObserver = null
  intersectionObserver?.disconnect()
  intersectionObserver = null
}

function setupIntersectionObserver() {
  intersectionObserver?.disconnect()
  intersectionObserver = null
  const root = scrollerRef.value
  const target = sentinelRef.value
  if (!root || !target || typeof IntersectionObserver === 'undefined') return
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const e = entries[0]
      if (e?.isIntersecting && props.hasMore && !props.loading) {
        emit('load-more')
      }
    },
    { root, rootMargin: '120px', threshold: 0 },
  )
  intersectionObserver.observe(target)
}

onMounted(async () => {
  await nextTick()
  applyMiniColumnWidthFromViewport()
  const el = scrollerRef.value
  if (el && typeof ResizeObserver !== 'undefined') {
    viewportResizeObserver = new ResizeObserver(() => {
      applyMiniColumnWidthFromViewport()
    })
    viewportResizeObserver.observe(el)
  }
  setupIntersectionObserver()
})

watch(
  () => [props.hasMore, props.loading, props.rows.length],
  async () => {
    await nextTick()
    setupIntersectionObserver()
  },
)

watch(leafColumnId, () => {
  applyMiniColumnWidthFromViewport()
})

onUnmounted(() => {
  disconnectObservers()
  releaseContextMenu(closeContextMenu)
})

defineExpose({
  openDeleteConfirmation,
})
</script>

<template>
  <div
    ref="rootElRef"
    class="data-table-root mini-table-root flex flex-col flex-1 min-h-0 min-w-0 text-[13px]"
    :data-st-theme="theme"
    :style="mergedRootStyles"
  >
    <div
      class="flex items-center gap-2 px-3 py-1.5 shrink-0 min-h-[41px]"
      :style="{ borderBottom: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg-input)' }"
    >
      <input
        type="search"
        class="flex-1 min-w-0 rounded pl-0 pr-2 py-1 text-[13px] outline-none [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        :value="miniContainsQuery"
        placeholder="Filter…"
        :class="rows.length === 0 && !loading ? 'opacity-40 pointer-events-none' : ''"
        :style="{
          backgroundColor: 'var(--st-bg-input)',
          border: 'none',
          color: 'var(--st-text)',
        }"
        aria-label="Filter visible column"
        @input="onMiniContainsInput"
      />
      <button
        type="button"
        class="p-1.5 rounded transition-colors shrink-0"
        :style="{ color: 'var(--st-text-secondary)' }"
        :disabled="loading"
        title="Refresh"
        @click="emit('refresh')"
      >
        <svg
          class="w-4 h-4"
          :class="loading ? 'animate-spin' : ''"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" />
          <path
            d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="error && !errorDismissed"
      class="flex items-center gap-2 px-3 py-2 text-[13px] shrink-0"
      :style="{
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderBottom: '1px solid rgba(239,68,68,0.3)',
        color: '#ef4444',
      }"
    >
      <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path
          d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
      <span class="flex-1">{{ error }}</span>
      <button type="button" class="opacity-60 hover:opacity-100" @click="errorDismissed = true">
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
          />
        </svg>
      </button>
    </div>

    <div class="flex flex-1 min-h-0 min-w-0">
      <div class="flex flex-col flex-1 min-w-0 min-h-0">
        <div class="flex-1 min-h-0 relative">
          <div
            ref="scrollerRef"
            class="mini-table-scroll absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col items-start"
            style="scrollbar-gutter: stable"
            @click.self="clearCellSelection"
          >
            <div
              class="sticky top-0 z-[26] shrink-0 isolate"
              :style="{ width: totalTableWidth + 'px', backgroundColor: 'var(--st-bg-header)' }"
            >
              <table
                class="border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent mini-table-header-table"
                :style="{ width: totalTableWidth + 'px' }"
              >
                <thead>
                  <tr v-for="headerGroup in headerGroups" :key="headerGroup.id">
                    <th
                      class="px-1 py-1.5 text-center align-middle sticky left-0 z-[39]"
                      :style="{
                        width: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                        minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                        backgroundColor: 'var(--st-bg-header)',
                        borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
                        boxShadow: stickyColShadow,
                      }"
                    >
                    <div
                      class="relative flex items-center justify-center min-h-5"
                      :aria-busy="bulkSelectionBusyTarget === 'header' ? 'true' : undefined"
                    >
                      <svg
                        v-if="bulkSelectionBusyTarget === 'header'"
                        class="w-4 h-4 animate-spin shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        :style="{ color: 'var(--st-accent)' }"
                        aria-hidden="true"
                      >
                        <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" />
                        <path
                          d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z"
                        />
                      </svg>
                      <input
                        v-else
                        type="checkbox"
                        class="cursor-pointer align-middle"
                        :style="{ accentColor: 'var(--st-accent)' }"
                        :checked="isAllPageSelected"
                        :indeterminate="isSomePageSelected"
                        title="Select all rows on this page"
                        @click="handleHeaderCheckboxClick"
                      />
                    </div>
                    </th>
                    <TableColumnHeader
                      v-for="header in headerGroup.headers"
                      :key="header.id"
                      :header="header"
                      :table="table"
                    />
                  </tr>
                </thead>
              </table>
            </div>

            <template v-if="loading && rows.length === 0">
              <div class="shrink-0" :style="{ width: totalTableWidth + 'px' }">
                <table
                  class="border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent"
                  :style="{ width: totalTableWidth + 'px' }"
                >
                  <tbody>
                    <tr v-for="rowIdx in 8" :key="rowIdx">
                      <td
                        class="sticky left-0 z-10 px-1 py-1.5 text-center align-middle"
                        :style="{
                          width: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                          minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                          backgroundColor: 'var(--st-bg)',
                          borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
                          boxShadow: stickyColShadow,
                        }"
                      />
                      <td
                        class="px-2 py-1.5 align-middle"
                        :style="{
                          width: leafColumnSize + 'px',
                          borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
                        }"
                      >
                        <div
                          class="h-3 rounded animate-pulse"
                          :style="{
                            width: `${[60, 75, 85, 55][rowIdx % 4]}%`,
                            backgroundColor: 'var(--st-border-secondary)',
                          }"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>

            <template v-else-if="rows.length > 0">
              <div
                v-for="(row, rowIndex) in rowModels"
                :key="row.id"
                class="st-row shrink-0"
                :class="{
                  'st-row--selected': isRowDisplayedSelected(row),
                  'st-row--active':
                    highlightedRowIdStr != null && row.id === highlightedRowIdStr,
                }"
                :style="{ width: totalTableWidth + 'px' }"
              >
                <div
                  class="group/row"
                  :style="{ display: 'table', tableLayout: 'fixed', width: '100%' }"
                >
                  <div
                    class="px-1 py-1.5 text-center align-middle sticky left-0 z-10 st-sticky-cell"
                    :style="{
                      display: 'table-cell',
                      width: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                      minWidth: DATA_TABLE_ROW_SELECT_COL_PX + 'px',
                      borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
                      boxShadow: stickyColShadow,
                    }"
                  >
                    <div
                      class="relative flex items-center justify-center min-h-5"
                      :aria-busy="bulkSelectionBusyTarget === String(row.id) ? 'true' : undefined"
                    >
                      <svg
                        v-if="bulkSelectionBusyTarget === String(row.id)"
                        class="w-4 h-4 animate-spin shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        :style="{ color: 'var(--st-accent)' }"
                        aria-hidden="true"
                      >
                        <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" />
                        <path
                          d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z"
                        />
                      </svg>
                      <input
                        v-else
                        type="checkbox"
                        class="cursor-pointer align-middle"
                        :style="{ accentColor: 'var(--st-accent)' }"
                        :checked="isRowDisplayedSelected(row)"
                        @click="handleRowCheckboxClick(row, $event, rowIndex)"
                      />
                    </div>
                  </div>
                  <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    :cell="cell"
                    :is-selected="selectedCell === `${row.id}:${cell.column.id}`"
                    @select="selectCell(row.id, cell.column.id)"
                    @update="(value) => handleUpdateCell(row.id, cell.column.id, value)"
                    @editing-change="(editing) => editingChange(editing, row.id)"
                    @contextmenu.prevent.stop="openContextMenu($event, row, cell)"
                  />
                </div>
              </div>
            </template>

            <div
              v-else
              class="flex flex-col items-center justify-center gap-2 py-12 px-4 w-full"
              :style="{ color: 'var(--st-text-secondary)' }"
            >
              <span class="text-[13px] font-medium" :style="{ color: 'var(--st-text)' }">{{
                emptyTitle
              }}</span>
              <span class="text-xs text-center">{{ emptyMessage }}</span>
            </div>

            <div ref="sentinelRef" class="w-full shrink-0" style="min-height: 1px" />
            <div
              v-if="loading && rows.length > 0"
              class="flex items-center justify-center gap-2 py-3 w-full text-[13px] shrink-0"
              :style="{ color: 'var(--st-text-secondary)' }"
            >
              <svg
                class="w-4 h-4 animate-spin shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" />
                <path
                  d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z"
                />
              </svg>
              <span>Loading…</span>
            </div>
          </div>
        </div>

        <SelectionToolbar
          v-if="hasSelection"
          footer-layout
          summary-ratio
          :selected-count="selectedCount"
          :table="table"
          :editable="editableCaps"
          :selection-actions="selectionActions"
          :context-menu-actions="contextMenuActions"
          :enable-select-all="enableSelectAll"
          :total-filtered-count="resolvedTotalFilteredCount"
          :enable-select-all-matching="effectiveEnableSelectAllMatching"
          :count-label-singular="countLabelSingular"
          :count-label-plural="countLabelPlural"
          :show-bulk-actions-menu="showMiniBulkActionsMenu"
          clear-selection-danger
          @delete-confirm-request="beginSelectionToolbarDeleteConfirmation"
          @selection-action="
            (action, rows) => emit('selection-action', action, rows, getMergedSelectedRowIds())
          "
          @select-all-matching="emit('select-all-matching')"
          @clear-full-selection="clearFullSelection"
        />
        <div
          v-else
          class="px-3 py-1.5 flex items-center gap-3 text-[13px] shrink-0"
          :class="DATA_TABLE_FOOTER_ROW_HEIGHT_CLASSES"
          :style="{
            borderTop: '1px solid var(--st-border)',
            backgroundColor: 'var(--st-bg)',
            color: 'var(--st-text-secondary)',
          }"
        >
          <div class="flex-1" />
          <span :style="{ color: 'var(--st-text-tertiary)' }">
            {{ totalRecordsFooter.toLocaleString() }}
            {{ totalRecordsFooter === 1 ? countLabelSingular : countLabelPlural }}
          </span>
        </div>

        <Transition name="slide-panel-mini">
          <RowEditPanel
            v-if="editableCaps.update && editPanel.open"
            :mode="editPanel.mode"
            :row-data="editPanel.rowData"
            :table="table"
            :table-name="tableName"
            @save="handleSavePanel"
            @close="closeEditPanel"
          />
        </Transition>
      </div>
    </div>

    <DeleteRowsConfirmDialog
      v-model="deleteConfirmOpen"
      :row-count="pendingDeleteRowIds.length"
      @confirm="confirmDeleteDialog"
    />

    <ContextMenu
      v-if="contextMenu.show"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :row="contextMenu.row"
      :cell="contextMenu.cell"
      :custom-actions="contextMenuActions"
      :allow-row-edit="contextMenuAllowRowEdit"
      :allow-row-delete="contextMenuAllowRowDelete"
      @close="closeContextMenu"
      @edit-row="openEditPanel(contextMenu.row.original)"
      @delete-row="openDeleteConfirmation([contextMenu.row.id])"
      @filter-by-value="handleFilterByValue"
      @undo-row="() => {}"
      @undo-cell="() => {}"
      @row-action="(key, rowData) => emit('row-action', key, rowData)"
    />
  </div>
</template>

<style scoped>
/* Match TableGridDataRow.vue row hover / selection backgrounds */
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
.st-sticky-cell {
  background-color: var(--st-bg);
}
.st-row--selected .st-sticky-cell {
  background-color: var(--st-bg-selected-cell);
}
.st-row--active {
  background-color: var(--st-bg-selected);
}
.st-row--active:hover {
  background-color: var(--st-bg-selected);
}
.st-row--active .st-sticky-cell {
  background-color: var(--st-bg-selected-cell);
}

.slide-panel-mini-enter-active,
.slide-panel-mini-leave-active {
  transition: width 0.25s ease, opacity 0.25s ease;
}
.slide-panel-mini-enter-from,
.slide-panel-mini-leave-to {
  width: 0 !important;
  opacity: 0;
}
.slide-panel-mini-enter-to,
.slide-panel-mini-leave-from {
  width: 420px;
  opacity: 1;
}

.mini-table-scroll :deep(th .cursor-col-resize),
.mini-table-scroll :deep(.cursor-col-resize) {
  display: none;
}
</style>
