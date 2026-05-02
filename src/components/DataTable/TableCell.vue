<script setup>
import { ref, nextTick, inject, computed, isRef } from 'vue'

const props = defineProps({
  cell: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
})

const editable = inject('editable', true)
const showRowBorders = inject('showRowBorders', true)
const showColumnBorders = inject('showColumnBorders', true)
const cellButtonVisibilityInjected = inject('cellButtonVisibility', 'hover')
const cellOverflowInjected = inject('cellOverflow', 'truncate')
const getCellPendingState = inject('getCellPendingState', () => null)
const getCellPreviousValue = inject('getCellPreviousValue', () => undefined)
const getRowPendingState = inject('getRowPendingState', () => null)

const cellPendingState = computed(() =>
  getCellPendingState(props.cell.row.id, props.cell.column.id)
)
const rowPendingState = computed(() => getRowPendingState(props.cell.row.id))
const previousValue = computed(() =>
  getCellPreviousValue(props.cell.row.id, props.cell.column.id)
)
const isCellModified = computed(() => cellPendingState.value === 'modified')
const isRowDeleted = computed(() => rowPendingState.value === 'delete')

const cellButtonClass = computed(() => {
  const mode = isRef(cellButtonVisibilityInjected)
    ? cellButtonVisibilityInjected.value
    : cellButtonVisibilityInjected
  if (mode === 'always') return 'opacity-100'
  if (mode === 'select') return props.isSelected ? 'opacity-100' : 'opacity-0'
  return 'opacity-0 group-hover/cell:opacity-100'
})

const emit = defineEmits(['select', 'update', 'editing-change'])

const isEditing = ref(false)
const editValue = ref('')
const textareaRef = ref(null)

const meta = props.cell.column.columnDef.meta || {}
const isBoolean = meta.type === 'boolean'

// Progress bar: meta.progressBar = true | { min, max } | ((value, row) => number 0–100)
const progressPercent = computed(() => {
  if (!meta.progressBar) return null
  const value = props.cell.getValue()
  if (value === null || value === undefined) return null
  if (typeof meta.progressBar === 'function') {
    return Math.min(100, Math.max(0, meta.progressBar(value, props.cell.row.original)))
  }
  if (typeof meta.progressBar === 'object' && meta.progressBar !== null) {
    const { min = 0, max = 100 } = meta.progressBar
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  }
  // meta.progressBar === true: value is already 0–100
  return Math.min(100, Math.max(0, Number(value)))
})

// Overflow mode: meta.overflow = 'truncate' | 'wrap' | 'extend'
// Backward compat: meta.multiline = true → 'wrap'
// Falls back to the table-level cellOverflow prop default.
const overflowMode = computed(() => {
  if (meta.overflow) return meta.overflow
  if (meta.multiline) return 'wrap'
  const global = isRef(cellOverflowInjected) ? cellOverflowInjected.value : cellOverflowInjected
  return global || 'truncate'
})

// Cell buttons: meta.cellButtons = [{ icon: '<svg…>', label: 'string', onClick: (row) => void }]
const cellButtons = meta.cellButtons ?? []

// Badge: meta.badge = true | { color?: CSSColor } | (value, row) => { color?: CSSColor } | null
// Works for any column type (varchar, text, int*, boolean, etc.). When set on a boolean column,
// the pill replaces the toggle. `color` accepts any valid CSS color (hex, rgb/hsl, named, var(--token), …).
const badgeStyle = computed(() => {
  if (!meta.badge) return null
  const value = props.cell.getValue()
  if (value === null || value === undefined) return null
  let config = meta.badge
  if (typeof config === 'function') {
    config = config(value, props.cell.row.original)
    if (!config) return null
  }
  const color = typeof config === 'object' && config !== null ? config.color : null
  if (color) {
    return {
      backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
      color,
      border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
    }
  }
  return {
    backgroundColor: 'var(--st-border-secondary)',
    color: 'var(--st-text)',
    border: '1px solid var(--st-border)',
  }
})

const useBooleanToggle = computed(() => isBoolean && !meta.badge)

// Suffix icon: meta.suffixIcon = { svg, color? } | (value, row) => { svg, color? } | null
// Renders a small inline icon after the cell text.
const suffixIcon = computed(() => {
  if (!meta.suffixIcon) return null
  const value = props.cell.getValue()
  if (typeof meta.suffixIcon === 'function') {
    return meta.suffixIcon(value, props.cell.row.original) || null
  }
  return meta.suffixIcon
})

function handleClick() {
  if (!isEditing.value) {
    emit('select')
  }
}

function handleDoubleClick() {
  if (!editable.value?.update || useBooleanToggle.value || meta.progressBar || cellButtons.length > 0) return
  isEditing.value = true
  emit('editing-change', true)
  editValue.value = props.cell.getValue() ?? ''
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      textareaRef.value.select()
      autoResize()
    }
  })
}

