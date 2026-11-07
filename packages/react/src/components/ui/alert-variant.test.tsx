// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Alert, AlertDescription, AlertTitle } from './alert'

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

describe('alert variant', () => {
  it('announces a default alert and a destructive alert', () => {
    show(
      <>
        <Alert>Saved</Alert>
        <Alert variant="destructive">Failed</Alert>
      </>
    )
    const alert = (index: number) => document.querySelectorAll('[data-slot="alert"]')[index] as HTMLElement
    expect(alert(0).getAttribute('role')).toBe('alert')
    expect(alert(0).getAttribute('data-variant')).toBe('default')
    expect(alert(1).getAttribute('role')).toBe('alert')
    expect(alert(0).querySelector('[role="status"]')).toBeNull()
    expect(alert(1).getAttribute('data-variant')).toBe('destructive')
    expect(alert(1).querySelector('[role="status"]')?.textContent).toBe('Destructive')
    expect(alert(1).className).toContain('text-destructive')
  })

  it('keeps the title and description inside the alert', () => {
    show(
      <Alert>
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>The file was stored.</AlertDescription>
      </Alert>
    )
    const alert = document.querySelector('[role="alert"]')
    const title = alert?.querySelector('[data-slot="alert-title"]')
    const description = alert?.querySelector('[data-slot="alert-description"]')
    expect(title?.tagName).toBe('H5')
    expect(title?.textContent).toBe('Saved')
    expect(description?.textContent).toBe('The file was stored.')
  })
})
