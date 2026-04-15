# CLAUDE.md

## Project Overview

SupabaseTable is a Vue 3 data table component inspired by the Supabase Table Editor. It is a single reusable component (`<SupabaseTable>`) built on TanStack Table v8 with Tailwind CSS v4, supporting dark and light themes with customizable accent colors.

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
  App.vue                          # Demo app — uses SupabaseTable with sample data
  demo/
    demoColumns.js                 # Column definitions for the demo
    demoData.js                    # Sample row data for the demo
  components/SupabaseTable/
    index.js                       # Named export: { SupabaseTable }
    SupabaseTable.vue              # Root component — all SDK props, state, provide/inject hub
    TableToolbar.vue               # Toolbar: filter bar, sort, columns, insert, refresh
    SelectionToolbar.vue           # Appears when rows selected: delete, actions, clear/select all
    TableGrid.vue                  # Table element: headers, rows, cells, checkboxes, row numbers
    TableColumnHeader.vue          # Single column header: name, type badge, sort indicator, dropdown
    TableCell.vue                  # Single cell: display, inline edit, boolean toggle
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

`SupabaseTable.vue` is the only public component. It:
1. Accepts `columns` and `rows` props from the parent
2. Creates a TanStack `useVueTable` instance with all state (sorting, filters, pagination, selection, column visibility, column sizing)
3. Distributes the table instance and configuration to children via `provide/inject`
4. Emits events back to the parent for mutations (`insert-row`, `update-row`, `delete-rows`, etc.)

### Reactivity pattern

TanStack's `useVueTable` returns a non-reactive object. All table state is stored in Vue `ref()`s and wired into the table via `state` getters and `on*Change` handlers. A `rerenderKey` counter is incremented on every state change and passed as a prop to force child components to recompute.

### Provide/inject map

These values are provided by `SupabaseTable.vue` and injected by child components:

| Key                | Type       | Consumers |
|--------------------|------------|-----------|
| `table`            | Object     | SortPanel, ColumnVisibilityPanel |
| `tableName`        | String     | RowEditPanel (via prop) |
| `showDataTypes`    | Boolean    | TableColumnHeader, ColumnVisibilityPanel, SortPanel, FilterBar |
| `editable`         | Boolean    | TableGrid, TableCell, ContextMenu |
| `showRowBorders`   | Boolean    | TableGrid, TableColumnHeader, TableCell |
| `showColumnBorders`| Boolean    | TableGrid, TableColumnHeader, TableCell |
| `emit`             | Function   | (reserved for child-to-parent event forwarding) |
| `openEditPanel`    | Function   | (reserved) |
| `openInsertPanel`  | Function   | (reserved) |
| `openContextMenu`  | Function   | (reserved) |

### Theming system

All colors are driven by CSS custom properties (`--st-*`) set on the root `<div>` of `SupabaseTable.vue` via a `themeVars` computed property. This approach was chosen over provide/inject because:
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
| `loading` | `Boolean` | `false` | Reserved for future use |
| `defaultColumnVisibility` | `Object` | `{}` | Initial hidden columns, e.g. `{ col: false }` |
| `showDataTypes` | `Boolean` | `true` | Show type badges in headers and panels |
| `editable` | `Boolean` | `true` | Enable insert/update/delete. `false` = read-only |
| `selectionActions` | `Array` | `[]` | Custom actions: `[{ key: string, label: string }]` |
| `showRowBorders` | `Boolean` | `true` | Horizontal row dividers |
| `showColumnBorders` | `Boolean` | `true` | Vertical column dividers |
| `theme` | `String` | `'dark'` | `'dark'` or `'light'` — switches the full color palette |
| `accentColor` | `String` | `'#3ecf8e'` | Primary accent hex color (buttons, indicators, selections) |

## SDK Events

| Event | Payload | When |
|-------|---------|------|
| `insert-row` | `Object` (row data) | User submits insert form |
| `update-row` | `{ id, changes }` | Cell edit or edit panel save |
| `delete-rows` | `Array<string>` (IDs) | Delete confirmation accepted |
| `refresh` | — | Refresh button clicked |
| `selection-action` | `(actionKey, rows[])` | Custom action triggered |

## Column Definition

```js
col.accessor('field', {
  header: 'Field',
  meta: {
    type: 'varchar',      // 'int8' | 'int4' | 'float8' | 'varchar' | 'text' | 'boolean'
    isPrimaryKey: false,   // read-only in update mode
    isNullable: true,      // required vs optional in edit panel
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
