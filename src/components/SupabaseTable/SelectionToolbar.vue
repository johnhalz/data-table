<script setup>
import { ref, inject } from 'vue'

const themeVars = inject('themeVars', {})

const props = defineProps({
  selectedCount: { type: Number, required: true },
  table: { type: Object, required: true },
  editable: { type: Boolean, default: true },
  selectionActions: { type: Array, default: () => [] },
})

const emit = defineEmits(['delete-rows', 'selection-action'])

const showActionsMenu = ref(false)
const showDeleteConfirm = ref(false)

function getSelectedRowIds() {
  return Object.keys(props.table.getState().rowSelection)
}

function getSelectedRows() {
  return props.table.getSelectedRowModel().rows.map(r => r.original)
}

function confirmDelete() {
  emit('delete-rows', getSelectedRowIds())
  showDeleteConfirm.value = false
}

function copyAs(format) {
  const rows = getSelectedRows()
  let text = ''
  if (format === 'json') {
    text = JSON.stringify(rows, null, 2)
  } else if (format === 'csv') {
    const headers = Object.keys(rows[0] || {})
    text = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n')
  } else if (format === 'sql') {
    const headers = Object.keys(rows[0] || {})
    text = rows.map(r => {
      const vals = headers.map(h => {
        const v = r[h]
        return v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : String(v)
      })
      return `INSERT INTO table_name (${headers.join(', ')}) VALUES (${vals.join(', ')});`
    }).join('\n')
  }
  navigator.clipboard.writeText(text)
  showActionsMenu.value = false
}

function handleCustomAction(action) {
  emit('selection-action', action.key, getSelectedRows())
  showActionsMenu.value = false
}

function clearSelection() {
  props.table.toggleAllRowsSelected(false)
}

function selectAll() {
  props.table.toggleAllRowsSelected(true)
}
</script>

<template>
  <div class="px-3 py-2 flex items-center gap-2" :style="{ borderBottom: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)' }">
    <span class="text-[13px]" :style="{ color: 'var(--st-text)' }">{{ selectedCount }} row{{ selectedCount > 1 ? 's' : '' }} selected</span>

    <!-- Delete -->
    <button
      v-if="editable"
      class="flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors"
      style="border: 1px solid rgba(239,68,68,0.4); color: #ef4444; background-color: rgba(239,68,68,0.1);"
      @click="showDeleteConfirm = true"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z"/>
      </svg>
      Delete...
    </button>

    <!-- Actions -->
    <div class="relative">
      <button
        class="flex items-center gap-1 px-2.5 py-1 rounded text-[13px] transition-colors"
        :style="{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
        @click="showActionsMenu = !showActionsMenu"
      >
        Actions
        <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
        </svg>
      </button>
      <div
        v-if="showActionsMenu"
        class="absolute top-full left-0 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]"
        :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
      >
        <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="copyAs('csv')">Copy as CSV</button>
        <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="copyAs('sql')">Copy as SQL</button>
        <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="copyAs('json')">Copy as JSON</button>
        <template v-if="selectionActions.length > 0">
          <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
          <button
            v-for="action in selectionActions"
            :key="action.key"
            class="w-full text-left px-3 py-1.5 hover-menu-item"
            :style="{ color: 'var(--st-text)' }"
            @click="handleCustomAction(action)"
          >
            {{ action.label }}
          </button>
        </template>
      </div>
      <Teleport to="body">
        <div v-if="showActionsMenu" class="fixed inset-0 z-40" @click="showActionsMenu = false" />
      </Teleport>
    </div>

    <!-- Clear selection -->
    <button
      class="text-[13px] transition-colors"
      :style="{ color: 'var(--st-text-secondary)' }"
      @click="clearSelection"
    >
      Clear selection
    </button>

    <div class="flex-1"></div>

    <!-- Select all -->
    <button
      class="text-[13px] transition-colors"
      :style="{ color: 'var(--st-text-secondary)' }"
      @click="selectAll"
    >
      Select all rows in table
    </button>

    <!-- Delete confirmation dialog -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center" :style="themeVars">
        <div class="fixed inset-0" :style="{ backgroundColor: 'var(--st-bg-overlay)' }" @click="showDeleteConfirm = false" />
        <div class="relative rounded-lg shadow-2xl w-96 text-[13px]" :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }">
          <div class="px-5 pt-5 pb-4">
            <h3 class="font-medium text-sm mb-2" :style="{ color: 'var(--st-text)' }">Confirm deletion</h3>
            <p :style="{ color: 'var(--st-text-secondary)' }">
              Are you sure you want to delete {{ selectedCount }} row{{ selectedCount > 1 ? 's' : '' }}? This action cannot be undone.
            </p>
          </div>
          <div class="px-5 py-3 flex items-center justify-end gap-2" :style="{ borderTop: '1px solid var(--st-border-secondary)' }">
            <button
              class="px-3 py-1.5 rounded text-[13px] transition-colors"
              :style="{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </button>
            <button
              class="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              @click="confirmDelete"
            >
              Delete {{ selectedCount }} row{{ selectedCount > 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
