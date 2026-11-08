// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Checkbox } from './checkbox'

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

const state = (index: number) =>
  document.querySelectorAll('[data-slot="checkbox"]')[index]?.getAttribute('data-state')

describe('checkbox checked', () => {
  it('checks, clears, and stays clear while disabled', async () => {
    const seen: boolean[] = []
    show(
      <>
        <Checkbox onCheckedChange={(event) => seen.push(event.detail.checked === true)} />
        <Checkbox disabled />
      </>
    )
    const boxes = () => document.querySelectorAll('[data-slot="checkbox"]')
    expect(state(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      ;(boxes()[0] as HTMLButtonElement).click()
    })
    expect(state(0)).toBe('checked')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Checked')
    await act(async () => {
      ;(boxes()[0] as HTMLButtonElement).click()
    })
    expect(state(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      ;(boxes()[1] as HTMLButtonElement).click()
    })
    expect(state(1)).toBe('unchecked')
    expect(seen).toEqual([true, false])
  })

  it('stays clear while read-only', async () => {
    const seen: boolean[] = []
    show(
      <Checkbox readOnly checked={false} onCheckedChange={(event) => seen.push(event.detail.checked === true)} />
    )
    const box = document.querySelector('[data-slot="checkbox"]') as HTMLButtonElement
    await act(async () => {
      box.click()
    })
    expect(state(0)).toBe('unchecked')
    expect(seen).toEqual([])
  })

  it('stays clear when checked is null even if the default is on', async () => {
    const seen: boolean[] = []
    show(
      <Checkbox
        checked={null as unknown as boolean}
        defaultChecked
        onCheckedChange={(event) => seen.push(event.detail.checked === true)}
      />
    )
    const box = document.querySelector('[data-slot="checkbox"]') as HTMLButtonElement
    expect(state(0)).toBe('unchecked')
    await act(async () => {
      box.click()
    })
    expect(state(0)).toBe('unchecked')
    expect(seen).toEqual([true])
  })

  it('announces indeterminate as mixed and follows a later mixed value', async () => {
    const Harness = () => {
      const [checked, setChecked] = useState<boolean | 'indeterminate'>(false)
      return (
        <>
          <Checkbox checked={checked} />
          <button type="button" onClick={() => setChecked('indeterminate')}>
            Mix
          </button>
        </>
      )
    }
    show(<Harness />)
    const input = () => document.querySelector('input')
    expect(state(0)).toBe('unchecked')
    expect(input()?.getAttribute('aria-checked')).toBeNull()
    await act(async () => {
      const mix = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Mix')
      mix?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(state(0)).toBe('indeterminate')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Mixed')
    expect(input()?.getAttribute('aria-checked')).toBe('mixed')
  })

  it('announces a required checkbox and leaves an omitted checkbox optional', () => {
    show(
      <>
        <Checkbox required aria-label="Need" />
        <Checkbox aria-label="Optional" />
      </>
    )
    const inputs = document.querySelectorAll('input')
    expect(inputs[0]?.required).toBe(true)
    expect(inputs[1]?.required).toBe(false)
    expect(inputs[0]?.getAttribute('aria-label')).toBe('Need')
  })

  it('names an omitted checkbox Checkbox', () => {
    show(<Checkbox />)
    expect(document.querySelector('input')?.getAttribute('aria-label')).toBe('Checkbox')
  })
})
