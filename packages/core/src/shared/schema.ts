import { z } from 'zod'

export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[]

export interface TimEvent<TDetail = Record<string, JsonValue>> {
  readonly type: string
  readonly target: { id: string }
  readonly detail: TDetail
  readonly timestamp: number
}

export const registryItemTypeSchema = z.enum([
  'registry:ui',
  'registry:component',
  'registry:example',
  'registry:block',
  'registry:hook',
  'registry:lib',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:internal',
])

export const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema,
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z
    .array(
      z.object({
        path: z.string(),
        content: z.string().optional(),
        type: z
          .enum([
            'registry:css',
            'registry:ui',
            'registry:component',
            'registry:example',
            'registry:hook',
            'registry:lib',
            'registry:page',
            'registry:file',
            'registry:style',
            'registry:internal',
            'registry:block',
            'registry:theme',
          ])
          .optional(),
        target: z.string().optional(),
      })
    )
    .optional(),
  meta: z.record(z.string(), z.custom<JsonValue>()).optional(),
  parts: z.array(z.object({
    name: z.string(),
    description: z.string(),
    isRoot: z.boolean().optional(),
  })).optional(),
  logic: z.object({
    provider: z.enum(['zag', 'native', 'none']),
    machine: z.string().optional(),
  }).optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
  schemaVersion: z.string().optional(),
})


export type RegistryItem = z.infer<typeof registryItemSchema>

export const registryPayloadSchema = z.object({
  name: z.string(),
  items: z.array(registryItemSchema),
  generatedAt: z.string().optional(),
  schemaVersion: z.string().optional(),
  minCliVersion: z.string().optional(),
  checksum: z.string().optional(),
})

export type RegistryPayload = z.infer<typeof registryPayloadSchema>

// ============================================
// UI Component Schema (Metadata Layer)
// 之前位于 src/schemas/index.ts，现在整合至 registry-schema
// ============================================

export interface ComponentProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum' | 'object' | 'array' | 'event'
  required?: boolean
  description?: string
  defaultValue?: string | number | boolean | Record<string, JsonValue> | JsonValue[]
  values?: string[] // For enum
}

export interface ComponentSlot {
  name: string
  description: string
  required?: boolean
}

export interface ComponentVariantOption {
  name: string
  description?: string
  tokens?: string[]
}

export interface ComponentVariant {
  name: string
  prop: string
  description: string
  options: ComponentVariantOption[]
  defaultOption?: string
}

export interface ComponentInteraction {
  name: string
  description: string
  states: string[]
}

export interface ComponentSchema {
  name: string
  title: string
  description: string
  props?: ComponentProp[]
  slots?: ComponentSlot[]
  variants?: ComponentVariant[]
  tokens?: string[]
  interactions?: ComponentInteraction[]
  supportedPlatforms?: ('web' | 'wechat' | 'mobile-native')[]
}
