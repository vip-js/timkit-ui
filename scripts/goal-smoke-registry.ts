import fs from 'fs'
import path from 'path'

import { CORE_MULTI_FRAMEWORKS, FRAMEWORK_EXTENSIONS } from './check-registry-data'

type RegistryFile = { path?: string; content?: string }
type RegistryItem = { files?: RegistryFile[] }

const ROOT = path.resolve(__dirname, '..')
const REGISTRY_DIR = path.join(ROOT, 'apps/docs/data/registry')
const PLACEHOLDER_REGEX = /placeholder\s+for/i

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const readRegistryItem = (name: string): RegistryItem => {
  const filePath = path.join(REGISTRY_DIR, `${name}.json`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing registry item: ${filePath}`)
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as RegistryItem
}

const findFrameworkFile = (
  item: RegistryItem,
  framework: keyof typeof FRAMEWORK_EXTENSIONS
) => {
  const exts = FRAMEWORK_EXTENSIONS[framework]
  return item.files?.find((file) => {
    if (!file.path) return false
    const normalized = file.path.toLowerCase()
    return exts.some((ext) => normalized.endsWith(ext))
  })
}

const runRegistrySmoke = () => {
  Object.entries(CORE_MULTI_FRAMEWORKS).forEach(([name, frameworks]) => {
    const item = readRegistryItem(name)
    frameworks.forEach((framework) => {
      const file = findFrameworkFile(item, framework)
      assert(!!file, `Missing ${framework} implementation in registry ${name}`)
      assert(
        (file?.content?.length ?? 0) > 10,
        `Empty ${framework} implementation content in registry ${name}`
      )
      assert(
        !PLACEHOLDER_REGEX.test(file?.content ?? ''),
        `Placeholder content detected in registry ${name} (${framework})`
      )
    })
  })
}

const main = () => {
  console.log('Registry multi-platform smoke: START')
  runRegistrySmoke()
  console.log('Registry multi-platform smoke: PASS')
}

main()
