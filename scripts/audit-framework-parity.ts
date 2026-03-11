import fs from 'fs'
import path from 'path'

import { componentParts } from '../packages/core/src/shared/component-parts'
import { htmlAdapterTemplateNames } from '../packages/html/src/capabilities'
import { htmlRuntimeSelectorByName } from '../packages/html/src/runtime-metadata'

const ROOT = path.resolve(__dirname, '..')
const REACT_UI_DIR = path.join(ROOT, 'packages/react/src/components/ui')
const VUE_UI_DIR = path.join(ROOT, 'packages/vue/src/components/ui')
const HTML_COMPONENTS_DIR = path.join(ROOT, 'packages/html/src/components')
const CORE_COMPONENT_NAMES_PATH = path.join(ROOT, 'packages/core/src/shared/component-names.ts')
const REACT_MANIFEST_PATH = path.join(ROOT, 'packages/react/src/manifest.ts')
const VUE_MANIFEST_PATH = path.join(ROOT, 'packages/vue/src/manifest.ts')
const HTML_MANIFEST_PATH = path.join(ROOT, 'packages/html/src/manifest.ts')
const REACT_PACKAGE_JSON_PATH = path.join(ROOT, 'packages/react/package.json')
const VUE_PACKAGE_JSON_PATH = path.join(ROOT, 'packages/vue/package.json')
const HTML_PACKAGE_JSON_PATH = path.join(ROOT, 'packages/html/package.json')
const OUTPUT_PATH = path.join(ROOT, 'apps/docs/registry/framework-parity-report.json')

type CoreUsageCategory = 'direct' | 'transitive' | 'wrapper-only' | 'local-only' | 'unknown'

type ComponentEntry = {
  name: string
  kind: 'file' | 'dir' | 'mixed'
  paths: string[]
}

type VueCoreUsageRecord = {
  component: string
  category: CoreUsageCategory
  disposition: 'allowed-local-only' | 'needs-core-review' | 'core-backed'
  directCoreFiles: string[]
  reachableCoreFiles: string[]
  entryFiles: string[]
}

const allowedVueLocalOnlyComponents = new Set([
  'group',
  'header',
  'list-box-section',
  'otpinput',
  'presence',
  'profile-bg',
  'slot',
  'sonner',
  'status-dot',
  'toaster',
])

const failures: string[] = []

function listTopLevelComponents(dir: string, exts: string[]): ComponentEntry[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const result = new Map<string, ComponentEntry>()

  for (const entry of entries) {
    if (entry.isFile()) {
      const matchedExt = exts.find((ext) => entry.name.endsWith(ext))
      if (!matchedExt) continue

      const name = path.basename(entry.name, matchedExt)
      const current = result.get(name)
      const nextPath = path.join(dir, entry.name)

      if (current) {
        current.kind = current.kind === 'dir' ? 'mixed' : 'file'
        current.paths.push(nextPath)
      } else {
        result.set(name, {
          name,
          kind: 'file',
          paths: [nextPath],
        })
      }
      continue
    }

    if (entry.isDirectory()) {
      const entryPath = path.join(dir, entry.name)
      const current = result.get(entry.name)
      if (current) {
        current.kind = current.kind === 'file' ? 'mixed' : 'dir'
        current.paths.push(entryPath)
      } else {
        result.set(entry.name, { name: entry.name, kind: 'dir', paths: [entryPath] })
      }
    }
  }

  return Array.from(result.values()).sort((a, b) => a.name.localeCompare(b.name))
}

function walkFiles(rootDir: string, exts: string[]): string[] {
  if (!fs.existsSync(rootDir)) return []
  const result: string[] = []
  const entries = fs.readdirSync(rootDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      result.push(...walkFiles(fullPath, exts))
      continue
    }
    if (entry.isFile() && exts.some((ext) => entry.name.endsWith(ext))) {
      result.push(fullPath)
    }
  }

  return result
}

function readFile(file: string): string {
  return fs.readFileSync(file, 'utf-8')
}

function readJson(file: string): Record<string, unknown> {
  return JSON.parse(readFile(file)) as Record<string, unknown>
}

function extractStringArray(filePath: string, constName: string): string[] {
  const content = readFile(filePath)
  const match = content.match(new RegExp(`export const ${constName} = \\[([\\s\\S]*?)\\] as const`))
  if (!match) return []

  return Array.from(match[1].matchAll(/'([^']+)'|"([^"]+)"/g))
    .map((entry) => entry[1] || entry[2])
    .filter(Boolean)
}

function usesCoreImport(files: string[]): string[] {
  const directCoreFiles: string[] = []

  for (const file of files) {
    const content = readFile(file)
    if (content.includes('@timui/core')) {
      directCoreFiles.push(file)
    }
  }

  return directCoreFiles
}

