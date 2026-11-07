import { memo } from 'react'
import { cn } from '@timui/core'

export type Citation = {
  id: string
  title: string
  href: string
  source?: string
}

export type CitationListProps = {
  items: Citation[]
  className?: string
}

export const CitationList = memo(function CitationList({ items, className }: CitationListProps) {
  if (!items.length) return null

  return (
    <section data-slot="citation-list" className={cn('grid gap-2 text-sm', className)}>
      <h3 className="text-xs font-medium text-muted-foreground">Sources</h3>
      <ol className="grid gap-2">
        {items.map((item, index) => (
          <li key={item.id} className="rounded-md border px-3 py-2 leading-6">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {index + 1}. {item.title}
            </a>
            {item.source ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">{item.source}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
})

CitationList.displayName = 'CitationList'
