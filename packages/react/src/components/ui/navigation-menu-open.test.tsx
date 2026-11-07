// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'

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

describe('navigation menu open', () => {
  it('follows a later value and ignores a disabled trigger', async () => {
    function Harness() {
      const [value, setValue] = useState('')
      return (
        <>
          <button type="button" onClick={() => setValue('products')}>
            Products
          </button>
          <button type="button" onClick={() => setValue('docs')}>
            Docs
          </button>
          <NavigationMenu value={value}>
            <NavigationMenuList>
              <NavigationMenuItem value="products">
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>Product links</NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="docs">
                <NavigationMenuTrigger disabled>Docs</NavigationMenuTrigger>
                <NavigationMenuContent>Doc links</NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </>
      )
    }
    show(<Harness />)
    expect(document.body.textContent).not.toContain('Product links')
    expect(document.querySelector('[role="status"]')).toBeNull()
    const triggers = document.querySelectorAll('[data-slot="navigation-menu-trigger"]')
    await act(async () => {
      ;(triggers[0] as HTMLButtonElement).click()
      triggers[1]?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
    })
    expect(document.body.textContent).not.toContain('Product links')
    expect(document.body.textContent).not.toContain('Doc links')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('Products')?.click()
    })
    expect(document.body.textContent).toContain('Product links')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 2')
    await act(async () => {
      press('Docs')?.click()
    })
    expect(document.body.textContent).toContain('Doc links')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 2 of 2')
    expect(document.body.textContent).not.toContain('Product links')
  })

  it('opens a trigger and ignores a disabled trigger', async () => {
    show(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>Product links</NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger disabled>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>Doc links</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    const triggers = document.querySelectorAll('[data-slot="navigation-menu-trigger"]')
    expect(document.querySelector('nav')?.getAttribute('aria-label')).toBe('Navigation')
    await act(async () => {
      ;(triggers[0] as HTMLButtonElement).click()
    })
    expect(document.body.textContent).toContain('Product links')
    const panel = document.querySelector('[data-slot="navigation-menu-content"]')
    expect(triggers[0]?.getAttribute('aria-controls')).toBe(panel?.id)
    expect(panel?.getAttribute('role')).toBe('region')
    expect(panel?.getAttribute('aria-labelledby')).toBe(triggers[0]?.id)
    await act(async () => {
      triggers[1]?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
    })
    expect(document.body.textContent).not.toContain('Doc links')
  })

  it('ignores opening while the menu is disabled', async () => {
    const seen: Array<string | null> = []
    show(
      <NavigationMenu disabled onValueChange={(value) => seen.push(value)}>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>Product links</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    const trigger = document.querySelector('[data-slot="navigation-menu-trigger"]') as HTMLButtonElement
    expect(document.querySelector('[data-slot="navigation-menu"]')?.getAttribute('aria-disabled')).toBe('true')
    await act(async () => {
      trigger.click()
    })
    expect(document.body.textContent).not.toContain('Product links')
    expect(trigger.disabled).toBe(true)
    expect(seen).toEqual([])
  })

  it('returns focus to the trigger when Escape is pressed in the content', async () => {
    show(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <button type="button">Details</button>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    const trigger = document.querySelector('[data-slot="navigation-menu-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    const details = [...document.querySelectorAll('button')].find(
      (button) => button.textContent === 'Details'
    ) as HTMLButtonElement
    details.focus()
    await act(async () => {
      details.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(document.activeElement).toBe(trigger)
  })

  it('keeps a passed name', () => {
    show(<NavigationMenu aria-label="Sections" />)
    expect(document.querySelector('nav')?.getAttribute('aria-label')).toBe('Sections')
  })
})
