// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from './combobox'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}
Element.prototype.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

const apple = { label: 'Apple', value: 'apple' }
const pear = { label: 'Pear', value: 'pear' }
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

const press = async (key: string) => {
  const input = document.querySelector('[data-slot="combobox"] input') as HTMLInputElement
  input.focus()
  await act(async () => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  })
}

const highlighted = () => document.querySelector('[data-highlighted="true"]')?.textContent ?? ''

const field = (loop?: boolean) => (
  <Combobox loop={loop} items={[apple, pear]}>
    <ComboboxInput />
    <ComboboxContent>
      <ComboboxItem item={apple}>Apple</ComboboxItem>
      <ComboboxItem item={pear}>Pear</ComboboxItem>
    </ComboboxContent>
  </Combobox>
)

describe('combobox loop', () => {
  it('wraps from the first item to the last by default', async () => {
    show(field())
    await press('ArrowDown')
    expect(highlighted()).toContain('Apple')
    await press('ArrowUp')
    expect(highlighted()).toContain('Pear')
  })

  it('stays on the first item when loop is off', async () => {
    show(field(false))
    await press('ArrowDown')
    expect(highlighted()).toContain('Apple')
    await press('ArrowUp')
    expect(highlighted()).toContain('Apple')
    expect(highlighted()).not.toContain('Pear')
  })
})
