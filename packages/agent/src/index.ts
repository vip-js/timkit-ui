import {
  componentNames,
  ucsRegistry,
  type ComponentName,
  type ComponentProp,
  type ComponentVariant,
  type RegistryItem,
  type UCS,
} from '@timui/core'

import { listAgentUi as readAgentUi, type AgentUiComponent } from './agent-ui'
import { fixUsage } from './fix'
import { getFrameworks, getMetaString, getTags, scoreItem, type FrameworkId } from './intent'
import { agentRecipes, recipeFramework, type AgentRecipe } from './recipes'
import { syntaxIssues } from './syntax'
import {
  createSnippet,
  examplesFor,
  guidanceFor,
  toSymbol,
  validateUsage,
  type UsageExample,
} from './usage'

export type TimkitFramework = FrameworkId
export type BuildMode = 'chat' | 'cli' | 'agent'
export type PlanConfidence = 'high' | 'medium' | 'low' | 'none'
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
  symbol: string
  importSource: string
  examples: UsageExample[]
  a11y: string[]
  pitfalls: string[]
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

export interface PlanSelection extends ComponentMetadata {
  score: number
  reasons: string[]
}

export interface BuildPlan {
  prompt: string
  framework: TimkitFramework
  mode: BuildMode
  confidence: PlanConfidence
  selected: PlanSelection[]
  steps: BuildPlanStep[]
  installCommands: string[]
  verificationCommands: string[]
  notes: string[]
  clarification?: string
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
  type: 'syntax' | 'accessibility' | 'dependency' | 'registry' | 'prop'
  message: string
  line?: number
  fix?: string
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
  suggestions: string[]
}

export interface ProjectSnapshot {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  files?: string[]
}

export interface DependencyCheck {
  name: string
  direct: string[]
  transitive: string[]
  missing: string[]
  dependents: string[]
}

export interface FixResult {
  code: string
  changed: boolean
  changes: string[]
  validation: ValidationResult
}

export interface ProjectContext {
  framework: TimkitFramework
  registryBaseUrl: string
  availableComponents: number
  installedComponents: string[]
  dependencies: Record<string, DependencyCheck>
  recommendedEntrypoints: Record<BuildMode, string>
  warnings: string[]
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
  cli: 'Run timkit agent plan "<prompt>" --framework react --json. Install nothing when confidence is none.',
  agent:
    'Read /agent-index.json, call plan, and stop to ask a question when confidence is none. Then fetch /r/{name}.json.',
}

const verificationFor = (framework: TimkitFramework): string[] => {
  if (framework === 'vue') return ['npx vue-tsc --noEmit --pretty false']
  if (framework === 'weapp') {
    return ['Register the component in usingComponents, then compile in WeChat DevTools.']
  }
  if (framework === 'html') {
    return ['Open the HTML file and confirm each control has visible text or aria-label.']
  }
  return ['npx tsc --noEmit']
}

const confidenceFor = (score: number): PlanConfidence => {
  if (score >= 12) return 'high'
  if (score >= 8) return 'medium'
  if (score > 0) return 'low'
  return 'none'
}

