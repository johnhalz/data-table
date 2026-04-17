<script setup>
import { computed } from 'vue'

const props = defineProps({
  table: { type: Object, required: true },
})

const pageIndex = computed(() => props.table.getState().pagination.pageIndex)
const pageSize = computed(() => props.table.getState().pagination.pageSize)
const pageCount = computed(() => props.table.getPageCount())
const totalRecords = computed(() => props.table.getFilteredRowModel().rows.length)

function goToPage(page) {
  const p = Math.max(0, Math.min(page, pageCount.value - 1))
  props.table.setPageIndex(p)
}

function handlePageInput(e) {
  const val = parseInt(e.target.value, 10)
  if (!isNaN(val)) {
    goToPage(val - 1)
  }
}
</script>

<template>
  <div
    class="px-3 py-1.5 flex items-center gap-3 text-[13px] shrink-0"
    :style="{ borderTop: '1px solid var(--st-border)', backgroundColor: 'var(--st-bg)', color: 'var(--st-text-secondary)' }"
  >
    <!-- Prev -->
    <button
      class="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      :disabled="!table.getCanPreviousPage()"
      @click="table.previousPage()"
    >
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z"/>
      </svg>
    </button>

    <!-- Page indicator -->
    <div class="flex items-center gap-1.5">
      <span>Page</span>
      <input
        type="number"
        :value="pageIndex + 1"
        min="1"
        :max="pageCount"
        class="w-12 rounded px-1.5 py-0.5 text-center text-[13px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        :style="{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }"
        @change="handlePageInput"
      />
      <span>of {{ pageCount }}</span>
    </div>

    <!-- Next -->
    <button
      class="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      :disabled="!table.getCanNextPage()"
      @click="table.nextPage()"
    >
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
      </svg>
    </button>

    <div class="w-px h-4 mx-1" :style="{ backgroundColor: 'var(--st-border)' }"></div>

    <!-- Rows per page -->
    <div class="flex items-center gap-1.5">
      <span>Rows per page:</span>
      <select
        :value="pageSize"
        class="rounded px-1.5 py-0.5 text-[13px] outline-none cursor-pointer"
        :style="{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }"
        @change="table.setPageSize(Number($event.target.value))"
      >
        <option :value="100">100</option>
        <option :value="500">500</option>
        <option :value="1000">1000</option>
      </select>
    </div>

    <div class="flex-1"></div>

    <!-- Record count -->
    <span :style="{ color: 'var(--st-text-tertiary)' }">
      {{ totalRecords.toLocaleString() }} record{{ totalRecords !== 1 ? 's' : '' }}
    </span>
  </div>
</template>
