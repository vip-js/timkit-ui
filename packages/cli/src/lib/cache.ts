import fs from 'fs'
import os from 'os'
import path from 'path'

const CACHE_DIR = path.join(os.homedir(), '.timkit', 'cache')
const REGISTRY_INDEX_CACHE = path.join(CACHE_DIR, 'registry-index.json')
const REGISTRY_ITEMS_DIR = path.join(CACHE_DIR, 'items')

// Ensure cache dirs exist
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true })
if (!fs.existsSync(REGISTRY_ITEMS_DIR)) fs.mkdirSync(REGISTRY_ITEMS_DIR, { recursive: true })

const ONE_hour = 60 * 60 * 1000

export const registryCache = {
  getIndex: () => {
    if (!fs.existsSync(REGISTRY_INDEX_CACHE)) return null
    try {
      const stat = fs.statSync(REGISTRY_INDEX_CACHE)
      if (Date.now() - stat.mtimeMs > ONE_hour) return null // Expired
      return JSON.parse(fs.readFileSync(REGISTRY_INDEX_CACHE, 'utf-8'))
    } catch {
      return null
    }
  },
  setIndex: (data: any) => {
    try {
      fs.writeFileSync(REGISTRY_INDEX_CACHE, JSON.stringify(data), 'utf-8')
    } catch (e) {
      console.warn('Failed to write registry index to cache', e)
    }
  },
  getItem: (name: string) => {
    const itemPath = path.join(REGISTRY_ITEMS_DIR, `${name}.json`)
    if (!fs.existsSync(itemPath)) return null
    try {
      // Items are less likely to change frequently, maybe longer TTL or reliance on overwrite?
      // For now, let's say 24 hours for items? Or just keep them?
      // Let's rely on explicit updates or shorter TTL for safety.
      const stat = fs.statSync(itemPath)
      if (Date.now() - stat.mtimeMs > ONE_hour * 24) return null // 24 hours
      return JSON.parse(fs.readFileSync(itemPath, 'utf-8'))
    } catch {
      return null
    }
  },
  setItem: (name: string, data: any) => {
    const itemPath = path.join(REGISTRY_ITEMS_DIR, `${name}.json`)
    try {
      fs.writeFileSync(itemPath, JSON.stringify(data), 'utf-8')
    } catch (e) {
      console.warn(`Failed to write component ${name} to cache`, e)
    }
  },
  clear: () => {
    try {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true })
    } catch {}
  },
}
