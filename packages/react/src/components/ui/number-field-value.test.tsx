// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { NumberField, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from './number-field'

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

const press = async (selector: string) => {
  const node = document.querySelector(selector) as (HTMLElement & Record<string, { onPointerDown?: (event: PointerEvent) => void }>) | null
  if (!node) throw new Error(`missing ${selector}`)
  const propsKey = Object.keys(node).find((key) => key.startsWith('__reactProps'))
  const down = new PointerEvent('pointerdown', { bubbles: true, button: 0, buttons: 1, pointerType: 'mouse' })
  const up = new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' })
  await act(async () => {
    node.dispatchEvent(down)
    propsKey ? node[propsKey]?.onPointerDown?.(down) : undefined
    node.dispatchEvent(up)
    await Promise.resolve()
  })
}

const valueOf = (input: HTMLInputElement) => input.getAttribute('aria-valuenow') ?? input.getAttribute('value') ?? ''

const Field = ({ disabled = false }: { disabled?: boolean }) => (
  <NumberField defaultValue={1} spinOnPress={false} disabled={disabled}>
    <NumberFieldDecrement>-</NumberFieldDecrement>
    <NumberFieldInput />
    <NumberFieldIncrement>+</NumberFieldIncrement>
  </NumberField>
)

describe('number field value', () => {
  it('follows a later value and ignores a disabled step', async () => {
    function Harness() {
      const [value, setValue] = useState(1)
      return (
        <>
          <button type="button" onClick={() => setValue(4)}>
            Four
          </button>
          <button type="button" onClick={() => setValue(0)}>
            Zero
          </button>
          <NumberField value={value} spinOnPress={false} disabled>
            <NumberFieldDecrement>-</NumberFieldDecrement>
            <NumberFieldInput />
            <NumberFieldIncrement>+</NumberFieldIncrement>
          </NumberField>
        </>
      )
    }
    show(<Harness />)
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    expect(input().getAttribute('aria-label')).toBe('Number')
    expect(valueOf(input())).toBe('1')
    expect(document.querySelector('[data-slot="number-field"] [role="status"]')?.textContent).toBe('1')
    await press('[data-slot="number-field-increment"]')
    expect(valueOf(input())).toBe('1')
    const button = (label: string) =>
      [...document.querySelectorAll('button')].find((node) => node.textContent === label)
    await act(async () => {
      button('Four')?.click()
    })
    expect(valueOf(input())).toBe('4')
    expect(document.querySelector('[data-slot="number-field"] [role="status"]')?.textContent).toBe('4')
    await act(async () => {
      button('Zero')?.click()
    })
    expect(valueOf(input())).toBe('0')
    expect(document.querySelector('[data-slot="number-field"] [role="status"]')?.textContent).toBe('0')
  })

  it('steps the value and ignores a disabled field', async () => {
    show(<Field />)
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    expect(valueOf(input())).toBe('1')
    await press('[data-slot="number-field-increment"]')
    expect(valueOf(input())).toBe('2')
    await press('[data-slot="number-field-decrement"]')
    expect(valueOf(input())).toBe('1')

    document.body.innerHTML = ''
    show(<Field disabled />)
    const disabledInput = document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    const increment = document.querySelector('[data-slot="number-field-increment"]') as HTMLButtonElement
    expect(disabledInput.disabled).toBe(true)
    expect(increment.disabled).toBe(true)
    await press('[data-slot="number-field-increment"]')
    expect(valueOf(disabledInput)).toBe('1')
  })

  it('steps from the input with ArrowUp and ArrowDown', async () => {
    show(
      <NumberField defaultValue={1} spinOnPress={false}>
        <NumberFieldDecrement>-</NumberFieldDecrement>
        <NumberFieldInput />
        <NumberFieldIncrement>+</NumberFieldIncrement>
      </NumberField>
    )
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    const key = async (name: string) => {
      await act(async () => {
        input().focus()
        input().dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
      })
    }
    await key('ArrowUp')
    expect(valueOf(input())).toBe('2')
    await key('ArrowDown')
    expect(valueOf(input())).toBe('1')
    show(
      <NumberField defaultValue={1} spinOnPress={false} readOnly>
        <NumberFieldInput />
      </NumberField>
    )
    const locked = document.querySelectorAll('[data-slot="number-field-input"]')[1] as HTMLInputElement
    await act(async () => {
      locked.focus()
      locked.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    })
    expect(valueOf(locked)).toBe('1')
  })

  it('moves by ten steps with PageUp, PageDown, and Shift plus an arrow', async () => {
    show(
      <>
        <NumberField defaultValue={20} spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
        <NumberField defaultValue={95} max={100} spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
        <NumberField defaultValue={20} disabled spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
        <NumberField defaultValue={20} readOnly spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
      </>
    )
    const inputs = () => document.querySelectorAll('[data-slot="number-field-input"]')
    const key = async (index: number, name: string, shiftKey = false) => {
      await act(async () => {
        const input = inputs()[index] as HTMLInputElement
        input.focus()
        input.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, shiftKey }))
      })
    }
    await key(0, 'PageUp')
    expect(valueOf(inputs()[0] as HTMLInputElement)).toBe('30')
    await key(0, 'PageDown')
    expect(valueOf(inputs()[0] as HTMLInputElement)).toBe('20')
    await key(0, 'ArrowUp', true)
    expect(valueOf(inputs()[0] as HTMLInputElement)).toBe('30')
    await key(1, 'PageUp')
    expect(valueOf(inputs()[1] as HTMLInputElement)).toBe('100')
    await key(2, 'PageUp')
    expect(valueOf(inputs()[2] as HTMLInputElement)).toBe('20')
    await key(3, 'PageDown')
    expect(valueOf(inputs()[3] as HTMLInputElement)).toBe('20')
  })

  it('jumps to the minimum with Home and the maximum with End', async () => {
    show(
      <>
        <NumberField defaultValue={20} min={0} max={100} spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
        <NumberField defaultValue={20} min={0} max={100} disabled spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
        <NumberField defaultValue={20} min={0} max={100} readOnly spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
        <NumberField defaultValue={20} spinOnPress={false}>
          <NumberFieldInput />
        </NumberField>
      </>
    )
    const inputs = () => document.querySelectorAll('[data-slot="number-field-input"]')
    const key = async (index: number, name: string) => {
      await act(async () => {
        const input = inputs()[index] as HTMLInputElement
        input.focus()
        input.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
      })
    }
    await key(0, 'Home')
    expect(valueOf(inputs()[0] as HTMLInputElement)).toBe('0')
    await key(0, 'End')
    expect(valueOf(inputs()[0] as HTMLInputElement)).toBe('100')
    await key(1, 'Home')
    expect(valueOf(inputs()[1] as HTMLInputElement)).toBe('20')
    await key(2, 'End')
    expect(valueOf(inputs()[2] as HTMLInputElement)).toBe('20')
    await key(3, 'Home')
    expect(valueOf(inputs()[3] as HTMLInputElement)).toBe('-9007199254740991')
    await key(3, 'End')
    expect(valueOf(inputs()[3] as HTMLInputElement)).toBe('9007199254740991')
  })

  it('keeps a read-only field focusable and ignores steps', async () => {
    show(
      <NumberField defaultValue={1} spinOnPress={false} readOnly>
        <NumberFieldDecrement>-</NumberFieldDecrement>
        <NumberFieldInput />
        <NumberFieldIncrement>+</NumberFieldIncrement>
      </NumberField>
    )
    const input = document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    const increment = document.querySelector('[data-slot="number-field-increment"]') as HTMLButtonElement
    const decrement = document.querySelector('[data-slot="number-field-decrement"]') as HTMLButtonElement
    expect(input.readOnly).toBe(true)
    expect(input.disabled).toBe(false)
    expect(increment.disabled).toBe(true)
    expect(decrement.disabled).toBe(true)
    await press('[data-slot="number-field-increment"]')
    expect(valueOf(input)).toBe('1')
  })

  it('stays empty when value is null even if the default is 1', async () => {
    const seen: Array<number | undefined> = []
    show(
      <NumberField
        value={null as unknown as number}
        defaultValue={1}
        spinOnPress={false}
        onValueChange={(value) => seen.push(value)}
      >
        <NumberFieldDecrement>-</NumberFieldDecrement>
        <NumberFieldInput />
        <NumberFieldIncrement>+</NumberFieldIncrement>
      </NumberField>
    )
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    expect(valueOf(input())).toBe('')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await press('[data-slot="number-field-increment"]')
    expect(valueOf(input())).toBe('')
    expect(document.querySelector('[role="status"]')).toBeNull()
    expect(seen.length).toBeGreaterThan(0)
  })

  it('keeps the value inside a later min and max', async () => {
    function Harness() {
      const [max, setMax] = useState(100)
      const [min, setMin] = useState<number | undefined>(undefined)
      return (
        <>
          <button type="button" onClick={() => setMax(40)}>
            Cap
          </button>
          <button type="button" onClick={() => setMin(30)}>
            Floor
          </button>
          <NumberField defaultValue={80} max={max} spinOnPress={false}>
            <NumberFieldInput />
          </NumberField>
          <NumberField defaultValue={10} min={min} spinOnPress={false}>
            <NumberFieldInput />
          </NumberField>
        </>
      )
    }
    show(<Harness />)
    const inputs = () => document.querySelectorAll('[data-slot="number-field-input"]')
    const click = async (label: string) => {
      const button = [...document.querySelectorAll('button')].find((item) => item.textContent === label)
      await act(async () => {
        button?.click()
      })
    }
    expect(valueOf(inputs()[0] as HTMLInputElement)).toBe('80')
    await click('Cap')
    expect(valueOf(inputs()[0] as HTMLInputElement)).toBe('40')
    expect(valueOf(inputs()[1] as HTMLInputElement)).toBe('10')
    await click('Floor')
    expect(valueOf(inputs()[1] as HTMLInputElement)).toBe('30')
  })
})
