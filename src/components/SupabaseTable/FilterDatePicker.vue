<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({
  value: { type: String, default: '' },
  columnType: { type: String, default: 'date' },
})

const emit = defineEmits(['update'])

const themeVars = inject('themeVars', {})

// colorScheme drives the native date picker's chrome (calendar popup, etc.)
// themeVars is a ComputedRef injected from SupabaseTable, so we use .value in script context
const colorScheme = computed(() => {
  const vars = themeVars?.value ?? themeVars
  return vars?.['--st-bg']?.startsWith('#1') ? 'dark' : 'light'
})

const showPicker = ref(false)
const pickerRef = ref(null)
const triggerRef = ref(null)

// What kind of picker to show
const pickerType = computed(() => {
  const t = props.columnType
  if (t === 'time' || t === 'timetz') return 'time'
  if (t === 'date') return 'date'
  return 'datetime-local' // timestamp, timestamptz, datetime
})

// Convert between the filter string value and the native input value
// Native datetime-local uses "YYYY-MM-DDTHH:MM", filter stores ISO-like strings
const nativeValue = computed(() => {
  if (!props.value) return ''
  if (pickerType.value === 'datetime-local') {
    // Normalize: replace space separator with T, strip seconds/tz for input compat
    return props.value.replace(' ', 'T').slice(0, 16)
  }
  return props.value.slice(0, pickerType.value === 'time' ? 5 : 10)
})

// Format the native input value back to a human-readable filter string
function nativeToFilter(nativeVal) {
  if (!nativeVal) return ''
  if (pickerType.value === 'datetime-local') {
    // "YYYY-MM-DDTHH:MM" → "YYYY-MM-DD HH:MM:00"
    return nativeVal.replace('T', ' ') + ':00'
  }
  return nativeVal
}

function onPickerChange(e) {
  emit('update', nativeToFilter(e.target.value))
  showPicker.value = false
}

function togglePicker() {
  showPicker.value = !showPicker.value
}

function closePicker() {
  showPicker.value = false
}

// Close picker on outside click
function onBackdropClick() {
  closePicker()
}
</script>

<template>
  <div class="relative flex items-center">
    <!-- Calendar icon button -->
    <button
      ref="triggerRef"
      class="flex items-center justify-center w-4 h-4 rounded transition-colors shrink-0"
      :style="{ color: showPicker ? 'var(--st-accent)' : 'var(--st-text-placeholder)' }"
      title="Pick date/time"
      @click.stop="togglePicker"
    >
      <!-- Calendar icon for date/datetime, clock for time -->
      <svg v-if="pickerType === 'time'" class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7-3.25a.75.75 0 00-1.5 0v3.5c0 .27.144.518.378.651l2.5 1.5a.75.75 0 10.744-1.302L8.5 7.742V4.75z"/>
      </svg>
      <svg v-else class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h-2a.25.25 0 00-.25.25V6h10.5V3.75a.25.25 0 00-.25-.25h-2V5a.75.75 0 01-1.5 0V3.5h-5V5a.75.75 0 01-1.5 0V3.5zM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5H2.5z"/>
      </svg>
    </button>

    <!-- Picker popup -->
    <Teleport to="body">
      <div v-if="showPicker" class="fixed inset-0 z-40" @click="onBackdropClick" />
      <div
        v-if="showPicker"
        ref="pickerRef"
        class="fixed z-50"
        :style="{
          ...themeVars,
          top: triggerRef ? (triggerRef.getBoundingClientRect().bottom + 6) + 'px' : '0',
          left: triggerRef ? triggerRef.getBoundingClientRect().left + 'px' : '0',
        }"
        @click.stop
      >
        <div
          class="rounded-lg shadow-xl p-3"
          :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
        >
          <input
            :type="pickerType"
            :value="nativeValue"
            class="outline-none rounded px-2 py-1.5 text-[13px]"
            :style="{
              backgroundColor: 'var(--st-bg-input)',
              border: '1px solid var(--st-border-secondary)',
              color: 'var(--st-text)',
              colorScheme: colorScheme,
            }"
            @change="onPickerChange"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
