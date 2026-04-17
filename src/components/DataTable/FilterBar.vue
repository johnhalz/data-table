<script setup>
import { ref, computed, inject, nextTick, watch } from 'vue'
import { FILTER_OPERATORS, DATE_TIME_TYPES } from './types.js'
import FilterDatePicker from './FilterDatePicker.vue'

const props = defineProps({
  table: { type: Object, required: true },
  columnFilters: { type: Array, default: () => [] },
  allColumns: { type: Array, default: () => [] },
  subTableColumns: { type: Array, default: null },
  subTableColumnFilters: { type: Array, default: () => [] },
  tableName: { type: String, default: 'table' },
})

const emit = defineEmits(['update:column-filters', 'update:sub-table-column-filters'])

const showDataTypes = inject('showDataTypes', true)

const hasSubTable = computed(() => !!props.subTableColumns && props.subTableColumns.length > 0)

// --- Merged filter list for display ---
// Each entry gets a `table` field: 'parent' or 'sub'
const mergedFilters = computed(() => {
  const parent = props.columnFilters.map((f, i) => ({ ...f, table: 'parent', sourceIndex: i }))
  const sub = props.subTableColumnFilters.map((f, i) => ({ ...f, table: 'sub', sourceIndex: i }))
  return [...parent, ...sub]
})

// --- Dropdown state machine: 'closed' | 'columns' | 'operators' ---
const dropdownState = ref('closed')
const pendingColumn = ref(null) // { id, table }
const searchQuery = ref('')
const highlightIndex = ref(0)

const searchInputRef = ref(null)
const valueInputRefs = ref({})

// Flat list of all operators for keyboard nav
const flatOperators = computed(() => {
  const items = []
  for (const group of FILTER_OPERATORS) {
    items.push({ type: 'header', label: group.group })
    for (const op of group.operators) {
      items.push({ type: 'operator', ...op })
    }
  }
  return items
})

const selectableOperators = computed(() =>
  flatOperators.value.filter(item => item.type === 'operator')
)

// Filtered columns for column picker — grouped
const filteredParentColumns = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return props.allColumns
  return props.allColumns.filter(c => c.id.toLowerCase().includes(q))
})

const filteredSubColumns = computed(() => {
  if (!hasSubTable.value) return []
  const q = searchQuery.value.toLowerCase()
  if (!q) return props.subTableColumns
  return props.subTableColumns.filter(c => c.id.toLowerCase().includes(q))
})

// Combined filtered list for keyboard nav
const filteredAllItems = computed(() => {
  const items = []
  for (const col of filteredParentColumns.value) {
    items.push({ ...col, table: 'parent' })
  }
  for (const col of filteredSubColumns.value) {
    items.push({ ...col, table: 'sub' })
  }
  return items
})

const placeholder = computed(() => {
  const colNames = props.allColumns.map(c => c.id).slice(0, 3).join(', ')
  return `Filter by ${colNames}...`
})

// --- Column type lookup (for date/time picker) ---
const allColumnsFlat = computed(() => {
  const sub = props.subTableColumns || []
  return [...props.allColumns, ...sub]
})

function getColumnType(colId) {
  return allColumnsFlat.value.find(c => c.id === colId)?.type || 'varchar'
}

function isDateTimeType(colId) {
  return DATE_TIME_TYPES.includes(getColumnType(colId))
}

// --- Helpers to read the TanStack-compatible filter shape ---
function getFilterOperator(filter) {
  return filter.value?.operator || '='
}

function getFilterValue(filter) {
  return filter.value?.value ?? ''
}

// --- Column picker ---
function openColumnPicker() {
  dropdownState.value = 'columns'
  highlightIndex.value = 0
}

function selectColumn(colId, tableType) {
  pendingColumn.value = { id: colId, table: tableType }
  searchQuery.value = ''
  dropdownState.value = 'operators'
  highlightIndex.value = 0
}

