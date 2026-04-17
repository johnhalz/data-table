# DataTable

A feature-rich Vue 3 data table component built on [TanStack Table v8](https://tanstack.com/table/v8) with Tailwind CSS dark theme styling.

## Quick Start

```bash
npm install
npm run dev
```

## Installation

**Dependencies:**

- Vue 3.5+
- @tanstack/vue-table ^8.21
- @vueuse/core ^14.2
- Tailwind CSS v4

## Basic Usage

```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from './components/DataTable'
import { createColumnHelper } from '@tanstack/vue-table'

const col = createColumnHelper()

const columns = [
  col.accessor('id', {
    header: 'id',
    meta: { type: 'int8', isPrimaryKey: true, isNullable: false },
    size: 80,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('name', {
    header: 'name',
    meta: { type: 'varchar', isNullable: false },
    size: 200,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('is_active', {
    header: 'is_active',
    meta: { type: 'boolean', isNullable: false },
    size: 110,
    enableSorting: true,
    enableColumnFilter: true,
  }),
]

const rows = ref([
  { id: 1, name: 'Acme Corp', is_active: true },
  { id: 2, name: 'Globex', is_active: false },
])
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    table-name="companies"
    @insert-row="handleInsert"
    @update-row="handleUpdate"
    @delete-rows="handleDelete"
    @refresh="handleRefresh"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Array` | **required** | TanStack column definitions with `meta` for type info |
| `rows` | `Array` | **required** | Array of row data objects |
| `tableName` | `String` | `'table'` | Display name shown in the edit panel header |
| `loading` | `Boolean` | `false` | Spins the refresh button icon and disables it while true |
| `error` | `String` | `null` | Displays a dismissible error banner above the grid. Clears automatically when the prop value changes |
| `defaultColumnVisibility` | `Object` | `{}` | Initial column visibility. Keys are column IDs, values are booleans. `{ col_name: false }` hides `col_name` on load |
| `showDataTypes` | `Boolean` | `true` | Show data type labels (e.g. `varchar`, `int8`) in column headers and panels |
| `editable` | `Boolean \| Object` | `true` | `true`/`false` enables or disables all mutations. Pass `{ insert, update, delete }` booleans to control each operation independently |
| `selectionActions` | `Array` | `[]` | Custom actions shown in the Actions dropdown when rows are selected. Each item: `{ key: string, label: string }` |
| `showRowBorders` | `Boolean` | `true` | Show horizontal borders between rows |
| `showColumnBorders` | `Boolean` | `true` | Show vertical borders between columns |
| `totalCount` | `Number` | `null` | Total row count for server-side pagination. When set, the table switches to manual pagination mode and emits `page-change` instead of paginating client-side |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `insert-row` | `Object` (row data) | User submitted the insert form |
| `update-row` | `{ id, changes }` | User edited a cell or saved the edit panel |
| `delete-rows` | `Array<string>` (row IDs) | User confirmed deletion of selected rows |
| `refresh` | — | User clicked the refresh button |
| `selection-action` | `(actionKey: string, rows: Object[])` | User triggered a custom selection action |
| `page-change` | `{ pageIndex: number, pageSize: number }` | Page navigation while `totalCount` is set (server-side pagination mode) |
| `column-resize` | `Object<colId, number>` | User finished resizing a column; payload is the full column sizing map |

## Column Definition

Columns use TanStack's `createColumnHelper()`. The `meta` object controls component behavior:

```js
col.accessor('field_name', {
  header: 'Display Name',
  meta: {
    type: 'varchar',        // Data type: 'int8', 'int4', 'float8', 'varchar', 'text', 'boolean'
    isPrimaryKey: false,    // Disables editing in update mode
    isNullable: true,       // Separates required vs. optional in the edit panel
  },
  size: 180,                // Column width in pixels
  enableSorting: true,
  enableColumnFilter: true,
})
```

### Supported `meta.type` Values

| Type | Behavior |
|------|----------|
| `int8`, `int4`, `float8` | Values converted to `Number` on save |
| `varchar`, `text` | Standard text input |
| `boolean` | Renders as a toggle switch |
| Any other string | Treated as text |

## Features

### Toolbar
- **Filter bar** — Click to add column filters with operator support (equals, like, greater than, etc.)
- **Sort** — Multi-column sort with drag-and-drop reordering, ASC/DESC toggle
- **Columns** — Toggle column visibility with Show All / Default reset
- **Insert** — Split button with dropdown for insert row, insert column, import CSV
- **Refresh** — Emits `refresh` event for parent to reload data

### Grid
- **Sticky columns** — Row numbers and checkboxes stay pinned on horizontal scroll
- **Column resizing** — Drag column borders to resize
- **Inline editing** — Double-click a cell to edit (when `editable: true`)
- **Boolean toggles** — Click to flip boolean values
- **Row selection** — Click checkboxes, Shift+click for range selection
- **Context menu** — Right-click for copy, filter, edit, delete actions

### Selection Toolbar
Appears when rows are selected:
- **Delete...** — Opens confirmation dialog before emitting `delete-rows`
- **Actions** — Dropdown with Copy as CSV/SQL/JSON plus any custom `selectionActions`
- **Clear selection** / **Select all rows in table**

### Row Edit Panel
Slide-in panel from the right for inserting or updating rows:
- Required and optional field sections based on `isNullable`
- Primary key fields are read-only in update mode
- Save with `Cmd+Enter`, close with `Escape`

### Pagination
- Page navigation with direct page number input
- Configurable rows per page (100, 500, 1000)
- Total record count display

## Examples

### Read-Only Table

```vue
<DataTable
  :columns="columns"
  :rows="rows"
  :editable="false"
/>
```

### Minimal Chrome

```vue
<DataTable
  :columns="columns"
  :rows="rows"
  :show-data-types="false"
  :show-row-borders="false"
  :show-column-borders="false"
/>
```

### Custom Selection Actions

```vue
<script setup>
const actions = [
  { key: 'export-pdf', label: 'Export to PDF' },
  { key: 'send-email', label: 'Send via email' },
]

function onAction(actionKey, selectedRows) {
  if (actionKey === 'export-pdf') {
    generatePdf(selectedRows)
  }
}
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    :selection-actions="actions"
    @selection-action="onAction"
  />
</template>
```

### Default Hidden Columns

```vue
<DataTable
  :columns="columns"
  :rows="rows"
  :default-column-visibility="{ internal_id: false, metadata: false }"
/>
```

### Granular Permissions

```vue
<!-- Insert-only: allow inserts but block edits and deletes -->
<DataTable
  :columns="columns"
  :rows="rows"
  :editable="{ insert: true, update: false, delete: false }"
  @insert-row="handleInsert"
/>
```

### Error Banner

```vue
<script setup>
const error = ref(null)

async function handleRefresh() {
  try {
    rows.value = await fetchRows()
    error.value = null
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    :loading="isLoading"
    :error="error"
    @refresh="handleRefresh"
  />
</template>
```

### Server-Side Pagination

```vue
<script setup>
const rows = ref([])
const totalCount = ref(0)
const isLoading = ref(false)

async function loadPage({ pageIndex, pageSize }) {
  isLoading.value = true
  const result = await api.getRows({ page: pageIndex, limit: pageSize })
  rows.value = result.data
  totalCount.value = result.total
  isLoading.value = false
}

onMounted(() => loadPage({ pageIndex: 0, pageSize: 100 }))
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    :total-count="totalCount"
    :loading="isLoading"
    @page-change="loadPage"
    @refresh="() => loadPage({ pageIndex: 0, pageSize: 100 })"
  />
</template>
```

### Persisting Column Widths

```vue
<DataTable
  :columns="columns"
  :rows="rows"
  @column-resize="widths => localStorage.setItem('col-widths', JSON.stringify(widths))"
/>
```

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **TanStack Table v8** — Headless table engine (sorting, filtering, pagination, column visibility, row selection, column resizing)
- **Tailwind CSS v4** — Dark theme styling
- **VueUse** — `onClickOutside` for dropdown/menu dismissal
- **Vite** — Build tooling
