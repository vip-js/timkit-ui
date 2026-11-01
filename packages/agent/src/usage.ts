import type { ComponentProp, UCS } from '@timui/core'

import type { FrameworkId } from './intent'

export interface SnippetFile {
  path: string
  content: string
}

export interface Snippet {
  files: SnippetFile[]
  notes: string[]
  symbol: string
  importSource: string
  sourceKind: 'package' | 'registry-file'
}

export interface UsageExample {
  id: 'basic' | 'variants'
  framework: FrameworkId
  description: string
  code: string
}

export interface UsageIssue {
  type: 'syntax' | 'accessibility' | 'dependency' | 'registry' | 'prop'
  message: string
  line?: number
  fix?: string
}

const packageByFramework: Record<FrameworkId, string> = {
  react: '@timui/react',
  vue: '@timui/vue',
  html: '@timui/html',
  weapp: '@timui/weapp',
}

const pitfallsByName: Record<string, string[]> = {
  button: [
    'size="icon" has no visible text, so aria-label is required.',
    'Use onPress for the TimEvent protocol. React also accepts onClick for DOM compatibility.',
  ],
  dialog: [
    'Include a title. A dialog without an accessible name fails review.',
    'Control visibility with open and onOpenChange. Do not hide the dialog with CSS.',
  ],
  input: ['Pair the field with a label, or set aria-label when the label is visual-only.'],
  select: ['Do not invent option values. Bind options from product data after install.'],
}

export const toSymbol = (name: string) =>
  name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

export const packageName = (framework: FrameworkId) => packageByFramework[framework]

const escapeText = (value: string) => value.replace(/[<>{}]/g, '').trim()

const enumProp = (props: ComponentProp[] | undefined, name: string) =>
  props?.find((prop) => prop.name === name && prop.type === 'enum')

const defaultEnum = (prop: ComponentProp | undefined) => {
  if (!prop) return undefined
  if (typeof prop.defaultValue === 'string') return prop.defaultValue
  return prop.values?.[0]
}

const alternateEnum = (prop: ComponentProp | undefined) => {
  if (!prop?.values?.length) return undefined
  const fallback = defaultEnum(prop)
  return prop.values.find((value) => value !== fallback) || prop.values[0]
}

const childText = (scenario: string | undefined, title: string) =>
  escapeText(scenario || title || 'Continue') || 'Continue'

const reactAttrs = (attrs: Array<[string, string]>) =>
  attrs.map(([key, value]) => `${key}="${value}"`).join(' ')

const vueAttrs = (attrs: Array<[string, string]>) =>
  attrs.map(([key, value]) => `${key}="${value}"`).join(' ')

const isPackagePrimitive = (name: string, type: string | undefined, known: boolean) =>
  known && (type === undefined || type === 'registry:ui' || type === 'registry:component')

