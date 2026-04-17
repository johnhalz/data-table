# Architecture

## Component Tree

```
DataTable.vue                 ← only public component; all state lives here
├── SelectionToolbar.vue          ← shown when rows are selected (replaces toolbar)
│   └── [Teleport] delete confirmation dialog
├── TableToolbar.vue              ← shown when no rows selected
│   ├── FilterBar.vue             ← inline filter chips
│   │   └── FilterOperatorMenu.vue
│   ├── SortPanel.vue             ← dropdown: add/reorder sort rules
│   └── ColumnVisibilityPanel.vue ← dropdown: toggle columns, show all / default
├── TableGrid.vue                 ← scrollable table with sticky columns
│   ├── TableColumnHeader.vue     ← per-column: name, type, sort indicator, dropdown
│   └── TableCell.vue             ← per-cell: display, inline edit, boolean toggle
├── TablePagination.vue           ← page nav, rows per page, record count
├── RowEditPanel.vue              ← slide-in form (insert or update)
└── ContextMenu.vue               ← right-click menu (Teleported to body)
```

## State Management

All table state is owned by `DataTable.vue` as Vue `ref()`s:

| Ref | Type | Controls |
|-----|------|----------|
| `sorting` | `Array<{ id, desc }>` | Column sort rules |
| `columnFilters` | `Array<{ id, value }>` | Active column filters |
| `rowSelection` | `Object<rowId, boolean>` | Selected row map |
| `pagination` | `{ pageIndex, pageSize }` | Current page state |
| `columnSizing` | `Object<colId, number>` | Column widths after resize |
| `columnVisibility` | `Object<colId, boolean>` | Hidden/shown columns |

### TanStack reactivity workaround

`useVueTable()` returns a plain object — Vue's reactivity system doesn't track its internal changes. The pattern used here:

1. Each state ref is wired into `useVueTable({ state: { get sorting() { return sorting.value } } })`
2. Each `on*Change` handler updates the corresponding ref
3. Child components that read from the table instance (e.g., `table.getRowModel().rows`) wrap those calls in `computed()` which naturally tracks the underlying refs as dependencies

## Communication Patterns

### Props down, events up

```
Parent App
  │
  │  props: columns, rows, tableName, editable, loading, error, totalCount, ...
  ▼
DataTable.vue
  │
  │  emit: insert-row, update-row, delete-rows, refresh, selection-action,
  │        page-change, column-resize
  ▲
Parent App
```

### Provide/inject for deep config

Configuration props that need to reach deeply nested components (TableCell, TableColumnHeader) are provided by `DataTable.vue` and injected by consumers:

```
DataTable.vue ──provide──► showDataTypes
                               editable          ← ComputedRef<{ insert, update, delete }>
                               showRowBorders
                               showColumnBorders
                               table
                               tableName
                               openInsertPanel
```

The `editable` inject is always the normalized object form. Consumers must check specific keys (`editable.value.update`, `editable.delete`) rather than treating it as a boolean.

Injecting components:
- `TableColumnHeader.vue` injects: `showDataTypes`, `showRowBorders`, `showColumnBorders`
- `TableCell.vue` injects: `editable`, `showRowBorders`, `showColumnBorders`
- `TableGrid.vue` injects: `editable`, `showRowBorders`, `showColumnBorders`, `openInsertPanel`
- `ContextMenu.vue` injects: `editable`
- `SortPanel.vue` injects: `showDataTypes`
- `FilterBar.vue` injects: `showDataTypes`
- `ColumnVisibilityPanel.vue` injects: `showDataTypes`

## Dropdown / Modal Pattern

All dropdowns and modals follow the same pattern:

1. A `showX = ref(false)` controls visibility
2. The dropdown content is rendered at its natural position OR Teleported to `<body>`
3. A transparent full-screen backdrop (`fixed inset-0 z-40`) is Teleported to `<body>` and catches clicks to close
4. The dropdown itself sits at `z-50` (or higher for modals)

