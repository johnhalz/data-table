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

/** Returned from `getSubTable` — nested rows + column defs. */
export interface SubTableConfig {
  rows: unknown[]
  /** Use `ColumnDef<any>` so callers can pass TanStack defs typed to their row model. */
  columns: ColumnDef<any, any>[]
  /** Optional; passed through to the nested `DataTable`. */
  fontFamily?: string | null
}

/** Commit payload when `stagedEdits` is true. */
export interface CommitEditsPayload {
  inserts: Record<string, unknown>[]
  updates: Array<{ id: unknown; changes: Record<string, unknown> }>
  deletes: unknown[]
}

/** Public props mirrored from `DataTable.vue`. */
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
  showRowBorders?: boolean
  showColumnBorders?: boolean
  cellButtonVisibility?: 'hover' | 'always' | 'select'
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
  hasRandomAccess?: boolean
  columnFilters?: unknown[] | null
  controlledSorting?: unknown[] | null
  controlledColumnFilters?: unknown[] | null
  controlledColumnVisibility?: Record<string, boolean> | null
  stagedEdits?: boolean
}

export declare const DataTable: DefineComponent<DataTableProps>
