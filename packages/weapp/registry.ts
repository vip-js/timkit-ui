import { componentNames } from '@timui/core'

export const weappExtraComponentNames = ['number-input'] as const
export const weappComponentNames = [...componentNames] as const

export type WeappRegistryItem = {
  name: string
  kind: 'component' | 'extra'
  status: 'implemented'
}

export const weappRegistry: WeappRegistryItem[] = [
  ...weappComponentNames.map((name) => ({
    name,
    kind: 'component' as const,
    status: 'implemented' as const,
  })),
  ...weappExtraComponentNames.map((name) => ({
    name,
    kind: 'extra' as const,
    status: 'implemented' as const,
  })),
]

export default weappRegistry
