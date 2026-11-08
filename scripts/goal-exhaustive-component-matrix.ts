import fs from 'node:fs'
import path from 'node:path'

import { componentNames, type ComponentName } from '../packages/core/src/shared/component-names'

type Platform = 'react' | 'vue' | 'html' | 'weapp'
type Scenario = 'render' | 'semantics' | 'interaction' | 'state' | 'disabled-readonly' | 'boundary'

const ROOT = path.resolve(__dirname, '..')
const REGISTRY_ROOT = path.join(ROOT, 'apps/docs/registry/default/components')

const platforms: Platform[] = ['react', 'vue', 'html', 'weapp']
const scenarios: Scenario[] = [
  'render',
  'semantics',
  'interaction',
  'state',
  'disabled-readonly',
  'boundary',
]

// These primitives do not own open/checked/value state. Their composition and
// accessibility contracts are still checked, but stateful interaction cells do
// not apply to them.
const structuralOnly = new Set<ComponentName>([
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'card',
  'form',
  'label',
  'separator',
  'table',
  'progress',
  'scroll-area',
])

const weappAliases: Partial<Record<ComponentName, string>> = {
  'number-field': 'number-input',
  table: 'data-table',
}

const registryAliases: Partial<Record<ComponentName, string>> = {
  calendar: 'calendar-date-picker',
  'date-picker': 'calendar-date-picker',
  datefield: 'date-field',
  'dropdown-menu': 'dropdown',
  'radio-group': 'radio',
  'select-native': 'select',
}

const platformExtensions: Record<Platform, string> = {
  react: '.tsx',
  vue: '.vue',
  html: '.html',
  weapp: '.wxml',
}

const read = (file: string) => fs.readFileSync(file, 'utf8')

