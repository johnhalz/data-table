# DataTable

A feature-rich Vue 3 data table component built on [TanStack Table v8](https://tanstack.com/table/v8) with Tailwind CSS dark theme styling.

## Quick Start

```bash
npm install
npm run dev
```

## Installation

Install the package from npm:

```bash
npm install @johnhalazonetis/data-table
```

**Peer dependencies** (install alongside if they are not already in your app):

- Vue 3.5+
- `@tanstack/vue-table` ^8.21
- `@tanstack/vue-virtual` ^3.13
- `@vueuse/core` ^14.2
- Tailwind CSS v4

## Basic Usage

```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from '@johnhalazonetis/data-table'
import '@johnhalazonetis/data-table/style.css'
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

## MiniTable

Use **`MiniTable`** for a **narrow, single-column** list with the same **CSS theme tokens** (`theme`, `accentColor`, `fontFamily`) and many of the same behaviors as **`DataTable`**, without the full toolbar (no multi-column sort panel, column picker, or insert UI).

### Import

```js
import { MiniTable, MINI_TABLE_PAGE_SIZE } from '@johnhalazonetis/data-table'
import '@johnhalazonetis/data-table/style.css'
```

`MINI_TABLE_PAGE_SIZE` is **`100`** (exported from `types.js`) — use it as the conventional batch size when implementing **infinite scroll** on the server.

### Minimal example

```vue
<script setup>
import { ref } from 'vue'
import { MiniTable, MINI_TABLE_PAGE_SIZE } from '@johnhalazonetis/data-table'
import { createColumnHelper } from '@tanstack/vue-table'

const col = createColumnHelper()
const column = col.accessor('name', {
  header: 'Name',
  meta: { type: 'varchar', isNullable: false },
  enableSorting: true,
})

const rows = ref([])
const hasMore = ref(true)
const loading = ref(false)

async function fetchNextBatch() {
  loading.value = true
  const chunk = await api.fetchNames({ limit: MINI_TABLE_PAGE_SIZE, offset: rows.value.length })
  rows.value = rows.value.concat(chunk)
  hasMore.value = chunk.length === MINI_TABLE_PAGE_SIZE
  loading.value = false
}
</script>

<template>
  <MiniTable
    :column="column"
    :rows="rows"
    :has-more="hasMore"
    :loading="loading"
    count-label-plural="names"
    @load-more="fetchNextBatch"
    @refresh="fetchNextBatch"
  />
</template>
```

### Layout and visuals

- **Columns**: Exactly **one** leaf column via prop **`column`**. Header sorting uses the column chevron (TanStack sort state); implement **`sort-change`** / manual sorting on the parent when using server-side ordering.
- **Chrome**: **Checkbox** column + **data** column only (no **`#`** row-number column). The sticky checkbox column uses a **light drop shadow** toward the content area — there is **no hard vertical rule** between checkbox and data so the sidebar stays visually quiet next to a full **`DataTable`**.
- **Cells**: Body cells use the same **`TableCell`** component as **`DataTable`**. Column **`meta`** supports the same presentation hooks where applicable (e.g. **`secondaryText`**, **`badge`**, **`progressBar`**, **`cellButtons`**, **`textColor`**, **`suffixIcon`**) with the same caveats as in **Additional column `meta`** above.
- **Resize**: Column resize handles are **hidden** in MiniTable (width follows the viewport).
- **Row hover / selection**: Row background uses **`--st-bg-row-hover`** on hover and the same selected / highlighted (**`highlightedRowId`**) styling as the main grid.

### Toolbar and filters

- Single **search-style “contains”** filter on the visible column (case-insensitive substring, operator **`~~*`**) plus **Refresh**. This row stays visible even when rows are selected (selection UI moves to the footer).
- Bind **`v-model:column-filters`** to sync with the parent (same pattern as **`DataTable`** for server-driven data). Context-menu filters can add other operators (e.g. **`=`**); the search field stays in sync.

### Footer

- **Idle**: Total count — **`totalCount`** if set, otherwise **`rows.length`** — formatted with **`countLabelSingular`** / **`countLabelPlural`**. Footer **min-height** matches **`TablePagination`** so strips align when MiniTable sits beside a full grid.
- **Selection**: **`SelectionToolbar`** runs in **footer** layout: **`selected / eligible`** summary (uses **`totalFilteredCount`** / **`totalCount`** like **`DataTable`**), then **Delete…**, **Actions**, **Clear**, **Select All** as applicable. Controls may wrap on very narrow widths.
- No client-side paging: all loaded **`rows`** are rendered in the scroll area.

### Infinite scroll and selection

- Emit **`load-more`** when the sentinel nears the viewport and **`hasMore && !loading`**. Append rows in the parent.
- **`selection-change`** emits the **merged** list of selected row IDs (including **`additionalSelectedRowIds`**).
- **`v-model:additional-selected-row-ids`**: IDs selected but not present in the current **`rows`** slice (e.g. after **Select all matching** on the server).
- **`select-all-matching`**: Fires when **Select All** must cover unloaded rows; merge server IDs into **`additional-selected-row-ids`**.
- **`inferSelectAllMatching`** (default **`true`**): If **`totalFilteredCount`** or **`totalCount`** is greater than **`rows.length`**, **Select All** uses matching semantics unless you override with **`enableSelectAllMatching`** / **`inferSelectAllMatching`**.

### `editable`

Same shape as **`DataTable`** (`boolean` or `{ insert, update, delete }`), but **`insert` is ignored** — there is no insert UI. **`update`** / **`delete`** gate inline edit, row edit panel, and bulk delete.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `column` | Column def | **required** | Single TanStack column definition |
| `rows` | `Array` | **required** | Loaded rows; parent appends on **`load-more`** |
| `tableName` | `string` | `'table'` | Edit panel title |
| `loading` | `boolean` | `false` | Disables refresh spinners / infinite-scroll guard |
| `error` | `string \| null` | `null` | Dismissible error banner (same behavior as **`DataTable`**) |
| `editable` | `boolean \| object` | `false` | **`insert`** ignored |
| `selectionActions` | `array` | `[]` | Bulk actions (selection toolbar **Actions** menu) |
| `contextMenuActions` | `array` | `[]` | Extra context-menu entries (+ bulk **Actions** when multi-select) |
| `cellButtonVisibility` | `string` | `'hover'` | **`hover`** \| **`always`** \| **`select`** for **`meta.cellButtons`** |
| `showDataTypes` | `boolean` | `false` | Type badges in header |
| `showRowBorders` | `boolean` | `true` | Horizontal row dividers |
| `showColumnBorders` | `boolean` | `true` | Vertical borders between **data** columns (only one data column; affects header/cell rules) |
| `theme` | `string` | `'dark'` | **`dark`** \| **`light`** |
| `accentColor` | `string` | `'#3ecf8e'` | Accent color |
| `fontFamily` | `string \| null` | `null` | Optional font stack |
| `emptyTitle` | `string` | `'No rows found'` | Empty state heading |
| `emptyMessage` | `string` | `'Nothing to show yet.'` | Empty state body |
| `countLabelSingular` | `string` | `'record'` | Footer / selection labels |
| `countLabelPlural` | `string` | `'records'` | Footer / selection labels |
| `totalCount` | `number \| null` | `null` | Total rows (footer + selection denominator) |
| `totalFilteredCount` | `number \| null` | `null` | Filtered total for **Select all N matching** |
| `hasMore` | `boolean` | `false` | Enables **`load-more`** sentinel |
| `columnFilters` | `array \| null` | `null` | **`v-model:column-filters`** |
| `highlightedRowId` | `string \| number \| null` | `null` | Keyboard / programmatic row highlight |
| `enableSelectAll` | `boolean` | `true` | Show **Select all N** when eligible |
| `enableSelectAllMatching` | `boolean` | `false` | Force matching select-all path when set |
| `inferSelectAllMatching` | `boolean` | `true` | Auto matching semantics when totals exceed loaded rows |
| `additionalSelectedRowIds` | `array` | `[]` | **`v-model:additional-selected-row-ids`** |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `refresh` | — | Refresh clicked |
| `load-more` | — | Infinite scroll: load next batch |
| `sort-change` | — | Sort state changed (manual / server sort) |
| `update:column-filters` | `Array` | Filters changed |
| `selection-change` | `ids: string[]` | Full selection |
| `selection-action` | `(actionKey, rows, mergedIds)` | Same contract as **`DataTable`** |
| `select-all-matching` | — | Parent selects all matching IDs on the server |
| `update:additionalSelectedRowIds` | `Array` | Sync extra selected IDs |
| `row-action` | `(key, row)` | Per-row action from context menu |
| `delete-rows` | `ids[]` | Confirmed deletion |
| `update-row` | `{ id, changes }` | Cell / panel save |

### Expose

Template ref: **`openDeleteConfirmation(ids)`** — same as **`DataTable`**.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Array` | **required** | TanStack column definitions with `meta` for type info |
| `rows` | `Array` | **required** | Array of row data objects |
| `tableName` | `String` | `'table'` | Display name shown in the edit panel header |
| `loading` | `Boolean` | `false` | Spins the refresh button icon and disables it while true |
| `error` | `String` | `null` | Displays a dismissible error banner above the grid. Clears automatically when the prop value changes |
| `defaultColumnVisibility` | `Object` | `{}` | Initial column visibility. Keys are column IDs, values are booleans. `{ col_name: false }` hides `col_name` on load |
| `controlledColumnVisibility` | `Object` | `null` | When set, column visibility is driven from the parent (merged with internal state updates) |
| `showDataTypes` | `Boolean` | `true` | Show data type labels (e.g. `varchar`, `int8`) in column headers and panels |
| `editable` | `Boolean \| Object` | `true` | `true`/`false` enables or disables all mutations. Pass `{ insert, update, delete }` booleans to control each operation independently |
| `selectionActions` | `Array` | `[]` | Custom actions shown in the Actions dropdown when rows are selected. Each item: `{ key: string, label: string }` |
| `enableSelectAll` | `Boolean` | `true` | When `true`, shows **Select all N …** next to **Clear selection** (selects every filtered row across pages). The header checkbox only toggles the current page |
| `toolbarActions` | `Array` | `[]` | Custom dropdown next to Sort. Items: `{ key, label, icon? (SVG HTML), disabled?, divider? }`. Emits `toolbar-action` with `key`. Hidden when empty |
| `toolbarActionsLabel` | `String` | `'Actions'` | Label on the `toolbarActions` trigger |
| `defaultInsertLabel` | `String` | `null` | When `editable.insert` is true, sets the primary insert button label (e.g. `Import…`). Without `insertActions`, clicking fires `insert-row` only. With `insertActions`, the chevron opens the custom menu |
| `insertActions` | `Array` | `[]` | Extra insert/import menu entries: `{ key, label, icon? (SVG HTML) }`. Emits `insert-action` with `key`. See **Insert button** under Features |
| `showRowBorders` | `Boolean` | `true` | Show horizontal borders between rows |
| `showColumnBorders` | `Boolean` | `true` | Show vertical borders between columns |
| `cellButtonVisibility` | `String` | `'hover'` | `'hover'` \| `'always'` \| `'select'` — when to show `meta.cellButtons` |
| `cellOverflow` | `String` | `'truncate'` | Default text overflow for cells: `'truncate'` or `'wrap'`. Per-column `meta.overflow` overrides |
| `countLabelSingular` | `String` | `'record'` | Singular noun after the total in the footer (and in **Select all N …**): e.g. `ligand` → `1 ligand` |
| `countLabelPlural` | `String` | `'records'` | Plural form: e.g. `ligands` → `42 ligands` |
| `theme` | `String` | `'dark'` | `'dark'` or `'light'` |
| `accentColor` | `String` | `'#3ecf8e'` | Primary accent color (buttons, selections, progress bars) |
| `fontFamily` | `String` | `null` | Optional CSS `font-family` value; cascades into nested sub-tables |
| `showToolbar` | `Boolean` | `true` | Show filter/sort/columns/insert toolbar (and selection toolbar when rows are selected) |
| `showPagination` | `Boolean` | `true` | Show footer pagination bar |
| `emptyTitle` | `String` | `'No rows found'` | Empty-state heading |
| `emptyMessage` | `String` | `'Get started by inserting a new row.'` | Empty-state body |
| `totalCount` | `Number` | `null` | Total row count for server-side pagination. When set, switches to manual pagination and emits `page-change` |
| `hasRandomAccess` | `Boolean` | `true` | When `false`, hides the page number input in the footer (prev/next only) |
| `columnFilters` | `Array` | `null` | Optional `v-model:column-filters` — observe/sync filter state from the parent |
| `controlledSorting` | `Array` | `null` | External sort state for nested/controlled tables |
| `controlledColumnFilters` | `Array` | `null` | External filter state for nested tables |
| `getSubTable` | `Function` | `null` | `(row) => ({ columns, rows, ... }) \| null` — expandable rows with nested `DataTable` |
| `subTableColumns` | `Array` | `null` | Shared column defs for sub-tables when using expansion |
| `expandedRows` | `Object` | `null` | `v-model:expanded-rows` — controlled expanded row IDs |
| `stagedEdits` | `Boolean` | `false` | Queue mutations locally; footer shows **Commit** / **Clear edits**; emit `commit-edits` instead of immediate `insert-row` / `update-row` / `delete-rows` |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `insert-row` | `Object` (row data) | User submitted the insert form, or primary insert action when `defaultInsertLabel` is set without custom `insertActions` |
| `insert-action` | `actionKey: string` | User chose an item from `insertActions` (chevron menu or **Insert ▼** when no default label) |
| `update-row` | `{ id, changes }` | User edited a cell or saved the edit panel |
| `delete-rows` | `Array<string>` (row IDs) | User confirmed deletion of selected rows |
| `refresh` | — | User clicked the refresh button |
| `selection-action` | `(actionKey: string, rows: Object[])` | User triggered a custom selection action |
| `toolbar-action` | `actionKey: string` | User picked an item from `toolbarActions` |
| `page-change` | `{ pageIndex: number, pageSize: number }` | Page navigation while `totalCount` is set (server-side pagination) |
| `column-resize` | `Object<colId, number>` | User finished resizing a column; payload is the full column sizing map |
| `commit-edits` | `({ inserts, updates, deletes }, done)` | Staged-edits mode: parent must call `done(true)` or `done(false)` |
| `discard-edits` | — | User cleared staged edits after confirmation |
| `update:column-filters` | `Array` | Column filter state changed (when `columnFilters` is bound) |
| `update:expanded-rows` | `Object` | Expanded row map changed (when controlled) |

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

### Additional column `meta` (presentation & cells)

| Property | Type | Description |
|----------|------|-------------|
| `overflow` | `'truncate' \| 'wrap'` | Text overflow for this column. Overrides the table-level `cellOverflow` prop. |
| `multiline` | `Boolean` | **Legacy:** `true` is equivalent to `overflow: 'wrap'`. |
| `progressBar` | `Boolean \| { min, max } \| (value, row) => number` | Renders a bar; value or mapped 0–100. Double-click edit disabled. |
| `cellButtons` | `Array` | Trailing buttons: `{ label, icon? (SVG HTML), onClick(row) }`. |
| `badge` | `Boolean \| { color? } \| (value, row) => { color? } \| null` | Renders the **cell value as a pill** for **any** column type (`varchar`, `text`, numbers, etc.). On **boolean** columns, `meta.badge` replaces the default toggle with a pill (double‑click to edit still works when `editable.update` is true). Set **`color`** to any CSS color (`#hex`, `rgb()`, `hsl()`, named colors, `var(--token)`). Omit `color` or use `badge: true` for neutral styling. |
| `suffixIcon` | `{ svg, color? } \| (value, row) => { svg, color? } \| null` | Small inline SVG **after** the cell text. `svg` is raw markup; `color` is an optional CSS color. |

## Features

### Toolbar
- **Filter bar** — Click to add column filters with operator support (equals, like, greater than, etc.)
- **Sort** — Multi-column sort with drag-and-drop reordering, ASC/DESC toggle
- **Columns** — Toggle column visibility with Show All / Default reset
- **Insert** — When `editable.insert` is true: if `defaultInsertLabel` is set, primary click emits `insert-row`; pairing with `insertActions` adds a chevron menu that emits `insert-action` per item. With no default label, an **Insert** dropdown lists `insertActions` or built-in items (insert row / column / CSV placeholder). Optional `toolbarActions` adds a separate **Actions** menu next to Sort.
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
- **Clear selection** / **Select all N** — Uses `countLabelSingular` / `countLabelPlural` (e.g. *Select all 50 ligands*)

### Row Edit Panel
Slide-in panel from the right for inserting or updating rows:
- Required and optional field sections based on `isNullable`
- Primary key fields are read-only in update mode
- Save with `Cmd+Enter`, close with `Escape`

### Pagination
- Page navigation with direct page number input (unless `hasRandomAccess` is `false`)
- Configurable rows per page (100, 500, 1000)
- Total count line: `{{ n }} {{ countLabelSingular }}` or `{{ countLabelPlural }}` (defaults *record* / *records*)

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

### Custom footer count labels

Use domain nouns so the footer and **Select all** match your entity (e.g. stores, ligands).

```vue
<DataTable
  :columns="columns"
  :rows="rows"
  count-label-singular="store"
  count-label-plural="stores"
/>
```

### Custom insert / import menu

```vue
<script setup>
const insertActions = [
  { key: 'csv', label: 'Import CSV', icon: '<svg ...></svg>' },
  { key: 'api', label: 'Sync from API' },
]

function onInsertAction(key) {
  if (key === 'csv') openCsvDialog()
}
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    default-insert-label="Import…"
    :insert-actions="insertActions"
    @insert-row="openDefaultImport"
    @insert-action="onInsertAction"
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
