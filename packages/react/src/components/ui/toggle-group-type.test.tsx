// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { ToggleGroup, ToggleGroupItem } from './toggle-group'

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

const button = (name: string) =>
  [...document.querySelectorAll('[data-slot="toggle-group-item"]')].find((item) =>
    item.textContent?.includes(name)
  ) as HTMLButtonElement

const press = async (name: string) => {
  await act(async () => {
    button(name).click()
  })
}

const state = (name: string) => button(name).getAttribute('data-state')

const group = (type: 'single' | 'multiple') => (
  <ToggleGroup type={type}>
    <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
    <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  </ToggleGroup>
)

describe('toggle group type', () => {
  it('follows a later value and keeps a disabled group on its current item', async () => {
    function Harness() {
      const [value, setValue] = useState('bold')
      const [locked, setLocked] = useState('bold')
      return (
        <>
          <button type="button" onClick={() => setValue('italic')}>
            Next
          </button>
          <button type="button" onClick={() => setLocked('')}>
            Clear
          </button>
          <ToggleGroup type="single" value={value}>
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" disabled value={locked}>
            <ToggleGroupItem value="bold">Locked</ToggleGroupItem>
            <ToggleGroupItem value="italic">Other</ToggleGroupItem>
          </ToggleGroup>
        </>
      )
    }
    show(<Harness />)
    expect(state('Bold')).toBe('on')
    expect(state('Italic')).toBe('off')
    expect(state('Locked')).toBe('on')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Item 1 of 2',
      'Item 1 of 2',
    ])
    await press('Other')
    expect(state('Locked')).toBe('on')
    expect(state('Other')).toBe('off')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      click('Next')?.click()
      click('Clear')?.click()
    })
    expect(state('Bold')).toBe('off')
    expect(state('Italic')).toBe('on')
    expect(state('Locked')).toBe('off')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Item 2 of 2'])
  })

  it('keeps one item pressed when type is single', async () => {
    show(group('single'))
    await press('Bold')
    expect(state('Bold')).toBe('on')
    await press('Italic')
    expect(state('Italic')).toBe('on')
    expect(state('Bold')).toBe('off')
  })

  it('ignores a disabled item and a disabled group', async () => {
    show(
      <ToggleGroup type="single">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic" disabled>
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    )
    await press('Italic')
    expect(state('Italic')).toBe('off')
    expect(state('Bold')).toBe('off')
    expect(button('Italic').disabled).toBe(true)

    show(
      <ToggleGroup type="single" disabled>
        <ToggleGroupItem value="bold">Locked</ToggleGroupItem>
      </ToggleGroup>
    )
    await press('Locked')
    expect(state('Locked')).toBe('off')
  })

  it('keeps every pressed item when type is multiple', async () => {
    show(group('multiple'))
    await press('Bold')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 2')
    await press('Italic')
    expect(state('Bold')).toBe('on')
    expect(state('Italic')).toBe('on')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2 items pressed')
  })

  it('stays off when value is null even if the default is bold', async () => {
    const seen: Array<string | string[]> = []
    show(
      <ToggleGroup
        type="single"
        value={null}
        defaultValue="bold"
        onValueChange={(value) => seen.push(value)}
      >
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(state('Bold')).toBe('off')
    expect(state('Italic')).toBe('off')
    await press('Italic')
    expect(state('Bold')).toBe('off')
    expect(state('Italic')).toBe('off')
    expect(seen).toEqual(['italic'])
  })

  it('moves to the next enabled item with ArrowRight without pressing it', async () => {
    const real = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    }
    try {
      show(
        <ToggleGroup type="single">
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
          <ToggleGroupItem value="locked" disabled>
            Locked
          </ToggleGroupItem>
          <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        </ToggleGroup>
      )
      expect(document.querySelector('[data-slot="toggle-group"]')?.getAttribute('role')).toBe('radiogroup')
      const bold = button('Bold')
      await act(async () => {
        bold.focus()
      })
      const key = (target: HTMLElement, name: string) =>
        act(async () => {
          target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
        })
      await key(bold, 'ArrowRight')
      expect(document.activeElement).toBe(button('Italic'))
      expect(state('Bold')).toBe('off')
      expect(state('Locked')).toBe('off')
      expect(state('Italic')).toBe('off')
      expect(button('Bold').tabIndex).toBe(-1)
      expect(button('Italic').tabIndex).toBe(0)
      await key(button('Italic'), 'ArrowRight')
      expect(document.activeElement).toBe(button('Bold'))
      expect(state('Bold')).toBe('off')
    } finally {
      globalThis.requestAnimationFrame = real
    }
  })

  it('names an omitted group Toggle group and keeps a passed name', () => {
    show(
      <>
        <ToggleGroup type="single">
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" aria-label="Format">
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        </ToggleGroup>
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="toggle-group"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Toggle group', 'Format'])
  })
})
