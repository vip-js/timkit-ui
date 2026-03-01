'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'

import { cn } from '@/registry/default/lib/utils'

interface TocItem {
  title: string
  url: string
  items?: TocItem[]
}

interface TocProps {
  toc: TocItem[]
}

export function DashboardTableOfContents({ toc }: TocProps) {
  /* Robust Scroll Spy */
  /* Re-implementing with full logic below */

  const [activeId, setActiveId] = useState<string | null>(null)
  const visibleIds = React.useRef<string[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.current = [...visibleIds.current, entry.target.id]
          } else {
            visibleIds.current = visibleIds.current.filter((id) => id !== entry.target.id)
          }
        })

        // Strategy: First visible item in the list order
        // We need to know the order of IDs to pick the "top-most".
        // The `toc` prop gives us the order.
        const allIds = toc.flatMap((item) => [
          item.url.replace('#', ''),
          ...(item.items?.map((sub) => sub.url.replace('#', '')) || []),
        ])

        const activeItem = [...allIds].reverse().find((id) => visibleIds.current.includes(id))

        if (activeItem) {
          setActiveId(activeItem)
        }
      },
      { rootMargin: '0px 0px -50% 0px' }
    )

    const ids = toc.flatMap((item) => [
      item.url.replace('#', ''),
      ...(item.items?.map((sub) => sub.url.replace('#', '')) || []),
    ])

    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
    }
  }, [toc])

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.16)]">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
        On This Page
      </p>
      <ul className="m-0 list-none text-sm space-y-2">
        {toc.map((item, index) => (
          <li key={index} className="mt-0">
            <a
              href={item.url}
              className={cn(
                'relative inline-flex w-full items-center rounded-lg py-1.5 pl-3 pr-2 text-left transition hover:bg-muted/40 hover:text-foreground',
                item.url === `#${activeId}`
                  ? 'bg-muted/60 font-semibold text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <span
                className={cn(
                  'absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-transparent',
                  item.url === `#${activeId}` ? 'bg-primary' : 'bg-muted-foreground/40'
                )}
                aria-hidden="true"
              />
              {item.title}
            </a>
            {item.items?.length ? (
              <ul className="m-0 list-none space-y-1 pt-2 pl-4">
                {item.items.map((subItem, subIndex) => (
                  <li key={subIndex} className="mt-0 pt-1">
                    <a
                      href={subItem.url}
                      className={cn(
                        'relative inline-flex w-full items-center rounded-lg py-1 pl-3 pr-2 text-left text-sm transition hover:bg-muted/40 hover:text-foreground',
                        subItem.url === `#${activeId}`
                          ? 'bg-muted/60 font-semibold text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute left-1.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-muted-foreground/40',
                          subItem.url === `#${activeId}` ? 'bg-primary' : 'bg-muted-foreground/40'
                        )}
                        aria-hidden="true"
                      />
                      {subItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
