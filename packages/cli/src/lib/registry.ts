import fs from 'fs'
import path from 'path'
import { RegistryItem, registryPayloadSchema } from '@timui/core'

import { sha256OfString } from './checksum'
import { fetchJsonWithRetry, fetchTextWithRetry } from './http'

const REGISTRY_URL = process.env.REGISTRY_URL || 'https://ui.timkit.cn'
const CLI_PACKAGE_JSON = require('../../package.json')
const CLI_VERSION: string = CLI_PACKAGE_JSON.version || '0.0.0'

function getRegistryBases(override?: string): string[] {
  if (override) return [override]
  const mirrors =
    process.env.REGISTRY_MIRRORS || process.env.REGISTRY_MIRROR_URLS || ''
  const mirrorList = mirrors
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)
  return [REGISTRY_URL, ...mirrorList]
}

function verifyChecksum(payload: any): boolean {
  if (!payload?.checksum) return true
  const { checksum, ...rest } = payload
  const raw = JSON.stringify(rest, null, 2)
  return sha256OfString(raw) === checksum
}

export function validateRegistryPayload(payload: any): RegistryItem[] {
  const parsed = registryPayloadSchema.safeParse(payload)
  const items = parsed.success ? parsed.data.items : payload.items || payload
  const isValidChecksum = verifyChecksum(payload)
  if (payload?.checksum && !isValidChecksum) {
    throw new Error('Registry checksum mismatch')
  }
  if (payload?.minCliVersion && !isVersionGte(CLI_VERSION, payload.minCliVersion)) {
    throw new Error(
      `Registry requires CLI >= ${payload.minCliVersion}, current ${CLI_VERSION}. Please upgrade.`
    )
  }
  return items as RegistryItem[]
}

function isVersionGte(current: string, required: string): boolean {
  const cur = current.split('.').map((n) => parseInt(n, 10) || 0)
  const req = required.split('.').map((n) => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(cur.length, req.length); i++) {
    const a = cur[i] ?? 0
    const b = req[i] ?? 0
    if (a > b) return true
    if (a < b) return false
  }
  return true
}

export async function loadRegistryIndex(registryBase?: string): Promise<RegistryItem[]> {
  const baseCandidates = getRegistryBases(registryBase)
  // Prefer local registry-all.json if present
  if (fs.existsSync('registry-all.json')) {
    return JSON.parse(fs.readFileSync('registry-all.json', 'utf-8')).items
  }
  if (fs.existsSync(path.join(process.cwd(), 'apps/docs/data/registry-all.json'))) {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'apps/docs/data/registry-all.json'), 'utf-8')
    ).items
  }

  let lastError: unknown
  for (const base of baseCandidates) {
    const normalized = base.replace(/\/$/, '')
    // Try index (lighter) else fallback to registry-all
    const indexUrl = `${normalized}/registry-index.json`
    try {
      const raw = await fetchTextWithRetry(indexUrl)
      const json = JSON.parse(raw)
      const items = validateRegistryPayload(json)
      return items
    } catch (e) {
      lastError = e
      const allUrl = `${normalized}/registry-all.json`
      try {
        const raw = await fetchTextWithRetry(allUrl)
        const json = JSON.parse(raw)
        const items = validateRegistryPayload(json)
        return items
      } catch (e2) {
        lastError = e2
        continue
      }
    }
  }
  throw lastError ?? new Error('Failed to load registry index from all bases')
}

export async function loadRegistryItem(name: string, registryBase?: string): Promise<RegistryItem> {
  const baseCandidates = getRegistryBases(registryBase)
  let lastError: unknown
  for (const base of baseCandidates) {
    const normalized = base.replace(/\/$/, '')
    const itemUrl = `${normalized}/registry/${name}.json`
    try {
      return await fetchJsonWithRetry(itemUrl)
    } catch (e) {
      lastError = e
      continue
    }
  }
  throw lastError ?? new Error(`Failed to fetch registry item ${name}`)
}
