import 'server-only'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { cache } from 'react'
import type { RegistryItem } from '@timui/core'

import { resolveRegistryAlias } from '@/lib/registry-aliases'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_REGISTRY_DIR = (() => {
  const candidates = [
    path.resolve(process.cwd(), 'data/registry'),
    path.resolve(process.cwd(), 'apps/docs/data/registry'),
    path.resolve(__dirname, '..', 'data/registry'),
  ]
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0]
})()

const DATA_ROOT = (() => {
  const candidates = [
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), 'apps/docs/data'),
    path.resolve(__dirname, '..', 'data'),
  ]
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0]
})()

const REGISTRY_INDEX_PATH = path.join(DATA_ROOT, 'registry-index.json')
const REGISTRY_ALL_PATH = path.join(DATA_ROOT, 'registry-all.json')

const readJsonFile = cache((filePath: string): any => {
  if (!fs.existsSync(filePath)) return null
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
})

const readRegistryIndex = cache((): RegistryItem[] => {
  const data = readJsonFile(REGISTRY_INDEX_PATH) as { items?: RegistryItem[] } | null
  return (data?.items || []) as RegistryItem[]
})

const readRegistryAllMap = cache((): Map<string, RegistryItem> => {
  const data = readJsonFile(REGISTRY_ALL_PATH) as { items?: RegistryItem[] } | null
  const items = (data?.items || []) as RegistryItem[]
  return new Map(items.map((item) => [item.name, item]))
})

/**
 * 读取 data/registry 下的所有 JSON 文件，确保直接使用最新的文件列表。
 * registry-index.json 作为基础数据，文件中的同名项会覆盖旧项，避免缓存导致多端代码缺失。
 */
const readRegistryFromFiles = cache((): RegistryItem[] => {
  if (!fs.existsSync(DATA_REGISTRY_DIR)) return []
  const files = fs.readdirSync(DATA_REGISTRY_DIR).filter((file) => file.endsWith('.json'))
  return files
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(DATA_REGISTRY_DIR, file), 'utf-8')
        return JSON.parse(raw) as RegistryItem
      } catch {
        return null
      }
    })
    .filter((item): item is RegistryItem => Boolean(item?.name))
})

export function getRegistryIndexItems(): RegistryItem[] {
  const indexItems = readRegistryIndex()
  const fileItems = readRegistryFromFiles()

  const merged = new Map<string, RegistryItem>()
  // 1) 基础索引（无 content）
  for (const item of indexItems) merged.set(item.name, item)
  // 2) 本地 data/registry 下最新文件（最高优先级）
  for (const item of fileItems) merged.set(item.name, item)

  // 3) 仅在无法读取本地文件时，回退到 registry-all
  if (!fileItems.length) {
    for (const item of readRegistryAllMap().values()) merged.set(item.name, item)
  }

  return Array.from(merged.values())
}

export function loadRegistryItemFromData(name: string): RegistryItem | null {
  const canonicalName = resolveRegistryAlias(name)
  const itemPath = path.join(DATA_REGISTRY_DIR, `${canonicalName}.json`)
  if (!fs.existsSync(itemPath)) return readRegistryAllMap().get(canonicalName) ?? null
  try {
    const raw = fs.readFileSync(itemPath, 'utf-8')
    return JSON.parse(raw) as RegistryItem
  } catch {
    // fallback: 如果读取失败，至少返回 registry-all 中的内容，避免出现空代码片段
    return readRegistryAllMap().get(canonicalName) ?? null
  }
}
