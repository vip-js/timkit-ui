'use client'

import { DataTable } from '@timui/react'

const columns = [{ id: 'name', header: 'Name' }]
const rows = [
  { id: '2', cells: { name: 'Grace' } },
  { id: '1', cells: { name: 'Ada' } },
]

export default function Component() {
  return (
    <div className="grid gap-8">
      <DataTable caption="People" columns={columns} rows={rows} />
      <DataTable caption="Empty" columns={columns} rows={[]} emptyLabel="Nothing here" />
    </div>
  )
}