const knownName = (name: string): name is ComponentName =>
  (componentNames as readonly string[]).includes(name)

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
    if (item) return this.toMetadata(item, { examples: 'all' })

    if (knownName(name)) {
      const schema = ucsRegistry[name]
      if (!schema) return undefined
      return this.toSchemaMetadata(schema, { examples: 'all' })
    }

    return undefined
  }

  plan(intent: BuildIntent): BuildPlan {
    const framework = intent.framework || this.defaultFramework
    const mode = intent.mode || 'agent'
    const ranked = this.registryItems
      .map((item) => ({
        item,
        ...scoreItem(item, intent.prompt, { framework, mobile: intent.mobile }),
      }))
      .filter(({ item, score }) => score > 0 && this.matchesFilter(item, { framework }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    const confidence = confidenceFor(ranked[0]?.score || 0)
    const selected: PlanSelection[] = ranked.map(({ item, score, reasons }) => ({
      ...this.toMetadata(item, { examples: 'framework', framework }),
      score,
      reasons,
    }))
    const installCommands = selected.map(
      (item) => `npx timkit add ${item.name} --yes --framework ${framework}`
    )
    const verificationCommands = selected.length ? verificationFor(framework) : []
    const clarification =
      confidence === 'none'
        ? 'No registry item matches this request. Ask which screen, block, or component to use. Do not install a fallback.'
        : confidence === 'low'
          ? 'The match is weak. Confirm the selected item before installing it.'
          : undefined

    const steps: BuildPlanStep[] =
      confidence === 'none'
        ? [
            {
              id: 'clarify',
              title: 'Ask for a concrete UI target',
              detail: clarification || '',
            },
          ]
        : [
            {
              id: 'understand',
              title: 'Read the plan',
              detail:
                'Use selected items, their props, and their examples. Ignore components that are not listed.',
            },
            {
              id: 'install',
              title: 'Install source',
              detail:
                'Run timkit add for each selected item. Blocks and pages are copied files, not package exports.',
              command: installCommands[0],
            },
            {
              id: 'verify',
              title: 'Validate the generated snippet',
              detail:
                'Run timkit agent validate <file> --json, then the framework typecheck. Fix prop and accessibility issues before continuing.',
              command: verificationCommands[0],
            },
          ]

    return {
      prompt: intent.prompt,
      framework,
      mode,
      confidence,
      selected,
      steps,
      installCommands,
      verificationCommands,
      notes: [
        'Do not invent enum values. Read props.values on the selected item.',
        'Alternate installer: npx shadcn@latest add <item.url>',
        'Inside the Timkit monorepo, contributors can also run pnpm goal:acceptance.',
      ],
      clarification,
    }
  }

  generateComponent(options: GenerateComponentOptions): GeneratedCode {
    const framework = options.framework || this.defaultFramework
    const metadata = this.getComponentMetadata(options.name)
    const item = this.registryItems.find((entry) => entry.name === options.name)
    const schema = knownName(options.name) ? ucsRegistry[options.name] : undefined
    const snippet = createSnippet({
      name: metadata?.name || options.name,
      title: metadata?.title || options.name,
      framework,
      type: item?.type || metadata?.type,
      knownPrimitive: knownName(options.name),
      scenario: options.scenario,
      props: options.props,
      schema,
      wrapperName: options.exportName,
    })

    return {
      name: options.name,
      framework,
      files: snippet.files,
      installCommand: `npx timkit add ${metadata?.name || options.name} --yes --framework ${framework}`,
      notes: snippet.notes,
    }
  }

  validateComponent(
    code: string,
    options: { framework?: TimkitFramework; component?: string } = {}
  ): ValidationResult {
    const framework = options.framework || this.defaultFramework
    const names = Array.from(
      new Set([...componentNames, ...this.registryItems.map((item) => item.name)])
    )
    const schemaFor = (name: string) => (knownName(name) ? ucsRegistry[name] : undefined)
    const result = validateUsage(code, {
      framework,
      component: options.component,
      names,
      schemaFor,
    })
    const syntax = syntaxIssues(code, framework)

    return {
      valid: result.issues.length === 0 && syntax.length === 0,
      issues: [...syntax, ...result.issues],
      suggestions: result.suggestions,
    }
  }

  fixComponent(
    code: string,
    options: { framework?: TimkitFramework; component?: string } = {}
  ): FixResult {
    const framework = options.framework || this.defaultFramework
    const names = Array.from(
      new Set([...componentNames, ...this.registryItems.map((item) => item.name)])
    )
    const fixed = fixUsage(code, {
      framework,
      names,
      schemaFor: (name) => (knownName(name) ? ucsRegistry[name] : undefined),
    })
    const validation = this.validateComponent(fixed.code, { ...options, framework })
    return {
      code: fixed.code,
      changed: fixed.code !== code,
      changes: fixed.changes,
      validation,
    }
  }

  checkDependencies(name: string, installed: string[] = []): DependencyCheck {
    return this.dependencyCheck(name, new Set(installed))
  }

  listAgentUi(): AgentUiComponent[] {
    return readAgentUi()
  }

  listRecipes(): Array<
    Pick<AgentRecipe, 'id' | 'title' | 'description' | 'components' | 'frameworks'>
  > {
    return agentRecipes.map(({ id, title, description, components, frameworks }) => ({
      id,
      title,
      description,
      components,
      frameworks,
    }))
  }

  generateRecipe(id: string, framework?: TimkitFramework): GeneratedCode {
    const target = framework || this.defaultFramework
    const recipe = agentRecipes.find((item) => item.id === id)
    const supported = recipeFramework(target)
    if (!recipe || !supported) {
      return {
        name: id,
        framework: target,
        files: [],
        installCommand: '',
        notes: [
          recipe
            ? `Recipe "${id}" is available for react and vue.`
            : `Unknown recipe "${id}". Known recipes: ${agentRecipes.map((item) => item.id).join(', ')}.`,
        ],
      }
    }
    const file = recipe.files[supported]
    if (!file) {
      return {
        name: id,
        framework: supported,
        files: [],
        installCommand: '',
        notes: [`Recipe "${id}" does not include a ${supported} file.`],
      }
    }
    return {
      name: id,
      framework: supported,
      files: [file],
      installCommand: recipe.components
        .map((component) => `npx timkit add ${component} --yes --framework ${supported}`)
        .join(' && '),
      notes: [
        recipe.description,
        'Copy the file as-is. Props in the recipe are limited to the component contract.',
      ],
    }
  }

  getProjectContext(snapshot: ProjectSnapshot = {}): ProjectContext {
    const deps = { ...snapshot.devDependencies, ...snapshot.dependencies }
    const hasVue = Boolean(deps.vue || deps.nuxt)
    const hasReact = Boolean(deps.react || deps.next || deps['react-dom'])
    const warnings: string[] = []
    let framework = this.defaultFramework

    if (hasVue && hasReact) {
      warnings.push(
        'Both React and Vue dependencies are present. Pass --framework to choose the target.'
      )
    } else if (hasVue) {
      framework = 'vue'
    } else if (hasReact) {
      framework = 'react'
    } else if (snapshot.dependencies || snapshot.devDependencies) {
      warnings.push('No React or Vue dependency was found. Pass --framework react|vue|html|weapp.')
    }

    const installed = new Set<string>()
    const files = snapshot.files || []
    files.forEach((file) => {
      const named = file.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]@timui\/(?:react|vue)['"]/g)
      for (const match of named) {
        ;(match[1] || '').split(',').forEach((part) => {
          const symbol =
            part
              .trim()
              .split(/\s+as\s+/)[0]
              ?.trim() || ''
          const name = componentNames.find((entry) => toSymbol(entry) === symbol)
          if (name) installed.add(name)
        })
      }
      const paths = file.matchAll(/components\/ui\/([a-z0-9-]+)/g)
      for (const match of paths) {
        if (match[1]) installed.add(match[1])
      }
    })

    const known = new Set<string>([
      ...componentNames,
      ...this.registryItems.map((item) => item.name),
    ])
    installed.forEach((name) => {
      if (!known.has(name)) {
        warnings.push(`Imported component "${name}" is not in the Timkit registry.`)
      }
    })

    const installedComponents = Array.from(installed).sort()
    const dependencies = Object.fromEntries(
      installedComponents.map((name) => [name, this.dependencyCheck(name, installed)])
    )
    installedComponents.forEach((name) => {
      dependencies[name]?.missing.forEach((missing) => {
        warnings.push(`Installed "${name}" is missing registry dependency "${missing}".`)
      })
    })

    return {
      framework,
      registryBaseUrl: this.registryBaseUrl,
      availableComponents: this.registryItems.length || componentNames.length,
      installedComponents,
      dependencies,
      recommendedEntrypoints: buildModeEntrypoints,
      warnings,
    }
  }

  private dependencyCheck(name: string, installed: Set<string>): DependencyCheck {
    const direct = this.directRegistryDeps(name)
    const seen = new Set<string>([name])
    const transitive: string[] = []
    const queue = [...direct]
    while (queue.length > 0) {
      const current = queue.shift() || ''
      if (!current || seen.has(current)) continue
      seen.add(current)
      if (!direct.includes(current)) transitive.push(current)
      this.directRegistryDeps(current).forEach((dependency) => queue.push(dependency))
    }
    const required = [...direct, ...transitive]
    return {
      name,
      direct,
      transitive,
      missing: required.filter((dependency) => !installed.has(dependency)),
      dependents: this.registryItems
        .filter((item) => (item.registryDependencies || []).includes(name))
        .map((item) => item.name)
        .sort(),
    }
  }

  private directRegistryDeps(name: string): string[] {
    const item = this.registryItems.find((entry) => entry.name === name)
    return Array.from(new Set(item?.registryDependencies || []))
  }

  createSession() {
    return new TimkitAgentSession(this)
  }

  private matchesFilter(item: RegistryItem, filter: ComponentFilter): boolean {
    const tags = getTags(item)
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
    if (filter.framework && frameworks.length > 0 && !frameworks.includes(filter.framework)) {
      return false
    }
    if (filter.query) {
      const scored = scoreItem(item, filter.query, { framework: filter.framework })
      if (scored.score === 0) return false
    }
    return true
  }

  private toMetadata(
    item: RegistryItem,
    exampleMode: { examples: 'none' | 'framework' | 'all'; framework?: TimkitFramework } = {
      examples: 'none',
    }
  ): ComponentMetadata {
    const schema = knownName(item.name) ? ucsRegistry[item.name] : undefined
    const guidance = guidanceFor(schema, item.name)
    const tags = getTags(item)
    const frameworks = getFrameworks(item)
    const complexity =
      item.type === 'registry:page'
        ? 'workflow'
        : item.type === 'registry:block'
          ? 'composite'
          : 'simple'
    const exampleFrameworks: TimkitFramework[] =
      exampleMode.examples === 'all'
        ? frameworks.length
          ? frameworks
          : ['react', 'vue', 'html', 'weapp']
        : exampleMode.examples === 'framework'
          ? [exampleMode.framework || this.defaultFramework]
          : []
    const knownPrimitive = knownName(item.name)
    const framework = exampleMode.framework || this.defaultFramework

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
      symbol: toSymbol(item.name),
      importSource: knownPrimitive ? `@timui/${framework}` : `@/components/ui/${item.name}`,
      examples: examplesFor({
        name: item.name,
        title: schema?.title || item.name,
        frameworks: exampleFrameworks,
        type: item.type,
        knownPrimitive,
        schema,
      }),
      a11y: guidance.a11y,
      pitfalls: guidance.pitfalls,
    }
  }

  private toSchemaMetadata(schema: UCS, exampleMode: { examples: 'all' }): ComponentMetadata {
    const guidance = guidanceFor(schema, schema.name)
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
      symbol: toSymbol(schema.name),
      importSource: `@timui/${this.defaultFramework}`,
      examples: examplesFor({
        name: schema.name,
        title: schema.title,
        frameworks: exampleMode.examples === 'all' ? ['react', 'vue', 'html', 'weapp'] : [],
        type: 'registry:ui',
        knownPrimitive: true,
        schema,
      }),
      a11y: guidance.a11y,
      pitfalls: guidance.pitfalls,
    }
  }
}

