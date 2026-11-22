# Architecture

> Written for the Vue build and carried over to the 3.x React port. The structure is the same; read *provide/inject* as `DTContext` (`context.js`), *ref()* as `useState`, *Teleport* as `createPortal`, *emit('x-y')* as an `onXY` callback, and *watch* as `useUpdateEffect`.

## Component Tree

### DataTable

```
DataTable.jsx                 ← primary grid; all state lives here
├── SelectionToolbar.jsx          ← shown when rows are selected (replaces toolbar)
│   └── [Teleport] delete confirmation dialog
├── TableToolbar.jsx              ← shown when no rows selected
│   ├── FilterBar.jsx             ← inline filter chips
│   ├── SortPanel.jsx             ← dropdown: add/reorder sort rules
│   └── ColumnVisibilityPanel.jsx ← dropdown: toggle columns, show all / default
├── TableGrid.jsx                 ← scrollable table with sticky columns
│   ├── TableColumnHeader.jsx     ← per-column: name, type, sort indicator, dropdown
│   └── TableCell.jsx             ← per-cell: display, badge, inline edit, boolean toggle
├── TablePagination.jsx           ← page nav, rows per page, record count
├── RowEditPanel.jsx              ← slide-in form (insert or update)
└── ContextMenu.jsx               ← right-click menu (Teleported to body)
```

### MiniTable

```
MiniTable.jsx                  ← narrow single-column variant (own useTable + provide/inject)
├── (contains filter `<input>` + Refresh row — not FilterBar)
├── SelectionToolbar.jsx        ← embedded in footer when rows selected (footerLayout + summaryRatio)
├── TableColumnHeader.jsx       ← sort via header chevron only
├── TableCell.jsx
├── RowEditPanel.jsx            ← update-only flow when editable.update
├── ContextMenu.jsx
└── DeleteRowsConfirmDialog.jsx
```

`MiniTable.jsx` is **not** a wrapper around `DataTable`. It uses **`manualSorting`** and **`manualFiltering`** so the parent can react to **`sort-change`** and **`update:column-filters`** by refetching or reshaping **`rows`**.

- **Layout**: Checkbox column + one data column (**no `#` column**). **`ResizeObserver`** sets **`columnSizing`** so the data column fills **`viewportWidth - checkboxWidth`** with **`overflow-x: hidden`** on the scroll shell.
- **Toolbar**: **Contains search field + Refresh** is **always** shown — selection does not hide filtering.
- **Infinite scroll**: **`IntersectionObserver`** on a sentinel emits **`load-more`** when **`hasMore && !loading`**. Batch size convention: **`MINI_TABLE_PAGE_SIZE`** (**100**) in `types.js`.
- **Footer**: Idle: **`total-count`** (or **`rows.length`**) trailing total. With selection: **`SelectionToolbar`** (`footerLayout`) — ratio summary, **Delete…**, **Actions**, **Clear**, **Select All** (`flex-wrap` when narrow). No TanStack pagination — the scroll lists **all** loaded rows after filter/sort.
- **Provide/inject**: Mirrors `DataTable` for reused children (`themeVars`, `editable`, staged-edit no-ops, `isRowDisplayedSelected`, `highlightedRowId`, etc.).

## State Management

All table state is owned by `DataTable.jsx` as Vue `ref()`s:

| Ref | Type | Controls |
|-----|------|----------|
| `sorting` | `Array<{ id, desc }>` | Column sort rules |
| `columnFilters` | `Array<{ id, value }>` | Active column filters |
| `rowSelection` | `Object<rowId, boolean>` | Selected row map |
| `pagination` | `{ pageIndex, pageSize }` | Current page state |
| `columnSizing` | `Object<colId, number>` | Column widths after resize |
| `columnVisibility` | `Object<colId, boolean>` | Hidden/shown columns |

### TanStack reactivity

TanStack Table v9's Vue adapter (`useTable`) backs table state with Vue refs/computeds and unwraps a `ref`/`computed`/getter `data` option, so reads inside `computed()` track data and state changes on their own. The pattern used here:

1. Each state ref is wired into `useTable({ features, state: { get sorting() { return sorting.value } } })`
2. Each `on*Change` handler updates the corresponding ref
3. Child components wrap table reads (`table.getRowModel().rows`, `table.atoms.pagination.get()`) in `computed()`; no manual dependency hints are needed

Features are declared explicitly with `tableFeatures({...})` in `DataTable.jsx` / `MiniTable.jsx` (MiniTable omits pagination and column resizing, so shared children call resize APIs with optional chaining).

## Communication Patterns

### Props down, events up

```
Parent App
  │
  │  props: columns, rows, tableName, editable, loading, error, totalCount, ...
  ▼
DataTable.jsx
  │
  │  emit: insert-row, update-row, delete-rows, refresh, selection-action,
  │        page-change, column-resize
  ▲
Parent App
```

### Provide/inject for deep config

