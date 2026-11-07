// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Badge } from './badge'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(node))
  mounted.push({ root, host })
}

describe('badge variant', () => {
  it('marks the default and destructive badges', () => {
    show(
      <>
        <Badge>New</Badge>
        <Badge variant="destructive">Failed</Badge>
      </>
    )
    const badge = (index: number) => document.querySelectorAll('[data-slot="badge"]')[index] as HTMLElement
    expect(badge(0).getAttribute('data-variant')).toBe('default')
    expect(badge(0).className).toContain('bg-primary')
    expect(badge(0).querySelector('[role="status"]')).toBeNull()
    expect(badge(1).getAttribute('data-variant')).toBe('destructive')
    expect(badge(1).querySelector('[role="status"]')?.textContent).toBe('Destructive')
    expect(badge(1).className).toContain('bg-destructive')
  })
})
