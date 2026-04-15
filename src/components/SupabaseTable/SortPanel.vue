<script setup>
import { ref, watch, inject } from 'vue'

const props = defineProps({
  table: { type: Object, required: true },
  sorting: { type: Array, default: () => [] },
  allColumns: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:sorting', 'close'])

const showDataTypes = inject('showDataTypes', true)

const localRules = ref([...props.sorting])

watch(() => props.sorting, (val) => {
  localRules.value = [...val]
}, { deep: true })

function addRule() {
  const usedIds = new Set(localRules.value.map(r => r.id))
  const available = props.allColumns.find(c => !usedIds.has(c.id))
  if (available) {
    localRules.value.push({ id: available.id, desc: false })
  }
}

function removeRule(index) {
  localRules.value.splice(index, 1)
}

function toggleDirection(index) {
  localRules.value[index].desc = !localRules.value[index].desc
}

function apply() {
  emit('update:sorting', [...localRules.value])
  emit('close')
}

function clearAll() {
  localRules.value = []
  emit('update:sorting', [])
  emit('close')
}

const dragIndex = ref(null)
const dragOverIndex = ref(null)

function onDragStart(index) {
  dragIndex.value = index
}

function onDragOver(e, index) {
  e.preventDefault()
  dragOverIndex.value = index
}

function onDragEnd() {
  if (dragIndex.value !== null && dragOverIndex.value !== null && dragIndex.value !== dragOverIndex.value) {
    const rules = [...localRules.value]
    const [moved] = rules.splice(dragIndex.value, 1)
    rules.splice(dragOverIndex.value, 0, moved)
    localRules.value = rules
  }
  dragIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div
    class="absolute top-full right-0 mt-1 w-96 rounded shadow-xl z-50 text-[13px]"
    :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
    @click.stop
  >
    <div class="p-3">
      <div v-if="localRules.length === 0" class="text-center py-4" :style="{ color: 'var(--st-text-tertiary)' }">
        <p class="mb-1">No sorts applied to this view</p>
        <p class="text-xs">Add a column below to sort the view</p>
      </div>

      <div
        v-for="(rule, i) in localRules"
        :key="i"
        class="flex items-center gap-2 mb-2 rounded px-1 -mx-1 transition-colors"
        :style="dragOverIndex === i && dragIndex !== i ? { backgroundColor: 'var(--st-bg-menu-hover)' } : {}"
        draggable="true"
        @dragstart="onDragStart(i)"
        @dragover="onDragOver($event, i)"
        @dragend="onDragEnd"
      >
        <span class="cursor-grab active:cursor-grabbing shrink-0 flex items-center" :style="{ color: 'var(--st-text-placeholder)' }">
          <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5.5" cy="4" r="1" /><circle cx="10.5" cy="4" r="1" />
            <circle cx="5.5" cy="8" r="1" /><circle cx="10.5" cy="8" r="1" />
            <circle cx="5.5" cy="12" r="1" /><circle cx="10.5" cy="12" r="1" />
          </svg>
        </span>

        <span class="text-xs w-12 shrink-0" :style="{ color: 'var(--st-text-tertiary)' }">{{ i === 0 ? 'sort by' : 'then by' }}</span>

        <select
          v-model="rule.id"
          class="flex-1 rounded px-2 py-1 text-[13px] outline-none min-w-0"
          :style="{ backgroundColor: 'var(--st-bg)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }"
        >
          <option v-for="col in allColumns" :key="col.id" :value="col.id">
            {{ col.id }}<template v-if="showDataTypes"> ({{ col.type }})</template>
          </option>
        </select>

        <button
          class="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors"
          :style="rule.desc
            ? { color: 'var(--st-text-secondary)', backgroundColor: 'var(--st-bg)', border: '1px solid var(--st-border-secondary)' }
            : { color: 'var(--st-accent)', backgroundColor: 'var(--st-accent-bg)', border: '1px solid var(--st-accent-border-light)' }"
          @click="toggleDirection(i)"
          :title="rule.desc ? 'Descending — click to toggle' : 'Ascending — click to toggle'"
        >
          <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path v-if="!rule.desc" d="M3.5 12.5V2.707l-1.146 1.147a.5.5 0 01-.708-.708l2-2a.5.5 0 01.708 0l2 2a.5.5 0 01-.708.708L3.5 2.707V12.5a.5.5 0 01-1 0z" />
            <path v-else d="M3.5 3.5v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L4.5 13.293V3.5a.5.5 0 00-1 0z" />
          </svg>
          {{ rule.desc ? 'DESC' : 'ASC' }}
        </button>

        <button
          class="shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors"
          :style="{ color: 'var(--st-text-tertiary)' }"
          title="Remove sort rule"
          @click="removeRule(i)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
          </svg>
        </button>
      </div>

      <button
        class="text-[13px] mt-1"
        :style="{ color: 'var(--st-text-secondary)' }"
        @click="addRule"
      >
        + Pick a column to sort by
      </button>
    </div>

    <div class="px-3 py-2 flex items-center justify-end gap-2" :style="{ borderTop: '1px solid var(--st-border-secondary)' }">
      <button
        v-if="localRules.length > 0"
        class="px-3 py-1 rounded text-[13px] transition-colors"
        :style="{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
        @click="clearAll"
      >
        Clear sorting
      </button>
      <button
        class="px-3 py-1 rounded text-[13px] font-medium transition-colors"
        :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
        @click="apply"
      >
        Apply sorting
      </button>
    </div>
  </div>
</template>
