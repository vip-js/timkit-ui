import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Breadcrumb from './breadcrumb.vue'
import BreadcrumbLink from './breadcrumb-link.vue'
import BreadcrumbPage from './breadcrumb-page.vue'
import BreadcrumbSeparator from './breadcrumb-separator.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue breadcrumb current page', () => {
  it('follows an ancestor link and ignores the current page and a disabled crumb', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Breadcrumb, () => [
          h(BreadcrumbLink, { href: '/home', onClick: () => seen.push('home') }, () => 'Home'),
          h(BreadcrumbLink, { href: '/locked', disabled: true, onClick: () => seen.push('locked') }, () => 'Locked'),
          h(BreadcrumbPage, () => 'Current'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const links = document.querySelectorAll('[data-slot="breadcrumb-link"]')
    const page = document.querySelector('[data-slot="breadcrumb-page"]') as HTMLElement
    ;(links[0] as HTMLAnchorElement).click()
    ;(links[1] as HTMLAnchorElement).click()
    page.click()
    await nextTick()
    expect(seen).toEqual(['home'])
    expect((links[1] as HTMLAnchorElement).getAttribute('aria-disabled')).toBe('true')
    expect((links[1] as HTMLAnchorElement).hasAttribute('href')).toBe(false)
    expect(page.getAttribute('aria-current')).toBe('page')
    expect(page.getAttribute('aria-disabled')).toBe('true')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Crumb 3 of 3')
  })

  it('uses the separator text when one is passed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Breadcrumb, { separator: '/' }, () => h(BreadcrumbSeparator)),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="breadcrumb-separator"]')?.textContent).toBe('/')
    expect(document.querySelector('[data-slot="breadcrumb"]')?.getAttribute('separator')).toBeNull()
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('uses / when no separator is passed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Breadcrumb, () => h(BreadcrumbSeparator)),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="breadcrumb-separator"]')?.textContent).toBe('/')
  })

  it('ignores every crumb while the trail is disabled', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Breadcrumb, { disabled: true }, () =>
          h(BreadcrumbLink, { href: '/home', onClick: () => seen.push('home') }, () => 'Home')
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const link = document.querySelector('[data-slot="breadcrumb-link"]') as HTMLAnchorElement
    link.click()
    await nextTick()
    expect(document.querySelector('[data-slot="breadcrumb"]')?.getAttribute('aria-disabled')).toBe('true')
    expect(link.getAttribute('aria-disabled')).toBe('true')
    expect(link.hasAttribute('href')).toBe(false)
    expect(seen).toEqual([])
  })

  it('names an omitted trail breadcrumb and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Breadcrumb), h(Breadcrumb, { 'aria-label': 'Trail' })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const labels = [...host.querySelectorAll('nav')].map((node) => node.getAttribute('aria-label'))
    expect(labels).toEqual(['breadcrumb', 'Trail'])
  })
})
