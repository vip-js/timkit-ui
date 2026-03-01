import registryAll from '@/data/registry-all.json'
import type { RegistryItem } from '@timui/core'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { resolveRegistryAlias } from '@/lib/registry-aliases'
import type { RegistryTag } from '@/registry/registry-tags'

const getRegistry = () => {
  // Server 端尝试读取最新文件，客户端回退到打包内的 JSON，避免 fs 被打包到浏览器
  if (typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path')
      const registryPath = path.resolve(process.cwd(), 'apps/docs/data/registry-all.json')
      const json = fs.readFileSync(registryPath, 'utf-8')
      return JSON.parse(json)
    } catch {
      return registryAll
    }
  }
  return registryAll
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getComponentTags = (component: RegistryItem): RegistryTag[] => {
  const tags = component.meta?.tags
  if (!Array.isArray(tags)) return []
  return tags.filter((tag): tag is RegistryTag => typeof tag === 'string')
}

export const getComponents = (selectedTags: RegistryTag[] = []): RegistryItem[] => {
  const components = (getRegistry().items || []) as RegistryItem[]
  return selectedTags.length
    ? components.filter(
        (component) =>
          component.type === 'registry:ui' &&
          selectedTags.every((tag) => getComponentTags(component).includes(tag))
      )
    : components.filter((component) => component.type === 'registry:ui')
}

/** Safely converts an object value to a string array. */
const getStringArray = (value: any): string[] => {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string') return [value]
  return []
}

export const getComponentsByNames = (names: string[]): RegistryItem[] => {
  const components = (getRegistry().items || []) as RegistryItem[]
  const componentsMap = new Map(components.map((comp) => [comp.name, comp]))
  const aliasMap = new Map<string, RegistryItem>()
  components.forEach((comp) => {
    const aliases = getStringArray(comp.meta?.aliases as any)
    aliases.forEach((alias) => {
      if (!aliasMap.has(alias)) {
        aliasMap.set(alias, comp)
      }
    })
  })

  return names
    .map((name) => {
      const canonical = resolveRegistryAlias(name)
      const comp = componentsMap.get(canonical) || aliasMap.get(name)
      return comp?.type === 'registry:ui' ? comp : undefined
    })
    .filter((comp): comp is RegistryItem => comp !== undefined)
}

export const getAvailableTags = (selectedTags: RegistryTag[]): RegistryTag[] => {
  if (!selectedTags.length) return []

  const components = (getRegistry().items || []) as RegistryItem[]

  // Get all components that have all the selected tags
  const matchingComponents = components.filter(
    (component) =>
      component.type === 'registry:ui' &&
      selectedTags.every((tag) => getComponentTags(component).includes(tag))
  )

  // Get all unique tags from the matching components
  const availableTags = new Set<RegistryTag>()
  matchingComponents.forEach((component) => {
    getComponentTags(component).forEach((tag) => {
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
    .replace(/\.\.\/\.\.\/ui\//g, '@/components/ui/')
}

// -------- Shared variants for sheet (used by Weapp/Vue snippets) --------
export const sheetOverlayVariants = cva(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80'
)

export const sheetContentVariants = cva(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom:
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        right:
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
)
