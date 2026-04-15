<script setup>
import { ref } from 'vue'
import { SupabaseTable } from './components/SupabaseTable'
import { columns } from './demo/demoColumns.js'
import { stores } from './demo/demoData.js'

const rows = ref([...stores])
function handleInsert(payload) {
  const newId = Math.max(...rows.value.map(r => r.id)) + 1
  rows.value = [...rows.value, { ...payload, id: newId }]
}

function handleUpdate({ id, changes }) {
  rows.value = rows.value.map(r => r.id === Number(id) ? { ...r, ...changes } : r)
}

function handleDelete(ids) {
  const idSet = new Set(ids.map(Number))
  rows.value = rows.value.filter(r => !idSet.has(r.id))
}

function handleRefresh() {
}

const selectionActions = [
  { key: 'export-pdf', label: 'Export to PDF' },
  { key: 'send-email', label: 'Send via email' },
]

function handleSelectionAction(actionKey, selectedRows) {
  console.log(`Action: ${actionKey}`, selectedRows)
}

const theme = ref('dark')
const accentColor = ref('#3ecf8e')

const presetColors = [
  { label: 'Green', value: '#3ecf8e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Red', value: '#ef4444' },
]
</script>

<template>
  <div
    class="h-screen flex flex-col transition-colors"
    :style="{ backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f4f4f5' }"
  >
    <!-- Top nav bar -->
    <nav
      class="px-4 py-2 flex items-center gap-3 text-sm shrink-0"
      :style="{
        borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #e4e4e7',
        color: theme === 'dark' ? '#a1a1aa' : '#52525b',
      }"
    >
      <span :style="{ color: theme === 'dark' ? '#fff' : '#18181b', fontWeight: 600 }">Table Editor</span>
      <span :style="{ color: theme === 'dark' ? '#333' : '#d4d4d8' }">/</span>
      <span>stores</span>

      <div class="flex-1"></div>

      <!-- Theme toggle -->
      <button
        class="px-2.5 py-1 rounded text-xs font-medium transition-colors"
        :style="{
          border: theme === 'dark' ? '1px solid #444' : '1px solid #d4d4d8',
          color: theme === 'dark' ? '#e5e5e5' : '#18181b',
          backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
        }"
        @click="theme = theme === 'dark' ? 'light' : 'dark'"
      >
        {{ theme === 'dark' ? '☀ Light' : '● Dark' }}
      </button>

      <!-- Accent color presets -->
      <div class="flex items-center gap-1.5">
        <button
          v-for="preset in presetColors"
          :key="preset.value"
          class="w-5 h-5 rounded-full transition-transform"
          :style="{
            backgroundColor: preset.value,
            outline: accentColor === preset.value ? '2px solid ' + preset.value : 'none',
            outlineOffset: '2px',
            transform: accentColor === preset.value ? 'scale(1.15)' : 'scale(1)',
          }"
          :title="preset.label"
          @click="accentColor = preset.value"
        />
      </div>
    </nav>

    <!-- The component -->
    <SupabaseTable
      :columns="columns"
      :rows="rows"
      table-name="stores"
      :theme="theme"
      :accent-color="accentColor"
      :default-column-visibility="{ coordinate_system_type: false }"
      :selection-actions="selectionActions"
      @insert-row="handleInsert"
      @update-row="handleUpdate"
      @delete-rows="handleDelete"
      @refresh="handleRefresh"
      @selection-action="handleSelectionAction"
    />

  </div>
</template>
