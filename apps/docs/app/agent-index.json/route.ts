import { NextResponse } from 'next/server'
import { TimkitAgent } from '@timui/agent'
import type { JsonValue, RegistryItem } from '@timui/core'

import { getRegistryIndexItems } from '@/lib/registry-index'

export const runtime = 'nodejs'

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

const getMetaString = (item: RegistryItem, key: string): string | undefined => {
  const value = item.meta?.[key]
  return typeof value === 'string' ? value : undefined
}

export function GET() {
  const items = getRegistryIndexItems()
  const publicItems = items.filter((item) => item.meta?.isActive !== false)
  const agent = new TimkitAgent({
    registryItems: publicItems,
    registryBaseUrl: 'https://ui.timkit.cn',
    defaultFramework: 'react',
  })
  const mobileItems = publicItems.filter((item) => {
    const tags = getStringArray(item.meta?.tags)
    const viewport = getMetaString(item, 'viewport') || ''
    return tags.includes('mobile') || viewport.includes('mobile')
  })

  const payload = {
    name: '@timui/agent-index',
    homepage: 'https://ui.timkit.cn',
    registryIndex: 'https://ui.timkit.cn/registry-index.json',
    registryAll: 'https://ui.timkit.cn/registry-all.json',
    itemUrlTemplate: 'https://ui.timkit.cn/r/{name}.json',
    sdk: {
      package: '@timui/agent',
      import: "import { TimkitAgent } from '@timui/agent'",
      capabilities: [
        'listComponents',
        'searchComponents',
        'getComponentMetadata',
        'plan',
        'generateComponent',
        'validateComponent',
        'createSession',
      ],
    },
    commands: {
      inspect: 'curl https://ui.timkit.cn/agent-index.json',
      fetchItem: 'curl https://ui.timkit.cn/r/{name}.json',
      shadcnAdd: 'npx shadcn@latest add https://ui.timkit.cn/r/{name}.json',
      localTimkitList: 'pnpm --filter @timui/cli exec timkit list --mobile --json',
      agentPlan:
        'pnpm --filter @timui/cli exec timkit agent plan "build a mobile agent console" --mobile --json',
      agentInspect: 'pnpm --filter @timui/cli exec timkit agent inspect button --json',
    },
    interactionModes: {
      chat: {
        entry: 'Ask for an app screen, flow section, or primitive UI control in natural language.',
        promptShape:
          'Build a mobile SaaS dashboard with stats, task list, command input, and bottom navigation.',
        selectionPolicy:
          'Prefer registry:page for complete screens, registry:block for sections, registry:ui for primitives.',
      },
      cli: {
        list: 'pnpm --filter @timui/cli exec timkit list --mobile --framework react --json',
        install: 'npx shadcn@latest add https://ui.timkit.cn/r/{name}.json',
      },
      agent: {
        discover: 'GET /agent-index.json, then GET /registry-index.json',
        fetchSource: 'GET /r/{name}.json',
        sdkPlan:
          'const plan = new TimkitAgent({ registryItems }).plan({ prompt, framework: "react", mobile: true })',
        verify:
          'Run pnpm goal:acceptance, pnpm goal:test:preview:protocol, and pnpm goal:test:docs:canonical after changes.',
      },
    },
    counts: {
      total: publicItems.length,
      ui: publicItems.filter((item) => item.type === 'registry:ui').length,
      blocks: publicItems.filter((item) => item.type === 'registry:block').length,
      templates: publicItems.filter((item) => item.type === 'registry:page').length,
      mobile: mobileItems.length,
    },
    recommendedMobile: mobileItems.slice(0, 24).map((item) => ({
      name: item.name,
      type: item.type,
      category: getMetaString(item, 'category') || item.categories?.[0],
      frameworks: getStringArray(item.meta?.frameworks),
      url: `https://ui.timkit.cn/r/${item.name}.json`,
    })),
    recommendedAgentPlan: agent.plan({
      prompt:
        'Build a modern mobile AI agent console with chat, tools, task timeline, and app preview.',
      framework: 'react',
      mode: 'agent',
      mobile: true,
    }),
    previewContract: {
      protocol: 'LOAD_PREVIEW',
      frameworks: ['react', 'vue', 'html'],
      consistency:
        'Docs resolve demo names through the same canonical source rules before loading runtime previews.',
    },
  }

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  })
}
