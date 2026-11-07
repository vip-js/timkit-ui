// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Separator } from './separator'

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

describe('separator orientation', () => {
  it('is decorative by default and exposes a vertical separator when asked', () => {
    show(
      <>
        <Separator />
        <Separator orientation="vertical" decorative={false} />
      </>
    )
    const line = (index: number) => document.querySelectorAll('[data-slot="separator"]')[index] as HTMLElement
    expect(line(0).getAttribute('data-orientation')).toBe('horizontal')
    expect(line(0).getAttribute('role')).toBe('none')
    expect(line(0).hasAttribute('aria-orientation')).toBe(false)
    expect(line(1).getAttribute('data-orientation')).toBe('vertical')
    expect(line(1).getAttribute('role')).toBe('separator')
    expect(line(1).getAttribute('aria-orientation')).toBe('vertical')
  })
})
