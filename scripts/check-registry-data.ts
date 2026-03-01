import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

import { registryPayloadSchema, type RegistryItem } from '../packages/core/src/shared/schema'
import { sha256OfString } from '../packages/cli/src/lib/checksum'

const ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(ROOT, 'apps/docs/data/registry-all.json')
const DATA_DIR = path.join(ROOT, 'apps/docs/data/registry')
const INDEX_FILE = path.join(ROOT, 'apps/docs/data/registry-index.json')
const ALIASES_FILE = path.join(ROOT, 'apps/docs/data/registry-aliases.json')
const MAX_AGE_DAYS = 3
const STRICT = process.env.STRICT_REGISTRY !== '0'

export const FRAMEWORK_EXTENSIONS: Record<string, string[]> = {
  react: ['.tsx', '.jsx'],
  vue: ['.vue'],
  html: ['.html', '.htm'],
  weapp: ['.wxml', '.wxss', '.js', '.ts', '.json'],
}

// “国际前沿”基线：核心控件必须具备全端实现，防止单端领先、多端缺失
export const CORE_MULTI_FRAMEWORKS: Record<string, Array<keyof typeof FRAMEWORK_EXTENSIONS>> = {
  button: ['react', 'vue', 'html', 'weapp'],
  input: ['react', 'vue', 'html', 'weapp'],
  select: ['react', 'vue', 'html', 'weapp'],
  switch: ['react', 'vue', 'html', 'weapp'],
  slider: ['react', 'vue', 'html', 'weapp'],
  tabs: ['react', 'vue', 'html', 'weapp'],
  textarea: ['react', 'vue', 'html', 'weapp'],
  table: ['react', 'vue', 'html', 'weapp'],
  tree: ['react', 'vue', 'html', 'weapp'],
}

type ValidationResult = {
  errors: string[]
  warnings: string[]
}

const readJson = <T>(file: string): T | undefined => {
  if (!fs.existsSync(file)) return undefined
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch (e) {
    console.error(`❌ Failed to parse ${path.relative(ROOT, file)}`, e)
    return undefined
  }
}

const hydrateFiles = (files: RegistryItem['files'] = []): RegistryItem['files'] => {
  return files.map((f) => {
    if (f.content && f.content.trim()) return f
    const candidates = [
      path.join(ROOT, 'apps/docs', f.path),
      path.join(ROOT, f.path),
      path.join(ROOT, 'packages', f.path.replace(/^registry\/default\//, '')),
    ]
    const found = candidates.find((candidate) => fs.existsSync(candidate))
    return found ? { ...f, content: fs.readFileSync(found, 'utf-8') } : f
  })
}

const readRegistryFiles = (): RegistryItem[] => {
  if (!fs.existsSync(DATA_DIR)) return []
  const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith('.json'))
  return files
    .map((file) => {
      const item = readJson<RegistryItem>(path.join(DATA_DIR, file))
      if (!item) return undefined

      return { ...item, files: hydrateFiles(item.files) }
    })
    .filter((item): item is RegistryItem => Boolean(item?.name))
}

export const computeFrameworksFromFiles = (files: RegistryItem['files'] = []): Set<string> => {
  const frameworks = new Set<string>()
  files.forEach((file) => {
    const ext = path.extname(file.path || '').toLowerCase()
    Object.entries(FRAMEWORK_EXTENSIONS).forEach(([framework, exts]) => {
      if (exts.includes(ext)) frameworks.add(framework)
    })
  })
  return frameworks
}

export const PLACEHOLDER_REGEX = /placeholder\s+for/i
const containsPlaceholder = (content: string) => PLACEHOLDER_REGEX.test(content)

const checkChecksum = (payload: object) => {
  if (!payload?.checksum) {
    return { warnings: ['registry-all.json missing checksum field.'], errors: [] }
  }
  const { checksum, ...rest } = payload
  const recomputed = sha256OfString(JSON.stringify(rest, null, 2))
  if (recomputed !== checksum) {
    return {
      warnings: [],
      errors: [
        'registry-all.json checksum mismatch. Please rebuild registry.',
        `stored:   ${checksum}`,
        `computed: ${recomputed}`,
      ],
    }
  }
  return { warnings: [], errors: [] }
}

const validateSingleSource = (
  registryAllItems: RegistryItem[],
  registryFileItems: RegistryItem[],
  registryIndexItems: RegistryItem[]
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!registryFileItems.length) {
    warnings.push('registry/ directory is empty; falling back to registry-all.json only.')
  }

  const allNames = new Set(registryAllItems.map((item) => item.name))
  const fileNames = new Set(registryFileItems.map((item) => item.name))
  const indexNames = new Set(registryIndexItems.map((item) => item.name))

  const missingInFiles = Array.from(allNames).filter((name) => !fileNames.has(name))
  if (missingInFiles.length) {
    const msg = `registry-all.json contains ${missingInFiles.length} items missing from data/registry: ${missingInFiles
      .slice(0, 8)
      .join(', ')}${missingInFiles.length > 8 ? '…' : ''}`
    if (STRICT) errors.push(msg)
    else warnings.push(msg)
  }

  const missingInAll = Array.from(fileNames).filter((name) => !allNames.has(name))
  if (missingInAll.length) {
    warnings.push(
      `data/registry has ${missingInAll.length} items not present in registry-all.json (stale build?): ${missingInAll
        .slice(0, 8)
        .join(', ')}${missingInAll.length > 8 ? '…' : ''}`
    )
  }

  const missingInIndex = Array.from(allNames).filter((name) => !indexNames.has(name))
  if (missingInIndex.length) {
    warnings.push(
      `registry-index.json is missing ${missingInIndex.length} items present in registry-all.json.`
    )
  }

  return { errors, warnings }
}

