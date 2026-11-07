// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Toggle } from './toggle'

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

describe('toggle pressed', () => {
  it('follows a later pressed value and ignores a disabled toggle', async () => {
    function Harness() {
      const [pressed, setPressed] = useState(false)
      const [locked, setLocked] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setPressed(true)}>
            On
          </button>
          <button type="button" onClick={() => setLocked(true)}>
            Unlock
          </button>
          <Toggle pressed={pressed}>Bold</Toggle>
          <Toggle disabled pressed={locked}>
            Locked
          </Toggle>
        </>
      )
    }
    show(<Harness />)
    const toggle = (index: number) => document.querySelectorAll('[data-slot="toggle"]')[index] as HTMLButtonElement
    expect(toggle(0).getAttribute('data-state')).toBe('off')
    expect(toggle(1).getAttribute('data-state')).toBe('off')
    await act(async () => {
      toggle(1).click()
    })
    expect(toggle(1).getAttribute('data-state')).toBe('off')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('On')?.click()
      press('Unlock')?.click()
    })
    expect(toggle(0).getAttribute('data-state')).toBe('on')
    expect(toggle(1).getAttribute('data-state')).toBe('on')
  })

  it('turns on and off, and ignores a disabled toggle', async () => {
    const seen: boolean[] = []
    show(
      <>
        <Toggle onPressedChange={(pressed) => seen.push(pressed)}>Bold</Toggle>
        <Toggle disabled>Locked</Toggle>
      </>
    )
    const toggle = (index: number) => document.querySelectorAll('[data-slot="toggle"]')[index] as HTMLButtonElement
    expect(toggle(0).getAttribute('data-state')).toBe('off')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      toggle(0).click()
      await Promise.resolve()
    })
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Pressed')
    expect(toggle(0).getAttribute('aria-pressed')).toBe('true')
    expect(toggle(0).getAttribute('data-state')).toBe('on')
    expect(seen).toEqual([true])
    await act(async () => {
      toggle(0).click()
      await Promise.resolve()
    })
    expect(toggle(0).getAttribute('data-state')).toBe('off')
    expect(document.querySelector('[role="status"]')).toBeNull()
    expect(seen).toEqual([true, false])
    await act(async () => {
      toggle(1).click()
      await Promise.resolve()
    })
    expect(toggle(1).disabled).toBe(true)
    expect(toggle(1).getAttribute('data-state')).toBe('off')
  })

  it('stays off when pressed is null even if the default is on', async () => {
    const seen: boolean[] = []
    show(
      <Toggle
        pressed={null}
        defaultPressed
        onPressedChange={(pressed) => seen.push(pressed)}
      >
        Bold
      </Toggle>
    )
    const toggle = document.querySelector('[data-slot="toggle"]') as HTMLButtonElement
    expect(toggle.getAttribute('data-state')).toBe('off')
    await act(async () => {
      toggle.click()
      await Promise.resolve()
    })
    expect(toggle.getAttribute('data-state')).toBe('off')
    expect(seen).toEqual([true])
  })
})
