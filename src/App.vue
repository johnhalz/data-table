<script setup>
import { ref } from 'vue'
import { DataTable } from './components/DataTable'
import { columns, employeeColumns } from './demo/demoColumns.js'
import { stores, employeesByStore } from './demo/demoData.js'

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

function handleRefresh() {}

function getSubTable(row) {
  if (!showChildTables.value) return null
  const employees = employeesByStore[row.id]
  if (!employees || employees.length === 0) return null
  return {
    columns: employeeColumns,
    rows: employees,
    tableName: `${row.name} — Employees`,
    editable: false,
    showToolbar: false,
    showPagination: false,
  }
}

const selectionActions = [
  { key: 'export-pdf', label: 'Export to PDF' },
  { key: 'send-email', label: 'Send via email' },
]

function handleSelectionAction(actionKey, selectedRows) {
  console.log(`Action: ${actionKey}`, selectedRows)
}

const toolbarActions = [
  { key: 'export-all-csv', label: 'Export all as CSV' },
  { key: 'export-all-json', label: 'Export all as JSON' },
  { divider: true },
  { key: 'open-docs', label: 'Open documentation' },
]

function handleToolbarAction(actionKey) {
  if (actionKey === 'export-all-csv') {
    const headers = Object.keys(rows.value[0] || {})
    const csv = [
      headers.join(','),
      ...rows.value.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stores.csv'
    a.click()
    URL.revokeObjectURL(url)
  } else if (actionKey === 'export-all-json') {
    const blob = new Blob([JSON.stringify(rows.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stores.json'
    a.click()
    URL.revokeObjectURL(url)
  } else if (actionKey === 'open-docs') {
    window.open('https://tanstack.com/table/v8', '_blank')
  }
}

const theme = ref('dark')
const accentColor = ref('#3ecf8e')
const editable = ref(true)
const isEmpty = ref(false)
const showChildTables = ref(true)
const stagedEdits = ref(false)

function handleCommitEdits({ inserts, updates, deletes }, done) {
  // Simulate an async API call so the user can see the loading spinner.
  setTimeout(() => {
    let nextId = rows.value.length > 0 ? Math.max(...rows.value.map(r => r.id)) : 0
    let next = [...rows.value]
    for (const row of inserts) {
      nextId += 1
      next.push({ ...row, id: nextId })
    }
    if (updates.length > 0) {
      next = next.map(r => {
        const match = updates.find(u => String(u.id) === String(r.id))
        return match ? { ...r, ...match.changes } : r
      })
    }
    if (deletes.length > 0) {
      const idSet = new Set(deletes.map(String))
      next = next.filter(r => !idSet.has(String(r.id)))
    }
    rows.value = next
    done(true)
  }, 600)
}
const cellButtonVisibility = ref('hover')
const cellButtonOptions = [
  { value: 'hover', label: 'On hover' },
  { value: 'always', label: 'Always' },
  { value: 'select', label: 'On select' },
]
const showOptionsMenu = ref(false)
const showThemeMenu = ref(false)

const presetColors = [
  { label: 'Green', value: '#3ecf8e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Red', value: '#ef4444' },
]

const navBorder = (dark) => dark ? '1px solid #333' : '1px solid #e4e4e7'
const navColor = (dark) => dark ? '#a1a1aa' : '#52525b'
const btnBorder = (dark) => dark ? '1px solid #444' : '1px solid #d4d4d8'
const btnColor = (dark) => dark ? '#e5e5e5' : '#18181b'
const btnBg = (dark) => dark ? '#2a2a2a' : '#ffffff'
const menuBg = (dark) => dark ? '#2a2a2a' : '#ffffff'
const menuBorder = (dark) => dark ? '#444' : '#d4d4d8'
const menuHoverBg = (dark) => dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
const dividerColor = (dark) => dark ? '#333' : '#e4e4e7'
</script>

<template>
  <div
    class="h-screen flex flex-col transition-colors"
    :style="{ backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f4f4f5' }"
    @click="showOptionsMenu = false; showThemeMenu = false"
  >
    <!-- Top nav bar -->
    <nav
      class="px-4 py-2 flex items-center gap-3 text-sm shrink-0"
      :style="{
        borderBottom: navBorder(theme === 'dark'),
        color: navColor(theme === 'dark'),
      }"
    >
      <span :style="{ color: theme === 'dark' ? '#fff' : '#18181b', fontWeight: 600 }">Table Editor</span>
      <span :style="{ color: theme === 'dark' ? '#333' : '#d4d4d8' }">/</span>
      <span>stores</span>

      <div class="flex-1"></div>

      <!-- Options dropdown -->
      <div class="relative" @click.stop>
        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors"
          :style="{
            border: btnBorder(theme === 'dark'),
            color: btnColor(theme === 'dark'),
            backgroundColor: btnBg(theme === 'dark'),
          }"
          @click="showOptionsMenu = !showOptionsMenu"
        >
          Options
          <svg class="w-3 h-3 opacity-60" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </button>

        <div
          v-if="showOptionsMenu"
          class="absolute right-0 top-full mt-1 w-52 rounded-lg shadow-xl z-50 py-1 text-xs"
          :style="{
            backgroundColor: menuBg(theme === 'dark'),
            border: '1px solid ' + menuBorder(theme === 'dark'),
          }"
        >
          <div class="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-40">Display</div>

          <!-- Editable toggle -->
          <div
            class="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-sm mx-1"
            :style="{ color: btnColor(theme === 'dark') }"
            @mouseenter="$event.currentTarget.style.backgroundColor = menuHoverBg(theme === 'dark')"
            @mouseleave="$event.currentTarget.style.backgroundColor = 'transparent'"
            @click="editable = !editable"
          >
            <span>Editing</span>
            <div
              class="relative w-8 h-4 rounded-full transition-colors duration-200 shrink-0"
              :style="{ backgroundColor: editable ? accentColor : (theme === 'dark' ? '#444' : '#d4d4d8') }"
            >
              <div
                class="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
                :style="{ transform: editable ? 'translateX(18px)' : 'translateX(2px)' }"
              />
            </div>
          </div>

          <!-- Empty toggle -->
          <div
            class="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-sm mx-1"
            :style="{ color: btnColor(theme === 'dark') }"
            @mouseenter="$event.currentTarget.style.backgroundColor = menuHoverBg(theme === 'dark')"
            @mouseleave="$event.currentTarget.style.backgroundColor = 'transparent'"
            @click="isEmpty = !isEmpty"
          >
            <span>Empty table</span>
            <div
              class="relative w-8 h-4 rounded-full transition-colors duration-200 shrink-0"
              :style="{ backgroundColor: isEmpty ? accentColor : (theme === 'dark' ? '#444' : '#d4d4d8') }"
            >
              <div
                class="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
                :style="{ transform: isEmpty ? 'translateX(18px)' : 'translateX(2px)' }"
              />
            </div>
          </div>

          <!-- Child tables toggle -->
          <div
            class="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-sm mx-1"
            :style="{ color: btnColor(theme === 'dark') }"
            @mouseenter="$event.currentTarget.style.backgroundColor = menuHoverBg(theme === 'dark')"
            @mouseleave="$event.currentTarget.style.backgroundColor = 'transparent'"
            @click="showChildTables = !showChildTables"
          >
            <span>Child tables</span>
            <div
              class="relative w-8 h-4 rounded-full transition-colors duration-200 shrink-0"
              :style="{ backgroundColor: showChildTables ? accentColor : (theme === 'dark' ? '#444' : '#d4d4d8') }"
            >
              <div
                class="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
                :style="{ transform: showChildTables ? 'translateX(18px)' : 'translateX(2px)' }"
              />
            </div>
          </div>

          <!-- Staged edits toggle -->
          <div
            class="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-sm mx-1"
            :style="{ color: btnColor(theme === 'dark') }"
            @mouseenter="$event.currentTarget.style.backgroundColor = menuHoverBg(theme === 'dark')"
            @mouseleave="$event.currentTarget.style.backgroundColor = 'transparent'"
            @click="stagedEdits = !stagedEdits"
          >
            <span>Staged edits</span>
            <div
              class="relative w-8 h-4 rounded-full transition-colors duration-200 shrink-0"
              :style="{ backgroundColor: stagedEdits ? accentColor : (theme === 'dark' ? '#444' : '#d4d4d8') }"
            >
              <div
                class="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
                :style="{ transform: stagedEdits ? 'translateX(18px)' : 'translateX(2px)' }"
              />
            </div>
          </div>

          <!-- Cell buttons visibility -->
          <div class="my-1 mx-3" :style="{ borderTop: '1px solid ' + dividerColor(theme === 'dark') }" />
          <div class="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-40">Cell buttons</div>
          <button
            v-for="opt in cellButtonOptions"
            :key="opt.value"
            class="flex items-center justify-between w-full px-3 py-2 rounded-sm"
            :style="{
              color: btnColor(theme === 'dark'),
              backgroundColor: cellButtonVisibility === opt.value ? menuHoverBg(theme === 'dark') : 'transparent',
              width: 'calc(100% - 8px)',
              marginLeft: '4px',
            }"
            @mouseenter="$event.currentTarget.style.backgroundColor = menuHoverBg(theme === 'dark')"
            @mouseleave="$event.currentTarget.style.backgroundColor = cellButtonVisibility === opt.value ? menuHoverBg(theme === 'dark') : 'transparent'"
            @click="cellButtonVisibility = opt.value"
          >
            {{ opt.label }}
            <svg v-if="cellButtonVisibility === opt.value" class="w-3 h-3 opacity-60" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Theme + color dropdown -->
      <div class="relative" @click.stop>
        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium"
          :style="{
            border: btnBorder(theme === 'dark'),
            color: btnColor(theme === 'dark'),
            backgroundColor: btnBg(theme === 'dark'),
          }"
          @click="showThemeMenu = !showThemeMenu"
        >
          <!-- Color swatch -->
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: accentColor }" />
          {{ theme === 'dark' ? 'Dark' : 'Light' }}
          <svg class="w-3 h-3 opacity-60" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </button>

        <div
          v-if="showThemeMenu"
          class="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl z-50 py-1 text-xs"
          :style="{
            backgroundColor: menuBg(theme === 'dark'),
            border: '1px solid ' + menuBorder(theme === 'dark'),
          }"
        >
          <div class="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-40">Theme</div>

          <button
            v-for="t in ['dark', 'light']"
            :key="t"
            class="flex items-center justify-between w-full px-3 py-2 rounded-sm mx-auto"
            :style="{
              color: btnColor(theme === 'dark'),
              backgroundColor: theme === t ? menuHoverBg(theme === 'dark') : 'transparent',
              width: 'calc(100% - 8px)',
              marginLeft: '4px',
            }"
            @mouseenter="$event.currentTarget.style.backgroundColor = menuHoverBg(theme === 'dark')"
            @mouseleave="$event.currentTarget.style.backgroundColor = theme === t ? menuHoverBg(theme === 'dark') : 'transparent'"
            @click="theme = t"
          >
            {{ t === 'dark' ? 'Dark' : 'Light' }}
            <svg v-if="theme === t" class="w-3 h-3 opacity-60" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
            </svg>
          </button>

          <div class="my-1 mx-3" :style="{ borderTop: '1px solid ' + dividerColor(theme === 'dark') }" />
          <div class="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-40">Accent</div>

          <div class="flex flex-wrap gap-2 px-3 pb-2.5 pt-1">
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
        </div>
      </div>
    </nav>

    <!-- The component -->
    <DataTable
      :columns="columns"
      :rows="isEmpty ? [] : rows"
      table-name="stores"
      :theme="theme"
      :accent-color="accentColor"
      :editable="editable"
      :staged-edits="stagedEdits"
      :default-column-visibility="{ coordinate_system_type: false }"
      :selection-actions="selectionActions"
      :toolbar-actions="toolbarActions"
      :cell-button-visibility="cellButtonVisibility"
      :get-sub-table="getSubTable"
      :sub-table-columns="employeeColumns"
      @insert-row="handleInsert"
      @update-row="handleUpdate"
      @delete-rows="handleDelete"
      @commit-edits="handleCommitEdits"
      @refresh="handleRefresh"
      @selection-action="handleSelectionAction"
      @toolbar-action="handleToolbarAction"
    />

  </div>
</template>
