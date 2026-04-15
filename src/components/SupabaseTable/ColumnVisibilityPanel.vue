<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  table: { type: Object, required: true },
  columnVisibility: { type: Object, default: () => ({}) },
  defaultColumnVisibility: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:columnVisibility', 'close'])

const showDataTypes = inject('showDataTypes', true)

const columns = computed(() =>
  props.table.getAllLeafColumns().map(col => ({
    id: col.id,
    type: col.columnDef.meta?.type || 'text',
    isVisible: props.columnVisibility[col.id] !== false,
  }))
)

const visibleCount = computed(() => columns.value.filter(c => c.isVisible).length)

function toggle(colId) {
  const newVisibility = { ...props.columnVisibility }
  newVisibility[colId] = newVisibility[colId] === false ? true : false
  emit('update:columnVisibility', newVisibility)
}

function showAll() {
  const newVisibility = {}
  columns.value.forEach(c => { newVisibility[c.id] = true })
  emit('update:columnVisibility', newVisibility)
}

function resetToDefault() {
  emit('update:columnVisibility', { ...props.defaultColumnVisibility })
}
</script>

<template>
  <div
    class="absolute top-full right-0 mt-1 w-64 rounded shadow-xl z-50 text-[13px]"
    :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
    @click.stop
  >
    <div class="px-3 py-2 flex items-center justify-between" :style="{ borderBottom: '1px solid var(--st-border-secondary)' }">
      <span class="font-medium" :style="{ color: 'var(--st-text-secondary)' }">{{ visibleCount }} of {{ columns.length }} columns</span>
      <div class="flex items-center gap-2">
        <button class="text-xs" :style="{ color: 'var(--st-text-secondary)' }" @click="showAll">Show all</button>
        <span :style="{ color: 'var(--st-text-placeholder)' }">|</span>
        <button class="text-xs" :style="{ color: 'var(--st-text-secondary)' }" @click="resetToDefault">Default</button>
      </div>
    </div>

    <div class="max-h-72 overflow-auto py-1">
      <button
        v-for="col in columns"
        :key="col.id"
        class="w-full text-left px-3 py-1.5 flex items-center gap-2.5 transition-colors hover-menu-item"
        @click="toggle(col.id)"
      >
        <span
          class="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
          :style="col.isVisible
            ? { backgroundColor: 'var(--st-accent)', borderColor: 'var(--st-accent)' }
            : { borderColor: 'var(--st-border-tertiary)', backgroundColor: 'transparent' }"
        >
          <svg v-if="col.isVisible" class="w-3 h-3" :style="{ color: 'var(--st-text-on-accent)' }" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
          </svg>
        </span>
        <span class="truncate" :style="{ color: col.isVisible ? 'var(--st-text)' : 'var(--st-text-tertiary)' }">{{ col.id }}</span>
        <span v-if="showDataTypes" class="text-xs ml-auto shrink-0" :style="{ color: 'var(--st-text-placeholder)' }">{{ col.type }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
