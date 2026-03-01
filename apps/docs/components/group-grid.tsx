'use client'

import { useState } from 'react'
import Link from 'next/link'

import type { UnifiedGroup } from '@/lib/unified-components'
import ComponentCard from '@/components/component-card'
import ComponentExample from '@/components/component-example'

const INITIAL_COUNT = 12
const STEP = 8

export function GroupGrid({ group }: { group: UnifiedGroup }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visibleEntries = group.entries.slice(0, visibleCount)
  const hasMore = visibleCount < group.entries.length

  return (
    <section
      id={group.slug}
      className="space-y-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.22)] sm:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.26em] uppercase">{group.slug}</p>
          <h3 className="text-xl font-semibold">{group.title}</h3>
          <p className="text-muted-foreground text-xs">共 {group.count} 个</p>
        </div>
        <Link href={group.href} className="text-primary text-sm font-medium hover:underline">
          查看详情
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleEntries.map((entry) => (
          <ComponentCard
            key={entry.id}
            component={
              entry.variant === 'registry'
                ? entry.component!
                : {
                    name: entry.id,
                    type: 'registry:component',
                    dependencies: [],
                    files: [],
                    meta: { colSpan: 3 },
                  }
            }
            anchorId={`${group.slug}-${entry.id}`}
            className="h-full"
          >
            {entry.variant === 'registry' && entry.component ? (
              group.slug === 'tree' ? (
                <div className="border-border/70 bg-muted/40 rounded-xl border border-dashed p-4 text-left">
                  <p className="text-foreground text-sm font-semibold">{entry.title}</p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Tree 组件依赖 headless-tree，仅在分类页加载。
                  </p>
                  <Link
                    href={`/${group.slug}`}
                    className="text-primary mt-3 inline-flex text-sm font-medium hover:underline"
                  >
                    前往分类页预览
                  </Link>
                </div>
              ) : (
                <ComponentExample variant="registry" component={entry.component} />
              )
            ) : (
              <div className="border-border/70 bg-muted/40 rounded-xl border p-4 text-left">
                <p className="text-foreground text-sm font-semibold">{entry.title}</p>
                {entry.description ? (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {entry.description}
                  </p>
                ) : null}
                <Link
                  href={group.href}
                  className="text-primary mt-3 inline-flex text-sm font-medium hover:underline"
                >
                  在区块页查看预览
                </Link>
              </div>
            )}
          </ComponentCard>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            className="rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-medium text-foreground shadow-[0_6px_16px_-12px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:border-foreground/30"
            onClick={() => setVisibleCount((v) => v + STEP)}
          >
            加载更多
          </button>
        </div>
      )}
    </section>
  )
}