export class TimkitAgentSession {
  readonly messages: ChatMessage[] = []
  private framework?: TimkitFramework
  private mobile?: boolean

  constructor(private readonly agent: TimkitAgent) {}

  ask(prompt: string, options: { framework?: TimkitFramework; mobile?: boolean } = {}): BuildPlan {
    this.messages.push({ role: 'user', content: prompt })
    if (options.framework) this.framework = options.framework
    if (options.mobile !== undefined) this.mobile = options.mobile

    const history = this.messages
      .filter((message) => message.role === 'user')
      .map((message) => message.content)
      .join('\n')
    const mobile =
      options.mobile ?? this.mobile ?? /mobile|移动端|手机/.test(`${history}\n${prompt}`)

    let plan = this.agent.plan({
      prompt,
      mode: 'chat',
      framework: this.framework,
      mobile,
    })
    if (plan.confidence === 'none' && history !== prompt) {
      plan = this.agent.plan({
        prompt: history,
        mode: 'chat',
        framework: this.framework,
        mobile,
      })
    }

    this.messages.push({
      role: 'assistant',
      content:
        plan.confidence === 'none'
          ? plan.clarification || 'No matching registry item.'
          : `Selected ${plan.selected.map((item) => item.name).join(', ')} for ${plan.framework} (${plan.confidence}).`,
    })
    return plan
  }

