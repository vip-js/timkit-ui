import registry from '@/data/registry-all.json'
import type { RegistryItem } from '@timui/core'

import type { RegistryTag } from '@/registry/registry-tags'

export const getComponents = (selectedTags: RegistryTag[] = []): RegistryItem[] => {
  const components = (registry.items || []) as RegistryItem[]
  return selectedTags.length
    ? components.filter(
        (component) =>
          component.type === 'registry:ui' &&
          selectedTags.every((tag) => component.meta?.tags?.includes(tag) ?? false)
      )
    : components.filter((component) => component.type === 'registry:ui')
}

export const getComponentsByNames = (names: string[]): RegistryItem[] => {
  const components = (registry.items || []) as RegistryItem[]
  const componentsMap = new Map(components.map((comp) => [comp.name, comp]))

  return names
    .map((name) => {
      const comp = componentsMap.get(name)
      return comp?.type === 'registry:ui' ? comp : undefined
    })
    .filter((comp): comp is RegistryItem => comp !== undefined)
}

export const getAvailableTags = (selectedTags: RegistryTag[]): RegistryTag[] => {
  if (!selectedTags.length) return []

  const components = (registry.items || []) as RegistryItem[]

  // Get all components that have all the selected tags
  const matchingComponents = components.filter(
    (component) =>
      component.type === 'registry:ui' &&
      selectedTags.every((tag) => component.meta?.tags?.includes(tag) ?? false)
  )

  // Get all unique tags from the matching components
  const availableTags = new Set<RegistryTag>()
  matchingComponents.forEach((component) => {
    component.meta?.tags?.forEach((tag: RegistryTag) => {
      if (!selectedTags.includes(tag)) {
        availableTags.add(tag)
      }
    })
  })

  return Array.from(availableTags)
}

export const convertRegistryPaths = (content: string): string => {
  return content
    .replace(/@\/registry\/default\/ui/g, '@/components/ui')
    .replace(/@\/registry\/default\/compositions/g, '@/components')
    .replace(/@\/registry\/default\/hooks/g, '@/hooks')
    .replace(/@\/registry\/default\/lib/g, '@/lib')
}
