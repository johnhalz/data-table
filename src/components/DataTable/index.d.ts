import type { DefineComponent } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'

/** Custom action shown in the selection toolbar when rows are selected. */
export interface SelectionAction {
  key: string
  label: string
}

/** Item in the toolbar Actions dropdown next to Sort. */
export interface ToolbarAction {
  key: string
  label: string
  icon?: string
  disabled?: boolean
  divider?: boolean
}

/** Extra context-menu item (right-click) and bulk Actions menu item when multi-selecting. */
export interface RowAction {
  /** Omit when `divider` is true. */
  key?: string
  /** Omit when `divider` is true. */
  label?: string
  /** Raw SVG markup; `stroke="currentColor"` recommended. */
  icon?: string
  /** When true, label and icon use the table destructive color (`--st-danger`). */
  danger?: boolean
  /** Alternative to `danger` (either may be set). */
  variant?: 'default' | 'destructive'
  /** Renders a horizontal rule; omit `key`, `label`, and `icon`. */
  divider?: boolean
  /**
   * When true, item is non-interactive. When a function, it receives the row’s `original` data (right-click);
   * in the selection toolbar bulk menu, function callbacks are treated as not disabled so actions stay clickable.
   */
  disabled?: boolean | ((row: any) => boolean)
}

/** TanStack-compatible sort payload (passed through nested `sort-change`). */
export type SubTableSortingState = ReadonlyArray<{ id: string; desc?: boolean }>

/** Returned from `getSubTable` — nested rows + column defs. */
export interface SubTableConfig {
  rows: unknown[]
  /** Use `ColumnDef<any>` so callers can pass TanStack defs typed to their row model. */
  columns: ColumnDef<any, any>[]
  /** Passed through — enables footer pagination + server mode when set. */
  totalCount?: number | null
  showPagination?: boolean
  /** Optional; passed through to the nested `DataTable`. */
  fontFamily?: string | null
  /** Extra context-menu items for nested rows; forwarded as `contextMenuActions`. */
  contextMenuActions?: ReadonlyArray<RowAction>
  /** Handled internally (stripped before `v-bind`); invokes on nested `@row-action`. */
  onRowAction?: (key: string, rowData: unknown) => void
  /** Stripped before `v-bind`; wired to nested `@page-change` (server child pagination). */
  onPageChange?: (payload: { pageIndex: number; pageSize: number }) => void
  /** Stripped before `v-bind`; wired to nested `@sort-change` (server child refetch). */
  onSortChange?: (sorting: SubTableSortingState) => void
}

/** Commit payload when `stagedEdits` is true. */
export interface CommitEditsPayload {
  inserts: Record<string, unknown>[]
  updates: Array<{ id: unknown; changes: Record<string, unknown> }>
  deletes: unknown[]
}

/** Item in the insert button dropdown (`insertActions`). */
export interface InsertAction {
  key: string
  label: string
  icon?: string
}

export interface DataTableProps {
  columns: ColumnDef<any, any>[]
  rows: unknown[]
  tableName?: string
  loading?: boolean
  error?: string | null
  defaultColumnVisibility?: Record<string, boolean>
  showDataTypes?: boolean
  editable?: boolean | { insert?: boolean; update?: boolean; delete?: boolean }
  selectionActions?: SelectionAction[]
  enableSelectAll?: boolean
  toolbarActions?: ToolbarAction[]
  toolbarActionsLabel?: string
  defaultInsertLabel?: string | null
  /** Custom insert/import menu entries; emits `insert-action` with `key`. */
  insertActions?: InsertAction[]
  showRowBorders?: boolean
  showColumnBorders?: boolean
  cellButtonVisibility?: 'hover' | 'always' | 'select'
  /** Default text cell overflow; per-column `meta.overflow` overrides. */
  cellOverflow?: 'truncate' | 'wrap'
  theme?: 'dark' | 'light'
  accentColor?: string
  /**
   * CSS `font-family` value (e.g. `"Inter", sans-serif`). Inherits to nested/sub-tables via provide/inject.
   * Omit for the bundled system UI stack from `data-table/style.css`.
   */
  fontFamily?: string | null
  getSubTable?: ((rowData: any) => SubTableConfig | null) | null
  subTableColumns?: ColumnDef<any, any>[] | null
  expandedRows?: Record<string, boolean> | null
  nestingDepth?: number
  showToolbar?: boolean
  showPagination?: boolean
  emptyTitle?: string
  emptyMessage?: string
  totalCount?: number | null
  /** Same as totalCount when only server count is known; optional when using filtered exact count. */
  totalFilteredCount?: number | null
  /** Ids selected via parent “select all matching” (cross-page). */
  additionalSelectedRowIds?: readonly string[] | string[] | null
  enableSelectAllMatching?: boolean
  hasRandomAccess?: boolean
  columnFilters?: unknown[] | null
  controlledSorting?: unknown[] | null
  controlledColumnFilters?: unknown[] | null
  controlledColumnVisibility?: Record<string, boolean> | null
  stagedEdits?: boolean
  /** Singular noun after the total in the footer (default "record"). */
  countLabelSingular?: string
  /** Plural noun after the total in the footer (default "records"). */
  countLabelPlural?: string
  /** Extra context-menu entries (right-click); also listed in selection toolbar Actions when multi-selecting. */
  contextMenuActions?: ReadonlyArray<RowAction>
}

/** Exposed instance API (template ref): `ref.value.openDeleteConfirmation(['id', ...])`. */
export interface DataTableExpose {
  openDeleteConfirmation: (ids: readonly string[] | string[]) => void
  /** Depth-0 only: merged Sort-panel rules applied to nested tables (for paging / refetch). */
  getSubTableSorting?: () => SubTableSortingState
}

export declare const DataTable: DefineComponent<DataTableProps>

/** Default rows-per-request for infinite scroll (`types.js`); conventionally 100. */
export declare const MINI_TABLE_PAGE_SIZE: number

/** Checkbox bulk actions affecting more than this many rows show a spinner on the clicked control. */
export declare const MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD: number

export interface MiniTableProps {
  column: ColumnDef<any, any>
  rows: unknown[]
  tableName?: string
  loading?: boolean
  error?: string | null
  /** `insert` is ignored (no insert UI). */
  editable?: boolean | { insert?: boolean; update?: boolean; delete?: boolean }
  selectionActions?: SelectionAction[]
  contextMenuActions?: ReadonlyArray<RowAction>
  cellButtonVisibility?: 'hover' | 'always' | 'select'
  showDataTypes?: boolean
  showRowBorders?: boolean
  showColumnBorders?: boolean
  theme?: 'dark' | 'light'
  accentColor?: string
  fontFamily?: string | null
  emptyTitle?: string
  emptyMessage?: string
  countLabelSingular?: string
  countLabelPlural?: string
  totalCount?: number | null
  totalFilteredCount?: number | null
  hasMore?: boolean
  columnFilters?: unknown[] | null
  highlightedRowId?: string | number | null
  enableSelectAll?: boolean
  enableSelectAllMatching?: boolean
  /**
   * When true (default), Select All emits `select-all-matching` if eligible total exceeds loaded rows.
   */
  inferSelectAllMatching?: boolean
  additionalSelectedRowIds?: readonly string[] | string[]
}

export interface MiniTableExpose {
  openDeleteConfirmation: (ids: readonly string[] | string[]) => void
}

export declare const MiniTable: DefineComponent<MiniTableProps>
