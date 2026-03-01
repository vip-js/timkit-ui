import fs from 'fs'
import path from 'path'

type Platform = 'react' | 'vue' | 'weapp' | 'html'

type ComponentSize = {
  name: string
  bytes: number
}

type Baseline = {
  generatedAt: string
  platforms: Record<Platform, {
    total: number
    components: Record<string, number>
  }>
}

const ROOT = path.resolve(__dirname, '..')
const CORE_BASE_PATH = path.join(ROOT, 'packages/core/src/components/base.ts')
const REACT_UI_DIR = path.join(ROOT, 'packages/react/src/components/ui')
const VUE_UI_DIR = path.join(ROOT, 'packages/vue/src/components/ui')
const WEAPP_UI_DIR = path.join(ROOT, 'packages/weapp/src')
const HTML_UI_DIR = path.join(ROOT, 'packages/html/src/components')

const fileExists = (target: string) => fs.existsSync(target)
const fileSize = (target: string) => (fileExists(target) ? fs.statSync(target).size : 0)

const parseCoreComponentNames = (): string[] => {
  const content = fs.readFileSync(CORE_BASE_PATH, 'utf-8')
  const names = new Set<string>()
  const matches = content.match(/'[^']+'/g) || []
  matches.forEach((token) => names.add(token.slice(1, -1)))
  return Array.from(names).sort()
}

const resolveVueImpl = (name: string) => {
  const dirBased = path.join(VUE_UI_DIR, name, `${name}.vue`)
  if (fileExists(dirBased)) return dirBased
  const flatBased = path.join(VUE_UI_DIR, `${name}.vue`)
  if (fileExists(flatBased)) return flatBased
  return ''
}

const resolveWeappComponentPath = (name: string, ext: string) => {
  const byName = path.join(WEAPP_UI_DIR, name, `${name}.${ext}`)
  if (fileExists(byName)) return byName
  const byIndex = path.join(WEAPP_UI_DIR, name, `index.${ext}`)
  if (fileExists(byIndex)) return byIndex
  return ''
}

const collectPlatformSizes = (componentNames: string[]): Record<Platform, ComponentSize[]> => {
  const react: ComponentSize[] = []
  const vue: ComponentSize[] = []
  const weapp: ComponentSize[] = []
  const html: ComponentSize[] = []

  componentNames.forEach((name) => {
    const reactFile = path.join(REACT_UI_DIR, `${name}.tsx`)
    if (fileExists(reactFile)) react.push({ name, bytes: fileSize(reactFile) })

    const vueFile = resolveVueImpl(name)
    if (vueFile) vue.push({ name, bytes: fileSize(vueFile) })

    const htmlFile = path.join(HTML_UI_DIR, `${name}.html`)
    if (fileExists(htmlFile)) html.push({ name, bytes: fileSize(htmlFile) })

    const weappFiles = [
      resolveWeappComponentPath(name, 'wxml'),
      resolveWeappComponentPath(name, 'wxss'),
      resolveWeappComponentPath(name, 'json'),
      resolveWeappComponentPath(name, 'ts') || resolveWeappComponentPath(name, 'js'),
    ].filter(Boolean)
    if (weappFiles.length) {
      const bytes = weappFiles.reduce((sum, p) => sum + fileSize(p), 0)
      weapp.push({ name, bytes })
    }
  })

  return { react, vue, weapp, html }
}

const totalBytes = (items: ComponentSize[]) => items.reduce((sum, item) => sum + item.bytes, 0)

const toComponentMap = (items: ComponentSize[]) =>
  items.reduce<Record<string, number>>((acc, item) => {
    acc[item.name] = item.bytes
    return acc
  }, {})

const outPath = path.resolve(ROOT, process.env.GOAL_PERF_BASELINE_OUT || 'scripts/perf-baseline.json')
const names = parseCoreComponentNames()
const sizes = collectPlatformSizes(names)

const baseline: Baseline = {
  generatedAt: new Date().toISOString(),
  platforms: {
    react: { total: totalBytes(sizes.react), components: toComponentMap(sizes.react) },
    vue: { total: totalBytes(sizes.vue), components: toComponentMap(sizes.vue) },
    weapp: { total: totalBytes(sizes.weapp), components: toComponentMap(sizes.weapp) },
    html: { total: totalBytes(sizes.html), components: toComponentMap(sizes.html) },
  },
}

fs.writeFileSync(outPath, JSON.stringify(baseline, null, 2))
console.log(`Perf baseline generated: ${outPath}`)
