import fs from 'fs'
import path from 'path'

type RegistryItem = {
  name: string
  type: string
  files?: { path: string; content?: string; type?: string; target?: string }[]
  meta?: Record<string, object>
  categories?: string[]
}

const ROOT = path.resolve(path.join(__dirname, '..'))
const REGISTRY_PATH = path.join(ROOT, 'registry-all.json')
const DOCS_REGISTRY_PATH = path.join(ROOT, 'apps/docs/data/registry-all.json')
const PUBLIC_REGISTRY_PATH = path.join(ROOT, 'apps/docs/public/registry-all.json')

// 映射 Float UI 分类到 shadcn/web 组件名
const CATEGORY_TO_TARGET: Record<string, string> = {
  inputs: 'input',
  alerts: 'alert-dialog',
  buttons: 'button',
}

function loadRegistry(p: string): { items: RegistryItem[]; [key: string]: object } {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

function saveRegistry(p: string, data: object) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2))
}

function migrate() {
  const reg = loadRegistry(REGISTRY_PATH)
  const items: RegistryItem[] = reg.items
  const uiMap = new Map<string, RegistryItem>()
  items
    .filter((i) => i.type === 'registry:ui' || i.type === 'registry:component')
    .forEach((i) => uiMap.set(i.name, i))

  let migratedBlocks = 0
  let skippedMissingTarget = 0

  for (const item of items) {
    if (item.type !== 'registry:block') continue
    const cat = item.meta?.category || item.categories?.[0] || ''
    const target = CATEGORY_TO_TARGET[cat]
    if (!target) continue

    const targetItem = uiMap.get(target)
    if (!targetItem) {
      skippedMissingTarget++
      continue
    }

    // 合并 block 的 files 作为示例，避免重复
    const existingPaths = new Set(targetItem.files?.map((f) => f.path))
    const filesToAdd =
      item.files?.filter((f) => {
        if (!f.path) return false
        if (existingPaths.has(f.path)) return false
        return true
      }) || []

    if (!targetItem.files) targetItem.files = []
    targetItem.files.push(
      ...filesToAdd.map((f) => ({
        ...f,
        type: f.type || 'registry:component',
      }))
    )

    // 标记 block 为非激活，记录来源
    item.meta = {
      ...(item.meta || {}),
      isActive: false,
      migratedTo: target,
    }
    migratedBlocks++
  }

  console.log(`Migrated blocks: ${migratedBlocks}, missing target: ${skippedMissingTarget}`)
  saveRegistry(REGISTRY_PATH, reg)
  saveRegistry(DOCS_REGISTRY_PATH, reg)
  saveRegistry(PUBLIC_REGISTRY_PATH, reg)
}

migrate()