export const createSnippet = (input: {
  name: string
  title: string
  framework: FrameworkId
  type?: string
  knownPrimitive: boolean
  scenario?: string
  props?: Record<string, string | number | boolean>
  schema?: UCS
  wrapperName?: string
}): Snippet => {
  const symbol = toSymbol(input.name)
  const wrapper =
    input.wrapperName && input.wrapperName !== symbol ? input.wrapperName : `${symbol}Example`
  const text = childText(input.scenario, input.title)
  const variant = enumProp(input.schema?.props, 'variant')
  const size = enumProp(input.schema?.props, 'size')
  const notes: string[] = []
  const attrs: Array<[string, string]> = []

  const variantValue = defaultEnum(variant)
  if (variantValue) attrs.push(['variant', variantValue])
  const sizeValue = defaultEnum(size)
  if (sizeValue && sizeValue !== 'icon') attrs.push(['size', sizeValue])

  Object.entries(input.props || {}).forEach(([key, value]) => {
    const prop = input.schema?.props?.find((item) => item.name === key)
    if (input.schema && !prop) {
      notes.push(`Dropped unknown prop "${key}". It is not in the ${input.name} schema.`)
      return
    }
    if (prop?.type === 'enum' && typeof value === 'string' && !prop.values?.includes(value)) {
      notes.push(`Dropped ${key}="${value}". Allowed values: ${(prop.values || []).join(', ')}.`)
      return
    }
    if (prop?.type === 'event') {
      notes.push(`Skipped event prop "${key}". Wire it in the surrounding application code.`)
      return
    }
    const rendered = typeof value === 'string' ? value : String(value)
    const index = attrs.findIndex(([attr]) => attr === key)
    if (index >= 0) attrs.splice(index, 1)
    attrs.push([key, rendered])
  })

  if (attrs.some(([key, value]) => key === 'size' && value === 'icon')) {
    attrs.push(['aria-label', text])
  }

  const packagePrimitive = isPackagePrimitive(input.name, input.type, input.knownPrimitive)
  const importSource = packagePrimitive
    ? packageName(input.framework)
    : `@/components/ui/${input.name}`

  if (!packagePrimitive) {
    notes.push(
      'This registry item is copied source. Import its default export from the installed file, not from the framework package.'
    )
  }
  notes.push(
    'Replace placeholder copy with product data. Do not add props that are absent from metadata.'
  )

  if (input.framework === 'vue') {
    const attrText = vueAttrs(attrs)
    return {
      symbol,
      importSource: packagePrimitive ? '@timui/vue' : importSource,
      sourceKind: packagePrimitive ? 'package' : 'registry-file',
      notes,
      files: [
        {
          path: `${wrapper}.vue`,
          content: `<script setup lang="ts">
import ${packagePrimitive ? `{ ${symbol} }` : symbol} from '${packagePrimitive ? '@timui/vue' : importSource}'
</script>

<template>
  <${symbol}${attrText ? ` ${attrText}` : ''}>${attrs.some(([key]) => key === 'aria-label') ? '' : text}</${symbol}>
</template>
`,
        },
      ],
    }
  }

  if (input.framework === 'html') {
    const variantAttr = attrs.find(([key]) => key === 'variant')
    const dataVariant = variantAttr ? ` data-variant="${variantAttr[1]}"` : ''
    const html =
      input.name === 'input' || input.name === 'textarea'
        ? `<input data-slot="${input.name}" type="text" aria-label="${text}"${dataVariant} />\n`
        : input.name === 'button'
          ? `<button type="button" data-slot="button"${dataVariant}>${text}</button>\n`
          : `<div data-slot="${input.name}"${dataVariant}>${text}</div>\n`
    return {
      symbol,
      importSource: '@timui/html',
      sourceKind: 'registry-file',
      notes: [
        ...notes,
        'HTML is structural markup. Copy the installed registry HTML when you need the full styled template.',
      ],
      files: [
        {
          path: `${input.name}.html`,
          content: html,
        },
      ],
    }
  }

  if (input.framework === 'weapp') {
    const tag = `t-${input.name}`
    const attrText = attrs
      .filter(([key]) => key !== 'aria-label')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
    return {
      symbol,
      importSource: '@timui/weapp',
      sourceKind: 'registry-file',
      notes: [
        ...notes,
        `Register the component before use: { "usingComponents": { "${tag}": "/components/${input.name}/${input.name}" } }`,
        'Listen with bind:press so the TimEvent protocol fires alongside the native tap.',
      ],
      files: [
        {
          path: `${input.name}.wxml`,
          content: `<${tag}${attrText ? ` ${attrText}` : ''} bind:press="onPress">${text}</${tag}>
`,
        },
      ],
    }
  }

  const attrText = reactAttrs(attrs)
  const children = attrs.some(([key]) => key === 'aria-label') ? '' : text
  const importLine = packagePrimitive
    ? `import { ${symbol} } from '@timui/react'`
    : `import ${symbol} from '${importSource}'`

  return {
    symbol,
    importSource,
    sourceKind: packagePrimitive ? 'package' : 'registry-file',
    notes,
    files: [
      {
        path: `${wrapper}.tsx`,
        content: `${importLine}

export function ${wrapper}() {
  return (
    <${symbol}${attrText ? ` ${attrText}` : ''}>${children}</${symbol}>
  )
}
`,
      },
    ],
  }
}

