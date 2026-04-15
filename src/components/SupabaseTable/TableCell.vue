<script setup>
import { ref, nextTick, watch, inject } from 'vue'
import { FlexRender } from '@tanstack/vue-table'

const props = defineProps({
  cell: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
})

const editable = inject('editable', true)
const showRowBorders = inject('showRowBorders', true)
const showColumnBorders = inject('showColumnBorders', true)

const emit = defineEmits(['select', 'update'])

const isEditing = ref(false)
const editValue = ref('')
const textareaRef = ref(null)

const meta = props.cell.column.columnDef.meta || {}
const isBoolean = meta.type === 'boolean'

function handleClick() {
  if (!isEditing.value) {
    emit('select')
  }
}

function handleDoubleClick() {
  if (!editable || isBoolean) return
  isEditing.value = true
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
}

function cancelEdit() {
  isEditing.value = false
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
  if (!editable) return
  emit('update', !props.cell.getValue())
}
</script>

<template>
  <td
    class="px-2 py-1.5 relative cursor-default"
    :style="{
      width: `${cell.column.getSize()}px`,
      minWidth: `${cell.column.getSize()}px`,
      maxWidth: `${cell.column.getSize()}px`,
      borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
      borderRight: showColumnBorders ? '1px solid var(--st-border)' : 'none',
      boxShadow: isSelected && !isEditing ? 'inset 0 0 0 2px var(--st-accent)' : 'none',
      zIndex: isSelected && !isEditing ? 10 : 'auto',
    }"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <!-- Boolean toggle -->
    <template v-if="isBoolean">
      <button
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

    <!-- Display mode -->
    <template v-else>
      <span class="truncate block" :title="String(cell.getValue() ?? '')">
        <template v-if="cell.getValue() === null || cell.getValue() === undefined">
          <span class="italic" :style="{ color: 'var(--st-text-placeholder)' }">NULL</span>
        </template>
        <template v-else>
          {{ cell.getValue() }}
        </template>
      </span>
    </template>
  </td>
</template>
