import {
  componentNames,
  ucsRegistry,
  type ComponentName,
  type ComponentProp,
  type ComponentVariant,
  type JsonValue,
  type RegistryItem,
  type UCS,
} from '@timui/core'

export type TimkitFramework = 'react' | 'vue' | 'html' | 'weapp'
export type BuildMode = 'chat' | 'cli' | 'agent'
export type RegistryItemKind = RegistryItem['type']

export interface TimkitAgentOptions {
  registryItems?: RegistryItem[]
  registryBaseUrl?: string
  defaultFramework?: TimkitFramework
}

export interface ComponentFilter {
  query?: string
  type?: RegistryItemKind
  category?: string
  tag?: string
  framework?: TimkitFramework
  mobile?: boolean
}

export interface ComponentMetadata {
  name: string
  title: string
  description: string
  type: RegistryItemKind
  category?: string
  tags: string[]
  frameworks: TimkitFramework[]
  dependencies: string[]
  registryDependencies: string[]
  url: string
  props: ComponentProp[]
  variants: ComponentVariant[]
  parts: UCS['parts']
  logic: UCS['logic']
  complexity: 'simple' | 'composite' | 'workflow'
  fitFor: BuildMode[]
}

export interface BuildIntent {
  prompt: string
  framework?: TimkitFramework
  mode?: BuildMode
  mobile?: boolean
}

export interface BuildPlanStep {
  id: string
  title: string
  detail: string
  command?: string
}

export interface BuildPlan {
  prompt: string
  framework: TimkitFramework
  mode: BuildMode
  selected: ComponentMetadata[]
  steps: BuildPlanStep[]
  installCommands: string[]
  verificationCommands: string[]
}

export interface GenerateComponentOptions {
  name: string
  framework?: TimkitFramework
  exportName?: string
  scenario?: string
  props?: Record<string, string | number | boolean>
}

export interface GeneratedCode {
  name: string
  framework: TimkitFramework
  files: Array<{
    path: string
    content: string
  }>
  installCommand: string
  notes: string[]
}

export interface ValidationIssue {
  type: 'syntax' | 'accessibility' | 'dependency' | 'registry'
  message: string
  line?: number
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
  suggestions: string[]
}

export interface ProjectContext {
  framework: TimkitFramework
  registryBaseUrl: string
  availableComponents: number
  installedComponents: string[]
  recommendedEntrypoints: Record<BuildMode, string>
}

type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

const DEFAULT_REGISTRY_BASE_URL = 'https://ui.timkit.cn'
const DEFAULT_FRAMEWORK: TimkitFramework = 'react'

const buildModeEntrypoints: Record<BuildMode, string> = {
  chat: 'Describe the target screen, data state, and interaction constraints in natural language.',
  cli: 'Run timkit agent plan "<prompt>" --framework react --json, then install selected items.',
  agent:
    'Read /agent-index.json, filter registry items, fetch /r/{name}.json, then verify locally.',
}

const verificationCommands = [
  'pnpm goal:acceptance',
  'pnpm goal:test:preview:protocol',
  'pnpm goal:test:docs:canonical',
]

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

const getMetaString = (item: RegistryItem, key: string): string | undefined => {
  const value = item.meta?.[key]
  return typeof value === 'string' ? value : undefined
}

const getFrameworks = (item: RegistryItem): TimkitFramework[] => {
  const values = getStringArray(item.meta?.frameworks)
  return values.filter((item): item is TimkitFramework =>
    ['react', 'vue', 'html', 'weapp'].includes(item)
  )
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const scoreItem = (item: RegistryItem, intent: BuildIntent): number => {
  const prompt = normalize(intent.prompt)
  const name = normalize(item.name)
  const description = normalize(item.description || '')
  const tags = getStringArray(item.meta?.tags).map(normalize)
  const category = normalize(getMetaString(item, 'category') || item.categories?.[0] || '')
  let score = 0

  if (prompt.includes(name)) score += 12
  if (
    description &&
    prompt.split(' ').some((token) => token.length > 2 && description.includes(token))
  ) {
    score += 4
  }
  tags.forEach((tag) => {
    if (tag && prompt.includes(tag)) score += 5
  })
  if (category && prompt.includes(category)) score += 3
  if (intent.mobile) {
    const viewport = getMetaString(item, 'viewport') || ''
    if (tags.includes('mobile') || viewport.includes('mobile')) score += 6
  }
  if (item.type === 'registry:page') score += 3
  if (item.type === 'registry:block') score += 2
  if (intent.framework && getFrameworks(item).includes(intent.framework)) score += 4

  return score
}

const toExportName = (name: string) =>
  name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const renderProps = (props: Record<string, string | number | boolean> = {}) =>
  Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') return `${key}="${value}"`
      return `${key}={${JSON.stringify(value)}}`
    })
    .join(' ')

export class TimkitAgent {
  private registryItems: RegistryItem[]
  private registryBaseUrl: string
  private defaultFramework: TimkitFramework

