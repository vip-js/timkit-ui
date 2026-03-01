import { useState } from 'react'
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@timui/react'

const items = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex.t@company.com',
    location: 'San Francisco, US',
    status: 'Active',
    balance: '$1,250.00',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.c@company.com',
    location: 'Singapore',
    status: 'Active',
    balance: '$600.00',
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'j.wilson@company.com',
    location: 'London, UK',
    status: 'Inactive',
    balance: '$650.00',
  },
  {
    id: '4',
    name: 'Maria Garcia',
    email: 'm.garcia@company.com',
    location: 'Madrid, Spain',
    status: 'Active',
    balance: '$0.00',
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'd.kim@company.com',
    location: 'Seoul, KR',
    status: 'Active',
    balance: '-$1,000.00',
  },
]

export default function Component() {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({})
  const allSelected = items.length > 0 && items.every((item) => selectedRows[item.id])
  const someSelected = items.some((item) => selectedRows[item.id]) && !allSelected

  const toChecked = (value: unknown) =>
    !!((value as { detail?: { checked?: boolean } })?.detail?.checked ?? value)
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <Checkbox
                checked={allSelected || (someSelected && 'indeterminate')}
                onCheckedChange={(value) => {
                  const checked = toChecked(value)
                  setSelectedRows(Object.fromEntries(items.map((item) => [item.id, checked])))
                }}
                onClick={() => {
                  const next = !allSelected
                  setSelectedRows(Object.fromEntries(items.map((item) => [item.id, next])))
                }}
                aria-label="Select all rows"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              data-state={selectedRows[item.id] ? 'selected' : undefined}
              className="has-data-[state=checked]:bg-muted/50"
            >
              <TableCell>
                <Checkbox
                  id={`table-checkbox-${item.id}`}
                  checked={!!selectedRows[item.id]}
                  onCheckedChange={(value) => {
                    const checked = toChecked(value)
                    setSelectedRows((prev) => ({ ...prev, [item.id]: checked }))
                  }}
                  onClick={() => {
                    setSelectedRows((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }}
                  aria-label={`Select ${item.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="text-right">{item.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className="text-muted-foreground mt-4 text-center text-sm">Table with row selection</p>
    </div>
  )
}
