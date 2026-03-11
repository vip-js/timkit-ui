import fs from 'fs'
import path from 'path'

import { ucsRegistry as coreUcsRegistry } from '../../../packages/core/src/shared/registry'
import type { ComponentProp, RegistryItem } from '../../../packages/core/src/shared/schema'
import type { UCS } from '../../../packages/core/src/shared/ucs'
import type { ComponentData } from '../components/preview/preview-app'

const ucsRegistry = (coreUcsRegistry || {}) as Record<string, UCS>

type Framework = 'react' | 'vue' | 'weapp' | 'html'

const FRAMEWORK_LABEL: Record<Framework, string> = {
  react: 'React',
  vue: 'Vue',
  weapp: 'Weapp',
  html: 'HTML',
}

const PLATFORM_LABEL: Record<'web' | 'wechat' | 'mobile-native' | 'react-native', string> = {
  web: 'Web',
  wechat: 'WeChat Mini Program',
  'mobile-native': 'Mobile Native',
  'react-native': 'React Native',
}

const COMPONENT_FAMILY_MAP: Record<string, ComponentFamily> = {
  button: 'form',
  input: 'form',
  textarea: 'form',
  checkbox: 'form',
  'checkbox-tree': 'form',
  switch: 'form',
  slider: 'form',
  'radio-group': 'form',
  select: 'form',
  'select-native': 'form',
  combobox: 'form',
  multiselect: 'form',
  'tags-input': 'form',
  datefield: 'form',
  'date-picker': 'form',
  calendar: 'form',
  pagination: 'navigation',
  breadcrumb: 'navigation',
  navbar: 'navigation',
  'navigation-menu': 'navigation',
  tabs: 'navigation',
  accordion: 'navigation',
  collapsible: 'navigation',
  popover: 'overlay',
  tooltip: 'overlay',
  dialog: 'overlay',
  sheet: 'overlay',
  'hover-card': 'overlay',
  'dropdown-menu': 'overlay',
  'alert-dialog': 'overlay',
  command: 'overlay',
  toast: 'feedback',
  alert: 'feedback',
  notification: 'feedback',
  banner: 'feedback',
  progress: 'feedback',
  table: 'data',
  tree: 'data',
  timeline: 'data',
  stepper: 'data',
  card: 'layout',
  separator: 'layout',
  'scroll-area': 'layout',
  resizable: 'layout',
  label: 'layout',
  avatar: 'media',
  'image-cropper': 'media',
}

const EVENT_DESCRIPTION_MAP: Record<string, string> = {
  onChange: 'Callback fired when component value changes.',
  onValueChange: 'Callback fired when the controlled value updates.',
  onOpenChange: 'Callback fired when open state changes.',
  onPageChange: 'Callback fired when the active page changes.',
  onPageSizeChange: 'Callback fired when page size changes.',
  onClose: 'Callback fired when the component is closed or dismissed.',
  onSelect: 'Callback fired when an item is selected.',
  onFocus: 'Callback fired when component receives focus.',
  onBlur: 'Callback fired when component loses focus.',
}

const PROPERTY_DESCRIPTION_MAP: Record<string, string> = {
  value: 'Current controlled value.',
  defaultValue: 'Initial value in uncontrolled mode.',
  modelValue: 'Vue controlled value bound via v-model.',
  disabled: 'Disables interaction and applies disabled styles.',
  readOnly: 'Allows reading value while preventing user edits.',
  required: 'Marks field as required for validation and semantics.',
  placeholder: 'Placeholder shown when no value is selected.',
  orientation: 'Layout orientation of the component structure.',
  size: 'Visual size preset for spacing and typography.',
  variant: 'Visual style variant of the component.',
  class: 'Additional CSS class names merged into root.',
  className: 'Additional CSS class names merged into root.',
  open: 'Controlled open/close state.',
  defaultOpen: 'Initial open/close state in uncontrolled mode.',
  page: 'Current active page in controlled mode.',
  defaultPage: 'Initial active page in uncontrolled mode.',
  pageSize: 'Number of items rendered per page.',
  siblingCount: 'Number of adjacent pages shown around active page.',
  count: 'Total item count used for pagination calculations.',
  duration: 'Auto-close timeout in milliseconds.',
  closable: 'Whether users can manually dismiss the component.',
  dismissible: 'Whether users can manually dismiss the component.',
}

