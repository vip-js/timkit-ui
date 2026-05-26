import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ts from 'typescript'

import {
  buildDemoFrameworkMatrix,
  getDemoComponentGroup,
  isDemoLikeName,
} from '../apps/docs/lib/demo-canonical'
import { resolveDemoDisplayTitle } from '../apps/docs/lib/demo-title'
import { sha256OfString } from '../packages/cli/src/lib/checksum'
import { RegistryItem, registryItemSchema } from '../packages/core/src/shared/schema'
import { getHtmlCapabilityLevel } from '../packages/html/src/capabilities'
import {
  HTML_RUNTIME_AUTO_ATTRIBUTE,
  HTML_RUNTIME_AUTO_VALUE,
  HTML_RUNTIME_ROOT_ATTRIBUTE,
} from '../packages/html/src/runtime-metadata'

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
const REGISTRY_ALIASES_PATH = path.join(ROOT, 'apps/docs/data/registry-aliases.json')

const WEB_COMPONENTS_DIR = path.join(ROOT, 'packages/react/src/components/ui')
const VUE_COMPONENTS_DIR = path.join(ROOT, 'packages/vue/src/components')
const VUE_UI_COMPONENTS_DIR = path.join(VUE_COMPONENTS_DIR, 'ui')
const VUE_HOOKS_DIR = path.join(ROOT, 'packages/vue/src/hooks')
const WEAPP_SRC_DIR = path.join(ROOT, 'packages/weapp/src')
const HTML_COMPONENTS_DIR = path.join(ROOT, 'packages/html/src/components')
const DOCS_HTML_DIR = path.join(ROOT, 'apps/docs/registry/default/html')
const DOCS_WEAPP_DIR = path.join(ROOT, 'apps/docs/registry/default/weapp')
const DOCS_VUE_DIR = path.join(ROOT, 'apps/docs/registry/default/vue')
const REACT_HOOKS_DIR = path.join(ROOT, 'packages/react/src/hooks')

const REACT_PACKAGE_JSON = path.join(ROOT, 'packages/react/package.json')
const VUE_PACKAGE_JSON = path.join(ROOT, 'packages/vue/package.json')
const FRAMEWORK_RUNTIME_DEPS = new Set(['react', 'react-dom', 'vue'])

const frameworkExtensions: Record<string, string[]> = {
  react: ['.tsx', '.jsx'],
  vue: ['.vue', '.ts'], // Added .ts for Vue hooks
  html: ['.html', '.htm', '.hbs'],
  weapp: ['.wxml', '.wxss', '.ts', '.js'],
}

const FRAMEWORK_PRIORITY = ['react', 'vue', 'weapp', 'html']
const orderFrameworks = (list: string[]) => {
  const seen = new Set<string>()
  const normalized = list.map((frame) => frame.toLowerCase())

  const ordered = FRAMEWORK_PRIORITY.filter((frame) => {
    if (normalized.includes(frame) && !seen.has(frame)) {
      seen.add(frame)
      return true
    }
    return false
  })

  normalized.forEach((frame) => {
    if (!seen.has(frame)) {
      seen.add(frame)
      ordered.push(frame)
    }
  })

  return ordered
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
  'switch',
  'slider',
  'tabs',
  'textarea',
]
const CLIENT_ONLY_COMPONENTS = ['tree', 'cropper']
const CLIENT_ONLY_CATEGORIES = ['tree']

const PLACEHOLDERS = {
  html: (name: string) =>
    `<div class="flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">Placeholder for ${name} (HTML)</div>`,
  weapp: (name: string) =>
    `<!-- Placeholder for ${name} (WeApp) -->\n<view class="flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">Placeholder</view>\n`,
}

function getDocsDemoCandidates(name: string) {
  const group = getDemoComponentGroup(name)
  const groupDemoName = `${group}-demo`
  return Array.from(new Set([name, groupDemoName, group].filter(Boolean)))
}

function indentBlock(content: string, spaces = 2): string {
  const prefix = ' '.repeat(spaces)
  return content
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n')
}

function decorateHtmlRegistryContent(name: string, content: string): string {
  const normalized = content.trim()
  if (!normalized) return normalized
  if (getHtmlCapabilityLevel(name) !== 'template+adapter') return normalized

  const hasRuntimeRoot =
    normalized.includes(HTML_RUNTIME_ROOT_ATTRIBUTE) ||
    normalized.includes(HTML_RUNTIME_AUTO_ATTRIBUTE)
  const hasRuntimeInit = normalized.includes('autoInitHtmlRuntime(')
  const hasInlineScript = /<script\b/i.test(normalized)

  const wrapped = hasRuntimeRoot
    ? normalized
    : `<div ${HTML_RUNTIME_ROOT_ATTRIBUTE} ${HTML_RUNTIME_AUTO_ATTRIBUTE}="${HTML_RUNTIME_AUTO_VALUE}">\n${indentBlock(normalized)}\n</div>`

  if (hasRuntimeInit || hasInlineScript) {
    return wrapped
  }

  return `${wrapped}\n<script type="module">\n  import { autoInitHtmlRuntime } from '@timui/html'\n  autoInitHtmlRuntime({ components: ['${name}'] })\n</script>`
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

function loadRegistryAliases(): Record<string, string> {
  if (!fs.existsSync(REGISTRY_ALIASES_PATH)) return {}
  try {
    const parsed = JSON.parse(fs.readFileSync(REGISTRY_ALIASES_PATH, 'utf-8')) as Record<
      string,
      object
    >
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string'
      )
    )
  } catch {
    return {}
  }
}

