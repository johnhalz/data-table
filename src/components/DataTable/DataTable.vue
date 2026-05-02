<script setup>
import { ref, computed, provide, inject, watch, shallowRef, onMounted, nextTick, unref } from 'vue'
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
import { PENDING_EDIT_KINDS, PENDING_INSERT_ID_PREFIX } from './types.js'

/** Provide/inject: resolved font stacks for nesting (see `fontFamily` prop). */
const DT_FONT_FAMILY_KEY = Symbol('dataTable.fontFamily')

/** Default UI stack when `font-family` prop is omitted (matches shipped CSS fallback). */
const DEFAULT_DT_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

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
  // When true, show a "Select all items" button in the selection toolbar that
  // selects every row across all pages (not just the current page).
  enableSelectAll: { type: Boolean, default: true },
  // Custom dropdown next to the Sort button. Each item: { key, label, icon?, disabled?, divider? }
  toolbarActions: { type: Array, default: () => [] },
  toolbarActionsLabel: { type: String, default: 'Actions' },
  defaultInsertLabel: { type: String, default: null },
  showRowBorders: { type: Boolean, default: true },
  showColumnBorders: { type: Boolean, default: true },
  cellButtonVisibility: {
    type: String,
    default: 'hover',
    validator: (v) => ['hover', 'always', 'select'].includes(v),
  },
  // Global default overflow behaviour for text cells.
  // Per-column meta.overflow overrides this value.
  cellOverflow: {
    type: String,
    default: 'truncate',
    validator: (v) => ['truncate', 'wrap'].includes(v),
  },
  // Custom actions for the insert button dropdown.
  // Each item: { key: string, label: string, icon?: string (SVG HTML) }
  // Emits 'insert-action' with the key when an item is selected.
  insertActions: { type: Array, default: () => [] },
  // Footer count text: "{{ n }} record(s)" — override for domain wording (e.g. ligand/ligands).
  countLabelSingular: { type: String, default: 'record' },
  countLabelPlural: { type: String, default: 'records' },
  theme: { type: String, default: 'dark' }, // 'dark' | 'light'
  accentColor: { type: String, default: '#3ecf8e' },
  /** Optional CSS `font-family` stack (same syntax as CSS). Cascades into nested/sub-tables. Omit to use bundled system UI stack. */
  fontFamily: { type: String, default: null },
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
  // When false, the pagination footer hides random-access controls (page input / jump-to-page).
  // Useful for cursor-based APIs where only sequential prev/next navigation is meaningful.
  hasRandomAccess: { type: Boolean, default: true },
  // v-model:column-filters — let the parent observe/control top-level column filter state
  columnFilters: { type: Array, default: null },
  // Externally controlled state (used by parent to push sub-table state into nested instances)
  controlledSorting: { type: Array, default: null },
  controlledColumnFilters: { type: Array, default: null },
  controlledColumnVisibility: { type: Object, default: null },
  // When true, mutations (insert/update/delete) are queued locally and surfaced
  // in the footer instead of being emitted immediately. The parent applies them
  // as a batch by handling the `commit-edits` event.
  stagedEdits: { type: Boolean, default: false },
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

