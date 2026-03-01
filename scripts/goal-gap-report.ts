import fs from 'fs'
import path from 'path'

type Severity = 'critical' | 'major' | 'minor'

type Finding = {
  severity: Severity
  message: string
}

const ROOT = path.resolve(__dirname, '..')
const CORE_BASE_PATH = path.join(ROOT, 'packages/core/src/components/base.ts')
const CORE_COMPONENTS_DIR = path.join(ROOT, 'packages/core/src/components')
const REACT_UI_DIR = path.join(ROOT, 'packages/react/src/components/ui')
const VUE_UI_DIR = path.join(ROOT, 'packages/vue/src/components/ui')
const WEAPP_UI_DIR = path.join(ROOT, 'packages/weapp/src')
const HTML_UI_DIR = path.join(ROOT, 'packages/html/src/components')
const REACT_SRC_DIR = path.join(ROOT, 'packages/react/src/components/ui')
const VUE_SRC_DIR = path.join(ROOT, 'packages/vue/src/components')
const WEAPP_SRC_DIR = path.join(ROOT, 'packages/weapp/src')

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

const hasVueImpl = (name: string) => {
  const dirBased = path.join(VUE_UI_DIR, name, `${name}.vue`)
  const flatBased = path.join(VUE_UI_DIR, `${name}.vue`)
  return fileExists(dirBased) || fileExists(flatBased)
}

const hasWeappImpl = (name: string) => {
  const byName = path.join(WEAPP_UI_DIR, name, `${name}.wxml`)
  const byIndex = path.join(WEAPP_UI_DIR, name, 'index.wxml')
  return fileExists(byName) || fileExists(byIndex)
}

const hasHtmlImpl = (name: string) => fileExists(path.join(HTML_UI_DIR, `${name}.html`))

const parseSchemaEnumProps = (schemaText: string) => {
  const results = new Map<string, string[]>()
  const blockRegex =
    /name:\s*'([^']+)'\s*,\s*type:\s*'enum'[\s\S]*?values:\s*\[([^\]]*)\]/g
  let match: RegExpExecArray | null = blockRegex.exec(schemaText)
  while (match) {
    const propName = match[1]
    const valuesRaw = match[2]
    const values = (valuesRaw.match(/'([^']+)'/g) || []).map((x) => x.slice(1, -1))
    results.set(propName, values)
    match = blockRegex.exec(schemaText)
  }
  return results
}

const parseVariantUnionsInProps = (propsText: string, componentName: string) => {
  const results = new Map<string, string[]>()
  const title = componentName
    .split('-')
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join('')
  const unionRegex = new RegExp(
    `export\\s+type\\s+${title}([A-Z][A-Za-z0-9]*)\\s*=\\s*([\\s\\S]*?)(?:\\n\\n|\\nexport\\s+type)`,
    'g'
  )
  let match: RegExpExecArray | null = unionRegex.exec(propsText)
  while (match) {
    const propTypeName = match[1]
    const body = match[2]
    const values = (body.match(/'([^']+)'/g) || []).map((x) => x.slice(1, -1))
    if (values.length) {
      const propName = propTypeName.charAt(0).toLowerCase() + propTypeName.slice(1)
      results.set(propName, values)
    }
    match = unionRegex.exec(propsText)
  }
  return results
}

const parseOptionalFlagsInProps = (propsText: string) => {
  const flags = new Map<string, boolean>()
  const objectTypeMatch = propsText.match(/export\s+type\s+\w+Props\s*=\s*{([\s\S]*?)}/)
  if (!objectTypeMatch) return flags
  const body = objectTypeMatch[1]
  const propRegex = /^\s*([a-zA-Z0-9_-]+)(\?)?\s*:/gm
  let propMatch: RegExpExecArray | null = propRegex.exec(body)
  while (propMatch) {
    flags.set(propMatch[1], Boolean(propMatch[2]))
    propMatch = propRegex.exec(body)
  }
  return flags
}

const parseCvaVariantOptions = (variantsText: string) => {
  const result = new Map<string, string[]>()
  const variantsMatch = variantsText.match(/variants:\s*{([\s\S]*?)},\s*defaultVariants:/)
  if (!variantsMatch) return result
  const body = variantsMatch[1]
  const propBlockRegex = /([a-zA-Z0-9_-]+)\s*:\s*{([\s\S]*?)}/g
  let blockMatch: RegExpExecArray | null = propBlockRegex.exec(body)
  while (blockMatch) {
    const propName = blockMatch[1]
    const optionsBody = blockMatch[2]
    const optionRegex = /^\s*([a-zA-Z0-9_-]+)\s*:/gm
    const options: string[] = []
    let optionMatch: RegExpExecArray | null = optionRegex.exec(optionsBody)
    while (optionMatch) {
      options.push(optionMatch[1])
      optionMatch = optionRegex.exec(optionsBody)
    }
    if (options.length) result.set(propName, options)
    blockMatch = propBlockRegex.exec(body)
  }
  return result
}

