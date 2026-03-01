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
    <div className="my-8 w-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.16)]">
      <div className="border-b border-border/60 bg-muted/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </div>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b border-border/60 bg-muted/30 transition-colors">
            <th className="h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[150px]">
              Prop
            </th>
            <th className="h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[200px]">
              Type
            </th>
            <th className="h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[150px]">
              Default
            </th>
            <th className="h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground [&:has([role=checkbox])]:pr-0">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((prop) => (
            <tr
              key={prop.name}
              className="border-b border-border/60 transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
            >
              <td className="p-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs font-semibold text-foreground">
                {prop.name}
                {prop.required && <span className="ml-1 text-red-500">*</span>}
              </td>
              <td className="p-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="rounded-full bg-muted px-2 py-0.5">{prop.type}</span>
                </div>
              </td>
              <td className="p-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs text-muted-foreground">
                {prop.default ? (
                  <span className="rounded-full bg-muted px-2 py-0.5">{prop.default}</span>
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
