import { useRef, useState } from 'react'
import { useClickOutside } from './context.js'

const CARET = 'M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'
const accent = { backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }

/**
 * Insert button shared by the empty state (and its shape mirrors the toolbar's):
 * plain when there's a label and no `insertActions`, split when both, else an "Insert ▼" dropdown.
 */
export default function InsertMenuButton({ label, insertActions = [], onInsertRow, onInsertAction, onOpenInsertPanel, menuClassName }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))
  const plain = !!label && insertActions.length === 0

  const caret = (
    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
      <path d={CARET} />
    </svg>
  )

  return (
    <div ref={ref} className="relative">
      {plain ? (
        <button type="button" className="flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors" style={accent} onClick={() => onInsertRow()}>
          {label}
        </button>
      ) : label ? (
        <div className="flex items-center">
          <button type="button" className="flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors" style={accent} onClick={() => onInsertRow()}>
            {label}
          </button>
          <button
            type="button"
            aria-label="More insert options"
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center self-stretch px-1.5 rounded-r transition-colors"
            style={{ ...accent, borderLeft: '1px solid var(--st-accent-hover)' }}
            onClick={() => setOpen(!open)}
          >
            {caret}
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors"
          style={accent}
          onClick={() => setOpen(!open)}
        >
          Insert
          {caret}
        </button>
      )}

      {open && (
        <div
          role="menu"
          className={menuClassName ?? 'absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]'}
          style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}
        >
          {insertActions.length > 0 ? (
            insertActions.map((action) => (
              <button
                type="button"
                role="menuitem"
                key={action.key}
                className="w-full flex items-center gap-2 text-left px-3 py-1.5 hover-menu-item"
                style={{ color: 'var(--st-text)' }}
                onClick={() => {
                  onInsertAction(action.key)
                  setOpen(false)
                }}
              >
                {action.icon && (
                  <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: action.icon }} />
                )}
                <span>{action.label}</span>
              </button>
            ))
          ) : (
            <button
              type="button"
              role="menuitem"
              className="w-full text-left px-3 py-1.5 hover-menu-item"
              style={{ color: 'var(--st-text)' }}
              onClick={() => {
                onOpenInsertPanel()
                setOpen(false)
              }}
            >
              Insert row
            </button>
          )}
        </div>
      )}
    </div>
  )
}
