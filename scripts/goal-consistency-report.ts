import fs from 'fs'
import path from 'path'

type Severity = 'critical' | 'major' | 'minor'

type Finding = {
  severity: Severity
  message: string
}

type RegistryFile = {
  path: string
  content?: string
  target?: string
}

type RegistryItem = {
  name: string
  type: string
  files?: RegistryFile[]
}

const ROOT = path.resolve(__dirname, '..')
const CORE_BASE_PATH = path.join(ROOT, 'packages/core/src/components/base.ts')
const CORE_COMPONENTS_DIR = path.join(ROOT, 'packages/core/src/components')
const REACT_UI_DIR = path.join(ROOT, 'packages/react/src/components/ui')
const VUE_UI_DIR = path.join(ROOT, 'packages/vue/src/components/ui')
const WEAPP_UI_DIR = path.join(ROOT, 'packages/weapp/src')
const HTML_UI_DIR = path.join(ROOT, 'packages/html/src/components')
const REGISTRY_ALL_FILE = path.join(ROOT, 'apps/docs/data/registry-all.json')
const PLACEHOLDER_REGEX = /placeholder\s+for/i

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

const hasReactImpl = (name: string) => fileExists(path.join(REACT_UI_DIR, `${name}.tsx`))

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

const hasHtmlImpl = (name: string) => fileExists(path.join(HTML_UI_DIR, `${name}.html`))

const hasCoreContractFiles = (name: string) => {
  const schemaPath = path.join(CORE_COMPONENTS_DIR, name, 'schema.ts')
  const propsPath = path.join(CORE_COMPONENTS_DIR, name, 'props.ts')
  const variantsPath = path.join(CORE_COMPONENTS_DIR, name, 'variants.ts')
  return {
    schema: fileExists(schemaPath),
    props: fileExists(propsPath),
    variants: fileExists(variantsPath),
  }
}

const loadRegistryItems = (): RegistryItem[] => {
  if (!fileExists(REGISTRY_ALL_FILE)) return []
  const payload = JSON.parse(fs.readFileSync(REGISTRY_ALL_FILE, 'utf-8')) as {
    items?: RegistryItem[]
  }
  return payload.items || []
}

const detectFrameworkFromPath = (filePath: string): 'react' | 'vue' | 'weapp' | 'html' | 'other' => {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.tsx' || ext === '.jsx') return 'react'
  if (ext === '.vue') return 'vue'
  if (ext === '.wxml' || ext === '.wxss' || ext === '.js' || ext === '.ts' || ext === '.json') return 'weapp'
  if (ext === '.html' || ext === '.htm') return 'html'
  return 'other'
}

const summarizeRegistryFrameworks = (item: RegistryItem | undefined) => {
  const frameworks = new Set<string>()
  const placeholderFrameworks = new Set<string>()
  const files = item?.files || []

  files.forEach((file) => {
    const fw = detectFrameworkFromPath(file.path || '')
    if (fw === 'other') return
    if (file.content && PLACEHOLDER_REGEX.test(file.content)) {
      placeholderFrameworks.add(fw)
      return
    }
    frameworks.add(fw)
  })

  return {
    frameworks,
    placeholderFrameworks,
  }
}

const walkFiles = (dir: string, shouldUse: (file: string) => boolean): string[] => {
  const files: string[] = []
  if (!fs.existsSync(dir)) return files

  const walk = (target: string) => {
    const entries = fs.readdirSync(target, { withFileTypes: true })
    entries.forEach((entry) => {
      const full = path.join(target, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        return
      }
      if (shouldUse(full)) files.push(full)
    })
  }

  walk(dir)
  return files
}

const countTextMatches = (files: string[], pattern: RegExp): number => {
  let count = 0
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    const matches = content.match(pattern)
    if (matches) count += matches.length
  })
  return count
}

