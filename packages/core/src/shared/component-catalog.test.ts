import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { componentNames } from './component-names'
import { ucsRegistry } from './registry'

const root = path.resolve(__dirname, '../../../..')

describe('component catalog', () => {
  it.each(componentNames)('%s has a schema, a Vue source, and a WeApp source', (name) => {
    const schema = ucsRegistry[name]
    expect(schema, name).toBeTruthy()
    const props = schema?.props ?? []
    const parts = schema?.parts ?? []
    expect(props.length + parts.length).toBeGreaterThan(0)
    expect(new Set(props.map((prop) => prop.name)).size).toBe(props.length)
    expect(fs.existsSync(path.join(root, 'packages/vue/src/components/ui', name))).toBe(true)
    expect(fs.existsSync(path.join(root, 'packages/weapp/src', name))).toBe(true)
  })
})
