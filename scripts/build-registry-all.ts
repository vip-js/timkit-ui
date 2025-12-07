import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ts from 'typescript'

import { RegistryItem, registryItemSchema } from '../packages/core/src/schema'
import { sha256OfString } from '../packages/cli/src/lib/checksum'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const REGISTRY_PATH = path.join(ROOT, 'apps/docs/registry.json')
const CLI_PACKAGE_JSON = path.join(ROOT, 'packages/cli/package.json')
const CLI_VERSION = fs.existsSync(CLI_PACKAGE_JSON)
  ? JSON.parse(fs.readFileSync(CLI_PACKAGE_JSON, 'utf-8')).version || '0.0.0'
  : '0.0.0'
const CATALOG_SRC_PATH = path.join(ROOT, 'apps/docs/catalog/catalog.json')
const BLOCKS_SOURCE_PATH = path.join(ROOT, 'apps/docs/blocks-source.json')

const OUTPUT_PATH = path.join(ROOT, 'registry-all.json')
const DOCS_DATA_PATH = path.join(ROOT, 'apps/docs/data/registry-all.json')
const DOCS_PUBLIC_REGISTRY_PATH = path.join(ROOT, 'apps/docs/public/registry-all.json')
// docs/data is where we import from in Next.js build
const DOCS_CATALOG_PATH = path.join(ROOT, 'apps/docs/data/catalog-all.json')
const PUBLIC_CATALOG_PATH = path.join(ROOT, 'apps/docs/public/catalog.all.json')
const DOCS_DATA_INDEX_PATH = path.join(ROOT, 'apps/docs/data/registry-index.json')
const DOCS_DATA_REGISTRY_DIR = path.join(ROOT, 'apps/docs/data/registry')

const WEB_COMPONENTS_DIR = path.join(ROOT, 'packages/react/src/components/ui')
const VUE_COMPONENTS_DIR = path.join(ROOT, 'packages/vue/src/components')
const WEAPP_SRC_DIR = path.join(ROOT, 'packages/weapp/src')
const DOCS_HTML_DIR = path.join(ROOT, 'apps/docs/registry/default/html')
const DOCS_SVELTE_DIR = path.join(ROOT, 'apps/docs/registry/default/svelte')
const DOCS_WEAPP_DIR = path.join(ROOT, 'apps/docs/registry/default/weapp')

const frameworkExtensions: Record<string, string[]> = {
  react: ['.tsx', '.jsx'],
  vue: ['.vue'],
  svelte: ['.svelte'],
  html: ['.html', '.htm'],
  weapp: ['.wxml', '.wxss', '.ts', '.js'],
}

const CORE_PARITY_COMPONENTS = [
  'button',
  'input',
  'form',
  'modal',
  'dialog',
  'table',
  'tree',
  'select',
  'toast',
]
const CLIENT_ONLY_COMPONENTS = ['tree', 'cropper']
const CLIENT_ONLY_CATEGORIES = ['tree']

const PLACEHOLDERS = {
  html: (name: string) => `<div class="tk-${name}">Placeholder for ${name} (HTML)</div>`,
  svelte: (name: string) =>
    `<script lang="ts">\n  export let label = "${name}";\n</script>\n<button class="tk-${name}">{label}</button>\n`,
  weapp: (name: string) =>
    `<!-- Placeholder for ${name} (WeApp) -->\n<view class="tk-${name}">Placeholder</view>\n`,
}

function extractImportsFromTs(content: string): string[] {
  const source = ts.createSourceFile('temp.tsx', content, ts.ScriptTarget.Latest, true)
  const deps: string[] = []
  const add = (m: string) => {
    if (!deps.includes(m)) deps.push(m)
  }
  source.forEachChild((node) => {
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      add(node.moduleSpecifier.text)
    }
  })
  return deps
}

function normalizeRegistryDeps(imports: string[], explicit: string[]): string[] {
  const deps: string[] = []
  const push = (d: string) => {
    if (d && !deps.includes(d)) deps.push(d)
  }

  imports.forEach((spec) => {
    // match @/components/ui/foo or @/components/foo
    const compMatch = spec.match(/^@\/components\/(?:ui\/)?([a-z0-9-]+)/i)
    if (compMatch) push(compMatch[1])
    const libMatch = spec.match(/^@\/(lib|hooks)\/([a-z0-9-]+)/i)
    if (libMatch) push(libMatch[2])
  })

  explicit.forEach((dep) => push(dep))
  return deps
}

