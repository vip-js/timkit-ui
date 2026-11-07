import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { widgetKeyContract } from '@timui/core'

import Accordion from './accordion/accordion.vue'
import Button from './button/button.vue'
import AccordionContent from './accordion/accordion-content.vue'
import AccordionItem from './accordion/accordion-item.vue'
import AccordionTrigger from './accordion/accordion-trigger.vue'
import Checkbox from './checkbox/checkbox.vue'
import Dialog from './dialog/dialog.vue'
import DialogContent from './dialog/dialog-content.vue'
import DialogTitle from './dialog/dialog-title.vue'
import DialogTrigger from './dialog/dialog-trigger.vue'
import DropdownMenu from './dropdown-menu/dropdown-menu.vue'
import DropdownMenuContent from './dropdown-menu/dropdown-menu-content.vue'
import DropdownMenuItem from './dropdown-menu/dropdown-menu-item.vue'
import DropdownMenuTrigger from './dropdown-menu/dropdown-menu-trigger.vue'
import Select from './select/select.vue'
import SelectContent from './select/select-content.vue'
import SelectItem from './select/select-item.vue'
import SelectTrigger from './select/select-trigger.vue'
import Sheet from './sheet/sheet.vue'
import SheetContent from './sheet/sheet-content.vue'
import SheetTitle from './sheet/sheet-title.vue'
import SheetTrigger from './sheet/sheet-trigger.vue'
import Slider from './slider/slider.vue'
import Switch from './switch/switch.vue'
import Tabs from './tabs/tabs.vue'
import TabsContent from './tabs/tabs-content.vue'
import TabsList from './tabs/tabs-list.vue'
import TabsTrigger from './tabs/tabs-trigger.vue'

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

const mounted: Array<() => void> = []

afterEach(() => {
  for (const unmount of mounted) unmount()
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (render: () => unknown) => {
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render })
  app.mount(el)
  mounted.push(() => app.unmount())
  return el
}

const keydown = async (target: EventTarget, key: string) => {
  if (target instanceof HTMLElement) target.focus()
  await nextTick()
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  if (key === ' ') target.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
  await nextTick()
  await nextTick()
}

const click = async (selector: string) => {
  const trigger = document.querySelector(selector) as HTMLElement
  expect(trigger, selector).toBeTruthy()
  trigger.focus()
  trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  trigger.click()
  await nextTick()
  await nextTick()
  return trigger
}

