import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Braces,
  CheckCircle2,
  Code2,
  Database,
  MessagesSquare,
  Play,
  Search,
  Terminal,
} from 'lucide-react'

export const dynamic = 'force-static'

const endpoints = [
  ['Registry index', '/registry-index.json', '可筛选的轻量目录'],
  ['Full registry', '/registry-all.json', '含源码的完整数据'],
  ['Agent index', '/agent-index.json', '面向 Agent 的契约'],
  ['LLM guide', '/llms.txt', '模型上下文入口'],
]

const workflow = [
  ['1', 'Parse intent', '识别页面、区块、原子组件和目标框架'],
  ['2', 'Select source', '优先 registry:page，再 fallback 到 block 或 ui'],
  ['3', 'Install code', '通过 shadcn URL 或 timkit CLI 拉取源码'],
  ['4', 'Verify', '运行 typecheck、preview protocol 和 framework parity'],
]

const commands = [
  'curl https://ui.timkit.cn/agent-index.json',
  'pnpm --filter @timui/cli exec timkit list --mobile --framework react --json',
  'npx shadcn@latest add https://ui.timkit.cn/r/mobile-agent-console.json',
  'npx shadcn@latest add https://ui.timkit.cn/r/commerce-home-01.json',
]

export default function AgentsPage() {
  return (
    <main className="px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-6 border-b pb-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="min-w-0">
            <div className="inline-flex min-h-[36px] items-center gap-2 rounded-lg border bg-background px-3 text-xs font-semibold text-primary shadow-sm">
              <Bot className="size-4" />
              Agent-native UI system
            </div>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold tracking-normal text-foreground md:text-6xl">
              Timkit UI for chat, CLI, and coding agents
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              用同一份 registry 源码支撑三类入口：聊天式需求拆解、CLI 安装命令、Agent
              自动检索和落地代码。React、Vue、HTML、WeApp 的 demo 选择规则保持一致。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                href="/agent-index.json"
              >
                Inspect contract
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
                href="/components"
              >
                Browse registry
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border bg-card p-3 shadow-sm">
            <div className="rounded-lg border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MessagesSquare className="size-4 text-primary" />
                  Chat builder
                </div>
                <span className="rounded-md border px-2 py-1 text-[11px] text-muted-foreground">
                  live contract
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                  我需要一个移动端 SaaS 首页，带数据概览、任务列表和底部导航。
                </div>
                <div className="ml-auto max-w-[88%] rounded-lg bg-foreground px-3 py-2 text-background">
                  选择 registry:page 模板，补充 dashboard block，并拉取 React 源码。
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Terminal className="size-4 text-emerald-600" />
                  CLI path
                </div>
                <code className="mt-4 block overflow-x-auto rounded-md bg-zinc-950 px-3 py-2 text-xs text-zinc-50">
                  npx shadcn@latest add https://ui.timkit.cn/r/mobile-agent-console.json
                </code>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Braces className="size-4 text-sky-600" />
                  Agent JSON
                </div>
                <pre className="mt-4 overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
                  <code>{'{ type: "registry:page", frameworks: ["react", "vue"] }'}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-b py-6 md:grid-cols-4">
          {[
            { label: 'Discover', value: 'registry-index.json', icon: Database },
            { label: 'Ask', value: 'chat prompt recipes', icon: MessagesSquare },
            { label: 'Install', value: 'shadcn add URL', icon: Terminal },
            { label: 'Compose', value: 'pages + blocks + ui', icon: Code2 },
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

        <section className="grid gap-6 py-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border bg-card p-5">
            <h2 className="text-xl font-semibold tracking-normal">Agent build workflow</h2>
            <div className="mt-5 grid gap-3">
              {workflow.map(([step, title, body]) => (
                <div key={step} className="flex gap-3 rounded-lg border bg-background p-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    {step}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
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
          </div>
        </section>

        <section className="grid gap-6 border-t py-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Search className="size-4" />
              Machine-readable endpoints
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              Stable URLs for model context
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Agent 不需要抓取页面。它可以先读取目录，再按 item URL 拉取源码，最后根据框架和
              viewport metadata 做选择。
            </p>
          </div>
          <div className="grid gap-3">
            {endpoints.map(([label, href, description]) => (
              <Link
                key={href}
                className="flex min-h-[56px] items-center justify-between rounded-lg border bg-card px-4 text-sm transition-colors hover:bg-muted"
                href={href}
              >
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  {href}
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-xl font-semibold tracking-normal">Acceptance gates</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ['Preview protocol', 'React and Vue both use LOAD_PREVIEW runtime messages.'],
              ['Framework parity', 'Demo source resolution is canonical across frameworks.'],
              [
                'Performance budget',
                'Registry size and preview lazy loading are checked by goal scripts.',
              ],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border bg-background p-4">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm">
            <Play className="size-4 text-primary" />
            <code>pnpm goal:acceptance && pnpm goal:test:preview:protocol</code>
          </div>
        </section>
      </div>
    </main>
  )
}
