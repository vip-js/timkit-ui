// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { RadioGroup, RadioGroupItem } from './radio-group'

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

const checkedValues = () =>
  [...document.querySelectorAll<HTMLElement>('[data-slot="radio-group-item"]')]
    .filter((item) => item.getAttribute('data-state') === 'checked')
    .map((item) => item.querySelector('input')?.getAttribute('value'))

const clickValue = async (value: string) => {
  const input = document.querySelector(`input[value="${value}"]`) as HTMLInputElement
  await act(async () => {
    input.click()
  })
}

describe('radio group selection', () => {
  it('follows a later value and ignores a disabled selection', async () => {
    function Harness() {
      const [value, setValue] = useState('')
      return (
        <>
          <button type="button" onClick={() => setValue('pear')}>
            Pear
          </button>
          <button type="button" onClick={() => setValue('')}>
            Clear
          </button>
          <RadioGroup value={value} disabled>
            <RadioGroupItem value="apple" />
            <RadioGroupItem value="pear" />
          </RadioGroup>
        </>
      )
    }
    show(<Harness />)
    await clickValue('apple')
    expect(checkedValues()).toEqual([])
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('Pear')?.click()
    })
    expect(checkedValues()).toEqual(['pear'])
    expect(document.querySelector('[data-state="checked"] svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Option 2 of 2')
    await act(async () => {
      press('Clear')?.click()
    })
    expect(checkedValues()).toEqual([])
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('keeps one selected value', async () => {
    show(
      <RadioGroup>
        <RadioGroupItem value="apple" />
        <RadioGroupItem value="pear" />
      </RadioGroup>
    )
    await clickValue('apple')
    expect(checkedValues()).toEqual(['apple'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Option 1 of 2')
    await clickValue('pear')
    expect(checkedValues()).toEqual(['pear'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Option 2 of 2')
  })

  it('ignores selection while disabled', async () => {
    show(
      <RadioGroup disabled>
        <RadioGroupItem value="apple" />
        <RadioGroupItem value="pear" />
      </RadioGroup>
    )
    await clickValue('apple')
    expect(checkedValues()).toEqual([])
  })

  it('ignores selection while read-only', async () => {
    show(
      <RadioGroup readOnly value="apple">
        <RadioGroupItem value="apple" />
        <RadioGroupItem value="pear" />
      </RadioGroup>
    )
    expect(checkedValues()).toEqual(['apple'])
    await clickValue('pear')
    expect(checkedValues()).toEqual(['apple'])
  })

  it('stays empty when value is null even if the default is apple', async () => {
    const seen: Array<string | null> = []
    show(
      <RadioGroup
        value={null as unknown as string}
        defaultValue="apple"
        onValueChange={(event) => seen.push(event.detail.value)}
      >
        <RadioGroupItem value="apple" />
        <RadioGroupItem value="pear" />
      </RadioGroup>
    )
    expect(checkedValues()).toEqual([])
    await clickValue('pear')
    expect(checkedValues()).toEqual([])
    expect(seen).toEqual(['pear'])
  })

  it('is vertical unless orientation is horizontal', () => {
    show(
      <>
        <RadioGroup>
          <RadioGroupItem value="apple" />
        </RadioGroup>
        <RadioGroup orientation="horizontal">
          <RadioGroupItem value="pear" />
        </RadioGroup>
      </>
    )
    const groups = document.querySelectorAll('[role="radiogroup"]')
    expect(groups[0]?.getAttribute('aria-orientation')).toBe('vertical')
    expect(groups[1]?.getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('announces a required group and leaves an omitted group optional', () => {
    show(
      <>
        <RadioGroup required>
          <RadioGroupItem value="apple" />
        </RadioGroup>
        <RadioGroup>
          <RadioGroupItem value="pear" />
        </RadioGroup>
      </>
    )
    const groups = document.querySelectorAll('[role="radiogroup"]')
    expect(groups[0]?.getAttribute('aria-required')).toBe('true')
    expect(groups[1]?.getAttribute('aria-required')).toBeNull()
    expect(groups[1]?.getAttribute('aria-label')).toBe('Radio group')
  })

  it('selects the next enabled item whose label starts with a letter', async () => {
    show(
      <>
        <RadioGroup>
          <RadioGroupItem value="apple" disabled>
            Apple
          </RadioGroupItem>
          <RadioGroupItem value="pear">Pear</RadioGroupItem>
          <RadioGroupItem value="plum">Plum</RadioGroupItem>
          <RadioGroupItem value="peach">Peach</RadioGroupItem>
        </RadioGroup>
        <RadioGroup readOnly>
          <RadioGroupItem value="pear">Pear</RadioGroupItem>
        </RadioGroup>
        <RadioGroup disabled>
          <RadioGroupItem value="pear">Pear</RadioGroupItem>
        </RadioGroup>
      </>
    )
    const groups = () => document.querySelectorAll('[role="radiogroup"]')
    const press = async (index: number, key: string) => {
      const group = groups()[index] as HTMLElement
      const propKey = Object.keys(group).find((name) => name.startsWith('__reactProps'))
      const props = propKey
        ? (group as unknown as Record<string, Record<string, (event: object) => void>>)[propKey]
        : undefined
      const handler = props?.onKeyDown
      if (!handler) throw new Error(Object.keys(props ?? {}).sort().join(','))
      await act(async () => {
        handler({
          key,
          currentTarget: group,
          defaultPrevented: false,
          preventDefault() {},
        })
      })
    }
    await press(0, 'p')
    expect(checkedValues()).toEqual(['pear'])
    await press(0, 'p')
    expect(checkedValues()).toEqual(['plum'])
    await press(0, 'p')
    expect(checkedValues()).toEqual(['peach'])
    await press(0, 'z')
    expect(checkedValues()).toEqual(['peach'])
    await press(1, 'p')
    await press(2, 'p')
    expect(checkedValues()).toEqual(['peach'])
  })
})
