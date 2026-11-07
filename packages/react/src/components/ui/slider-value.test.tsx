// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Slider } from './slider'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

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

const press = async (thumb: Element, key: string, shiftKey = false) => {
  const node = thumb as HTMLElement & { [key: string]: { onFocus?: (event: Event) => void; onKeyDown?: (event: KeyboardEvent) => void } }
  const propsKey = Object.keys(node).find((name) => name.startsWith('__reactProps'))
  const props = propsKey ? node[propsKey] : undefined
  await act(async () => {
    node.focus()
    props?.onFocus?.(new FocusEvent('focus'))
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, shiftKey })
    props?.onKeyDown?.(event)
  })
}

describe('slider value', () => {
  it('follows a later value and keeps a disabled thumb still', async () => {
    function Harness() {
      const [value, setValue] = useState([10])
      const [locked, setLocked] = useState([10])
      return (
        <>
          <button type="button" onClick={() => setValue([70])}>
            Jump
          </button>
          <button type="button" onClick={() => setLocked([40])}>
            Lock
          </button>
          <Slider value={value} />
          <Slider disabled value={locked} />
        </>
      )
    }
    show(<Harness />)
    const thumbs = () => document.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs()[0]?.getAttribute('aria-label')).toBe('Value')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('10')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('10')
    await press(thumbs()[1] as Element, 'ArrowRight')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('10')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      click('Jump')?.click()
      click('Lock')?.click()
    })
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('70')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('40')
  })

  it('moves with the arrow keys and stays put while disabled', async () => {
    const seen: number[][] = []
    show(
      <>
        <Slider defaultValue={[20]} onValueChange={(event) => seen.push(event.detail.value)} />
        <Slider disabled defaultValue={[20]} />
      </>
    )
    const thumbs = document.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs[0] as Element, 'ArrowRight')
    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('21')
    expect(document.querySelector('[data-slot="slider-value"]')?.textContent).toBe('21')
    await press(thumbs[0] as Element, 'ArrowLeft')
    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs[1] as Element, 'ArrowRight')
    expect(thumbs[1]?.getAttribute('aria-valuenow')).toBe('20')
    expect(seen).toEqual([[21], [20]])
  })

  it('reads both thumbs', () => {
    show(<Slider defaultValue={[20, 40]} />)
    expect(document.querySelector('[data-slot="slider-value"]')?.textContent).toBe('20 to 40')
  })

  it('stays empty when value is null even if the default is 20', async () => {
    show(
      <Slider value={null as unknown as number[]} defaultValue={[20]} />
    )
    const thumb = () => document.querySelector('[data-slot="slider-thumb"]')
    const shown = thumb()?.getAttribute('aria-valuenow')
    expect(shown == null || shown === '').toBe(true)
    if (thumb()) await press(thumb() as Element, 'ArrowRight')
    const after = thumb()?.getAttribute('aria-valuenow')
    expect(after == null || after === '').toBe(true)
    expect(after).not.toBe('20')
  })

  it('moves with Up when the slider is vertical and ignores Right', async () => {
    show(
      <>
        <Slider defaultValue={[20]} />
        <Slider orientation="vertical" defaultValue={[20]} />
      </>
    )
    const thumbs = () => document.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs()[0]?.getAttribute('aria-orientation')).toBe('horizontal')
    await press(thumbs()[0] as Element, 'ArrowUp')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[0] as Element, 'ArrowRight')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('21')
    expect(thumbs()[1]?.getAttribute('aria-orientation')).toBe('vertical')
    await press(thumbs()[1] as Element, 'ArrowRight')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[1] as Element, 'ArrowUp')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('21')
  })

  it('keeps the value inside a later min and max', async () => {
    function Harness() {
      const [max, setMax] = useState(100)
      const [min, setMin] = useState(0)
      return (
        <>
          <button type="button" onClick={() => setMax(40)}>
            Cap
          </button>
          <button type="button" onClick={() => setMin(30)}>
            Floor
          </button>
          <Slider defaultValue={[80]} max={max} />
          <Slider defaultValue={[10]} min={min} />
        </>
      )
    }
    show(<Harness />)
    const thumbs = () => document.querySelectorAll('[data-slot="slider-thumb"]')
    const click = async (label: string) => {
      const button = [...document.querySelectorAll('button')].find((item) => item.textContent === label)
      await act(async () => {
        button?.click()
      })
    }
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('80')
    await click('Cap')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('40')
    expect(thumbs()[0]?.getAttribute('aria-valuemax')).toBe('40')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('10')
    await click('Floor')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    expect(thumbs()[1]?.getAttribute('aria-valuemin')).toBe('30')
  })

  it('jumps to the minimum with Home and the maximum with End', async () => {
    show(
      <>
        <Slider defaultValue={[20]} />
        <Slider disabled defaultValue={[20]} />
        <Slider readOnly defaultValue={[20]} />
      </>
    )
    const thumbs = () => document.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[0] as Element, 'Home')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('0')
    await press(thumbs()[0] as Element, 'End')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('100')
    await press(thumbs()[1] as Element, 'Home')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[2] as Element, 'End')
    expect(thumbs()[2]?.getAttribute('aria-valuenow')).toBe('20')
  })

  it('moves by ten steps with PageUp and PageDown', async () => {
    show(
      <>
        <Slider defaultValue={[20]} />
        <Slider orientation="vertical" defaultValue={[20]} />
        <Slider defaultValue={[95]} />
        <Slider disabled defaultValue={[20]} />
        <Slider readOnly defaultValue={[20]} />
      </>
    )
    const thumbs = () => document.querySelectorAll('[data-slot="slider-thumb"]')
    await press(thumbs()[0] as Element, 'PageUp')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[0] as Element, 'PageDown')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[1] as Element, 'PageUp')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[2] as Element, 'PageUp')
    expect(thumbs()[2]?.getAttribute('aria-valuenow')).toBe('100')
    await press(thumbs()[3] as Element, 'PageUp')
    expect(thumbs()[3]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[4] as Element, 'PageDown')
    expect(thumbs()[4]?.getAttribute('aria-valuenow')).toBe('20')
  })

  it('moves by ten steps when Shift is held with an arrow', async () => {
    show(
      <>
        <Slider defaultValue={[20]} />
        <Slider orientation="vertical" defaultValue={[20]} />
        <Slider defaultValue={[95]} />
        <Slider disabled defaultValue={[20]} />
        <Slider readOnly defaultValue={[20]} />
      </>
    )
    const thumbs = () => document.querySelectorAll('[data-slot="slider-thumb"]')
    await press(thumbs()[0] as Element, 'ArrowRight', true)
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[0] as Element, 'ArrowUp', true)
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[1] as Element, 'ArrowUp', true)
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[1] as Element, 'ArrowRight', true)
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[2] as Element, 'ArrowRight', true)
    expect(thumbs()[2]?.getAttribute('aria-valuenow')).toBe('100')
    await press(thumbs()[3] as Element, 'ArrowRight', true)
    expect(thumbs()[3]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[4] as Element, 'ArrowLeft', true)
    expect(thumbs()[4]?.getAttribute('aria-valuenow')).toBe('20')
  })
})
