import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import type { JsonValue, RegistryItem, RegistryPayload } from '@timui/core'
import { Command } from 'commander'
import prompts from 'prompts'
import { z } from 'zod'

import { registryCache } from '../lib/cache'
import { resolveComponentAlias } from '../lib/component-aliases'
import { fetchJsonWithRetry } from '../lib/http'
import { validateRegistryPayload } from '../lib/registry'
import { getPackageManager, writeFileSafely } from '../lib/utils'

// Default to production registry, override via ENV
const REGISTRY_BASE_URL = process.env.REGISTRY_URL || 'https://ui.timkit.cn'
const REGISTRY_MIRRORS = process.env.REGISTRY_MIRRORS || process.env.REGISTRY_MIRROR_URLS || ''

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

type ErrorInput = Error | string | number | boolean | null | undefined | { message?: string }

const toError = (error: ErrorInput): Error => {
  if (error instanceof Error) return error
  return new Error(String(error))
}

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
        REGISTRY_MIRRORS.split(',')
          .map((m) => m.trim())
          .filter(Boolean)
      )
  try {
    // 1. Try Local File (Monorepo dev override)
    if (fs.existsSync('registry-index.json')) {
      return JSON.parse(fs.readFileSync('registry-index.json', 'utf-8')).items
    }

    // 2. Try Cache
    const cached = registryCache.getIndex()
    if (cached && !registryUrl) {
      return Array.isArray(cached) ? cached : (cached as { items?: RegistryItem[] }).items || []
    }

    // 3. Network Fetch with mirrors
    let lastError: Error | null = null
    for (const base of bases) {
      const normalized = base.replace(/\/$/, '')
      try {
        const json = await fetchJsonWithRetry<RegistryItem[] | { [key: string]: JsonValue }>(
          `${normalized}/registry-index.json`
        )
        const items = validateRegistryPayload(json)
        // 4. Update Cache
        if (!registryUrl) {
          const cachePayload: RegistryPayload | RegistryItem[] = Array.isArray(json)
            ? json
            : (json as RegistryPayload)
          registryCache.setIndex(cachePayload)
        }

        return items
      } catch (e) {
        lastError = toError(e)
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
        REGISTRY_MIRRORS.split(',')
          .map((m) => m.trim())
          .filter(Boolean)
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

    let lastError: Error | null = null
    for (const base of bases) {
      const normalized = base.replace(/\/registry-index\.json$/, '').replace(/\/$/, '')
      const url = `${normalized}/registry/${name}.json`
      try {
        const data = await fetchJsonWithRetry<RegistryItem>(url)
        if (!registryUrl) registryCache.setItem(name, data)

        return data
      } catch (e) {
        lastError = toError(e)
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
  install: z.boolean().default(true),
  framework: z.string().optional(),
  path: z.string().optional(),
  registry: z.string().optional(),
  diff: z.boolean().default(false),
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
  .option('--no-install', 'skip installing dependencies')
  .option('--framework <framework>', 'filter files by framework (react|vue|html|weapp)')
  .option(
    '--path <path>',
    'relative output directory (default: src/components/ui)',
    'src/components/ui'
  )
  .option('--registry <url>', 'registry url override')
  .option('-d, --diff', 'Show diff instead of writing files', false)
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
      registryItems = await loadRegistryIndex(options.registry, localRegistryItems)
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

    const registryAliasMap = new Map<string, string>()
    registryItems.forEach((item) => {
      const aliases = getStringArray(item.meta?.aliases)
      aliases.forEach((alias) => {
        if (!registryAliasMap.has(alias)) {
          registryAliasMap.set(alias, item.name)
        }
      })
    })
    const resolveAlias = (name: string) =>
      registryAliasMap.get(name) || resolveComponentAlias(name, cwd)

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

    const aliasNotes = new Set<string>()
    selectedComponents = selectedComponents.map((name) => {
      const resolved = resolveAlias(name)
      if (resolved !== name) {
        aliasNotes.add(`${name} -> ${resolved}`)
      }
      return resolved
    })
    selectedComponents = Array.from(new Set(selectedComponents))

    if (aliasNotes.size > 0) {
      console.log('\nResolved aliases:')
      aliasNotes.forEach((note) => console.log(`- ${note}`))
    }

    // 3. Resolve Recursive Dependencies
    const resolvedComponents = new Map<string, RegistryItem>()

    const dependenciesToInstall = new Set<string>()
    const devDependenciesToInstall = new Set<string>()

    const resolveRecursive = async (names: string[]) => {
      for (const rawName of names) {
        const name = resolveAlias(rawName)
        if (resolvedComponents.has(name)) continue

        let item = registryItems.find((i) => i.name === name)

        // If item is missing in index, try fetching it individually
        if (!item) {
          try {
            item = await loadRegistryItem(name, options.registry, localRegistryMap)
          } catch {
            console.warn(`⚠️ Component ${name} not found in registry.`)
            continue
          }
        }

        // Eagerly fetch full item to ensure we have files and registry dependencies
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

        const frameworks = getStringArray(item.meta?.frameworks)
        const framework = options.framework || frameworks[0]
        const registryDepsByFramework = (
          item.meta as {
            dependenciesByFramework?: Record<string, { registryDependencies?: string[] }>
          }
        )?.dependenciesByFramework?.[framework]?.registryDependencies
        const registryDeps = registryDepsByFramework || item.registryDependencies
        if (registryDeps) {
          const dependencyNames = registryDeps.map((depName) => resolveAlias(depName))
          await resolveRecursive(dependencyNames)
        }
      }
    }

    console.log(`\nResolving dependencies for ${selectedComponents.length} components...`)
    await resolveRecursive(selectedComponents)

    // 4. Install & Write
    console.log(`\nProcessing ${resolvedComponents.size} components...`)

    for (const item of resolvedComponents.values()) {
      console.log(`\nProcessing ${item.name}...`)
      const isPlaceholder = item.meta?.placeholder === true
      if (isPlaceholder) {
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

      // Write Files
      if (item.files) {
        const frameworks = getStringArray(item.meta?.frameworks)
        const framework = options.framework || frameworks[0]
        const depsByFramework = (
          item.meta as { dependenciesByFramework?: Record<string, { dependencies?: string[] }> }
        )?.dependenciesByFramework?.[framework]
        const deps = depsByFramework?.dependencies || item.dependencies
        if (deps) deps.forEach((d) => dependenciesToInstall.add(d))
        if (item.devDependencies)
          item.devDependencies.forEach((d) => devDependenciesToInstall.add(d))

        const extByFramework: Record<string, string[]> = {
          react: ['.tsx', '.jsx'],
          vue: ['.vue'],
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
            // file.target is the preferred relative path from project root
            targetPath = path.join(cwd, file.target)

            // Allow --path to override the default `components/ui` base
            if (
              options.path &&
              options.path !== 'src/components/ui' &&
              file.target.startsWith('components/ui')
            ) {
              targetPath = path.join(cwd, file.target.replace('components/ui', options.path))
            }
          } else {
            // Fallback: use the file's basename under the output path
            const fileName = path.basename(file.path)
            targetPath = path.join(cwd, options.path || 'src/components/ui', fileName)
          }

          if (file.content) {
            if (options.diff) {
              if (fs.existsSync(targetPath)) {
                const localContent = fs.readFileSync(targetPath, 'utf-8')
                if (localContent === file.content) {
                  console.log(`   ✅ ${path.relative(cwd, targetPath)} is up to date.`)
                } else {
                  console.log(`   diff for ${path.relative(cwd, targetPath)}:`)
                  const localLines = localContent.split('\n')
                  const remoteLines = file.content.split('\n')
                  // Simple line-by-line diff for now to avoid external deps in this demo
                  // In a real CLI we would use 'diff' package.
                  console.log('--- local')
                  console.log('+++ remote')
                  remoteLines.forEach((line, i) => {
                    if (localLines[i] !== line) {
                      if (localLines[i] !== undefined) console.log(`- ${localLines[i]}`)
                      console.log(`+ ${line}`)
                    }
                  })
                }
              } else {
                console.log(`   🆕 ${path.relative(cwd, targetPath)} does not exist locally.`)
              }
              continue
            }

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

    if (!options.install) {
      if (dependenciesToInstall.size > 0 || devDependenciesToInstall.size > 0) {
        console.log('\nSkipping dependency installation (--no-install).')
      }
      return
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
