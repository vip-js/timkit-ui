// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { widgetKeyContract } from '@timui/core'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet'
import { Slider } from './slider'
import { Switch } from './switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}
Element.prototype.scrollTo = () => {}

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
  return host
}

const flush = async () => {
  await act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
}

const keydown = async (target: EventTarget, key: string) => {
  if (target instanceof HTMLElement) {
    await act(async () => {
      target.focus()
    })
    await flush()
  }
  await act(async () => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    if (key === ' ') target.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
  })
  await flush()
}

const open = async (selector: string) => {
  const trigger = document.querySelector(selector) as HTMLElement
  expect(trigger, selector).toBeTruthy()
  await act(async () => {
    trigger.focus()
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    trigger.click()
  })
  await flush()
  return trigger
}

describe('keyboard contract', () => {
  it('gives an icon button an accessible name', () => {
    show(<Button size="icon" aria-label="Close" />)
    expect(document.querySelector('button')?.getAttribute('aria-label')).toBe('Close')
    show(<Button size="icon" label="Search" />)
    expect(document.querySelectorAll('button')[1]?.getAttribute('aria-label')).toBe('Search')
  })

  it('dialog closes on the shared Escape key and restores focus', async () => {
    show(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const trigger = await open('[data-slot="dialog-trigger"]')
    expect(document.body.textContent).toContain('Title')
    await keydown(document, widgetKeyContract.dialog)
    expect(document.body.textContent).not.toContain('Title')
    expect(document.activeElement).toBe(trigger)
  })

  it('sheet closes on the shared Escape key and restores focus', async () => {
    show(
      <Sheet>
        <SheetTrigger>
          <button type="button">Open sheet</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet title</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    const trigger = await open('button')
    expect(document.body.textContent).toContain('Sheet title')
    await keydown(document, widgetKeyContract.sheet)
    expect(document.body.textContent).not.toContain('Sheet title')
    expect(document.activeElement).toBe(trigger)
  })

  it('select opens with the shared ArrowDown key', async () => {
    show(
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )
    await flush()
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.select)
    expect(document.body.textContent).toContain('Apple')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await keydown(document, 'Escape')
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    expect(document.activeElement).toBe(trigger)
  })

  it('menu opens with the shared ArrowDown key', async () => {
    show(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    await flush()
    const trigger = document.querySelector('[data-slot="dropdown-menu-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.menu)
    expect(document.body.textContent).toContain('Item')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await keydown(document, 'Escape')
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    expect(document.activeElement).toBe(trigger)
  })

  it('tabs move with the shared ArrowRight key', async () => {
    show(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="password">Password panel</TabsContent>
      </Tabs>
    )
    await flush()
    const trigger = document.querySelector('[data-slot="tabs-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.tabs)
    expect(document.body.textContent).toContain('Password panel')
  })

  it('accordion moves with the shared ArrowDown key', async () => {
    show(
      <Accordion id="sections" type="single" defaultValue={['one']}>
        <AccordionItem value="one">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Details</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Billing</AccordionTrigger>
          <AccordionContent>Invoice</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await flush()
    const triggers = document.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger"]')
    await keydown(triggers[0], widgetKeyContract.accordion)
    expect(document.activeElement).toBe(triggers[1])
  })

  it('checkbox toggles with the shared Space key', async () => {
    show(<Checkbox id="accept" aria-label="Accept" />)
    await flush()
    const box = document.querySelector('[data-slot="checkbox-root"] input') as HTMLElement
    await keydown(box, widgetKeyContract.checkbox)
    expect(document.querySelector('[data-slot="checkbox"]')?.getAttribute('data-state')).toBe('checked')
  })

  it('disabled checkbox ignores the shared Space key', async () => {
    show(<Checkbox id="accept" disabled aria-label="Accept" />)
    await flush()
    const box = document.querySelector('[data-slot="checkbox-root"] input') as HTMLElement
    await keydown(box, widgetKeyContract.checkbox)
    expect(document.querySelector('[data-slot="checkbox"]')?.getAttribute('data-state')).toBe('unchecked')
  })

  it('switch toggles with the shared Space key', async () => {
    show(<Switch id="alerts" aria-label="Alerts" />)
    await flush()
    const control = document.querySelector('[data-slot="switch-root"] input') as HTMLElement
    await keydown(control, widgetKeyContract.switch)
    expect(document.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('checked')
  })

  it('disabled switch ignores the shared Space key', async () => {
    show(<Switch id="alerts" disabled aria-label="Alerts" />)
    await flush()
    const control = document.querySelector('[data-slot="switch-root"] input') as HTMLElement
    await keydown(control, widgetKeyContract.switch)
    expect(document.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('unchecked')
  })

  it('disabled slider ignores the shared ArrowRight key', async () => {
    show(<Slider id="volume" disabled defaultValue={[20]} />)
    await flush()
    const thumb = document.querySelector('[role="slider"]') as HTMLElement
    const before = Number(thumb.getAttribute('aria-valuenow'))
    await keydown(thumb, widgetKeyContract.slider)
    expect(Number(thumb.getAttribute('aria-valuenow'))).toBe(before)
  })

  it('disabled select ignores the shared ArrowDown key', async () => {
    show(
      <Select disabled>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )
    await flush()
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.select)
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
  })

  it('disabled tabs ignore the shared ArrowRight key', async () => {
    show(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account" disabled>
            Account
          </TabsTrigger>
          <TabsTrigger value="password" disabled>
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="password">Password panel</TabsContent>
      </Tabs>
    )
    await flush()
    const trigger = document.querySelector('[data-slot="tabs-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.tabs)
    expect(document.body.textContent).not.toContain('Password panel')
  })

  it('disabled accordion ignores the shared ArrowDown key', async () => {
    show(
      <Accordion id="sections" disabled type="single" defaultValue={['one']}>
        <AccordionItem value="one">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Details</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Billing</AccordionTrigger>
          <AccordionContent>Invoice</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await flush()
    const triggers = document.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger"]')
    await keydown(triggers[0], widgetKeyContract.accordion)
    expect(document.activeElement).not.toBe(triggers[1])
    expect(triggers[1].getAttribute('aria-expanded')).toBe('false')
  })

  it('slider changes with the shared ArrowRight key', async () => {
    show(<Slider id="volume" defaultValue={[20]} />)
    await flush()
    const thumb = document.querySelector('[role="slider"]') as HTMLElement
    const before = Number(thumb.getAttribute('aria-valuenow'))
    await keydown(thumb, widgetKeyContract.slider)
    expect(Number(thumb.getAttribute('aria-valuenow'))).toBeGreaterThan(before)
  })
})
