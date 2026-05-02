# CLAUDE.md

## Project Overview

DataTable is a Vue 3 data table component. It is a single reusable component (`<DataTable>`) built on TanStack Table v8 with Tailwind CSS v4, supporting dark and light themes with customizable accent colors.

## Tech Stack

- **Vue 3.5+** — Composition API with `<script setup>`
- **TanStack Table v8** (`@tanstack/vue-table`) — headless table engine
- **Tailwind CSS v4** — utility-first styling (layout/spacing), CSS custom properties for colors
- **VueUse** (`@vueuse/core`) — `onClickOutside` utility
- **Vite 8** — dev server and build

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

There is no test suite, linter, or type checker configured.

## Project Structure

```
src/
  App.vue                          # Demo app — uses DataTable with sample data
  demo/
    demoColumns.js                 # Column definitions for the demo
    demoData.js                    # Sample row data for the demo
  components/DataTable/
    index.js                       # Named export: { DataTable }
    DataTable.vue                  # Root component — all SDK props, state, provide/inject hub
    TableToolbar.vue               # Toolbar: filter bar, sort, columns, insert, refresh
    SelectionToolbar.vue           # Appears when rows selected: delete, actions, clear/select all
    TableGrid.vue                  # Table element: headers, rows, cells, checkboxes, row numbers
    TableColumnHeader.vue          # Single column header: name, type badge, sort indicator, dropdown
    TableCell.vue                  # Single cell: text, badge, progress bar, suffix icon, inline edit, boolean toggle
    TablePagination.vue            # Bottom bar: page nav, rows per page, record count
    RowEditPanel.vue               # Slide-in panel for insert/update row forms
    ColumnVisibilityPanel.vue      # Dropdown panel to show/hide columns
    SortPanel.vue                  # Dropdown panel to add/reorder sort rules
    FilterBar.vue                  # Inline filter chips with operator selection
    FilterOperatorMenu.vue         # Operator picker dropdown for a single filter
    ContextMenu.vue                # Right-click menu: copy, filter, edit, delete
    types.js                       # Filter operators, page size options, constants
```

## Architecture

### Data flow

`DataTable.vue` is the only public component. It:
1. Accepts `columns` and `rows` props from the parent
2. Creates a TanStack `useVueTable` instance with all state (sorting, filters, pagination, selection, column visibility, column sizing)
3. Distributes the table instance and configuration to children via `provide/inject`
4. Emits events back to the parent for mutations (`insert-row`, `update-row`, `delete-rows`, etc.)

### Reactivity pattern

TanStack's `useVueTable` returns a non-reactive object. All table state is stored in Vue `ref()`s and wired into the table via `state` getters and `on*Change` handlers. Child components that read from the table instance wrap those reads in `computed()` so Vue tracks the reactive refs as dependencies.

### Provide/inject map

These values are provided by `DataTable.vue` and injected by child components:

| Key                | Type         | Consumers |
|--------------------|--------------|-----------|
| `table`            | Object       | SortPanel, ColumnVisibilityPanel |
| `tableName`        | String       | RowEditPanel (via prop) |
| `showDataTypes`    | Boolean      | TableColumnHeader, ColumnVisibilityPanel, SortPanel, FilterBar |
| `editable`         | `ComputedRef<{ insert, update, delete }>` | TableGrid, TableCell, ContextMenu, SelectionToolbar (via prop) |
| `showRowBorders`   | Boolean      | TableGrid, TableColumnHeader, TableCell |
| `showColumnBorders`| Boolean      | TableGrid, TableColumnHeader, TableCell |
| `openInsertPanel`  | Function     | TableGrid (empty state insert button) |
| `cellOverflow`     | `ComputedRef<string>` | `TableCell` — default `'truncate'` \| `'wrap'`; columns override via `meta.overflow` |

The `editable` inject value is always the normalized object shape `{ insert: boolean, update: boolean, delete: boolean }` — never a raw boolean. Consumers check specific keys: `editable.value.update`, `editable.delete`, etc.

### Theming system

All colors are driven by CSS custom properties (`--st-*`) set on the root `<div>` of `DataTable.vue` via a `themeVars` computed property. This approach was chosen over provide/inject because:
- CSS variables cascade naturally through the DOM, including into Teleported elements (dropdowns, modals)
- Zero JS overhead for distributing colors to deeply nested components
- Works with both inline `:style` bindings and `<style scoped>` blocks

The `theme` prop (`'dark'` | `'light'`) switches the full palette. The `accentColor` prop sets the primary brand color, and derived variants (hover, background, border, text-on-accent) are computed automatically using `color-mix()` and luminance calculation.

**CSS variable tokens** (all prefixed `--st-`):

