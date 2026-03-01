import fs from 'fs'
import path from 'path'

type Severity = 'critical' | 'major' | 'minor'

type Finding = {
  severity: Severity
  message: string
}

type Platform = 'react' | 'vue' | 'weapp' | 'html'

type Budget = {
  perComponentMaxBytes: number
  totalMaxBytes: number
}

type ComponentSize = {
  name: string
  bytes: number
}

type Baseline = {
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

const DEFAULT_BUDGETS: Record<Platform, Budget> = {
  react: {
    perComponentMaxBytes: 22000,
    totalMaxBytes: 220000,
  },
  vue: {
    perComponentMaxBytes: 18000,
    totalMaxBytes: 130000,
  },
  weapp: {
    perComponentMaxBytes: 12000,
    totalMaxBytes: 190000,
  },
  html: {
    perComponentMaxBytes: 6000,
    totalMaxBytes: 50000,
  },
}

const parseCoreComponentNames = (): string[] => {
  const content = fs.readFileSync(CORE_BASE_PATH, 'utf-8')
  const names = new Set<string>()
  const matches = content.match(/'[^']+'/g) || []
  matches.forEach((token) => {
    names.add(token.slice(1, -1))
  })
  return Array.from(names).sort()
}

const fileExists = (target: string) => fs.existsSync(target)
const fileSize = (target: string) => (fileExists(target) ? fs.statSync(target).size : 0)

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

const parseBudgetValue = (envName: string, fallback: number): number => {
  const raw = process.env[envName]
  if (!raw) return fallback
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}

const parseDeltaValue = (envName: string, fallback: number): number => {
  const raw = process.env[envName]
  if (!raw) return fallback
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed < 0) return fallback
  return Math.floor(parsed)
}

const loadBaseline = (): Baseline | null => {
  const baselinePath = process.env.GOAL_PERF_BASELINE
    ? path.resolve(ROOT, process.env.GOAL_PERF_BASELINE)
    : ''
  if (!baselinePath || !fileExists(baselinePath)) return null

  try {
    const payload = fs.readFileSync(baselinePath, 'utf-8')
    return JSON.parse(payload) as Baseline
  } catch {
    return null
  }
}

const loadBudgets = (): Record<Platform, Budget> => {
  return {
    react: {
      perComponentMaxBytes: parseBudgetValue('GOAL_REACT_PER_MAX', DEFAULT_BUDGETS.react.perComponentMaxBytes),
      totalMaxBytes: parseBudgetValue('GOAL_REACT_TOTAL_MAX', DEFAULT_BUDGETS.react.totalMaxBytes),
    },
    vue: {
      perComponentMaxBytes: parseBudgetValue('GOAL_VUE_PER_MAX', DEFAULT_BUDGETS.vue.perComponentMaxBytes),
      totalMaxBytes: parseBudgetValue('GOAL_VUE_TOTAL_MAX', DEFAULT_BUDGETS.vue.totalMaxBytes),
    },
    weapp: {
      perComponentMaxBytes: parseBudgetValue('GOAL_WEAPP_PER_MAX', DEFAULT_BUDGETS.weapp.perComponentMaxBytes),
      totalMaxBytes: parseBudgetValue('GOAL_WEAPP_TOTAL_MAX', DEFAULT_BUDGETS.weapp.totalMaxBytes),
    },
    html: {
      perComponentMaxBytes: parseBudgetValue('GOAL_HTML_PER_MAX', DEFAULT_BUDGETS.html.perComponentMaxBytes),
      totalMaxBytes: parseBudgetValue('GOAL_HTML_TOTAL_MAX', DEFAULT_BUDGETS.html.totalMaxBytes),
    },
  }
}

const collectPlatformSizes = (componentNames: string[]): Record<Platform, ComponentSize[]> => {
  const reactSizes: ComponentSize[] = []
  const vueSizes: ComponentSize[] = []
  const weappSizes: ComponentSize[] = []
  const htmlSizes: ComponentSize[] = []

  componentNames.forEach((name) => {
    const reactFile = path.join(REACT_UI_DIR, `${name}.tsx`)
    if (fileExists(reactFile)) {
      reactSizes.push({ name, bytes: fileSize(reactFile) })
    }

    const vueFile = resolveVueImpl(name)
    if (vueFile) {
      vueSizes.push({ name, bytes: fileSize(vueFile) })
    }

    const htmlFile = path.join(HTML_UI_DIR, `${name}.html`)
    if (fileExists(htmlFile)) {
      htmlSizes.push({ name, bytes: fileSize(htmlFile) })
    }

    const weappFiles = [
      resolveWeappComponentPath(name, 'wxml'),
      resolveWeappComponentPath(name, 'wxss'),
      resolveWeappComponentPath(name, 'json'),
      resolveWeappComponentPath(name, 'ts') || resolveWeappComponentPath(name, 'js'),
    ].filter(Boolean)
    if (weappFiles.length) {
      const bytes = weappFiles.reduce((sum, filePath) => sum + fileSize(filePath), 0)
      weappSizes.push({ name, bytes })
    }
  })

  return {
    react: reactSizes,
    vue: vueSizes,
    weapp: weappSizes,
    html: htmlSizes,
  }
}

