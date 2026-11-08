import fs from 'node:fs'
import path from 'node:path'

import { componentNames } from '../packages/core/src/shared/component-names'
import { componentParts } from '../packages/core/src/shared/component-parts'

const ROOT = path.resolve(__dirname, '..')

type Framework = 'react' | 'vue' | 'html' | 'weapp'

const frameworkRoots: Record<Framework, string> = {
  react: path.join(ROOT, 'packages/react/src/components/ui'),
  vue: path.join(ROOT, 'packages/vue/src/components/ui'),
  html: path.join(ROOT, 'packages/html/src/components'),
  weapp: path.join(ROOT, 'packages/weapp/src'),
}

const weappAliases: Record<string, string> = {
  'number-field': 'number-input',
}

const sourceExtensions: Record<Framework, string[]> = {
  react: ['.tsx', '.ts'],
  vue: ['.vue', '.ts'],
  html: ['.hbs', '.html'],
  weapp: ['.ts', '.js'],
}

const isSourceFile = (file: string, framework: Framework, name: string) => {
  const base = path.basename(file)
  if (!sourceExtensions[framework].some((extension) => base.endsWith(extension))) return false
  if (/\.(test|spec)\./.test(base)) return false
  if (base === `use-${name}.ts`) return false
  return true
}

const hasImplementation = (framework: Framework, name: string) => {
  const resolvedName = framework === 'weapp' ? weappAliases[name] || name : name
  const directory = path.join(frameworkRoots[framework], resolvedName)
  const directFiles = sourceExtensions[framework].map((extension) =>
    path.join(frameworkRoots[framework], `${resolvedName}${extension}`)
  )

  if (directFiles.some((file) => fs.existsSync(file) && isSourceFile(file, framework, resolvedName))) {
    return true
  }
  if (!fs.existsSync(directory)) return false

  const queue = [directory]
  while (queue.length) {
    const current = queue.shift()
    if (!current) continue
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name)
      if (entry.isDirectory()) queue.push(file)
      else if (isSourceFile(file, framework, resolvedName)) return true
    }
  }
  return false
}

const walk = (directory: string, output: string[] = []) => {
  if (!fs.existsSync(directory)) return output
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(file, output)
    else if (/\.(test|spec)\.(ts|tsx|js|jsx)$/.test(entry.name)) output.push(file)
  }
  return output
}

const failures: string[] = []
const frameworks: Framework[] = ['react', 'vue', 'html', 'weapp']
const coverage: Record<Framework, number> = { react: 0, vue: 0, html: 0, weapp: 0 }
const totalParts = Object.values(componentParts).reduce((sum, parts) => sum + (parts?.length || 0), 0)

for (const name of componentNames) {
  for (const framework of frameworks) {
    if (!hasImplementation(framework, name)) {
      failures.push(`${framework}/${name}: missing implementation entry`)
    } else {
      coverage[framework] += 1
    }
  }

}

const testFiles = [
  ...walk(path.join(ROOT, 'packages')),
  ...walk(path.join(ROOT, 'tests')),
]

console.log('Component validation matrix: START')
console.log(`Core components: ${componentNames.length}`)
console.log(
  `Implementation coverage: ${frameworks.map((framework) => `${framework} ${coverage[framework]}/${componentNames.length}`).join(', ')}`
)
console.log(`Composite part contracts catalogued: ${totalParts}`)
console.log(`Detected verification test files: ${testFiles.length}`)

if (failures.length) {
  throw new Error(`Component validation matrix failed:\n- ${failures.join('\n- ')}`)
}

console.log('Component validation matrix: PASS')
