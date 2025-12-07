import { ComponentProps } from 'react'

interface PropDefinition {
  name: string
  type: string
  default?: string
  description?: string
  required?: boolean
}

interface ApiTableProps {
  data: PropDefinition[]
  title?: string
}

export function ApiTable({ data, title = 'Props' }: ApiTableProps) {
  if (!data?.length) return null

  return (
    <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
      <table className="w-full caption-bottom text-sm">
        {/* <caption className="p-4 text-left font-medium text-muted-foreground">{title}</caption> */}
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[150px]">
              Prop
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[200px]">
              Type
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[150px]">
              Default
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((prop) => (
            <tr
              key={prop.name}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <td className="p-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs font-semibold text-primary">
                {prop.name}
                {prop.required && <span className="ml-1 text-red-500">*</span>}
              </td>
              <td className="p-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="rounded bg-muted px-1.5 py-0.5">{prop.type}</span>
                </div>
              </td>
              <td className="p-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs text-muted-foreground">
                {prop.default ? (
                  <span className="rounded bg-muted px-1.5 py-0.5">{prop.default}</span>
                ) : (
                  <span className="text-muted-foreground/50">-</span>
                )}
              </td>
              <td className="p-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground">
                {prop.description || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
