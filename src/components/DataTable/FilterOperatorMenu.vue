<script setup>
import { FILTER_OPERATORS } from './types.js'

const emit = defineEmits(['select', 'close'])

function selectOperator(op) {
  emit('select', op.value)
}
</script>

<template>
  <div
    class="w-52 rounded shadow-xl z-50 py-1 text-[13px] max-h-60 overflow-auto"
    :style="{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }"
  >
    <template v-for="group in FILTER_OPERATORS" :key="group.group">
      <div class="px-3 py-1 text-xs font-medium uppercase tracking-wide" :style="{ color: 'var(--st-text-placeholder)' }">
        {{ group.group }}
      </div>
      <button
        v-for="op in group.operators"
        :key="op.value"
        class="w-full text-left px-3 py-1.5 flex items-center justify-between hover-menu-item"
        :style="{ color: 'var(--st-text)' }"
        @click="selectOperator(op)"
      >
        <span>{{ op.label }}</span>
        <span class="font-mono text-xs" :style="{ color: 'var(--st-text-placeholder)' }">{{ op.value }}</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.hover-menu-item:hover {
  background-color: var(--st-bg-menu-hover);
}
</style>