| Token | Dark value | Light value | Usage |
|-------|-----------|-------------|-------|
| `--st-bg` | `#1c1c1c` | `#ffffff` | Main background |
| `--st-bg-header` | `#2a2a2a` | `#f4f4f5` | Column header row |
| `--st-bg-surface` | `#2a2a2a` | `#ffffff` | Dropdowns, panels |
| `--st-bg-input` | `#2a2a2a` | `#f4f4f5` | Form inputs |
| `--st-bg-row-hover` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.03)` | Row hover |
| `--st-bg-menu-hover` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.06)` | Menu item hover |
| `--st-bg-selected` | `rgba(59,130,246,0.15)` | `rgba(59,130,246,0.08)` | Selected row |
| `--st-border` | `#333333` | `#e4e4e7` | Primary borders |
| `--st-border-secondary` | `#444444` | `#d4d4d8` | Input/panel borders |
| `--st-text` | `#e5e5e5` | `#18181b` | Primary text |
| `--st-text-secondary` | `#a1a1aa` | `#52525b` | Secondary text |
| `--st-text-tertiary` | `#71717a` | `#a1a1aa` | Muted text |
| `--st-accent` | (from prop) | (from prop) | Accent color |
| `--st-text-on-accent` | auto | auto | Text on accent bg (black or white based on luminance) |

Hover effects that require `:hover` pseudo-class use `<style scoped>` blocks referencing the CSS variables, since inline `:style` can't express pseudo-selectors.

### CSS layout patterns

- Sticky columns (row numbers + checkboxes) use `position: sticky` with `left` offsets and `z-10`/`z-30`
- Dropdowns that appear inside `<thead>` (which has `sticky` + `z-20`) are Teleported to `<body>` to escape the stacking context
- Named Tailwind group variants: `group/header` on `<th>`, `group-hover/header:opacity-100` on chevron buttons
- Table uses `table-fixed` layout with explicit pixel width computed from column sizes, so the table grows beyond the viewport when columns are wide (horizontal scroll)

## SDK Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `columns` | `Array` | required | TanStack column defs with `meta: { type, isNullable }` |
| `rows` | `Array` | required | Array of row data objects |
| `tableName` | `String` | `'table'` | Display name in edit panel header |
| `loading` | `Boolean` | `false` | Spins the refresh button; disables it while true |
| `error` | `String` | `null` | Dismissible red banner above the grid; resets when prop value changes |
| `defaultColumnVisibility` | `Object` | `{}` | Initial hidden columns, e.g. `{ col: false }` |
| `showDataTypes` | `Boolean` | `true` | Show type badges in headers and panels |
| `editable` | `Boolean\|Object` | `true` | `true`/`false` gates all mutations; or `{ insert, update, delete }` booleans for per-operation control |
| `selectionActions` | `Array` | `[]` | Custom actions: `[{ key: string, label: string }]` |
| `enableSelectAll` | `Boolean` | `true` | When `true`, shows **Select all N** next to **Clear selection** in the selection toolbar (uses `countLabelSingular` / `countLabelPlural`). Selects every row across all pages (post-filter). The header checkbox only toggles the current page. |
| `toolbarActions` | `Array` | `[]` | Custom dropdown next to the Sort button. Items: `[{ key, label, icon?, disabled?, divider? }]`. `divider: true` renders a separator. `icon` is raw SVG markup. Emits `toolbar-action` with the `key`. The button is hidden when this array is empty. |
| `toolbarActionsLabel` | `String` | `'Actions'` | Label shown on the `toolbarActions` dropdown trigger button. |
| `showRowBorders` | `Boolean` | `true` | Horizontal row dividers |
| `showColumnBorders` | `Boolean` | `true` | Vertical column dividers |
| `cellButtonVisibility` | `String` | `'hover'` | `'hover'` \| `'always'` \| `'select'` — when to show trailing cell buttons defined via `meta.cellButtons`. `'select'` uses the existing click-to-select cell state. |
| `cellOverflow` | `String` | `'truncate'` | Default text cell overflow: `'truncate'` or `'wrap'`. Per-column `meta.overflow` overrides. |
| `insertActions` | `Array` | `[]` | Custom insert/import menu items: `{ key, label, icon? (SVG HTML) }`. Emits `insert-action` with `key`. With `defaultInsertLabel`, items appear in the chevron dropdown; without it, under **Insert ▼**. |
| `defaultInsertLabel` | `String` | `null` | Primary insert button label; click emits `insert-row`. Plain button if `insertActions` empty; split button if both are set. |
| `countLabelSingular` | `String` | `'record'` | Singular noun after total count in pagination footer and in **Select all N …** |
| `countLabelPlural` | `String` | `'records'` | Plural noun when count ≠ 1 |
| `theme` | `String` | `'dark'` | `'dark'` or `'light'` — switches the full color palette |
| `accentColor` | `String` | `'#3ecf8e'` | Primary accent hex color (buttons, indicators, selections) |
| `fontFamily` | `String` | `null` | Optional CSS `font-family`; cascades to nested tables via provide/inject CSS vars |
| `showToolbar` | `Boolean` | `true` | Toolbar + selection bar visibility |
| `showPagination` | `Boolean` | `true` | Footer pagination visibility |
| `emptyTitle` | `String` | `'No rows found'` | Empty state title |
| `emptyMessage` | `String` | `'Get started…'` | Empty state message |
| `totalCount` | `Number` | `null` | Total rows for server-side pagination; enables manual pagination mode and `page-change` event |
| `hasRandomAccess` | `Boolean` | `true` | When `false`, hides page number input in footer (sequential prev/next only) |
| `columnFilters` | `Array` | `null` | `v-model:column-filters` — parent-controlled filter state |
| `controlledSorting` | `Array` | `null` | External sort state (nested tables) |
| `controlledColumnFilters` | `Array` | `null` | External filter state (nested tables) |
| `controlledColumnVisibility` | `Object` | `null` | External column visibility map |
| `getSubTable` / `subTableColumns` / `expandedRows` | — | `null` | Expandable row / nested `DataTable` API |
| `stagedEdits` | `Boolean` | `false` | When `true`, inserts/updates/deletes are queued locally instead of emitting immediately. The footer shows a "N pending changes" badge with **Commit** and **Clear edits** buttons. Individual `insert-row` / `update-row` / `delete-rows` events do NOT fire in this mode — the parent receives a single `commit-edits` event with the full batch. Pending edits are visually marked in the grid (modified cells get an accent stripe + previous-value tooltip; inserted rows are tinted; deleted rows are struck-through) and each can be undone via the right-click context menu before commit. |