describe('vue keyboard contract', () => {
  it('gives an icon button an accessible name', () => {
    show(() => h(Button, { size: 'icon', 'aria-label': 'Close' }))
    expect(document.querySelector('button')?.getAttribute('aria-label')).toBe('Close')
    document.body.innerHTML = ''
    show(() => h(Button, { size: 'icon', label: 'Search' }))
    expect(document.querySelector('[data-slot="button"]')?.getAttribute('aria-label')).toBe('Search')
  })

  it('dialog closes on the shared Escape key', async () => {
    show(() =>
      h(Dialog, { id: 'dialog' }, () => [
        h(DialogTrigger, () => 'Open dialog'),
        h(DialogContent, () => h(DialogTitle, () => 'Title')),
      ])
    )
    const trigger = await click('[data-slot="dialog-trigger"]')
    expect(document.body.textContent).toContain('Title')
    await keydown(document, widgetKeyContract.dialog)
    expect(document.body.textContent).not.toContain('Title')
    expect(document.activeElement).toBe(trigger)
  })

  it('sheet closes on the shared Escape key', async () => {
    show(() =>
      h(Sheet, { id: 'sheet' }, () => [
        h(SheetTrigger, () => 'Open sheet'),
        h(SheetContent, () => h(SheetTitle, () => 'Sheet title')),
      ])
    )
    const trigger = await click('button')
    expect(document.body.textContent).toContain('Sheet title')
    await keydown(document, widgetKeyContract.sheet)
    expect(document.body.textContent).not.toContain('Sheet title')
    expect(document.activeElement).toBe(trigger)
  })

  it('tabs move with the shared ArrowRight key', async () => {
    show(() =>
      h(Tabs, { id: 'tabs', defaultValue: 'account' }, () => [
        h(TabsList, () => [
          h(TabsTrigger, { value: 'account' }, () => 'Account'),
          h(TabsTrigger, { value: 'password' }, () => 'Password'),
        ]),
        h(TabsContent, { value: 'account' }, () => 'Account panel'),
        h(TabsContent, { value: 'password' }, () => 'Password panel'),
      ])
    )
    const trigger = document.querySelector('[data-slot="tabs-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.tabs)
    expect(document.body.textContent).toContain('Password panel')
  })

  it('checkbox toggles with the shared Space key', async () => {
    show(() => h(Checkbox, { id: 'accept', 'aria-label': 'Accept' }))
    const box = document.querySelector('[data-slot="checkbox-root"] input') as HTMLElement
    await keydown(box, widgetKeyContract.checkbox)
    expect(document.querySelector('[data-slot="checkbox"]')?.getAttribute('data-state')).toBe('checked')
  })

  it('disabled checkbox ignores the shared Space key', async () => {
    show(() => h(Checkbox, { id: 'accept', disabled: true, 'aria-label': 'Accept' }))
    const box = document.querySelector('[data-slot="checkbox-root"] input') as HTMLElement
    await keydown(box, widgetKeyContract.checkbox)
    expect(document.querySelector('[data-slot="checkbox"]')?.getAttribute('data-state')).toBe('unchecked')
  })

  it('switch toggles with the shared Space key', async () => {
    show(() => h(Switch, { id: 'alerts', 'aria-label': 'Alerts' }))
    const control = document.querySelector('[data-slot="switch-root"] input') as HTMLElement
    await keydown(control, widgetKeyContract.switch)
    expect(document.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('checked')
  })

  it('disabled switch ignores the shared Space key', async () => {
    show(() => h(Switch, { id: 'alerts', disabled: true, 'aria-label': 'Alerts' }))
    const control = document.querySelector('[data-slot="switch-root"] input') as HTMLElement
    await keydown(control, widgetKeyContract.switch)
    expect(document.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('unchecked')
  })

  it('disabled slider ignores the shared ArrowRight key', async () => {
    show(() => h(Slider, { id: 'volume', disabled: true, defaultValue: [20] }))
    const thumb = document.querySelector('[role="slider"]') as HTMLElement
    expect(thumb).toBeTruthy()
    const before = Number(thumb.getAttribute('aria-valuenow'))
    await keydown(thumb, widgetKeyContract.slider)
    expect(Number(thumb.getAttribute('aria-valuenow'))).toBe(before)
  })

  it('disabled select ignores the shared ArrowDown key', async () => {
    show(() =>
      h(Select, { id: 'fruit', disabled: true }, () => [
        h(SelectTrigger, { 'aria-label': 'Fruit' }, () => 'Choose'),
        h(SelectContent, () => h(SelectItem, { value: 'apple' }, () => 'Apple')),
      ])
    )
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.select)
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
  })

  it('disabled tabs ignore the shared ArrowRight key', async () => {
    show(() =>
      h(Tabs, { id: 'tabs', defaultValue: 'account' }, () => [
        h(TabsList, () => [
          h(TabsTrigger, { value: 'account', disabled: true }, () => 'Account'),
          h(TabsTrigger, { value: 'password', disabled: true }, () => 'Password'),
        ]),
        h(TabsContent, { value: 'account' }, () => 'Account panel'),
        h(TabsContent, { value: 'password' }, () => 'Password panel'),
      ])
    )
    const trigger = document.querySelector('[data-slot="tabs-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.tabs)
    expect(document.body.textContent).not.toContain('Password panel')
  })

  it('disabled accordion ignores the shared ArrowDown key', async () => {
    show(() =>
      h(Accordion, { id: 'sections', disabled: true, type: 'single', defaultValue: ['one'] }, () => [
        h(AccordionItem, { value: 'one' }, () => [
          h(AccordionTrigger, () => 'Section'),
          h(AccordionContent, () => 'Details'),
        ]),
        h(AccordionItem, { value: 'two' }, () => [
          h(AccordionTrigger, () => 'Billing'),
          h(AccordionContent, () => 'Invoice'),
        ]),
      ])
    )
    const triggers = document.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger"]')
    await keydown(triggers[0], widgetKeyContract.accordion)
    expect(document.activeElement).not.toBe(triggers[1])
    expect(triggers[1].getAttribute('aria-expanded')).toBe('false')
  })

  it('slider changes with the shared ArrowRight key', async () => {
    show(() => h(Slider, { id: 'volume', defaultValue: [20] }))
    const thumb = document.querySelector('[role="slider"]') as HTMLElement
    expect(thumb).toBeTruthy()
    const before = Number(thumb.getAttribute('aria-valuenow'))
    await keydown(thumb, widgetKeyContract.slider)
    expect(Number(thumb.getAttribute('aria-valuenow'))).toBeGreaterThan(before)
  })

  it('select opens with the shared ArrowDown key', async () => {
    show(() =>
      h(Select, { id: 'fruit' }, () => [
        h(SelectTrigger, { 'aria-label': 'Fruit' }, () => 'Choose'),
        h(SelectContent, () => h(SelectItem, { value: 'apple' }, () => 'Apple')),
      ])
    )
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.select)
    expect(document.body.textContent).toContain('Apple')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await keydown(document, 'Escape')
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    expect(document.activeElement).toBe(trigger)
  })

  it('menu opens with the shared ArrowDown key', async () => {
    show(() =>
      h(DropdownMenu, { id: 'menu' }, () => [
        h(DropdownMenuTrigger, () => 'Menu'),
        h(DropdownMenuContent, () => h(DropdownMenuItem, () => 'Item')),
      ])
    )
    const trigger = document.querySelector('[data-slot="dropdown-menu-trigger"]') as HTMLElement
    await keydown(trigger, widgetKeyContract.menu)
    expect(document.body.textContent).toContain('Item')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await keydown(document, 'Escape')
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    expect(document.activeElement).toBe(trigger)
  })

  it('accordion moves with the shared ArrowDown key', async () => {
    show(() =>
      h(Accordion, { id: 'sections', type: 'single', defaultValue: ['one'] }, () => [
        h(AccordionItem, { value: 'one' }, () => [
          h(AccordionTrigger, () => 'Section'),
          h(AccordionContent, () => 'Details'),
        ]),
        h(AccordionItem, { value: 'two' }, () => [
          h(AccordionTrigger, () => 'Billing'),
          h(AccordionContent, () => 'Invoice'),
        ]),
      ])
    )
    const triggers = document.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger"]')
    await keydown(triggers[0], widgetKeyContract.accordion)
    expect(document.activeElement).toBe(triggers[1])
  })
})