  constructor(options: TimkitAgentOptions = {}) {
    this.registryItems = options.registryItems || []
    this.registryBaseUrl = (options.registryBaseUrl || DEFAULT_REGISTRY_BASE_URL).replace(/\/$/, '')
    this.defaultFramework = options.defaultFramework || DEFAULT_FRAMEWORK
  }

  setRegistryItems(items: RegistryItem[]) {
    this.registryItems = items
  }

  listComponents(filter: ComponentFilter = {}): ComponentMetadata[] {
    return this.registryItems
      .filter((item) => this.matchesFilter(item, filter))
      .map((item) => this.toMetadata(item))
  }

  searchComponents(
    query: string,
    filter: Omit<ComponentFilter, 'query'> = {}
  ): ComponentMetadata[] {
    return this.listComponents({ ...filter, query })
  }

  getComponentMetadata(name: string): ComponentMetadata | undefined {
    const item = this.registryItems.find((entry) => entry.name === name)
    if (item) return this.toMetadata(item)

    if ((componentNames as readonly string[]).includes(name)) {
      const schema = ucsRegistry[name as ComponentName]
      if (!schema) return undefined
      return this.toSchemaMetadata(schema)
    }

    return undefined
  }

  plan(intent: BuildIntent): BuildPlan {
    const framework = intent.framework || this.defaultFramework
    const mode = intent.mode || 'agent'
    const queryMatches = this.registryItems
      .map((item) => ({ item, score: scoreItem(item, { ...intent, framework }) }))
      .filter(
        ({ item, score }) =>
          score > 0 && this.matchesFilter(item, { framework, mobile: intent.mobile })
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ item }) => this.toMetadata(item))

    const fallback = queryMatches.length
      ? queryMatches
      : this.listComponents({ framework, mobile: intent.mobile }).slice(0, 6)

    const installCommands = fallback.map(
      (item) => `npx shadcn@latest add ${this.registryBaseUrl}/r/${item.name}.json`
    )

    return {
      prompt: intent.prompt,
      framework,
      mode,
      selected: fallback,
      steps: [
        {
          id: 'understand',
          title: 'Understand intent',
          detail: 'Extract target platform, screen scope, data state, and required interactions.',
        },
        {
          id: 'select',
          title: 'Select registry items',
          detail:
            'Prefer registry:page for full screens, registry:block for flows, and registry:ui for primitives.',
        },
        {
          id: 'install',
          title: 'Install source',
          detail: 'Fetch each selected item through the shadcn-compatible registry URL.',
          command: installCommands[0],
        },
        {
          id: 'verify',
          title: 'Verify locally',
          detail: 'Run acceptance, preview protocol, and docs canonical checks after integration.',
          command: verificationCommands.join(' && '),
        },
      ],
      installCommands,
      verificationCommands,
    }
  }

  generateComponent(options: GenerateComponentOptions): GeneratedCode {
    const framework = options.framework || this.defaultFramework
    const exportName = options.exportName || toExportName(options.name)
    const metadata = this.getComponentMetadata(options.name)
    const props = renderProps(options.props)
    const componentName = metadata?.name || options.name
    const title = metadata?.title || exportName

    if (framework === 'vue') {
      return {
        name: options.name,
        framework,
        files: [
          {
            path: `${exportName}.vue`,
            content: `<script setup lang="ts">
import { ${exportName} } from '@timui/vue'
</script>

<template>
  <${exportName}${props ? ` ${props.replaceAll('{', '&quot;').replaceAll('}', '&quot;')}` : ''}>
    ${options.scenario || title}
  </${exportName}>
</template>
`,
          },
        ],
        installCommand: `npx shadcn@latest add ${this.registryBaseUrl}/r/${componentName}.json`,
        notes: [
          'Use the generated file as a starting point and replace placeholder copy with product data.',
        ],
      }
    }

    const importSource = framework === 'html' ? '@timui/html' : '@timui/react'
    return {
      name: options.name,
      framework,
      files: [
        {
          path: `${exportName}.tsx`,
          content: `import { ${exportName} } from '${importSource}'

export function ${exportName}Example() {
  return (
    <${exportName}${props ? ` ${props}` : ''}>
      ${JSON.stringify(options.scenario || title)}
    </${exportName}>
  )
}
`,
        },
      ],
      installCommand: `npx shadcn@latest add ${this.registryBaseUrl}/r/${componentName}.json`,
      notes: ['Generated code is intentionally small so agents can compose it into app screens.'],
    }
  }

  validateComponent(code: string, options: { framework?: TimkitFramework } = {}): ValidationResult {
    const framework = options.framework || this.defaultFramework
    const issues: ValidationIssue[] = []
    const suggestions: string[] = []

    if (!code.trim()) {
      issues.push({ type: 'syntax', message: 'Code is empty.' })
    }
    if (framework === 'react' && !code.includes('export')) {
      issues.push({ type: 'syntax', message: 'React snippets should export a component.' })
    }
    if (framework === 'vue' && !code.includes('<template')) {
      issues.push({ type: 'syntax', message: 'Vue snippets should include a <template> block.' })
    }
    if (/<button[\s>]/.test(code) && !/aria-label|>\s*[^<\s]/.test(code)) {
      issues.push({
        type: 'accessibility',
        message: 'Buttons need visible text or an aria-label for agent-generated UI.',
      })
    }
    if (code.includes('@timui/react') && framework !== 'react') {
      issues.push({
        type: 'dependency',
        message: `Snippet imports @timui/react but validation framework is ${framework}.`,
      })
    }
    if (code.includes('@timui/vue') && framework !== 'vue') {
      issues.push({
        type: 'dependency',
        message: `Snippet imports @timui/vue but validation framework is ${framework}.`,
      })
    }
    if (!code.includes('className') && framework === 'react') {
      suggestions.push('Add layout classes or compose an existing Timkit block before shipping.')
    }
    if (!code.includes('aria-')) {
      suggestions.push('Check focus labels and landmark semantics for generated application flows.')
    }

    return {
      valid: issues.length === 0,
      issues,
      suggestions,
    }
  }

  getProjectContext(): ProjectContext {
    return {
      framework: this.defaultFramework,
      registryBaseUrl: this.registryBaseUrl,
      availableComponents: this.registryItems.length || componentNames.length,
      installedComponents: [],
      recommendedEntrypoints: buildModeEntrypoints,
    }
  }

  createSession() {
    return new TimkitAgentSession(this)
  }

  private matchesFilter(item: RegistryItem, filter: ComponentFilter): boolean {
    const tags = getStringArray(item.meta?.tags)
    const frameworks = getFrameworks(item)
    const category = getMetaString(item, 'category') || item.categories?.[0]
    const viewport = getMetaString(item, 'viewport') || ''

    if (filter.type && item.type !== filter.type) return false
    if (filter.tag && !tags.includes(filter.tag)) return false
    if (
      filter.category &&
      category !== filter.category &&
      !item.categories?.includes(filter.category)
    ) {
      return false
    }
    if (filter.mobile && !tags.includes('mobile') && !viewport.includes('mobile')) return false
    if (filter.framework && frameworks.length > 0 && !frameworks.includes(filter.framework))
      return false
    if (filter.query) {
      const query = normalize(filter.query)
      const haystack = normalize(
        [item.name, item.description, category, ...tags, ...frameworks].filter(Boolean).join(' ')
      )
      if (!query.split(' ').some((token) => token.length > 1 && haystack.includes(token))) {
        return false
      }
    }
    return true
  }

  private toMetadata(item: RegistryItem): ComponentMetadata {
    const schema = (componentNames as readonly string[]).includes(item.name)
      ? ucsRegistry[item.name as ComponentName]
      : undefined
    const tags = getStringArray(item.meta?.tags)
    const frameworks = getFrameworks(item)
    const complexity =
      item.type === 'registry:page'
        ? 'workflow'
        : item.type === 'registry:block'
          ? 'composite'
          : 'simple'

    return {
      name: item.name,
      title: schema?.title || item.name,
      description: item.description || schema?.description || '',
      type: item.type,
      category: getMetaString(item, 'category') || item.categories?.[0],
      tags,
      frameworks,
      dependencies: item.dependencies || [],
      registryDependencies: item.registryDependencies || [],
      url: `${this.registryBaseUrl}/r/${item.name}.json`,
      props: schema?.props || [],
      variants: schema?.variants || [],
      parts: item.parts || schema?.parts || [],
      logic: item.logic || schema?.logic || { provider: 'none' },
      complexity,
      fitFor: [
        'agent',
        ...(item.type === 'registry:page' || item.type === 'registry:block'
          ? (['chat'] as const)
          : []),
        'cli',
      ],
    }
  }

  private toSchemaMetadata(schema: UCS): ComponentMetadata {
    return {
      name: schema.name,
      title: schema.title,
      description: schema.description,
      type: 'registry:ui',
      tags: ['primitive'],
      frameworks: ['react', 'vue', 'html', 'weapp'],
      dependencies: [],
      registryDependencies: [],
      url: `${this.registryBaseUrl}/r/${schema.name}.json`,
      props: schema.props || [],
      variants: schema.variants || [],
      parts: schema.parts,
      logic: schema.logic,
      complexity: schema.parts.length > 2 ? 'composite' : 'simple',
      fitFor: ['chat', 'cli', 'agent'],
    }
  }
}

export class TimkitAgentSession {
  readonly messages: ChatMessage[] = []

  constructor(private readonly agent: TimkitAgent) {}

  ask(prompt: string): BuildPlan {
    this.messages.push({ role: 'user', content: prompt })
    const plan = this.agent.plan({
      prompt,
      mode: 'chat',
      mobile: /mobile|app|phone|移动|手机/.test(prompt),
    })
    this.messages.push({
      role: 'assistant',
      content: `Selected ${plan.selected.map((item) => item.name).join(', ') || 'registry items'} for ${plan.framework}.`,
    })
    return plan
  }

  reply(prompt: string): BuildPlan {
    return this.ask(prompt)
  }
}

export const createTimkitAgent = (options?: TimkitAgentOptions) => new TimkitAgent(options)
