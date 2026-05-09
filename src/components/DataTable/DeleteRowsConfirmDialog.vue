<script setup>
import { inject } from 'vue'

const themeVars = inject('themeVars', {})

defineProps({
  modelValue: { type: Boolean, default: false },
  rowCount: { type: Number, required: true },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

function close() {
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center"
      :style="{ ...themeVars }"
    >
      <div
        class="fixed inset-0"
        :style="{ backgroundColor: 'var(--st-bg-overlay)' }"
        @click="close"
      />
      <div
        class="relative rounded-lg shadow-2xl w-96 text-[13px]"
        :style="{ ...themeVars, backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
      >
        <div class="px-5 pt-5 pb-4">
          <h3 class="font-medium text-sm mb-2" :style="{ color: 'var(--st-text)' }">Confirm deletion</h3>
          <p :style="{ color: 'var(--st-text-secondary)' }">
            Are you sure you want to delete {{ rowCount }} row{{ rowCount > 1 ? 's' : '' }}? This action cannot be undone.
          </p>
        </div>
        <div
          class="px-5 py-3 flex items-center justify-end gap-2"
          :style="{ borderTop: '1px solid var(--st-border-secondary)' }"
        >
          <button
            type="button"
            class="px-3 py-1.5 rounded text-[13px] transition-colors"
            :style="{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }"
            @click="close"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
            @click="confirm"
          >
            Delete {{ rowCount }} row{{ rowCount > 1 ? 's' : '' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
