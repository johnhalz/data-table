<script setup>
import { ref, computed } from 'vue'
import SortPanel from './SortPanel.vue'
import FilterBar from './FilterBar.vue'
import ColumnVisibilityPanel from './ColumnVisibilityPanel.vue'

const props = defineProps({
  table: { type: Object, required: true },
  sorting: { type: Array, default: () => [] },
  columnFilters: { type: Array, default: () => [] },
  columnVisibility: { type: Object, default: () => ({}) },
  defaultColumnVisibility: { type: Object, default: () => ({}) },
  editable: { type: Object, default: () => ({ insert: true, update: true, delete: true }) },
  loading: { type: Boolean, default: false },
  defaultInsertLabel: { type: String, default: null },
  toolbarActions: { type: Array, default: () => [] },
  toolbarActionsLabel: { type: String, default: 'Actions' },
  // Sub-table support
  subTableColumns: { type: Array, default: null },
  subTableSorting: { type: Array, default: () => [] },
  subTableColumnFilters: { type: Array, default: () => [] },
  subTableColumnVisibility: { type: Object, default: () => ({}) },
  tableName: { type: String, default: 'table' },
  isEmpty: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:sorting', 'update:column-filters', 'update:column-visibility',
  'update:sub-table-sorting', 'update:sub-table-column-filters', 'update:sub-table-column-visibility',
  'insert-row', 'refresh', 'toolbar-action',
])

const showSortPanel = ref(false)
const showInsertMenu = ref(false)
const showColumnsPanel = ref(false)
const showActionsMenu = ref(false)

function handleToolbarAction(action) {
  if (action.disabled) return
  emit('toolbar-action', action.key)
  showActionsMenu.value = false
}

const sortCount = computed(() => props.sorting.length + props.subTableSorting.length)
const filterCount = computed(() => props.columnFilters.length + props.subTableColumnFilters.length)
const hiddenColumnCount = computed(() => {
  const parentHidden = Object.values(props.columnVisibility).filter(v => v === false).length
  const subHidden = Object.values(props.subTableColumnVisibility).filter(v => v === false).length
  return parentHidden + subHidden
})

const isDefaultVisibility = computed(() => {
  // Check parent: current visibility must match defaultColumnVisibility
  const currentParent = props.columnVisibility
  const defaultParent = props.defaultColumnVisibility
  const allParentCols = props.table.getAllColumns().map(c => c.id)
  for (const colId of allParentCols) {
    const currentVal = currentParent[colId] !== false
    const defaultVal = defaultParent[colId] !== false
    if (currentVal !== defaultVal) return false
  }
  // Check sub-table: default is all visible (empty object)
  for (const val of Object.values(props.subTableColumnVisibility)) {
    if (val === false) return false
  }
  return true
})

const allColumns = computed(() =>
  props.table.getAllColumns().map(col => ({
    id: col.id,
    type: col.columnDef.meta?.type || 'text',
  }))
)

const subTableColumnList = computed(() => {
  if (!props.subTableColumns) return null
  return props.subTableColumns.map(col => ({
    id: col.accessorKey || col.id || col.header,
    type: col.meta?.type || col.columnDef?.meta?.type || 'text',
  }))
})
</script>