Teleporting to `<body>` is required when the dropdown is inside a positioned ancestor with its own stacking context (e.g., `<thead class="sticky z-20">`), because a child's z-index is relative to the parent's stacking context.

## Row Identity

`getRowId` is derived at runtime from the column definitions. `DataTable.vue` scans `props.columns` for the first column with `meta.isPrimaryKey: true` and uses its `accessorKey` (or `id`) as the row identity field. Falls back to `row.id` if no primary key column is found.

This means row IDs in `delete-rows` payloads, `rowSelection` state, and TanStack's internal row model all reflect the actual primary key field — not a hardcoded `.id` assumption.

## Server-Side Pagination

When `totalCount` prop is set (non-null), `DataTable.vue` configures TanStack with `manualPagination: true` and derives `pageCount` from `totalCount / pageSize`. In this mode:
- The table does **not** slice `rows` — the parent is responsible for passing the correct page slice
- Every page navigation emits `page-change: { pageIndex, pageSize }` for the parent to fetch the next slice
- `TablePagination` shows `totalCount` as the record count instead of `filteredRowModel.rows.length`
- Client-side filtering/sorting still works on the current page slice only

## Column Definition Schema

Columns are defined using TanStack's `createColumnHelper()`. The `meta` object is custom and drives component behavior:

```js
{
  type: 'varchar',       // Determines input type, value coercion, toggle rendering
  isPrimaryKey: false,   // Disables editing in update mode (RowEditPanel)
  isNullable: true,      // Controls required vs optional sections in RowEditPanel
  isFrozen: false,       // (Column header dropdown toggle — not yet fully implemented)
}
```

### Type behavior

| `meta.type` | Cell rendering | Edit input | Value coercion on save |
|-------------|---------------|------------|----------------------|
| `boolean` | Toggle switch + label | Toggle (click) | Boolean |
| `int8`, `int4`, `float8` | Plain text | Textarea | `Number()` |
| `varchar`, `text` | Plain text | Textarea | String (no coercion) |
| Any other | Plain text | Textarea | String (no coercion) |

## File Roles

| File | Responsibility | Props received | Events emitted |
|------|---------------|---------------|----------------|
| `DataTable.vue` | State hub, provide/inject, layout | SDK props | SDK events |
| `TableToolbar.vue` | Toolbar layout, panel toggles | `table`, `sorting`, `columnFilters`, `columnVisibility`, `defaultColumnVisibility`, `editable` (object), `loading` | `update:sorting`, `update:column-filters`, `update:column-visibility`, `insert-row`, `refresh` |
| `SelectionToolbar.vue` | Selection actions, delete confirm | `selectedCount`, `table`, `editable` (object), `selectionActions` | `delete-rows`, `selection-action` |
| `TableGrid.vue` | Scrollable table, row rendering | `table` | `update-cell`, `context-menu`, `edit-row` |
| `TableColumnHeader.vue` | Column header cell | `header`, `table` | (none — uses injected functions) |
| `TableCell.vue` | Data cell rendering/editing | `cell`, `isSelected` | `select`, `update` |
| `TablePagination.vue` | Page controls | `table`, `totalCount` | (none — calls table methods directly) |
| `RowEditPanel.vue` | Insert/update form | `mode`, `rowData`, `table`, `tableName` | `save`, `close` |
| `ColumnVisibilityPanel.vue` | Column show/hide toggles | `table`, `columnVisibility`, `defaultColumnVisibility` | `update:column-visibility`, `close` |
| `SortPanel.vue` | Sort rule management | `table`, `sorting`, `allColumns` | `update:sorting`, `close` |
| `FilterBar.vue` | Filter chip management | `table`, `columnFilters`, `allColumns` | `update:column-filters` |
| `FilterOperatorMenu.vue` | Operator picker | `operators`, `selected` | `select` |
| `ContextMenu.vue` | Right-click actions | `x`, `y`, `row`, `cell` | `close`, `edit-row`, `delete-row`, `filter-by-value` |
| `types.js` | Constants | — | — |
