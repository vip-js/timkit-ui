import registryIndex from '@/data/registry-index.json'
import type { RegistryItem } from '@timui/core'

// Lightweight helpers to avoid importing full registry-all on the server.

export function getIndexItems(): RegistryItem[] {
  return (registryIndex.items || []) as RegistryItem[]
}

export function getUiItems(): RegistryItem[] {
  return getIndexItems().filter(
    (item) => item.type === 'registry:ui' || item.type === 'registry:component'
  )
}
