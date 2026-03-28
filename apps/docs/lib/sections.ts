import { convertRegistryPaths, convertVueAtomicImports } from '@/lib/utils'

type TailEntry = {
  label?: string
  code?: string
}

type FrameworkKey = 'react' | 'vue' | 'html'

const FRAMEWORK_CONFIG: Record<FrameworkKey, { label: string; tailKey: string; language: string }> =
  {
    react: { label: 'React', tailKey: 'jsxTail', language: 'tsx' },
    vue: { label: 'Vue', tailKey: 'vueTail', language: 'vue' },
    html: { label: 'HTML', tailKey: 'htmlTail', language: 'html' },
  }

export type SectionCodeFile = {
  id: string
  label: string
  code: string
}

export type SectionCodeGroup = {
  id: string
  label: string
  files: SectionCodeFile[]
  language: string
}

const isRecord = (value: object): value is Record<string, object> =>
  typeof value === 'object' && value !== null

export const extractSectionCode = (ltr: object, prefix: string): SectionCodeGroup[] => {
  if (!isRecord(ltr)) return []

  const groups: SectionCodeGroup[] = []

  for (const framework of Object.keys(FRAMEWORK_CONFIG) as FrameworkKey[]) {
    const config = FRAMEWORK_CONFIG[framework]
    const frameworkValue = ltr[framework]
    if (!isRecord(frameworkValue)) {
      continue
    }

    const entries = frameworkValue[config.tailKey]
    if (!Array.isArray(entries) || entries.length === 0) {
      continue
    }

    const files: SectionCodeFile[] = entries
      .filter((entry): entry is TailEntry => isRecord(entry))
      .map((entry, idx) => ({
        id: `${prefix}-${framework}-${idx}`,
        label: entry.label ?? config.label,
        code:
          framework === 'vue'
            ? convertVueAtomicImports(convertRegistryPaths(entry.code ?? ''))
            : convertRegistryPaths(entry.code ?? ''),
      }))
      .filter((file) => file.code.trim().length > 0)

    if (files.length) {
      groups.push({
        id: `${prefix}-${framework}`,
        label: config.label,
        files,
        language: config.language,
      })
    }
  }

  return groups
}