  reply(
    prompt: string,
    options: { framework?: TimkitFramework; mobile?: boolean } = {}
  ): BuildPlan {
    return this.ask(prompt, options)
  }
}

export interface AgentContractFile {
  path: string
  target?: string
  type?: string
}

export interface AgentContract {
  name: string
  title: string
  description: string
  type: RegistryItemKind
  symbol: string
  sourceKind: 'package' | 'registry-file'
  importSource: string
  frameworks: TimkitFramework[]
  install: string
  sourceUrl: string
  props: ComponentProp[]
  variants: ComponentVariant[]
  parts: UCS['parts']
  logic: UCS['logic']
  a11y: string[]
  pitfalls: string[]
  examples: UsageExample[]
  files: AgentContractFile[]
  rules: string[]
}

export const buildAgentContract = (
  item: RegistryItem,
  options: { registryBaseUrl?: string; framework?: TimkitFramework } = {}
): AgentContract => {
  const framework = options.framework || 'react'
  const agent = new TimkitAgent({
    registryItems: [item],
    registryBaseUrl: options.registryBaseUrl,
    defaultFramework: framework,
  })
  const metadata = agent.getComponentMetadata(item.name)
  if (!metadata) {
    throw new Error(`Cannot build an agent contract for ${item.name}`)
  }

  const sourceKind = metadata.importSource.startsWith('@/') ? 'registry-file' : 'package'
  const rules = [
    'Use only enum values listed on props. Do not invent props.',
    sourceKind === 'package'
      ? `Import { ${metadata.symbol} } from '${metadata.importSource}'.`
      : 'This item is copied source. Import its default export from the installed file, not from @timui/react.',
    'Give every control visible text or an aria-label. Button size="icon" requires aria-label.',
  ]

  return {
    name: metadata.name,
    title: metadata.title,
    description: metadata.description,
    type: metadata.type,
    symbol: metadata.symbol,
    sourceKind,
    importSource: metadata.importSource,
    frameworks: metadata.frameworks,
    install: `npx timkit add ${metadata.name} --yes --framework ${framework}`,
    sourceUrl: metadata.url,
    props: metadata.props,
    variants: metadata.variants,
    parts: metadata.parts,
    logic: metadata.logic,
    a11y: metadata.a11y,
    pitfalls: metadata.pitfalls,
    examples: metadata.examples,
    files: (item.files || []).map((file) => ({
      path: file.path,
      target: file.target,
      type: file.type,
    })),
    rules,
  }
}

export const createTimkitAgent = (options?: TimkitAgentOptions) => new TimkitAgent(options)
