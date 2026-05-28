import fs from 'fs'
import path from 'path'
import {
  RegistryItem,
  registryItemSchema,
  registryPayloadSchema,
  type JsonValue,
} from '@timui/core'
import { z } from 'zod'

import { sha256OfString } from './checksum'
import { fetchJsonWithRetry, fetchTextWithRetry } from './http'

const REGISTRY_URL = process.env.REGISTRY_URL || 'https://ui.timkit.cn'
const CLI_PACKAGE_JSON = require('../../package.json')
const CLI_VERSION: string = CLI_PACKAGE_JSON.version || '0.0.0'

function getRegistryBases(override?: string): string[] {
  if (override) return [override]
  const mirrors = process.env.REGISTRY_MIRRORS || process.env.REGISTRY_MIRROR_URLS || ''
  const mirrorList = mirrors
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)
  return [REGISTRY_URL, ...mirrorList]
}

type RegistryPayloadRecord = Record<string, JsonValue> & {
  checksum?: string
  minCliVersion?: string
}

const registryItemsSchema = z.array(registryItemSchema)

function isRegistryPayloadRecord(
  payload: RegistryItem[] | RegistryPayloadRecord
): payload is RegistryPayloadRecord {
  return !Array.isArray(payload)
}

function verifyChecksum(payload: RegistryPayloadRecord): boolean {
  if (!payload?.checksum) return true
  const { checksum, ...rest } = payload
  const raw = JSON.stringify(rest, null, 2)
  return sha256OfString(raw) === checksum
}

export function validateRegistryPayload(
  payload: RegistryItem[] | RegistryPayloadRecord
): RegistryItem[] {
  const parsed = registryPayloadSchema.safeParse(payload)
  if (parsed.success) {
    const isValidChecksum = verifyChecksum(parsed.data as RegistryPayloadRecord)
    if (parsed.data.checksum && !isValidChecksum) {
      throw new Error('Registry checksum mismatch')
    }
    if (parsed.data.minCliVersion && !isVersionGte(CLI_VERSION, parsed.data.minCliVersion)) {
      throw new Error(
        `Registry requires CLI >= ${parsed.data.minCliVersion}, current ${CLI_VERSION}. Please upgrade.`
      )
    }
    return parsed.data.items
  }

  const fallbackItems = registryItemsSchema.safeParse(
    isRegistryPayloadRecord(payload) ? payload.items : payload
  )
  if (!fallbackItems.success) {
    throw new Error('Invalid registry payload format')
  }

  if (isRegistryPayloadRecord(payload)) {
    const isValidChecksum = verifyChecksum(payload)
    if (payload.checksum && !isValidChecksum) {
      throw new Error('Registry checksum mismatch')
    }
    if (payload.minCliVersion && !isVersionGte(CLI_VERSION, payload.minCliVersion)) {
      throw new Error(
        `Registry requires CLI >= ${payload.minCliVersion}, current ${CLI_VERSION}. Please upgrade.`
      )
    }
  }

  return fallbackItems.data
}

function parseRegistryPayload(raw: string): RegistryItem[] {
  const parsedJson = JSON.parse(raw) as RegistryItem[] | RegistryPayloadRecord
  return validateRegistryPayload(parsedJson)
}

function parseLocalRegistryItems(raw: string): RegistryItem[] {
  const parsed = JSON.parse(raw) as { items?: RegistryItem[] }
  if (!Array.isArray(parsed.items)) {
    throw new Error('Local registry-all.json must contain an items array of registry components.')
  }
  return parsed.items
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

function findLocalRegistryAll(startDir = process.cwd()): string | undefined {
  let current = path.resolve(startDir)
  while (true) {
    const candidates = [
      path.join(current, 'registry-all.json'),
      path.join(current, 'apps/docs/data/registry-all.json'),
    ]
    const found = candidates.find((candidate) => fs.existsSync(candidate))
    if (found) return found

    const parent = path.dirname(current)
    if (parent === current) return undefined
    current = parent
  }
}

export async function loadRegistryIndex(registryBase?: string): Promise<RegistryItem[]> {
  const baseCandidates = getRegistryBases(registryBase)
  // Prefer local registry-all.json if present
  const localRegistryAll = findLocalRegistryAll()
  if (localRegistryAll) {
    return parseLocalRegistryItems(fs.readFileSync(localRegistryAll, 'utf-8'))
  }

  let lastError: Error | null = null
  for (const base of baseCandidates) {
    const normalized = base.replace(/\/$/, '')
    // Try index (lighter) else fallback to registry-all
    const indexUrl = `${normalized}/registry-index.json`
    try {
      const raw = await fetchTextWithRetry(indexUrl)
      const items = parseRegistryPayload(raw)
      return items
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e))
      const allUrl = `${normalized}/registry-all.json`
      try {
        const raw = await fetchTextWithRetry(allUrl)
        const items = parseRegistryPayload(raw)
        return items
      } catch (e2) {
        lastError = e2 instanceof Error ? e2 : new Error(String(e2))
        continue
      }
    }
  }
  throw lastError ?? new Error('Failed to load registry index from all bases')
}

export async function loadRegistryItem(name: string, registryBase?: string): Promise<RegistryItem> {
  const baseCandidates = getRegistryBases(registryBase)
  let lastError: Error | null = null
  for (const base of baseCandidates) {
    const normalized = base.replace(/\/$/, '')
    const itemUrl = `${normalized}/registry/${name}.json`
    try {
      return await fetchJsonWithRetry<RegistryItem>(itemUrl)
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e))
      continue
    }
  }
  throw lastError ?? new Error(`Failed to fetch registry item ${name}`)
}
