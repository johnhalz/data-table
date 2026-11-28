import type { ForwardRefExoticComponent, RefAttributes } from 'react'

/**
 * A TanStack v9 column def, typed to the caller's row model (`createColumnHelper<any, Row>()`,
 * `ColumnDef<any, Row>`). Deliberately `object`, not `ColumnDef<any, any, any>`: v9's recursive
 * Row -> Cell -> ColumnDef generics make a def typed to a concrete row unassignable to the
 * `any`-row form, so typed TS callers could not pass their columns at all.
 */
type ColumnDefLike = object

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

/** Plain button in the toolbar right after Refresh; a click emits `onToolbarAction(key)`. */
export interface ToolbarButton {
  key: string
  label: string
  /** Raw SVG markup. */
  icon?: string
  disabled?: boolean
  /** Native tooltip. */
  title?: string
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
  columns: ColumnDefLike[]
  /** Passed through — enables footer pagination + server mode when set. */
  totalCount?: number | null
  showPagination?: boolean
  /** Optional; passed through to the nested `DataTable`. */
  fontFamily?: string | null
  /** Extra context-menu items for nested rows; forwarded as `contextMenuActions`. */
  contextMenuActions?: ReadonlyArray<RowAction>
  /** Wired to the nested table's `onRowAction`. */
  onRowAction?: (key: string, rowData: unknown) => void
  /** Wired to the nested table's `onPageChange` (server child pagination). */
  onPageChange?: (payload: { pageIndex: number; pageSize: number }) => void
  /** Wired to the nested table's `onSortChange` (server child refetch). */
  onSortChange?: (sorting: SubTableSortingState) => void
  /** Wired to the nested table's `onSelectionChange`: its ticked rows. Lost when the parent row collapses. */
  onSelectionChange?: (ids: string[], rows: any[]) => void
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
  columns: ColumnDefLike[]
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
  toolbarButtons?: ToolbarButton[]
  defaultInsertLabel?: string | null
  /** Custom insert/import menu entries; calls `onInsertAction(key)`. */
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
  subTableColumns?: ColumnDefLike[] | null
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
  /** Row id kept visually highlighted (e.g. the last-opened detail). */
  highlightedRowId?: string | number | null

  // Events (the Vue build's `@insert-row` etc., camelCased with an `on` prefix).
  // `rows` must be referentially stable between renders: a new array resets the checkbox selection.
  onInsertRow?: (row?: Record<string, unknown>) => void
  onUpdateRow?: (payload: { id: unknown; changes: Record<string, unknown> }) => void
  onDeleteRows?: (ids: string[]) => void
  onRefresh?: () => void
  onSelectionAction?: (key: string, rows: any[], selectedIds: string[]) => void
  onRowAction?: (key: string, rowData: any) => void
  onToolbarAction?: (key: string) => void
  onInsertAction?: (key: string) => void
  onExpandedRowsChange?: (expanded: Record<string, boolean>) => void
  onColumnResize?: (sizing: Record<string, number>) => void
  onPageChange?: (payload: { pageIndex: number; pageSize: number }) => void
  onSortChange?: (sorting: SubTableSortingState) => void
  onSelectAllMatching?: () => void
  onAdditionalSelectedRowIdsChange?: (ids: string[]) => void
  onColumnFiltersChange?: (filters: unknown[]) => void
  onCommitEdits?: (payload: CommitEditsPayload, done: (ok: boolean) => void) => void
  onDiscardEdits?: () => void
  /** The selection changed: every selected id, and the loaded rows among them. */
  onSelectionChange?: (ids: string[], rows: any[]) => void
}

/** Imperative handle (`ref`): `ref.current.openDeleteConfirmation(['id', ...])`. */
export interface DataTableExpose {
  openDeleteConfirmation: (ids: readonly string[] | string[]) => void
  /** Depth-0 only: merged Sort-panel rules applied to nested tables (for paging / refetch). */
  getSubTableSorting?: () => SubTableSortingState
}

export declare const DataTable: ForwardRefExoticComponent<DataTableProps & RefAttributes<DataTableExpose>>

/** Default rows-per-request for infinite scroll (`types.js`); conventionally 100. */
export declare const MINI_TABLE_PAGE_SIZE: number

/** Checkbox bulk actions affecting more than this many rows show a spinner on the clicked control. */
export declare const MINI_TABLE_BULK_SELECTION_SPINNER_THRESHOLD: number

export interface MiniTableProps {
  column: ColumnDefLike
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

  onRefresh?: () => void
  /** Sentinel near the end of the list came into view while `hasMore && !loading`. */
  onLoadMore?: () => void
  onColumnFiltersChange?: (filters: unknown[]) => void
  onSortChange?: (sorting: SubTableSortingState) => void
  /** Merged selection (checkboxes + `additionalSelectedRowIds`) whenever it changes. */
  onSelectionChange?: (ids: string[]) => void
  onAdditionalSelectedRowIdsChange?: (ids: string[]) => void
  onSelectAllMatching?: () => void
  onSelectionAction?: (key: string, rows: any[], selectedIds: string[]) => void
  onRowAction?: (key: string, rowData: any) => void
  onDeleteRows?: (ids: string[]) => void
  onUpdateRow?: (payload: { id: unknown; changes: Record<string, unknown> }) => void
}

export interface MiniTableExpose {
  openDeleteConfirmation: (ids: readonly string[] | string[]) => void
}

export declare const MiniTable: ForwardRefExoticComponent<MiniTableProps & RefAttributes<MiniTableExpose>>
