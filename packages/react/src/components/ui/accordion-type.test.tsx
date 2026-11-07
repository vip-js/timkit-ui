// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'

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

const show = (type: 'single' | 'multiple', disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() =>
    root.render(
      <Accordion type={type} disabled={disabled}>
        <AccordionItem value="one">
          <AccordionTrigger>One</AccordionTrigger>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Two</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )
  )
  mounted.push({ root, host })
}

const press = async (name: string) => {
  const trigger = [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((item) =>
    item.textContent?.includes(name)
  ) as HTMLButtonElement
  await act(async () => {
    trigger.focus()
    trigger.click()
  })
}

const state = (name: string) => {
  const item = [...document.querySelectorAll('[data-slot="accordion-item"]')].find((entry) =>
    entry.textContent?.includes(name)
  )
  return item?.getAttribute('data-state')
}

describe('accordion type', () => {
  it('follows a later value and keeps a disabled accordion on its current item', async () => {
    function Harness() {
      const [value, setValue] = useState('one')
      const [locked, setLocked] = useState('one')
      return (
        <>
          <button type="button" onClick={() => setValue('two')}>
            Next
          </button>
          <button type="button" onClick={() => setLocked('')}>
            Clear
          </button>
          <Accordion type="single" value={value}>
            <AccordionItem value="one">
              <AccordionTrigger>One</AccordionTrigger>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Two</AccordionTrigger>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" disabled value={locked}>
            <AccordionItem value="one">
              <AccordionTrigger>Locked</AccordionTrigger>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Other</AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </>
      )
    }
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<Harness />))
    mounted.push({ root, host })
    expect(state('One')).toBe('open')
    expect(state('Two')).toBe('closed')
    expect(state('Locked')).toBe('open')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Item 1 of 2',
      'Item 1 of 2',
    ])
    await press('Other')
    expect(state('Locked')).toBe('open')
    expect(state('Other')).toBe('closed')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      click('Next')?.click()
      click('Clear')?.click()
    })
    expect(state('One')).toBe('closed')
    expect(state('Two')).toBe('open')
    expect(state('Locked')).toBe('closed')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Item 2 of 2'])
  })

  it('keeps one item open when type is single', async () => {
    show('single')
    await press('One')
    await press('Two')
    expect(state('Two')).toBe('open')
    expect(state('One')).toBe('closed')
  })

  it('keeps every opened item when type is multiple', async () => {
    show('multiple')
    await press('One')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 2')
    await press('Two')
    expect(state('One')).toBe('open')
    expect(state('Two')).toBe('open')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2 items open')
  })

  it('ignores opening while disabled', async () => {
    show('single', true)
    await press('One')
    expect(state('One')).toBe('closed')
  })

  it('shows the open panel and keeps a disabled item closed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Accordion type="single" defaultValue={['one']}>
          <AccordionItem value="one">
            <AccordionTrigger>One</AccordionTrigger>
            <AccordionContent>Details</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two" disabled>
            <AccordionTrigger>Two</AccordionTrigger>
            <AccordionContent>Hidden</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    )
    mounted.push({ root, host })
    const panel = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-content"]')].find((node) =>
        node.textContent?.includes(name)
      )
    expect(panel('Details')?.hasAttribute('hidden')).toBe(false)
    expect(panel('Hidden')?.hasAttribute('hidden')).toBe(true)
    const trigger = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((node) =>
        node.textContent?.includes(name)
      )
    expect(trigger('One')?.getAttribute('aria-controls')).toBe(panel('Details')?.id)
    expect(panel('Details')?.getAttribute('role')).toBe('region')
    expect(panel('Details')?.getAttribute('aria-labelledby')).toBe(trigger('One')?.id)
    await press('Two')
    expect(panel('Hidden')?.hasAttribute('hidden')).toBe(true)
    expect(state('Two')).toBe('closed')
  })

  it('stays closed when value is null even if the default is open', async () => {
    const seen: Array<string | string[]> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Accordion
          type="single"
          value={null}
          defaultValue={['one']}
          onValueChange={(event) => seen.push(event.detail.value)}
        >
          <AccordionItem value="one">
            <AccordionTrigger>One</AccordionTrigger>
            <AccordionContent>Details</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    )
    mounted.push({ root, host })
    const panel = () => document.querySelector('[data-slot="accordion-content"]')
    expect(panel()?.hasAttribute('hidden')).toBe(true)
    await press('One')
    expect(panel()?.hasAttribute('hidden')).toBe(true)
    expect(seen).toEqual(['one'])
  })

  it('keeps a single item open unless collapsing is allowed', async () => {
    show('single')
    await press('One')
    await press('One')
    expect(state('One')).toBe('open')

    const first = mounted.at(-1)
    act(() => first?.root.unmount())
    first?.host.remove()
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Accordion type="single" collapsible>
          <AccordionItem value="one">
            <AccordionTrigger>One</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      )
    )
    mounted.push({ root, host })
    await press('One')
    await press('One')
    expect(state('One')).toBe('closed')
  })

  it('moves to the next trigger with ArrowDown without opening it', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Accordion type="single">
          <AccordionItem value="one">
            <AccordionTrigger>One</AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="locked" disabled>
            <AccordionTrigger>Locked</AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Two</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      )
    )
    mounted.push({ root, host })
    const trigger = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((item) =>
        item.textContent?.includes(name)
      ) as HTMLButtonElement
    await act(async () => {
      trigger('One').focus()
    })
    await act(async () => {
      trigger('One').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    })
    expect(document.activeElement).toBe(trigger('Two'))
    expect(state('One')).toBe('closed')
    expect(state('Two')).toBe('closed')
  })

  it('moves to the first and last enabled trigger with Home and End without opening them', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Accordion type="single">
          <AccordionItem value="one">
            <AccordionTrigger>One</AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="locked" disabled>
            <AccordionTrigger>Locked</AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="three">
            <AccordionTrigger>Three</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      )
    )
    mounted.push({ root, host })
    const trigger = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((item) =>
        item.textContent?.includes(name)
      ) as HTMLButtonElement
    await act(async () => {
      trigger('One').focus()
    })
    await act(async () => {
      trigger('One').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    })
    expect(document.activeElement).toBe(trigger('Three'))
    expect(state('One')).toBe('closed')
    expect(state('Three')).toBe('closed')
    await act(async () => {
      trigger('Three').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    })
    expect(document.activeElement).toBe(trigger('One'))
    expect(state('One')).toBe('closed')
  })
})
