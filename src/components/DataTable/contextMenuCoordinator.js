/** Single open context menu across all nested DataTable instances (teleported to body). */
let activeCloser = null

/**
 * @param {() => void} closeFn — this table's `closeContextMenu`
 */
export function claimContextMenu(closeFn) {
  if (activeCloser && activeCloser !== closeFn) {
    activeCloser()
  }
  activeCloser = closeFn
}

/**
 * Call when this table's menu closes or the component unmounts.
 * @param {() => void} closeFn
 */
export function releaseContextMenu(closeFn) {
  if (activeCloser === closeFn) {
    activeCloser = null
  }
}
