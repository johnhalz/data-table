<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  table: { type: Object, required: true },
  totalCount: { type: Number, default: null },
  hasRandomAccess: { type: Boolean, default: true },
  stagedEdits: { type: Boolean, default: false },
  pendingEditCount: { type: Number, default: 0 },
  committing: { type: Boolean, default: false },
})

const emit = defineEmits(['commit', 'discard'])

const pageIndex = computed(() => props.table.getState().pagination.pageIndex)
const pageSize = computed(() => props.table.getState().pagination.pageSize)
const pageCount = computed(() => props.table.getPageCount())
const totalRecords = computed(() =>
  props.totalCount !== null ? props.totalCount : props.table.getFilteredRowModel().rows.length
)

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

// Discard confirmation
const showDiscardConfirm = ref(false)

function requestDiscard() {
  if (props.pendingEditCount === 0) return
  showDiscardConfirm.value = true
}

function confirmDiscard() {
  emit('discard')
  showDiscardConfirm.value = false
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
        v-if="hasRandomAccess"
        type="number"
        :value="pageIndex + 1"
        min="1"
        :max="pageCount"
        class="w-12 rounded px-1.5 py-0.5 text-center text-[13px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        :style="{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }"
        @change="handlePageInput"
      />
      <span v-else class="tabular-nums" :style="{ color: 'var(--st-text)' }">{{ pageIndex + 1 }}</span>
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

    <!-- Staged edits: count + Clear / Commit -->
    <template v-if="stagedEdits && pendingEditCount > 0">
      <span
        class="tabular-nums px-2 py-0.5 rounded"
        :style="{
          color: 'var(--st-accent)',
          backgroundColor: 'var(--st-accent-bg)',
          border: '1px solid var(--st-accent-border-light)',
        }"
      >
        {{ pendingEditCount }} pending change{{ pendingEditCount !== 1 ? 's' : '' }}
      </span>
      <button
        class="px-2 py-0.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :style="{
          border: '1px solid var(--st-border-secondary)',
          color: 'var(--st-text-secondary)',
          backgroundColor: 'transparent',
        }"
        :disabled="committing"
        @click="requestDiscard"
      >
        Clear edits
      </button>
      <button
        class="flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        :style="{
          backgroundColor: 'var(--st-accent)',
          color: 'var(--st-text-on-accent)',
        }"
        :disabled="committing"
        @click="emit('commit')"
      >
        <svg
          v-if="committing"
          class="w-3 h-3 animate-spin"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M8 1.5a6.5 6.5 0 1 1-6.5 6.5" stroke-linecap="round" />
        </svg>
        {{ committing ? 'Committing…' : 'Commit' }}
      </button>
      <div class="w-px h-4 mx-1" :style="{ backgroundColor: 'var(--st-border)' }"></div>
    </template>

    <!-- Record count -->
    <span :style="{ color: 'var(--st-text-tertiary)' }">
      {{ totalRecords.toLocaleString() }} record{{ totalRecords !== 1 ? 's' : '' }}
    </span>

    <!-- Discard confirmation modal -->
    <Teleport to="body">
      <div
        v-if="showDiscardConfirm"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        :style="{ backgroundColor: 'var(--st-bg-overlay)' }"
        @click.self="showDiscardConfirm = false"
      >
        <div
          class="rounded-lg shadow-xl p-5 w-80"
          :style="{
            backgroundColor: 'var(--st-bg-surface)',
            border: '1px solid var(--st-border-secondary)',
            color: 'var(--st-text)',
          }"
        >
          <h3 class="font-semibold text-[14px] mb-2">Clear all pending edits?</h3>
          <p class="text-[13px] mb-4" :style="{ color: 'var(--st-text-secondary)' }">
            This will discard {{ pendingEditCount }} pending change{{ pendingEditCount !== 1 ? 's' : '' }}. This action cannot be undone.
          </p>
          <div class="flex items-center justify-end gap-2">
            <button
              class="px-3 py-1 rounded text-[13px]"
              :style="{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
              @click="showDiscardConfirm = false"
            >
              Cancel
            </button>
            <button
              class="px-3 py-1 rounded text-[13px] font-medium"
              style="background-color: #ef4444; color: white;"
              @click="confirmDiscard"
            >
              Clear edits
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
