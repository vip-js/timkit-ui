import type { RegistryItem } from '@timui/core'

import { getFrameworkDemoFiles, resolveDemoFrameworkSource } from '@/lib/demo-canonical'
import { resolveFrameworkPreviewTargets, type FrameworkPreviewHints } from '@/lib/framework-preview'
import { convertRegistryPaths } from '@/lib/utils'
import type { FrameworkTab } from '@/components/frameworks-tabs'
import { IconHTML, IconReact, IconVue, IconWeapp } from '@/components/icons'

export const FRAMEWORK_TABS: FrameworkTab[] = [
  { value: 'react', name: 'React', icon: <IconReact /> },
  { value: 'vue', name: 'Vue', icon: <IconVue /> },
  { value: 'weapp', name: 'Weapp', icon: <IconWeapp /> },
  { value: 'html', name: 'HTML', icon: <IconHTML /> },
]

type FrameworkKey = 'react' | 'vue' | 'html' | 'weapp'

function isRegistryItem(value: RegistryItem | RegistryItem['files']): value is RegistryItem {
  return !Array.isArray(value)
}

function getSelectedFrameworkFiles(
  component: RegistryItem,
  framework: FrameworkKey
): NonNullable<RegistryItem['files']> {
  const selected = resolveDemoFrameworkSource(component.files, component.name, framework)
  if (!selected.file) return []
  if (framework !== 'weapp') return [selected.file]

  const frameworkFiles = getFrameworkDemoFiles(component.files, 'weapp')
  return frameworkFiles.filter((file) => {
    const segments = file.path.split('/')
    const fileName = segments[segments.length - 1] || ''
    return fileName.replace(/\.[^.]+$/, '') === selected.matchedName
  })
}

export function getFrameworkCodePanes(
  componentOrFiles: RegistryItem | RegistryItem['files']
): Record<string, string> {
  if (!isRegistryItem(componentOrFiles)) {
    const safeFiles = componentOrFiles || []
    return {
      react: safeFiles
        .filter((file) => /\.(t|j)sx$/.test(file.path))
        .map((f) => convertRegistryPaths(f.content || ''))
        .join('\n\n'),
      vue: safeFiles
        .filter(
          (file) =>
            /\.vue$/.test(file.path) || (/\.ts$/.test(file.path) && file.path.includes('/vue/'))
        )
        .map(
          (f) =>
            `// ${(f.target || '').replace('components/ui/', '')}\n${convertRegistryPaths(f.content || '')}`
        )
        .join('\n\n'),
      html: safeFiles
        .filter((file) => /\.html$/.test(file.path))
        .map((f) => f.content || '')
        .join('\n\n'),
      weapp: safeFiles
        .filter(
          (file) =>
            /(weapp|\.wx(ss|ml)|\.wxs|weapp)/i.test(file.path) ||
            (/\.ts$/.test(file.path) && file.path.includes('/weapp/'))
        )
        .map((f) => `/* ${(f.target || '').replace('components/ui/', '')} */\n${f.content || ''}`)
        .join('\n\n'),
      code: safeFiles[0]?.content ?? '',
    }
  }

  const component = componentOrFiles
  const reactFiles = getSelectedFrameworkFiles(component, 'react')
  const vueFiles = getSelectedFrameworkFiles(component, 'vue')
  const htmlFiles = getSelectedFrameworkFiles(component, 'html')
  const weappFiles = getSelectedFrameworkFiles(component, 'weapp')
  const reactCode = reactFiles.map((file) => convertRegistryPaths(file.content || '')).join('\n\n')
  const vueCode = vueFiles
    .map(
      (file) =>
        `// ${(file.target || '').replace('components/ui/', '')}\n${convertRegistryPaths(file.content || '')}`
    )
    .join('\n\n')
  const htmlCode = htmlFiles.map((file) => file.content || '').join('\n\n')

  return {
    react: reactCode,
    vue: vueCode,
    html: htmlCode,
    weapp: weappFiles
      .map(
        (file) =>
          `/* ${(file.target || '').replace('components/ui/', '')} */\n${file.content || ''}`
      )
      .join('\n\n'),
    code: reactFiles[0]?.content ?? component.files?.[0]?.content ?? '',
  }
}

export function getAvailableFrameworkTabs(
  componentOrFiles: RegistryItem | RegistryItem['files']
): FrameworkTab[] {
  const panes = getFrameworkCodePanes(componentOrFiles)
  return FRAMEWORK_TABS.filter((tab) => {
    const code = panes[tab.value]
    return typeof code === 'string' && code.trim().length > 0
  })
}

export function getAvailablePreviewFrameworkTabs(
  component: RegistryItem,
  previewHints?: FrameworkPreviewHints
): FrameworkTab[] {
  const panes = getFrameworkCodePanes(component)
  const previewTargets = resolveFrameworkPreviewTargets(component, previewHints)

  return FRAMEWORK_TABS.filter((tab) => {
    const code = panes[tab.value]
    if (typeof code === 'string' && code.trim().length > 0) return true

    if (tab.value === 'react' || tab.value === 'vue' || tab.value === 'html') {
      return previewTargets[tab.value].available
    }

    return false
  })
}
