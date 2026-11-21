import { useEffect, useRef, useState } from 'react'
import { useDT } from './context.js'

const NUMERIC = ['int8', 'int4', 'float8']
const inputStyle = { backgroundColor: 'var(--st-bg-input)', border: '1px solid var(--st-border-secondary)', color: 'var(--st-text)' }
const lockedStyle = { ...inputStyle, color: 'var(--st-text-secondary)' }

/** Slide-in insert / update form. `mode` is 'insert' | 'update'. */
export default function RowEditPanel({ mode, rowData = null, table, tableName = 'table', onSave, onClose }) {
  const { themeVars = {} } = useDT()
  const columns = table.getAllColumns().map((col) => ({ id: col.id, meta: col.columnDef.meta || {} }))
  // In insert mode, exclude columns with meta.insertable === false
  const visible = mode === 'insert' ? columns.filter((c) => c.meta.insertable !== false) : columns

  const [form, setForm] = useState(() => {
    const data = {}
    for (const col of columns) {
      if (mode === 'update' && rowData) data[col.id] = rowData[col.id] ?? ''
      else if (col.meta.defaultValue !== undefined) data[col.id] = col.meta.defaultValue
      else data[col.id] = col.meta.type === 'boolean' ? false : ''
    }
    return data
  })
  const set = (id, value) => setForm((f) => ({ ...f, [id]: value }))

  function save() {
    const payload = { ...form }
    for (const col of columns) {
      const numeric = NUMERIC.includes(col.meta.type)
      // The form shows NULL as '' — send null back rather than turning NULLs into empty strings.
      if (payload[col.id] === '') {
        if (numeric || (mode === 'update' && rowData?.[col.id] == null)) payload[col.id] = null
      } else if (numeric) {
        payload[col.id] = Number(payload[col.id])
      }
    }
    onSave?.(payload)
  }

  const saveRef = useRef(save)
  saveRef.current = save
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') saveRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function field(col, optional) {
    const locked = col.meta.readOnly && mode === 'insert'
    let control
    if (col.meta.type === 'boolean') {
      control = (
        <button
          type="button"
          role="switch"
          aria-checked={!!form[col.id]}
          aria-label={col.id}
          className={`flex items-center gap-2${locked ? ' opacity-50 cursor-not-allowed' : ''}`}
          disabled={locked}
          onClick={() => !locked && set(col.id, !form[col.id])}
        >
          <span className="inline-block w-8 h-[18px] rounded-full relative transition-colors" style={{ backgroundColor: form[col.id] ? 'var(--st-accent)' : 'var(--st-toggle-off)' }}>
            <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform ${form[col.id] ? 'left-[17px]' : 'left-[2px]'}`} />
          </span>
          <span className="text-xs" style={{ color: 'var(--st-text-secondary)' }}>{form[col.id] ? 'true' : 'false'}</span>
        </button>
      )
    } else if (locked || (!optional && col.meta.isPrimaryKey && mode === 'update')) {
      control = <input aria-label={col.id} value={form[col.id] ?? ''} className="w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed" style={lockedStyle} disabled readOnly />
    } else {
      control = (
        <textarea
          aria-label={col.id}
          value={form[col.id] ?? ''}
          className="w-full rounded px-3 py-2 text-[13px] outline-none resize-y min-h-[36px]"
          style={inputStyle}
          rows={1}
          placeholder={col.meta.placeholder ?? (optional ? 'NULL' : '')}
          onChange={(e) => set(col.id, e.target.value)}
        />
      )
    }
    return (
      <div key={col.id} className="mb-4">
        <div className="flex items-start gap-4">
          <div className="w-40 shrink-0 pt-2">
            <div className="text-[13px] font-medium" style={{ color: 'var(--st-text)' }}>{col.id}</div>
            <div className="text-xs" style={{ color: 'var(--st-text-tertiary)' }}>{col.meta.type}</div>
          </div>
          <div className="flex-1">{control}</div>
        </div>
      </div>
    )
  }

  const required = visible.filter((c) => c.meta.isNullable === false)
  const optional = visible.filter((c) => c.meta.isNullable !== false)

  return (
    <div
      role="dialog"
      aria-label={`${mode === 'insert' ? 'Insert row into' : 'Update row from'} ${tableName}`}
      className="slide-panel-enter w-[420px] shrink-0 flex flex-col shadow-2xl overflow-hidden"
      style={{ ...themeVars, backgroundColor: 'var(--st-bg)', borderLeft: '1px solid var(--st-border)' }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--st-border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--st-text)' }}>{mode === 'insert' ? 'Insert row into' : 'Update row from'}</span>
          <code className="rounded px-2 py-0.5 text-[13px]" style={lockedStyle}>{tableName}</code>
        </div>
        <button type="button" aria-label="Close" className="w-6 h-6 flex items-center justify-center" style={{ color: 'var(--st-text-tertiary)' }} onClick={() => onClose?.()}>
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4">
        {required.length > 0 && <div className="mb-6">{required.map((c) => field(c, false))}</div>}
        {optional.length > 0 && (
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-medium" style={{ color: 'var(--st-text)' }}>Optional Fields</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--st-text-tertiary)' }}>These are columns that do not need any value</p>
            </div>
            {optional.map((c) => field(c, true))}
          </div>
        )}
      </div>

      <div className="px-5 py-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--st-border)' }}>
        <button type="button" className="px-3 py-1.5 rounded text-[13px] transition-colors" style={{ border: '1px solid var(--st-border-secondary)', color: 'var(--st-text-secondary)' }} onClick={() => onClose?.()}>
          Cancel
        </button>
        <button type="button" className="px-3 py-1.5 rounded text-[13px] font-medium transition-colors flex items-center gap-1.5" style={{ backgroundColor: 'var(--st-accent)', color: 'var(--st-text-on-accent)' }} onClick={save}>
          Save
          <span className="opacity-60 flex items-center gap-0.5" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" /></svg>
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg>
          </span>
        </button>
      </div>
    </div>
  )
}
