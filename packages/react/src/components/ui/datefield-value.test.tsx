// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { DateField, DateInput } from './datefield-rac'

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

const typeDate = async (value: string) => {
  const input = document.querySelector('input') as HTMLInputElement
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

describe('date field value', () => {
  it('reports the typed date through onValueChange', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DateField onValueChange={(value) => changes.push(value)}>
          <DateInput />
        </DateField>
      )
    )
    mounted.push({ root, host })
    await typeDate('2026-11-07')
    expect(changes).toEqual(['2026-11-07'])
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('2026-11-07')
  })

  it('follows a later value and disables the input', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const Harness = () => {
      const [value, setValue] = useState('2026-11-01')
      const [disabled, setDisabled] = useState(false)
      return (
        <DateField value={value} disabled={disabled}>
          <DateInput />
          <button type="button" onClick={() => setValue('2026-11-07')}>
            Next
          </button>
          <button type="button" onClick={() => setValue('')}>
            Clear
          </button>
          <button type="button" onClick={() => setDisabled(true)}>
            Lock
          </button>
        </DateField>
      )
    }
    act(() => root.render(<Harness />))
    mounted.push({ root, host })
    const input = () => document.querySelector('input') as HTMLInputElement
    expect(input().value).toBe('2026-11-01')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2026-11-01')
    await act(async () => {
      ;[...document.querySelectorAll('button')].find((node) => node.textContent === 'Next')?.click()
    })
    expect(input().value).toBe('2026-11-07')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2026-11-07')
    await act(async () => {
      ;[...document.querySelectorAll('button')].find((node) => node.textContent === 'Clear')?.click()
    })
    expect(input().value).toBe('')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      ;[...document.querySelectorAll('button')].find((node) => node.textContent === 'Lock')?.click()
    })
    expect(input().disabled).toBe(true)
  })

  it('ignores typing while disabled', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DateField disabled onValueChange={(value) => changes.push(value)}>
          <DateInput />
        </DateField>
      )
    )
    mounted.push({ root, host })
    expect((document.querySelector('input') as HTMLInputElement).disabled).toBe(true)
    await typeDate('2026-11-07')
    expect(changes).toEqual([])
  })

  it('stays empty when value is null even if the default is a date', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DateField
          value={null}
          defaultValue="2026-11-01"
          onValueChange={(value) => changes.push(value)}
        >
          <DateInput />
        </DateField>
      )
    )
    mounted.push({ root, host })
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')
    await typeDate('2026-11-07')
    expect(input.value).toBe('')
    expect(changes).toEqual(['2026-11-07'])
  })

  it('ignores typing while read-only and stays focusable', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DateField defaultValue="2026-11-01" readOnly onValueChange={(value) => changes.push(value)}>
          <DateInput />
        </DateField>
      )
    )
    mounted.push({ root, host })
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.readOnly).toBe(true)
    expect(input.disabled).toBe(false)
    await typeDate('2026-11-07')
    expect(changes).toEqual([])
    expect(input.value).toBe('2026-11-01')
  })

  it('ignores a date outside min and max', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DateField min="2026-11-05" max="2026-11-10" onValueChange={(value) => changes.push(value)}>
          <DateInput />
        </DateField>
      )
    )
    mounted.push({ root, host })
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.min).toBe('2026-11-05')
    expect(input.max).toBe('2026-11-10')
    await typeDate('2026-11-01')
    expect(changes).toEqual([])
    await typeDate('2026-11-07')
    expect(changes).toEqual(['2026-11-07'])
    expect(input.value).toBe('2026-11-07')
  })
})