function tryReadFile(paths: string[]): string | undefined {
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf-8')
    }
  }
  return undefined
  return undefined
}

function safeReadJson<T>(path: string): T | undefined {
  try {
    if (fs.existsSync(path)) {
      return JSON.parse(fs.readFileSync(path, 'utf-8')) as T
    }
  } catch (e) {
    console.warn(`[WARN] Failed to parse JSON at ${path}:`, e)
  }
  return undefined
}

async function main() {
  console.time('Total Build Time')
  console.log('Building registry-all.json & catalog-all.json (Robust Mode)...')

  // 0. Read Skeleton Catalog (for Section Metadata like descriptions, cover_images)
  console.time('Read Skeleton')
  let catalogSkeleton: any = safeReadJson(CATALOG_SRC_PATH) || { categories: [], sections: [] }
  console.timeEnd('Read Skeleton')

  // 1. Read Base Registry (UI Components / Shadcn items)
  console.time('Read Base Registry')
  let baseItems: RegistryItem[] = []
  const baseJson = safeReadJson<{ items: RegistryItem[] }>(REGISTRY_PATH)
  if (baseJson?.items) {
    baseItems = baseJson.items
  }
  console.timeEnd('Read Base Registry')

  const registryMap = new Map<string, RegistryItem>()
  const uiNameSet = new Set<string>()

  // Index Base Items & Augment Frameworks
  console.time('Process Base Items')
  for (const item of baseItems) {
    const result = registryItemSchema.safeParse(item)
    if (result.success) {
      const frameworks: string[] = []
      const filesWithContent =
        result.data.files?.map((file) => {
          // Resolve to the docs registry folder
          const docPath = path.join(ROOT, 'apps/docs', file.path)
          const absolutePath = fs.existsSync(docPath) ? docPath : path.join(ROOT, file.path)
          let content = fs.existsSync(absolutePath)
            ? fs.readFileSync(absolutePath, 'utf-8')
            : undefined

          // Fallback to packages/react/vue components by name
          if (!content && file.path.endsWith('.tsx')) {
            content = tryReadFile([path.join(WEB_COMPONENTS_DIR, `${item.name}.tsx`)])
          }
          if (!content && file.path.endsWith('.vue')) {
            content = tryReadFile([path.join(VUE_COMPONENTS_DIR, `${item.name}.vue`)])
          }

          // Compute target path
          // If it's a weapp file (.wxml, .wxss, .json, or .ts logic for weapp), put in subfolder
          let target = file.target
          if (!target) {
            const ext = path.extname(file.path)
            if (frameworkExtensions.weapp.includes(ext)) {
              // Weapp: components/ui/[name]/[filename]
              target = `components/ui/${item.name}/${path.basename(file.path)}`
            } else {
              // Default: components/ui/[filename]
              target = `components/ui/${path.basename(file.path)}`
            }
          }

          return {
            ...file,
            target,
            content,
          }
        }) ?? []

      if (filesWithContent.some((f) => f.path.endsWith('.tsx'))) {
        frameworks.push('react')
      }
      if (filesWithContent.some((f) => f.path.endsWith('.vue'))) {
        frameworks.push('vue')
      }

      // Auto-discover Framework Files (Vue/Weapp)
      // Even if not in registry.json, if they exist on disk, add them.

      // 1. Vue Discovery
      const vuePath = path.join(VUE_COMPONENTS_DIR, `${item.name}.vue`)
      if (fs.existsSync(vuePath) && !filesWithContent.some((f) => f.path.endsWith('.vue'))) {
        filesWithContent.push({
          path: `registry/default/vue/${item.name}.vue`,
          target: `components/ui/${item.name}.vue`,
          type: 'registry:component',
          content: fs.readFileSync(vuePath, 'utf-8'),
        })
      }

      // 2. Weapp Discovery (Primitives)
      const WEAPP_PRIMITIVES_DIR = path.join(ROOT, 'packages/weapp/primitives')
      const weappPath = path.join(WEAPP_PRIMITIVES_DIR, item.name)
      if (fs.existsSync(weappPath) && fs.statSync(weappPath).isDirectory()) {
        // Read all files in the primitive folder
        const wFiles = fs.readdirSync(weappPath)
        wFiles.forEach((f) => {
          const content = fs.readFileSync(path.join(weappPath, f), 'utf-8')
          filesWithContent.push({
            path: `registry/default/weapp/${item.name}/${f}`,
            target: `components/ui/${item.name}/${f}`,
            type: 'registry:component',
            content,
          })
        })
      }

      // 3. Fallback/real multi-framework files for core parity
      let placeholderAdded = false
      if (CORE_PARITY_COMPONENTS.includes(item.name)) {
        const existingExts = filesWithContent.map((f) => path.extname(f.path))
        // HTML
        if (!existingExts.some((ext) => frameworkExtensions.html.includes(ext))) {
          const htmlContent =
            tryReadFile([path.join(DOCS_HTML_DIR, `${item.name}.html`)]) ||
            PLACEHOLDERS.html(item.name)
          filesWithContent.push({
            path: `registry/default/html/${item.name}.html`,
            target: `components/ui/${item.name}.html`,
            type: 'registry:component',
            content: htmlContent,
          })
          if (!htmlContent) placeholderAdded = true
        }

        // Svelte
        if (!existingExts.some((ext) => frameworkExtensions.svelte.includes(ext))) {
          const svelteContent =
            tryReadFile([path.join(DOCS_SVELTE_DIR, `${item.name}.svelte`)]) ||
            PLACEHOLDERS.svelte(item.name)
          filesWithContent.push({
            path: `registry/default/svelte/${item.name}.svelte`,
            target: `components/ui/${item.name}.svelte`,
            type: 'registry:component',
            content: svelteContent,
          })
          if (!svelteContent) placeholderAdded = true
        }

        // WeApp
        if (!filesWithContent.some((f) => f.path.endsWith('.wxml'))) {
          const weappContent =
            tryReadFile([
              path.join(DOCS_WEAPP_DIR, `${item.name}.wxml`),
              path.join(WEAPP_SRC_DIR, item.name, `${item.name}.wxml`),
              path.join(WEAPP_SRC_DIR, item.name, 'index.wxml'),
            ]) || PLACEHOLDERS.weapp(item.name)
          filesWithContent.push({
            path: `registry/default/weapp/${item.name}.wxml`,
            target: `components/ui/${item.name}.wxml`,
            type: 'registry:component',
            content: weappContent,
          })
          if (!weappContent) placeholderAdded = true
        }
      }

      // Recalculate frameworks based on final files list
      const finalFrameworks = new Set<string>(frameworks)
      if (filesWithContent.some((f) => f.path.endsWith('.vue'))) finalFrameworks.add('vue')
      if (filesWithContent.some((f) => f.path.endsWith('.wxml'))) finalFrameworks.add('weapp')
      if (filesWithContent.some((f) => f.path.endsWith('.html'))) finalFrameworks.add('html')
      if (filesWithContent.some((f) => f.path.endsWith('.svelte'))) finalFrameworks.add('svelte')
      if (filesWithContent.some((f) => f.path.endsWith('.tsx'))) finalFrameworks.add('react')

      const enrichedItem = {
        ...result.data,
        files: filesWithContent,
        meta: {
          ...result.data.meta,
          frameworks: Array.from(finalFrameworks),
          placeholder: (result.data.meta as any)?.placeholder || placeholderAdded || false,
          clientOnly:
            CLIENT_ONLY_COMPONENTS.includes(item.name) ||
            (result.data.meta as any)?.clientOnly ||
            false,
        },
      }
      registryMap.set(item.name, enrichedItem)
      uiNameSet.add(item.name)
    }
  }
  console.timeEnd('Process Base Items')

  // 2. Scan block sources (Blocks/Sections)
  console.time('Scan Blocks')
  const sectionsFound = new Set<string>()

  // 2.1 Scan packages/react/src/blocks (New Phase 5 Source)
  const WEB_BLOCKS_DIR = path.join(ROOT, 'packages/react/src/blocks')
  if (fs.existsSync(WEB_BLOCKS_DIR)) {
    const categories = fs.readdirSync(WEB_BLOCKS_DIR)
    for (const category of categories) {
      const categoryDir = path.join(WEB_BLOCKS_DIR, category)
      if (!fs.statSync(categoryDir).isDirectory()) continue

      const files = fs.readdirSync(categoryDir)
      for (const file of files) {
        if (!file.endsWith('.tsx')) continue

        const name = path.basename(file, '.tsx')
        const content = fs.readFileSync(path.join(categoryDir, file), 'utf-8')
        const isClient = /^\s*['"]use client['"]/.test(content)

        // Parse @registryDependencies from comments if avail?
        // Or use AST to detect imports from @/components/ui/ + explicit hints.

        const explicitDeps =
          content
            .match(/@registryDependencies\s*:\s*([^\n]+)/i)?.[1]
            ?.split(',')
            .map((s) => s.trim())
            .filter(Boolean) || []

        const importDeps = extractImportsFromTs(content)
        const registryDependencies = normalizeRegistryDeps(importDeps, explicitDeps)

        const item: RegistryItem = {
          name,
          type: 'registry:block',
          description: `Block: ${name}`,
          files: [
            {
              path: `blocks/${category}/${file}`,
              content,
              type: 'registry:block',
              target: `components/blocks/${category}/${file}`,
            },
          ],
          categories: [category],
          registryDependencies,
          meta: {
            frameworks: ['react'], // Blocks are currently React-first
            category,
            clientOnly: isClient,
          },
        }

        registryMap.set(name, item)
        sectionsFound.add(category)
      }
    }
  }

  // 2.a Read new blocks-source JSON (Legacy / Docs-driven blocks)
  if (fs.existsSync(BLOCKS_SOURCE_PATH)) {
    try {
      const raw = fs.readFileSync(BLOCKS_SOURCE_PATH, 'utf-8')
      const blocks = JSON.parse(raw) as Array<any>
      blocks.forEach((block) => {
        const name =
          block.name || (block.title ? block.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')
        if (!name) return
        const category = block.category || 'sections'
        const mdxBody = block.mdxBody || ''
        const tagList: string[] = block.tags || [category]

        const files: RegistryItem['files'] = []
        const frameworks: string[] = []
          ; (block.frameworks || []).forEach((fw: any) => {
            const fwName = fw.framework || fw.name
            if (!fwName) return
            const normalized = String(fwName).toLowerCase()
            if (!frameworks.includes(normalized)) frameworks.push(normalized)
              ; (fw.files || []).forEach((file: any, idx: number) => {
                files.push({
                  path:
                    file.path ||
                    `${name}.${normalized === 'vue' ? 'vue' : normalized === 'html' ? 'html' : 'tsx'}`,
                  target:
                    file.target ||
                    `components/ui/${name}.${normalized === 'vue' ? 'vue' : normalized === 'html' ? 'html' : 'tsx'}`,
                  content: file.content || '',
                  type: 'registry:component',
                })
              })
          })

        const blockItem: RegistryItem = {
          name,
          type: 'registry:block',
          description: block.description || block.title || name,
          files,
          categories: [category],
          meta: {
            frameworks,
            tags: tagList,
            mdxBody,
            category,
            title: block.title || name,
            source: 'blocks-source',
          },
        }

        const existing = registryMap.get(name)
        if (existing) {
          const mergedFiles = [...(existing.files || []), ...(blockItem.files || [])]
          const mergedFrameworks = Array.from(
            new Set([...(existing.meta?.frameworks || []), ...frameworks])
          )
          const mergedMeta = {
            ...blockItem.meta,
            ...existing.meta,
            frameworks: mergedFrameworks,
            tags: Array.from(new Set([...(existing.meta?.tags || []), ...(tagList || [])])),
          }
          registryMap.set(name, {
            ...existing,
            files: mergedFiles,
            meta: mergedMeta,
            description: existing.description || blockItem.description,
          })
        } else {
          const parsed = registryItemSchema.safeParse(blockItem)
          registryMap.set(name, parsed.success ? parsed.data : blockItem)
        }
        sectionsFound.add(category)
      })
    } catch (e) {
      console.warn('Failed to read blocks-source.json:', e)
    }
  }

  // Seed existing block items from last registry-all (for backward compatibility)
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'))
      const prevItems: RegistryItem[] = prev.items || []
      prevItems
        .filter((it) => it.type === 'registry:block')
        .forEach((it) => {
          if (!registryMap.has(it.name)) {
            registryMap.set(it.name, it)
            it.categories?.forEach((cat) => sectionsFound.add(cat))
          }
        })
    } catch (e) {
      console.warn('Failed to reuse previous registry-all block items', e)
    }
  }
  console.timeEnd('Scan Blocks')

  // Legacy componentsDB ingestion removed intentionally (replaced by blocks-source)

  const mergedItems = Array.from(registryMap.values())

  // Normalize block metadata: activate by default (unless migrated/duplicate),
  // and synthesize a minimal MDX body when missing so sections can render.
  mergedItems.forEach((item) => {
    if (item.type !== 'registry:block') return
    const meta = { ...(item.meta || {}) }
    // Default active when not explicitly set and not shadowed by UI component name
    if (meta.isActive === undefined) {
      meta.isActive = !uiNameSet.has(item.name) && !meta.migratedTo
      if (!meta.isActive) {
        console.log(`[Build] Deactivating block ${item.name}: uiNameSet=${uiNameSet.has(item.name)}, migratedTo=${meta.migratedTo}`)
      }
    }
    // Populate mdxBody from first available file to enable preview
    if (!meta.mdxBody) {
      const firstWithContent = item.files?.find((f) => f.content?.trim())
      if (firstWithContent?.content) {
        const ext = path.extname(firstWithContent.path).replace('.', '')
        const lang = ext || 'tsx'
        meta.mdxBody = '```' + lang + '\n' + firstWithContent.content + '\n```'
      }
    }
    item.meta = meta
  })

  // Map catalog categories to items (fill missing categories/meta.category)
  if (catalogSkeleton.categories?.length) {
    const nameToCategories = new Map<string, Set<string>>()
    catalogSkeleton.categories.forEach((cat: any) => {
      ; (cat.components || []).forEach((c: any) => {
        if (!nameToCategories.has(c.name)) nameToCategories.set(c.name, new Set())
        nameToCategories.get(c.name)!.add(cat.slug)
      })
    })
    mergedItems.forEach((item) => {
      const catsSet = nameToCategories.get(item.name)
      if (catsSet) {
        const cats = new Set([...(item.categories || []), ...catsSet])
        item.categories = Array.from(cats)
        // meta.category 仅保留一个（首个）
        item.meta = { ...(item.meta || {}), category: item.meta?.category || Array.from(cats)[0] }
      }
      // 若与 UI 同名则停用，否则保持活跃用于专属 block 导航
      if (item.type === 'registry:block' && uiNameSet.has(item.name)) {
        console.log(`[Build] Deactivating block (catalog map) ${item.name}: Found in UI set`)
        item.meta = { ...(item.meta || {}), isActive: false }
      }
    })
  }

  // 3. Build Catalog Structure (Categories and Sections) dynamically based on Registry + Skeleton Metadata

  // A. Categories (Base UI usually)
  // We can count items per category
  const categoryCounts: Record<string, any[]> = {}
  mergedItems.forEach((item) => {
    // Assume type 'registry:ui' belong to 'categories' list in catalog
    // and 'registry:block' belong to 'sections' list
    if (item.type === 'registry:ui' || !item.type || item.type === 'registry:component') {
      // Check categories
      item.categories?.forEach((cat) => {
        if (!categoryCounts[cat]) categoryCounts[cat] = []
        categoryCounts[cat].push({ name: item.name })
      })
    }
  })

  const finalCategories = catalogSkeleton.categories.map((cat: any) => {
    // Update components list directly from what we found (if we want to be dynamic)
    // Or trust skeleton but verifying existence?
    // Let's use skeleton structure but maybe update counts if needed.
    // For now, pass through skeleton categories (Shadcn UI structure is fairly static)
    return cat
  })

  // B. Sections (Blocks) - DISABLED to consolidate everything into Base UI Categories
  // The user requested "Components (Base UI) as source" and "delete duplicates".
  // So we stop generating separate sections for Marketing/Application UI.
  /*
  const finalSections = catalogSkeleton.sections.map((sec: any) => {
    // ...
  })
  
  // Append any block categories...
  sectionsFound.forEach((cat) => {
     // ...
  })
  */

  // Empty sections to remove "Marketing UI" and "Application UI" from sidebar
  const finalSections: any[] = [];

  const fullRegistry = {
    name: '@timui/react-registry',
    items: mergedItems,
    generatedAt: new Date().toISOString(),
    schemaVersion: '1.0',
    minCliVersion: CLI_VERSION,
  }

  // Validation: ensure every ui/block has files with content
  const validationErrors: string[] = []
  mergedItems.forEach((item) => {
    if (item.type === 'registry:ui') {
      const files = item.files || []
      if (!files.length) {
        validationErrors.push(`[${item.type}] ${item.name} missing files array`)
        return
      }
      const hasContent = files.some((f) => !!f.content?.trim())
      if (!hasContent) {
        validationErrors.push(`[${item.type}] ${item.name} has files but no content`)
      }

      // Framework coverage check
      const desiredFrameworks = (item.meta?.frameworks as string[]) || []
      desiredFrameworks.forEach((fw) => {
        const exts = frameworkExtensions[fw] || []
        const hasFwFile = files.some((f) => exts.some((ext) => f.path.toLowerCase().endsWith(ext)))
        if (!hasFwFile) {
          validationErrors.push(`[${item.type}] ${item.name} missing file for framework ${fw}`)
        }
      })
    }
    if (item.type === 'registry:block') {
      const hasMdx = !!(item.meta as any)?.mdxBody?.trim()
      const hasFiles = item.files?.some((f) => !!f.content?.trim()) ?? false
      if (!hasMdx && !hasFiles) {
        validationErrors.push(`[${item.type}] ${item.name} missing mdxBody and file content`)
      }
    }
  })

  if (validationErrors.length) {
    console.error('Registry validation failed:\n' + validationErrors.join('\n'))
    process.exit(1)
  }

  const fullCatalog = {
    generatedAt: new Date().toISOString(),
    categories: finalCategories,
    sections: finalSections,
  }

  // Output Registry
  const fullRegistryJson = JSON.stringify(fullRegistry, null, 2)
  const fullRegistryChecksum = sha256OfString(fullRegistryJson)
  const fullRegistryWithChecksum = {
    ...fullRegistry,
    checksum: fullRegistryChecksum,
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(fullRegistryWithChecksum, null, 2))

  // Output Docs Data (Registry)
  const docsDataDir = path.dirname(DOCS_DATA_PATH)
  if (!fs.existsSync(docsDataDir)) fs.mkdirSync(docsDataDir, { recursive: true })
  fs.writeFileSync(DOCS_DATA_PATH, JSON.stringify(fullRegistryWithChecksum, null, 2))
  const publicRegistryDir = path.dirname(DOCS_PUBLIC_REGISTRY_PATH)
  if (!fs.existsSync(publicRegistryDir)) {
    fs.mkdirSync(publicRegistryDir, { recursive: true })
  }
  fs.writeFileSync(DOCS_PUBLIC_REGISTRY_PATH, JSON.stringify(fullRegistryWithChecksum, null, 2))

  // Output Catalog (Docs Data) - NEW SOURCE OF TRUTH for Catalog.ts
  fs.writeFileSync(DOCS_CATALOG_PATH, JSON.stringify(fullCatalog, null, 2))

  // 4. Output Split Registry (For CLI & Client optimization)
  const splitRegistryDir = path.join(publicRegistryDir, 'registry')
  if (!fs.existsSync(splitRegistryDir)) fs.mkdirSync(splitRegistryDir, { recursive: true })
  if (!fs.existsSync(DOCS_DATA_REGISTRY_DIR)) fs.mkdirSync(DOCS_DATA_REGISTRY_DIR, { recursive: true })

  // Generate registry-index.json (Metadata only, minimal size)
  const registryIndex = mergedItems.map((item) => {
    // Strip file contents for the index
    const { files, ...rest } = item
    const minimalFiles = files?.map((f) => ({ ...f, content: undefined }))
    return {
      ...rest,
      files: minimalFiles,
    }
  })

  const indexPayload = {
    name: '@timui/react-registry-index',
    items: registryIndex,
    generatedAt: new Date().toISOString(),
    schemaVersion: '1.0',
    minCliVersion: CLI_VERSION,
  }
  const indexJson = JSON.stringify(indexPayload, null, 2)
  const indexChecksum = sha256OfString(indexJson)
  const indexData = { ...indexPayload, checksum: indexChecksum }

  const registryIndexPath = path.join(publicRegistryDir, 'registry-index.json')
  fs.writeFileSync(registryIndexPath, JSON.stringify(indexData, null, 2))
  // Keep a copy under apps/docs/data as the single source for server imports
  fs.writeFileSync(DOCS_DATA_INDEX_PATH, JSON.stringify(indexData, null, 2))
  console.log(
    `Generated registry-index.json (${(fs.statSync(registryIndexPath).size / 1024).toFixed(1)} KB)`
  )

  // Generate individual item JSONs (Full content)
  let itemCounter = 0
  mergedItems.forEach((item) => {
    const itemPath = path.join(splitRegistryDir, `${item.name}.json`)
    const itemJson = JSON.stringify(item, null, 2)
    fs.writeFileSync(itemPath, itemJson)
    const dataItemPath = path.join(DOCS_DATA_REGISTRY_DIR, `${item.name}.json`)
    fs.writeFileSync(dataItemPath, itemJson)
    itemCounter++
  })
  console.log(`Generated ${itemCounter} individual registry item files in /registry/`)

  console.log(`Generated registry-all.json (${mergedItems.length} items)`)
  console.log(`Generated catalog-all.json (updated counts)`)
  console.timeEnd('Total Build Time')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