Configuration props that need to reach deeply nested components (TableCell, TableColumnHeader) are provided by `DataTable.jsx` and injected by consumers:

```
DataTable.jsx ──provide──► showDataTypes
                               editable          ← ComputedRef<{ insert, update, delete }>
                               showRowBorders
                               showColumnBorders
                               table
                               tableName
                               openInsertPanel
```

The `editable` inject is always the normalized object form. Consumers must check specific keys (`editable.value.update`, `editable.delete`) rather than treating it as a boolean.

Injecting components:
- `TableColumnHeader.jsx` injects: `showDataTypes`, `showRowBorders`, `showColumnBorders`
- `TableCell.jsx` injects: `editable`, `showRowBorders`, `showColumnBorders`
- `TableGrid.jsx` injects: `editable`, `showRowBorders`, `showColumnBorders`, `openInsertPanel`
- `ContextMenu.jsx` injects: `editable`
- `SortPanel.jsx` injects: `showDataTypes`
- `FilterBar.jsx` injects: `showDataTypes`
- `ColumnVisibilityPanel.jsx` injects: `showDataTypes`

## Dropdown / Modal Pattern

All dropdowns and modals follow the same pattern:

1. A `showX = ref(false)` controls visibility
2. The dropdown content is rendered at its natural position OR Teleported to `<body>`
3. A transparent full-screen backdrop (`fixed inset-0 z-40`) is Teleported to `<body>` and catches clicks to close
4. The dropdown itself sits at `z-50` (or higher for modals)

Teleporting to `<body>` is required when the dropdown is inside a positioned ancestor with its own stacking context (e.g., `<thead class="sticky z-20">`), because a child's z-index is relative to the parent's stacking context.

## Row Identity

`getRowId` is derived at runtime from the column definitions. `DataTable.jsx` scans `props.columns` for the first column with `meta.isPrimaryKey: true` and uses its `accessorKey` (or `id`) as the row identity field. Falls back to `row.id` if no primary key column is found.

This means row IDs in `delete-rows` payloads, `rowSelection` state, and TanStack's internal row model all reflect the actual primary key field — not a hardcoded `.id` assumption.

## Server-Side Pagination

When `totalCount` prop is set (non-null), `DataTable.jsx` configures TanStack with `manualPagination: true` and derives `pageCount` from `totalCount / pageSize`. In this mode:
- The table does **not** slice `rows` — the parent is responsible for passing the correct page slice
- Every page navigation emits `page-change: { pageIndex, pageSize }` for the parent to fetch the next slice
- `TablePagination` shows `totalCount` as the count line instead of `filteredRowModel.rows.length`; wording uses `countLabelSingular` / `countLabelPlural` (default record/records)
- Client-side filtering/sorting still works on the current page slice only

## Column Definition Schema

Columns are defined using TanStack's `createColumnHelper()`. The `meta` object is custom and drives component behavior:

```js
{
  type: 'varchar',       // Determines input type, value coercion, toggle rendering
  isPrimaryKey: false,   // Disables editing in update mode (RowEditPanel)
  isNullable: true,      // Controls required vs optional sections in RowEditPanel
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
| `DataTable.jsx` | State hub, provide/inject, layout | SDK props | SDK events |
| `TableToolbar.jsx` | Toolbar layout, panel toggles | `table`, `sorting`, `columnFilters`, `columnVisibility`, `defaultColumnVisibility`, `editable` (object), `loading` | `update:sorting`, `update:column-filters`, `update:column-visibility`, `insert-row`, `refresh` |
| `SelectionToolbar.jsx` | Selection actions, delete confirm | `selectedCount`, `table`, `editable` (object), `selectionActions` | `delete-rows`, `selection-action` |
| `TableGrid.jsx` | Scrollable table, row rendering | `table` | `update-cell`, `context-menu`, `edit-row` |
| `TableColumnHeader.jsx` | Column header cell | `header`, `table` | (none — uses injected functions) |
| `TableCell.jsx` | Data cell rendering/editing | `cell`, `isSelected` | `select`, `update` |
| `TablePagination.jsx` | Page controls | `table`, `totalCount` | (none — calls table methods directly) |
| `RowEditPanel.jsx` | Insert/update form | `mode`, `rowData`, `table`, `tableName` | `save`, `close` |
| `ColumnVisibilityPanel.jsx` | Column show/hide toggles | `table`, `columnVisibility`, `defaultColumnVisibility` | `update:column-visibility`, `close` |
| `SortPanel.jsx` | Sort rule management | `table`, `sorting`, `allColumns` | `update:sorting`, `close` |
| `FilterBar.jsx` | Filter chip management | `table`, `columnFilters`, `allColumns` | `update:column-filters` |
| `ContextMenu.jsx` | Right-click actions | `x`, `y`, `row`, `cell` | `close`, `edit-row`, `delete-row`, `filter-by-value` |
| `types.js` | Constants | — | — |
