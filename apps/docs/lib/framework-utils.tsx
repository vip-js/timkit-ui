import type { RegistryItem } from '@timui/core'

import { convertRegistryPaths } from '@/lib/utils'
import type { FrameworkTab } from '@/components/frameworks-tabs'
import { IconHTML, IconReact, IconVue, IconWeapp } from '@/components/icons'

export const FRAMEWORK_TABS: FrameworkTab[] = [
  { value: 'react', name: 'React', icon: <IconReact /> },
  { value: 'vue', name: 'Vue', icon: <IconVue /> },
  { value: 'weapp', name: 'Weapp', icon: <IconWeapp /> },
  { value: 'html', name: 'HTML', icon: <IconHTML /> },
]

export function getFrameworkCodePanes(files: RegistryItem['files']): Record<string, string> {
  const safeFiles = files || []

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

export function getAvailableFrameworkTabs(files: RegistryItem['files']): FrameworkTab[] {
  const panes = getFrameworkCodePanes(files)
  return FRAMEWORK_TABS.filter((tab) => {
    const code = panes[tab.value]
    return typeof code === 'string' && code.trim().length > 0
  })
}
