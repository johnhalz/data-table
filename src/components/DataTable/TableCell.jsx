import { useLayoutEffect, useRef, useState } from 'react'
import { useDT } from './context.js'

const EMPTY_META = {}
const clamp = (n) => Math.min(100, Math.max(0, n))
const isNullish = (v) => v === null || v === undefined
/** Same as Vue's `{{ }}` interpolation: objects/arrays print as JSON. */
const display = (v) => (v !== null && typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v))
const NullText = ({ children = 'NULL' }) => (
  <span className="italic" style={{ color: 'var(--st-text-placeholder)' }}>{children}</span>
)

// Progress bar: meta.progressBar = true | { min, max } | ((value, row) => number 0–100)
function progressPercentOf(m, value, row) {
  if (!m.progressBar || isNullish(value)) return null
  if (typeof m.progressBar === 'function') return clamp(m.progressBar(value, row))
  if (typeof m.progressBar === 'object') {
    const { min = 0, max = 100 } = m.progressBar
    return clamp(((value - min) / (max - min)) * 100)
  }
  return clamp(Number(value)) // true: value is already 0–100
}

// Plain text color: meta.textColor = (value, row) => string | { color, label? } | null | false
function textColorOf(m, value, row) {
  if (typeof m.textColor !== 'function') return null
  const cfg = m.textColor(value, row)
  if (cfg == null || cfg === false) return null
  let color, explicitLabel
  if (typeof cfg === 'string') color = cfg
  else if (typeof cfg === 'object') ({ color, label: explicitLabel } = cfg)
  else return null
  if (!color) return null
  const hasExplicit = explicitLabel != null && String(explicitLabel) !== ''
  return {
    color,
    text: hasExplicit ? String(explicitLabel) : isNullish(value) ? 'NULL' : String(value),
    nullStyle: isNullish(value) && !hasExplicit,
  }
}

