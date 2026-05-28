import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const docsDemoRoot = fileURLToPath(new URL('../docs/registry/default/components', import.meta.url))
const docsVueRoot = fileURLToPath(new URL('../docs/registry/default/vue', import.meta.url))
const docsHooksRoot = fileURLToPath(new URL('../docs/registry/default/hooks', import.meta.url))
const packageHtmlRoot = fileURLToPath(new URL('../../packages/html/src', import.meta.url))
const packageVueRoot = fileURLToPath(new URL('../../packages/vue', import.meta.url))
const packageVueUiRoot = fileURLToPath(
  new URL('../../packages/vue/src/components/ui', import.meta.url)
)
const packageVueIndex = path.join(packageVueRoot, 'src/index.ts')
const packageVueUiIndex = path.join(packageVueUiRoot, 'index.ts')
const VIRTUAL_UI_PREFIX = '\0timui-ui:'
const VIRTUAL_ASSET_PREFIX = '\0timui-preview-asset:'
const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

function walkVueFiles(rootDir: string): string[] {
  if (!fs.existsSync(rootDir)) return []
  const entries = fs.readdirSync(rootDir, { withFileTypes: true })
  const result: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      result.push(...walkVueFiles(fullPath))
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.vue')) {
      result.push(fullPath)
    }
  }
  return result
}

const toPascalCase = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const packageUiByFileName = new Map<string, string>()
for (const filePath of walkVueFiles(packageVueUiRoot)) {
  const baseName = path.basename(filePath, '.vue')
  if (!packageUiByFileName.has(baseName)) {
    packageUiByFileName.set(baseName, filePath)
  }
}

const virtualUiModules = new Map<string, string>()

function resolveExactUiModule(token: string): string | null {
  if (!token) return null

  const roots = [docsVueRoot, packageVueUiRoot]
  for (const root of roots) {
    const direct = path.join(root, token)
    const directTs = `${direct}.ts`
    const directVue = `${direct}.vue`
    const indexTs = path.join(direct, 'index.ts')
    const indexVue = path.join(direct, 'index.vue')
    const nestedVue = path.join(direct, `${path.basename(token)}.vue`)

    if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct
    if (fs.existsSync(directTs)) return directTs
    if (fs.existsSync(directVue)) return directVue
    if (fs.existsSync(indexTs)) return indexTs
    if (fs.existsSync(indexVue)) return indexVue
    if (fs.existsSync(nestedVue)) return nestedVue
  }

  const byFileName = packageUiByFileName.get(token)
  if (byFileName && fs.existsSync(byFileName)) return byFileName
  return null
}

function resolveVirtualUiModule(token: string): string | null {
  if (!token || token.includes('/')) return null

  const folder = path.join(packageVueUiRoot, token)
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) return null

  const vueFiles = fs
    .readdirSync(folder)
    .filter((file) => file.endsWith('.vue'))
    .sort()
  if (vueFiles.length === 0) return null

  const lines = vueFiles.map((file) => {
    const base = path.basename(file, '.vue')
    const exportName = toPascalCase(base)
    const absPath = path.join(folder, file)
    return `export { default as ${exportName} } from ${JSON.stringify(absPath)}`
  })

  if (fs.existsSync(packageVueUiIndex)) {
    lines.push(`export * from ${JSON.stringify(packageVueUiIndex)}`)
  }

  const virtualId = `${VIRTUAL_UI_PREFIX}${token}`
  virtualUiModules.set(virtualId, `${lines.join('\n')}\n`)
  return virtualId
}

function resolveUiToken(token: string): string | null {
  const exact = resolveExactUiModule(token)
  if (exact) return exact
  const virtual = resolveVirtualUiModule(token)
  if (virtual) return virtual
  return null
}

function resolveUiImport(source: string): string | null {
  if (!source.startsWith('@/components/ui/')) return null
  const token = source.slice('@/components/ui/'.length)
  return resolveUiToken(token)
}

export default defineConfig({
  base: '/preview/vue/',
  define: {
    __TIMUI_DOCS_DEMO_ROOT__: JSON.stringify(docsDemoRoot),
  },
  plugins: [
    {
      name: 'timui-vue-preview-ui-resolver',
      enforce: 'pre',
      resolveId(source) {
        if (!source.startsWith('@/components/ui/')) return null
        return resolveUiImport(source)
      },
      load(id) {
        return virtualUiModules.get(id) ?? null
      },
    },
    {
      name: 'timui-vue-preview-asset-placeholder',
      enforce: 'pre',
      resolveId(source, importer) {
        if (!importer?.startsWith(docsDemoRoot)) return null
        if (!/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(source)) return null
        return `${VIRTUAL_ASSET_PREFIX}${source}`
      },
      load(id) {
        if (!id.startsWith(VIRTUAL_ASSET_PREFIX)) return null
        return `export default ${JSON.stringify(transparentPixel)}`
      },
    },
    vue(),
  ],
  server: {
    port: 3003,
    strictPort: true,
    cors: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 3003,
    strictPort: true,
  },
  resolve: {
    alias: [
      {
        find: '@/components/ui',
        replacement: packageVueUiRoot,
      },
      {
        find: '@/registry/default/components',
        replacement: docsDemoRoot,
      },
      {
        find: '@/registry/default/hooks',
        replacement: docsHooksRoot,
      },
      {
        find: /^@timui\/vue$/,
        replacement: packageVueIndex,
      },
      {
        find: '@timui/html',
        replacement: path.join(packageHtmlRoot, 'index.ts'),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
})
