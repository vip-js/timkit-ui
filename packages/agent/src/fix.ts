import type { ComponentProp, UCS } from '@timui/core'

import type { FrameworkId } from './intent'
import { schemaForSymbol, toSymbol } from './usage'

const packageByFramework: Record<FrameworkId, string> = {
  react: '@timui/react',
  vue: '@timui/vue',
  html: '@timui/html',
  weapp: '@timui/weapp',
}

const defaultEnumValue = (prop: ComponentProp) => {
  if (typeof prop.defaultValue === 'string') return prop.defaultValue
  return prop.values?.[0]
}

export const fixUsage = (
  code: string,
  options: {
    framework: FrameworkId
    names: string[]
    schemaFor: (name: string) => UCS | undefined
  }
): { code: string; changes: string[] } => {
  let next = code
  const changes: string[] = []
  const apply = (label: string, updated: string) => {
    if (updated === next) return
    changes.push(label)
    next = updated
  }

  apply('Restore real quotes', next.replaceAll('&quot;', '"'))
  apply(
    'Use the import for the selected framework',
    rewriteFrameworkImport(next, options.framework)
  )
  apply('Replace undocumented enum values with schema defaults', rewriteEnums(next, options))
  apply('Name buttons that have no visible text', rewriteButtons(next))
  apply('Export a React component', ensureReactExport(next, options.framework))

  return { code: next, changes }
}

const rewriteFrameworkImport = (code: string, framework: FrameworkId) => {
  let next = code
  const target = packageByFramework[framework]
  ;(Object.keys(packageByFramework) as FrameworkId[]).forEach((candidate) => {
    if (candidate === framework) return
    const source = packageByFramework[candidate]
    next = next.replaceAll(`from '${source}'`, `from '${target}'`)
    next = next.replaceAll(`from "${source}"`, `from "${target}"`)
  })
  return next
}

const rewriteEnums = (
  code: string,
  options: {
    names: string[]
    schemaFor: (name: string) => UCS | undefined
  }
) =>
  code.replace(
    /<([A-Z][A-Za-z0-9]*)\b([^>]*?)(\/?>)/g,
    (full, symbol: string, attrs: string, end: string) => {
      const schema = schemaForSymbol(symbol, options.names, options.schemaFor)
      if (!schema?.props) return full
      let nextAttrs = attrs
      schema.props.forEach((prop) => {
        if (prop.type !== 'enum' || !prop.values?.length) return
        const fallback = defaultEnumValue(prop)
        if (!fallback) return
        nextAttrs = nextAttrs.replace(
          new RegExp(`\\b${prop.name}="([^"]+)"`, 'g'),
          (attr, value: string) =>
            prop.values?.includes(value) ? attr : `${prop.name}="${fallback}"`
        )
      })
      return `<${symbol}${nextAttrs}${end}`
    }
  )

const rewriteButtons = (code: string) => {
  let next = code.replace(/<Button\b([^>]*?)(\/?)>/g, (full, attrs: string, selfClose: string) => {
    if (/aria-label=/.test(attrs) || /\blabel=/.test(attrs)) return full
    if (!/size="icon"/.test(attrs) && !selfClose) return full
    return `<Button${attrs} aria-label="Continue"${selfClose}>`
  })
  next = next.replace(/<Button\b([^>]*?)>\s*<\/Button>/g, (full, attrs: string) => {
    if (/aria-label=/.test(attrs) || /\blabel=/.test(attrs) || /size="icon"/.test(attrs))
      return full
    return `<Button${attrs}>Continue</Button>`
  })
  return next
}

const ensureReactExport = (code: string, framework: FrameworkId) => {
  if (framework !== 'react' || code.includes('export') || !code.trim()) return code
  return `export function Example() {\n  return (\n    ${code.trim()}\n  )\n}\n`
}

export const componentSymbol = toSymbol