type ValidationMessage = {
  text: string
  severity: 'error' | 'warning'
}

const combine = (messages: ValidationMessage[]): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  messages.forEach((message) => {
    if (message.severity === 'error') errors.push(message.text)
    else warnings.push(message.text)
  })
  return { errors, warnings }
}

const validateEmptyFiles = (item: RegistryItem): ValidationMessage[] => {
  const files = item.files || []
  if (!files.length) {
    return [{ severity: 'error', text: `[${item.name}] has no files array.` }]
  }

  const emptyFiles = files.filter((file) => {
    if (file.content && file.content.trim()) return false
    const filePath = file.path || ''
    if (filePath.includes('/weapp/') && filePath.endsWith('.wxss')) return false
    return true
  })
  if (emptyFiles.length) {
    return [
      {
        severity: 'error',
        text: `[${item.name}] ${emptyFiles.length} file(s) without content: ${emptyFiles
          .map((f) => f.path || f.target || 'object')
          .join(', ')}`,
      },
    ]
  }
  return []
}

const validateFrameworkCoverage = (item: RegistryItem): ValidationMessage[] => {
  const files = item.files || []
  const actualFrameworks = computeFrameworksFromFiles(files)
  const requiredFrameworks = CORE_MULTI_FRAMEWORKS[item.name] || []

  return requiredFrameworks.flatMap((fw) => {
    if (!actualFrameworks.has(fw)) {
      return [
        {
          severity: 'error' as const,
          text: `[${item.name}] 缺少核心端实现：${fw}（需要 ${FRAMEWORK_EXTENSIONS[fw].join(', ')} 之一）`,
        },
      ]
    }
    return []
  })
}

const validateDeclaredFrameworks = (item: RegistryItem): ValidationMessage[] => {
  const files = item.files || []
  const actualFrameworks = computeFrameworksFromFiles(files)
  const declaredFrameworks = new Set<string>(item.meta?.frameworks || [])
  const severity: 'error' | 'warning' = STRICT ? 'error' : 'warning'

  return Array.from(declaredFrameworks)
    .filter((fw) => !actualFrameworks.has(fw))
    .map((fw) => ({
      severity,
      text: `[${item.name}] declares framework "${fw}" but no file found with expected extensions (${FRAMEWORK_EXTENSIONS[
        fw
      ]?.join(', ') || 'n/a'}).`,
    }))
}

const validateReactPresence = (item: RegistryItem): ValidationMessage[] => {
  const files = item.files || []
  const actualFrameworks = computeFrameworksFromFiles(files)
  if (!actualFrameworks.has('react')) {
    return [{ severity: 'error', text: `[${item.name}] is missing React implementation (.tsx/.jsx).` }]
  }
  return []
}