## SDK Events

| Event | Payload | When |
|-------|---------|------|
| `insert-row` | `Object` (row data) | Insert form submit, or primary insert button when `defaultInsertLabel` is set |
| `insert-action` | `actionKey` (string) | User chose an item from `insertActions` |
| `update-row` | `{ id, changes }` | Cell edit or edit panel save |
| `delete-rows` | `Array<string>` (IDs) | Delete confirmation accepted |
| `refresh` | — | Refresh button clicked |
| `selection-action` | `(actionKey, rows[])` | Custom action triggered |
| `toolbar-action` | `actionKey` | User picked an item from the `toolbarActions` dropdown |
| `page-change` | `{ pageIndex, pageSize }` | Page navigation in server-side pagination mode |
| `column-resize` | `Object<colId, number>` | User finishes resizing a column |
| `commit-edits` | `({ inserts, updates, deletes }, done)` | User clicked **Commit** in staged-edits mode. `inserts` is `Array<rowData>`, `updates` is `Array<{ id, changes }>`, `deletes` is `Array<id>`. The parent **must** call `done(true)` when the batch has been applied successfully (clears the queue) or `done(false)` on failure (queue is preserved for retry). The Commit button shows a spinner until `done` is called. |
| `discard-edits` | — | User clicked **Clear edits** and confirmed the dialog. |

## Column Definition

```js
col.accessor('field', {
  header: 'Field',
  meta: {
    type: 'varchar',        // 'int8' | 'int4' | 'float8' | 'varchar' | 'text' | 'boolean'
    isPrimaryKey: false,    // read-only in update mode
    isNullable: true,       // required vs optional in edit panel
    insertable: true,       // set false to hide column from insert panel entirely (e.g. auto-generated ids)
    defaultValue: '',       // pre-populate the insert form field with this value
    placeholder: '',        // placeholder text for the insert/update form field
    readOnly: false,        // show field in insert panel but disable editing (greyed out)
    // Presentation (optional)
    overflow: 'truncate',   // 'truncate' | 'wrap' — overrides table `cellOverflow`; `multiline: true` is legacy alias for wrap
    progressBar: true,      // or { min, max } or (value, row) => 0–100
    cellButtons: [{ label, icon? (SVG HTML), onClick(row) }],
    badge: true,            // or { color?: CSSColor } or (value, row) => { color? } | null — pill for any type; boolean columns show a pill instead of the toggle when set. `color`: any CSS color (hex, rgb/hsl, named, var(--…))
    suffixIcon: { svg, color? }, // or (value, row) => { svg, color? } | null — icon after text
  },
  size: 180,               // column width in px
  enableSorting: true,
  enableColumnFilter: true,
})
```

## Coding Conventions

- Single-file components with `<script setup>` — no Options API
- No TypeScript — plain JavaScript throughout
- Props validated with Vue's built-in `defineProps` type/default syntax
- State management via `ref()`/`computed()` — no Pinia or Vuex
- Tailwind classes for layout/spacing, CSS custom properties (`--st-*`) via inline `:style` bindings for all colors
- `<style scoped>` blocks only for hover effects that require `:hover` pseudo-selectors
- SVG icons are inlined, not imported from an icon library
- Components communicate via props down, events up, with `provide/inject` for deeply nested config