export const examplesFor = (input: {
  name: string
  title: string
  frameworks: FrameworkId[]
  type?: string
  knownPrimitive: boolean
  schema?: UCS
}): UsageExample[] => {
  const variant = enumProp(input.schema?.props, 'variant')
  const alternate = alternateEnum(variant)

  return input.frameworks.flatMap((framework) => {
    const basic = createSnippet({ ...input, framework })
    const examples: UsageExample[] = [
      {
        id: 'basic',
        framework,
        description: `Basic ${input.title || input.name} usage for ${framework}.`,
        code: basic.files[0]?.content || '',
      },
    ]
    if (alternate) {
      const variantSnippet = createSnippet({
        ...input,
        framework,
        props: { variant: alternate },
      })
      examples.push({
        id: 'variants',
        framework,
        description: `Uses variant="${alternate}", which is a documented enum value.`,
        code: variantSnippet.files[0]?.content || '',
      })
    }
    return examples
  })
}

export const guidanceFor = (schema: UCS | undefined, name: string) => {
  const a11y = [
    'Give every control visible text or an aria-label.',
    'Keep touch targets at least 44px. Do not remove min-h-touch-target or safe-area padding.',
  ]
  const pitfalls = [...(pitfallsByName[name] || [])]

  if (schema?.logic.provider === 'zag') {
    pitfalls.push(
      `State comes from the ${schema.logic.machine || 'Zag'} machine in the installed source. Do not fork that state with a parallel useState.`
    )
  }
  if ((schema?.parts.length || 0) > 2) {
    pitfalls.push(
      'Compose the documented parts. Do not collapse a multi-part component into one element.'
    )
  }
  if (schema?.parts.some((part) => part.name === 'title')) {
    a11y.push('Render the title part so the surface has an accessible name.')
  }

  return { a11y, pitfalls }
}

const lineOf = (code: string, index: number) => code.slice(0, index).split('\n').length

const symbolToName = (symbol: string, names: string[]) =>
  names.find((name) => toSymbol(name) === symbol)

const partNameOf = (rest: string) => rest.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const isKnownExport = (
  symbol: string,
  names: string[],
  schemaFor: (name: string) => UCS | undefined
) => {
  if (symbolToName(symbol, names)) return true
  return names.some((name) => {
    const base = toSymbol(name)
    if (!symbol.startsWith(base) || symbol.length === base.length) return false
    const partName = partNameOf(symbol.slice(base.length))
    return Boolean(schemaFor(name)?.parts.some((part) => part.name === partName))
  })
}

export const schemaForSymbol = (
  symbol: string,
  names: string[],
  schemaFor: (name: string) => UCS | undefined
) => {
  const exact = symbolToName(symbol, names)
  if (exact) return schemaFor(exact)
  let match: string | undefined
  names.forEach((name) => {
    const base = toSymbol(name)
    if (!symbol.startsWith(base) || symbol.length === base.length) return
    if (match && toSymbol(match).length >= base.length) return
    const partName = partNameOf(symbol.slice(base.length))
    if (schemaFor(name)?.parts.some((part) => part.name === partName)) match = name
  })
  return match ? schemaFor(match) : undefined
}

