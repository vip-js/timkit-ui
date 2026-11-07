import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { AgentRecipeFile } from './recipes-types'

type TemplatesModule = typeof import('./recipes-templates')

const moduleUrl = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url)
const require = createRequire(moduleUrl)

let cache: TemplatesModule | undefined

/** Vitest injects the source module because Node cannot require `.ts` chunks. */
export const __setRecipeTemplatesForTests = (mod: TemplatesModule) => {
  cache = mod
}

const loadTemplates = (): TemplatesModule => {
  if (cache) return cache
  const base = dirname(moduleUrl)
  for (const file of ['recipes-templates.js', 'recipes-templates.ts', 'recipes-templates.mjs']) {
    try {
      cache = require(join(base, file)) as TemplatesModule
      return cache
    } catch {
      // try next extension (dist vs vitest source)
    }
  }
  throw new Error(
    'Cannot load @timui/agent recipe templates. Reinstall the package or run from a built dist/ (missing recipes-templates chunk).'
  )
}

export const resolveRecipeFile = (
  id: string,
  framework: 'react' | 'vue'
): AgentRecipeFile | undefined => loadTemplates().getRecipeFile(id, framework)
