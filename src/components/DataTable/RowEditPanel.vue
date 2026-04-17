<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'

const themeVars = inject('themeVars', {})

const props = defineProps({
  mode: { type: String, required: true }, // 'insert' | 'update'
  rowData: { type: Object, default: null },
  table: { type: Object, required: true },
  tableName: { type: String, default: 'table' },
})

const emit = defineEmits(['save', 'close'])

const columns = computed(() =>
  props.table.getAllColumns().map(col => ({
    id: col.id,
    meta: col.columnDef.meta || {},
  }))
)

const requiredFields = computed(() => columns.value.filter(c => c.meta.isNullable === false))
const optionalFields = computed(() => columns.value.filter(c => c.meta.isNullable !== false))

const formData = ref({})

function initForm() {
  const data = {}
  columns.value.forEach(col => {
    if (props.mode === 'update' && props.rowData) {
      data[col.id] = props.rowData[col.id] ?? ''
    } else {
      data[col.id] = col.meta.type === 'boolean' ? false : ''
    }
  })
  formData.value = data
}

initForm()

function handleSave() {
  const payload = { ...formData.value }
  columns.value.forEach(col => {
    if (['int8', 'int4', 'float8'].includes(col.meta.type) && payload[col.id] !== '') {
      payload[col.id] = Number(payload[col.id])
    }
  })
  emit('save', payload)
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
  } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    handleSave()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div
      class="fixed inset-0 z-40"
      :style="{ ...themeVars, backgroundColor: 'var(--st-bg-panel-overlay)' }"
      @click="emit('close')"
    />

    <!-- Panel -->
    <div
      class="fixed top-0 right-0 bottom-0 w-[520px] z-50 flex flex-col shadow-2xl"
      :style="{ ...themeVars, backgroundColor: 'var(--st-bg)', borderLeft: '1px solid var(--st-border)' }"
    >
      <!-- Header -->
      <div class="px-5 py-4 flex items-center justify-between" :style="{ borderBottom: '1px solid var(--st-border)' }">
        <div class="flex items-center gap-2">
          <span class="text-sm" :style="{ color: 'var(--st-text)' }">
            {{ mode === 'insert' ? 'Insert row into' : 'Update row from' }}
          </span>
          <code
            class="rounded px-2 py-0.5 text-[13px]"
            :style="{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
          >
            {{ tableName }}
          </code>
        </div>
        <button
          class="w-6 h-6 flex items-center justify-center"
          :style="{ color: 'var(--st-text-tertiary)' }"
          @click="emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-auto px-5 py-4">
        <!-- Required fields -->
        <div v-if="requiredFields.length > 0" class="mb-6">
          <div
            v-for="col in requiredFields"
            :key="col.id"
            class="mb-4"
          >
            <div class="flex items-start gap-4">
              <div class="w-40 shrink-0 pt-2">
                <div class="text-[13px] font-medium" :style="{ color: 'var(--st-text)' }">{{ col.id }}</div>
                <div class="text-xs" :style="{ color: 'var(--st-text-tertiary)' }">{{ col.meta.type }}</div>
              </div>
              <div class="flex-1">
                <template v-if="col.meta.type === 'boolean'">
                  <button
                    class="flex items-center gap-2"
                    @click="formData[col.id] = !formData[col.id]"
                  >
                    <span
                      class="inline-block w-8 h-[18px] rounded-full relative transition-colors"
                      :style="{ backgroundColor: formData[col.id] ? 'var(--st-accent)' : 'var(--st-toggle-off)' }"
                    >
                      <span
                        class="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform"
                        :class="formData[col.id] ? 'left-[17px]' : 'left-[2px]'"
                      />
                    </span>
                    <span class="text-xs" :style="{ color: 'var(--st-text-secondary)' }">{{ formData[col.id] ? 'true' : 'false' }}</span>
                  </button>
                </template>
                <template v-else>
                  <input
                    v-if="col.meta.isPrimaryKey && mode === 'update'"
                    :value="formData[col.id]"
                    class="w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed"
                    :style="{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
                    disabled
                  />
                  <textarea
                    v-else
                    v-model="formData[col.id]"
                    class="w-full rounded px-3 py-2 text-[13px] outline-none resize-y min-h-[36px]"
                    :style="{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }"
                    rows="1"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Optional fields -->
        <div v-if="optionalFields.length > 0">
          <div class="mb-3">
            <h3 class="text-sm font-medium" :style="{ color: 'var(--st-text)' }">Optional Fields</h3>
            <p class="text-xs mt-0.5" :style="{ color: 'var(--st-text-tertiary)' }">These are columns that do not need any value</p>
          </div>
          <div
            v-for="col in optionalFields"
            :key="col.id"
            class="mb-4"
          >
            <div class="flex items-start gap-4">
              <div class="w-40 shrink-0 pt-2">
                <div class="text-[13px] font-medium" :style="{ color: 'var(--st-text)' }">{{ col.id }}</div>
                <div class="text-xs" :style="{ color: 'var(--st-text-tertiary)' }">{{ col.meta.type }}</div>
              </div>
              <div class="flex-1">
                <template v-if="col.meta.type === 'boolean'">
                  <button
                    class="flex items-center gap-2"
                    @click="formData[col.id] = !formData[col.id]"
                  >
                    <span
                      class="inline-block w-8 h-[18px] rounded-full relative transition-colors"
                      :style="{ backgroundColor: formData[col.id] ? 'var(--st-accent)' : 'var(--st-toggle-off)' }"
                    >
                      <span
                        class="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform"
                        :class="formData[col.id] ? 'left-[17px]' : 'left-[2px]'"
                      />
                    </span>
                    <span class="text-xs" :style="{ color: 'var(--st-text-secondary)' }">{{ formData[col.id] ? 'true' : 'false' }}</span>
                  </button>
                </template>
                <template v-else>
                  <textarea
                    v-model="formData[col.id]"
                    class="w-full rounded px-3 py-2 text-[13px] outline-none resize-y min-h-[36px]"
                    :style="{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }"
                    rows="1"
                    placeholder="NULL"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 flex items-center justify-end gap-2" :style="{ borderTop: '1px solid var(--st-border)' }">
        <button
          class="px-3 py-1.5 rounded text-[13px] transition-colors"
          :style="{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          class="px-3 py-1.5 rounded text-[13px] font-medium transition-colors flex items-center gap-1.5"
          :style="{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }"
          @click="handleSave"
        >
          Save
          <kbd class="text-[10px] opacity-60">&#8984;&#8629;</kbd>
        </button>
      </div>
    </div>
  </Teleport>
</template>
