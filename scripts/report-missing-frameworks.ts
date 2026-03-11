import fs from 'fs'
import path from 'path'

import { type RegistryItem } from '../packages/core/src/shared/schema'
import {
  computeFrameworksFromFiles,
  CORE_MULTI_FRAMEWORKS,
  FRAMEWORK_EXTENSIONS,
  PLACEHOLDER_REGEX,
} from './check-registry-data'

const ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(ROOT, 'apps/docs/data/registry-all.json')

const frameworksForPath = (filePath?: string) => {
  if (!filePath) return []
  const ext = path.extname(filePath).toLowerCase()
  return Object.entries(FRAMEWORK_EXTENSIONS)
    .filter(([, exts]) => exts.includes(ext))
    .map(([framework]) => framework)
}

const summarize = () => {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ registry-all.json missing; run pnpm registry:build:all first.')
    process.exit(1)
  }

  const payload = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as {
    items?: RegistryItem[]
  }
  const items = payload.items || []

  const missingRecords: {
    name: string
    missing: string[]
  }[] = []
  const placeholderRecords: {
    name: string
    frameworks: string[]
  }[] = []
  const missingVueUiRecords: string[] = []

  items.forEach((item) => {
    if (!item.files?.length) return

    const placeholderFiles = item.files.filter(
      (file) => file.content && PLACEHOLDER_REGEX.test(file.content)
    )
    const realFiles = item.files.filter(
      (file) => !file.content || !PLACEHOLDER_REGEX.test(file.content)
    )

    const realFrameworks = computeFrameworksFromFiles(realFiles)
    const placeholderFrameworks = new Set<string>()

    placeholderFiles.forEach((file) => {
      frameworksForPath(file.path).forEach((fw) => placeholderFrameworks.add(fw))
    })

    const required = CORE_MULTI_FRAMEWORKS[item.name] || []
    const missing = required.filter((fw) => !realFrameworks.has(fw))
    if (missing.length) {
      missingRecords.push({
        name: item.name,
        missing,
      })
    }

    const placeholderOnly = Array.from(placeholderFrameworks).filter(
      (fw) => !realFrameworks.has(fw)
    )
    if (placeholderOnly.length) {
      placeholderRecords.push({
        name: item.name,
        frameworks: placeholderOnly,
      })
    }

    if (item.type === 'registry:ui' && !realFrameworks.has('vue')) {
      missingVueUiRecords.push(item.name)
    }
  })

  if (!missingRecords.length && !placeholderRecords.length && !missingVueUiRecords.length) {
    console.log('✅ 所有核心组件均已具备真实实现，且 registry:ui 已完整覆盖 Vue。')
    return
  }

  if (missingRecords.length) {
    console.log('❗ 以下核心组件缺少多端实现：')
    missingRecords.forEach((record) => {
      console.log(`  - ${record.name}: ${record.missing.join(', ')}`)
    })
  }

  if (placeholderRecords.length) {
    console.log('\n⚠️  以下组件仍依赖 placeholder 内容：')
    placeholderRecords.forEach((record) => {
      console.log(`  - ${record.name}: ${record.frameworks.join(', ')}`)
    })
  }

  if (missingVueUiRecords.length) {
    console.log(`\n⚠️  registry:ui 缺少 Vue 实现的组件（${missingVueUiRecords.length}）：`)
    missingVueUiRecords.forEach((name) => {
      console.log(`  - ${name}`)
    })
  }
}

summarize()