const emit = defineEmits([
  'insert-row',
  'update-row',
  'delete-rows',
  'insert-column',
  'update-column',
  'delete-column',
  'refresh',
  'selection-action',
  'toolbar-action',
  'insert-action',
  'view-change',
  'update:expanded-rows',
  'sub-table-event',
  'column-resize',
  'page-change',
  'update:column-filters',
  'commit-edits',
  'discard-edits',
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
watch(() => props.rows, (val) => {
  // When staged-edits is off, the data ref is driven directly from props.
  // When it's on, we route through effectiveRows below.
  if (!props.stagedEdits) data.value = val
})

const sorting = ref(props.controlledSorting ?? [])
const columnFilters = ref(props.controlledColumnFilters ?? props.columnFilters ?? [])
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
watch(() => props.columnFilters, (val) => {
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

// --- Staged edits state ---
// Map<rowId, { kind, changes?, snapshot? }> — kind: 'insert' | 'update' | 'delete'
// - insert: `changes` holds the full new row; id is a synthetic PENDING_INSERT_ID_PREFIX + uuid.
// - update: `changes` holds a per-column diff; `snapshot` preserves the original row for undo/tooltips.
// - delete: `snapshot` holds the original row so we can keep rendering it struck-through.
const pendingEdits = ref(new Map())
const committing = ref(false)
let pendingInsertCounter = 0

function nextInsertId() {
  pendingInsertCounter += 1
  return `${PENDING_INSERT_ID_PREFIX}${Date.now()}_${pendingInsertCounter}`
}

function getRowById(rowId) {
  const key = primaryKeyField.value
  return props.rows.find(r => String(r[key] ?? r.id) === String(rowId))
}

const hasPendingEdits = computed(() => pendingEdits.value.size > 0)
const pendingEditCount = computed(() => pendingEdits.value.size)

// Rows rendered by the grid with pending edits merged in.
const effectiveRows = computed(() => {
  if (!props.stagedEdits || pendingEdits.value.size === 0) return props.rows
  const key = primaryKeyField.value
  const inserts = []
  const result = props.rows.map(row => {
    const rowId = String(row[key] ?? row.id)
    const entry = pendingEdits.value.get(rowId)
    if (!entry) return row
    if (entry.kind === PENDING_EDIT_KINDS.UPDATE) {
      return { ...row, ...entry.changes }
    }
    // 'delete' — keep original row; the grid renders it struck-through via pending state
    return row
  })
  for (const [rowId, entry] of pendingEdits.value) {
    if (entry.kind === PENDING_EDIT_KINDS.INSERT) {
      // Carry the synthetic id in a reserved field so TanStack's getRowId can
      // uniquely identify the pending row even when the user's PK value
      // collides with an existing committed row (or is left blank).
      inserts.push({ ...entry.changes, __stagedId: rowId })
    }
  }
  return [...result, ...inserts]
})

function queueInsert(insertData) {
  const id = nextInsertId()
  const next = new Map(pendingEdits.value)
  next.set(id, { kind: PENDING_EDIT_KINDS.INSERT, changes: { ...insertData } })
  pendingEdits.value = next
}

function queueUpdate(rowId, changes) {
  const key = String(rowId)
  const next = new Map(pendingEdits.value)
  const existing = next.get(key)
  if (existing?.kind === PENDING_EDIT_KINDS.INSERT) {
    next.set(key, { kind: PENDING_EDIT_KINDS.INSERT, changes: { ...existing.changes, ...changes } })
  } else if (existing?.kind === PENDING_EDIT_KINDS.DELETE) {
    // Editing a row that's queued for delete cancels the delete and becomes an update.
    const snapshot = existing.snapshot ?? getRowById(key)
    next.set(key, { kind: PENDING_EDIT_KINDS.UPDATE, changes: { ...changes }, snapshot })
  } else if (existing?.kind === PENDING_EDIT_KINDS.UPDATE) {
    const mergedChanges = { ...existing.changes, ...changes }
    // If the merged changes all match the snapshot, drop the entry.
    const snapshot = existing.snapshot
    const stillDiffers = Object.keys(mergedChanges).some(k => mergedChanges[k] !== snapshot?.[k])
    if (stillDiffers) {
      next.set(key, { kind: PENDING_EDIT_KINDS.UPDATE, changes: mergedChanges, snapshot })
    } else {
      next.delete(key)
    }
  } else {
    const snapshot = getRowById(key)
    // No-op if the new value already matches the current row.
    const stillDiffers = Object.keys(changes).some(k => changes[k] !== snapshot?.[k])
    if (stillDiffers) {
      next.set(key, { kind: PENDING_EDIT_KINDS.UPDATE, changes: { ...changes }, snapshot })
    }
  }
  pendingEdits.value = next
}

function queueDelete(ids) {
  const next = new Map(pendingEdits.value)
  for (const rawId of ids) {
    const id = String(rawId)
    const existing = next.get(id)
    if (existing?.kind === PENDING_EDIT_KINDS.INSERT) {
      // Deleting a pending insert just discards the insert.
      next.delete(id)
    } else {
      const snapshot = existing?.snapshot ?? getRowById(id)
      next.set(id, { kind: PENDING_EDIT_KINDS.DELETE, snapshot })
    }
  }
  pendingEdits.value = next
}

function undoRowEdit(rowId) {
  const next = new Map(pendingEdits.value)
  next.delete(String(rowId))
  pendingEdits.value = next
}

function undoCellEdit(rowId, colId) {
  const key = String(rowId)
  const entry = pendingEdits.value.get(key)
  if (!entry || entry.kind !== PENDING_EDIT_KINDS.UPDATE) return
  const { [colId]: _dropped, ...rest } = entry.changes
  const next = new Map(pendingEdits.value)
  if (Object.keys(rest).length === 0) {
    next.delete(key)
  } else {
    next.set(key, { ...entry, changes: rest })
  }
  pendingEdits.value = next
}

function getRowPendingState(rowId) {
  return pendingEdits.value.get(String(rowId))?.kind ?? null
}

function getCellPendingState(rowId, colId) {
  const entry = pendingEdits.value.get(String(rowId))
  if (!entry) return null
  if (entry.kind === PENDING_EDIT_KINDS.UPDATE && colId in entry.changes) return 'modified'
  return null
}

function getCellPreviousValue(rowId, colId) {
  const entry = pendingEdits.value.get(String(rowId))
  if (!entry || entry.kind !== PENDING_EDIT_KINDS.UPDATE) return undefined
  return entry.snapshot?.[colId]
}

function buildCommitPayload() {
  const inserts = []
  const updates = []
  const deletes = []
  for (const [rowId, entry] of pendingEdits.value) {
    if (entry.kind === PENDING_EDIT_KINDS.INSERT) {
      inserts.push({ ...entry.changes })
    } else if (entry.kind === PENDING_EDIT_KINDS.UPDATE) {
      updates.push({ id: rowId, changes: { ...entry.changes } })
    } else if (entry.kind === PENDING_EDIT_KINDS.DELETE) {
      deletes.push(rowId)
    }
  }
  return { inserts, updates, deletes }
}

function commitEdits() {
  if (committing.value || !hasPendingEdits.value) return
  const payload = buildCommitPayload()
  committing.value = true
  // The parent calls `done(ok)` to signal completion: ok=true clears the queue,
  // ok=false leaves it intact so the user can retry or discard.
  const done = (ok) => {
    committing.value = false
    if (ok) pendingEdits.value = new Map()
  }
  emit('commit-edits', payload, done)
}

function discardEdits() {
  pendingEdits.value = new Map()
  emit('discard-edits')
}

// Route effectiveRows into the TanStack data ref when staged mode is active.
watch(
  () => [props.stagedEdits, effectiveRows.value],
  ([staged, rows]) => {
    if (staged) data.value = rows
    else data.value = props.rows
  },
  { immediate: true }
)

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
    emit('update:column-filters', columnFilters.value)
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
  getRowId: (row) => row.__stagedId ? String(row.__stagedId) : String(row[primaryKeyField.value] ?? row.id),
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
    if (props.stagedEdits) queueInsert(data)
    else emit('insert-row', data)
  } else {
    if (props.stagedEdits) {
      const key = primaryKeyField.value
      const rowId = String(data[key] ?? data.id)
      // Diff against the current row so we only queue actual changes.
      const original = getRowById(rowId) ?? {}
      const changes = {}
      for (const k of Object.keys(data)) {
        if (k === key) continue
        if (data[k] !== original[k]) changes[k] = data[k]
      }
      if (Object.keys(changes).length > 0) queueUpdate(rowId, changes)
    } else {
      emit('update-row', { id: data.id, changes: data })
    }
  }
  closeEditPanel()
}

function handleDeleteRows(ids) {
  if (props.stagedEdits) queueDelete(ids)
  else emit('delete-rows', ids)
  table.resetRowSelection()
}

function handleUpdateCell(rowId, colId, value) {
  if (props.stagedEdits) queueUpdate(rowId, { [colId]: value })
  else emit('update-row', { id: rowId, changes: { [colId]: value } })
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

provide('themeVars', computed(() => ({ ...themeVars.value, ...fontCssVars.value })))
provide('table', table)
provide('tableName', props.tableName)
provide('showDataTypes', props.showDataTypes)
provide('editable', editableCaps)
provide('showRowBorders', props.showRowBorders)
provide('showColumnBorders', props.showColumnBorders)
provide('cellButtonVisibility', computed(() => props.cellButtonVisibility))
provide('cellOverflow', computed(() => props.cellOverflow))
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
// Staged edits
provide('stagedEditsEnabled', computed(() => props.stagedEdits))
provide('getRowPendingState', getRowPendingState)
provide('getCellPendingState', getCellPendingState)
provide('getCellPreviousValue', getCellPreviousValue)
provide('undoRowEdit', undoRowEdit)
provide('undoCellEdit', undoCellEdit)

// Reset selection when rows change
watch(() => props.rows, () => {
  table.resetRowSelection()
})

// Auto-size columns to fit their content on initial load. Uses canvas text
// measurement (not DOM) so it works with the virtualized row body and avoids
// layout thrashing. Runs once per DataTable instance after mount.
function autoSizeColumnsFromContent() {
  if (typeof document === 'undefined') return
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return

  let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  if (rootElRef.value) {
    const fromRoot = getComputedStyle(rootElRef.value).fontFamily
    if (fromRoot && fromRoot.trim() !== '') fontFamily = fromRoot
  }

  ctx.font = `13px ${fontFamily}`

  const CELL_PADDING_PX = 16   // px-2 (horizontal padding) on both sides
  const HEADER_CHROME_PX = 28  // chevron button + sort indicator reserve
  const TYPE_BADGE_GAP_PX = 6  // gap between name and type badge
  const CELL_BUTTON_PX = 22    // trailing cell button width
  const MIN_WIDTH = 60
  const MAX_WIDTH = 500
  const SAMPLE_SIZE = 200      // rows measured for perf cap

  const sizing = {}
  const leafColumns = table.getAllLeafColumns()
  const sample = data.value.slice(0, SAMPLE_SIZE)

  for (const col of leafColumns) {
    const meta = col.columnDef.meta || {}

    const headerLabel = typeof col.columnDef.header === 'string'
      ? col.columnDef.header
      : String(col.id)
    let contentWidth = ctx.measureText(headerLabel).width

    if (props.showDataTypes && meta.type) {
      contentWidth += TYPE_BADGE_GAP_PX + ctx.measureText(meta.type).width
    }

    const isFixedUiCell = meta.type === 'boolean' || !!meta.progressBar
    if (!isFixedUiCell) {
      const accessorKey = col.columnDef.accessorKey ?? col.id
      for (const row of sample) {
        const value = row?.[accessorKey]
        if (value == null) continue
        const w = ctx.measureText(String(value)).width
        if (w > contentWidth) contentWidth = w
      }
    }

    if (Array.isArray(meta.cellButtons) && meta.cellButtons.length > 0) {
      contentWidth += meta.cellButtons.length * CELL_BUTTON_PX
    }

    const finalWidth = Math.ceil(contentWidth) + CELL_PADDING_PX + HEADER_CHROME_PX
    sizing[col.id] = Math.min(Math.max(finalWidth, MIN_WIDTH), MAX_WIDTH)
  }

  columnSizing.value = { ...sizing, ...columnSizing.value }
}

onMounted(() => {
  nextTick(autoSizeColumnsFromContent)
})
</script>

<template>
  <div
    ref="rootElRef"
    class="data-table-root flex flex-col text-[13px]"
    :class="nestingDepth === 0 ? 'flex-1 min-h-0 min-w-0' : ''"
    :data-st-theme="theme"
    :style="mergedRootStyles"
  >
    <template v-if="showToolbar">
      <SelectionToolbar
        v-if="hasSelection"
        :selected-count="selectedCount"
        :table="table"
        :editable="editableCaps"
        :selection-actions="selectionActions"
        :enable-select-all="enableSelectAll"
        :count-label-singular="countLabelSingular"
        :count-label-plural="countLabelPlural"
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
        :insert-actions="insertActions"
        :toolbar-actions="toolbarActions"
        :toolbar-actions-label="toolbarActionsLabel"
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
        @insert-action="(key) => emit('insert-action', key)"
        @refresh="emit('refresh')"
        @toolbar-action="(key) => emit('toolbar-action', key)"
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
          @update-cell="handleUpdateCell"
          @context-menu="openContextMenu"
          @edit-row="openEditPanel"
        />

        <TablePagination
          v-if="showPagination"
          :table="table"
          :total-count="totalCount"
          :has-random-access="hasRandomAccess"
          :staged-edits="stagedEdits"
          :pending-edit-count="pendingEditCount"
          :committing="committing || loading"
          :count-label-singular="countLabelSingular"
          :count-label-plural="countLabelPlural"
          @commit="commitEdits"
          @discard="discardEdits"
        />
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
      @undo-row="undoRowEdit(contextMenu.row.id)"
      @undo-cell="(colId) => undoCellEdit(contextMenu.row.id, colId)"
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
