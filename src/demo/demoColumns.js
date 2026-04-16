import { createColumnHelper } from '@tanstack/vue-table'

const col = createColumnHelper()

export const employeeColumns = [
  col.accessor('id', {
    header: 'id',
    meta: { type: 'int8', isPrimaryKey: true, isNullable: false },
    size: 80,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('name', {
    header: 'name',
    meta: { type: 'varchar', isNullable: false },
    size: 180,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('role', {
    header: 'role',
    meta: { type: 'varchar', isNullable: false },
    size: 180,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('email', {
    header: 'email',
    meta: { type: 'varchar', isNullable: true },
    size: 240,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('hired', {
    header: 'hired',
    meta: { type: 'varchar', isNullable: true },
    size: 120,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('salary', {
    header: 'salary',
    meta: { type: 'int4', isNullable: true },
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('salary', {
    id: 'salary_bar',
    header: 'salary %',
    meta: {
      type: 'int4',
      isNullable: true,
      // progressBar: maps salary (50k–200k) to 0–100%
      progressBar: (value) => ((value - 50000) / (200000 - 50000)) * 100,
    },
    size: 160,
    enableSorting: true,
    enableColumnFilter: false,
  }),
]

export const columns = [
  col.accessor('id', {
    header: 'id',
    meta: { type: 'int8', isPrimaryKey: true, isNullable: false },
    size: 80,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('store_code', {
    header: 'store_code',
    meta: { type: 'varchar', isNullable: false },
    size: 140,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('name', {
    header: 'name',
    meta: { type: 'varchar', isNullable: false },
    size: 220,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('address', {
    header: 'address',
    meta: { type: 'text', isNullable: true },
    size: 220,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('city', {
    header: 'city',
    meta: { type: 'varchar', isNullable: true },
    size: 150,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('state', {
    header: 'state',
    meta: { type: 'varchar', isNullable: true },
    size: 80,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('zip_code', {
    header: 'zip_code',
    meta: { type: 'varchar', isNullable: true },
    size: 120,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('phone', {
    header: 'phone',
    meta: { type: 'varchar', isNullable: true },
    size: 170,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('is_active', {
    header: 'is_active',
    meta: { type: 'boolean', isNullable: false },
    size: 110,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('opened_at', {
    header: 'opened_at',
    meta: { type: 'timestamp', isNullable: true },
    size: 180,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('open_time', {
    header: 'open_time',
    meta: { type: 'time', isNullable: true },
    size: 120,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('coordinate_system_type', {
    header: 'coordinate_system_type',
    meta: { type: 'varchar', isNullable: true },
    size: 200,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  col.accessor('address', {
    id: 'address_multiline',
    header: 'address (multi)',
    meta: {
      type: 'text',
      isNullable: true,
      multiline: true,
    },
    size: 200,
    enableSorting: false,
    enableColumnFilter: false,
  }),
  col.accessor('phone', {
    id: 'phone_actions',
    header: 'phone (actions)',
    meta: {
      type: 'varchar',
      isNullable: true,
      cellButtons: [
        {
          label: 'Copy',
          icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="5" width="8" height="8" rx="1"/><path d="M3 11V3h8"/></svg>',
          onClick: (row) => navigator.clipboard?.writeText(row.phone),
        },
        {
          label: 'Call',
          icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3.5A1.5 1.5 0 014.5 2h.879a1 1 0 01.958.713l.69 2.414a1 1 0 01-.271 1.003l-.9.9a8.01 8.01 0 003.114 3.114l.9-.9a1 1 0 011.003-.271l2.414.69A1 1 0 0114 10.621V11.5A1.5 1.5 0 0112.5 13C7.253 13 3 8.747 3 3.5z"/></svg>',
          onClick: (row) => console.log('Call', row.phone),
        },
      ],
    },
    size: 200,
    enableSorting: true,
    enableColumnFilter: true,
  }),
]
