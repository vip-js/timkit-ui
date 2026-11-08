// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Input } from './input'
import { Textarea } from './textarea'

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

const typeInto = (field: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
  act(() => {
    setter?.call(field, value)
    field.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

describe('text input value', () => {
  it('keeps typed text and ignores disabled or read-only changes', () => {
    const seen: string[] = []
    const enabled = show(
      <Input
        defaultValue="apple"
        onValueChange={(event) => {
          seen.push(event.detail.value)
        }}
      />
    )
    const input = enabled.querySelector('input')
    if (!input) throw new Error('missing input')
    typeInto(input, 'pear')
    expect(input.value).toBe('pear')
    expect(seen).toEqual(['pear'])

    const blocked: string[] = []
    const disabledHost = show(
      <Input
        defaultValue="apple"
        disabled
        onValueChange={(event) => {
          blocked.push(event.detail.value)
        }}
      />
    )
    const disabledInput = disabledHost.querySelector('input')
    if (!disabledInput) throw new Error('missing disabled input')
    typeInto(disabledInput, 'pear')
    expect(disabledInput.value).toBe('apple')
    expect(blocked).toEqual([])

    const readOnlySeen: string[] = []
    const readOnlyHost = show(
      <Textarea
        defaultValue="note"
        readOnly
        onValueChange={(event) => {
          readOnlySeen.push(event.detail.value)
        }}
      />
    )
    const textarea = readOnlyHost.querySelector('textarea')
    if (!textarea) throw new Error('missing textarea')
    typeInto(textarea, 'changed')
    expect(textarea.readOnly).toBe(true)
    expect(textarea.disabled).toBe(false)
    expect(textarea.value).toBe('note')
    expect(readOnlySeen).toEqual([])

    const frozen: string[] = []
    const frozenHost = show(
      <Input
        defaultValue="apple"
        readOnly
        onValueChange={(event) => {
          frozen.push(event.detail.value)
        }}
      />
    )
    const frozenInput = frozenHost.querySelector('input')
    if (!frozenInput) throw new Error('missing read-only input')
    typeInto(frozenInput, 'pear')
    expect(frozenInput.readOnly).toBe(true)
    expect(frozenInput.disabled).toBe(false)
    expect(frozenInput.value).toBe('apple')
    expect(frozen).toEqual([])
  })

  it('cuts typed text to maxLength and leaves an omitted max length alone', () => {
    const seen: string[] = []
    const host = show(
      <Input
        maxLength={4}
        onValueChange={(event) => {
          seen.push(event.detail.value)
        }}
      />
    )
    const input = host.querySelector('input')
    if (!input) throw new Error('missing input')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0 of 4')
    expect(input.getAttribute('aria-describedby')).toBe(host.querySelector('[role="status"]')?.id)
    typeInto(input, 'pineapple')
    expect(input.value).toBe('pine')
    expect(seen).toEqual(['pine'])
    expect(host.querySelector('[role="status"]')?.textContent).toBe('4 of 4')

    const open = show(<Input defaultValue="pineapple" />)
    const openInput = open.querySelector('input')
    if (!openInput) throw new Error('missing open input')
    expect(openInput.value).toBe('pineapple')
    expect(openInput.maxLength).toBe(-1)
    expect(open.querySelector('[role="status"]')).toBeNull()
    expect(openInput.getAttribute('aria-describedby')).toBeNull()
  })

  it('keeps a password field masked and a number field numeric', () => {
    const host = show(
      <>
        <Input type="password" defaultValue="secret" />
        <Input type="number" defaultValue="4" />
      </>
    )
    const fields = host.querySelectorAll('input')
    expect(fields[0]?.type).toBe('password')
    expect(fields[1]?.type).toBe('number')
  })

  it('reveals a password and masks it again', () => {
    const host = show(<Input type="password" defaultValue="secret" />)
    const field = host.querySelector('input') as HTMLInputElement
    const button = host.querySelector('[aria-label="Show password"]') as HTMLButtonElement
    expect(button.textContent).toBe('Show password')
    expect(host.querySelector('[role="status"]')).toBeNull()
    act(() => button.click())
    expect(field.type).toBe('text')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Visible')
    expect(document.activeElement).toBe(field)
    const hide = host.querySelector('[aria-label="Hide password"]') as HTMLButtonElement
    expect(hide.textContent).toBe('Hide password')
    act(() => hide.click())
    expect(field.type).toBe('password')
    expect(host.querySelector('[role="status"]')).toBeNull()
    expect(field.value).toBe('secret')
    const locked = show(<Input type="password" defaultValue="secret" disabled />)
    expect(locked.querySelector('[aria-label="Show password"]')).toBeNull()
    const text = show(<Input defaultValue="secret" />)
    expect(text.querySelector('[aria-label="Show password"]')).toBeNull()
  })

  it('announces a required field and leaves an omitted field optional', () => {
    const host = show(
      <>
        <Input required />
        <Input />
        <Textarea required />
        <Textarea />
      </>
    )
    const fields = host.querySelectorAll('input, textarea') as NodeListOf<HTMLInputElement | HTMLTextAreaElement>
    expect(fields[0]?.required).toBe(true)
    expect(fields[0]?.getAttribute('aria-required')).toBe('true')
    expect(fields[1]?.required).toBe(false)
    expect(fields[1]?.getAttribute('aria-required')).toBeNull()
    expect(fields[2]?.required).toBe(true)
    expect(fields[2]?.getAttribute('aria-required')).toBe('true')
    expect(fields[3]?.getAttribute('aria-required')).toBeNull()
  })

  it('cuts an existing value when maxLength becomes shorter', () => {
    const seen: string[] = []
    const Harness = () => {
      const [max, setMax] = useState<number | undefined>(undefined)
      return (
        <>
          <Input
            defaultValue="apple"
            maxLength={max}
            onValueChange={(event) => {
              seen.push(event.detail.value)
            }}
          />
          <button type="button" onClick={() => setMax(3)}>
            Limit
          </button>
        </>
      )
    }
    const host = show(<Harness />)
    const input = host.querySelector('input')
    if (!input) throw new Error('missing input')
    expect(input.value).toBe('apple')
    act(() =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === 'Limit')?.click()
    )
    expect(input.value).toBe('app')
    expect(seen).toEqual(['app'])
  })

  it('cuts textarea text to maxLength and leaves an omitted max length alone', () => {
    const seen: string[] = []
    const host = show(
      <Textarea
        maxLength={4}
        onValueChange={(event) => {
          seen.push(event.detail.value)
        }}
      />
    )
    const area = host.querySelector('textarea')
    if (!area) throw new Error('missing textarea')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0 of 4')
    expect(area.getAttribute('aria-describedby')).toBe(host.querySelector('[role="status"]')?.id)
    typeInto(area, 'pineapple')
    expect(area.value).toBe('pine')
    expect(seen).toEqual(['pine'])
    expect(host.querySelector('[role="status"]')?.textContent).toBe('4 of 4')

    const open = show(<Textarea defaultValue="pineapple" />)
    const openArea = open.querySelector('textarea')
    if (!openArea) throw new Error('missing open textarea')
    expect(openArea.value).toBe('pineapple')
    expect(openArea.maxLength).toBe(-1)
    expect(open.querySelector('[role="status"]')).toBeNull()
    expect(openArea.getAttribute('aria-describedby')).toBeNull()
  })

  it('clears text and returns focus, and hides Clear when the field cannot change', () => {
    const seen: string[] = []
    const host = show(
      <Input
        defaultValue="apple"
        onValueChange={(event) => {
          seen.push(event.detail.value)
        }}
      />
    )
    const input = host.querySelector('input') as HTMLInputElement
    const button = host.querySelector('[aria-label="Clear"]') as HTMLButtonElement
    expect(button.textContent).toBe('Clear')
    act(() => button.click())
    expect(input.value).toBe('')
    expect(seen).toEqual([''])
    expect(document.activeElement).toBe(input)
    expect(host.querySelector('[aria-label="Clear"]')).toBeNull()
    const locked = show(<Input defaultValue="apple" disabled />)
    expect(locked.querySelector('[aria-label="Clear"]')).toBeNull()
    const frozen = show(<Input defaultValue="apple" readOnly />)
    expect(frozen.querySelector('[aria-label="Clear"]')).toBeNull()
    const file = show(<Input type="file" />)
    expect(file.querySelector('[aria-label="Clear"]')).toBeNull()
  })

  it('clears a textarea and returns focus', () => {
    const seen: string[] = []
    const host = show(
      <Textarea
        defaultValue="note"
        onValueChange={(event) => {
          seen.push(event.detail.value)
        }}
      />
    )
    const area = host.querySelector('textarea') as HTMLTextAreaElement
    const button = host.querySelector('[aria-label="Clear"]') as HTMLButtonElement
    act(() => button.click())
    expect(area.value).toBe('')
    expect(seen).toEqual([''])
    expect(document.activeElement).toBe(area)
    expect(host.querySelector('[aria-label="Clear"]')).toBeNull()
    const locked = show(<Textarea defaultValue="note" readOnly />)
    expect(locked.querySelector('[aria-label="Clear"]')).toBeNull()
  })
})
