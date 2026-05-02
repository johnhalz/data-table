<script setup>
import { ref, inject } from 'vue'
import { FlexRender } from '@tanstack/vue-table'

const props = defineProps({
  header: { type: Object, required: true },
  table: { type: Object, required: true },
})

const showDataTypes = inject('showDataTypes', true)
const themeVars = inject('themeVars', {})
const showRowBorders = inject('showRowBorders', true)
const showColumnBorders = inject('showColumnBorders', true)

const showDropdown = ref(false)
const dropdownPos = ref({ top: 0, left: 0 })
const thRef = ref(null)
const triggerRef = ref(null)

const meta = props.header.column.columnDef.meta || {}

function toggleDropdown() {
  if (!showDropdown.value) {
    const th = triggerRef.value?.closest('th')
    if (th) {
      const rect = th.getBoundingClientRect()
      dropdownPos.value = { top: rect.bottom + 2, left: rect.left }
    }
  }
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function sortAsc() {
  props.header.column.toggleSorting(false)
  closeDropdown()
}

function sortDesc() {
  props.header.column.toggleSorting(true)
  closeDropdown()
}

function copyName() {
  navigator.clipboard.writeText(props.header.column.id)
  closeDropdown()
}

function handleFreezeToggle() {
  if (meta) {
    meta.isFrozen = !meta.isFrozen
  }
  closeDropdown()
}

// Column resize
function onResizeStart(e) {
  const handler = props.header.getResizeHandler()
  if (handler) handler(e)
}

function autoFitColumn() {
  const colId = props.header.column.id
  const th = thRef.value
  if (!th) return
  const table = th.closest('table')
  if (!table) return

  const headerRow = th.parentElement
  const colIndex = Array.from(headerRow.children).indexOf(th)

  const measurer = document.createElement('span')
  measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:13px;font-family:inherit;'
  document.body.appendChild(measurer)

  let maxWidth = 0

  const headerContent = th.querySelector('.flex > span')
  if (headerContent) {
    measurer.textContent = headerContent.textContent
    maxWidth = Math.max(maxWidth, measurer.offsetWidth)
  }

  const rows = table.querySelectorAll('tbody tr')
  rows.forEach(row => {
    const cellContainer = row.querySelector('.contents-row') || row
    const cell = cellContainer.children[colIndex]
    if (cell) {
      const content = cell.querySelector('.truncate, .whitespace-pre-wrap') || cell
      measurer.textContent = content.textContent
      maxWidth = Math.max(maxWidth, measurer.offsetWidth)
    }
  })

  document.body.removeChild(measurer)

  const newWidth = Math.max(maxWidth + 32, 50)
  props.table.options.onColumnSizingChange(prev => ({ ...prev, [colId]: newWidth }))
}
</script>

<template>
  <th
    ref="thRef"
    class="sticky top-0 z-[21] text-left font-normal select-none group/header"
    :style="{
      width: `${header.getSize()}px`,
      minWidth: `${header.getSize()}px`,
      backgroundColor: 'var(--st-bg-header)',
      borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
      borderRight: showColumnBorders ? '1px solid var(--st-border)' : 'none',
    }"
  >
    <div class="flex items-center gap-1.5 px-2 py-1.5 cursor-default overflow-hidden">
      <!-- Column name -->
      <span class="shrink-0 text-[13px]" :style="{ color: 'var(--st-text)' }">
        <FlexRender
          v-if="!header.isPlaceholder"
          :render="header.column.columnDef.header"
          :props="header.getContext()"
        />
      </span>
      <!-- Data type -->
      <span v-if="showDataTypes" class="text-xs font-normal truncate min-w-0" :style="{ color: 'var(--st-text-tertiary)' }">{{ meta.type }}</span>
      <!-- Sort indicator -->
      <span
        v-if="header.column.getIsSorted()"
        class="text-xs shrink-0"
        :style="{ color: 'var(--st-accent)' }"
      >
        {{ header.column.getIsSorted() === 'asc' ? '↑' : '↓' }}
      </span>
      <!-- Frozen indicator -->
      <span
        v-if="meta.isFrozen"
        class="shrink-0 text-xs"
        :style="{ color: 'var(--st-text-tertiary)' }"
        title="Column is frozen"
      >&#10052;</span>
      <!-- Dropdown trigger -->
      <button
        ref="triggerRef"
        class="ml-auto shrink-0 w-4 h-4 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity"
        :class="{ '!opacity-100': showDropdown }"
        :style="{ color: 'var(--st-text-tertiary)' }"
        @click.stop="toggleDropdown"
      >
        <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
        </svg>
      </button>
    </div>

    <!-- Dropdown menu + backdrop (teleported to body to escape thead stacking context) -->
    <Teleport to="body">
      <div v-if="showDropdown" class="fixed inset-0 z-40" @click="closeDropdown" />
      <div
        v-if="showDropdown"
        class="fixed w-52 rounded shadow-xl z-50 py-1 text-[13px]"
        :style="{ ...themeVars, fontFamily: 'var(--dt-font-family)', top: dropdownPos.top + 'px', left: dropdownPos.left + 'px', backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }"
        @click.stop
      >
        <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="sortAsc">
          <span class="w-4 text-center" :style="{ color: 'var(--st-text-secondary)' }">↑</span>Sort Ascending
        </button>
        <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="sortDesc">
          <span class="w-4 text-center" :style="{ color: 'var(--st-text-secondary)' }">↓</span>Sort Descending
        </button>
        <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
        <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="copyName">
          <span class="w-4 text-center" :style="{ color: 'var(--st-text-secondary)' }">
            <svg class="w-3.5 h-3.5 inline" viewBox="0 0 16 16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"/></svg>
          </span>
          Copy name
        </button>
        <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="handleFreezeToggle">
          <span class="w-4 text-center" :style="{ color: 'var(--st-text-secondary)' }">&#10052;</span>
          {{ meta.isFrozen ? 'Unfreeze column' : 'Freeze column' }}
        </button>
      </div>
    </Teleport>

    <!-- Resize handle -->
    <div
      class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500"
      :class="{ 'bg-blue-500': header.column.getIsResizing() }"
      @mousedown="onResizeStart"
      @touchstart="onResizeStart"
      @dblclick.stop="autoFitColumn"
    />
  </th>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