function autoResize() {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

function saveEdit() {
  const newValue = meta.type === 'int8' || meta.type === 'int4' || meta.type === 'float8'
    ? Number(editValue.value)
    : editValue.value
  emit('update', newValue)
  isEditing.value = false
  emit('editing-change', false)
}

function cancelEdit() {
  isEditing.value = false
  emit('editing-change', false)
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}

function toggleBoolean() {
  if (!editable.value?.update) return
  emit('update', !props.cell.getValue())
}
</script>

<template>
  <div
    class="px-2 py-1.5 relative cursor-default group/cell align-middle"
    :style="{
      display: 'table-cell',
      width: `${cell.column.getSize()}px`,
      minWidth: `${cell.column.getSize()}px`,
      maxWidth: `${cell.column.getSize()}px`,
      overflow: 'hidden',
      borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
      borderRight: showColumnBorders ? '1px solid var(--st-border)' : 'none',
      boxShadow: isSelected && !isEditing
        ? 'inset 0 0 0 2px var(--st-accent)'
        : (isCellModified ? 'inset 3px 0 0 var(--st-accent)' : 'none'),
      zIndex: isEditing ? 20 : (isSelected ? 10 : 'auto'),
    }"
    :title="isCellModified && previousValue !== undefined ? `Was: ${previousValue === null || previousValue === '' ? '(empty)' : previousValue}` : undefined"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <!-- Boolean toggle (badge meta takes precedence — any type can use meta.badge) -->
    <template v-if="useBooleanToggle">
      <button
        v-if="editable.update"
        class="flex items-center gap-1.5"
        @click.stop="toggleBoolean"
      >
        <span
          class="inline-block w-7 h-4 rounded-full relative transition-colors"
          :style="{ backgroundColor: cell.getValue() ? 'var(--st-accent)' : 'var(--st-toggle-off)' }"
        >
          <span
            class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"
            :class="cell.getValue() ? 'left-3.5' : 'left-0.5'"
          />
        </span>
        <span class="text-xs" :style="{ color: 'var(--st-text-secondary)' }">{{ cell.getValue() ? 'true' : 'false' }}</span>
      </button>
      <span v-else class="text-[13px]" :style="{ color: 'var(--st-text)' }">
        <template v-if="cell.getValue() === null || cell.getValue() === undefined">
          <span class="italic" :style="{ color: 'var(--st-text-placeholder)' }">NULL</span>
        </template>
        <template v-else>{{ cell.getValue() ? 'true' : 'false' }}</template>
      </span>
    </template>

    <!-- Editing mode -->
    <template v-else-if="isEditing">
      <textarea
        ref="textareaRef"
        v-model="editValue"
        class="w-full rounded px-1.5 py-1 text-[13px] resize-none outline-none"
        :style="{ backgroundColor: 'var(--st-bg-input)', color: 'var(--st-text)', border: '1px solid var(--st-accent)' }"
        rows="1"
        @keydown="handleKeydown"
        @input="autoResize"
      />
      <div
        class="absolute -bottom-7 left-0 flex items-center gap-1 rounded shadow-lg px-2 py-1 z-20 text-xs whitespace-nowrap"
        :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
      >
        <button
          class="flex items-center gap-0.5"
          :style="{ color: 'var(--st-accent)' }"
          @click.stop="saveEdit"
        >
          &#8629; Save
        </button>
        <span :style="{ color: 'var(--st-text-placeholder)' }">|</span>
        <button
          class="flex items-center gap-0.5"
          :style="{ color: 'var(--st-text-secondary)' }"
          @click.stop="cancelEdit"
        >
          Esc Cancel
        </button>
      </div>
    </template>

    <!-- Progress bar -->
    <template v-else-if="progressPercent !== null">
      <div class="flex items-center gap-2">
        <div
          class="flex-1 rounded-full overflow-hidden"
          :style="{ height: '6px', backgroundColor: 'var(--st-border-secondary)' }"
        >
          <div
            class="h-full rounded-full transition-all duration-300"
            :style="{ width: `${progressPercent}%`, backgroundColor: 'var(--st-accent)' }"
          />
        </div>
        <span class="text-xs shrink-0 tabular-nums" :style="{ color: 'var(--st-text-secondary)' }">
          {{ Math.round(progressPercent) }}%
        </span>
      </div>
    </template>

    <!-- Display mode: text / badge / overflow variants + suffix icon + cell buttons -->
    <template v-else>
      <div
        class="flex items-center gap-1 min-w-0"
        :style="isRowDeleted ? { textDecoration: 'line-through', opacity: 0.5 } : {}"
      >
        <!-- Text / badge content -->
        <div
          class="flex-1 min-w-0 text-[13px]"
          :style="{ color: 'var(--st-text)' }"
        >
          <template v-if="cell.getValue() === null || cell.getValue() === undefined">
            <span class="italic" :style="{ color: 'var(--st-text-placeholder)' }">NULL</span>
          </template>

          <!-- Badge style -->
          <template v-else-if="badgeStyle">
            <span
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-tight"
              :style="badgeStyle"
            >{{ cell.getValue() }}</span>
          </template>

          <!-- Wrap overflow -->
          <template v-else-if="overflowMode === 'wrap'">
            <span class="block whitespace-pre-wrap break-words">{{ cell.getValue() }}</span>
          </template>

          <!-- Truncate (default) -->
          <template v-else>
            <span class="truncate block" :title="String(cell.getValue())">{{ cell.getValue() }}</span>
          </template>
        </div>

        <!-- Suffix icon: rendered between text and cell buttons -->
        <span
          v-if="suffixIcon"
          class="w-3.5 h-3.5 shrink-0 flex items-center justify-center"
          :style="{ color: suffixIcon.color || 'var(--st-text-secondary)' }"
          v-html="suffixIcon.svg"
        />

        <!-- Trailing cell buttons -->
        <div
          v-if="cellButtons.length > 0"
          :class="['flex items-center gap-0.5 shrink-0 transition-opacity', cellButtonClass]"
        >
          <button
            v-for="btn in cellButtons"
            :key="btn.label"
            class="flex items-center justify-center w-5 h-5 rounded transition-colors"
            :style="{ color: 'var(--st-text-secondary)' }"
            :title="btn.label"
            @click.stop="btn.onClick(cell.row.original)"
          >
            <!-- Icon slot: supports raw SVG string or plain label -->
            <span v-if="btn.icon" class="w-3.5 h-3.5 flex items-center justify-center" v-html="btn.icon" />
            <span v-else class="text-[11px]">{{ btn.label }}</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
