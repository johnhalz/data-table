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

export const FILTER_OPERATORS = [
  { group: 'Comparison', operators: [
    { label: 'Equals', value: '=' },
    { label: 'Not equal', value: '<>' },
    { label: 'Greater than', value: '>' },
    { label: 'Less than', value: '<' },
    { label: 'Greater or equal', value: '>=' },
    { label: 'Less or equal', value: '<=' },
  ]},
  { group: 'Pattern Matching', operators: [
    { label: 'Like', value: '~~' },
    { label: 'iLike', value: '~~*' },
  ]},
  { group: 'Set & Null Checks', operators: [
    { label: 'In list', value: 'in' },
    { label: 'Is', value: 'is' },
  ]},
]

export const PAGE_SIZE_OPTIONS = [100, 500, 1000]

export const DEFAULT_COLUMN_WIDTH = 180
export const ROW_NUMBER_WIDTH = 60
export const CHECKBOX_WIDTH = 50
