import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Blocks,
  Bot,
  FileCode2,
  Github,
  Layers3,
  Smartphone,
  Terminal,
} from 'lucide-react'

import { getCategories } from '@/lib/catalog'
import { SubscribeBottom } from '@/components/subscribe-form'
import SupportedFrameworks from '@/components/supported-frameworks'

const capabilities = [
  {
    title: 'Agent SDK and registry',
    description: '@timui/agent, JSON endpoints, llms.txt, and CLI plans for coding agents.',
    href: '/agents',
    icon: Bot,
  },
  {
    title: 'Mobile block library',
    description: 'Composable app sections with safe-area spacing and 44px touch targets.',
    href: '/blocks',
    icon: Blocks,
  },
  {
    title: 'Installable templates',
    description: 'Complete mobile pages delivered as source through registry:page items.',
    href: '/templates',
    icon: FileCode2,
  },
]

export default function Page() {
  const categories = getCategories()
  const componentCount = categories.reduce(
    (total, category) => total + category.components.length,
    0
  )

  return (
    <div data-home className="relative">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            alt="Timkit UI mobile app templates"
            className="h-full w-full object-cover opacity-30 saturate-[0.86] dark:opacity-20"
            fill
            priority
            sizes="100vw"
            src="/layouts/app-1.png"
          />
          <div className="absolute inset-0 bg-background/88" />
        </div>

        <div className="ued-shell relative grid min-h-[68dvh] content-center gap-10 py-14 md:py-16 lg:grid-cols-[0.9fr_0.72fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="ued-eyebrow bg-background/85 backdrop-blur">
              <Smartphone className="size-4" />
              Mobile-first UI registry for agents
            </div>
            <h1 className="mt-7 max-w-4xl font-heading text-5xl font-semibold tracking-normal text-foreground md:text-6xl">
              Timkit UI
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              A source-distributed component, block, and template library for AI apps, chat
              builders, CLI workflows, coding agents, and shadcn-compatible registries.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="ued-primary-action" href="/agents">
                Open agent contract
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <a
                className="ued-secondary-action bg-background/85"
                href="https://github.com/vip-js/tmikit-ui"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="mr-2 size-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="ued-panel bg-background/86 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bot className="size-4 text-primary" />
                Agent composition loop
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                  Prompt: mobile AI workspace with chat, tools, and preview.
                </div>
                <div className="rounded-lg border bg-card px-3 py-2">
                  Plan: page template + agent chat block + verified registry URLs.
                </div>
                <div className="rounded-lg bg-foreground px-3 py-2 text-background">
                  Output: install commands, typed metadata, starter code, checks.
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Components', value: `${componentCount}+` },
                { label: 'Frameworks', value: '4' },
                { label: 'Agent APIs', value: 'SDK + CLI' },
              ].map((item) => (
                <div key={item.label} className="ued-card bg-background/86 p-4 backdrop-blur">
                  <p className="text-xl font-semibold tracking-normal">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ued-band py-5">
        <div className="ued-shell grid gap-4 md:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} className="ued-card group p-5" href={item.href}>
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-primary" />
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <h2 className="mt-6 text-lg font-semibold tracking-normal">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="px-4 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-primary">
                <Layers3 className="size-4" />
                Component catalog
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal">
                Cross-platform base UI
              </h2>
            </div>
            <Link className="ued-secondary-action" href="/components">
              Browse components
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 12).map((category) => (
              <CategoryCard
                key={category.slug}
                componentsCount={category.components.length}
                isNew={category.isNew}
                name={category.name}
                slug={category.slug}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="ued-band px-4 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SupportedFrameworks />
        </div>
      </section>

      <section className="px-4 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Terminal className="size-4" />
            Registry CLI
          </div>
          <pre className="ued-panel overflow-x-auto px-4 py-3 text-sm">
            <code>npx shadcn@latest add https://ui.timkit.cn/r/commerce-home-01.json</code>
          </pre>
          <SubscribeBottom />
        </div>
      </section>
    </div>
  )
}

type CategoryCardProps = {
  slug: string
  name: string
  componentsCount: number
  isNew?: boolean
}

function CategoryCard({ slug, name, componentsCount, isNew = false }: CategoryCardProps) {
  const href = `/components/${slug}`
  const thumbSlug = slug === 'calendar' || slug === 'date-picker' ? 'calendar-date-picker' : slug
  const imageBasePath = `/thumbs/${thumbSlug}`

  return (
    <Link className="ued-card group overflow-hidden" href={href}>
      <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted">
        {isNew && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            New
          </span>
        )}
        <Image
          alt={`${name} components`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 dark:hidden"
          height={198}
          src={`${imageBasePath}.png`}
          width={268}
        />
        <Image
          alt={`${name} components dark theme`}
          className="hidden h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 dark:block"
          height={198}
          src={`${imageBasePath}-dark.png`}
          width={268}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold tracking-normal">{name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{componentsCount} examples</p>
      </div>
    </Link>
  )
}
