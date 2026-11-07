// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Button } from './button'

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

describe('button loading', () => {
  it('ignores a press while loading and sets aria-busy', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => {
      root.render(
        <>
          <Button loading onPress={() => seen.push('loading')}>
            Save
          </Button>
          <Button disabled onPress={() => seen.push('disabled')}>
            Hold
          </Button>
          <Button onPress={() => seen.push('ready')}>Go</Button>
        </>
      )
    })
    mounted.push({ root, host })
    const buttons = () => host.querySelectorAll('button')
    expect(buttons()[0]?.getAttribute('aria-busy')).toBe('true')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Loading')
    expect(buttons()[0]?.hasAttribute('disabled')).toBe(true)
    expect(buttons()[1]?.hasAttribute('disabled')).toBe(true)
    await act(async () => {
      buttons()[0]?.click()
      buttons()[1]?.click()
      buttons()[2]?.click()
    })
    expect(seen).toEqual(['ready'])
  })

  it('uses type button unless a type is passed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => {
      root.render(
        <>
          <Button>Go</Button>
          <Button type="submit">Save</Button>
        </>
      )
    })
    mounted.push({ root, host })
    const buttons = host.querySelectorAll('button')
    expect(buttons[0]?.getAttribute('type')).toBe('button')
    expect(buttons[1]?.getAttribute('type')).toBe('submit')
  })
})
