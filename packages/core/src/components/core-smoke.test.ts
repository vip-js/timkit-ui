import { describe, expect, it } from 'vitest'

import { buttonVariants } from './button'
import buttonSchema from './button/schema'
import { dialogMachine } from './dialog/machine'
import dialogSchema from './dialog/schema'
import inputSchema from './input/schema'
import { selectMachine } from './select/machine'
import selectSchema from './select/schema'

describe('core component smoke', () => {
  it('button variants expose default and size variants', () => {
    const classes = buttonVariants()
    expect(classes).toContain('bg-primary')
    expect(buttonVariants({ size: 'sm' })).toContain('h-8')
  })

  it('key schemas cover web and wechat with root part', () => {
    const schemas = [buttonSchema, inputSchema, dialogSchema, selectSchema]
    schemas.forEach((schema) => {
      expect(schema.supportedPlatforms).toContain('web')
      expect(schema.supportedPlatforms).toContain('wechat')
      expect(schema.parts.some((part) => part.isRoot === true)).toBe(true)
    })
  })

  it('zag machine exports are defined as objects', () => {
    expect(typeof dialogMachine).toBe('object')
    expect(typeof selectMachine).toBe('object')
  })
})