// --- Operator picker ---
function selectOperator(opValue) {
  if (!pendingColumn.value) return
  const { id: colId, table: tableType } = pendingColumn.value

  const newFilter = { id: colId, value: { operator: opValue, value: '' } }

  if (tableType === 'sub') {
    const newFilters = [...props.subTableColumnFilters, newFilter]
    emit('update:sub-table-column-filters', newFilters)
  } else {
    const newFilters = [...props.columnFilters, newFilter]
    emit('update:column-filters', newFilters)
  }

  dropdownState.value = 'closed'
  pendingColumn.value = null
  searchQuery.value = ''
  searchInputRef.value?.blur()

  // Focus the value input for the newly created filter
  // The emit triggers a prop update → re-render, so we need to wait for that cycle
  const focusLastInput = () => {
    const idx = mergedFilters.value.length - 1
    const input = valueInputRefs.value[idx]
    if (input) {
      input.focus()
    } else {
      // Re-render hasn't completed yet, try once more
      nextTick(focusLastInput)
    }
  }
  nextTick(() => nextTick(focusLastInput))
}

// --- Remove / update ---
function removeFilter(mergedIndex) {
  const filter = mergedFilters.value[mergedIndex]
  if (filter.table === 'sub') {
    const newFilters = props.subTableColumnFilters.filter((_, i) => i !== filter.sourceIndex)
    emit('update:sub-table-column-filters', newFilters)
  } else {
    const newFilters = props.columnFilters.filter((_, i) => i !== filter.sourceIndex)
    emit('update:column-filters', newFilters)
  }
}

function updateFilterValue(mergedIndex, value) {
  const filter = mergedFilters.value[mergedIndex]
  if (filter.table === 'sub') {
    const newFilters = [...props.subTableColumnFilters]
    const existing = newFilters[filter.sourceIndex]
    const operator = existing.value?.operator || '='
    newFilters[filter.sourceIndex] = { ...existing, value: { operator, value } }
    emit('update:sub-table-column-filters', newFilters)
  } else {
    const newFilters = [...props.columnFilters]
    const existing = newFilters[filter.sourceIndex]
    const operator = existing.value?.operator || '='
    newFilters[filter.sourceIndex] = { ...existing, value: { operator, value } }
    emit('update:column-filters', newFilters)
  }
}

// --- Keyboard navigation ---
function handleSearchKeydown(e) {
  if (dropdownState.value === 'columns') {
    handleColumnKeydown(e)
  } else if (dropdownState.value === 'operators') {
    handleOperatorKeydown(e)
  } else if (e.key !== 'Escape') {
    openColumnPicker()
  }

  if (e.key === 'Escape') {
    closeDropdown()
    searchInputRef.value?.blur()
  }
}

function handleColumnKeydown(e) {
  const items = filteredAllItems.value
  if (items.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightIndex.value = Math.min(highlightIndex.value + 1, items.length - 1)
    scrollHighlightedIntoView('column-picker')
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightIndex.value = Math.max(highlightIndex.value - 1, 0)
    scrollHighlightedIntoView('column-picker')
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    const item = items[highlightIndex.value]
    if (item) {
      selectColumn(item.id, item.table)
    }
  }
}

function handleOperatorKeydown(e) {
  const items = selectableOperators.value
  if (items.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightIndex.value = Math.min(highlightIndex.value + 1, items.length - 1)
    scrollHighlightedIntoView('operator-picker')
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightIndex.value = Math.max(highlightIndex.value - 1, 0)
    scrollHighlightedIntoView('operator-picker')
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    if (items[highlightIndex.value]) {
      selectOperator(items[highlightIndex.value].value)
    }
  }
}

function scrollHighlightedIntoView(containerId) {
  nextTick(() => {
    const container = document.getElementById(containerId)
    const highlighted = container?.querySelector('[data-highlighted="true"]')
    if (highlighted) {
      highlighted.scrollIntoView({ block: 'nearest' })
    }
  })
}

