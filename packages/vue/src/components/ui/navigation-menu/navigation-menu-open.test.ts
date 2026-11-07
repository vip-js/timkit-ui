import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import NavigationMenu from './navigation-menu.vue'
import NavigationMenuContent from './navigation-menu-content.vue'
import NavigationMenuItem from './navigation-menu-item.vue'
import NavigationMenuList from './navigation-menu-list.vue'
import NavigationMenuTrigger from './navigation-menu-trigger.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue navigation menu open', () => {
  it('follows a later value and ignores a disabled trigger', async () => {
    const value = ref('')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 'products') }, 'Products'),
              h('button', { type: 'button', onClick: () => (value.value = 'docs') }, 'Docs'),
              h(NavigationMenu, { value: value.value }, () =>
                h(NavigationMenuList, () => [
                  h(NavigationMenuItem, { value: 'products' }, () => [
                    h(NavigationMenuTrigger, () => 'Products'),
                    h(NavigationMenuContent, () => 'Product links'),
                  ]),
                  h(NavigationMenuItem, { value: 'docs' }, () => [
                    h(NavigationMenuTrigger, { disabled: true }, () => 'Docs'),
                    h(NavigationMenuContent, () => 'Doc links'),
                  ]),
                ])
              ),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.body.textContent).not.toContain('Product links')
    expect(document.querySelector('[role="status"]')).toBeNull()
    const triggers = document.querySelectorAll('[data-slot="navigation-menu-trigger"]')
    ;(triggers[0] as HTMLButtonElement).click()
    triggers[1]?.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }))
    await nextTick()
    expect(document.body.textContent).not.toContain('Product links')
    expect(document.body.textContent).not.toContain('Doc links')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Products')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.body.textContent).toContain('Product links')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 2')
    press('Docs')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.body.textContent).toContain('Doc links')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 2 of 2')
    expect(document.body.textContent).not.toContain('Product links')
  })

  it('opens a trigger and ignores a disabled trigger', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(NavigationMenu, () =>
          h(NavigationMenuList, () => [
            h(NavigationMenuItem, () => [
              h(NavigationMenuTrigger, () => 'Products'),
              h(NavigationMenuContent, () => 'Product links'),
            ]),
            h(NavigationMenuItem, () => [
              h(NavigationMenuTrigger, { disabled: true }, () => 'Docs'),
              h(NavigationMenuContent, () => 'Doc links'),
            ]),
          ])
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const triggers = document.querySelectorAll('[data-slot="navigation-menu-trigger"]')
    expect(document.querySelector('nav')?.getAttribute('aria-label')).toBe('Navigation')
    ;(triggers[0] as HTMLButtonElement).click()
    await nextTick()
    expect(document.body.textContent).toContain('Product links')
    const panel = document.querySelector('[data-slot="navigation-menu-content"]')
    expect(triggers[0]?.getAttribute('aria-controls')).toBe(panel?.id)
    expect(panel?.getAttribute('role')).toBe('region')
    expect(panel?.getAttribute('aria-labelledby')).toBe(triggers[0]?.id)
    triggers[1]?.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }))
    await nextTick()
    expect(document.body.textContent).not.toContain('Doc links')
  })

  it('ignores opening while the menu is disabled', async () => {
    const seen: Array<string | null> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          NavigationMenu,
          { disabled: true, onValueChange: (value: string | null) => seen.push(value) },
          () =>
            h(NavigationMenuList, () =>
              h(NavigationMenuItem, { value: 'products' }, () => [
                h(NavigationMenuTrigger, () => 'Products'),
                h(NavigationMenuContent, () => 'Product links'),
              ])
            )
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = host.querySelector('[data-slot="navigation-menu-trigger"]') as HTMLButtonElement
    expect(host.querySelector('[data-slot="navigation-menu"]')?.getAttribute('aria-disabled')).toBe('true')
    trigger.click()
    await nextTick()
    expect(host.textContent).not.toContain('Product links')
    expect(trigger.disabled).toBe(true)
    expect(seen).toEqual([])
  })

  it('returns focus to the trigger when Escape is pressed in the content', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(NavigationMenu, () =>
          h(NavigationMenuList, () =>
            h(NavigationMenuItem, () => [
              h(NavigationMenuTrigger, () => 'Products'),
              h(NavigationMenuContent, () => h('button', { type: 'button' }, 'Details')),
            ])
          )
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = host.querySelector('[data-slot="navigation-menu-trigger"]') as HTMLButtonElement
    trigger.click()
    await nextTick()
    const details = [...host.querySelectorAll('button')].find(
      (button) => button.textContent === 'Details'
    ) as HTMLButtonElement
    details.focus()
    details.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(host.textContent).not.toContain('Details')
    expect(document.activeElement).toBe(trigger)
  })

  it('keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(NavigationMenu, { 'aria-label': 'Sections' }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('Sections')
  })
})
