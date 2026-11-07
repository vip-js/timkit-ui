import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('weapp card title', () => {
  it('exposes a level 3 heading', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'card-title.wxml'), 'utf8')
    expect(markup).toContain('role="heading"')
    expect(markup).toContain('aria-level="3"')
  })
})