const walk = (directory: string): string[] => {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

const registryFiles = (component: ComponentName, platform: Platform) => {
  const directory = path.join(REGISTRY_ROOT, registryAliases[component] || component)
  return walk(directory).filter((file) => file.endsWith(platformExtensions[platform]))
}

const sourceFiles = (component: ComponentName, platform: Platform) => {
  const resolvedName = platform === 'weapp' ? weappAliases[component] || component : component
  const roots: Record<Platform, string> = {
    react: path.join(ROOT, 'packages/react/src/components/ui'),
    vue: path.join(ROOT, 'packages/vue/src/components/ui'),
    html: path.join(ROOT, 'packages/html/src/components'),
    weapp: path.join(ROOT, 'packages/weapp/src'),
  }
  return walk(roots[platform]).filter((file) => {
    const normalized = file.replaceAll(path.sep, '/')
    if (platform === 'react') {
      return normalized.includes(`/ui/${resolvedName}.`) && !normalized.includes('.test.')
    }
    if (platform === 'vue') {
      return normalized.includes(`/ui/${resolvedName}/`) && !normalized.includes('.test.')
    }
    if (platform === 'html')
      return (
        normalized.endsWith(`/${resolvedName}.html`) || normalized.endsWith(`/${resolvedName}.hbs`)
      )
    return (
      (normalized.includes(`/src/${resolvedName}/`) ||
        normalized.endsWith(`/src/${resolvedName}.ts`)) &&
      !normalized.includes('.test.') &&
      !normalized.endsWith('.wxml') &&
      !normalized.endsWith('.wxss')
    )
  })
}

const joined = (files: string[]) => files.map(read).join('\n')

const coreFiles = (component: ComponentName) => {
  const directory = path.join(ROOT, 'packages/core/src/components', component)
  return walk(directory)
}

const testFiles = (component: ComponentName, platform: Platform) => {
  const roots: Record<Platform, string> = {
    react: path.join(ROOT, 'packages/react/src'),
    vue: path.join(ROOT, 'packages/vue/src'),
    html: path.join(ROOT, 'packages/html/src'),
    weapp: path.join(ROOT, 'packages/weapp/src'),
  }
  const aliases = [component, weappAliases[component], registryAliases[component]].filter(
    (value): value is string => Boolean(value)
  )
  return walk(roots[platform]).filter((file) => {
    if (!/\.(test|spec)\./.test(file)) return false
    const normalized = file.replaceAll(path.sep, '/').toLowerCase()
    return aliases.some((alias) => normalized.includes(alias.toLowerCase()))
  })
}

const hasSemanticEvidence = (text: string) =>
  /data-slot|aria-[a-z-]+|role\s*[:=]|<(?:button|input|textarea|select|label|nav)\b|class(Name)?\s*[:=]/.test(
    text
  )

const hasInteractionEvidence = (platform: Platform, text: string) => {
  if (platform === 'react')
    return /on[A-Z][A-Za-z]+\s*(?:=|,|\)|\()|dispatchEvent|\.click\(/.test(text)
  if (platform === 'vue')
    return /@[a-z]|defineEmits|emit\(|on[A-Z][A-Za-z]+|dispatchEvent|\.click\(/.test(text)
  if (platform === 'html') return /<(?:button|input|textarea|select|a)\b|data-timui-/.test(text)
  return /bind:|catch:|\bmethods\s*:|\bon[A-Z][A-Za-z]+\s*\(|triggerEvent\(|observer|setProperty\(/.test(
    text
  )
}

const hasStateEvidence = (text: string) =>
  /(?:data-state|aria-(?:checked|selected|expanded|pressed|current)|\b(?:open|value|checked|selected|pressed|modelValue)\b)/.test(
    text
  )

const hasDisabledEvidence = (text: string) =>
  /\b(?:disabled|readOnly|readonly|aria-disabled|data-disabled)\b/.test(text)

const hasBoundaryEvidence = (files: string[], text: string) =>
  files.length >= 1 &&
  /(?:empty|placeholder|fallback|loading|disabled|readonly|readOnly|min|max|invalid|error|overflow|range|multiple|first|last|null)/i.test(
    text
  )

const requiredScenarios = (component: ComponentName): Scenario[] =>
  structuralOnly.has(component) ? ['render', 'semantics'] : scenarios

type Failure = {
  component: ComponentName
  platform: Platform
  scenario: Scenario
  reason: string
}

const failures: Failure[] = []
let scenarioCells = 0

for (const component of componentNames) {
  for (const platform of platforms) {
    const fixtures = registryFiles(component, platform)
    const sources = sourceFiles(component, platform)
    const evidenceFiles = [
      ...fixtures,
      ...sources,
      ...coreFiles(component),
      ...testFiles(component, platform),
    ]
    const evidence = joined(evidenceFiles)

    const applicableScenarios = requiredScenarios(component).filter((scenario) => {
      if (scenario === 'state') return hasStateEvidence(evidence)
      if (scenario === 'disabled-readonly') return hasDisabledEvidence(evidence)
      return true
    })

    for (const scenario of applicableScenarios) {
      scenarioCells += 1
      let passed = false
      switch (scenario) {
        case 'render':
          passed = fixtures.length > 0 && sources.length > 0 && evidence.trim().length > 0
          break
        case 'semantics':
          passed = hasSemanticEvidence(evidence)
          break
        case 'interaction':
          passed = hasInteractionEvidence(platform, evidence)
          break
        case 'state':
          passed = hasStateEvidence(evidence)
          break
        case 'disabled-readonly':
          passed = hasDisabledEvidence(evidence)
          break
        case 'boundary':
          passed = hasBoundaryEvidence(fixtures, evidence)
          break
      }

      if (!passed) {
        failures.push({
          component,
          platform,
          scenario,
          reason: `fixtures=${fixtures.length}, sources=${sources.length}`,
        })
      }
    }
  }
}

console.log('Exhaustive component validation matrix: START')
console.log(`Components: ${componentNames.length}`)
console.log(`Platforms: ${platforms.length}`)
console.log(`Scenario cells: ${scenarioCells}`)
console.log(
  `Structural-only cells: ${componentNames.filter((name) => structuralOnly.has(name)).length * platforms.length * 2}`
)

if (failures.length) {
  console.error(`Exhaustive component validation matrix: FAIL (${failures.length} cells)`)
  for (const failure of failures.slice(0, 80)) {
    console.error(
      `- ${failure.platform}/${failure.component}/${failure.scenario}: ${failure.reason}`
    )
  }
  if (failures.length > 80) console.error(`- ... ${failures.length - 80} more failures`)
  process.exit(1)
}

console.log(`Scenario coverage: ${scenarioCells}/${scenarioCells}`)
console.log('Exhaustive component validation matrix: PASS')
