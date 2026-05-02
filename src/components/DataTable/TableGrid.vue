<script setup>
import { ref, computed, inject, useTemplateRef, unref, toValue } from 'vue'
import TableColumnHeader from './TableColumnHeader.vue'
import TableGridVirtualRows from './TableGridVirtualRows.vue'
import TableGridFlowRows from './TableGridFlowRows.vue'

/** Rows at or below this render in document flow (scrollbar track size is stable); above uses TanStack Virtual. */
const ROW_VIRTUALIZATION_THRESHOLD = 500

const props = defineProps({
  table: { type: Object, required: true },
})

const editableInject = inject('editable', true)
const editable = computed(() => {
  const e = unref(editableInject)
  if (e === true) return { insert: true, update: true, delete: true }
  if (e === false) return { insert: false, update: false, delete: false }
  return { insert: true, update: true, delete: true, ...e }
})
const showRowBorders = inject('showRowBorders', true)
const showColumnBorders = inject('showColumnBorders', true)
const emptyTitle = inject('emptyTitle', 'No rows found')
const emptyMessage = inject('emptyMessage', 'Get started by inserting a new row.')
const openInsertPanel = inject('openInsertPanel', null)
const defaultInsertLabel = inject('defaultInsertLabel', null)
const insertRow = inject('insertRow', () => {})

const showEmptyInsertMenu = ref(false)
const nestingDepth = inject('nestingDepth', 0)

const emit = defineEmits(['update-cell', 'context-menu', 'edit-row'])

const selectedCell = ref(null)
const editingRowId = ref(null)

const headerGroups = computed(() => props.table.getHeaderGroups())

// Total table width = sticky columns (44 + 40) + sum of all visible column sizes
const totalTableWidth = computed(() => {
  const dataColWidth = props.table.getVisibleLeafColumns().reduce((sum, col) => sum + col.getSize(), 0)
  return 84 + dataColWidth
})

const rows = computed(() => props.table.getRowModel().rows)

const paginationState = computed(() => props.table.getState().pagination)

// The header checkbox acts on the current page only; the "Select all items"
// button in SelectionToolbar is what selects across pages.
const isAllPageSelected = computed(() => props.table.getIsAllPageRowsSelected())
const isSomePageSelected = computed(() => props.table.getIsSomePageRowsSelected())

function selectCell(rowId, colId) {
  selectedCell.value = `${rowId}:${colId}`
}

function clearSelection() {
  selectedCell.value = null
}

function handleRowContextMenu(event, row, cell) {
  emit('context-menu', event, row, cell)
}

function toggleAllPageRows() {
  props.table.toggleAllPageRowsSelected(!isAllPageSelected.value)
}

const lastClickedRowIndex = ref(null)

function toggleRow(row, event, rowIndex) {
  if (event?.shiftKey && lastClickedRowIndex.value !== null) {
    const start = Math.min(lastClickedRowIndex.value, rowIndex)
    const end = Math.max(lastClickedRowIndex.value, rowIndex)
    const allRows = rows.value
    for (let i = start; i <= end; i++) {
      allRows[i].toggleSelected(true)
    }
  } else {
    row.toggleSelected(!row.getIsSelected())
  }
  lastClickedRowIndex.value = rowIndex
}

const stickyColShadow = computed(() => {
  const border = showColumnBorders ? 'inset -1px 0 0 var(--st-border)' : ''
  const shadow = '2px 0 4px var(--st-shadow-sticky)'
  return border ? `${border}, ${shadow}` : shadow
})

const scrollVirtualRows = computed(() => rows.value.length > ROW_VIRTUALIZATION_THRESHOLD)
const scrollerRef = useTemplateRef('scroller')

function editingChange(editing, rowId) {
  editingRowId.value = editing ? rowId : null
}

/** Scroll shell for horizontal clipping: root uses `scroller`; nested uses its parent `overflow-auto` wrapper */
function getViewportScrollShell() {
  const inner = scrollerRef.value
  if (!inner) return null
  const depth = toValue(nestingDepth)
  return depth && depth > 0 ? inner.parentElement : inner
}

function getScrollViewportInnerWidth() {
  return getViewportScrollShell()?.clientWidth ?? 0
}

defineExpose({
  getScrollViewportInnerWidth,
  getViewportResizeObserveTarget: getViewportScrollShell,
})
</script>

