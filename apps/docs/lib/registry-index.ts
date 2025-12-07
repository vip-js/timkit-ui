import fs from 'fs'
import path from 'path'
import registryIndex from '@/data/registry-index.json'
import type { RegistryItem } from '@timui/core'

const DATA_REGISTRY_DIR = path.resolve(
  process.cwd(),
  process.cwd().endsWith('apps/docs') ? 'data/registry' : 'apps/docs/data/registry'
)

export function getRegistryIndexItems(): RegistryItem[] {
  // registry-index.json 已经去掉了文件内容，适合列表/计数场景
  return (registryIndex.items || []) as RegistryItem[]
}

export function loadRegistryItemFromData(name: string): RegistryItem | null {
  const itemPath = path.join(DATA_REGISTRY_DIR, `${name}.json`)
  if (!fs.existsSync(itemPath)) return null
  try {
    const raw = fs.readFileSync(itemPath, 'utf-8')
    return JSON.parse(raw) as RegistryItem
  } catch {
    return null
  }
}