function resolveLocalImport(importSource: string, fromFile: string): string | null {
  if (!importSource.startsWith('.')) return null

  const fromDir = path.dirname(fromFile)
  const basePath = path.resolve(fromDir, importSource)
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.vue`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.vue'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) || null
}

function parseLocalImports(file: string): string[] {
  const content = readFile(file)
  const imports = new Set<string>()
  const patterns = [
    /import\s+[^'"]*?from\s+['"]([^'"]+)['"]/g,
    /export\s+[^'"]*?from\s+['"]([^'"]+)['"]/g,
  ]

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const resolved = resolveLocalImport(match[1], file)
      if (resolved) imports.add(resolved)
    }
  }

  return Array.from(imports)
}

function buildLocalImportGraph(files: string[]): Map<string, string[]> {
  return new Map(files.map((file) => [file, parseLocalImports(file)]))
}

function collectReachableCoreFiles(
  entryFiles: string[],
  directCoreFiles: Set<string>,
  importGraph: Map<string, string[]>
): string[] {
  const visited = new Set<string>()
  const queue = [...entryFiles]
  const reachableCoreFiles = new Set<string>()

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || visited.has(current)) continue
    visited.add(current)

    if (directCoreFiles.has(current)) {
      reachableCoreFiles.add(current)
    }

    for (const dependency of importGraph.get(current) || []) {
      if (!visited.has(dependency)) {
        queue.push(dependency)
      }
    }
  }

  return Array.from(reachableCoreFiles).sort()
}

function isWrapperOnly(entryFiles: string[], importGraph: Map<string, string[]>): boolean {
  if (entryFiles.length !== 1) return false
  const [entryFile] = entryFiles
  const dependencies = importGraph.get(entryFile) || []
  const content = readFile(entryFile)
  const nonCommentLines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('//'))

  const wrapperSignals =
    content.includes('export { default') ||
    content.includes('v-bind="$attrs"') ||
    content.includes('<slot') ||
    content.includes('<script lang="ts">')

  return wrapperSignals && dependencies.length > 0 && nonCommentLines.length <= 12
}

const reactEntries = listTopLevelComponents(REACT_UI_DIR, ['.tsx'])
const vueEntries = listTopLevelComponents(VUE_UI_DIR, ['.vue', '.ts'])

const reactEntryMap = new Map(reactEntries.map((entry) => [entry.name, entry]))
const vueEntryMap = new Map(vueEntries.map((entry) => [entry.name, entry]))

const componentNames = extractStringArray(CORE_COMPONENT_NAMES_PATH, 'componentNames')
const reactExtraComponents = extractStringArray(REACT_MANIFEST_PATH, 'extraComponents')
const vueExtraComponents = extractStringArray(VUE_MANIFEST_PATH, 'extraComponents')
const htmlExtraComponents = extractStringArray(HTML_MANIFEST_PATH, 'extraComponents')

const reactNames = new Set<string>([...componentNames, ...reactExtraComponents])
const vueNames = new Set<string>([...componentNames, ...vueExtraComponents])
const htmlNames = new Set<string>([...componentNames, ...htmlExtraComponents])

const missingInVue = Array.from(reactNames)
  .filter((name) => !vueNames.has(name))
  .sort()
const missingInReact = Array.from(vueNames)
  .filter((name) => !reactNames.has(name))
  .sort()
const missingInHtmlManifest = Array.from(componentNames)
  .filter((name) => !htmlNames.has(name))
  .sort()
const unexpectedHtmlManifestComponents = Array.from(htmlNames)
  .filter((name) => !componentNames.includes(name as (typeof componentNames)[number]))
  .sort()

const allVueFiles = walkFiles(VUE_UI_DIR, ['.vue', '.ts'])
const vueImportGraph = buildLocalImportGraph(allVueFiles)
const directVueCoreFiles = new Set(usesCoreImport(allVueFiles))
const vueCoreUsage: VueCoreUsageRecord[] = []
const vueParityNames = Array.from(vueNames).sort()

for (const componentName of vueParityNames) {
  const entry = vueEntryMap.get(componentName)
  if (!entry) continue
  const files =
    entry.kind === 'file'
      ? entry.paths
      : entry.paths.flatMap((entryPath) => {
          const stat = fs.statSync(entryPath)
          return stat.isDirectory() ? walkFiles(entryPath, ['.vue', '.ts']) : [entryPath]
        })

  if (!files.length) continue

  const directCoreFiles = usesCoreImport(files)
  const reachableCoreFiles = collectReachableCoreFiles(files, directVueCoreFiles, vueImportGraph)

  let category: CoreUsageCategory = 'unknown'
  if (directCoreFiles.length > 0) {
    category = 'direct'
  } else if (reachableCoreFiles.length > 0) {
    category = isWrapperOnly(files, vueImportGraph) ? 'wrapper-only' : 'transitive'
  } else {
    category = 'local-only'
  }

  vueCoreUsage.push({
    component: entry.name,
    category,
    disposition:
      category === 'local-only' || category === 'unknown'
        ? allowedVueLocalOnlyComponents.has(entry.name)
          ? 'allowed-local-only'
          : 'needs-core-review'
        : 'core-backed',
    directCoreFiles: directCoreFiles.map((file) => path.relative(ROOT, file)).sort(),
    reachableCoreFiles: reachableCoreFiles.map((file) => path.relative(ROOT, file)),
    entryFiles: files.map((file) => path.relative(ROOT, file)).sort(),
  })
}

const listHtmlNames = (ext: string, pattern: RegExp) =>
  fs
    .readdirSync(HTML_COMPONENTS_DIR)
    .filter((name) => name.endsWith(ext))
    .map((name) => name.replace(pattern, ''))
    .sort()

const htmlTemplateNames = listHtmlNames('.hbs', /\.hbs$/)
const htmlCompiledNames = listHtmlNames('.html', /\.html$/)
const htmlAdapterNames = listHtmlNames('.adapter.js', /\.adapter\.js$/)
const allowedHtmlSupplementalTemplateNames = Array.from(
  new Set(Object.values(componentParts).flatMap((parts) => parts || []))
).sort()

const missingHtmlTemplates = Array.from(componentNames)
  .filter((name) => !htmlTemplateNames.includes(name))
  .sort()
const unexpectedHtmlTemplates = htmlTemplateNames
  .filter((name) => !htmlNames.has(name) && !allowedHtmlSupplementalTemplateNames.includes(name))
  .sort()
const missingHtmlCompiled = htmlTemplateNames
  .filter((name) => !htmlCompiledNames.includes(name))
  .sort()
const adapterCapabilitiesMissingTemplate = htmlAdapterTemplateNames
  .filter((name) => !htmlTemplateNames.includes(name))
  .sort()
const adapterCapabilitiesMissingAdapterFile = htmlAdapterTemplateNames
  .filter((name) => !htmlAdapterNames.includes(name))
  .sort()
const adapterFilesMissingCapability = htmlAdapterNames
  .filter(
    (name) => !htmlAdapterTemplateNames.includes(name as (typeof htmlAdapterTemplateNames)[number])
  )
  .sort()
const htmlRuntimeNamesMissingSelector = htmlAdapterTemplateNames
  .filter((name) => !htmlRuntimeSelectorByName[name])
  .sort()

const reactPackageExports = (readJson(REACT_PACKAGE_JSON_PATH).exports || {}) as Record<
  string,
  unknown
>
const vuePackageExports = (readJson(VUE_PACKAGE_JSON_PATH).exports || {}) as Record<string, unknown>
const htmlPackageExports = (readJson(HTML_PACKAGE_JSON_PATH).exports || {}) as Record<
  string,
  unknown
>

const packageExportSummary = {
  react: {
    manifest: Boolean(reactPackageExports['./manifest']),
    ui: Boolean(reactPackageExports['./ui']),
    components: Boolean(reactPackageExports['./components']),
  },
  vue: {
    manifest: Boolean(vuePackageExports['./manifest']),
    ui: Boolean(vuePackageExports['./ui']),
    components: Boolean(vuePackageExports['./components']),
  },
  html: {
    manifest: Boolean(htmlPackageExports['./manifest']),
    root: Boolean(htmlPackageExports['.']),
    components: Boolean(htmlPackageExports['./components/*']),
  },
}

if (missingInVue.length > 0) {
  failures.push(`Vue manifest is missing React/core components: ${missingInVue.join(', ')}`)
}

if (missingInReact.length > 0) {
  failures.push(`React manifest is missing Vue/core components: ${missingInReact.join(', ')}`)
}

if (missingInHtmlManifest.length > 0) {
  failures.push(`HTML manifest is missing core components: ${missingInHtmlManifest.join(', ')}`)
}

if (unexpectedHtmlManifestComponents.length > 0) {
  failures.push(
    `HTML manifest declares non-core components: ${unexpectedHtmlManifestComponents.join(', ')}`
  )
}

if (missingHtmlTemplates.length > 0) {
  failures.push(`HTML templates are missing core components: ${missingHtmlTemplates.join(', ')}`)
}

if (unexpectedHtmlTemplates.length > 0) {
  failures.push(
    `HTML templates contain unexpected component names: ${unexpectedHtmlTemplates.join(', ')}`
  )
}

if (missingHtmlCompiled.length > 0) {
  failures.push(`HTML compiled templates are missing: ${missingHtmlCompiled.join(', ')}`)
}

if (adapterCapabilitiesMissingTemplate.length > 0) {
  failures.push(
    `HTML adapter capabilities have no matching templates: ${adapterCapabilitiesMissingTemplate.join(', ')}`
  )
}

if (adapterCapabilitiesMissingAdapterFile.length > 0) {
  failures.push(
    `HTML adapter capabilities are missing adapter files: ${adapterCapabilitiesMissingAdapterFile.join(', ')}`
  )
}

if (adapterFilesMissingCapability.length > 0) {
  failures.push(
    `HTML adapter files exist without capability declarations: ${adapterFilesMissingCapability.join(', ')}`
  )
}

if (htmlRuntimeNamesMissingSelector.length > 0) {
  failures.push(
    `HTML adapter capabilities are missing runtime selectors: ${htmlRuntimeNamesMissingSelector.join(', ')}`
  )
}

if (
  !packageExportSummary.react.manifest ||
  !packageExportSummary.react.ui ||
  !packageExportSummary.react.components
) {
  failures.push('packages/react/package.json is missing required implementation exports')
}

if (
  !packageExportSummary.vue.manifest ||
  !packageExportSummary.vue.ui ||
  !packageExportSummary.vue.components
) {
  failures.push('packages/vue/package.json is missing required implementation exports')
}

if (
  !packageExportSummary.html.manifest ||
  !packageExportSummary.html.root ||
  !packageExportSummary.html.components
) {
  failures.push('packages/html/package.json is missing required implementation exports')
}

const report = {
  generatedAt: new Date().toISOString(),
  reactCount: reactNames.size,
  vueCount: vueNames.size,
  htmlManifestCount: htmlNames.size,
  missingInVue,
  missingInReact,
  missingInHtmlManifest,
  unexpectedHtmlManifestComponents,
  reactSupplementalTopLevelEntries: reactEntries
    .map((entry) => entry.name)
    .filter((name) => !reactNames.has(name))
    .sort(),
  vueSupplementalTopLevelEntries: vueEntries
    .map((entry) => entry.name)
    .filter((name) => !vueNames.has(name))
    .sort(),
  vueCoreUsageSummary: {
    direct: vueCoreUsage.filter((record) => record.category === 'direct').length,
    transitive: vueCoreUsage.filter((record) => record.category === 'transitive').length,
    wrapperOnly: vueCoreUsage.filter((record) => record.category === 'wrapper-only').length,
    localOnly: vueCoreUsage.filter((record) => record.category === 'local-only').length,
    unknown: vueCoreUsage.filter((record) => record.category === 'unknown').length,
    allowedLocalOnly: vueCoreUsage.filter((record) => record.disposition === 'allowed-local-only')
      .length,
    needsCoreReview: vueCoreUsage.filter((record) => record.disposition === 'needs-core-review')
      .length,
  },
  vueComponentsMissingDirectCoreImport: vueCoreUsage
    .filter((record) => record.category !== 'direct')
    .map((record) => record.component)
    .sort(),
  vueComponentsWithoutReachableCore: vueCoreUsage
    .filter((record) => record.category === 'local-only' || record.category === 'unknown')
    .map((record) => record.component)
    .sort(),
  vueComponentsAllowedLocalOnly: vueCoreUsage
    .filter((record) => record.disposition === 'allowed-local-only')
    .map((record) => record.component)
    .sort(),
  vueComponentsNeedingCoreReview: vueCoreUsage
    .filter((record) => record.disposition === 'needs-core-review')
    .map((record) => record.component)
    .sort(),
  htmlSummary: {
    templateCount: htmlTemplateNames.length,
    compiledCount: htmlCompiledNames.length,
    adapterCount: htmlAdapterNames.length,
    templateWithAdapter: htmlAdapterTemplateNames.length,
    allowedSupplementalTemplates: allowedHtmlSupplementalTemplateNames,
    missingHtmlTemplates,
    unexpectedHtmlTemplates,
    missingHtmlCompiled,
    adapterCapabilitiesMissingTemplate,
    adapterCapabilitiesMissingAdapterFile,
    adapterFilesMissingCapability,
    htmlRuntimeNamesMissingSelector,
  },
  packageExportSummary,
  vueCoreUsage,
}

const outputDir = path.dirname(OUTPUT_PATH)
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf-8')

console.log(`Framework parity report written: ${OUTPUT_PATH}`)

if (failures.length > 0) {
  throw new Error(`Framework parity checks failed:\n- ${failures.join('\n- ')}`)
}

console.log('Framework parity checks: PASS')