function closeDropdown() {
  dropdownState.value = 'closed'
  pendingColumn.value = null
  searchQuery.value = ''
  highlightIndex.value = 0
}

function handleSearchFocus() {
  if (dropdownState.value === 'closed') {
    openColumnPicker()
  }
}

// Track running index for keyboard highlight across grouped sections
function getGlobalColumnIndex(tableType, localIdx) {
  if (tableType === 'parent') return localIdx
  return filteredParentColumns.value.length + localIdx
}

// Reset highlight when search query changes
watch(searchQuery, () => {
  highlightIndex.value = 0
})
</script>

<template>
  <div class="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
    <!-- Active filter chips -->
    <div
      v-for="(filter, i) in mergedFilters"
      :key="filter.table + '-' + filter.sourceIndex"
      class="flex items-center gap-1 rounded px-2 py-0.5 text-[13px]"
      :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
    >
      <span
        v-if="hasSubTable"
        class="text-[10px] font-medium uppercase px-1 rounded"
        :style="{ color: 'var(--st-text-placeholder)', backgroundColor: 'var(--st-bg-input)' }"
      >{{ filter.table === 'sub' ? 'sub' : tableName }}</span>
      <span :style="{ color: 'var(--st-text-secondary)' }">{{ filter.id }}</span>
      <span class="font-mono text-xs" :style="{ color: 'var(--st-text-placeholder)' }">{{ getFilterOperator(filter) }}</span>
      <input
        :ref="el => { if (el) valueInputRefs[i] = el }"
        :value="getFilterValue(filter)"
        class="bg-transparent outline-none text-[13px]"
        :style="{ color: 'var(--st-text)', width: Math.max(3, (getFilterValue(filter) || '').length + 1) + 'ch' }"
        placeholder="value"
        @input="updateFilterValue(i, $event.target.value)"
      />
      <FilterDatePicker
        v-if="isDateTimeType(filter.id)"
        :value="getFilterValue(filter)"
        :column-type="getColumnType(filter.id)"
        @update="val => updateFilterValue(i, val)"
      />
      <button
        class="ml-0.5 w-5 h-5 flex items-center justify-center rounded transition-colors filter-chip-close shrink-0"
        :style="{ color: 'var(--st-text-placeholder)' }"
        @click="removeFilter(i)"
      >
        <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
        </svg>
      </button>
    </div>

    <!-- Pending filter chip (column selected, awaiting operator) -->
    <div
      v-if="pendingColumn"
      class="flex items-center gap-1 rounded px-2 py-0.5 text-[13px]"
      :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-accent-border)' }"
    >
      <span
        v-if="hasSubTable"
        class="text-[10px] font-medium uppercase px-1 rounded"
        :style="{ color: 'var(--st-text-placeholder)', backgroundColor: 'var(--st-bg-input)' }"
      >{{ pendingColumn.table === 'sub' ? 'sub' : tableName }}</span>
      <span :style="{ color: 'var(--st-text-secondary)' }">{{ pendingColumn.id }}</span>
    </div>

    <!-- Search / add filter input -->
    <div class="relative flex-1 min-w-[200px]">
      <input
        ref="searchInputRef"
        v-model="searchQuery"
        class="w-full bg-transparent outline-none text-[13px] py-1"
        :style="{ color: 'var(--st-text)', caretColor: dropdownState === 'operators' ? 'transparent' : undefined }"
        :placeholder="dropdownState === 'operators' ? 'Pick a filter method...' : mergedFilters.length > 0 ? '+ Add more filters...' : placeholder"
        @focus="handleSearchFocus"
        @keydown="handleSearchKeydown"
      />

      <!-- Column picker dropdown -->
      <div
        v-if="dropdownState === 'columns'"
        id="column-picker"
        class="absolute top-full left-0 mt-1 w-60 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto"
        :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
      >
        <!-- Parent columns section -->
        <div
          v-if="hasSubTable && filteredParentColumns.length > 0"
          class="px-3 py-1 text-xs font-medium uppercase tracking-wide"
          :style="{ color: 'var(--st-text-placeholder)' }"
        >
          {{ tableName }}
        </div>
        <div
          v-for="(col, idx) in filteredParentColumns"
          :key="'p-' + col.id"
          class="flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]"
          :data-highlighted="getGlobalColumnIndex('parent', idx) === highlightIndex"
          :style="getGlobalColumnIndex('parent', idx) === highlightIndex ? { backgroundColor: 'var(--st-bg-menu-hover)' } : {}"
          @click="selectColumn(col.id, 'parent')"
          @mouseenter="highlightIndex = getGlobalColumnIndex('parent', idx)"
        >
          <span :style="{ color: 'var(--st-text)' }">{{ col.id }}</span>
          <span v-if="showDataTypes" class="text-xs" :style="{ color: 'var(--st-text-placeholder)' }">{{ col.type }}</span>
        </div>

        <!-- Sub-table columns section -->
        <template v-if="hasSubTable && filteredSubColumns.length > 0">
          <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
          <div
            class="px-3 py-1 text-xs font-medium uppercase tracking-wide"
            :style="{ color: 'var(--st-text-placeholder)' }"
          >
            Sub-table
          </div>
          <div
            v-for="(col, idx) in filteredSubColumns"
            :key="'s-' + col.id"
            class="flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]"
            :data-highlighted="getGlobalColumnIndex('sub', idx) === highlightIndex"
            :style="getGlobalColumnIndex('sub', idx) === highlightIndex ? { backgroundColor: 'var(--st-bg-menu-hover)' } : {}"
            @click="selectColumn(col.id, 'sub')"
            @mouseenter="highlightIndex = getGlobalColumnIndex('sub', idx)"
          >
            <span :style="{ color: 'var(--st-text)' }">{{ col.id }}</span>
            <span v-if="showDataTypes" class="text-xs" :style="{ color: 'var(--st-text-placeholder)' }">{{ col.type }}</span>
          </div>
        </template>

        <div v-if="filteredParentColumns.length === 0 && filteredSubColumns.length === 0" class="px-3 py-2 text-[13px]" :style="{ color: 'var(--st-text-placeholder)' }">
          No columns found
        </div>
      </div>

      <!-- Operator picker dropdown -->
      <div
        v-if="dropdownState === 'operators'"
        id="operator-picker"
        class="absolute top-full left-0 mt-1 w-52 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto"
        :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
      >
        <template v-for="(item, idx) in flatOperators" :key="idx">
          <div
            v-if="item.type === 'header'"
            class="px-3 py-1 text-xs font-medium uppercase tracking-wide"
            :style="{ color: 'var(--st-text-placeholder)' }"
          >
            {{ item.label }}
          </div>
          <div
            v-else
            class="flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]"
            :data-highlighted="selectableOperators.indexOf(item) === highlightIndex"
            :style="selectableOperators.indexOf(item) === highlightIndex ? { backgroundColor: 'var(--st-bg-menu-hover)' } : {}"
            @click="selectOperator(item.value)"
            @mouseenter="highlightIndex = selectableOperators.indexOf(item)"
          >
            <span :style="{ color: 'var(--st-text)' }">{{ item.label }}</span>
            <span class="font-mono text-xs" :style="{ color: 'var(--st-text-placeholder)' }">{{ item.value }}</span>
          </div>
        </template>
      </div>

      <!-- Backdrop to close dropdowns -->
      <Teleport to="body">
        <div v-if="dropdownState !== 'closed'" class="fixed inset-0 z-40" @click="closeDropdown" />
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
.filter-chip-close:hover {
  color: var(--st-text);
  background-color: var(--st-bg-menu-hover);
}
</style>