const totalBytes = (items: ComponentSize[]) => items.reduce((sum, item) => sum + item.bytes, 0)

const topComponent = (items: ComponentSize[]) => {
  if (!items.length) return { name: '-', bytes: 0 }
  const sorted = [...items].sort((a, b) => b.bytes - a.bytes)
  return sorted[0]
}

const topComponents = (items: ComponentSize[], count: number) => {
  return [...items].sort((a, b) => b.bytes - a.bytes).slice(0, count)
}

const main = () => {
  const componentNames = parseCoreComponentNames()
  const budgets = loadBudgets()
  const sizes = collectPlatformSizes(componentNames)
  const baseline = loadBaseline()
  const maxTotalGrowth = parseDeltaValue('GOAL_PERF_MAX_TOTAL_GROWTH', 2000)
  const maxComponentGrowth = parseDeltaValue('GOAL_PERF_MAX_COMPONENT_GROWTH', 500)
  const findings: Finding[] = []

  const platforms: Platform[] = ['react', 'vue', 'weapp', 'html']
  platforms.forEach((platform) => {
    const items = sizes[platform]
    const budget = budgets[platform]
    const total = totalBytes(items)
    const maxComp = topComponent(items)

    if (total > budget.totalMaxBytes) {
      findings.push({
        severity: 'major',
        message: `[${platform}] total size budget exceeded: ${total} > ${budget.totalMaxBytes} bytes.`,
      })
    }

    if (maxComp.bytes > budget.perComponentMaxBytes) {
      findings.push({
        severity: 'major',
        message: `[${platform}] per-component size budget exceeded: ${maxComp.name}=${maxComp.bytes} > ${budget.perComponentMaxBytes} bytes.`,
      })
    }

    const baselinePlatform = baseline?.platforms?.[platform]
    if (baselinePlatform) {
      const totalGrowth = total - baselinePlatform.total
      if (totalGrowth > maxTotalGrowth) {
        findings.push({
          severity: 'major',
          message: `[${platform}] total size grew too much: +${totalGrowth}B (baseline=${baselinePlatform.total}B, current=${total}B, maxGrow=${maxTotalGrowth}B).`,
        })
      }

      items.forEach((item) => {
        const previous = baselinePlatform.components[item.name]
        if (typeof previous !== 'number') return
        const growth = item.bytes - previous
        if (growth > maxComponentGrowth) {
          findings.push({
            severity: 'major',
            message: `[${platform}] component grew too much: ${item.name} +${growth}B (baseline=${previous}B, current=${item.bytes}B, maxGrow=${maxComponentGrowth}B).`,
          })
        }
      })
    }
  })

  const severityRank: Record<Severity, number> = {
    critical: 0,
    major: 1,
    minor: 2,
  }
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity])

  const critical = findings.filter((x) => x.severity === 'critical').length
  const major = findings.filter((x) => x.severity === 'major').length
  const minor = findings.filter((x) => x.severity === 'minor').length

  console.log('Timkit Goal Performance Report')
  console.log('==============================')
  console.log(`Core components: ${componentNames.length}`)
  ;(['react', 'vue', 'weapp', 'html'] as Platform[]).forEach((platform) => {
    const items = sizes[platform]
    const total = totalBytes(items)
    const maxComp = topComponent(items)
    const budget = budgets[platform]
    console.log(
      `${platform}: count=${items.length}, total=${total}B (<=${budget.totalMaxBytes}B), max=${maxComp.name}:${maxComp.bytes}B (<=${budget.perComponentMaxBytes}B)`
    )
    const hotspots = topComponents(items, 5)
      .map((item) => `${item.name}:${item.bytes}B`)
      .join(', ')
    console.log(`  hotspots(top5): ${hotspots || '-'}`)
  })
  console.log(`Findings: critical=${critical}, major=${major}, minor=${minor}`)
  console.log('')
  findings.slice(0, 80).forEach((item) => {
    console.log(`[${item.severity.toUpperCase()}] ${item.message}`)
  })

  if (critical > 0 || major > 0) {
    process.exit(1)
  }
}

main()