function tryReadFile(paths: string[]): string | undefined {
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf-8')
    }
  }
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

function normalizeSourceContent(content: string): string {
  return content.replace(/^(?:'use client'\s*\n){2,}/, "'use client'\n")
}

function findDocsSiblingByCandidates(
  primaryDir: string,
  name: string,
  ext: string
): string | undefined {
  for (const candidate of getDocsDemoCandidates(name)) {
    const candidatePath = path.join(primaryDir, `${candidate}.${ext}`)
    if (fs.existsSync(candidatePath)) {
      return candidatePath
    }
  }
  return undefined
}

function loadOptionalPeers(pkgPath: string): Set<string> {
  if (!fs.existsSync(pkgPath)) return new Set()
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      peerDependencies?: Record<string, string>
      peerDependenciesMeta?: Record<string, { optional?: boolean }>
    }
    const optional = new Set<string>()
    const meta = pkg.peerDependenciesMeta || {}
    Object.entries(meta).forEach(([dep, info]) => {
      if (info?.optional) optional.add(dep)
    })
    return optional
  } catch {
    return new Set()
  }
}

const OPTIONAL_PEERS_REACT = loadOptionalPeers(REACT_PACKAGE_JSON)
const OPTIONAL_PEERS_VUE = loadOptionalPeers(VUE_PACKAGE_JSON)

function collectReactComponentNames(): Set<string> {
  if (!fs.existsSync(WEB_COMPONENTS_DIR)) return new Set()
  const entries = fs.readdirSync(WEB_COMPONENTS_DIR)
  const names = entries
    .filter((entry) => entry.endsWith('.tsx'))
    .map((entry) => entry.replace(/\.tsx$/, ''))
    .filter((name) => name !== 'index')
  return new Set(names)
}

function walkFiles(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(fullPath, acc)
      continue
    }
    if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      if (entry.name.endsWith('.d.ts')) continue
      acc.push(fullPath)
    }
  }
  return acc
}

function collectReactSupportFiles(name: string): RegistryItem['files'] {
  const scopedDir = path.join(WEB_COMPONENTS_DIR, name)
  if (!fs.existsSync(scopedDir) || !fs.statSync(scopedDir).isDirectory()) return []

  const files = walkFiles(scopedDir)
  return files.map((filePath) => {
    const relative = path.relative(scopedDir, filePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    return {
      path: `registry/default/ui/${name}/${relative.replace(/\\/g, '/')}`,
      target: `components/ui/${name}/${relative.replace(/\\/g, '/')}`,
      type: 'registry:ui',
      content: normalizeSourceContent(content),
    }
  })
}

function extractImportsFromVue(content: string): string[] {
  const deps: string[] = []
  const add = (m: string) => {
    if (m && !deps.includes(m)) deps.push(m)
  }
  const regex = /(?:import|export)\s+(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(content))) {
    add(match[1])
  }
  return deps
}

function extractImportsFromSource(filePath: string, content: string): string[] {
  const ext = path.extname(filePath)
  if (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx') {
    return extractImportsFromTs(content)
  }
  if (ext === '.vue') {
    return extractImportsFromVue(content)
  }
  return []
}

function pickOptionalPeersForFile(filePath: string): Set<string> {
  if (filePath.includes('/vue/')) return OPTIONAL_PEERS_VUE
  if (filePath.endsWith('.vue')) return OPTIONAL_PEERS_VUE
  return OPTIONAL_PEERS_REACT
}

function scanItemDependencies(files: RegistryItem['files']): {
  registryDependencies: string[]
  dependencies: string[]
  optionalPeerDependencies: string[]
} {
  const registryDeps = new Set<string>()
  const externalDeps = new Set<string>()
  const optionalDeps = new Set<string>()

  files?.forEach((file) => {
    if (!file.content) return
    const imports = extractImportsFromSource(file.path, file.content)
    const optionalPeers = pickOptionalPeersForFile(file.path)

    imports.forEach((spec) => {
      if (!spec || spec.startsWith('.') || spec.startsWith('@/')) {
        normalizeRegistryDeps([spec], []).forEach((dep) => registryDeps.add(dep))
        return
      }

      if (FRAMEWORK_RUNTIME_DEPS.has(spec)) return

      externalDeps.add(spec)
      if (optionalPeers.has(spec)) optionalDeps.add(spec)
    })
  })

  optionalDeps.forEach((dep) => externalDeps.delete(dep))

  return {
    registryDependencies: Array.from(registryDeps).sort(),
    dependencies: Array.from(externalDeps).sort(),
    optionalPeerDependencies: Array.from(optionalDeps).sort(),
  }
}

