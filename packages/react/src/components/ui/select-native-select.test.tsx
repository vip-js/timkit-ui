// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { SelectNative } from './select-native'

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
  return host
}

const change = (select: HTMLSelectElement, value: string) => {
  act(() => {
    select.value = value
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

describe('native select', () => {
  it('follows a later value and ignores changes while disabled', () => {
    function Harness() {
      const [value, setValue] = useState('apple')
      return (
        <>
          <button type="button" onClick={() => setValue('pear')}>
            Pear
          </button>
          <button type="button" onClick={() => setValue('')}>
            Clear
          </button>
          <SelectNative value={value} disabled>
            <option value="">None</option>
            <option value="apple">Apple</option>
            <option value="pear">Pear</option>
          </SelectNative>
        </>
      )
    }
    const host = show(<Harness />)
    const select = host.querySelector('select')
    if (!select) throw new Error('missing select')
    expect(select.value).toBe('apple')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Option 2 of 3')
    change(select, 'pear')
    expect(select.value).toBe('apple')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    act(() => press('Pear')?.click())
    expect(select.value).toBe('pear')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Option 3 of 3')
    act(() => press('Clear')?.click())
    expect(select.value).toBe('')
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('replaces the selected value and ignores changes while disabled', () => {
    const seen: Array<string | string[]> = []
    const enabled = show(
      <SelectNative
        defaultValue="apple"
        onValueChange={(value) => {
          seen.push(value)
        }}
      >
        <option value="apple">Apple</option>
        <option value="pear">Pear</option>
      </SelectNative>
    )
    const select = enabled.querySelector('select')
    if (!select) throw new Error('missing select')
    expect(select.value).toBe('apple')
    change(select, 'pear')
    expect(select.value).toBe('pear')
    expect(seen).toEqual(['pear'])

    const disabledSeen: Array<string | string[]> = []
    const disabledHost = show(
      <SelectNative
        defaultValue="apple"
        disabled
        onValueChange={(value) => {
          disabledSeen.push(value)
        }}
      >
        <option value="apple">Apple</option>
        <option value="pear">Pear</option>
      </SelectNative>
    )
    const disabledSelect = disabledHost.querySelector('select')
    if (!disabledSelect) throw new Error('missing disabled select')
    expect(disabledSelect.disabled).toBe(true)
    change(disabledSelect, 'pear')
    expect(disabledSelect.value).toBe('apple')
    expect(disabledSeen).toEqual([])
  })

  it('stays empty when value is null even if the default is apple', () => {
    const seen: Array<string | string[]> = []
    const host = show(
      <SelectNative
        value={null as unknown as string}
        defaultValue="apple"
        onValueChange={(value) => {
          seen.push(value)
        }}
      >
        <option value="">None</option>
        <option value="apple">Apple</option>
        <option value="pear">Pear</option>
      </SelectNative>
    )
    const select = host.querySelector('select')
    if (!select) throw new Error('missing select')
    expect(select.value).toBe('')
    change(select, 'pear')
    expect(select.value).toBe('')
    expect(seen).toEqual(['pear'])
  })

  it('renders option values from the options prop', () => {
    const seen: string[] = []
    function Field() {
      const [value, setValue] = useState('apple')
      return (
        <SelectNative
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Pear', value: 'pear' },
          ]}
          value={value}
          onValueChange={(next) => {
            const picked = Array.isArray(next) ? next[0] ?? '' : next
            seen.push(picked)
            setValue(picked)
          }}
        />
      )
    }
    const host = show(<Field />)
    const select = host.querySelector('select')
    if (!select) throw new Error('missing select')
    change(select, 'pear')
    expect(select.value).toBe('pear')
    expect(seen).toEqual(['pear'])
  })

  it('reads one selected option and how many are selected', () => {
    function Field() {
      const [value, setValue] = useState<string[]>(['apple'])
      return (
        <>
          <button type="button" onClick={() => setValue(['apple', 'pear'])}>
            Both
          </button>
          <button type="button" onClick={() => setValue([])}>
            Clear
          </button>
          <SelectNative
            multiple
            options={[
              { label: 'Apple', value: 'apple' },
              { label: 'Pear', value: 'pear' },
            ]}
            value={value}
            onValueChange={(next) => {
              if (Array.isArray(next)) setValue(next)
            }}
          />
        </>
      )
    }
    const host = show(<Field />)
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Option 1 of 2')
    act(() => press('Both')?.click())
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2 options selected')
    act(() => press('Clear')?.click())
    expect(host.querySelector('[role="status"]')).toBeNull()
  })
})
