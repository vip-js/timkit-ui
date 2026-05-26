import Link from 'next/link'
import { ArrowRight, Bot, Code2, Database, Terminal } from 'lucide-react'

import PageHeader from '@/components/page-header'

export const dynamic = 'force-static'

const endpoints = [
  ['Registry index', '/registry-index.json'],
  ['Full registry', '/registry-all.json'],
  ['Agent index', '/agent-index.json'],
  ['LLM guide', '/llms.txt'],
]

const commands = [
  'curl https://ui.timkit.cn/agent-index.json',
  'curl https://ui.timkit.cn/r/commerce-home-01.json',
  'npx shadcn@latest add https://ui.timkit.cn/r/commerce-home-01.json',
  'npx shadcn@latest add https://ui.timkit.cn/r/mobile-agent-console.json',
]

export default function AgentsPage() {
  return (
    <main className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader eyebrow="Agent Contract" title="Timkit UI for coding agents and CLIs">
          A registry surface that can be discovered, filtered, fetched, and installed by agents
          without scraping docs pages.
        </PageHeader>

        <section className="grid gap-4 border-y py-6 lg:grid-cols-4">
          {[
            { label: 'Discover', value: 'registry-index.json', icon: Database },
            { label: 'Install', value: 'shadcn add URL', icon: Terminal },
            { label: 'Compose', value: 'blocks + pages', icon: Code2 },
            { label: 'Adapt', value: 'mobile rules', icon: Bot },
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

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-lg border bg-card p-5">
            <h2 className="text-xl font-semibold tracking-normal">Machine-readable endpoints</h2>
            <div className="mt-5 grid gap-3">
              {endpoints.map(([label, href]) => (
                <Link
                  key={href}
                  className="flex min-h-[52px] items-center justify-between rounded-lg border px-4 text-sm transition-colors hover:bg-muted"
                  href={href}
                >
                  <span className="font-medium">{label}</span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {href}
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <h2 className="text-xl font-semibold tracking-normal">CLI primitives</h2>
            <div className="mt-5 grid gap-3">
              {commands.map((command) => (
                <code
                  key={command}
                  className="block overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs"
                >
                  {command}
                </code>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border bg-card p-5">
          <h2 className="text-xl font-semibold tracking-normal">Agent selection policy</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ['Complete screen', 'Use registry:page templates first.'],
              ['Flow section', 'Use registry:block items and preserve declared dependencies.'],
              ['Primitive control', 'Use registry:ui components with framework filtering.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border bg-background p-4">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
