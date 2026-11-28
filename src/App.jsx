import { useCallback, useMemo, useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable, MiniTable, MINI_TABLE_PAGE_SIZE } from './components/DataTable'
import { columns, employeeColumns } from './demo/demoColumns.js'
import { stores as initialStores, employeesByStore, pagedEmployees, pagedStoreId } from './demo/demoData.js'

const miniColumn = createColumnHelper().accessor('name', {
  id: 'name',
  header: 'Store name',
  meta: {
    type: 'varchar',
    isNullable: false,
    cellButtons: [{ label: 'Log', onClick: (row) => console.log('[MiniTable demo]', row) }],
  },
  enableSorting: true,
})

/** 3× the stores so infinite scroll has something to page through. */
const miniSource = [0, 1, 2].flatMap((c) => initialStores.map((r) => ({ ...r, id: r.id + c * 1000, store_code: `${r.store_code}-${c}` })))

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [stores, setStores] = useState(initialStores)
  const [staged, setStaged] = useState(false)
  const [miniFilters, setMiniFilters] = useState([])
  const [miniSorting, setMiniSorting] = useState([])
  const [miniLoaded, setMiniLoaded] = useState(MINI_TABLE_PAGE_SIZE)
  const [miniSelected, setMiniSelected] = useState([])

  const miniFiltered = useMemo(() => {
    const q = miniFilters.find((f) => f.value?.operator === '~~*')?.value.value?.toLowerCase() ?? ''
    const list = miniSource.filter((r) => !q || String(r.name).toLowerCase().includes(q))
    const s = miniSorting[0]
    if (s?.id === 'name') list.sort((a, b) => (s.desc ? -1 : 1) * String(a.name).localeCompare(String(b.name)))
    return list
  }, [miniFilters, miniSorting])
  const miniRows = useMemo(() => miniFiltered.slice(0, miniLoaded), [miniFiltered, miniLoaded])
  const loadMore = useCallback(() => setMiniLoaded((n) => n + MINI_TABLE_PAGE_SIZE), [])

  const [paged, setPaged] = useState(pagedEmployees.slice(0, 100))
  // Employees ticked in nested tables, per store: what the toolbar's Open picked button acts on.
  const [picked, setPicked] = useState({})
  const [opened, setOpened] = useState('')
  const pick = (storeId) => (_ids, rows) => setPicked((p) => ({ ...p, [storeId]: rows }))
  const pickedRows = Object.values(picked).flat()
  const getSubTable = useCallback(
    (row) => {
      if (row.id === pagedStoreId) {
        return {
          rows: paged,
          columns: employeeColumns,
          tableName: 'employees',
          showToolbar: false,
          showPagination: true,
          totalCount: pagedEmployees.length,
          onPageChange: ({ pageIndex, pageSize }) => {
            console.log('sub page', pageIndex, pageSize)
            setTimeout(() => setPaged(pagedEmployees.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)), 50)
          },
          onSortChange: () => console.log('sub sort'),
          onSelectionChange: pick(row.id),
        }
      }
      const rows = employeesByStore[row.id]
      return rows ? { rows, columns: employeeColumns, tableName: 'employees', showToolbar: false, showPagination: true, onSelectionChange: pick(row.id) } : null
    },
    [paged],
  )

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-[#1c1c1c] text-white' : 'bg-white text-black'}`}>
      <header className="flex items-center gap-3 px-4 py-2 text-sm">
        <strong>data-table (React)</strong>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Theme: {theme}</button>
        <label>
          <input type="checkbox" checked={staged} onChange={(e) => setStaged(e.target.checked)} /> staged edits
        </label>
        <span>Mini selected: {miniSelected.length}</span>
        <span>Opened: {opened}</span>
      </header>
      <main className="flex flex-1 min-h-0">
        <section className="flex flex-col flex-1 min-w-0">
          <DataTable
            columns={columns}
            rows={stores}
            tableName="stores"
            theme={theme}
            stagedEdits={staged}
            getSubTable={getSubTable}
            subTableColumns={employeeColumns}
            contextMenuActions={[{ key: 'log', label: 'Log row' }, { divider: true }, { key: 'delete-custom', label: 'Delete (custom)' }]}
            onRowAction={(key, row) => console.log('row-action', key, row)}
            toolbarButtons={[{ key: 'open-picked', label: `Open picked (${pickedRows.length})`, disabled: pickedRows.length === 0 }]}
            onToolbarAction={(key) => key === 'open-picked' && setOpened(pickedRows.map((r) => r.id).join(', '))}
            onInsertRow={(row) => row && setStores((s) => [...s, { ...row, id: Math.max(...s.map((r) => r.id)) + 1 }])}
            onUpdateRow={({ id, changes }) => setStores((s) => s.map((r) => (String(r.id) === String(id) ? { ...r, ...changes } : r)))}
            onDeleteRows={(ids) => setStores((s) => s.filter((r) => !ids.includes(String(r.id))))}
            onCommitEdits={(payload, done) => {
              console.log('commit', payload)
              done(true)
            }}
          />
        </section>
        <aside className="flex flex-col w-80 border-l border-neutral-700">
          <MiniTable
            column={miniColumn}
            rows={miniRows}
            tableName="stores"
            theme={theme}
            editable
            hasMore={miniRows.length < miniFiltered.length}
            totalCount={miniFiltered.length}
            countLabelSingular="store"
            countLabelPlural="stores"
            onLoadMore={loadMore}
            onColumnFiltersChange={(f) => {
              setMiniFilters(f)
              setMiniLoaded(MINI_TABLE_PAGE_SIZE)
            }}
            onSortChange={setMiniSorting}
            onSelectionChange={setMiniSelected}
            onSelectAllMatching={() => console.log('select-all-matching')}
          />
        </aside>
      </main>
    </div>
  )
}
