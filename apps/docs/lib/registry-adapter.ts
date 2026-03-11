import type { RegistryItem } from '@timui/core'

import { getFrameworkCodePanes } from '@/lib/framework-utils'
import type { ComponentData } from '@/components/preview/preview-app'

import type { SectionCodeGroup } from './sections'

const emptyComponentSide = {
  preview: '',
  react: {
    jsxTail: [],
    jsxCss: [],
  },
}

export function adaptRegistryItemToComponentData(item: RegistryItem, slug: string): ComponentData {
  // 1. Construct Code Groups
  const codeGroups: SectionCodeGroup[] = []
  const paneMap = getFrameworkCodePanes(item)

  if (paneMap.react.trim()) {
    codeGroups.push({
      id: `${item.name}-react`,
      label: 'React',
      language: 'tsx',
      files: [{ id: `${item.name}-react-0`, label: 'React', code: paneMap.react }],
    })
  }
  if (paneMap.vue.trim()) {
    codeGroups.push({
      id: `${item.name}-vue`,
      label: 'Vue',
      language: 'vue',
      files: [{ id: `${item.name}-vue-0`, label: 'Vue', code: paneMap.vue }],
    })
  }
  if (paneMap.html.trim()) {
    codeGroups.push({
      id: `${item.name}-html`,
      label: 'HTML',
      language: 'html',
      files: [{ id: `${item.name}-html-0`, label: 'HTML', code: paneMap.html }],
    })
  }
  if (paneMap.weapp.trim()) {
    codeGroups.push({
      id: `${item.name}-weapp`,
      label: 'Weapp',
      language: 'weapp',
      files: [
        {
          id: `${item.name}-weapp-0`,
          label: 'Weapp',
          code: paneMap.weapp,
        },
      ],
    })
  }

  return {
    id: item.name,
    title: item.description || item.name,
    isActive: true, // Assuming active
    rtl: emptyComponentSide, // Legacy field
    registryStub: item,
    codeGroups: codeGroups,
    // mdxSource: we might need to compile description as MDX?
    // For now leave empty or compile simple string.
    // The old code compiled `content` from MDX file.
    // In registry, we might store description.
    mdxSource: null, // TODO: Handle MDX compilation if strictly needed for description rendering
    ltr: emptyComponentSide, // Legacy field, can be empty if extracted
  }
}
