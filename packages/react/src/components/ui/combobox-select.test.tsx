// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxLabel } from './combobox'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}
Element.prototype.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

const pear = { label: 'Pear', value: 'pear' }
const apple = { label: 'Apple', value: 'apple', disabled: true }
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

const typeQuery = async (text: string) => {
  const input = document.querySelector('[data-slot="combobox"] input') as HTMLInputElement
  input.value = text
  const key = Object.keys(input).find((name) => name.startsWith('__reactProps'))
  const props = key
    ? (input as unknown as Record<string, Record<string, (event: object) => void>>)[key]
    : undefined
  const change = props?.onChange ?? props?.onInput
  if (!change) throw new Error(`missing combobox input handlers: ${Object.keys(props ?? {}).sort().join(',')}`)
  await act(async () => {
    change({ currentTarget: input, target: input, value: text })
    await Promise.resolve()
  })
}

const plainApple = { label: 'Apple', value: 'apple' }

describe('combobox selection', () => {
  it('follows a later value', async () => {
    function Harness() {
      const [value, setValue] = useState(['apple'])
      return (
        <>
          <button type="button" onClick={() => setValue(['pear'])}>
            Replace
          </button>
          <Combobox items={[plainApple, pear]} value={value}>
            <ComboboxInput />
          </Combobox>
        </>
      )
    }
    show(<Harness />)
    const input = () => document.querySelector('[data-slot="combobox"] input') as HTMLInputElement
    expect(input().getAttribute('aria-label')).toBe('Choose an item')
    expect(input().value).toMatch(/apple/i)
    const replace = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Replace')
    await act(async () => {
      replace?.click()
      await Promise.resolve()
    })
    expect(input().value).toMatch(/pear/i)
    expect(input().value).not.toMatch(/apple/i)
  })

  it('selects an enabled item and ignores a disabled item or a disabled field', async () => {
    const seen: string[][] = []
    show(
      <>
        <Combobox
          items={[pear, apple]}
          onValueChange={(event) => seen.push(event.detail.value)}
        >
          <ComboboxInput />
          <ComboboxContent>
            <ComboboxItem item={pear}>Pear</ComboboxItem>
            <ComboboxItem item={apple}>Apple</ComboboxItem>
          </ComboboxContent>
        </Combobox>
        <Combobox disabled items={[pear]}>
          <ComboboxInput />
          <ComboboxContent>
            <ComboboxItem item={pear}>Locked</ComboboxItem>
          </ComboboxContent>
        </Combobox>
      </>
    )
    await press('ArrowDown')
    expect(document.body.textContent).toContain('Pear')
    await press('Enter')
    expect(seen).toEqual([['pear']])
    await press('ArrowDown')
    await press('Enter')
    expect(seen.flat()).not.toContain('apple')
    const inputs = document.querySelectorAll('input')
    await act(async () => {
      ;(inputs[1] as HTMLInputElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    })
    expect(document.body.textContent).not.toContain('Locked')
  })

  it('ignores selection while read-only', async () => {
    const seen: string[][] = []
    show(
      <Combobox readOnly items={[pear]} onValueChange={(event) => seen.push(event.detail.value)}>
        <ComboboxInput />
        <ComboboxContent>
          <ComboboxItem item={pear}>Pear</ComboboxItem>
        </ComboboxContent>
      </Combobox>
    )
    await press('ArrowDown')
    await press('Enter')
    const input = document.querySelector('[data-slot="combobox"] input') as HTMLInputElement
    expect(input.value).not.toMatch(/pear/i)
    expect(seen).toEqual([])
  })

  it('stays empty when value is null even if the default is pear', async () => {
    const seen: string[][] = []
    show(
      <Combobox
        items={[pear]}
        value={null as unknown as string[]}
        defaultValue={['pear']}
        onValueChange={(event) => seen.push(event.detail.value)}
      >
        <ComboboxInput />
        <ComboboxContent>
          <ComboboxItem item={pear}>Pear</ComboboxItem>
        </ComboboxContent>
      </Combobox>
    )
    const input = () => document.querySelector('[data-slot="combobox"] input') as HTMLInputElement
    expect(input().value).not.toMatch(/pear/i)
    await press('ArrowDown')
    await press('Enter')
    expect(input().value).not.toMatch(/pear/i)
    expect(seen).toEqual([['pear']])
  })

  it('filters the list and shows the empty state when nothing matches', async () => {
    const seen: string[][] = []
    show(
      <Combobox items={[plainApple, pear]} onValueChange={(event) => seen.push(event.detail.value)}>
        <ComboboxInput />
        <ComboboxContent>
          <ComboboxItem item={plainApple}>Apple</ComboboxItem>
          <ComboboxItem item={pear}>Pear</ComboboxItem>
          <ComboboxEmpty>No results</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    )
    await press('ArrowDown')
    expect(document.body.textContent).toContain('Apple')
    expect(document.body.textContent).toContain('Pear')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await typeQuery('pea')
    expect(document.body.textContent).toContain('Pear')
    expect(document.body.textContent).not.toContain('Apple')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await press('ArrowDown')
    await press('Enter')
    expect(seen).toEqual([['pear']])
    await typeQuery('zzz')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('No results')
    expect(document.body.textContent).not.toContain('Apple')
    expect(document.body.textContent).not.toContain('Pear')
  })

  it('uses the visible label instead of the fallback name', async () => {
    show(
      <Combobox items={[plainApple]}>
        <ComboboxLabel>Fruit</ComboboxLabel>
        <ComboboxInput />
      </Combobox>
    )
    await act(async () => {})
    const input = document.querySelector('[data-slot="combobox"] input') as HTMLInputElement
    const label = document.querySelector('label') as HTMLLabelElement
    expect(label.textContent).toBe('Fruit')
    expect(label.htmlFor).toBe(input.id)
    expect(input.getAttribute('aria-label')).toBeNull()
  })

  it('jumps to the first and last enabled item with Home and End without selecting them', async () => {
    const plum = { label: 'Plum', value: 'plum' }
    show(
      <>
        <Combobox items={[apple, pear, plum]}>
          <ComboboxInput />
          <ComboboxContent>
            <ComboboxItem item={apple}>Apple</ComboboxItem>
            <ComboboxItem item={pear}>Pear</ComboboxItem>
            <ComboboxItem item={plum}>Plum</ComboboxItem>
          </ComboboxContent>
        </Combobox>
        <Combobox items={[apple, pear, plum]} readOnly>
          <ComboboxInput />
          <ComboboxContent>
            <ComboboxItem item={pear}>Pear</ComboboxItem>
          </ComboboxContent>
        </Combobox>
      </>
    )
    const highlighted = () => document.querySelector('[data-highlighted]')?.textContent ?? ''
    const input = () => document.querySelectorAll('[data-slot="combobox"] input')[0] as HTMLInputElement
    await press('ArrowDown')
    await press('End')
    expect(highlighted()).toContain('Plum')
    await press('Home')
    expect(highlighted()).toContain('Pear')
    expect(highlighted()).not.toContain('Apple')
    expect(input().value).toBe('')
    const frozen = document.querySelectorAll('[data-slot="combobox"] input')[1] as HTMLInputElement
    await act(async () => {
      frozen.focus()
      frozen.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    })
    expect(frozen.getAttribute('aria-expanded')).not.toBe('true')
    expect(frozen.value).toBe('')
  })
})
