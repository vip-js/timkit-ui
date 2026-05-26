import Link from 'next/link'
import type { JsonValue, RegistryItem } from '@timui/core'
import { ArrowRight, FileCode2, Smartphone, Terminal } from 'lucide-react'

import { getRegistryIndexItems } from '@/lib/registry-index'
import PageHeader from '@/components/page-header'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

const getCategory = (item: RegistryItem) => {
  const value = item.meta?.category
  if (typeof value === 'string') return value
  return item.categories?.[0] || 'templates'
}

export default function TemplatesPage() {
  const templates = getRegistryIndexItems()
    .filter((item) => item.type === 'registry:page' && item.meta?.isActive !== false)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader eyebrow="Page Templates" title="Complete mobile screens, ready for agents">
          Install full app pages with sensible navigation, safe-area handling, and registry
          dependencies already declared for the CLI.
        </PageHeader>

        <section className="grid gap-4 border-y py-6 md:grid-cols-3">
          {[
            { label: 'Registry type', value: 'registry:page', icon: FileCode2 },
            { label: 'Viewport', value: 'mobile-first', icon: Smartphone },
            { label: 'Target path', value: 'app/<name>/page.tsx', icon: Terminal },
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

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((item) => (
            <TemplateCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </main>
  )
}

function TemplateCard({ item }: { item: RegistryItem }) {
  const frameworks = getStringArray(item.meta?.frameworks)
  const tags = getStringArray(item.meta?.tags)

  return (
    <article className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
            {getCategory(item)}
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-normal">{item.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.description || 'Installable Timkit mobile page'}
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