function filterFilesByFramework(
  files: RegistryItem['files'],
  framework: string
): RegistryItem['files'] {
  if (!files?.length) return []
  const extForReact = new Set(['.tsx', '.jsx', '.ts', '.js'])
  const extForVue = new Set(['.vue', '.ts'])
  const extForWeapp = new Set(['.wxml', '.wxss', '.ts', '.js', '.json'])
  const extForHtml = new Set(['.html', '.htm', '.hbs'])

  return files.filter((file) => {
    const ext = path.extname(file.path).toLowerCase()
    const lower = file.path.toLowerCase()

    if (framework === 'react') {
      if (!extForReact.has(ext)) return false
      if (lower.includes('/vue/') || lower.includes('/weapp/') || lower.includes('/html/'))
        return false
      return true
    }
    if (framework === 'vue') {
      if (!extForVue.has(ext) && !lower.includes('/vue/')) return false
      return lower.includes('/vue/') || ext === '.vue'
    }
    if (framework === 'weapp') {
      if (!extForWeapp.has(ext) && !lower.includes('/weapp/')) return false
      return lower.includes('/weapp/')
    }
    if (framework === 'html') {
      if (!extForHtml.has(ext) && !lower.includes('/html/')) return false
      return lower.includes('/html/') || extForHtml.has(ext)
    }
    return true
  })
}

function resolveRegistrySourcePath(filePath: string, itemName: string): string | undefined {
  if (filePath.startsWith('registry/default/ui/')) {
    const relative = filePath.replace('registry/default/ui/', '')
    const candidate = path.join(WEB_COMPONENTS_DIR, relative)
    if (fs.existsSync(candidate)) return candidate
    const byName = path.join(WEB_COMPONENTS_DIR, `${itemName}.tsx`)
    if (fs.existsSync(byName)) return byName
  }

  if (filePath.startsWith('registry/default/hooks/')) {
    const basename = path.basename(filePath)
    const candidate = path.join(REACT_HOOKS_DIR, basename)
    if (fs.existsSync(candidate)) return candidate
  }

  if (filePath.startsWith('registry/default/vue/')) {
    const relative = filePath.replace('registry/default/vue/', '')
    const basename = path.basename(relative)
    const candidates = [
      path.join(VUE_UI_COMPONENTS_DIR, itemName, basename),
      path.join(VUE_UI_COMPONENTS_DIR, `${itemName}.vue`),
      path.join(VUE_UI_COMPONENTS_DIR, relative),
      path.join(VUE_COMPONENTS_DIR, relative),
      path.join(VUE_HOOKS_DIR, basename),
    ]
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate
    }
  }

  if (filePath.startsWith('registry/default/weapp/')) {
    const relative = filePath.replace('registry/default/weapp/', '')
    const candidateDirect = path.join(WEAPP_SRC_DIR, relative)
    if (fs.existsSync(candidateDirect)) return candidateDirect

    const basename = path.basename(relative)
    const ext = path.extname(basename)
    if (itemName && ext) {
      const candidates = [
        path.join(WEAPP_SRC_DIR, itemName, `${itemName}${ext}`),
        path.join(WEAPP_SRC_DIR, itemName, `index${ext}`),
        path.join(WEAPP_SRC_DIR, itemName, basename),
      ]
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) return candidate
      }
    }
  }

  if (filePath.startsWith('registry/default/html/')) {
    const candidate = path.join(HTML_COMPONENTS_DIR, `${itemName}.html`)
    if (fs.existsSync(candidate)) return candidate
  }

  return undefined
}

function collectVueFilesForComponent(name: string): Array<{
  sourcePath: string
  registryPath: string
  target: string
}> {
  const results: Array<{ sourcePath: string; registryPath: string; target: string }> = []
  const pushFile = (sourcePath: string, registryPath: string, target: string) => {
    if (!fs.existsSync(sourcePath)) return
    if (results.some((entry) => entry.sourcePath === sourcePath)) return
    results.push({ sourcePath, registryPath, target })
  }

  pushFile(
    path.join(VUE_COMPONENTS_DIR, `${name}.vue`),
    `registry/default/vue/${name}.vue`,
    `components/ui/${name}.vue`
  )

  pushFile(
    path.join(VUE_UI_COMPONENTS_DIR, `${name}.vue`),
    `registry/default/vue/${name}.vue`,
    `components/ui/${name}.vue`
  )

  const scopedDir = path.join(VUE_UI_COMPONENTS_DIR, name)
  if (fs.existsSync(scopedDir) && fs.statSync(scopedDir).isDirectory()) {
    const scopedFiles = fs.readdirSync(scopedDir)
    scopedFiles.forEach((file) => {
      if (!file.endsWith('.vue') && !file.endsWith('.ts')) return
      pushFile(
        path.join(scopedDir, file),
        `registry/default/vue/${name}/${file}`,
        `components/ui/${name}/${file}`
      )
    })
  }

  return results
}

