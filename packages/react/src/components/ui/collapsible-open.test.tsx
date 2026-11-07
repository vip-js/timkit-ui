// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'

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

describe('collapsible open', () => {
  it('follows a later open value and keeps a disabled trigger closed', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      const [locked, setLocked] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <button type="button" onClick={() => setLocked(true)}>
            Unlock
          </button>
          <Collapsible open={open}>
            <CollapsibleTrigger>Details</CollapsibleTrigger>
            <CollapsibleContent>Body</CollapsibleContent>
          </Collapsible>
          <Collapsible disabled open={locked}>
            <CollapsibleTrigger>Locked</CollapsibleTrigger>
            <CollapsibleContent>Hidden</CollapsibleContent>
          </Collapsible>
        </>
      )
    }
    show(<Harness />)
    const trigger = (index: number) =>
      document.querySelectorAll('[data-slot="collapsible-trigger"]')[index] as HTMLButtonElement
    const content = (index: number) =>
      document.querySelectorAll('[data-slot="collapsible-content"]')[index] as HTMLElement
    expect(content(0).hidden).toBe(true)
    expect(content(1).hidden).toBe(true)
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      trigger(1).click()
      await Promise.resolve()
    })
    expect(content(1).hidden).toBe(true)
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      click('Open')?.click()
      click('Unlock')?.click()
      await Promise.resolve()
    })
    expect(content(0).hidden).toBe(false)
    expect(content(0).textContent).toContain('Body')
    expect(trigger(0).getAttribute('aria-controls')).toBe(content(0).id)
    expect(content(0).getAttribute('role')).toBe('region')
    expect(content(0).getAttribute('aria-labelledby')).toBe(trigger(0).id)
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(2)
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    expect(content(1).hidden).toBe(false)
    expect(content(1).textContent).toContain('Hidden')
  })

  it('opens from the trigger and ignores a disabled trigger', async () => {
    const seen: boolean[] = []
    show(
      <>
        <Collapsible onOpenChange={(open) => seen.push(open)}>
          <CollapsibleTrigger>Details</CollapsibleTrigger>
          <CollapsibleContent>Body</CollapsibleContent>
        </Collapsible>
        <Collapsible disabled>
          <CollapsibleTrigger>Locked</CollapsibleTrigger>
          <CollapsibleContent>Hidden</CollapsibleContent>
        </Collapsible>
      </>
    )
    const trigger = (index: number) => document.querySelectorAll('[data-slot="collapsible-trigger"]')[index] as HTMLButtonElement
    const content = (index: number) => document.querySelectorAll('[data-slot="collapsible-content"]')[index] as HTMLElement
    expect(trigger(0).getAttribute('data-state')).toBe('closed')
    expect(content(0).hidden).toBe(true)
    await act(async () => {
      trigger(0).click()
      await Promise.resolve()
    })
    expect(trigger(0).getAttribute('data-state')).toBe('open')
    expect(trigger(0).getAttribute('aria-expanded')).toBe('true')
    expect(content(0).hidden).toBe(false)
    expect(content(0).textContent).toContain('Body')
    expect(seen).toEqual([true])
    await act(async () => {
      trigger(1).click()
      await Promise.resolve()
    })
    expect(trigger(1).getAttribute('data-state')).toBe('closed')
    expect(content(1).hidden).toBe(true)
    expect(seen).toEqual([true])
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    show(
      <Collapsible open={null} defaultOpen onOpenChange={(open) => seen.push(open)}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    )
    const trigger = document.querySelector('[data-slot="collapsible-trigger"]') as HTMLButtonElement
    const content = document.querySelector('[data-slot="collapsible-content"]') as HTMLElement
    expect(content.hidden).toBe(true)
    await act(async () => {
      trigger.click()
      await Promise.resolve()
    })
    expect(content.hidden).toBe(true)
    expect(seen).toEqual([true])
  })
})
