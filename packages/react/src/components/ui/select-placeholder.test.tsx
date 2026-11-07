// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Select, SelectTrigger, SelectValue } from './select'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}

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

describe('select placeholder', () => {
  it('shows the placeholder from the select root when nothing is selected', () => {
    show(
      <Select placeholder="Choose a fruit">
        <SelectValue />
      </Select>
    )
    expect(document.body.textContent).toContain('Choose a fruit')
  })

  it('lets the value placeholder override the root', () => {
    show(
      <Select placeholder="Choose a fruit">
        <SelectValue placeholder="Pick one" />
      </Select>
    )
    expect(document.body.textContent).toContain('Pick one')
    expect(document.body.textContent).not.toContain('Choose a fruit')
  })

  it('announces a required select and leaves an omitted select optional', () => {
    show(
      <Select required>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    expect(document.querySelector('[role="combobox"]')?.getAttribute('aria-required')).toBe('true')
  })
})