// Badge: meta.badge = true | { color?, label? } | (value, row) => { color?, label? } | null | false
function badgeOf(m, value, row) {
  if (!m.badge) return null
  let config = m.badge
  if (typeof config === 'function') {
    config = config(value, row)
    if (config == null || config === false) return null
  } else if (config === true) config = {}
  else if (typeof config !== 'object') return null
  const color = config.color ?? null
  const style = color
    ? { backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)` }
    : { backgroundColor: 'var(--st-border-secondary)', color: 'var(--st-text)', border: '1px solid var(--st-border)' }
  const text =
    config.label != null && config.label !== ''
      ? String(config.label)
      : isNullish(value)
        ? 'NULL'
        : typeof value === 'boolean'
          ? value ? 'True' : 'False'
          : String(value)
  return { style, text }
}

// meta.secondaryText = string | (value, row) => string | null — line below primary (plain text cells only)
function secondaryOf(m, value, row) {
  if (m.secondaryText == null || m.secondaryText === '') return null
  const s = typeof m.secondaryText === 'function' ? m.secondaryText(value, row) : m.secondaryText
  if (s == null) return null
  const t = String(s).trim()
  return t === '' ? null : t
}

export default function TableCell({ cell, isSelected = false, onSelect, onUpdate, onEditingChange, onContextMenu }) {
  const {
    editable,
    showRowBorders = true,
    showColumnBorders = true,
    cellButtonVisibility = 'hover',
    cellOverflow = 'truncate',
    getCellPendingState = () => null,
    getCellPreviousValue = () => undefined,
    getRowPendingState = () => null,
  } = useDT()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const textareaRef = useRef(null)

  const m = cell.column.columnDef.meta ?? EMPTY_META
  const value = cell.getValue()
  const row = cell.row.original
  const rowId = cell.row.id
  const colId = cell.column.id

  const isCellModified = getCellPendingState(rowId, colId) === 'modified'
  const previousValue = getCellPreviousValue(rowId, colId)
  const isRowDeleted = getRowPendingState(rowId) === 'delete'
  const useBooleanToggle = m.type === 'boolean' && !m.badge
  const progressPercent = progressPercentOf(m, value, row)
  // Segmented progress: meta.segmentedBar = (value, row) => { segments: { color, count, label }[], total }
  const segmented = typeof m.segmentedBar === 'function' ? m.segmentedBar(value, row) ?? null : null
  const overflowMode = m.overflow || (m.multiline ? 'wrap' : cellOverflow || 'truncate')
  const cellButtons = m.cellButtons ?? []
  const textColor = textColorOf(m, value, row)
  const badge = badgeOf(m, value, row)
  const suffixIcon = !m.suffixIcon ? null : typeof m.suffixIcon === 'function' ? m.suffixIcon(value, row) || null : m.suffixIcon
  const secondary = secondaryOf(m, value, row)
  const showSecondary = !!secondary && (isNullish(value) || !badge)

  const cellButtonClass =
    cellButtonVisibility === 'always' ? 'opacity-100' : cellButtonVisibility === 'select' ? (isSelected ? 'opacity-100' : 'opacity-0') : 'opacity-0 group-hover/row:opacity-100'

  function autoResize() {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = ta.scrollHeight + 'px'
    }
  }

  useLayoutEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
      autoResize()
    }
  }, [isEditing])

  function setEditing(on) {
    setIsEditing(on)
    onEditingChange?.(on)
  }

  function handleDoubleClick() {
    if (typeof m.dblClick === 'function') {
      m.dblClick(row)
      return
    }
    if (!editable?.update || useBooleanToggle || m.progressBar || m.segmentedBar || cellButtons.length > 0) return
    setEditValue(value ?? '')
    setEditing(true)
  }

  function saveEdit() {
    let newValue = editValue
    if (m.type === 'int8' || m.type === 'int4' || m.type === 'float8') {
      const raw = String(newValue).trim()
      newValue = raw === '' ? null : Number(raw)
      if (Number.isNaN(newValue)) return // keep the editor open on invalid numbers
    }
    const unchanged = newValue === value || (newValue === '' && value == null)
    if (!unchanged) onUpdate?.(newValue)
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      setEditing(false)
    }
  }

  let content
  if (useBooleanToggle) {
    content = editable?.update ? (
      <button
        type="button"
        role="switch"
        aria-checked={!!value}
        className="flex items-center gap-1.5"
        onClick={(e) => {
          e.stopPropagation()
          onUpdate?.(!value)
        }}
      >
        <span className="inline-block w-7 h-4 rounded-full relative transition-colors" style={{ backgroundColor: value ? 'var(--st-accent)' : 'var(--st-toggle-off)' }}>
          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${value ? 'left-3.5' : 'left-0.5'}`} />
        </span>
        <span className="text-xs" style={{ color: 'var(--st-text-secondary)' }}>{value ? 'true' : 'false'}</span>
      </button>
    ) : (
      <span className="text-[13px]" style={{ color: 'var(--st-text)' }}>
        {isNullish(value) ? <NullText /> : value ? 'true' : 'false'}
      </span>
    )
  } else if (isEditing) {
    content = (
      <>
        <textarea
          ref={textareaRef}
          value={editValue}
          className="w-full rounded px-1.5 py-1 text-[13px] resize-none outline-none"
          style={{ backgroundColor: 'var(--st-bg-input)', color: 'var(--st-text)', border: '1px solid var(--st-accent)' }}
          rows={1}
          onChange={(e) => {
            setEditValue(e.target.value)
            autoResize()
          }}
          onKeyDown={handleKeyDown}
        />
        <div
          className="absolute -bottom-7 left-0 flex items-center gap-1 rounded shadow-lg px-2 py-1 z-20 text-xs whitespace-nowrap"
          style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}
        >
          <button type="button" className="flex items-center gap-0.5" style={{ color: 'var(--st-accent)' }} onClick={(e) => { e.stopPropagation(); saveEdit() }}>
            &#8629; Save
          </button>
          <span style={{ color: 'var(--st-text-placeholder)' }}>|</span>
          <button type="button" className="flex items-center gap-0.5" style={{ color: 'var(--st-text-secondary)' }} onClick={(e) => { e.stopPropagation(); setEditing(false) }}>
            Esc Cancel
          </button>
        </div>
      </>
    )
  } else if (segmented) {
    content =
      segmented.total === 0 ? (
        <div className="flex items-center min-w-0">
          <span className="italic text-[13px]" style={{ color: 'var(--st-text-placeholder)' }}>—</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded-full overflow-hidden flex shrink-0 flex-nowrap" style={{ height: '6px', width: '80px', backgroundColor: 'var(--st-border-secondary)' }}>
            {segmented.segments.map((seg) => (
              <div
                key={seg.label}
                className="h-full shrink-0"
                style={{ width: segmented.total > 0 ? `${clamp((seg.count / segmented.total) * 100)}%` : '0%', backgroundColor: seg.color }}
              />
            ))}
          </div>
          <div className="flex flex-col shrink-0" style={{ gap: '1px' }}>
            {segmented.segments.map((seg) => (
              <span key={seg.label} className="text-[11px] leading-snug tabular-nums whitespace-nowrap" style={{ color: 'var(--st-text-secondary)' }}>
                {seg.count} {seg.label}
              </span>
            ))}
          </div>
        </div>
      )
  } else if (progressPercent !== null) {
    content = (
      <div className="flex items-center gap-2" role="progressbar" aria-valuenow={Math.round(progressPercent)} aria-valuemin={0} aria-valuemax={100}>
        <div className="flex-1 rounded-full overflow-hidden" style={{ height: '6px', backgroundColor: 'var(--st-border-secondary)' }}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%`, backgroundColor: 'var(--st-accent)' }} />
        </div>
        <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--st-text-secondary)' }}>{Math.round(progressPercent)}%</span>
      </div>
    )
  } else {
    let primary
    if (badge) {
      primary = (
        <span className="inline-flex shrink-0 self-start items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-tight" style={badge.style}>
          {badge.text}
        </span>
      )
    } else if (textColor) {
      const style = textColor.nullStyle ? { color: 'var(--st-text-placeholder)' } : { color: textColor.color }
      primary =
        overflowMode === 'wrap' ? (
          <span className={`block whitespace-pre-wrap break-words tabular-nums${textColor.nullStyle ? ' italic' : ''}`} style={style}>{textColor.text}</span>
        ) : (
          <span className={`truncate block tabular-nums${textColor.nullStyle ? ' italic' : ''}`} title={textColor.text} style={style}>{textColor.text}</span>
        )
    } else if (isNullish(value)) {
      primary = <NullText />
    } else if (overflowMode === 'wrap') {
      primary = <span className="block whitespace-pre-wrap break-words">{display(value)}</span>
    } else {
      primary = <span className="truncate block" title={String(value)}>{display(value)}</span>
    }

    content = (
      <div
        className={showSecondary ? 'flex items-start gap-1 min-w-0' : 'flex items-center gap-1 min-w-0'}
        style={isRowDeleted ? { textDecoration: 'line-through', opacity: 0.5 } : undefined}
      >
        <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-[13px]" style={{ color: 'var(--st-text)' }}>
          {primary}
          {showSecondary && (
            <span
              className={`block text-[11px] leading-snug ${overflowMode === 'wrap' ? 'whitespace-pre-wrap break-words' : 'truncate'}`}
              style={{ color: 'var(--st-text-secondary)' }}
              title={overflowMode === 'wrap' ? undefined : secondary}
            >
              {secondary}
            </span>
          )}
        </div>
        {suffixIcon && (
          <span
            className="w-3.5 h-3.5 shrink-0 flex items-center justify-center"
            style={{ color: suffixIcon.color || 'var(--st-text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: suffixIcon.svg }}
          />
        )}
        {cellButtons.length > 0 && (
          <div className={`flex items-center gap-0.5 shrink-0 ${cellButtonClass}`}>
            {cellButtons.map((btn, i) => (
              <button
                key={i}
                type="button"
                className={`flex items-center justify-center rounded transition-colors ${btn.icon ? 'w-5 h-5 shrink-0' : 'h-5 px-1.5 shrink-0 text-[11px] font-medium whitespace-nowrap'}`}
                style={{ color: 'var(--st-text-secondary)' }}
                title={btn.label}
                aria-label={btn.icon ? btn.label : undefined}
                onClick={(e) => {
                  e.stopPropagation()
                  btn.onClick(row)
                }}
              >
                {btn.icon ? <span className="w-3.5 h-3.5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: btn.icon }} /> : <span>{btn.label}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      role="cell"
      className="px-2 py-1.5 relative cursor-default align-middle"
      style={{
        display: 'table-cell',
        width: `${cell.column.getSize()}px`,
        minWidth: `${cell.column.getSize()}px`,
        maxWidth: `${cell.column.getSize()}px`,
        overflow: 'hidden',
        borderBottom: showRowBorders ? '1px solid var(--st-border)' : 'none',
        borderRight: showColumnBorders ? '1px solid var(--st-border)' : 'none',
        boxShadow: isSelected && !isEditing ? 'inset 0 0 0 2px var(--st-accent)' : isCellModified ? 'inset 3px 0 0 var(--st-accent)' : 'none',
        zIndex: isEditing ? 20 : isSelected ? 10 : 'auto',
      }}
      title={isCellModified && previousValue !== undefined ? `Was: ${previousValue === null || previousValue === '' ? '(empty)' : previousValue}` : undefined}
      onClick={() => {
        if (!isEditing) onSelect?.()
      }}
      onDoubleClick={handleDoubleClick}
      onContextMenu={onContextMenu}
    >
      {content}
    </div>
  )
}
