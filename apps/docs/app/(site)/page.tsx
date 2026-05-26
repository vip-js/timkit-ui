import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Blocks, Bot, FileCode2, Github, Smartphone, Terminal } from 'lucide-react'

import { getCategories } from '@/lib/catalog'
import { SubscribeBottom } from '@/components/subscribe-form'
import SupportedFrameworks from '@/components/supported-frameworks'

const capabilities = [
  {
    title: 'Agent-native registry',
    description: 'JSON endpoints, item shortcuts, llms.txt, and CLI filters for coding agents.',
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
            className="h-full w-full object-cover opacity-35 dark:opacity-25"
            fill
            priority
            sizes="100vw"
            src="/layouts/app-1.png"
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>

        <div className="relative mx-auto flex min-h-[58dvh] max-w-7xl flex-col justify-center px-4 py-12 md:px-8 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg border bg-background/80 px-3 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              <Smartphone className="size-4" />
              Mobile-first UI registry for agents
            </div>
            <h1 className="mt-6 max-w-4xl font-heading text-5xl font-bold tracking-normal text-foreground md:text-7xl">
              Timkit UI
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              A source-distributed component, block, and template library built for mobile apps,
              shadcn-compatible registries, and CLI-driven agent workflows.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                href="/agents"
              >
                Open agent contract
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <a
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border bg-background/80 px-5 text-sm font-semibold transition-colors hover:bg-muted"
                href="https://github.com/vip-js/tmikit-ui"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="mr-2 size-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3">
            {[
              { label: 'Components', value: `${componentCount}+` },
              { label: 'Frameworks', value: '4' },
              { label: 'Agent endpoints', value: '4' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-background/80 p-4 backdrop-blur"
              >
                <p className="text-2xl font-semibold tracking-normal">{item.value}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-5">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                className="group rounded-lg border bg-card p-5 shadow-sm transition-colors hover:bg-muted/40"
                href={item.href}
              >
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

      <section className="px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-primary">
                Component catalog
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                Cross-platform base UI
              </h2>
            </div>
            <Link
              className="inline-flex min-h-[44px] items-center rounded-lg border px-4 text-sm font-semibold transition-colors hover:bg-muted"
              href="/components"
            >
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

      <section className="border-y px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <SupportedFrameworks />
        </div>
      </section>

      <section className="px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Terminal className="size-4" />
            Registry CLI
          </div>
          <pre className="overflow-x-auto rounded-lg border bg-card px-4 py-3 text-sm">
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
  const imageBasePath = `/thumbs/${slug}`

  return (
    <Link
      className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-colors hover:bg-muted/40"
      href={href}
    >
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