const validatePlaceholders = (item: RegistryItem): ValidationMessage[] => {
  const files = item.files || []
  const placeholderFiles = files.filter((file) => file.content && containsPlaceholder(file.content))
  if (placeholderFiles.length) {
    return [
      {
        severity: 'error',
        text: `[${item.name}] contains placeholder content in: ${placeholderFiles
          .map((f) => f.path)
          .join(', ')}`,
      },
    ]
  }
  return []
}

const collectItemMessages = (item: RegistryItem): ValidationMessage[] => {
  if (item.type !== 'registry:ui' && item.type !== 'registry:component') return []
  return [
    ...validateEmptyFiles(item),
    ...validateFrameworkCoverage(item),
    ...validateDeclaredFrameworks(item),
    ...validateReactPresence(item),
    ...validatePlaceholders(item),
  ]
}

const validateItems = (items: RegistryItem[]): ValidationResult => {
  const messages: ValidationMessage[] = []
  items.forEach((item) => {
    messages.push(...collectItemMessages(item))
  })
  return combine(messages)
}

const validateAliases = (items: RegistryItem[]): ValidationResult => {
  const aliases = readJson<Record<string, object>>(ALIASES_FILE) || {}
  const existing = new Set(items.map((item) => item.name))
  const messages: ValidationMessage[] = []

  Object.entries(aliases).forEach(([alias, target]) => {
    if (typeof target !== 'string') {
      messages.push({
        level: 'error',
        message: `Alias "${alias}" must map to a string target.`,
      })
      return
    }

    if (!existing.has(target)) {
      messages.push({
        level: 'error',
        message: `Alias "${alias}" points to missing component "${target}".`,
      })
    }
  })

  return combine(messages)
}

function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ registry-all.json is missing. Run pnpm --filter @timui/docs registry:build:all')
    process.exit(1)
  }
  const stat = fs.statSync(DATA_FILE)
  const ageDays = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24)
  if (ageDays > MAX_AGE_DAYS) {
    console.warn(
      `⚠️  registry-all.json is ${ageDays.toFixed(
        1
      )} days old. Consider re-running pnpm --filter @timui/docs registry:build:all.`
    )
  }

  const registryAllPayload = readJson<object>(DATA_FILE)
  const indexPayload = readJson<object>(INDEX_FILE) || { items: [] }
  const registryFileItems = readRegistryFiles()

  const parsed = registryPayloadSchema.safeParse(registryAllPayload)
  if (!parsed.success) {
    console.error('❌ registry-all.json schema invalid:', parsed.error?.message)
    process.exit(1)
  }

  const checksumResult = checkChecksum(registryAllPayload)
  checksumResult.warnings.forEach((w) => console.warn(`⚠️  ${w}`))
  checksumResult.errors.forEach((e) => console.error(`❌ ${e}`))
  if (checksumResult.errors.length) process.exit(1)

  const registryAllItems = parsed.data.items || []
  const sourceItems = registryFileItems.length ? registryFileItems : registryAllItems

  const singleSourceResult = validateSingleSource(
    registryAllItems,
    registryFileItems,
    indexPayload.items || []
  )
  const qualityResult = validateItems(sourceItems)
  const aliasResult = validateAliases(sourceItems)

  const errors = [...singleSourceResult.errors, ...qualityResult.errors, ...aliasResult.errors]
  const warnings = [
    ...singleSourceResult.warnings,
    ...qualityResult.warnings,
    ...aliasResult.warnings,
  ]

  warnings.forEach((w) => console.warn(`⚠️  ${w}`))
  errors.forEach((e) => console.error(`❌ ${e}`))

  if (errors.length) {
    console.error(
      `\nRegistry data check failed with ${errors.length} error(s).` +
        (STRICT ? ' STRICT_REGISTRY is enabled.' : '')
    )
    process.exit(1)
  }

  console.log(
    `✅ registry data check passed using ${sourceItems.length} items ` +
      (warnings.length ? `(with ${warnings.length} warning(s))` : '')
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
