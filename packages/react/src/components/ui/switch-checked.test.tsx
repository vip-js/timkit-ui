// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Switch } from './switch'

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

const checked = (index: number) =>
  document.querySelectorAll('[data-slot="switch"]')[index]?.getAttribute('data-state')

describe('switch checked', () => {
  it('follows a later checked value and keeps a disabled switch still', async () => {
    function Harness() {
      const [on, setOn] = useState(false)
      const [locked, setLocked] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOn(true)}>
            On
          </button>
          <button type="button" onClick={() => setLocked(true)}>
            Lock
          </button>
          <Switch checked={on} />
          <Switch disabled checked={locked} />
        </>
      )
    }
    show(<Harness />)
    expect(checked(0)).toBe('unchecked')
    expect(checked(1)).toBe('unchecked')
    const buttons = () => document.querySelectorAll('[data-slot="switch"]')
    await act(async () => {
      ;(buttons()[1] as HTMLButtonElement).click()
    })
    expect(checked(1)).toBe('unchecked')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      click('On')?.click()
      click('Lock')?.click()
    })
    expect(checked(0)).toBe('checked')
    expect(checked(1)).toBe('checked')
  })

  it('turns on, turns off, and stays off while disabled', async () => {
    const seen: boolean[] = []
    show(
      <>
        <Switch onCheckedChange={(event) => seen.push(event.detail.checked)} />
        <Switch disabled />
      </>
    )
    const buttons = () => document.querySelectorAll('[data-slot="switch"]')
    expect(checked(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      ;(buttons()[0] as HTMLButtonElement).click()
    })
    expect(checked(0)).toBe('checked')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('On')
    await act(async () => {
      ;(buttons()[0] as HTMLButtonElement).click()
    })
    expect(checked(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      ;(buttons()[1] as HTMLButtonElement).click()
    })
    expect(checked(1)).toBe('unchecked')
    expect(seen).toEqual([true, false])
  })

  it('stays off while read-only', async () => {
    const seen: boolean[] = []
    show(
      <Switch
        readOnly
        checked={false}
        onCheckedChange={(event) => seen.push(event.detail.checked)}
      />
    )
    const button = document.querySelector('[data-slot="switch"]') as HTMLButtonElement
    await act(async () => {
      button.click()
    })
    expect(button.getAttribute('data-state')).toBe('unchecked')
    expect(seen).toEqual([])
  })

  it('stays off when checked is null even if the default is on', async () => {
    const seen: boolean[] = []
    show(
      <Switch
        checked={null as unknown as boolean}
        defaultChecked
        onCheckedChange={(event) => seen.push(event.detail.checked)}
      />
    )
    const button = document.querySelector('[data-slot="switch"]') as HTMLButtonElement
    expect(checked(0)).toBe('unchecked')
    await act(async () => {
      button.click()
    })
    expect(checked(0)).toBe('unchecked')
    expect(seen).toEqual([true])
  })

  it('announces a required switch and leaves an omitted switch optional', () => {
    show(
      <>
        <Switch required aria-label="Need" />
        <Switch aria-label="Optional" />
      </>
    )
    const inputs = document.querySelectorAll('input')
    expect(inputs[0]?.required).toBe(true)
    expect(inputs[1]?.required).toBe(false)
    expect(inputs[0]?.getAttribute('aria-label')).toBe('Need')
  })

  it('names an omitted switch Switch', () => {
    show(<Switch />)
    expect(document.querySelector('input')?.getAttribute('aria-label')).toBe('Switch')
  })
})
