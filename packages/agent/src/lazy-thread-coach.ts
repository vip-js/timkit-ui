import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

type ThreadCoachModule = typeof import('./thread-coach')

const moduleUrl = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url)
const require = createRequire(moduleUrl)

let cache: ThreadCoachModule | undefined

export const loadThreadCoach = (): ThreadCoachModule => {
  if (cache) return cache
  const base = dirname(moduleUrl)
  for (const file of ['thread-coach.js', 'thread-coach.ts', 'thread-coach.mjs']) {
    try {
      cache = require(join(base, file)) as ThreadCoachModule
      return cache
    } catch {
      // try next extension (dist vs vitest source)
    }
  }
  throw new Error(
    'Cannot load @timui/agent thread-coach. Reinstall the package or run from a built dist/ (missing thread-coach chunk).'
  )
}
