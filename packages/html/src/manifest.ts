import {
  componentNames,
  componentParts,
  type ComponentName,
  type FrameworkManifest,
} from '@timui/core'

export const extraComponents = [] as const
export const hookNames = [] as const

export const manifest: FrameworkManifest = {
  framework: 'html',
  components: componentNames,
  parts: componentParts,
  extras: extraComponents,
  hooks: hookNames,
  exports: {
    ui: '@timui/html',
    components: '@timui/html/components',
  },
}

export const framework = manifest.framework
export const components = manifest.components
export const parts = manifest.parts
export const extras = manifest.extras
export type FrameworkComponentName = ComponentName
export type FrameworkHookName = (typeof hookNames)[number]
