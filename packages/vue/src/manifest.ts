import {
  componentNames,
  componentParts,
  type ComponentName,
  type FrameworkManifest,
} from '@timui/core'

export const extraComponents = [
  'calendar-rac',
  'cropper',
  'date-field',
  'date-input',
  'date-range-picker',
  'datefield-rac',
  'group',
  'header',
  'list-box',
  'list-box-item',
  'list-box-section',
  'multiple-selector',
  'number-field',
  'otpinput',
  'presence',
  'profile-bg',
  'range-calendar',
  'scroll-bar',
  'slot',
  'sonner',
  'status-dot',
  'time-field',
  'toaster',
] as const

export const hookNames = ['use-toast'] as const

export const manifest: FrameworkManifest = {
  framework: 'vue',
  components: componentNames,
  parts: componentParts,
  extras: extraComponents,
  hooks: hookNames,
  exports: {
    ui: '@timui/vue/ui',
    components: '@timui/vue/components',
    hooks: '@timui/vue/hooks',
  },
}

export const framework = manifest.framework
export const components = manifest.components
export const parts = manifest.parts
export const extras = manifest.extras
export type FrameworkComponentName = ComponentName
export type FrameworkHookName = (typeof hookNames)[number]
