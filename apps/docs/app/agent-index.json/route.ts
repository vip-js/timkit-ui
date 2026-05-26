import { NextResponse } from 'next/server'
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
    commands: {
      inspect: 'curl https://ui.timkit.cn/agent-index.json',
      fetchItem: 'curl https://ui.timkit.cn/r/{name}.json',
      shadcnAdd: 'npx shadcn@latest add https://ui.timkit.cn/r/{name}.json',
      localTimkitList: 'pnpm --filter @timui/cli exec timkit list --mobile --json',
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
  }

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  })
}
