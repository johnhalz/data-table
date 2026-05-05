/**
 * @typedef {Object} Column
 * @property {string} name - Column name (e.g. "store_code")
 * @property {string} type - Data type (e.g. "varchar", "int8", "boolean", "text")
 * @property {boolean} [isPrimaryKey] - Read-only in edit panel update mode
 * @property {boolean} [isNullable] - Shown in "Optional Fields" section
 * @property {boolean} [isFrozen] - Column stays visible on horizontal scroll
 * @property {number} [width] - Column width in pixels
 */

/**
 * @typedef {Object} SortRule
 * @property {string} column - Column name
 * @property {'asc'|'desc'} direction - Sort direction
 */

/**
 * @typedef {Object} Filter
 * @property {string} column - Column name
 * @property {string} operator - Filter operator (=, <>, >, <, >=, <=, ~~, ~~*, in, is)
 * @property {string} value - Filter value
 */

/**
 * Configuration returned by the `getSubTable` prop for expandable row groups.
 * Any DataTable prop can be included and will be forwarded to the nested table.
 *
 * @typedef {Object} SubTableConfig
 * @property {Array} columns - TanStack column definitions for the sub-table (required)
 * @property {Array} rows - Data rows for the sub-table (required)
 * @property {string} [tableName] - Display name in the sub-table's edit panel
 * @property {boolean} [editable] - Enable insert/update/delete in the sub-table
 * @property {boolean} [showToolbar] - Show the toolbar (sort, filter, insert). Default: true
 * @property {boolean} [showPagination] - Show pagination controls. Default: true
 * @property {boolean} [showDataTypes] - Show type badges in sub-table headers
 * @property {boolean} [showRowBorders] - Horizontal row dividers in sub-table
 * @property {boolean} [showColumnBorders] - Vertical column dividers in sub-table
 * @property {string} [fontFamily] - Same as `fontFamily` on `DataTable` (CSS stack)
 * @property {Function} [getSubTable] - Recursive: allows nested sub-tables within sub-tables
 */

export const DATE_TIME_TYPES = [
  "date",
  "time",
  "timetz",
  "timestamp",
  "timestamptz",
  "datetime",
];

export const FILTER_OPERATORS = [
  {
    group: "Comparison",
    operators: [
      { label: "Equals", value: "=" },
      { label: "Not equal", value: "<>" },
      { label: "Greater than", value: ">" },
      { label: "Less than", value: "<" },
      { label: "Greater or equal", value: ">=" },
      { label: "Less or equal", value: "<=" },
    ],
  },
  {
    group: "Pattern Matching",
    operators: [
      { label: "Contains", value: "~~" },
      { label: "Excludes", value: "~~*" },
    ],
  },
  {
    group: "Set & Null Checks",
    operators: [
      { label: "In list", value: "in" },
      { label: "Is", value: "is" },
    ],
  },
];

export const PAGE_SIZE_OPTIONS = [100, 500, 1000];

export const DEFAULT_COLUMN_WIDTH = 180;
export const ROW_NUMBER_WIDTH = 60;
export const CHECKBOX_WIDTH = 50;

export const PENDING_EDIT_KINDS = {
  INSERT: "insert",
  UPDATE: "update",
  DELETE: "delete",
};

export const PENDING_INSERT_ID_PREFIX = "__pending_";
