import fs from 'fs'
import path from 'path'

import type { ApiTableRow } from '../apps/docs/lib/component-api'
import { buildComponentApiModel } from '../apps/docs/lib/component-api'
import * as registryModule from '../packages/core/src/shared/registry.ts'

type Finding = {
  component: string
  level: 'critical' | 'major' | 'minor'
  message: string
}

const ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(ROOT, 'apps/docs/data/registry-all.json')
const ucsRegistry =
  ((registryModule as { ucsRegistry?: Record<string, object> }).ucsRegistry ||
    (
      registryModule as {
        default?: { ucsRegistry?: Record<string, object> }
        'module.exports'?: { ucsRegistry?: Record<string, object> }
      }
    ).default?.ucsRegistry ||
    (
      registryModule as {
        default?: { ucsRegistry?: Record<string, object> }
        'module.exports'?: { ucsRegistry?: Record<string, object> }
      }
    )['module.exports']?.ucsRegistry ||
    {}) as Record<string, object>

type RegistryItem = {
  name: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: Array<{ path: string; content?: string; target?: string }>
}

const readRegistryMap = (): Map<string, RegistryItem> => {
  if (!fs.existsSync(DATA_FILE)) return new Map()
  const payload = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as {
    items?: RegistryItem[]
  }
  const map = new Map<string, RegistryItem>()
  ;(payload.items || []).forEach((item) => map.set(item.name, item))
  return map
}

const hasEmptyDescription = (rows: ApiTableRow[]): boolean =>
  rows.some((row) => !row.description || row.description.trim() === '' || row.description === '-')

const checkComponent = (name: string, registryItem?: RegistryItem): Finding[] => {
  const api = buildComponentApiModel(name, [], registryItem as never)
  const findings: Finding[] = []

  if (!api.schema) {
    findings.push({
      component: name,
      level: 'critical',
      message: 'Missing UCS schema entry.',
    })
    return findings
  }

  if (!api.configs.length) {
    findings.push({
      component: name,
      level: 'critical',
      message: 'Missing configuration API section.',
    })
  }

  if (hasEmptyDescription(api.configs)) {
    findings.push({
      component: name,
      level: 'major',
      message: 'Configuration rows contain missing descriptions.',
    })
  }

  if (!api.props.length) {
    findings.push({
      component: name,
      level: 'major',
      message: 'No props API found (schema + inferred contracts).',
    })
  } else if (hasEmptyDescription(api.props)) {
    findings.push({
      component: name,
      level: 'major',
      message: 'Props API contains missing descriptions.',
    })
  }

  if (hasEmptyDescription(api.events)) {
    findings.push({
      component: name,
      level: 'major',
      message: 'Events API contains missing descriptions.',
    })
  }

  if (!api.parts.length) {
    findings.push({
      component: name,
      level: 'major',
      message: 'Missing parts API.',
    })
  } else if (hasEmptyDescription(api.parts)) {
    findings.push({
      component: name,
      level: 'minor',
      message: 'Parts API contains missing descriptions.',
    })
  }

  if (hasEmptyDescription(api.slots)) {
    findings.push({
      component: name,
      level: 'minor',
      message: 'Slots API contains missing descriptions.',
    })
  }

  return findings
}

const registryMap = readRegistryMap()
const components = Object.keys(ucsRegistry)
const findings = components.flatMap((name) => checkComponent(name, registryMap.get(name)))

const count = {
  critical: findings.filter((f) => f.level === 'critical').length,
  major: findings.filter((f) => f.level === 'major').length,
  minor: findings.filter((f) => f.level === 'minor').length,
}

console.log('Timkit API Quality Report')
console.log('=========================')
console.log(`Components: ${components.length}`)
console.log(`Findings: critical=${count.critical}, major=${count.major}, minor=${count.minor}`)

if (findings.length) {
  findings.slice(0, 120).forEach((f) => {
    console.log(`- [${f.level}] ${f.component}: ${f.message}`)
  })
}

if (count.critical > 0 || count.major > 0) {
  process.exit(1)
}

console.log('✅ API documentation quality gate passed.')
