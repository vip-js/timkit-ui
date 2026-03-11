import type { ComponentName } from './component-names'
import type { ComponentPartsMap } from './component-parts'

export type FrameworkId = 'react' | 'vue' | 'html' | 'weapp' | 'react-native'

export type FrameworkManifest = {
  framework: FrameworkId
  components: readonly ComponentName[]
  parts: ComponentPartsMap
  extras: readonly string[]
  hooks: readonly string[]
  exports: {
    ui: string
    components: string
    hooks?: string
  }
}