export type ApiTableRow = {
  name: string
  type: string
  default?: string
  description?: string
  required?: boolean
}

type InferredRow = ApiTableRow & {
  kind: 'prop' | 'event'
}

type ComponentFamily =
  | 'form'
  | 'navigation'
  | 'overlay'
  | 'feedback'
  | 'data'
  | 'layout'
  | 'media'
  | 'generic'

export type ComponentApiModel = {
  schemaName: string
  schema: UCS | null
  frameworks: Framework[]
  frameworkLabels: string[]
  platformLabels: string[]
  props: ApiTableRow[]
  events: ApiTableRow[]
  slots: ApiTableRow[]
  parts: ApiTableRow[]
  configs: ApiTableRow[]
  usedInference: boolean
}

const normalizeName = (name: string): string => name.trim().toLowerCase()

const removeDemoSuffix = (name: string): string => name.replace(/-\d+$/, '')

const getSchemaCandidates = (
  slug: string,
  sectionComponents: ComponentData[],
  registryItem?: RegistryItem
): string[] => {
  const raw = [
    slug,
    registryItem?.name || '',
    ...sectionComponents.map((item) => item.sourceName || ''),
    ...sectionComponents.map((item) => item.slug || ''),
  ].filter(Boolean)

  const candidates = new Set<string>()
  raw.forEach((value) => {
    const normalized = normalizeName(value)
    candidates.add(normalized)
    candidates.add(removeDemoSuffix(normalized))
  })

  return Array.from(candidates)
}

const toDefaultValue = (value: ComponentProp['defaultValue']): string => {
  if (value === undefined) return '-'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return '[complex]'
  }
}

