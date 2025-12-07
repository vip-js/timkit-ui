import type { RegistryItem } from '@timui/core'

import { getIndexItems } from '@/lib/registry-data'
import { loadRegistryItemFromData } from '@/lib/registry-index'

export function getItemsByCategory(categorySlug: string): RegistryItem[] {
  const indexItems = getIndexItems()
  return indexItems
    .filter((item) => item.categories?.some((c) => c.toLowerCase() === categorySlug.toLowerCase()))
    .map((item) => loadRegistryItemFromData(item.name) || item) as RegistryItem[]
}
