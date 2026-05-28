import Link from 'next/link'
import type { JsonValue, RegistryItem } from '@timui/core'
import { ArrowRight, Blocks, Smartphone, Terminal } from 'lucide-react'

import { getRegistryIndexItems } from '@/lib/registry-index'
import PageHeader from '@/components/page-header'
import RuntimePreview from '@/components/runtime-preview'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

const categoryLabels: Record<string, string> = {
  'mobile-agent': 'Mobile Agent',
  'mobile-commerce': 'Mobile Commerce',
  'mobile-finance': 'Mobile Finance',
  authentication: 'Authentication',
}

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

const getCategory = (item: RegistryItem) => {
  const value = item.meta?.category
  if (typeof value === 'string') return value
  return item.categories?.[0] || 'blocks'
}

const getPreviewPath = (item: RegistryItem) => {
  const value = item.meta?.previewPath
  return typeof value === 'string' ? value : undefined
}

export default function BlocksPage() {
  const blocks = getRegistryIndexItems()
    .filter((item) => item.type === 'registry:block' && item.meta?.isActive !== false)
    .sort((a, b) => getCategory(a).localeCompare(getCategory(b)) || a.name.localeCompare(b.name))

  const grouped = blocks.reduce<Record<string, RegistryItem[]>>((acc, item) => {
    const category = getCategory(item)
    acc[category] ||= []
    acc[category].push(item)
    return acc
  }, {})

  return (
    <main className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Installable Blocks"
          title="Mobile UI blocks for agents and CLI workflows"
        >
          Production-shaped React sections that agents can install, compose, and adapt without
          inventing layout from scratch.
        </PageHeader>

        <section className="grid gap-4 border-y py-6 md:grid-cols-3">
          {[
            { label: 'Registry type', value: 'registry:block', icon: Blocks },
            { label: 'Mobile contract', value: '44px taps + safe area', icon: Smartphone },
            { label: 'CLI install', value: 'shadcn add URL', icon: Terminal },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-lg border bg-card p-4">
                <Icon className="size-5 text-primary" />
                <p className="mt-4 text-xs font-medium uppercase tracking-normal text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            )
          })}
        </section>

        <div className="mt-10 grid gap-10">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="scroll-mt-20">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-normal">
                    {categoryLabels[category] || category}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {items.length} installable block{items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <code className="hidden rounded-md border bg-muted px-3 py-2 text-xs md:block">
                  curl https://ui.timkit.cn/agent-index.json
                </code>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <BlockCard key={item.name} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

function BlockCard({ item }: { item: RegistryItem }) {
  const frameworks = getStringArray(item.meta?.frameworks)
  const tags = getStringArray(item.meta?.tags)

  return (
    <article className="rounded-lg border bg-card p-4 shadow-sm">
      {getPreviewPath(item) ? (
        <div className="mb-4 overflow-hidden rounded-lg border bg-background">
          <RuntimePreview
            className="relative min-h-[360px] w-full overflow-hidden bg-background"
            componentName={item.name}
            componentPath={getPreviewPath(item)}
            framework="react"
            props={{}}
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-normal">{item.name}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {item.description || 'Installable Timkit block'}
          </p>
        </div>
        <Link
          aria-label={`Open registry JSON for ${item.name}`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          href={`/r/${item.name}.json`}
        >
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {frameworks.map((framework) => (
          <span key={framework} className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
            {framework}
          </span>
        ))}
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md border px-2 py-1 text-xs font-medium">
            {tag}
          </span>
        ))}
      </div>
      <code className="mt-4 block overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
        npx shadcn@latest add https://ui.timkit.cn/r/{item.name}.json
      </code>
    </article>
  )
}