const main = () => {
  const componentNames = parseCoreComponentNames()
  const registryItems = loadRegistryItems()
  const registryMap = new Map<string, RegistryItem>()
  registryItems.forEach((item) => registryMap.set(item.name, item))

  const findings: Finding[] = []
  let fullConsistency = 0

  componentNames.forEach((name) => {
    const contract = hasCoreContractFiles(name)
    const react = hasReactImpl(name)
    const vue = Boolean(resolveVueImpl(name))
    const weappWxml = Boolean(resolveWeappComponentPath(name, 'wxml'))
    const weappLogic = Boolean(resolveWeappComponentPath(name, 'ts') || resolveWeappComponentPath(name, 'js'))
    const weappJsonPath = resolveWeappComponentPath(name, 'json')
    const weappJson = Boolean(weappJsonPath)
    const weappWxss = Boolean(resolveWeappComponentPath(name, 'wxss'))
    const html = hasHtmlImpl(name)

    if (!contract.schema || !contract.props || !contract.variants) {
      findings.push({
        severity: 'major',
        message: `[${name}] core contract file missing (schema=${contract.schema}, props=${contract.props}, variants=${contract.variants}).`,
      })
    }

    if (!react || !vue || !weappWxml || !weappLogic || !weappJson || !html) {
      findings.push({
        severity: 'critical',
        message: `[${name}] implementation contract is incomplete (react=${react}, vue=${vue}, weapp.wxml=${weappWxml}, weapp.logic=${weappLogic}, weapp.json=${weappJson}, html=${html}).`,
      })
    }

    if (!weappWxss) {
      findings.push({
        severity: 'minor',
        message: `[${name}] weapp stylesheet missing (.wxss).`,
      })
    }

    if (weappJsonPath) {
      try {
        const payload = JSON.parse(fs.readFileSync(weappJsonPath, 'utf-8')) as {
          component?: boolean
        }
        if (payload.component !== true) {
          findings.push({
            severity: 'major',
            message: `[${name}] weapp json does not set "component: true".`,
          })
        }
      } catch (error) {
        findings.push({
          severity: 'major',
          message: `[${name}] weapp json parse failed: ${String(error)}.`,
        })
      }
    }

    const registryItem = registryMap.get(name)
    if (registryItem) {
      const summary = summarizeRegistryFrameworks(registryItem)
      if (summary.placeholderFrameworks.size > 0) {
        findings.push({
          severity: 'major',
          message: `[${name}] registry-all still contains placeholder files in: ${Array.from(summary.placeholderFrameworks).join(', ')}.`,
        })
      }
    }

    if (
      contract.schema &&
      contract.props &&
      contract.variants &&
      react &&
      vue &&
      weappWxml &&
      weappLogic &&
      weappJson &&
      html
    ) {
      fullConsistency += 1
    }
  })

  const reactFiles = walkFiles(REACT_UI_DIR, (file) => /\.(tsx|ts|jsx|js)$/.test(file))
  const vueFiles = walkFiles(path.join(ROOT, 'packages/vue/src/components/ui'), (file) => /\.(vue|ts)$/.test(file))
  const weappFiles = walkFiles(WEAPP_UI_DIR, (file) => /\.(ts|js|wxml|wxss)$/.test(file))
  const htmlFiles = walkFiles(HTML_UI_DIR, (file) => /\.(html|htm)$/.test(file))
  const implementationFiles = [...reactFiles, ...vueFiles, ...weappFiles, ...htmlFiles]
  const unknownCastCount = countTextMatches(implementationFiles, /\bas\s+object\s+as\b/g)

  if (unknownCastCount > 0) {
    findings.push({
      severity: 'minor',
      message: `Found ${unknownCastCount} usage(s) of "as object as" in multi-platform implementations.`,
    })
  }

  const severityRank: Record<Severity, number> = {
    critical: 0,
    major: 1,
    minor: 2,
  }
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity])

  const critical = findings.filter((x) => x.severity === 'critical').length
  const major = findings.filter((x) => x.severity === 'major').length
  const minor = findings.filter((x) => x.severity === 'minor').length

  console.log('Timkit Goal Consistency Report')
  console.log('=============================')
  console.log(`Core components: ${componentNames.length}`)
  console.log(`Core consistency pass: ${fullConsistency}/${componentNames.length}`)
  console.log(`Findings: critical=${critical}, major=${major}, minor=${minor}`)
  console.log('')
  findings.slice(0, 120).forEach((item) => {
    console.log(`[${item.severity.toUpperCase()}] ${item.message}`)
  })

  if (critical > 0 || major > 0) {
    process.exit(1)
  }
}

main()
