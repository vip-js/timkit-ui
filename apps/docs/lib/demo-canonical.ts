import type { RegistryItem } from '@timui/core'

export type DemoPreviewFramework = 'react' | 'vue' | 'html'
export type DemoFramework = DemoPreviewFramework | 'weapp'
export type DemoSourceMode = 'exact' | 'group-demo' | 'missing'

export type DemoResolvedSource = {
  requestedFramework: DemoFramework
  sourceFramework?: DemoFramework
  sourceMode: DemoSourceMode
  matchedName?: string
  file?: NonNullable<RegistryItem['files']>[number]
}

const DEMO_SUFFIX_RE = /-demo$/
const NUMBERED_DEMO_RE = /-\d{1,3}$/

function getFileBaseName(filePath: string) {
  const segments = filePath.split('/')
  const fileName = segments[segments.length - 1] || ''
  return fileName.replace(/\.[^.]+$/, '')
}

function matchesFramework(filePath: string, framework: DemoFramework) {
  if (framework === 'react') return /\.(t|j)sx$/.test(filePath)
  if (framework === 'vue') {
    return /\.vue$/.test(filePath) || (/\.ts$/.test(filePath) && filePath.includes('/vue/'))
  }
  if (framework === 'html') return /\.html$/.test(filePath)
  return (
    /(weapp|\.wx(ss|ml)|\.wxs|weapp)/i.test(filePath) ||
    (/\.ts$/.test(filePath) && filePath.includes('/weapp/'))
  )
}

export function isDemoLikeName(name: string) {
  return DEMO_SUFFIX_RE.test(name) || NUMBERED_DEMO_RE.test(name)
}

export function getDemoComponentGroup(name: string) {
  return name.replace(NUMBERED_DEMO_RE, '').replace(DEMO_SUFFIX_RE, '')
}

export function getDemoNameCandidates(name: string, includeGroupDemo = true) {
  const group = getDemoComponentGroup(name)
  const values = [name]
  if (includeGroupDemo) {
    const groupDemoName = `${group}-demo`
    if (groupDemoName !== name) values.push(groupDemoName)
  }
  values.push(group)
  return Array.from(new Set(values.filter(Boolean)))
}

export function getFrameworkDemoFiles(
  files: RegistryItem['files'],
  framework: DemoFramework
): NonNullable<RegistryItem['files']> {
  return (files || []).filter((file) => matchesFramework(file.path, framework))
}

export function resolveDemoFrameworkSource(
  files: RegistryItem['files'],
  componentName: string,
  framework: DemoFramework
): DemoResolvedSource {
  const candidates = getDemoNameCandidates(componentName, true)
  const frameworkFiles = getFrameworkDemoFiles(files, framework)

  for (const candidate of candidates) {
    const matched = frameworkFiles.find((file) => getFileBaseName(file.path) === candidate)
    if (matched) {
      return {
        requestedFramework: framework,
        sourceFramework: framework,
        sourceMode: candidate === componentName ? 'exact' : 'group-demo',
        matchedName: candidate,
        file: matched,
      }
    }
  }

  return {
    requestedFramework: framework,
    sourceMode: 'missing',
  }
}

export function buildDemoFrameworkMatrix(
  files: RegistryItem['files'],
  componentName: string
): Record<DemoFramework, DemoResolvedSource> {
  return {
    react: resolveDemoFrameworkSource(files, componentName, 'react'),
    vue: resolveDemoFrameworkSource(files, componentName, 'vue'),
    html: resolveDemoFrameworkSource(files, componentName, 'html'),
    weapp: resolveDemoFrameworkSource(files, componentName, 'weapp'),
  }
}
