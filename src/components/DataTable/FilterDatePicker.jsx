import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDT } from './context.js'

/** Native date/time input in a small popup; writes back the filter's string form. */
export default function FilterDatePicker({ value = '', columnType = 'date', onUpdate }) {
  const { themeVars = {} } = useDT()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  // colorScheme drives the native picker's chrome
  const colorScheme = themeVars['--st-bg']?.startsWith('#1') ? 'dark' : 'light'
  const pickerType = columnType === 'time' || columnType === 'timetz' ? 'time' : columnType === 'date' ? 'date' : 'datetime-local'
  // datetime-local uses "YYYY-MM-DDTHH:MM"; the filter stores "YYYY-MM-DD HH:MM:SS"
  const nativeValue = !value ? '' : pickerType === 'datetime-local' ? value.replace(' ', 'T').slice(0, 16) : value.slice(0, pickerType === 'time' ? 5 : 10)
  const rect = open ? triggerRef.current?.getBoundingClientRect() : null

  return (
    <div className="relative flex items-center">
      <button
        ref={triggerRef}
        type="button"
        className="flex items-center justify-center w-4 h-4 rounded transition-colors shrink-0"
        style={{ color: open ? 'var(--st-accent)' : 'var(--st-text-placeholder)' }}
        title="Pick date/time"
        aria-label="Pick date/time"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
      >
        {pickerType === 'time' ? (
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7-3.25a.75.75 0 00-1.5 0v3.5c0 .27.144.518.378.651l2.5 1.5a.75.75 0 10.744-1.302L8.5 7.742V4.75z" /></svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h-2a.25.25 0 00-.25.25V6h10.5V3.75a.25.25 0 00-.25-.25h-2V5a.75.75 0 01-1.5 0V3.5h-5V5a.75.75 0 01-1.5 0V3.5zM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5H2.5z" /></svg>
        )}
      </button>
      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="data-table-root fixed z-50"
              style={{ ...themeVars, top: rect ? rect.bottom + 6 + 'px' : '0', left: rect ? rect.left + 'px' : '0' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-lg shadow-xl p-3" style={{ backgroundColor: 'var(--st-bg-surface)', border: '1px solid var(--st-border-secondary)' }}>
                <input
                  type={pickerType}
                  defaultValue={nativeValue}
                  className="outline-none rounded px-2 py-1.5 text-[13px]"
                  style={{ backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)', colorScheme }}
                  onChange={(e) => {
                    const v = e.target.value
                    onUpdate?.(!v ? '' : pickerType === 'datetime-local' ? v.replace('T', ' ') + ':00' : v)
                    setOpen(false)
                  }}
                />
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  )
}
