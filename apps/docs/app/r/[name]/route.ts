import { NextResponse } from 'next/server'

import { loadRegistryItemFromData } from '@/lib/registry-index'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{ name: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params
  const name = decodeURIComponent(params.name).replace(/\.json$/, '')
  const item = loadRegistryItemFromData(name)

  if (!item) {
    return NextResponse.json({ error: `Registry item "${name}" not found` }, { status: 404 })
  }

  return NextResponse.json(item, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  })
}
