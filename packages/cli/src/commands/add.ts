import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { RegistryItem } from '@timui/core'
import { Command } from 'commander'
import prompts from 'prompts'
import { z } from 'zod'

import { registryCache } from '../lib/cache'
import { fetchJsonWithRetry } from '../lib/http'
import { validateRegistryPayload } from '../lib/registry'
import { getPackageManager, writeFileSafely } from '../lib/utils'

// Default to production registry, override via ENV
const REGISTRY_BASE_URL = process.env.REGISTRY_URL || 'https://ui.timkit.cn'
const REGISTRY_MIRRORS =
  process.env.REGISTRY_MIRRORS || process.env.REGISTRY_MIRROR_URLS || ''
function readLocalRegistryAll(): RegistryItem[] {
  const candidates = [
    path.join(process.cwd(), 'registry-all.json'),
    path.join(process.cwd(), 'apps/docs/registry-all.json'),
  ]

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue
    try {
      const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8'))
      if (Array.isArray(parsed.items)) return parsed.items
    } catch {
      // ignore parse errors and keep falling back
    }
  }
  return []
}

async function loadRegistryIndex(
  registryUrl?: string,
  localFallback?: RegistryItem[]
): Promise<RegistryItem[]> {
  const bases = registryUrl
    ? [registryUrl]
    : [REGISTRY_BASE_URL].concat(
        REGISTRY_MIRRORS.split(',').map((m) => m.trim()).filter(Boolean)
      )
  try {
    // 1. Try Local File (Monorepo dev override)
    if (fs.existsSync('registry-index.json')) {
      return JSON.parse(fs.readFileSync('registry-index.json', 'utf-8')).items
    }

    // 2. Try Cache
    const cached = registryCache.getIndex()
    if (cached && !registryUrl) {
      return cached.items || cached
    }

    // 3. Network Fetch with mirrors
    let lastError: unknown
    for (const base of bases) {
      const normalized = base.replace(/\/$/, '')
      try {
        const json = await fetchJsonWithRetry(`${normalized}/registry-index.json`)
        const items = validateRegistryPayload(json)
        // 4. Update Cache
        if (!registryUrl) registryCache.setIndex(json)

        return items
      } catch (e) {
        lastError = e
        continue
      }
    }
    throw lastError ?? new Error('Failed to fetch registry index')
  } catch (e) {
    if (localFallback?.length) return localFallback
    console.warn(`Failed to fetch registry, checking for expired cache...`)
    throw e
  }
}

async function loadRegistryItem(
  name: string,
  registryUrl?: string,
  localMap?: Map<string, RegistryItem>
): Promise<RegistryItem> {
  const bases = registryUrl
    ? [registryUrl]
    : [REGISTRY_BASE_URL].concat(
        REGISTRY_MIRRORS.split(',').map((m) => m.trim()).filter(Boolean)
      )
  try {
    // 1. Try Local File
    if (fs.existsSync(`registry/${name}.json`)) {
      return JSON.parse(fs.readFileSync(`registry/${name}.json`, 'utf-8'))
    }

    // 1.a Local fallback from in-memory map
    if (localMap?.has(name)) {
      return localMap.get(name)!
    }

    // 2. Try Cache
    const cached = registryCache.getItem(name)
    if (cached && !registryUrl) {
      return cached
    }

    let lastError: unknown
    for (const base of bases) {
      const normalized = base.replace(/\/registry-index\.json$/, '').replace(/\/$/, '')
      const url = `${normalized}/registry/${name}.json`
      try {
        const data = await fetchJsonWithRetry(url)
        if (!registryUrl) registryCache.setItem(name, data)

        return data
      } catch (e) {
        lastError = e
        continue
      }
    }
    throw lastError ?? new Error(`Failed to fetch component tree for ${name}`)
  } catch (e) {
    if (localMap?.has(name)) return localMap.get(name)!
    throw new Error(`Failed to fetch component tree for ${name}: ${e}`)
  }
}

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  cwd: z.string(),
  yes: z.boolean().default(false),
  force: z.boolean().optional(),
  framework: z.string().optional(),
  path: z.string().optional(),
  registry: z.string().optional(),
})

