/** Row # column + checkbox column width (matches TableGrid). */
export const DATA_TABLE_STICKY_CHROME_PX = 84

const MIN_COL = 60

function equalSplitIds(ids, totalTarget) {
  const n = ids.length
  const out = {}
  if (n === 0) return out
  const t = Math.max(MIN_COL * n, Math.floor(totalTarget))
  const base = Math.floor(t / n)
  const remainder = t - base * n
  ids.forEach((id, i) => {
    out[id] = base + (i < remainder ? 1 : 0)
  })
  return out
}

/**
 * Integer widths proportional to baselines, summing exactly to targetSum.
 * Only used when targetSum >= sum(baselines) (scale-up / fill viewport).
 * Baselines from content measure are already clamped >= MIN_COL.
 *
 * @param {string[]} ids
 * @param {number[]} baselines
 * @param {number} targetSum
 * @returns {Record<string, number>}
 */
export function distributeWidthsLargestRemainder(ids, baselines, targetSum) {
  const n = ids.length
  if (n === 0) return {}
  const target = Math.max(0, Math.floor(targetSum))
  const sumB = baselines.reduce((a, b) => a + b, 0)

  if (sumB <= 0) {
    return equalSplitIds(ids, target)
  }

  const raw = baselines.map((b) => (target * b) / sumB)
  const floors = raw.map((r) => Math.floor(r))
  let slack = target - floors.reduce((a, b) => a + b, 0)

  /** @type {number[]} Largest remainder order */
  const order = [...raw.keys()].sort((i, j) => {
    const fi = raw[i] - floors[i]
    const fj = raw[j] - floors[j]
    return fj - fi
  })
  let k = 0
  while (slack > 0) {
    const i = order[k % n]
    floors[i] += 1
    slack -= 1
    k += 1
  }

  const out = {}
  ids.forEach((id, idx) => { out[id] = floors[idx] })
  return out
}
