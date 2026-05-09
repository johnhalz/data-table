<script setup>
import { ref, computed, inject, unref, toValue, onMounted, onUnmounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import TableCell from './TableCell.vue'
import DataTable from './DataTable.vue'

const props = defineProps({
  row: { type: Object, required: true },
  rowIndex: { type: Number, required: true },
  orderNumber: { type: Number, required: true },
  /** `null`: document-flow layout (stable scrollbar). Else: TanStack Virtual Y offset */
  virtualOffsetY: { type: Number, default: null },
  totalTableWidth: { type: Number, required: true },
  selectedCell: { type: String, default: null },
  editingRowId: { type: [String, Number, null], default: null },
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
const getSubTable = inject('getSubTable', null)
const expandedInject = inject('expanded', {})
const toggleRowExpanded = inject('toggleRowExpanded', () => {})
const nestingDepth = inject('nestingDepth', 0)
const parentTheme = inject('parentTheme', 'dark')
const parentAccentColor = inject('parentAccentColor', '#3ecf8e')
const subTableSorting = inject('subTableSorting', {})
const subTableColumnFilters = inject('subTableColumnFilters', {})
const subTableColumnVisibility = inject('subTableColumnVisibility', {})
const getRowPendingState = inject('getRowPendingState', () => null)
const rowActionsInject = inject('rowActions', computed(() => []))
const rowActionsList = computed(() => {
  const v = unref(rowActionsInject)
  return Array.isArray(v) ? v : []
})
const emitRowAction = inject('emitRowAction', () => {})
const themeVars = inject('themeVars', {})

const showRowActionsMenu = ref(false)
const rowActionsMenuCoords = ref({ top: 0, left: 0 })
const rowActionsTriggerRef = ref(null)
const rowActionsMenuRef = ref(null)

const rowActionsMenuStyle = computed(() => ({
  position: 'fixed',
  left: `${rowActionsMenuCoords.value.left}px`,
  top: `${rowActionsMenuCoords.value.top}px`,
  zIndex: 9999,
}))

function toggleRowActionsMenu(ev) {
  if (showRowActionsMenu.value) {
    showRowActionsMenu.value = false
    return
  }
  const el = ev.currentTarget
  const r = el.getBoundingClientRect()
  rowActionsMenuCoords.value = { top: r.bottom + 2, left: r.left }
  showRowActionsMenu.value = true
}

function closeRowActionsMenu() {
  showRowActionsMenu.value = false
}

function handleRowActionsItem(item) {
  emitRowAction(item.key, props.row.original)
  closeRowActionsMenu()
}

function handleRowActionsKeydown(ev) {
  if (ev.key === 'Escape' && showRowActionsMenu.value) closeRowActionsMenu()
}

onClickOutside(rowActionsMenuRef, () => {
  if (showRowActionsMenu.value) closeRowActionsMenu()
}, { ignore: [rowActionsTriggerRef] })

onMounted(() => {
  document.addEventListener('keydown', handleRowActionsKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleRowActionsKeydown)
})

defineEmits([
  'toggle-row-select',
  'edit-row',
  'context-menu',
  'select-cell',
  'update-cell',
  'editing-change',
])

const stickyColShadow = computed(() => {
  const border = showColumnBorders ? 'inset -1px 0 0 var(--st-border)' : ''
  const shadow = '2px 0 4px var(--st-shadow-sticky)'
  return border ? `${border}, ${shadow}` : shadow
})

const subCfg = computed(() =>
  getSubTable ? getSubTable(props.row.original) : null,
)

const expandedMap = computed(() => unref(expandedInject) ?? {})

function isExpandableRow() {
  return !!subCfg.value
}

function rowIsExpanded() {
  return !!expandedMap.value?.[props.row.id]
}

const wrapperStyle = computed(() => {
  if (props.virtualOffsetY == null) {
    return { width: '100%' }
  }
  return {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '100%',
    transform: `translateY(${props.virtualOffsetY}px)`,
    zIndex: props.editingRowId === props.row.id ? 5 : 'auto',
  }
})
</script>

<template>
  <div
    class="st-row"
    :class="{
      'st-row--selected': row.getIsSelected(),
      'st-row--pending-insert': getRowPendingState(row.id) === 'insert',
      'st-row--pending-delete': getRowPendingState(row.id) === 'delete',
    }"
    :style="wrapperStyle"
    :data-index="virtualOffsetY != null ? rowIndex : undefined"
  >
    <div
      class="group/row"
      :style="{ display: 'table', tableLayout: 'fixed', width: '100%' }"
    >
      <div
        class="py-1.5 align-middle sticky left-0 z-10 st-sticky-cell"
        :style="{
          display: 'table-cell',
          width: '44px', minWidth: '44px',
          borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
        }"
      >
        <div
          class="flex h-full gap-1 pr-1.5 pl-1"
          :class="rowActionsList.length ? 'items-center justify-between' : 'items-center justify-end pl-0.5'"
        >
          <div
            v-if="rowActionsList.length > 0"
            class="shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100 has-[[data-state=open]]:opacity-100"
          >
            <button
              ref="rowActionsTriggerRef"
              type="button"
              title="Row actions"
              class="row-actions-trigger flex items-center justify-center w-5 h-5 rounded outline-none"
              :style="{ color: 'var(--st-text-secondary)' }"
              :data-state="showRowActionsMenu ? 'open' : 'closed'"
              @click.stop="toggleRowActionsMenu"
            >
              <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path
                  d="M4 8a1.25 1.25 0 11-2.5 0A1.25 1.25 0 014 8zm5.25 0a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm4 0a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"
                />
              </svg>
            </button>
          </div>
          <div class="flex min-w-0 flex-1 items-center justify-end gap-0.5">
            <button
              v-if="isExpandableRow()"
              class="flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-150"
              :style="{
                color: rowIsExpanded() ? 'var(--st-accent)' : 'var(--st-text-secondary)',
                transform: rowIsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)',
              }"
              title="Toggle sub-table"
              @click.stop="toggleRowExpanded(row.id)"
            >
              <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3l5 5-5 5V3z" />
              </svg>
            </button>
            <button
              v-else-if="editable.update"
              class="invisible group-hover/row:visible flex items-center justify-center w-4 h-4 shrink-0"
              :style="{ color: 'var(--st-text-secondary)' }"
              title="Expand row"
              @click.stop="$emit('edit-row', row.original)"
            >
              <svg class="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2h8v8M14 2L6 10" />
              </svg>
            </button>
            <span class="text-xs text-right whitespace-nowrap" :style="{ color: 'var(--st-text-tertiary)' }">
              {{ orderNumber }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="px-1 py-1.5 text-center align-middle sticky z-10 st-sticky-cell"
        :style="{
          display: 'table-cell',
          width: '40px', minWidth: '40px', left: '44px',
          borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
          boxShadow: stickyColShadow,
        }"
      >
        <input
          type="checkbox"
          class="cursor-pointer align-middle"
          :style="{ accentColor: 'var(--st-accent)' }"
          :checked="row.getIsSelected()"
          @click="(e) => $emit('toggle-row-select', row, e, rowIndex)"
        />
      </div>
      <TableCell
        v-for="cell in row.getVisibleCells()"
        :key="cell.id"
        :cell="cell"
        :is-selected="selectedCell === `${row.id}:${cell.column.id}`"
        @select="$emit('select-cell', row.id, cell.column.id)"
        @update="(value) => $emit('update-cell', row.id, cell.column.id, value)"
        @editing-change="(editing) => $emit('editing-change', editing, row.id)"
        @contextmenu.prevent="$emit('context-menu', $event, row, cell)"
      />
    </div>

    <Teleport to="body">
      <div
        v-if="showRowActionsMenu"
        ref="rowActionsMenuRef"
        :style="{ ...themeVars, ...rowActionsMenuStyle }"
      >
        <div
          class="w-52 rounded shadow-xl py-1 text-[13px]"
          :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
        >
          <button
            v-for="item in rowActionsList"
            :key="item.key"
            type="button"
            class="w-full text-left px-3 py-1.5 hover-menu-item flex items-center gap-2"
            :style="{ color: 'var(--st-text)' }"
            @click="handleRowActionsItem(item)"
          >
            <span v-if="item.icon" class="shrink-0 w-3.5 h-3.5 inline-flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full" v-html="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>
    </Teleport>

    <div
      v-if="rowIsExpanded() && subCfg"
      :style="{
        display: 'block',
        width: totalTableWidth + 'px',
        borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
      }"
    >
      <div
        :style="{
          borderLeft: '3px solid var(--st-accent)',
          marginLeft: (10 + Number(toValue(nestingDepth) || 0) * 16) + 'px',
          backgroundColor: 'var(--st-bg)',
        }"
      >
        <DataTable
          v-bind="subCfg"
          :theme="subCfg.theme ?? unref(parentTheme)"
          :accent-color="subCfg.accentColor ?? unref(parentAccentColor)"
          :nesting-depth="nestingDepth + 1"
          :controlled-sorting="subTableSorting"
          :controlled-column-filters="subTableColumnFilters"
          :controlled-column-visibility="subTableColumnVisibility"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.st-row {
  background-color: transparent;
}
.st-row:hover {
  background-color: var(--st-bg-row-hover);
}
.st-row--selected {
  background-color: var(--st-bg-selected);
}
.st-row--selected:hover {
  background-color: var(--st-bg-selected);
}
.st-sticky-cell {
  background-color: var(--st-bg);
}
.st-row--selected .st-sticky-cell {
  background-color: var(--st-bg-selected-cell);
}
.st-row--pending-insert {
  background-color: var(--st-accent-bg);
}
.st-row--pending-insert:hover {
  background-color: var(--st-accent-bg);
}
.st-row--pending-insert .st-sticky-cell {
  background-color: var(--st-accent-bg);
}
.st-row--pending-delete {
  background-color: rgba(239, 68, 68, 0.08);
}
.st-row--pending-delete:hover {
  background-color: rgba(239, 68, 68, 0.12);
}
.st-row--pending-delete .st-sticky-cell {
  background-color: rgba(239, 68, 68, 0.08);
}
.row-actions-trigger:hover {
  background-color: var(--st-bg-menu-hover);
}
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