const toFrameworks = (files: RegistryItem['files'] = []): Framework[] => {
  const frameworks = new Set<Framework>()
  files.forEach((file) => {
    const filePath = (file.path || '').toLowerCase()
    if (/\.(tsx|jsx)$/.test(filePath)) frameworks.add('react')
    if (/\.vue$/.test(filePath) || /\/vue\//.test(filePath)) frameworks.add('vue')
    if (/\.html$/.test(filePath)) frameworks.add('html')
    if (/\.wxml$/.test(filePath) || /\.wxss$/.test(filePath) || /\/weapp\//.test(filePath)) {
      frameworks.add('weapp')
    }
  })

  return ['react', 'vue', 'weapp', 'html'].filter((item) =>
    frameworks.has(item as Framework)
  ) as Framework[]
}

const inferDescription = (
  componentName: string,
  name: string,
  type: string,
  isEvent: boolean
): string => {
  const family = COMPONENT_FAMILY_MAP[componentName] || 'generic'

  if (isEvent) {
    if (EVENT_DESCRIPTION_MAP[name]) return EVENT_DESCRIPTION_MAP[name]
    const eventName = name.replace(/^on/, '')
    return `Callback fired when ${eventName.charAt(0).toLowerCase()}${eventName.slice(1)} is triggered.`
  }

  if (PROPERTY_DESCRIPTION_MAP[name]) return PROPERTY_DESCRIPTION_MAP[name]
  if (family === 'form') return `Input behavior configuration for ${name}.`
  if (family === 'navigation') return `Navigation structure and state configuration for ${name}.`
  if (family === 'overlay') return `Overlay visibility and positioning behavior for ${name}.`
  if (family === 'feedback') return `Feedback presentation behavior for ${name}.`
  if (family === 'data') return `Data display behavior for ${name}.`
  if (family === 'layout') return `Layout and spacing behavior for ${name}.`
  if (family === 'media') return `Media rendering behavior for ${name}.`
  return `Behavior configuration for ${name} (${type}).`
}

const inferTypeLabel = (typeExpr: string): string => {
  const type = typeExpr.replace(/\s+/g, ' ').trim()
  const enumValues = [...type.matchAll(/'([^']+)'/g)].map((match) => match[1])
  if (enumValues.length) return `enum (${enumValues.join(' | ')})`
  if (/=>/.test(type) || /^\(.+\)\s*=>/.test(type)) return 'event'
  if (/\bboolean\b/.test(type)) return 'boolean'
  if (/\bnumber\b/.test(type)) return 'number'
  if (/\bstring\b/.test(type)) return 'string'
  if (/\[\]|\bArray<.+>/.test(type)) return 'array'
  if (/\{.+\}|Record<.+>/.test(type)) return 'object'
  return type
}

const readPropsSource = (schemaName: string): string => {
  const propsPath = path.join(process.cwd(), 'packages/core/src/components', schemaName, 'props.ts')
  if (!fs.existsSync(propsPath)) return ''
  return fs.readFileSync(propsPath, 'utf-8')
}

const inferPropsFromSource = (schemaName: string): InferredRow[] => {
  const source = readPropsSource(schemaName)
  if (!source) return []

  const rows: InferredRow[] = []
  const blocks = [
    ...source.matchAll(/export type [A-Za-z0-9_]*Props\s*=\s*[\s\S]*?\{([\s\S]*?)\}\s*/g),
    ...source.matchAll(/export interface [A-Za-z0-9_]*Props\s*\{([\s\S]*?)\}\s*/g),
  ]

  blocks.forEach((block) => {
    const body = block[1] || ''
    // Match optional JSDoc capturing group 1, then the property name down to type definition.
    const propMatches = body.matchAll(
      /(?:\/\*\*([\s\S]*?)\*\/\s*)?^[ \t]*([A-Za-z_][A-Za-z0-9_]*)\??:\s*([^;\n]+);?/gm
    )

    for (const match of propMatches) {
      const rawJsDoc = match[1]
      const name = match[2]
      const typeExpr = match[3].trim()
      const type = inferTypeLabel(typeExpr)
      const isEvent = name.startsWith('on') || type === 'event'

      let jsDocText = ''
      if (rawJsDoc) {
        jsDocText = rawJsDoc
          .split('\n')
          .map((line) => line.replace(/^\s*\*\s?/, '').trim())
          .filter(Boolean)
          .join(' ')
      }

      let description = jsDocText
      if (!description) {
        description = inferDescription(schemaName, name, type, isEvent)
      }

      rows.push({
        name,
        type,
        default: '-',
        description,
        required: !/\?\s*:/.test(match[0]),
        kind: isEvent ? 'event' : 'prop',
      })
    }
  })

  const uniq = new Map<string, InferredRow>()
  rows.forEach((row) => {
    if (!uniq.has(row.name)) uniq.set(row.name, row)
  })

  return Array.from(uniq.values())
}

const mergeRows = (baseRows: ApiTableRow[], inferredRows: ApiTableRow[]): ApiTableRow[] => {
  const merged = new Map<string, ApiTableRow>()

  inferredRows.forEach((row) => {
    merged.set(row.name, row)
  })

  baseRows.forEach((row) => {
    const prev = merged.get(row.name)
    if (!prev) {
      merged.set(row.name, row)
      return
    }

    merged.set(row.name, {
      ...prev,
      ...row,
      description: row.description && row.description !== '-' ? row.description : prev.description,
      default: row.default && row.default !== '-' ? row.default : prev.default,
    })
  })

  return Array.from(merged.values())
}

const toSchemaProps = (schema: UCS | null): ApiTableRow[] =>
  (schema?.props || [])
    .filter((prop) => prop.type !== 'event')
    .map((prop) => ({
      name: prop.name,
      type: prop.values?.length ? `${prop.type} (${prop.values.join(' | ')})` : prop.type,
      default: toDefaultValue(prop.defaultValue),
      description: prop.description || '-',
      required: prop.required,
    }))

const toSchemaEvents = (schema: UCS | null): ApiTableRow[] =>
  (schema?.props || [])
    .filter((prop) => prop.type === 'event')
    .map((prop) => ({
      name: prop.name,
      type: 'event',
      default: '-',
      description: prop.description || '-',
      required: prop.required,
    }))

export const buildComponentApiModel = (
  slug: string,
  sectionComponents: ComponentData[],
  registryItem?: RegistryItem
): ComponentApiModel => {
  const candidates = getSchemaCandidates(slug, sectionComponents, registryItem)
  const resolvedSchemaName =
    candidates.find((name) => ucsRegistry[name as keyof typeof ucsRegistry]) || slug
  const schema = (ucsRegistry[resolvedSchemaName as keyof typeof ucsRegistry] || null) as UCS | null

  const frameworks = toFrameworks(registryItem?.files)
  const frameworkLabels = frameworks.map((framework) => FRAMEWORK_LABEL[framework])
  const platformLabels = (schema?.supportedPlatforms || []).map(
    (platform) => PLATFORM_LABEL[platform]
  )

  const inferredRows = inferPropsFromSource(resolvedSchemaName)
  const inferredProps = inferredRows.filter((row) => row.kind === 'prop')
  const inferredEvents = inferredRows.filter((row) => row.kind === 'event')

  const props = mergeRows(toSchemaProps(schema), inferredProps)
  const events = mergeRows(toSchemaEvents(schema), inferredEvents)

  const slots = (schema?.slots || []).length
    ? (schema?.slots || []).map((slot) => ({
        name: slot.name,
        type: 'slot',
        default: '-',
        description: slot.description,
        required: slot.required,
      }))
    : [
        {
          name: 'default',
          type: 'slot',
          default: '-',
          description: 'Default slot content rendered inside the component root.',
          required: false,
        },
      ]

  const parts = (schema?.parts || []).map((part) => ({
    name: part.name,
    type: part.isRoot ? 'root' : 'part',
    default: '-',
    description: part.description,
    required: part.isRoot,
  }))

  const configs: ApiTableRow[] = [
    {
      name: 'logic.provider',
      type: 'enum (zag | native | none)',
      default: schema?.logic?.provider || '-',
      description: 'State and interaction provider used by this component.',
      required: true,
    },
    {
      name: 'logic.machine',
      type: 'string',
      default: schema?.logic?.machine || '-',
      description: 'Underlying state machine identifier when provider is zag.',
      required: false,
    },
    {
      name: 'platforms',
      type: 'array',
      default: platformLabels.join(', ') || '-',
      description: 'Platforms officially supported by this schema.',
      required: true,
    },
    {
      name: 'frameworks',
      type: 'array',
      default: frameworkLabels.join(', ') || '-',
      description: 'Framework demos/code currently available in registry files.',
      required: true,
    },
    {
      name: 'dependencies',
      type: 'array',
      default: (registryItem?.dependencies || []).join(', ') || '-',
      description: 'Runtime package dependencies required by this registry item.',
      required: false,
    },
    {
      name: 'optionalPeerDependencies',
      type: 'array',
      default: (registryItem?.optionalPeerDependencies || []).join(', ') || '-',
      description: 'Optional peer dependencies used by this registry item.',
      required: false,
    },
    {
      name: 'registryDependencies',
      type: 'array',
      default: (registryItem?.registryDependencies || []).join(', ') || '-',
      description: 'Dependent Timkit registry components/hook entries.',
      required: false,
    },
  ]

  return {
    schemaName: resolvedSchemaName,
    schema,
    frameworks,
    frameworkLabels,
    platformLabels,
    props,
    events,
    slots,
    parts,
    configs,
    usedInference: inferredRows.length > 0,
  }
}
