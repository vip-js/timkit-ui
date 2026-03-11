import fs from 'node:fs'
import path from 'node:path'
import type { RegistryItem } from '@timui/core'

import { getDemoComponentGroup, resolveDemoFrameworkSource } from '@/lib/demo-canonical'
import type { FrameworkPreviewHints, PreviewFrameworkKey } from '@/lib/framework-preview'
import { getPreviewComponentGroup } from '@/lib/framework-preview'

const DOCS_COMPONENTS_ROOT = path.join(process.cwd(), 'apps/docs/registry/default/components')

function loadDocsComponentFiles(group: string): NonNullable<RegistryItem['files']> {
  const componentDir = path.join(DOCS_COMPONENTS_ROOT, group)
  if (!fs.existsSync(componentDir)) return []

  return fs
    .readdirSync(componentDir)
    .filter((fileName) => /\.(tsx|jsx|vue|html)$/.test(fileName))
    .map((fileName) => {
      const absolutePath = path.join(componentDir, fileName)
      return {
        path: `registry/default/components/${group}/${fileName}`,
        content: fs.readFileSync(absolutePath, 'utf-8'),
        type: 'registry:component' as const,
      }
    })
}

export function getDocsFrameworkPreviewHints(name: string): FrameworkPreviewHints {
  const group = getPreviewComponentGroup(name)
  const files = loadDocsComponentFiles(group)
  if (!files.length) return {}

  const hints: FrameworkPreviewHints = {}

  for (const framework of ['react', 'vue', 'html'] as PreviewFrameworkKey[]) {
    const resolved = resolveDemoFrameworkSource(files, name, framework)
    if (resolved.file) {
      hints[framework] = {
        available: true,
        componentName: resolved.matchedName,
      }
    }
  }

  return hints
}