<template>
  <div :class="nestingDepth === 0 ? 'flex-1 min-h-0 relative' : 'overflow-auto'">
  <div
    ref="scroller"
    :class="
      nestingDepth === 0
        ? 'absolute inset-0 overflow-auto flex flex-col items-start min-h-0'
        : 'flex flex-col items-start'
    "
    style="scrollbar-gutter: stable"
    @click.self="clearSelection"
  >
    <!-- Sticky shell: vertical stick is on this block, not only on <th>, so it still works
         when the scroll body is a flex sibling (default align-items: stretch otherwise
         breaks position:sticky on header cells). -->
    <div
      class="sticky top-0 z-[26] shrink-0 isolate"
      :style="{ width: totalTableWidth + 'px', backgroundColor: 'var(--st-bg-header)' }"
    >
      <table
        class="border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent"
        :style="{ width: totalTableWidth + 'px' }"
      >
        <thead>
          <tr
            v-for="headerGroup in headerGroups"
            :key="headerGroup.id"
          >
            <!-- Row number header -->
            <th
              class="px-1.5 py-1.5 text-right font-normal sticky left-0 z-[40]"
              :style="{
                width: '44px', minWidth: '44px',
                backgroundColor: 'var(--st-bg-header)',
                borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
                color: 'var(--st-text-tertiary)',
              }"
            >
              <span class="text-xs">#</span>
            </th>
            <!-- Checkbox header -->
            <th
              class="px-1 py-1.5 text-center align-middle sticky z-[39]"
              :style="{
                width: '40px', minWidth: '40px', left: '44px',
                backgroundColor: 'var(--st-bg-header)',
                borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
                boxShadow: stickyColShadow,
              }"
            >
              <input
                type="checkbox"
                class="cursor-pointer align-middle"
                :style="{ accentColor: 'var(--st-accent)' }"
                :checked="isAllPageSelected"
                :indeterminate="isSomePageSelected"
                title="Select all rows on this page"
                @change="toggleAllPageRows"
              />
            </th>
          <!-- Data column headers -->
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
    <!-- ≤ threshold: native flow (stable scrollbar); > threshold: TanStack Virtual -->
    <TableGridVirtualRows
      v-if="rows.length > 0 && scrollVirtualRows"
      :rows="rows"
      :scroll-element-ref="scrollerRef"
      :total-table-width="totalTableWidth"
      :selected-cell="selectedCell"
      :editing-row-id="editingRowId"
      :pagination-state="paginationState"
      @toggle-row-select="toggleRow"
      @edit-row="(o) => emit('edit-row', o)"
      @context-menu="handleRowContextMenu"
      @select-cell="selectCell"
      @update-cell="(rid, cid, val) => emit('update-cell', rid, cid, val)"
      @editing-change="editingChange"
    />
    <TableGridFlowRows
      v-else-if="rows.length > 0"
      :rows="rows"
      :total-table-width="totalTableWidth"
      :selected-cell="selectedCell"
      :editing-row-id="editingRowId"
      :pagination-state="paginationState"
      @toggle-row-select="toggleRow"
      @edit-row="(o) => emit('edit-row', o)"
      @context-menu="handleRowContextMenu"
      @select-cell="selectCell"
      @update-cell="(rid, cid, val) => emit('update-cell', rid, cid, val)"
      @editing-change="editingChange"
    />
  </div>

  <!-- Empty state — absolute overlay so it stays centered regardless of horizontal scroll -->
  <div
    v-if="rows.length === 0"
    class="absolute inset-0 flex items-center justify-center pointer-events-none"
    style="top: 33px"
  >
    <div class="flex flex-col items-center gap-4 text-center px-6 pointer-events-auto">
      <!-- Icon -->
      <div
        class="flex items-center justify-center w-14 h-14 rounded-2xl"
        :style="{ backgroundColor: 'var(--st-accent-bg)', border: '1px solid var(--st-accent-border-light)' }"
      >
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :style="{ color: 'var(--st-accent)' }">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M3 15h18M9 9v9M15 9v9"/>
        </svg>
      </div>
      <!-- Title + message -->
      <div class="flex flex-col gap-1">
        <p class="font-semibold text-[15px]" :style="{ color: 'var(--st-text)' }">{{ emptyTitle }}</p>
        <p class="text-[13px] max-w-xs leading-relaxed" :style="{ color: 'var(--st-text-tertiary)' }">{{ emptyMessage }}</p>
      </div>
      <!-- Insert button — mirrors the toolbar insert button exactly -->
      <div v-if="editable.insert" class="relative mt-1">
        <!-- Split button -->
        <div v-if="defaultInsertLabel" class="flex items-center">
          <button
            class="flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors"
            :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
            @click="insertRow()"
          >
            {{ defaultInsertLabel }}
          </button>
          <button
            class="flex items-center self-stretch px-1.5 rounded-r transition-colors"
            :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)', borderLeft: '1px solid var(--st-accent-hover)' }"
            @click="showEmptyInsertMenu = !showEmptyInsertMenu"
          >
            <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
            </svg>
          </button>
        </div>
        <!-- Single dropdown button -->
        <button
          v-else
          class="flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors"
          :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
          @click="showEmptyInsertMenu = !showEmptyInsertMenu"
        >
          Insert
          <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showEmptyInsertMenu"
          class="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]"
          :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
        >
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="openInsertPanel(); showEmptyInsertMenu = false">
            Insert row
          </button>
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="showEmptyInsertMenu = false">
            Insert column
          </button>
          <div class="my-1" :style="{ borderTop: '1px solid var(--st-border-secondary)' }"></div>
          <button class="w-full text-left px-3 py-1.5 hover-menu-item" :style="{ color: 'var(--st-text)' }" @click="showEmptyInsertMenu = false">
            Import data from CSV
          </button>
        </div>
        <Teleport to="body">
          <div v-if="showEmptyInsertMenu" class="fixed inset-0 z-40" @click="showEmptyInsertMenu = false" />
        </Teleport>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
