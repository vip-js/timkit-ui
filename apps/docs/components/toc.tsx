'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '@timui/shared'

interface TocItem {
  title: string
  url: string
  items?: TocItem[]
}

interface TocProps {
  toc: TocItem[]
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    const headers = document.querySelectorAll('h2, h3')
    headers.forEach((header) => observer.observe(header))

    return () => {
      headers.forEach((header) => observer.unobserve(header))
    }
  }, [])

  return (
    <div className="space-y-2">
      <p className="font-medium text-sm text-foreground">On This Page</p>
      <ul className="m-0 list-none text-sm space-y-1">
        {toc.map((item, index) => (
          <li key={index} className="mt-0 pt-2">
            <a
              href={item.url}
              className={cn(
                'inline-block no-underline transition-colors hover:text-foreground',
                item.url === `#${activeId}`
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <ul className="m-0 list-none pl-4 space-y-1 pt-1">
                {item.items.map((subItem, subIndex) => (
                  <li key={subIndex} className="mt-0 pt-1">
                    <a
                      href={subItem.url}
                      className={cn(
                        'inline-block no-underline transition-colors hover:text-foreground',
                        subItem.url === `#${activeId}`
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
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