export const add = new Command()
  .name('add')
  .description('Add a component to your project')
  .argument('[components...]', 'the components to add')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd()
  )
  .option('-f, --force', 'overwrite existing files without prompt', false)
  .option('--framework <framework>', 'filter files by framework (react|vue|svelte|html|weapp)')
  .option(
    '--path <path>',
    'relative output directory (default: src/components/ui)',
    'src/components/ui'
  )
  .option('--registry <url>', 'registry url override')
  .action(async (components, opts) => {
    const options = addOptionsSchema.parse({ components, ...opts })
    const cwd = path.resolve(options.cwd)
    const overwrite = !!options.force || !!options.yes

    const localRegistryItems = readLocalRegistryAll()
    const localRegistryMap = new Map<string, RegistryItem>(
      localRegistryItems.map((i) => [i.name, i])
    )

    // 1. Fetch Registry
    let registryItems: RegistryItem[] = []
    try {
      const index = (await loadRegistryIndex(options.registry, localRegistryItems)) as any
      // Support both array (legacy) and object with items property
      registryItems = Array.isArray(index) ? index : index.items || []

      const registryVersion = (index as any).schemaVersion
      if (registryVersion) {
        console.log(`\nConnected to Registry v${registryVersion}`)
      }
    } catch (e) {
      if (localRegistryItems.length) {
        console.warn(
          '⚠️  Using local registry-all.json fallback because remote registry is unavailable.'
        )
        registryItems = localRegistryItems
      } else {
        console.error(
          '❌ Failed to fetch registry and no local registry-all.json fallback found.',
          e
        )
        process.exit(1)
      }
    }

    // 2. Select Components
    let selectedComponents = options.components
    if (!selectedComponents || selectedComponents.length === 0) {
      const response = await prompts({
        type: 'autocompleteMultiselect',
        name: 'components',
        message: 'Which components would you like to add?',
        choices: registryItems.map((item) => ({ title: item.name, value: item.name })),
        hint: 'Space to select. Return to submit',
      })
      selectedComponents = response.components
    }

    if (!selectedComponents?.length) {
      console.log('No components selected.')
      process.exit(0)
    }

    // 3. Resolve Recursive Dependencies
    const resolvedComponents = new Map<string, RegistryItem>()

    const dependenciesToInstall = new Set<string>()
    const devDependenciesToInstall = new Set<string>()

    const resolveRecursive = async (names: string[]) => {
      for (const name of names) {
        if (resolvedComponents.has(name)) continue

        let item = registryItems.find((i) => i.name === name)

        // If not in index (or we need full content/deps which might be missing in index if striped),
        // we might need to fetch individual.
        // NOTE: registry-index currently has dependencies listed, so we can traverse graph using Index
        // IF index has dependencies.
        // Let's assume index is lightweight and check.
        // If item is missing in index, try to fetch it directly (rare case?)

        if (!item) {
          // Try fetch individual in case it's not in the loaded index (e.g. partial index?)
          try {
            item = await loadRegistryItem(name, options.registry, localRegistryMap)
          } catch {
            console.warn(`⚠️ Component ${name} not found in registry.`)
            continue
          }
        }

        // Ensure we have full content/metadata if needed.
        // If the index item doesn't have `registryDependencies` but the real item does, we have an issue.
        // Strategy: Always fetch full item to be sure about deps?
        // Optimization: "Index" should contain `registryDependencies`.
        // Let's assume we need to fetch full item to get files anyway, so might as well do it now
        // OR do it in two passes?
        // Let's do it eagerly to resolve deps correctly.

        // Fetch full tree if we rely on it for deps or content
        if (!item.files?.some((f) => f.content) || !item.registryDependencies) {
          try {
            if (localRegistryMap.has(name)) {
              item = localRegistryMap.get(name)!
            } else {
              item = await loadRegistryItem(name, options.registry, localRegistryMap)
            }
          } catch (e) {
            console.warn(`Failed to fetch tree for ${name}:`, e)
          }
        }

        resolvedComponents.set(name, item)

        if (item.registryDependencies) {
          await resolveRecursive(item.registryDependencies)
        }
      }
    }

    console.log(`\nResolving dependencies for ${selectedComponents.length} components...`)
    await resolveRecursive(selectedComponents)

    // 4. Install & Write
    console.log(`\nProcessing ${resolvedComponents.size} components...`)

    // Use the resolved map values
    for (const item of resolvedComponents.values()) {
      // ... (existing write logic)

      console.log(`\nProcessing ${item.name}...`)
      if ((item.meta as any)?.placeholder) {
        console.warn(`   ⚠️ ${item.name} is marked as placeholder (non-production).`)
        if (!overwrite && !options.yes) {
          const response = await prompts({
            type: 'confirm',
            name: 'continue',
            message: `Skip writing placeholder ${item.name}? (Recommended: yes)`,
            initial: true,
          })
          if (response.continue) {
            console.log(`   ⏩ Skipped ${item.name} (placeholder).`)
            continue
          }
        }
      }

      // Collect dependencies
      if (item.dependencies) item.dependencies.forEach((d) => dependenciesToInstall.add(d))
      if (item.devDependencies) item.devDependencies.forEach((d) => devDependenciesToInstall.add(d))

      // Assume we need @timui/shared if shared styles exist
      // dependenciesToInstall.add("@timui/shared")
      // Better: rely on registry metadata.

      // Write Files
      if (item.files) {
        const framework = options.framework || item.meta?.frameworks?.[0]
        const extByFramework: Record<string, string[]> = {
          react: ['.tsx', '.jsx'],
          vue: ['.vue'],
          svelte: ['.svelte'],
          html: ['.html', '.htm'],
          weapp: ['.wxml', '.wxss', '.ts', '.js'],
        }
        const allowExt = framework ? extByFramework[framework] || [] : null
        const files = allowExt
          ? item.files.filter((f) => allowExt.some((ext) => f.path.toLowerCase().endsWith(ext)))
          : item.files

        if (!files.length) {
          console.warn(
            `   ⚠️ No files found for framework "${framework ?? 'default'}", skipped writing.`
          )
        }

        for (const file of files) {
          let targetPath: string

          if (file.target) {
            // If target is explicit from registry, respect it relative to CWD?
            // Or relative to options.path?
            // Standard practice (shadcn): target is typically "components/ui/foo.tsx"
            // But options.path overrides the base?

            // Let's assume file.target is the "preferred relative path" from project root.
            // But user might provide --path to override where "components/ui" is.

            // Heuristic: If we are adding a block, we might want to respect target.
            // If we are adding a UI component, we might map "components/ui" in target to options.path.

            // Simpler start: Just use options.path + basename for UI,
            // But for Weapp we need subfolders. A generic "path" option is tricky for multi-file.

            // Proposed Logic:
            // 1. If file.target exists, use it.
            // 2. Allow user to override base (e.g. replace "components/ui" with "src/ui")

            // For now, let's try to simply use target if available, assuming it handles structure.
            // If user provided custom path, we might need to be smarter.

            // Let's resolve target against cwd.
            targetPath = path.join(cwd, file.target)

            // Support custom path override if target starts with default
            if (
              options.path &&
              options.path !== 'src/components/ui' &&
              file.target.startsWith('components/ui')
            ) {
              targetPath = path.join(cwd, file.target.replace('components/ui', options.path))
            }
          } else {
            // Fallback (legacy)
            const fileName = path.basename(file.path)
            targetPath = path.join(cwd, options.path || 'src/components/ui', fileName)
          }

          if (file.content) {
            writeFileSafely({
              target: targetPath,
              content: file.content,
              cwd,
              overwrite,
            })
            console.log(
              `   ✅ Wrote ${path.relative(cwd, targetPath)}${overwrite ? ' (force)' : ''}`
            )
          } else {
            console.warn(`   ⚠️ Unresolved content for ${file.path}`)
          }
        }
      }
    }

    // 4. Install Dependencies
    const pm = getPackageManager(cwd)
    const install = (deps: string[], isDev = false) => {
      if (!deps.length) return
      const depStr = deps.join(' ')
      const installCmd =
        pm === 'npm' ? (isDev ? 'install -D' : 'install') : isDev ? 'add -D' : 'add'
      console.log(`\nInstalling ${isDev ? 'dev ' : ''}dependencies with ${pm}: ${depStr}`)
      execSync(`${pm} ${installCmd} ${depStr}`, { cwd, stdio: 'inherit' })
    }

    if (dependenciesToInstall.size > 0 || devDependenciesToInstall.size > 0) {
      try {
        install(Array.from(dependenciesToInstall), false)
        install(Array.from(devDependenciesToInstall), true)
        console.log('✅ Dependencies installed.')
      } catch (e) {
        console.error('❌ Failed to install dependencies.', e)
      }
    }
  })
