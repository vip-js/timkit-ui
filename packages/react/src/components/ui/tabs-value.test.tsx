// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

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

describe('tabs value', () => {
  it('follows a later value and ignores a disabled tab', async () => {
    function Harness() {
      const [value, setValue] = useState('account')
      return (
        <>
          <button type="button" onClick={() => setValue('billing')}>
            Next
          </button>
          <button type="button" onClick={() => setValue('')}>
            Clear
          </button>
          <Tabs value={value}>
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="locked" disabled>
                Locked
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">Account panel</TabsContent>
            <TabsContent value="billing">Billing panel</TabsContent>
            <TabsContent value="locked">Locked panel</TabsContent>
          </Tabs>
        </>
      )
    }
    show(<Harness />)
    expect(document.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe('Tabs')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Tab 1 of 3')
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).toContain('Account panel')
    expect(document.body.textContent).not.toContain('Billing panel')
    await act(async () => {
      trigger('Locked').click()
    })
    expect(document.body.textContent).toContain('Account panel')
    expect(document.body.textContent).not.toContain('Locked panel')
    const next = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Next')
    await act(async () => {
      next?.click()
    })
    expect(document.body.textContent).toContain('Billing panel')
    expect(document.body.textContent).not.toContain('Account panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('true')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Tab 2 of 3')
    const clear = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    await act(async () => {
      clear?.click()
    })
    expect(document.body.textContent).not.toContain('Billing panel')
    expect(document.body.textContent).not.toContain('Account panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('false')
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('selects a tab and ignores a disabled tab', async () => {
    const seen: string[] = []
    show(
      <Tabs defaultValue="account" onValueChange={(value) => seen.push(value)}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="locked" disabled>
            Locked
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="billing">Billing panel</TabsContent>
        <TabsContent value="locked">Locked panel</TabsContent>
      </Tabs>
    )
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).toContain('Account panel')
    expect(document.body.textContent).not.toContain('Billing panel')
    await act(async () => {
      trigger('Billing').click()
    })
    expect(document.body.textContent).toContain('Billing panel')
    expect(document.body.textContent).not.toContain('Account panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('true')
    const panel = document.querySelector('[role="tabpanel"]')
    expect(trigger('Billing').getAttribute('aria-controls')).toBe(panel?.id)
    expect(panel?.getAttribute('aria-labelledby')).toBe(trigger('Billing').id)
    await act(async () => {
      trigger('Locked').click()
    })
    expect(document.body.textContent).toContain('Billing panel')
    expect(document.body.textContent).not.toContain('Locked panel')
    expect(trigger('Locked').hasAttribute('disabled') || trigger('Locked').getAttribute('aria-disabled')).toBeTruthy()
    expect(seen).toEqual(['billing'])
  })

  it('ignores tab changes while the group is disabled', async () => {
    const seen: string[] = []
    show(
      <Tabs defaultValue="account" disabled onValueChange={(value) => seen.push(value)}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="billing">Billing panel</TabsContent>
      </Tabs>
    )
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.querySelector('[data-slot="tabs"]')?.getAttribute('aria-disabled')).toBe('true')
    await act(async () => {
      trigger('Billing').click()
    })
    expect(document.body.textContent).toContain('Account panel')
    expect(document.body.textContent).not.toContain('Billing panel')
    expect(trigger('Billing').disabled).toBe(true)
    expect(seen).toEqual([])
  })

  it('stays unselected when value is null even if the default is account', async () => {
    const seen: string[] = []
    show(
      <Tabs value={null} defaultValue="account" onValueChange={(value) => seen.push(value)}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="billing">Billing panel</TabsContent>
      </Tabs>
    )
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Account panel')
    expect(trigger('Account').getAttribute('aria-selected')).toBe('false')
    await act(async () => {
      trigger('Billing').click()
    })
    expect(document.body.textContent).not.toContain('Billing panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('false')
    expect(seen).toEqual(['billing'])
  })

  it('moves with Down when the tabs are vertical and ignores Right', async () => {
    show(
      <Tabs defaultValue="account" orientation="vertical">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="billing">Billing panel</TabsContent>
      </Tabs>
    )
    const list = document.querySelector('[role="tablist"]') as HTMLElement
    const selected = () =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find(
        (node) => node.getAttribute('aria-selected') === 'true'
      )?.textContent
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    expect(list.getAttribute('data-orientation')).toBe('vertical')
    await act(async () => {
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    })
    expect(selected()).toContain('Account')
    await act(async () => {
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    })
    expect(selected()).toContain('Billing')
  })

  it('selects the first and last enabled tab with Home and End', async () => {
    const real = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    }
    try {
      show(
        <Tabs defaultValue="billing">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="locked" disabled>
              Locked
            </TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account panel</TabsContent>
          <TabsContent value="billing">Billing panel</TabsContent>
        </Tabs>
      )
      const list = document.querySelector('[role="tablist"]') as HTMLElement
      const selected = () =>
        [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find(
          (node) => node.getAttribute('aria-selected') === 'true'
        )?.textContent
      const press = (key: string) =>
        act(async () => {
          list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
        })
      expect(selected()).toContain('Billing')
      await press('Home')
      expect(selected()).toContain('Account')
      await press('End')
      expect(selected()).toContain('Billing')
      expect(document.body.textContent).not.toContain('Locked panel')
    } finally {
      globalThis.requestAnimationFrame = real
    }
  })
})
