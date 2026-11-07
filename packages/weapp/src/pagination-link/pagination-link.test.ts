import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('weapp pagination link', () => {
  it('marks only the current page', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'pagination-link.wxml'), 'utf8')
    expect(markup).toContain('wx:if="{{active}}"')
    expect(markup).toContain('aria-current="page"')
    expect(markup).not.toContain("aria-current=\"{{active ? 'page' : ''}}\"")
    expect(markup).toContain('<button wx:else')
  })
})