const compareSet = (a: string[], b: string[]) => {
  const left = [...a].sort().join(',')
  const right = [...b].sort().join(',')
  return left === right
}

const getFile = (filePath: string) => (fileExists(filePath) ? fs.readFileSync(filePath, 'utf-8') : '')

const analyzeContractDrift = (name: string): Finding[] => {
  const findings: Finding[] = []
  const schemaPath = path.join(CORE_COMPONENTS_DIR, name, 'schema.ts')
  const propsPath = path.join(CORE_COMPONENTS_DIR, name, 'props.ts')
  const variantsPath = path.join(CORE_COMPONENTS_DIR, name, 'variants.ts')
  if (!fileExists(schemaPath) || !fileExists(propsPath)) return findings

  const schemaText = getFile(schemaPath)
  const propsText = getFile(propsPath)
  const variantsText = getFile(variantsPath)

  const schemaEnums = parseSchemaEnumProps(schemaText)
  const unionEnums = parseVariantUnionsInProps(propsText, name)
  const cvaEnums = parseCvaVariantOptions(variantsText)
  const propsOptional = parseOptionalFlagsInProps(propsText)

  schemaEnums.forEach((schemaValues, propName) => {
    const unionValues = unionEnums.get(propName)
    if (unionValues && !compareSet(schemaValues, unionValues)) {
      findings.push({
        severity: 'critical',
        message: `[${name}] schema enum "${propName}" does not match props union. schema=[${schemaValues.join(
          ', '
        )}] props=[${unionValues.join(', ')}]`,
      })
    }

    const cvaValues = cvaEnums.get(propName)
    if (cvaValues && !compareSet(schemaValues, cvaValues)) {
      findings.push({
        severity: 'major',
        message: `[${name}] schema enum "${propName}" does not match variants options. schema=[${schemaValues.join(
          ', '
        )}] variants=[${cvaValues.join(', ')}]`,
      })
    }
  })

  const requiredRegex = /name:\s*'([^']+)'\s*,[\s\S]*?required:\s*true/g
  let requiredMatch: RegExpExecArray | null = requiredRegex.exec(schemaText)
  while (requiredMatch) {
    const propName = requiredMatch[1]
    if (propsOptional.get(propName) === true) {
      findings.push({
        severity: 'major',
        message: `[${name}] schema marks "${propName}" as required but props type marks it optional.`,
      })
    }
    requiredMatch = requiredRegex.exec(schemaText)
  }

  return findings
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
  const findings: Finding[] = []

  let fullCoverage = 0
  componentNames.forEach((name) => {
    const react = hasReactImpl(name)
    const vue = hasVueImpl(name)
    const weapp = hasWeappImpl(name)
    const html = hasHtmlImpl(name)
    const covered = [react, vue, weapp, html].filter(Boolean).length

    if (covered === 4) {
      fullCoverage += 1
    } else {
      findings.push({
        severity: covered >= 2 ? 'major' : 'critical',
        message: `[${name}] framework coverage is incomplete (react=${react}, vue=${vue}, weapp=${weapp}, html=${html}).`,
      })
    }

    findings.push(...analyzeContractDrift(name))
  })

  const reactFiles = walkFiles(REACT_SRC_DIR, (file) => /\.(tsx|ts|jsx|js)$/.test(file))
  const vueFiles = walkFiles(VUE_SRC_DIR, (file) => /\.(vue|ts)$/.test(file))
  const weappFiles = walkFiles(WEAPP_SRC_DIR, (file) => /\.(ts|js)$/.test(file))
  const implementationFiles = [...reactFiles, ...vueFiles, ...weappFiles]
  const anyCount = countTextMatches(implementationFiles, /\bany\b/g)
  const todoCount = countTextMatches(implementationFiles, /\b(TODO|FIXME)\b/g)

  if (anyCount > 0) {
    findings.push({
      severity: 'major',
      message: `Found ${anyCount} usage(s) of "object" in framework implementations.`,
    })
  }
  if (todoCount > 0) {
    findings.push({
      severity: 'minor',
      message: `Found ${todoCount} TODO/FIXME marker(s) in framework implementations.`,
    })
  }

  const reactCode = fs.readFileSync(path.join(ROOT, 'packages/react/src/components/ui/select.tsx'), 'utf-8')
  if (reactCode.includes('For this specific task')) {
    findings.push({
      severity: 'major',
      message:
        '[select/react] implementation contains temporary migration comments, indicating behavior is not fully stabilized.',
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

  console.log('Timkit Goal Gap Report')
  console.log('======================')
  console.log(`Core components: ${componentNames.length}`)
  console.log(`Full 4-platform coverage: ${fullCoverage}/${componentNames.length}`)
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
