// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Breadcrumb, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb'

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

describe('breadcrumb current page', () => {
  it('follows an ancestor link and ignores the current page and a disabled crumb', () => {
    const seen: string[] = []
    show(
      <Breadcrumb>
        <BreadcrumbLink href="/home" onClick={() => seen.push('home')}>
          Home
        </BreadcrumbLink>
        <BreadcrumbLink href="/locked" disabled onClick={() => seen.push('locked')}>
          Locked
        </BreadcrumbLink>
        <BreadcrumbPage>Current</BreadcrumbPage>
      </Breadcrumb>
    )
    const links = document.querySelectorAll('[data-slot="breadcrumb-link"]')
    const page = document.querySelector('[data-slot="breadcrumb-page"]') as HTMLElement
    act(() => {
      ;(links[0] as HTMLAnchorElement).click()
      ;(links[1] as HTMLAnchorElement).click()
      page.click()
    })
    expect(seen).toEqual(['home'])
    expect((links[1] as HTMLAnchorElement).getAttribute('aria-disabled')).toBe('true')
    expect((links[1] as HTMLAnchorElement).hasAttribute('href')).toBe(false)
    expect(page.getAttribute('aria-current')).toBe('page')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Crumb 3 of 3')
    expect(page.getAttribute('aria-disabled')).toBe('true')
  })

  it('uses the separator text when one is passed', () => {
    show(
      <Breadcrumb separator="/">
        <BreadcrumbSeparator />
      </Breadcrumb>
    )
    expect(document.querySelector('[data-slot="breadcrumb-separator"]')?.textContent).toBe('/')
    expect(document.querySelector('[data-slot="breadcrumb"]')?.getAttribute('separator')).toBeNull()
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('uses / when no separator is passed', () => {
    show(
      <Breadcrumb>
        <BreadcrumbSeparator />
      </Breadcrumb>
    )
    expect(document.querySelector('[data-slot="breadcrumb-separator"]')?.textContent).toBe('/')
  })

  it('ignores every crumb while the trail is disabled', () => {
    const seen: string[] = []
    show(
      <Breadcrumb disabled>
        <BreadcrumbLink href="/home" onClick={() => seen.push('home')}>
          Home
        </BreadcrumbLink>
      </Breadcrumb>
    )
    const link = document.querySelector('[data-slot="breadcrumb-link"]') as HTMLAnchorElement
    act(() => {
      link.click()
    })
    expect(document.querySelector('[data-slot="breadcrumb"]')?.getAttribute('aria-disabled')).toBe('true')
    expect(link.getAttribute('aria-disabled')).toBe('true')
    expect(link.hasAttribute('href')).toBe(false)
    expect(seen).toEqual([])
  })

  it('names an omitted trail breadcrumb and keeps a passed name', () => {
    show(
      <>
        <Breadcrumb />
        <Breadcrumb aria-label="Trail" />
      </>
    )
    const labels = [...document.querySelectorAll('nav')].map((node) => node.getAttribute('aria-label'))
    expect(labels).toEqual(['breadcrumb', 'Trail'])
  })
})
