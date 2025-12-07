import { RegistryItem } from '@timui/core'

import { ComponentData } from '@/components/preview/preview-app'

import { SectionCodeGroup } from './sections'

export function adaptRegistryItemToComponentData(item: RegistryItem, slug: string): ComponentData {
  // 1. Construct Code Groups
  const codeGroups: SectionCodeGroup[] = []

  // Group files by extension
  const frameworks = {
    react: item.files?.filter((f) => f.path.endsWith('.tsx') || f.path.endsWith('.jsx')) || [],
    vue: item.files?.filter((f) => f.path.endsWith('.vue')) || [],
    html: item.files?.filter((f) => f.path.endsWith('.html')) || [],
  }

  if (frameworks.react.length > 0) {
    codeGroups.push({
      id: `${item.name}-react`,
      label: 'React',
      language: 'tsx',
      files: frameworks.react.map((f, idx) => ({
        id: `${item.name}-react-${idx}`,
        label: 'React', // Or filename?
        code: f.content || '',
      })),
    })
  }
  if (frameworks.vue.length > 0) {
    codeGroups.push({
      id: `${item.name}-vue`,
      label: 'Vue',
      language: 'vue',
      files: frameworks.vue.map((f, idx) => ({
        id: `${item.name}-vue-${idx}`,
        label: 'Vue',
        code: f.content || '',
      })),
    })
  }
  if (frameworks.html.length > 0) {
    codeGroups.push({
      id: `${item.name}-html`,
      label: 'HTML',
      language: 'html',
      files: frameworks.html.map((f, idx) => ({
        id: `${item.name}-html-${idx}`,
        label: 'HTML',
        code: f.content || '',
      })),
    })
  }

  return {
    id: item.name,
    title: item.description || item.name,
    isActive: true, // Assuming active
    rtl: {} as any, // Legacy field
    registryStub: item,
    codeGroups: codeGroups,
    // mdxSource: we might need to compile description as MDX?
    // For now leave empty or compile simple string.
    // The old code compiled `content` from MDX file.
    // In registry, we might store description.
    mdxSource: null as any, // TODO: Handle MDX compilation if strictly needed for description rendering
    ltr: {} as any, // Legacy field, can be empty if extracted
  }
}
