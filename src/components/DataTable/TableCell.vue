<script setup>
import { ref, nextTick, inject, computed, isRef } from 'vue'

/** Callback-valued meta keys that TanStack / reactive merges sometimes strip from `column.columnDef.meta`. */
const META_MERGE_RESTORE_KEYS = [
  'badge',
  'cellButtons',
  'progressBar',
  'segmentedBar',
  'suffixIcon',
  'secondaryText',
  'overflow',
  'multiline',
]

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
  return 'opacity-0 group-hover/row:opacity-100'
})

const emit = defineEmits(['select', 'update', 'editing-change'])

const isEditing = ref(false)
const editValue = ref('')
const textareaRef = ref(null)

/** Stable fallback when columnDef.meta is missing (avoid allocating new {} per read). */
const EMPTY_COLUMN_META = {}

const originalColumnMetaById = inject('originalColumnMetaById', null)

// Merge TanStack's column.columnDef.meta with props.columns[].meta so functions like meta.badge survive merges/proxies.
const meta = computed(() => {
  const id = String(props.cell.column.id)
  const fromOriginal = originalColumnMetaById?.value?.[id]
  const fromDef = props.cell.column.columnDef.meta || {}
  if (!fromOriginal) {
    return Object.keys(fromDef).length ? fromDef : EMPTY_COLUMN_META
  }
  const merged = { ...fromOriginal, ...fromDef }
  for (const k of META_MERGE_RESTORE_KEYS) {
    if ((merged[k] === undefined || merged[k] === null) && fromOriginal[k] != null) {
      merged[k] = fromOriginal[k]
    }
  }
  if (
    typeof merged.badge !== 'function' &&
    merged.badge !== true &&
    typeof fromOriginal.badge === 'function'
  ) {
    merged.badge = fromOriginal.badge
  }
  if (merged.suffixIcon == null && fromOriginal.suffixIcon != null) {
    merged.suffixIcon = fromOriginal.suffixIcon
  }
  if (merged.secondaryText == null && fromOriginal.secondaryText != null) {
    merged.secondaryText = fromOriginal.secondaryText
  }
  if (
    typeof merged.secondaryText !== 'function' &&
    typeof merged.secondaryText !== 'string' &&
    typeof fromOriginal.secondaryText === 'function'
  ) {
    merged.secondaryText = fromOriginal.secondaryText
  }
  if (
    typeof merged.segmentedBar !== 'function' &&
    typeof fromOriginal.segmentedBar === 'function'
  ) {
    merged.segmentedBar = fromOriginal.segmentedBar
  }
  return merged
})

const isBoolean = computed(() => meta.value.type === 'boolean')

// Progress bar: meta.progressBar = true | { min, max } | ((value, row) => number 0–100)
const progressPercent = computed(() => {
  const m = meta.value
  if (!m.progressBar) return null
  const value = props.cell.getValue()
  if (value === null || value === undefined) return null
  if (typeof m.progressBar === 'function') {
    return Math.min(100, Math.max(0, m.progressBar(value, props.cell.row.original)))
  }
  if (typeof m.progressBar === 'object' && m.progressBar !== null) {
    const { min = 0, max = 100 } = m.progressBar
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  }
  // meta.progressBar === true: value is already 0–100
  return Math.min(100, Math.max(0, Number(value)))
})

// Segmented progress: meta.segmentedBar = (value, row) => { segments: { color, count, label }[], total }
const segmentedBarData = computed(() => {
  const m = meta.value
  if (!m.segmentedBar || typeof m.segmentedBar !== 'function') return null
  const value = props.cell.getValue()
  const row = props.cell.row.original
  return m.segmentedBar(value, row) ?? null
})

function segmentedSegmentWidthPercent(segCount, total) {
  if (!total || total <= 0) return '0%'
  const pct = (segCount / total) * 100
  return `${Math.min(100, Math.max(0, pct))}%`
}

// Overflow mode: meta.overflow = 'truncate' | 'wrap' | 'extend'
// Backward compat: meta.multiline = true → 'wrap'
// Falls back to the table-level cellOverflow prop default.
const overflowMode = computed(() => {
  const m = meta.value
  if (m.overflow) return m.overflow
  if (m.multiline) return 'wrap'
  const global = isRef(cellOverflowInjected) ? cellOverflowInjected.value : cellOverflowInjected
  return global || 'truncate'
})

// Cell buttons: meta.cellButtons = [{ icon: '<svg…>', label: 'string', onClick: (row) => void }]
const cellButtons = computed(() => meta.value.cellButtons ?? [])

// Badge: meta.badge = true | { color?, label? } | (value, row) => { color?, label? } | null | false
// When `label` is set, it is shown inside the pill instead of stringifying the cell value.
// Boolean cells without `label` render as "True" / "False". `color` accepts hex, rgb/hsl, named, var(--token), ….
function badgeStyleFromConfig(config) {
  const color = config && typeof config.color !== 'undefined' ? config.color : null
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
}

const badgePresentation = computed(() => {
  const m = meta.value
  if (!m.badge) return null
  const value = props.cell.getValue()
  const row = props.cell.row.original

  let config = m.badge
  if (typeof config === 'function') {
    config = config(value, row)
    if (config == null || config === false) return null
  } else if (config === true) {
    config = {}
  } else if (typeof config !== 'object' || config === null) {
    return null
  }

  const style = badgeStyleFromConfig(config)

  let text
  if (config.label != null && config.label !== '') {
    text = String(config.label)
  } else if (value === null || value === undefined) {
    text = 'NULL'
  } else if (typeof value === 'boolean') {
    text = value ? 'True' : 'False'
  } else {
    text = String(value)
  }

  return { style, text }
})

