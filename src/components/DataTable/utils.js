import { onMounted, onUnmounted, unref } from 'vue'

/** Provide/inject key for the resolved font stack (shared by DataTable + MiniTable so nesting works across both). */
export const DT_FONT_FAMILY_KEY = Symbol('dataTable.fontFamily')

/** Default UI stack when the `fontFamily` prop is omitted. */
export const DEFAULT_DT_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

/** First non-blank font stack from the prop, then the parent table, else null. */
export function resolveFontFamily(own, parent) {
  for (const f of [own, unref(parent)]) {
    if (f != null && String(f).trim() !== '') return String(f).trim()
  }
  return null
}

/** Relative luminance-ish (0–1) of a `#rgb` / `#rrggbb` color; non-hex colors count as dark. */
export function luminance(color) {
  let hex = String(color).trim().replace('#', '')
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('')
  if (!/^[0-9a-f]{6}$/i.test(hex)) return 0
  const num = parseInt(hex, 16)
  return (0.2126 * (num >> 16) + 0.7152 * ((num >> 8) & 0xff) + 0.0722 * (num & 0xff)) / 255
}

/** All `--st-*` CSS custom properties for a theme + accent color. */
export function buildThemeVars(theme, accent) {
  const dark = theme === 'dark'
  return {
    '--st-bg':               dark ? '#1c1c1c' : '#ffffff',
    '--st-bg-header':        dark ? '#2a2a2a' : '#f4f4f5',
    '--st-bg-surface':       dark ? '#2a2a2a' : '#ffffff',
    '--st-bg-input':         dark ? '#2a2a2a' : '#f4f4f5',
    '--st-bg-row-hover':     dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    '--st-bg-menu-hover':    dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    '--st-bg-selected':      dark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)',
    '--st-bg-selected-cell': dark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.12)',
    '--st-bg-overlay':       dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
    '--st-bg-panel-overlay': dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
    '--st-border':           dark ? '#333333' : '#e4e4e7',
    '--st-border-secondary': dark ? '#444444' : '#d4d4d8',
    '--st-border-tertiary':  dark ? '#555555' : '#a1a1aa',
    '--st-text':             dark ? '#e5e5e5' : '#18181b',
    '--st-text-secondary':   dark ? '#a1a1aa' : '#52525b',
    '--st-text-tertiary':    dark ? '#71717a' : '#a1a1aa',
    '--st-text-placeholder': dark ? '#52525b' : '#a1a1aa',
    '--st-text-on-accent':   luminance(accent) > 0.4 ? '#000' : '#fff',
    '--st-accent':           accent,
    '--st-accent-hover':     `color-mix(in srgb, ${accent} 88%, black)`,
    '--st-accent-bg':        `color-mix(in srgb, ${accent} 10%, transparent)`,
    '--st-accent-border':    `color-mix(in srgb, ${accent} 40%, transparent)`,
    '--st-accent-border-light': `color-mix(in srgb, ${accent} 30%, transparent)`,
    '--st-toggle-off':       dark ? '#52525b' : '#d4d4d8',
    '--st-shadow-sticky':    dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
    '--st-danger':           dark ? '#f87171' : '#dc2626',
  }
}

/** TanStack filterFn for `{ operator, value }` filter values (Postgres-style operators, see FILTER_OPERATORS). */
export function operatorFilterFn(row, columnId, filterValue) {
  if (!filterValue || typeof filterValue !== 'object') return true
  const { operator, value } = filterValue
  if (!operator || value === '' || value == null) return true

  const cellValue = row.getValue(columnId)
  const cellStr = cellValue == null ? '' : String(cellValue)
  const v = String(value)
  const cellNum = Number(cellValue)
  const valNum = Number(v)
  const bothNumeric = cellValue != null && cellStr !== '' && !isNaN(cellNum) && !isNaN(valNum)

  switch (operator) {
    case '=': return cellStr === v
    case '<>': return cellStr !== v
    case '>': return bothNumeric ? cellNum > valNum : cellStr > v
    case '<': return bothNumeric ? cellNum < valNum : cellStr < v
    case '>=': return bothNumeric ? cellNum >= valNum : cellStr >= v
    case '<=': return bothNumeric ? cellNum <= valNum : cellStr <= v
    case '~~': return cellStr.includes(v)
    case '!~~*': return cellValue != null && !cellStr.toLowerCase().includes(v.toLowerCase())
    case 'in': return v.split(',').map((s) => s.trim()).includes(cellStr)
    case 'is': {
      const k = v.toLowerCase()
      if (k === 'null') return cellValue == null
      if (k === 'not null') return cellValue != null
      if (k === 'true') return cellValue === true
      if (k === 'false') return cellValue === false
      return true
    }
    default: return cellStr.toLowerCase().includes(v.toLowerCase()) // '~~*'
  }
}

/** Resolve a TanStack updater against the previous value. */
export function applyUpdater(updater, prev) {
  return typeof updater === 'function' ? updater(prev) : updater
}

/**
 * When rows are deselected in the table, the parent-owned `additionalSelectedRowIds` must drop them too.
 * Returns the stripped id list, or null when nothing changed.
 */
export function stripDeselectedAdditional(prev, next, additionalIds) {
  if (!additionalIds?.length) return null
  const removed = new Set(Object.keys(prev).filter((k) => !next[k]))
  if (removed.size === 0) return null
  const kept = additionalIds.filter((id) => !removed.has(String(id)))
  return kept.length === additionalIds.length ? null : kept
}

/** Clipboard write with a textarea fallback (insecure contexts / unfocused documents). */
export function copyText(text) {
  if (navigator.clipboard && document.hasFocus()) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
}

/** Calls `handler` on a pointerdown outside `elRef`'s element. Replaces @vueuse/core's onClickOutside. */
export function onClickOutside(elRef, handler) {
  const listener = (e) => {
    const el = unref(elRef)
    if (el && !e.composedPath().includes(el)) handler(e)
  }
  onMounted(() => document.addEventListener('pointerdown', listener, true))
  onUnmounted(() => document.removeEventListener('pointerdown', listener, true))
}

/** Row originals without internal staging fields. */
function exportRows(rows) {
  return rows.map(({ __stagedId, ...rest }) => rest)
}

/** CSV (RFC 4180 quoting) or TSV text for row objects; keys of the first row become the header. */
export function toDelimited(rows, sep = ',') {
  const data = exportRows(rows)
  const headers = Object.keys(data[0] || {})
  const cell = (v) => {
    const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
    if (sep === '\t') return s.replace(/[\t\n\r]/g, ' ')
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers.map(cell).join(sep), ...data.map((r) => headers.map((h) => cell(r[h])).join(sep))].join('\n')
}

/** One `INSERT` statement per row. */
export function toSqlInserts(rows, tableName) {
  const data = exportRows(rows)
  const headers = Object.keys(data[0] || {})
  const lit = (v) => {
    if (v == null) return 'NULL'
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
    return `'${s.replace(/'/g, "''")}'`
  }
  return data
    .map((r) => `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${headers.map((h) => lit(r[h])).join(', ')});`)
    .join('\n')
}

export function toJson(rows) {
  return JSON.stringify(exportRows(rows), null, 2)
}
