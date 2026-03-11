import type { RegistryItem } from '@timui/core'

import {
  getDemoComponentGroup,
  getDemoNameCandidates,
  resolveDemoFrameworkSource,
} from '@/lib/demo-canonical'

export type PreviewFrameworkKey = 'react' | 'vue' | 'html'

export type FrameworkPreviewHint = {
  available?: boolean
  componentName?: string
  componentPath?: string
}

export type FrameworkPreviewHints = Partial<Record<PreviewFrameworkKey, FrameworkPreviewHint>>

export type FrameworkPreviewTarget = {
  available: boolean
  componentName?: string
  componentPath?: string
  code?: string
}

export type FrameworkPreviewTargets = Record<PreviewFrameworkKey, FrameworkPreviewTarget>

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function getFileBaseName(filePath: string) {
  const segments = filePath.split('/')
  const fileName = segments[segments.length - 1] || ''
  return fileName.replace(/\.[^.]+$/, '')
}

export function getPreviewComponentGroup(name: string) {
  return getDemoComponentGroup(name)
}

export function isExplicitDemoName(name: string) {
  return /-\d{1,3}$/.test(name) || /-demo$/.test(name)
}

export function getPreviewNameCandidates(name: string, allowGroupDemoFallback = false) {
  return unique(
    getDemoNameCandidates(name, allowGroupDemoFallback).filter((candidate) =>
      allowGroupDemoFallback ? true : candidate === name
    )
  )
}

export function resolveFrameworkPreviewTargets(
  component: RegistryItem,
  previewHints: FrameworkPreviewHints = {}
): FrameworkPreviewTargets {
  const preferHintedDemo = !isExplicitDemoName(component.name)
  const reactSource = resolveDemoFrameworkSource(component.files, component.name, 'react')
  const vueSource = resolveDemoFrameworkSource(component.files, component.name, 'vue')
  const htmlSource = resolveDemoFrameworkSource(component.files, component.name, 'html')
  const reactFile = reactSource.file
  const vueFile = vueSource.file
  const htmlFile = htmlSource.file

  return {
    react: {
      available: Boolean(reactFile || previewHints.react?.available),
      componentName:
        preferHintedDemo && previewHints.react?.componentName
          ? previewHints.react.componentName
          : component.name,
      componentPath:
        preferHintedDemo && previewHints.react?.componentPath
          ? previewHints.react.componentPath
          : reactFile?.path,
    },
    vue: {
      available: Boolean(vueSource.file || previewHints.vue?.available),
      componentName:
        preferHintedDemo && previewHints.vue?.componentName
          ? previewHints.vue.componentName
          : vueFile
            ? getFileBaseName(vueFile.path)
            : previewHints.vue?.componentName || component.name,
    },
    html: {
      available: Boolean(htmlSource.file || previewHints.html?.available),
      componentName:
        preferHintedDemo && previewHints.html?.componentName
          ? previewHints.html.componentName
          : htmlFile
            ? getFileBaseName(htmlFile.path)
            : previewHints.html?.componentName || component.name,
      code:
        preferHintedDemo &&
        previewHints.html?.componentName &&
        previewHints.html.componentName !== getFileBaseName(htmlFile?.path || '')
          ? undefined
          : htmlFile?.content || undefined,
    },
  }
}