const useBooleanToggle = computed(() => isBoolean.value && !meta.value.badge)

// Suffix icon: meta.suffixIcon = { svg, color? } | (value, row) => { svg, color? } | null
// Renders a small inline icon after the cell text.
const suffixIcon = computed(() => {
  const m = meta.value
  if (!m.suffixIcon) return null
  const value = props.cell.getValue()
  if (typeof m.suffixIcon === 'function') {
    return m.suffixIcon(value, props.cell.row.original) || null
  }
  return m.suffixIcon
})

// meta.secondaryText = string | (value, row) => string | null | undefined — line below primary (plain text cells only)
const secondaryTextLine = computed(() => {
  const m = meta.value
  if (m.secondaryText == null || m.secondaryText === '') return null
  const value = props.cell.getValue()
  const row = props.cell.row.original
  let s
  if (typeof m.secondaryText === 'function') {
    s = m.secondaryText(value, row)
  } else {
    s = m.secondaryText
  }
  if (s == null) return null
  const t = String(s).trim()
  return t === '' ? null : t
})

const primaryValueIsNullish = computed(() => {
  const v = props.cell.getValue()
  return v === null || v === undefined
})

const showSecondaryText = computed(() => {
  if (!secondaryTextLine.value) return false
  if (primaryValueIsNullish.value) return true
  return !badgePresentation.value
})

const displayCellRowClass = computed(() =>
  showSecondaryText.value ? 'flex items-start gap-1 min-w-0' : 'flex items-center gap-1 min-w-0'
)

function handleClick() {
  if (!isEditing.value) {
    emit('select')
  }
}

function handleDoubleClick() {
  if (!editable.value?.update || useBooleanToggle.value || meta.value.progressBar || meta.value.segmentedBar || cellButtons.value.length > 0) return
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
  const t = meta.value.type
  const newValue = t === 'int8' || t === 'int4' || t === 'float8'
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
    class="px-2 py-1.5 relative cursor-default align-middle"
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

    <!-- Segmented bar + stacked counts -->
    <template v-else-if="segmentedBarData">
      <div v-if="segmentedBarData.total === 0" class="flex items-center min-w-0">
        <span class="italic text-[13px]" :style="{ color: 'var(--st-text-placeholder)' }">—</span>
      </div>
      <div v-else class="flex items-center gap-2 min-w-0">
        <div
          class="rounded-full overflow-hidden flex shrink-0 flex-nowrap"
          :style="{ height: '6px', width: '80px', backgroundColor: 'var(--st-border-secondary)' }"
        >
          <div
            v-for="seg in segmentedBarData.segments"
            :key="seg.label"
            class="h-full shrink-0"
            :style="{
              width: segmentedSegmentWidthPercent(seg.count, segmentedBarData.total),
              backgroundColor: seg.color,
            }"
          />
        </div>
        <div class="flex flex-col shrink-0" style="gap: 1px">
          <span
            v-for="seg in segmentedBarData.segments"
            :key="seg.label"
            class="text-[11px] leading-snug tabular-nums whitespace-nowrap"
            :style="{ color: 'var(--st-text-secondary)' }"
          >{{ seg.count }} {{ seg.label }}</span>
        </div>
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
        :class="displayCellRowClass"
        :style="isRowDeleted ? { textDecoration: 'line-through', opacity: 0.5 } : {}"
      >
        <!-- Text / badge content -->
        <div
          class="flex flex-col gap-0.5 flex-1 min-w-0 text-[13px]"
          :style="{ color: 'var(--st-text)' }"
        >
          <template v-if="cell.getValue() === null || cell.getValue() === undefined">
            <span class="italic" :style="{ color: 'var(--st-text-placeholder)' }">NULL</span>
          </template>

          <!-- Badge style -->
          <template v-else-if="badgePresentation">
            <span
              class="inline-flex shrink-0 self-start items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-tight"
              :style="badgePresentation.style"
            >{{ badgePresentation.text }}</span>
          </template>

          <!-- Wrap overflow -->
          <template v-else-if="overflowMode === 'wrap'">
            <span class="block whitespace-pre-wrap break-words">{{ cell.getValue() }}</span>
          </template>

          <!-- Truncate (default) -->
          <template v-else>
            <span class="truncate block" :title="String(cell.getValue())">{{ cell.getValue() }}</span>
          </template>

          <span
            v-if="showSecondaryText"
            class="block text-[11px] leading-snug"
            :class="overflowMode === 'wrap' ? 'whitespace-pre-wrap break-words' : 'truncate'"
            :style="{ color: 'var(--st-text-secondary)' }"
            :title="overflowMode === 'wrap' ? undefined : secondaryTextLine"
          >{{ secondaryTextLine }}</span>
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
          :class="['flex items-center gap-0.5 shrink-0', cellButtonClass]"
        >
          <button
            v-for="(btn, btnIdx) in cellButtons"
            :key="btnIdx"
            type="button"
            :class="[
              'flex items-center justify-center rounded transition-colors',
              btn.icon ? 'w-5 h-5 shrink-0' : 'h-5 px-1.5 shrink-0 text-[11px] font-medium whitespace-nowrap',
            ]"
            :style="{ color: 'var(--st-text-secondary)' }"
            :title="btn.label"
            @click.stop="btn.onClick(cell.row.original)"
          >
            <!-- Icon slot: supports raw SVG string or plain label -->
            <span v-if="btn.icon" class="w-3.5 h-3.5 flex items-center justify-center" v-html="btn.icon" />
            <span v-else>{{ btn.label }}</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
