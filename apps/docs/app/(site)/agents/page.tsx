import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Braces,
  CheckCircle2,
  Code2,
  Database,
  FileCode2,
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
  'pnpm --filter @timui/cli exec timkit agent plan "build a mobile agent console" --mobile --json',
  'pnpm --filter @timui/cli exec timkit list --mobile --framework react --json',
  'npx shadcn@latest add https://ui.timkit.cn/r/mobile-agent-console.json',
]

const sdkExample = `import { TimkitAgent } from '@timui/agent'

const agent = new TimkitAgent({ registryItems })
const plan = agent.plan({
  prompt: 'Build a mobile AI workspace with chat, tool calls, and preview',
  framework: 'react',
  mode: 'agent',
  mobile: true,
})

const code = agent.generateComponent({
  name: plan.selected[0].name,
  framework: plan.framework,
})`

export default function AgentsPage() {
  return (
    <main className="py-8 md:py-12">
      <div className="ued-shell">
        <section className="grid max-w-full gap-8 overflow-hidden border-b pb-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="min-w-0 max-w-full">
            <div className="ued-eyebrow">
              <Bot className="size-4" />
              Agent-native UI system
            </div>
            <h1 className="mt-6 max-w-full break-words font-heading text-4xl font-semibold tracking-normal text-foreground md:text-6xl">
              Timkit UI for chat, CLI, coding agents, and AI app builders
            </h1>
            <p className="mt-5 max-w-full break-words text-base leading-8 text-muted-foreground md:text-lg">
              用同一份 registry 源码和 @timui/agent SDK 支撑聊天式需求拆解、CLI 命令编排、Agent
              自动检索、代码生成与落地校验。React、Vue、HTML、WeApp 的选择规则保持一致。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="ued-primary-action w-full sm:w-auto" href="/agent-index.json">
                Inspect contract
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link className="ued-secondary-action w-full sm:w-auto" href="/llms.txt">
                Read llms.txt
              </Link>
            </div>
          </div>

          <div className="grid min-w-0 max-w-full gap-3">
            <div className="ued-panel p-4">
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
              <div className="ued-panel p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Terminal className="size-4 text-emerald-600" />
                  CLI path
                </div>
                <code className="mt-4 block overflow-x-auto rounded-md bg-zinc-950 px-3 py-2 text-xs leading-5 text-zinc-50">
                  npx shadcn@latest add https://ui.timkit.cn/r/mobile-agent-console.json
                </code>
              </div>
              <div className="ued-panel p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Braces className="size-4 text-sky-600" />
                  Agent JSON
                </div>
                <pre className="ued-kbd mt-4 overflow-x-auto">
                  <code>{'{ type: "registry:page", frameworks: ["react", "vue"] }'}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-b py-8 md:grid-cols-4">
          {[
            { label: 'Discover', value: 'registry-index.json', icon: Database },
            { label: 'Plan', value: '@timui/agent SDK', icon: Bot },
            { label: 'Install', value: 'timkit agent CLI', icon: Terminal },
            { label: 'Compose', value: 'pages + blocks + ui', icon: Code2 },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="ued-card p-4">
                <Icon className="size-5 text-primary" />
                <p className="mt-4 text-xs font-medium uppercase tracking-normal text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            )
          })}
        </section>

        <section className="grid gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Agent build workflow</h2>
            <div className="mt-5 grid gap-3">
              {workflow.map(([step, title, body]) => (
                <div key={step} className="ued-card flex gap-3 p-4">
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

          <div>
            <h2 className="text-2xl font-semibold tracking-normal">CLI primitives</h2>
            <div className="mt-5 grid gap-3">
              {commands.map((command) => (
                <code key={command} className="ued-kbd block overflow-x-auto">
                  {command}
                </code>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-t py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <FileCode2 className="size-4" />
              Programmable Agent SDK
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              One API for chat sessions, CLI plans, and code agents
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              @timui/agent exposes registry search, component metadata, install planning, starter
              code generation, validation hints, and multi-turn chat state. Agents can stop scraping
              prose pages and operate on stable typed contracts.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-lg border bg-zinc-950 px-4 py-4 text-xs leading-5 text-zinc-50 shadow-sm">
            <code>{sdkExample}</code>
          </pre>
        </section>

        <section className="grid gap-8 border-t py-10 lg:grid-cols-[0.85fr_1.15fr]">
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
                className="ued-card flex min-h-16 items-center justify-between px-4 text-sm"
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

        <section className="border-t py-10">
          <h2 className="text-2xl font-semibold tracking-normal">Acceptance gates</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ['Preview protocol', 'React and Vue both use LOAD_PREVIEW runtime messages.'],
              ['Framework parity', 'Demo source resolution is canonical across frameworks.'],
              [
                'Performance budget',
                'Registry size and preview lazy loading are checked by goal scripts.',
              ],
            ].map(([title, body]) => (
              <div key={title} className="ued-card p-4">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
          <div className="ued-panel mt-5 flex items-center gap-2 px-4 py-3 text-sm">
            <Play className="size-4 text-primary" />
            <code>pnpm goal:acceptance && pnpm goal:test:preview:protocol</code>
          </div>
        </section>
      </div>
    </main>
  )
}
