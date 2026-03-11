import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

import { CORE_MULTI_FRAMEWORKS, FRAMEWORK_EXTENSIONS } from '../scripts/check-registry-data'

const ROOT = path.resolve(__dirname, '..')
const REGISTRY_DIR = path.join(ROOT, 'apps/docs/data/registry')
const PLACEHOLDER_REGEX = /placeholder\s+for/i

const readItem = (name: string) => {
  const filePath = path.join(REGISTRY_DIR, `${name}.json`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as { files?: Array<{ path?: string; content?: string }> }
}

const findFrameworkFile = (
  item: ReturnType<typeof readItem>,
  framework: keyof typeof FRAMEWORK_EXTENSIONS
) => {
  const exts = FRAMEWORK_EXTENSIONS[framework]
  return item.files?.find((file) => {
    if (!file?.path) return false
    const normalized = file.path.toLowerCase()
    return exts.some((ext) => normalized.endsWith(ext))
  })
}

describe('核心组件 Registry 多端覆盖', () => {
  Object.entries(CORE_MULTI_FRAMEWORKS).forEach(([name, frameworks]) => {
    const item = readItem(name)

    frameworks.forEach((framework) => {
      it(`${name} 包含 ${framework} 实现`, () => {
        const file = findFrameworkFile(item, framework)
        expect(file).toBeDefined()
        expect(file?.content?.length ?? 0).toBeGreaterThan(10)
        expect(PLACEHOLDER_REGEX.test(file?.content ?? '')).toBe(false)
      })
    })
  })
})
