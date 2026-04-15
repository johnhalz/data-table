<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import { onClickOutside } from '@vueuse/core'

const editable = inject('editable', true)
const themeVars = inject('themeVars', {})

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  row: { type: Object, default: null },
  cell: { type: Object, default: null },
})

const emit = defineEmits(['close', 'edit-row', 'delete-row', 'filter-by-value'])

const menuRef = ref(null)

const cellValue = computed(() => {
  if (!props.cell) return null
  return props.cell.getValue()
})

const colId = computed(() => {
  if (!props.cell) return null
  return props.cell.column.id
})

function copyCellValue() {
  if (cellValue.value !== null && cellValue.value !== undefined) {
    navigator.clipboard.writeText(String(cellValue.value))
  }
  emit('close')
}

function copyRow() {
  if (props.row) {
    navigator.clipboard.writeText(JSON.stringify(props.row.original, null, 2))
  }
  emit('close')
}

function filterByValue() {
  if (colId.value && cellValue.value !== null && cellValue.value !== undefined) {
    emit('filter-by-value', colId.value, String(cellValue.value))
  }
  emit('close')
}

function editRow() {
  emit('edit-row')
  emit('close')
}

function deleteRow() {
  emit('delete-row')
  emit('close')
}

onClickOutside(menuRef, () => {
  emit('close')
})

function handleKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Position the menu so it stays within viewport
const menuStyle = computed(() => {
  const style = {
    position: 'fixed',
    left: `${props.x}px`,
    top: `${props.y}px`,
    zIndex: 9999,
  }
  return style
})
</script>

<template>
  <Teleport to="body">
    <div ref="menuRef" :style="{ ...themeVars, ...menuStyle }">
      <div
        class="w-52 rounded shadow-xl py-1 text-[13px]"
        :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
      >
        <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="copyCellValue">
          <svg class="w-3.5 h-3.5" :style="{ color: 'var(--st-text-secondary)' }" viewBox="0 0 16 16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"/></svg>
          Copy cell
        </button>
        <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="copyRow">
          <svg class="w-3.5 h-3.5" :style="{ color: 'var(--st-text-secondary)' }" viewBox="0 0 16 16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"/></svg>
          Copy row
        </button>
        <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
        <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="filterByValue">
          <svg class="w-3.5 h-3.5" :style="{ color: 'var(--st-text-secondary)' }" viewBox="0 0 16 16" fill="currentColor"><path d="M.75 3a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z"/></svg>
          Filter by value
        </button>
        <template v-if="editable">
          <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
          <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="editRow">
            <svg class="w-3.5 h-3.5" :style="{ color: 'var(--st-text-secondary)' }" viewBox="0 0 16 16" fill="currentColor"><path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61z"/></svg>
            Edit row
          </button>
          <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" style="color: #ef4444;" @click="deleteRow">
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z"/></svg>
            Delete row
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
