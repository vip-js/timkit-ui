import fs from 'fs'
import path from 'path'

import { buttonVariants } from '../packages/core/src/components/button/variants'
import { cn, createTimEvent, formatDate } from '../packages/core/src/shared/utils'

const ROOT = path.resolve(__dirname, '..')

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const assertFileContains = (filePath: string, fragment: string, checkName: string) => {
  const source = fs.readFileSync(filePath, 'utf-8')
  assert(source.includes(fragment), `${checkName} failed: missing "${fragment}" in ${filePath}`)
}

const runCoreBehaviorSmoke = () => {
  const event = createTimEvent('select.change', 'city', { value: 'hangzhou' })
  assert(event.type === 'select.change', 'createTimEvent should keep event type')
  assert(event.target.id === 'city', 'createTimEvent should keep target id')
  assert(event.detail.value === 'hangzhou', 'createTimEvent should keep detail payload')
  assert(typeof event.timestamp === 'number', 'createTimEvent should include timestamp')

  assert(cn('px-2 py-1', 'px-4') === 'py-1 px-4', 'cn should merge utility classes')

  const formatted = formatDate(new Date(2026, 1, 14, 10, 30, 0).getTime())
  assert(formatted.includes('2026'), 'formatDate should include year')

  const buttonClass = buttonVariants()
  assert(buttonClass.includes('bg-primary'), 'buttonVariants should return default classes')
  assert(
    buttonVariants({ size: 'sm' }).includes('h-8'),
    'buttonVariants should support size variant'
  )
}

const runSchemaSourceSmoke = () => {
  const schemaRules: Array<{ name: string; provider: 'zag' | 'none' }> = [
    { name: 'button', provider: 'none' },
    { name: 'input', provider: 'none' },
    { name: 'dialog', provider: 'zag' },
    { name: 'select', provider: 'zag' },
  ]

  schemaRules.forEach(({ name, provider }) => {
    const schemaPath = path.join(ROOT, 'packages/core/src/components', name, 'schema.ts')
    assertFileContains(
      schemaPath,
      "supportedPlatforms: ['web', 'wechat']",
      `${name} platform support`
    )
    assertFileContains(schemaPath, 'isRoot: true', `${name} root part`)
    assertFileContains(schemaPath, `provider: '${provider}'`, `${name} provider`)
  })

  const machineRules = [
    { name: 'dialog', exportName: 'dialogMachine' },
    { name: 'select', exportName: 'selectMachine' },
  ]

  machineRules.forEach(({ name, exportName }) => {
    const machinePath = path.join(ROOT, 'packages/core/src/components', name, 'machine.ts')
    assertFileContains(machinePath, `machine as ${exportName}`, `${name} machine export`)
  })
}

const main = () => {
  console.log('Core behavior smoke: START')
  runCoreBehaviorSmoke()
  runSchemaSourceSmoke()
  console.log('Core behavior smoke: PASS')
}

main()
