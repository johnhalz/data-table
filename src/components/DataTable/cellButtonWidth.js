/** Reserved width per trailing cell button (icon-only). */
const CELL_BUTTON_ICON_PX = 22
/** Approximate width for label-only buttons (e.g. “View” at 11px + horizontal padding). */
const CELL_BUTTON_LABEL_PX = 40

/**
 * Sum of extra column width to reserve for trailing `meta.cellButtons`.
 *
 * @param {Array<{ icon?: string, label?: string }> | undefined | null} cellButtons
 * @returns {number}
 */
export function widthPxForCellButtons(cellButtons) {
  if (!Array.isArray(cellButtons) || cellButtons.length === 0) return 0
  return cellButtons.reduce((sum, btn) => {
    if (btn && typeof btn === 'object' && btn.icon) return sum + CELL_BUTTON_ICON_PX
    return sum + CELL_BUTTON_LABEL_PX
  }, 0)
}