async function main() {
  console.time('Total Build Time')
  console.log('Building registry-all.json & catalog-all.json (Robust Mode)...')

  // 0. Read Skeleton Catalog (for Section Metadata like descriptions, cover_images)
  console.time('Read Skeleton')
  let catalogSkeleton: object = safeReadJson(CATALOG_SRC_PATH) || { categories: [], sections: [] }
  console.timeEnd('Read Skeleton')

  // 1. Read Base Registry (UI Components / Shadcn items)
  console.time('Read Base Registry')
  let baseItems: RegistryItem[] = []
  const baseJson = safeReadJson<{ items: RegistryItem[] }>(REGISTRY_PATH)
  if (baseJson?.items) {
    baseItems = baseJson.items
  }
  console.timeEnd('Read Base Registry')

  const reactComponentNames = collectReactComponentNames()

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
          const overridePath = resolveRegistrySourcePath(file.path, item.name)
          const docPath = path.join(ROOT, 'apps/docs', file.path)
          const absolutePath =
            overridePath || (fs.existsSync(docPath) ? docPath : path.join(ROOT, file.path))
          let content = fs.existsSync(absolutePath)
            ? fs.readFileSync(absolutePath, 'utf-8')
            : undefined

          // Fallback to packages/react/vue components by name (legacy)
          if (!content && file.path.endsWith('.tsx')) {
            content = tryReadFile([path.join(WEB_COMPONENTS_DIR, `${item.name}.tsx`)])
          }
          if (
            !content &&
            (file.path.endsWith('.vue') ||
              (file.path.endsWith('.ts') && file.path.includes('/vue/')))
          ) {
            const basename = path.basename(file.path)
            content = tryReadFile([
              path.join(VUE_COMPONENTS_DIR, basename),
              path.join(VUE_HOOKS_DIR, basename),
            ])
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
            content: content ? normalizeSourceContent(content) : content,
          }
        }) ?? []

      // Always append React support files from packages for base UI components.
      if (
        reactComponentNames.has(item.name) &&
        (item.type === 'registry:ui' || item.type === 'registry:component' || !item.type)
      ) {
        const supportFiles = collectReactSupportFiles(item.name)
        supportFiles.forEach((file) => {
          if (!filesWithContent.some((existing) => existing.path === file.path)) {
            filesWithContent.push(file)
          }
        })
      }

      if (filesWithContent.some((f) => f.path.endsWith('.tsx'))) {
        frameworks.push('react')
      }
      if (filesWithContent.some((f) => f.path.endsWith('.vue'))) {
        frameworks.push('vue')
      }

      // Auto-discover Framework Files (Vue/Weapp)
      // Even if not in registry.json, if they exist on disk, add them.

      // 1. Vue Discovery
      const vueFiles = collectVueFilesForComponent(item.name)
      vueFiles.forEach((entry) => {
        if (filesWithContent.some((file) => file.path === entry.registryPath)) return
        filesWithContent.push({
          path: entry.registryPath,
          target: entry.target,
          type: 'registry:component',
          content: normalizeSourceContent(fs.readFileSync(entry.sourcePath, 'utf-8')),
        })
      })

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

      // 3. Fallback/real multi-framework files for ALL components
      // [NEW] Colocation Discovery: Check the directory of the primary file (tsx) for siblings
      const primaryFile =
        filesWithContent.find((f) => f.path.endsWith('.tsx')) || filesWithContent[0]
      if (primaryFile) {
        // file.path is relative to apps/docs usually, but let's resolve it carefully
        const relPath = primaryFile.path
        // If it starts with 'registry/', it's inside apps/docs
        const possiblePrimaryPath = path.join(ROOT, 'apps/docs', relPath)
        const primaryDir = fs.existsSync(possiblePrimaryPath)
          ? path.dirname(possiblePrimaryPath)
          : undefined

        if (primaryDir) {
          const basename = path.basename(primaryFile.path, path.extname(primaryFile.path)) // e.g. 'button-01' from 'button-01.tsx'

          // Helper to add if exists and not already present
          const tryAddSibling = (ext: string, type: 'vue' | 'html' | 'weapp') => {
            const siblingPath = findDocsSiblingByCandidates(primaryDir, basename, ext)
            const alreadyHas = filesWithContent.some((file) => {
              if (type === 'vue') {
                return (
                  /\.vue$/.test(file.path) ||
                  (/\.ts$/.test(file.path) && file.path.includes('/vue/'))
                )
              }
              if (type === 'html') {
                return /\.(html|htm|hbs)$/.test(file.path)
              }
              return /\.(wxml|wxss|json|ts|js)$/.test(file.path) && /weapp/i.test(file.path)
            })

            if (siblingPath && !alreadyHas) {
              // Construct relative path for registry
              // We want to keep the same folder structure in registry output?
              // Result path: "registry/default/components/button/button-01.vue"
              const docRelPath = path.relative(path.join(ROOT, 'apps/docs'), siblingPath)

              // Construct target
              // For 'registry:component', target is usually components/ui/[filename]
              // But for Weapp, we might want consistent structure.
              let target = `components/ui/${item.name}.${ext}`
              if (type === 'weapp') {
                target = `components/ui/${item.name}/${item.name}.${ext}`
              }

              let content = fs.readFileSync(siblingPath, 'utf-8')
              if (type === 'html') {
                content = decorateHtmlRegistryContent(item.name, content)
              }

              filesWithContent.push({
                path: docRelPath,
                target,
                type: 'registry:component',
                content,
              })

              // For Weapp, also check wxml/wxss/json/ts/js siblings
              if (type === 'weapp' && ext === 'wxml') {
                ;['wxss', 'json', 'ts', 'js'].forEach((extraExt) => {
                  const extraPath = path.join(primaryDir, `${basename}.${extraExt}`)
                  if (fs.existsSync(extraPath)) {
                    filesWithContent.push({
                      path: path.relative(path.join(ROOT, 'apps/docs'), extraPath),
                      target: `components/ui/${item.name}/${basename}.${extraExt}`,
                      type: 'registry:component',
                      content: fs.readFileSync(extraPath, 'utf-8'),
                    })
                  }
                })
              }
            }
          }

          tryAddSibling('vue', 'vue')
          tryAddSibling('html', 'html')
          tryAddSibling('wxml', 'weapp')
        }
      }

      if (isDemoLikeName(item.name)) {
        const canonicalReactPath = path.join(
          ROOT,
          'apps/docs/registry/default/components',
          getDemoComponentGroup(item.name),
          `${item.name}.tsx`
        )

        if (
          fs.existsSync(canonicalReactPath) &&
          !filesWithContent.some(
            (file) => path.basename(file.path, path.extname(file.path)) === item.name
          )
        ) {
          filesWithContent.unshift({
            path: path
              .relative(path.join(ROOT, 'apps/docs'), canonicalReactPath)
              .replace(/\\/g, '/'),
            target: `components/ui/${item.name}.tsx`,
            type: 'registry:component',
            content: normalizeSourceContent(fs.readFileSync(canonicalReactPath, 'utf-8')),
          })
        }

        const hasCanonicalReactFile = filesWithContent.some(
          (file) =>
            file.path ===
            `registry/default/components/${getDemoComponentGroup(item.name)}/${item.name}.tsx`
        )
        if (hasCanonicalReactFile) {
          const legacyCompIndex = filesWithContent.findIndex((file) =>
            /^registry\/default\/components\/comp-\d+\.tsx$/.test(file.path)
          )
          if (legacyCompIndex >= 0) {
            filesWithContent.splice(legacyCompIndex, 1)
          }
        }
      }

      let placeholderAdded = false
      const existingExts = filesWithContent.map((f) => path.extname(f.path))

      // 1. HTML Discovery
      const htmlPath = path.join(HTML_COMPONENTS_DIR, `${item.name}.html`)
      if (fs.existsSync(htmlPath) && !filesWithContent.some((f) => f.path.endsWith('.html'))) {
        filesWithContent.push({
          path: `registry/default/html/${item.name}.html`,
          target: `components/ui/${item.name}.html`,
          type: 'registry:component',
          content: decorateHtmlRegistryContent(item.name, fs.readFileSync(htmlPath, 'utf-8')),
        })
      } else {
        const docHtmlPath = path.join(DOCS_HTML_DIR, `${item.name}.html`)
        if (fs.existsSync(docHtmlPath) && !filesWithContent.some((f) => f.path.endsWith('.html'))) {
          filesWithContent.push({
            path: `registry/default/html/${item.name}.html`,
            target: `components/ui/${item.name}.html`,
            type: 'registry:component',
            content: decorateHtmlRegistryContent(item.name, fs.readFileSync(docHtmlPath, 'utf-8')),
          })
        } else if (
          !filesWithContent.some((f) => f.path.endsWith('.html')) &&
          CORE_PARITY_COMPONENTS.includes(item.name)
        ) {
          // Check docs dir or use placeholder (ONLY for Core Components)
          const htmlContent =
            tryReadFile([path.join(DOCS_HTML_DIR, `${item.name}.html`)]) ||
            PLACEHOLDERS.html(item.name)
          filesWithContent.push({
            path: `registry/default/html/${item.name}.html`,
            target: `components/ui/${item.name}.html`,
            type: 'registry:component',
            content: decorateHtmlRegistryContent(item.name, htmlContent),
          })
        }
      }

      // 2. WeApp Discovery (Enhanced)
      if (!filesWithContent.some((f) => f.path.endsWith('.wxml'))) {
        // Check both Primitives dir and Src dir
        // Also check primitive folder structure where files are named index.wxml or [name].wxml
        const possiblePaths = [
          path.join(WEAPP_SRC_DIR, item.name, `${item.name}.wxml`), // packages/weapp/src/[name]/[name].wxml
          path.join(WEAPP_SRC_DIR, item.name, 'index.wxml'), // packages/weapp/src/[name]/index.wxml
          path.join(ROOT, 'packages/weapp/primitives', item.name, `${item.name}.wxml`),
          path.join(ROOT, 'packages/weapp/primitives', item.name, 'index.wxml'),
          path.join(DOCS_WEAPP_DIR, `${item.name}.wxml`),
        ]

        let weappContent: string | undefined
        let foundPath: string | undefined

        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            weappContent = fs.readFileSync(p, 'utf-8')
            foundPath = p
            break
          }
        }

        if (!weappContent && CORE_PARITY_COMPONENTS.includes(item.name)) {
          weappContent = PLACEHOLDERS.weapp(item.name)
        }

        // If we found a real file, we might want to include related files (wxss, ts, json)
        // Check if we already added it (maybe via colocation) - wait, this block runs if NO wxml found.
        // But if foundPath is new..
        if (weappContent) {
          filesWithContent.push({
            path: `registry/default/weapp/${item.name}.wxml`,
            target: `components/ui/${item.name}.wxml`,
            type: 'registry:component',
            content: weappContent,
          })
        }

        // If real path found, try to add WXSS/TS
        if (foundPath) {
          const dir = path.dirname(foundPath)
          const basename = path.basename(foundPath, '.wxml')
          // Add WXSS
          const wxssPath = path.join(dir, `${basename}.wxss`)
          if (fs.existsSync(wxssPath)) {
            filesWithContent.push({
              path: `registry/default/weapp/${item.name}.wxss`,
              target: `components/ui/${item.name}.wxss`,
              type: 'registry:component',
              content: fs.readFileSync(wxssPath, 'utf-8'),
            })
          }
          // Add TS/JS
          const scriptPath = path.join(dir, `${basename}.ts`)
          if (fs.existsSync(scriptPath)) {
            filesWithContent.push({
              path: `registry/default/weapp/${item.name}.ts`,
              target: `components/ui/${item.name}.ts`,
              type: 'registry:component',
              content: fs.readFileSync(scriptPath, 'utf-8'),
            })
          }
          // Add JSON
          const jsonPath = path.join(dir, `${basename}.json`)
          if (fs.existsSync(jsonPath)) {
            filesWithContent.push({
              path: `registry/default/weapp/${item.name}.json`,
              target: `components/ui/${item.name}.json`,
              type: 'registry:component',
              content: fs.readFileSync(jsonPath, 'utf-8'),
            })
          }
          // Add JS (if not TS)
          const jsPath = path.join(dir, `${basename}.js`)
          if (fs.existsSync(jsPath) && !fs.existsSync(scriptPath)) {
            filesWithContent.push({
              path: `registry/default/weapp/${item.name}.js`,
              target: `components/ui/${item.name}.js`,
              type: 'registry:component',
              content: fs.readFileSync(jsPath, 'utf-8'),
            })
          }
        }
      }

      // [NEW] WeApp Subcomponent Discovery (e.g. accordion-item for accordion)
      // Look for folders in WEAPP_SRC_DIR matching `${item.name}-*`
      if (fs.existsSync(WEAPP_SRC_DIR)) {
        try {
          const wDirs = fs.readdirSync(WEAPP_SRC_DIR)
          wDirs.forEach((dir: string) => {
            if (
              dir.startsWith(`${item.name}-`) &&
              fs.statSync(path.join(WEAPP_SRC_DIR, dir)).isDirectory()
            ) {
              // Support both index.* and folder-name.* (e.g. alert-title.wxml)
              const subName = dir // e.g. accordion-item
              const exts = ['wxml', 'wxss', 'json', 'js', 'ts']
              const hasIndexWxml = fs.existsSync(path.join(WEAPP_SRC_DIR, dir, 'index.wxml'))
              const hasNamedWxml = fs.existsSync(path.join(WEAPP_SRC_DIR, dir, `${subName}.wxml`))
              if (hasIndexWxml || hasNamedWxml) {
                exts.forEach((ext: string) => {
                  const indexPath = path.join(WEAPP_SRC_DIR, dir, `index.${ext}`)
                  const namedPath = path.join(WEAPP_SRC_DIR, dir, `${subName}.${ext}`)
                  const resolvedPath = fs.existsSync(indexPath) ? indexPath : namedPath
                  if (fs.existsSync(resolvedPath)) {
                    const fileName = path.basename(resolvedPath)
                    filesWithContent.push({
                      path: `registry/default/weapp/${subName}/${fileName}`, // Virtual path
                      target: `components/ui/${subName}/${fileName}`, // Target in user project
                      type: 'registry:component',
                      content: fs.readFileSync(resolvedPath, 'utf-8'),
                    })
                  }
                })
              }
            }
          })
        } catch (e) {}
      }

      // Recalculate frameworks based on final files list
      const finalFrameworks = new Set<string>(frameworks)
      if (filesWithContent.some((f) => f.path.endsWith('.vue'))) finalFrameworks.add('vue')
      if (filesWithContent.some((f) => f.path.endsWith('.wxml'))) finalFrameworks.add('weapp')
      if (filesWithContent.some((f) => f.path.endsWith('.html'))) finalFrameworks.add('html')
      if (filesWithContent.some((f) => f.path.endsWith('.tsx'))) finalFrameworks.add('react')

      const sortedFrameworks = orderFrameworks(Array.from(finalFrameworks))
      const depsByFramework: Record<
        string,
        {
          registryDependencies: string[]
          dependencies: string[]
          optionalPeerDependencies: string[]
        }
      > = {}
      const demoFrameworkMatrix = isDemoLikeName(item.name)
        ? buildDemoFrameworkMatrix(filesWithContent, item.name)
        : undefined

      sortedFrameworks.forEach((framework) => {
        const frameworkFiles = filterFilesByFramework(filesWithContent, framework)
        depsByFramework[framework] = scanItemDependencies(frameworkFiles)
      })

      const defaultDeps =
        depsByFramework[sortedFrameworks[0]] || scanItemDependencies(filesWithContent)

      const enrichedItem = {
        ...result.data,
        files: filesWithContent,
        dependencies: defaultDeps.dependencies.length
          ? defaultDeps.dependencies
          : result.data.dependencies,
        registryDependencies: defaultDeps.registryDependencies.length
          ? defaultDeps.registryDependencies
          : result.data.registryDependencies,
        optionalPeerDependencies: defaultDeps.optionalPeerDependencies.length
          ? defaultDeps.optionalPeerDependencies
          : result.data.optionalPeerDependencies,
        meta: {
          ...result.data.meta,
          frameworks: sortedFrameworks,
          ...(demoFrameworkMatrix
            ? {
                demoCanonical: {
                  componentName: item.name,
                  group: getDemoComponentGroup(item.name),
                  frameworks: Object.fromEntries(
                    Object.entries(demoFrameworkMatrix).map(([framework, info]) => [
                      framework,
                      {
                        sourceFramework: info.sourceFramework,
                        sourceMode: info.sourceMode,
                        matchedName: info.matchedName,
                        path: info.file?.path,
                      },
                    ])
                  ),
                },
              }
            : {}),
          dependenciesByFramework: Object.fromEntries(
            Object.entries(depsByFramework).map(([framework, deps]) => [
              framework,
              {
                dependencies: deps.dependencies.length ? deps.dependencies : undefined,
                registryDependencies: deps.registryDependencies.length
                  ? deps.registryDependencies
                  : undefined,
                optionalPeerDependencies: deps.optionalPeerDependencies.length
                  ? deps.optionalPeerDependencies
                  : undefined,
              },
            ])
          ),
          placeholder: (result.data.meta as object)?.placeholder || placeholderAdded || false,
          clientOnly:
            CLIENT_ONLY_COMPONENTS.includes(item.name) ||
            (result.data.meta as object)?.clientOnly ||
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
        const dependencies = importDeps.filter(
          (dep) => !dep.startsWith('@/') && !dep.startsWith('.') && !FRAMEWORK_RUNTIME_DEPS.has(dep)
        )

        const item: RegistryItem = {
          name,
          type: 'registry:block',
          description: `Block: ${name}`,
          dependencies: dependencies.length ? Array.from(new Set(dependencies)) : undefined,
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
            tags: category.startsWith('mobile') ? ['mobile', category] : [category],
            clientOnly: isClient,
            viewport: category.startsWith('mobile') ? 'mobile-first' : undefined,
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
      const blocks = JSON.parse(raw) as Array<object>
      blocks.forEach((block) => {
        const name =
          block.name || (block.title ? block.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')
        if (!name) return
        const category = block.category || 'sections'
        const mdxBody = block.mdxBody || ''
        const tagList: string[] = block.tags || [category]

        const files: RegistryItem['files'] = []
        const frameworks: string[] = []
        ;(block.frameworks || []).forEach((fw: object) => {
          const fwName = fw.framework || fw.name
          if (!fwName) return
          const normalized = String(fwName).toLowerCase()
          if (!frameworks.includes(normalized)) frameworks.push(normalized)
          ;(fw.files || []).forEach((file: object, idx: number) => {
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

        const frameworksOrdered = orderFrameworks(frameworks)

        const blockItem: RegistryItem = {
          name,
          type: 'registry:block',
          description: block.description || block.title || name,
          files,
          categories: [category],
          meta: {
            frameworks: frameworksOrdered,
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

  // 2.2 Scan page templates. These are installable app screens meant for
  // agent/CLI flows where the desired output is a complete mobile-first page.
  console.time('Scan Templates')
  const WEB_TEMPLATES_DIR = path.join(ROOT, 'packages/react/src/templates')
  if (fs.existsSync(WEB_TEMPLATES_DIR)) {
    const categories = fs.readdirSync(WEB_TEMPLATES_DIR)
    for (const category of categories) {
      const categoryDir = path.join(WEB_TEMPLATES_DIR, category)
      if (!fs.statSync(categoryDir).isDirectory()) continue

      const files = fs.readdirSync(categoryDir)
      for (const file of files) {
        if (!file.endsWith('.tsx')) continue

        const name = path.basename(file, '.tsx')
        const content = fs.readFileSync(path.join(categoryDir, file), 'utf-8')
        const isClient = /^\s*['"]use client['"]/.test(content)
        const explicitDeps =
          content
            .match(/@registryDependencies\s*:\s*([^\n]+)/i)?.[1]
            ?.split(',')
            .map((s) => s.trim())
            .filter(Boolean) || []
        const importDeps = extractImportsFromTs(content)
        const registryDependencies = normalizeRegistryDeps(importDeps, explicitDeps)
        const dependencies = importDeps.filter(
          (dep) => !dep.startsWith('@/') && !dep.startsWith('.') && !FRAMEWORK_RUNTIME_DEPS.has(dep)
        )

        const item: RegistryItem = {
          name,
          type: 'registry:page',
          description: `Mobile template: ${name}`,
          dependencies: dependencies.length ? Array.from(new Set(dependencies)) : undefined,
          files: [
            {
              path: `templates/${category}/${file}`,
              content,
              type: 'registry:page',
              target: `app/${name}/page.tsx`,
            },
          ],
          categories: [category],
          registryDependencies,
          meta: {
            frameworks: ['react'],
            category,
            tags: ['mobile', 'template', category],
            clientOnly: isClient,
            viewport: 'mobile-first',
            source: 'packages/react/src/templates',
          },
        }

        registryMap.set(name, item)
      }
    }
  }
  console.timeEnd('Scan Templates')

  // Legacy componentsDB ingestion removed intentionally (replaced by blocks-source)

  // 1.5. Prepare Synthetic Items (Utils & Tokens)
  console.time('Prepare Synthetic Items')
  const SHARED_UTILS_PATH = path.join(ROOT, 'packages/core/src/shared/utils.ts')
  let utilsContent = ''
  if (fs.existsSync(SHARED_UTILS_PATH)) {
    utilsContent = fs.readFileSync(SHARED_UTILS_PATH, 'utf-8')
  }

  const utilsItem: RegistryItem = {
    name: 'utils',
    type: 'registry:lib',
    description: 'Utility functions',
    dependencies: ['clsx', 'tailwind-merge', 'class-variance-authority'],
    files: [
      {
        path: 'lib/utils.ts',
        content: utilsContent,
        type: 'registry:lib',
        target: 'lib/utils.ts',
      },
    ],
  }
  registryMap.set('utils', utilsItem)

  // 1.6. Prepare UI Tokens Item
  // We read the generated CSS from packages/tokens/dist/theme.css (assuming it's built)
  // Or we can invoke the build? For now, assume it's there or read source?
  // The build script 'packages/tokens/build.ts' generates theme.css.
  // We should try to read it.
  const TOKENS_CSS_PATH = path.join(ROOT, 'packages/tokens/dist/theme.css')
  let cssContent = ''
  if (fs.existsSync(TOKENS_CSS_PATH)) {
    cssContent = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8')
  } else {
    // If dist is missing, maybe we can run the build?
    // Or just warn? For robustness, let's warn.
    console.warn(
      '[Build] Warning: packages/tokens/dist/theme.css not found. ui-tokens will be empty.'
    )
  }

  const tokensItem: RegistryItem = {
    name: 'ui-tokens',
    type: 'registry:theme',
    description: 'Design tokens (CSS Variables)',
    files: [
      {
        path: 'styles/theme.css',
        content: cssContent,
        type: 'registry:css',
        target: 'src/styles/theme.css', // Suggested location
      },
    ],
  }
  registryMap.set('ui-tokens', tokensItem)

  console.timeEnd('Prepare Synthetic Items')

  // Transform imports in all items
  console.time('Transform Imports')
  for (const item of registryMap.values()) {
    if (item.name === 'utils') continue

    // Add utils dependency if it's missing and needed?
    // Actually we will detect usages below.

    item.files?.forEach((file) => {
      if (!file.content) return

      // Keep @timui/core imports intact for source-distribution.

      // Transform relative hooks imports: ../../hooks/ -> ../hooks/
      // Logic:
      // Source layout: packages/react/src/components/ui/foo.tsx -> ../../hooks/use-foo
      // Target layout: registry/default/ui/foo.tsx -> ../hooks/use-foo
      if (file.content.includes('../../hooks/')) {
        console.log(`[Transform] Fixing hooks import in ${item.name} (${file.path})`)
        file.content = file.content.replace(/\.\.\/\.\.\/hooks\//g, '../hooks/')
      }

      // Transform @timui/tokens -> CSS variables are globally available, no import needed usually?
      // Or maybe usage of token values in JS?
      // If code uses `import ... from '@timui/tokens'`, we might need to handle it.
      // But typically tokens are just CSS/Vars.
    })
  }
  console.timeEnd('Transform Imports')

  const mergedItems = Array.from(registryMap.values())
  const aliasMap = loadRegistryAliases()
  const aliasesByCanonical = new Map<string, string[]>()

  Object.entries(aliasMap).forEach(([alias, canonical]) => {
    if (!aliasesByCanonical.has(canonical)) aliasesByCanonical.set(canonical, [])
    aliasesByCanonical.get(canonical)!.push(alias)
  })

  mergedItems.forEach((item) => {
    const aliases = aliasesByCanonical.get(item.name)
    if (!aliases?.length) return
    item.meta = {
      ...(item.meta || {}),
      aliases: Array.from(new Set(aliases)).sort(),
    }
  })

  // Normalize block metadata: activate by default (unless migrated/duplicate),
  // and synthesize a minimal MDX body when missing so sections can render.
  mergedItems.forEach((item) => {
    if (item.type !== 'registry:block') return
    const meta = { ...(item.meta || {}) }
    // Default active when not explicitly set and not shadowed by UI component name
    if (meta.isActive === undefined) {
      meta.isActive = !uiNameSet.has(item.name) && !meta.migratedTo
      if (!meta.isActive) {
        console.log(
          `[Build] Deactivating block ${item.name}: uiNameSet=${uiNameSet.has(item.name)}, migratedTo=${meta.migratedTo}`
        )
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
    catalogSkeleton.categories.forEach((cat: object) => {
      ;(cat.components || []).forEach((c: object) => {
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

  // Persist normalized semantic titles for demo-like components.
  mergedItems.forEach((item) => {
    if (!/-\d{1,3}$/.test(item.name)) return

    const componentSlug = item.name.replace(/-\d{1,3}$/, '')
    const existingMeta = { ...(item.meta || {}) }
    const explicitTitle = typeof existingMeta.title === 'string' ? existingMeta.title : undefined
    const normalizedTitle = resolveDemoDisplayTitle(
      componentSlug,
      item.name,
      item.files || [],
      explicitTitle
    )

    item.meta = {
      ...existingMeta,
      title: normalizedTitle,
    }
  })

  // 3. Build Catalog Structure (Categories and Sections) dynamically based on Registry + Skeleton Metadata

  // A. Categories (Base UI usually)
  // We can count items per category
  const categoryCounts: Record<string, object[]> = {}
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

  const finalCategories = catalogSkeleton.categories.map((cat: object) => {
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
  const finalSections = catalogSkeleton.sections.map((sec: object) => {
    // ...
  })
  
  // Append object block categories...
  sectionsFound.forEach((cat) => {
     // ...
  })
  */

  // Empty sections to remove "Marketing UI" and "Application UI" from sidebar
  const finalSections: object[] = []

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
      const hasMdx = !!(item.meta as object)?.mdxBody?.trim()
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
  if (fs.existsSync(splitRegistryDir)) {
    fs.rmSync(splitRegistryDir, { recursive: true, force: true })
  }
  if (fs.existsSync(DOCS_DATA_REGISTRY_DIR)) {
    fs.rmSync(DOCS_DATA_REGISTRY_DIR, { recursive: true, force: true })
  }
  fs.mkdirSync(splitRegistryDir, { recursive: true })
  fs.mkdirSync(DOCS_DATA_REGISTRY_DIR, { recursive: true })

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
