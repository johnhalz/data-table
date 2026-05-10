/**
 * Whether a context-menu / bulk-action item should use destructive (--st-danger) styling.
 *
 * @param {{ key?: string, danger?: boolean, variant?: string, divider?: boolean } | null | undefined} item
 * @returns {boolean}
 */
export function isDestructiveRowAction(item) {
  if (item == null || typeof item !== 'object') return false
  if (item.divider === true) return false
  if (item.danger === true) return true
  if (item.variant === 'destructive') return true
  return /^delete/i.test(String(item.key ?? ''))
}