<template>
  <div :style="{ borderBottom: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)' }">
    <!-- Filter bar -->
    <div class="flex items-center gap-2 px-3 py-2">
      <FilterBar
        :table="table"
        :column-filters="columnFilters"
        :all-columns="allColumns"
        :sub-table-columns="subTableColumnList"
        :sub-table-column-filters="subTableColumnFilters"
        :table-name="tableName"
        @update:column-filters="val => emit('update:column-filters', val)"
        @update:sub-table-column-filters="val => emit('update:sub-table-column-filters', val)"
        class="flex-1"
        :style="isEmpty ? { opacity: 0.4, pointerEvents: 'none' } : {}"
      />

      <!-- Refresh -->
      <button
        class="p-1.5 rounded transition-colors"
        :style="{ color: 'var(--st-text-secondary)' }"
        :disabled="loading"
        title="Refresh"
        @click="emit('refresh')"
      >
        <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z"/>
          <path d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z"/>
        </svg>
      </button>

      <!-- Sort button -->
      <div class="relative">
        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
          :style="isEmpty
            ? { border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)', opacity: 0.4, cursor: 'default' }
            : sortCount > 0
              ? { border: '1px solid var(--st-accent-border)', color: 'var(--st-accent)', backgroundColor: 'var(--st-accent-bg)' }
              : { border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
          :disabled="isEmpty"
          @click="!isEmpty && (showSortPanel = !showSortPanel)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.5 2.5a.5.5 0 00-1 0v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L3.5 12.293V2.5zm4 .5a.5.5 0 010-1h1a.5.5 0 010 1h-1zm0 3a.5.5 0 010-1h3a.5.5 0 010 1h-3zm0 3a.5.5 0 010-1h5a.5.5 0 010 1h-5zm0 3a.5.5 0 010-1h7a.5.5 0 010 1h-7z"/>
          </svg>
          <template v-if="sortCount > 0">
            Sorted by {{ sortCount }} rule{{ sortCount > 1 ? 's' : '' }}
          </template>
          <template v-else>Sort</template>
        </button>

        <SortPanel
          v-if="showSortPanel"
          :table="table"
          :sorting="sorting"
          :all-columns="allColumns"
          :sub-table-columns="subTableColumnList"
          :sub-table-sorting="subTableSorting"
          :table-name="tableName"
          @update:sorting="val => emit('update:sorting', val)"
          @update:sub-table-sorting="val => emit('update:sub-table-sorting', val)"
          @close="showSortPanel = false"
        />
        <Teleport to="body">
          <div v-if="showSortPanel" class="fixed inset-0 z-40" @click="showSortPanel = false" />
        </Teleport>
      </div>

      <!-- Custom actions dropdown (SDK-provided) -->
      <div v-if="toolbarActions.length > 0" class="relative">
        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
          :style="isEmpty
            ? { border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)', opacity: 0.4, cursor: 'default' }
            : { border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
          :disabled="isEmpty"
          @click="!isEmpty && (showActionsMenu = !showActionsMenu)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
          </svg>
          {{ toolbarActionsLabel }}
          <svg class="w-3 h-3 opacity-60" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </button>

        <div
          v-if="showActionsMenu"
          class="absolute top-full left-0 mt-1 min-w-[12rem] rounded shadow-xl z-50 py-1 text-[13px]"
          :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
        >
          <template v-for="(action, idx) in toolbarActions" :key="action.key ?? `divider-${idx}`">
            <div
              v-if="action.divider"
              class="my-1"
              :style="{ borderTop: '1px solid var(--st-border-secondary)' }"
            />
            <button
              v-else
              class="w-full text-left px-3 py-1.5 hover-menu-item flex items-center gap-2"
              :style="{
                color: 'var(--st-text)',
                opacity: action.disabled ? 0.4 : 1,
                cursor: action.disabled ? 'not-allowed' : 'pointer',
              }"
              :disabled="action.disabled"
              @click="handleToolbarAction(action)"
            >
              <span v-if="action.icon" class="shrink-0 flex items-center" v-html="action.icon" />
              <span class="flex-1">{{ action.label }}</span>
            </button>
          </template>
        </div>
        <Teleport to="body">
          <div v-if="showActionsMenu" class="fixed inset-0 z-40" @click="showActionsMenu = false" />
        </Teleport>
      </div>

      <!-- Columns visibility button -->
      <div class="relative">
        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
          :style="isEmpty
            ? { border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)', opacity: 0.4, cursor: 'default' }
            : !isDefaultVisibility
              ? { border: '1px solid var(--st-accent-border)', color: 'var(--st-accent)', backgroundColor: 'var(--st-accent-bg)' }
              : { border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
          :disabled="isEmpty"
          @click="!isEmpty && (showColumnsPanel = !showColumnsPanel)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.5 2A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13zM1 3.5a.5.5 0 01.5-.5H5v10H1.5a.5.5 0 01-.5-.5v-9zM6 13V3h4v10H6zm5 0V3h3.5a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H11z"/>
          </svg>
          <template v-if="isDefaultVisibility">Columns</template>
          <template v-else>{{ hiddenColumnCount }} hidden</template>
        </button>

        <ColumnVisibilityPanel
          v-if="showColumnsPanel"
          :table="table"
          :column-visibility="columnVisibility"
          :default-column-visibility="defaultColumnVisibility"
          :sub-table-columns="subTableColumnList"
          :sub-table-column-visibility="subTableColumnVisibility"
          :table-name="tableName"
          @update:column-visibility="val => emit('update:column-visibility', val)"
          @update:sub-table-column-visibility="val => emit('update:sub-table-column-visibility', val)"
          @close="showColumnsPanel = false"
        />
        <Teleport to="body">
          <div v-if="showColumnsPanel" class="fixed inset-0 z-40" @click="showColumnsPanel = false" />
        </Teleport>
      </div>

      <!-- Insert button -->
      <div v-if="editable.insert" class="relative">
        <!-- Split button: default action + dropdown arrow -->
        <div v-if="defaultInsertLabel" class="flex items-center">
          <button
            class="flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors"
            :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
            @click="emit('insert-row')"
          >
            {{ defaultInsertLabel }}
          </button>
          <button
            class="flex items-center self-stretch px-1.5 rounded-r transition-colors"
            :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)', borderLeft: '1px solid var(--st-accent-hover)' }"
            @click="showInsertMenu = !showInsertMenu"
          >
            <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
            </svg>
          </button>
        </div>
        <!-- Single dropdown button: no default action -->
        <button
          v-else
          class="flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors"
          :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
          @click="showInsertMenu = !showInsertMenu"
        >
          Insert
          <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </button>

        <!-- Insert dropdown -->
        <div
          v-if="showInsertMenu"
          class="absolute top-full right-0 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]"
          :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
        >
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="emit('insert-row'); showInsertMenu = false">
            Insert row
          </button>
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="showInsertMenu = false">
            Insert column
          </button>
          <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="showInsertMenu = false">
            Import data from CSV
          </button>
        </div>
        <Teleport to="body">
          <div v-if="showInsertMenu" class="fixed inset-0 z-40" @click="showInsertMenu = false" />
        </Teleport>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
