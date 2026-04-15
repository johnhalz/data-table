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
  col.accessor('coordinate_system_type', {
    header: 'coordinate_system_type',
    meta: { type: 'varchar', isNullable: true },
    size: 200,
    enableSorting: true,
    enableColumnFilter: true,
  }),
]