export const validateUsage = (
  code: string,
  options: {
    framework: FrameworkId
    component?: string
    names: string[]
    schemaFor: (name: string) => UCS | undefined
  }
): { issues: UsageIssue[]; suggestions: string[] } => {
  const issues: UsageIssue[] = []
  const suggestions: string[] = []

  if (!code.trim()) {
    issues.push({ type: 'syntax', message: 'Code is empty.' })
    return { issues, suggestions }
  }

  if (options.framework === 'react' && !code.includes('export')) {
    issues.push({
      type: 'syntax',
      message: 'React snippets should export a component.',
      fix: 'Add `export function Example()`.',
    })
  }
  if (options.framework === 'vue' && !code.includes('<template')) {
    issues.push({
      type: 'syntax',
      message: 'Vue snippets should include a <template> block.',
    })
  }
  if (options.framework === 'react' && code.includes('&quot;')) {
    issues.push({
      type: 'syntax',
      message: 'React code contains HTML-escaped quotes. Write JSX attributes with real quotes.',
    })
  }

  const frameworkPackages: Record<FrameworkId, string> = {
    react: '@timui/react',
    vue: '@timui/vue',
    html: '@timui/html',
    weapp: '@timui/weapp',
  }
  ;(Object.keys(frameworkPackages) as FrameworkId[]).forEach((framework) => {
    const source = frameworkPackages[framework]
    if (framework !== options.framework && code.includes(source)) {
      issues.push({
        type: 'dependency',
        message: `Snippet imports ${source} but validation framework is ${options.framework}.`,
        fix: `Import from ${frameworkPackages[options.framework]} or change the framework.`,
      })
    }
  })

  const namedImports = code.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]@timui\/(?:react|vue)['"]/g)
  for (const match of namedImports) {
    const imported = match[1] || ''
    imported.split(',').forEach((part) => {
      const symbol =
        part
          .trim()
          .split(/\s+as\s+/)[0]
          ?.trim() || ''
      if (!/^[A-Z]/.test(symbol)) return
      if (!isKnownExport(symbol, options.names, options.schemaFor)) {
        issues.push({
          type: 'registry',
          message: `${symbol} is not a Timkit component export.`,
          line: lineOf(code, match.index || 0),
          fix: 'Import only symbols returned by component metadata.',
        })
      }
    })
  }

  const tags = code.matchAll(/<([A-Z][A-Za-z0-9]*)\b([^>]*)(?:\/>|>([\s\S]*?)<\/\1>)/g)
  for (const match of tags) {
    const symbol = match[1] || ''
    const attrs = match[2] || ''
    const body = match[3] || ''
    const name = symbolToName(symbol, options.names)
    if (!name) continue
    const schema = options.schemaFor(name)
    const enumAttrs = attrs.matchAll(/\b([A-Za-z][A-Za-z0-9]*)="([^"]+)"/g)
    for (const attr of enumAttrs) {
      const propName = attr[1] || ''
      const propValue = attr[2] || ''
      const prop = schema?.props?.find((item) => item.name === propName)
      if (prop?.type === 'enum' && prop.values && !prop.values.includes(propValue)) {
        issues.push({
          type: 'prop',
          message: `${symbol} ${propName}="${propValue}" is not a documented value.`,
          line: lineOf(code, match.index || 0),
          fix: `Use one of: ${prop.values.join(', ')}.`,
        })
      }
    }

    if (name === 'button') {
      const iconOnly = /size="icon"/.test(attrs)
      const hasName = /aria-label=/.test(attrs) || /\blabel=/.test(attrs) || body.trim().length > 0
      if ((iconOnly || !hasName) && !/aria-label=/.test(attrs) && !/\blabel=/.test(attrs)) {
        issues.push({
          type: 'accessibility',
          message: iconOnly
            ? 'Icon-only Button requires aria-label.'
            : 'Button needs visible text, label, or aria-label.',
          line: lineOf(code, match.index || 0),
          fix: `Add aria-label="${childText(undefined, 'Continue')}".`,
        })
      }
    }
  }

  if (
    options.component &&
    !code.includes(toSymbol(options.component)) &&
    !code.includes(options.component)
  ) {
    suggestions.push(`Expected ${toSymbol(options.component)} in the snippet.`)
  }
  if (!code.includes('aria-') && !/<Button\b[^>]*>\s*[^<\s]/.test(code)) {
    suggestions.push('Check focus labels and landmark semantics before shipping the screen.')
  }

  return { issues, suggestions }
}
